import { SkillRoadmap } from './types';

export const systemDesignRoadmap: SkillRoadmap = {
    skillId: 'system-design',
    skillName: 'System Architecture & Scalable Design',
    category: 'ARCHITECTURE',
    tagline: 'High availability, cache-aside topologies, distributed locks, rate limiters, circuit breakers, and event streaming.',
    accentColor: '#6366f1',
    officialDocs: [
        {
            title: 'Roadmap.sh Software Architecture & System Design',
            url: 'https://roadmap.sh/software-architect',
            description: 'The global community roadmap for scalable backend, microservices, and distributed architecture.',
            badge: 'Interactive Roadmap'
        },
        {
            title: 'The System Design Primer (GitHub)',
            url: 'https://github.com/donnemartin/system-design-primer',
            description: 'The premier open-source repository for learning how to design large-scale, high-availability distributed systems.',
            badge: 'Open-Source Playbook'
        },
        {
            title: 'ByteByteGo Architecture System Design',
            url: 'https://bytebytego.com/',
            description: 'Visual system design deep dives by Alex Xu (author of System Design Interview).',
            badge: 'Visual Deep Dives'
        }
    ],
    checkpoints: [
        {
            id: 'sys-1',
            title: 'Cache-Aside Topology & Cache Stampede Prevention',
            estMinutes: 5,
            concept: {
                summary: 'In the Cache-Aside (Lazy Loading) pattern, the application checks an in-memory cache (Redis) first. On a cache hit, data returns in sub-millisecond time. On a cache miss, the app queries the database, writes the result to cache with a TTL (Time-To-Live), and returns. To prevent a "Cache Stampede" (where thousands of concurrent requests hit the database when a popular key expires), systems use distributed mutex locks or probabilistic early expiration (XFetch).',
                analogy: 'A restaurant quick-grab counter: the most popular printed menus are placed on the front counter (Redis). If an unusual dessert menu is requested, the waiter walks to the back filing room (DB) to fetch it and leaves a copy on the front counter for the next customer.',
                seniorInsight: 'Always add randomized TTL jitter (e.g. 5 minutes ± 30 seconds) on cache keys. If 10,000 product keys are seeded into Redis with the exact same 1-hour expiration, they will all expire at the exact same second, causing a thundering herd that crashes the primary database.'
            },
            trap: {
                title: 'Setting identical expiration times on bulk-cached items, causing thundering herds',
                juniorCode: `// ❌ JUNIOR: 10,000 products expire at the exact same millisecond; database crashes!
for (const product of products) {
    await redis.set(\`product:\${product.id}\`, JSON.stringify(product), 'EX', 3600);
}`,
                seniorCode: `// ✅ SENIOR: Cache-aside with randomized TTL jitter and mutex locking for hot keys
async function getProduct(productId: string) {
    const cacheKey = \`product:\${productId}\`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Randomized jitter: 3600s + (random 0 to 300s)
    const jitter = Math.floor(Math.random() * 300);
    const ttl = 3600 + jitter;

    // Fetch from database:
    const product = await db.product.findUnique({ where: { id: productId } });
    if (product) {
        await redis.set(cacheKey, JSON.stringify(product), 'EX', ttl);
    }
    return product;
}`,
                explanation: 'Randomized jitter staggers cache key expirations across time, smoothing database read traffic into a flat, predictable baseline.'
            },
            drill: {
                question: 'What is the fundamental difference between Cache-Aside and Write-Through caching?',
                hint: 'Who is responsible for updating the cache when data is modified in the database?',
                solution: `- In Cache-Aside: The application code is responsible for writing data to the cache on a read miss and invalidating/updating the cache on writes.
- In Write-Through: The application writes data ONLY to the cache; the cache itself immediately writes the data through to the database synchronously before returning success.`,
                explanation: 'Cache-Aside lazy-loads only accessed data, whereas Write-Through keeps cache and database always in sync at the cost of higher write latency.'
            },
            docLink: {
                title: 'AWS Architecture: Caching Strategies',
                url: 'https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html',
                description: 'Deep dive on cache-aside, write-through, and cache stampede mitigation.'
            }
        },
        {
            id: 'sys-2',
            title: 'Distributed Locks with Redis & The Redlock Algorithm',
            estMinutes: 5,
            concept: {
                summary: 'In a multi-instance microservices architecture, standard JavaScript in-memory locks or mutexes only protect a single Node process. When multiple independent server containers must execute a critical operation exclusively (e.g. processing a scheduled payroll batch or capturing a payment), they acquire a Distributed Lock in Redis using atomic `SET key uuid NX PX lease_time`.',
                analogy: 'A single physical conference room key stored at a hotel reception desk: whichever guest grabs the key from the desk first gets to use the room; everyone else must wait until the key is returned.',
                seniorInsight: 'Always assign a unique UUID as the lock value. When releasing the lock, use a Lua script to check if the value still matches your UUID before deleting. This prevents Process A from accidentally deleting the lock if Process A was paused by a Garbage Collection pause and the lock expired and was acquired by Process B.'
            },
            trap: {
                title: 'Releasing a distributed lock with a simple redis.del(key) without ownership verification',
                juniorCode: `// ❌ JUNIOR: If operation took longer than TTL, redis.del() deletes Process B's lock!
await redis.set('lock:cron', 'locked', 'NX', 'PX', 10000);
await runLongReport(); // Took 12 seconds! Lock expired at 10s and Process B acquired it.
await redis.del('lock:cron'); // Deletes Process B's active lock, causing duplicate execution!`,
                seniorCode: `// ✅ SENIOR: Atomic lock release using a Lua script to verify lock ownership UUID
import { randomUUID } from 'node:crypto';

async function withDistributedLock(lockKey: string, ttlMs: number, fn: () => Promise<void>) {
    const lockId = randomUUID();
    // Acquire lock atomically only if Not eXists (NX) with milliseconds TTL (PX):
    const acquired = await redis.set(lockKey, lockId, 'NX', 'PX', ttlMs);
    if (!acquired) {
        throw new Error('Could not acquire distributed lock; operation in progress');
    }

    try {
        await fn();
    } finally {
        // Lua script guarantees atomic comparison and deletion:
        const releaseScript = \`
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        \`;
        await redis.eval(releaseScript, 1, lockKey, lockId);
    }
}`,
                explanation: 'The atomic Lua script ensures you only delete the lock if the value still belongs to your specific process execution instance.'
            },
            drill: {
                question: 'What is the Redlock algorithm, and why was it designed beyond single-instance Redis locking?',
                hint: 'What happens if a single Redis master node crashes right after granting a lock before replicating it?',
                solution: `Redlock is a distributed locking algorithm designed for multi-node Redis clusters (typically 5 independent Redis master instances).
To acquire a lock, a client attempts to acquire the lock across all 5 instances sequentially with a small timeout. If it successfully acquires the lock in a majority (at least 3 of 5) within the validity time, the lock is granted. This survives single-node Redis crashes without split-brain locks.`,
                explanation: 'Redlock guarantees safety across independent Redis cluster nodes.'
            },
            docLink: {
                title: 'Redis Documentation: Distributed Locks',
                url: 'https://redis.io/docs/latest/develop/use/patterns/distributed-locks/',
                description: 'Implementing fault-tolerant distributed locks with Redis and Redlock.'
            }
        },
        {
            id: 'sys-3',
            title: 'Rate Limiting Algorithms: Token Bucket vs Sliding Window',
            estMinutes: 5,
            concept: {
                summary: 'Rate limiters protect API gateways from scraping, brute-force attacks, and denial of service. The four industry-standard algorithms are: 1) Fixed Window (brittle, allows 2x burst at boundaries), 2) Leaky Bucket (smooths traffic to a constant rate), 3) Token Bucket (permits short bursts while enforcing long-term limits), and 4) Sliding Window Counter (accurate, low memory).',
                analogy: 'Token Bucket is an arcade ticket dispenser: the machine drops 5 new game tokens every minute up to a maximum bucket of 20; you can spend all 20 tokens in a fast burst, but once empty, you must wait for new tokens to drip in.',
                seniorInsight: 'Use Sliding Window Counter in Redis (implemented via sorted sets `ZADD/ZREMRANGEBYSCORE`). It stores timestamps of recent requests, providing exact window precision without allowing double-limit burst exploits at fixed hour boundaries.'
            },
            trap: {
                title: 'Using fixed-window counters that allow double the rate limit across minute boundaries',
                juniorCode: `// ❌ JUNIOR: Fixed window resets at :00; allows 100 requests at 0:59 and 100 at 1:00 (200 req in 2 seconds!)
const currentMinute = Math.floor(Date.now() / 60000);
const count = await redis.incr(\`ratelimit:\${ip}:\${currentMinute}\`);
if (count > 100) throw new Error('Rate limit exceeded');`,
                seniorCode: `// ✅ SENIOR: Sliding Window Log via Redis Sorted Sets (ZSET)
async function isRateLimited(key: string, limit: number, windowSec: number): Promise<boolean> {
    const now = Date.now();
    const clearBefore = now - (windowSec * 1000);
    const zKey = \`ratelimit:zset:\${key}\`;

    const multi = redis.multi();
    // 1. Remove timestamps outside the sliding window:
    multi.zremrangebyscore(zKey, 0, clearBefore);
    // 2. Add current request timestamp:
    multi.zadd(zKey, now, \`\${now}-\${Math.random()}\`);
    // 3. Count requests remaining in current sliding window:
    multi.zcard(zKey);
    // 4. Set TTL on the set to auto-cleanup:
    multi.expire(zKey, windowSec);

    const results = await multi.exec();
    const requestCount = results?.[2][1] as number;

    return requestCount > limit;
}`,
                explanation: 'The sliding window log accounts for exact rolling time intervals, completely preventing the boundary-jumping burst exploit of fixed windows.'
            },
            drill: {
                question: 'Which rate limiting algorithm is ideal for systems that must process downstream tasks at a strictly constant, smoothed pace without ANY burst tolerance?',
                hint: 'Think of water dripping at a constant rate from a funnel.',
                solution: `The Leaky Bucket algorithm.
In Leaky Bucket, requests enter a FIFO queue of fixed capacity and are processed at a strictly constant, uniform output rate (e.g. 10 requests per second). Any overflow beyond the queue capacity drops immediately.`,
                explanation: 'Leaky Bucket smooths out spikes into steady, predictable throughput.'
            },
            docLink: {
                title: 'Cloudflare: Rate Limiting Algorithms',
                url: 'https://www.cloudflare.com/learning/bots/what-is-rate-limiting/',
                description: 'Comparing token bucket, leaky bucket, and sliding window implementations.'
            }
        },
        {
            id: 'sys-4',
            title: 'The Circuit Breaker Pattern & Cascading Failure Prevention',
            estMinutes: 5,
            concept: {
                summary: 'In a microservices architecture, when a downstream third-party service (e.g. payment gateway or recommendation engine) becomes slow or unresponsive, upstream services keep sending requests, exhausting connection pools and crashing the entire platform. A Circuit Breaker monitors failure rates across three states: Closed (healthy), Open (failing fast without calling downstream), and Half-Open (testing recovery).',
                analogy: 'An electrical circuit breaker in your home panel: if a short-circuit occurs in the basement wiring, the breaker trips to cut the current instantly, preventing the entire house from catching fire.',
                seniorInsight: 'Always define a fallback response when a circuit breaker trips Open (e.g. returning cached product recommendations or queuing background payments). Failing fast in 1ms with a degraded fallback is infinitely better than hanging for 30s and taking down the API gateway.'
            },
            trap: {
                title: 'Letting failed downstream API calls hang with long timeouts, causing thread exhaustion',
                juniorCode: `// ❌ JUNIOR: 30-second timeout on a failing third-party API exhausts server thread pool!
app.get('/checkout', async (req, res) => {
    // If Stripe is experiencing an outage, 500 concurrent users will lock 500 connections for 30 seconds!
    const payment = await fetch('https://api.stripe.com/charge', { timeout: 30000 });
});`,
                seniorCode: `// ✅ SENIOR: Circuit Breaker implementation with opossum / cockatiel
import CircuitBreaker from 'opossum';

const breakerOptions = {
    timeout: 3000, // If call takes longer than 3s, consider it a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip breaker OPEN
    resetTimeout: 10000 // After 10s, transition to HALF-OPEN to test recovery
};

const breaker = new CircuitBreaker(callPaymentService, breakerOptions);

// Define graceful fallback when breaker is tripped OPEN:
breaker.fallback(() => ({
    status: 'QUEUED',
    message: 'Payment received; queued for asynchronous background processing'
}));

export async function processPayment(data: any) {
    return await breaker.fire(data);
}`,
                explanation: 'When the breaker trips OPEN, subsequent requests fail fast in under 1ms without calling the failing downstream service, protecting upstream resources.'
            },
            drill: {
                question: 'What happens during the "Half-Open" state in a circuit breaker lifecycle?',
                hint: 'How does the breaker decide whether to close or reopen?',
                solution: `In the Half-Open state, the circuit breaker allows a limited number of trial requests through to the downstream service.
- If the trial requests succeed, the breaker assumes the downstream service has recovered and resets to CLOSED (normal operation).
- If any trial request fails, the breaker immediately trips back to OPEN for another cooldown period.`,
                explanation: 'Half-Open acts as a cautious probe before resuming full traffic.'
            },
            docLink: {
                title: 'Martin Fowler: CircuitBreaker Architecture',
                url: 'https://martinfowler.com/bliki/CircuitBreaker.html',
                description: 'The canonical software design reference for the Circuit Breaker pattern.'
            }
        },
        {
            id: 'sys-5',
            title: 'Event-Driven Architecture: Message Queues vs Event Streams',
            estMinutes: 5,
            concept: {
                summary: 'Synchronous REST calls between microservices create tight coupling and cascading outages. Event-Driven Architecture decouples services using Message Queues (RabbitMQ, SQS, BullMQ) for point-to-point task execution where messages are deleted once acknowledged, or Distributed Event Logs (Apache Kafka, AWS Kinesis) for high-throughput, ordered, replayable event streaming across multiple consumer groups.',
                analogy: 'A Message Queue is a physical to-do task sticky note on a whiteboard: one developer takes the sticky note down, completes the task, and shreds the note. An Event Stream is a permanent newspaper publishing company: anyone can subscribe and read back issues from any date in history.',
                seniorInsight: 'Use Message Queues (BullMQ/RabbitMQ) for background jobs like sending transactional emails or transcoding video files. Use Event Streaming (Kafka) when multiple independent microservices must react to the same business event (e.g. "OrderPlaced" consumed by Inventory, Billing, Analytics, and Notifications).'
            },
            trap: {
                title: 'Using synchronous HTTP calls for non-critical secondary side-effects in request handlers',
                juniorCode: `// ❌ JUNIOR: Synchronous chaining; if email or analytics fails, the user registration fails!
app.post('/register', async (req, res) => {
    const user = await db.user.create(req.body);
    await sendWelcomeEmail(user); // If SMTP server is slow, user waits 4 seconds!
    await sendAnalyticsEvent(user); // If analytics service times out, registration crashes!
    res.json(user);
});`,
                seniorCode: `// ✅ SENIOR: Publishes domain event to background queue and returns immediately
import { Queue } from 'bullmq';

const eventQueue = new Queue('domain-events', { connection: redisConnection });

app.post('/register', async (req, res) => {
    const user = await db.user.create(req.body);

    // Publish event asynchronously; handler returns in <20ms:
    await eventQueue.add('UserRegistered', {
        userId: user.id,
        email: user.email,
        timestamp: new Date()
    }, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 }
    });

    res.status(201).json(user);
});`,
                explanation: 'Decoupling side-effects with message queues ensures core HTTP request handlers remain ultra-fast and resilient to third-party outages.'
            },
            drill: {
                question: 'What is a "Dead Letter Queue" (DLQ) in message queuing systems, and why is it essential for system reliability?',
                hint: 'What happens when a poison pill message repeatedly crashes the worker thread?',
                solution: `A Dead Letter Queue (DLQ) is a secondary queue where messages are automatically routed after failing processing a configured maximum number of retry attempts.
It isolates "poison pill" messages (e.g. malformed JSON or invalid customer IDs) so they do not block normal queue processing, allowing engineers to inspect and debug the failures manually.`,
                explanation: 'DLQs prevent malformed messages from endlessly crashing worker processes in infinite loops.'
            },
            docLink: {
                title: 'AWS: Message Queues vs Event Streams',
                url: 'https://aws.amazon.com/compare/the-difference-between-message-queues-and-event-streams/',
                description: 'Comparing point-to-point queues and event streaming architectures.'
            }
        },
        {
            id: 'sys-6',
            title: 'CAP Theorem & PACELC Trade-Offs in Distributed Storage',
            estMinutes: 5,
            concept: {
                summary: 'The CAP Theorem proves that in any distributed data store experiencing a Network Partition (P), you must choose between Consistency (C - every read receives the most recent write or an error) and Availability (A - every non-failing node returns a response, but it may be stale). The PACELC theorem extends this: If there is a Partition (P), trade Consistency (C) vs Availability (A); Else (E), trade Latency (L) vs Consistency (C).',
                analogy: 'Cell phone service during a hurricane: if the cell tower loses communication with headquarters (Partition), the phone can either reject your banking transaction (Consistency) or record it offline with a risk of overdraft (Availability).',
                seniorInsight: 'No system can avoid network partitions in cloud environments. Therefore, you do not choose between "Consistency vs Availability" generally; you choose how your system behaves WHEN network partitions inevitably happen (CP like PostgreSQL/HBase vs AP like Cassandra/DynamoDB).'
            },
            trap: {
                title: 'Assuming a distributed database can guarantee 100% immediate consistency AND 100% availability during network splits',
                juniorCode: `// ❌ JUNIOR: "We will build a global multi-region database with zero latency and 100% ACID consistency everywhere!"
// Violates the laws of physics and network partition realities!`,
                seniorCode: `// ✅ SENIOR: Pragmatic PACELC modeling: CP for money, AP for social feeds
// 1. Financial ledger: Strict CP (Consistency over Availability)
// During a partition, reject write if quorum cannot be reached to prevent double-spending:
const writeConcern = { w: 'majority', wtimeoutMS: 3000 };

// 2. Social media likes/views: AP / Eventual Consistency
// Deliver instant write response locally; reconcile asynchronously via CRDTs or gossip protocols.`,
                explanation: 'Senior architects align database consistency models with business domains: strict linearizable consistency for ledger balances; eventual consistency for social metrics.'
            },
            drill: {
                question: 'Under the PACELC theorem, what does a database like MongoDB or DynamoDB prioritize during normal, non-partitioned operation (the "Else" state)?',
                hint: 'In PACELC, what do L and C stand for?',
                solution: `Under PACELC:
During normal operation (Else), databases trade off Latency (L) vs Consistency (C).
- DynamoDB defaults to PA/EL (Low Latency by reading from a single replica).
- Strict ACID systems prioritize PC/EC (Consistency by waiting for replica acknowledgments even when the network is healthy).`,
                explanation: 'PACELC captures latency trade-offs that occur during normal, healthy operations.'
            },
            docLink: {
                title: 'PACELC Theorem Overview',
                url: 'https://en.wikipedia.org/wiki/PACELC_theorem',
                description: 'Understanding partition and normal-state latency trade-offs in distributed data systems.'
            }
        },
        {
            id: 'sys-7',
            title: 'Database Read Replicas & CQRS (Command Query Responsibility Segregation)',
            estMinutes: 5,
            concept: {
                summary: 'Most web applications are 90% read-heavy and 10% write-heavy. To scale beyond a single database server, write operations (mutations) route to a Primary database, while read operations distribute across multiple asynchronous Read Replicas. CQRS formalizes this by separating the write domain model from the read query model.',
                analogy: 'A major newsroom: the chief editor sits at the primary desk writing and approving the master headline story; millions of newspaper copies (read replicas) are printed and distributed across city newsstands for readers.',
                seniorInsight: 'Beware of Replication Lag. If a user updates their profile and the app immediately redirects to their profile page, querying a read replica may return stale data before the replica has synchronized ("Read-Your-Own-Writes" anomaly). Route immediate post-write reads to the Primary or set a session stickiness flag.'
            },
            trap: {
                title: 'User updates profile, redirects, and sees their old profile data due to replica lag',
                juniorCode: `// ❌ JUNIOR: Writes to Primary, immediately reads from lagging Replica!
await primaryDb.user.update({ where: { id }, data: { name: 'Alice' } });
// Query sent to read replica before replication stream catches up:
const user = await readReplicaDb.user.findUnique({ where: { id } });
// user.name is still 'Bob'! User panics and submits the update form again.`,
                seniorCode: `// ✅ SENIOR: Read-Your-Own-Writes guarantee via Primary pin or session timestamp
export async function getProfile(userId: string, recentlyUpdated: boolean) {
    // If user made a write within the last 5 seconds, read from Primary:
    if (recentlyUpdated) {
        return await primaryDb.user.findUnique({ where: { id: userId } });
    }
    // Otherwise, leverage load-balanced read replicas:
    return await readReplicaPool.user.findUnique({ where: { id: userId } });
}`,
                explanation: 'Providing a Read-Your-Own-Writes guarantee prevents UI inconsistencies caused by replication lag without sacrificing the scaling power of read replicas.'
            },
            drill: {
                question: 'What is CQRS (Command Query Responsibility Segregation), and how does it optimize database performance?',
                hint: 'How are mutations (Commands) decoupled from reads (Queries)?',
                solution: `CQRS separates the system into two distinct models:
1. Command Model: Handles writes, business logic validation, and data mutations (often normalized for ACID integrity).
2. Query Model: Handles reads, using pre-computed, denormalized read views or search indexes (like Elasticsearch) optimized purely for fast retrieval.`,
                explanation: 'CQRS allows scaling read and write architectures independently to match traffic asymmetry.'
            },
            docLink: {
                title: 'Microsoft Azure Architecture: CQRS Pattern',
                url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs',
                description: 'Segregating operations that read data from operations that update data.'
            }
        },
        {
            id: 'sys-8',
            title: 'Content Delivery Networks (CDNs) & Edge Caching',
            estMinutes: 5,
            concept: {
                summary: 'Content Delivery Networks (Cloudflare, AWS CloudFront, Fastly) deploy hundreds of edge point-of-presence (PoP) servers worldwide. Static assets (images, CSS, JS bundles) and cached HTTP responses are served from the PoP closest to the user geographic location, slashing round-trip time (RTT) from 300ms across oceans to under 15ms locally.',
                analogy: 'Local retail distribution warehouses: instead of having every customer order shipped directly from a single factory in Tokyo, local distribution centers in London, New York, and Sydney store identical inventory for instant delivery.',
                seniorInsight: 'Master the `Cache-Control: public, max-age=31536000, immutable` header for content-hashed assets (e.g. `bundle.a8f9c1.js`). For dynamic HTML or API routes, use `s-maxage=60, stale-while-revalidate=86400` to serve cached edge content instantly while fetching fresh data in the background.'
            },
            trap: {
                title: 'Serving unversioned assets with long cache times, preventing users from seeing updates',
                juniorCode: `// ❌ JUNIOR: Caches main.js for 1 year without content-hashing; deploys cannot be seen by users!
Cache-Control: public, max-age=31536000
// File named 'main.js'. When you deploy bug fixes, browsers use the cached broken version for months!`,
                seniorCode: `// ✅ SENIOR: Immutable content-hashed assets + stale-while-revalidate for APIs
// 1. Static hashed assets (Vite/Next.js output: app-9f8a2b.js):
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

// 2. Dynamic API data (Product list):
res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=3600');
// Edge CDN serves cached response for 60s. For the next hour, it returns stale instantly while refetching origin!`,
                explanation: 'stale-while-revalidate provides zero-latency edge delivery while guaranteeing background cache synchronization with origin servers.'
            },
            drill: {
                question: 'What is the purpose of the "s-maxage" directive in the HTTP Cache-Control header compared to standard "max-age"?',
                hint: 'Which one targets public shared proxy caches (CDNs) vs private browser caches?',
                solution: `"max-age" specifies the cache duration for the end-user's private browser cache.
"s-maxage" (shared max-age) overrides max-age specifically for public shared caches (like CDNs and reverse proxies), allowing you to cache data on Cloudflare for 10 minutes while instructing the user's browser not to cache it locally.`,
                explanation: 's-maxage provides precise cache control over CDN edge nodes.'
            },
            docLink: {
                title: 'MDN Web Docs: Cache-Control',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control',
                description: 'Authoritative guide to HTTP caching directives and edge CDN validation.'
            }
        },
        {
            id: 'sys-9',
            title: 'API Gateway Architecture, Load Balancers & Proxies',
            estMinutes: 5,
            concept: {
                summary: 'The API Gateway acts as the single reverse proxy entry point for all incoming client traffic. It handles SSL termination, CORS, central JWT authentication, rate limiting, and request routing to internal microservices. Load Balancers operate at Layer 4 (Transport/TCP) or Layer 7 (Application/HTTP) distributing traffic via algorithms like Round Robin, Least Connections, or Consistent IP Hash.',
                analogy: 'An international airport reception hub: foreign passengers clear customs, visa security, and ticket validation at the central terminal gates before catching regional monorails to individual concourses.',
                seniorInsight: 'Use Layer 7 Load Balancing when routing requests based on HTTP paths (e.g. `/api/v1/billing` routed to Billing Service, `/api/v1/auth` routed to Auth Service). Use Layer 4 when ultra-high packet throughput and raw TCP/TLS performance are paramount.'
            },
            trap: {
                title: 'Having every microservice implement duplicate authentication, rate limiting, and CORS headers',
                juniorCode: `// ❌ JUNIOR: 20 microservices each implement duplicate JWT validation, CORS, and SSL logic
// If JWT algorithm changes from RS256 to EdDSA, all 20 repositories must be edited and redeployed!`,
                seniorCode: `// ✅ SENIOR: Centralized API Gateway handles cross-cutting concerns
// 1. API Gateway validates JWT, handles CORS, and terminates SSL.
// 2. Injects verified user context into trusted internal headers before forwarding:
headers.set('X-User-Id', verifiedToken.sub);
headers.set('X-User-Role', verifiedToken.role);
headers.set('X-Tenant-Id', verifiedToken.tenantId);

// 3. Downstream services trust internal network gateway and focus purely on business logic.`,
                explanation: 'An API Gateway centralizes security, authentication, and telemetry, eliminating duplicated boilerplate across microservices.'
            },
            drill: {
                question: 'What is the primary difference between a Layer 4 (L4) and a Layer 7 (L7) load balancer?',
                hint: 'Which OSI layer inspects HTTP cookies, headers, and URL paths?',
                solution: `- Layer 4 (Transport): Routes packets based on IP addresses and TCP/UDP ports without inspecting packet contents. It is extremely fast and uses minimal CPU.
- Layer 7 (Application): Inspects the HTTP payload, headers, cookies, and URL paths, allowing intelligent routing (e.g. routing /images to S3 and /checkout to a Node service).`,
                explanation: 'L7 allows application-aware routing at the cost of higher CPU overhead for TLS termination and packet parsing.'
            },
            docLink: {
                title: 'NGINX: What is an API Gateway?',
                url: 'https://www.nginx.com/resources/glossary/api-gateway/',
                description: 'Comparing API Gateways, reverse proxies, and Layer 4 vs Layer 7 load balancers.'
            }
        },
        {
            id: 'sys-10',
            title: 'Consistent Hashing & Distributed Data Partitioning',
            estMinutes: 5,
            concept: {
                summary: 'In distributed caching and sharding, mapping keys to servers using traditional modulus arithmetic (`hash(key) % N`) is disastrous: adding or removing a single server invalidates almost 100% of all keys, causing total cache failure. Consistent Hashing maps both servers and keys onto a circular hash ring (0 to 2^32-1), ensuring that adding a server only migrates `K/N` keys.',
                analogy: 'A circular roulette wheel: numbers and players are positioned around the rim; when a player leaves the table, only their immediate neighbor chips are collected, leaving the rest of the table unaffected.',
                seniorInsight: 'Use Virtual Nodes (vnodes) on the hash ring. Instead of placing a server at one spot, place each server at 100 virtual points on the ring. This balances load evenly and prevents "hotspots" where one physical server receives disproportionate traffic.'
            },
            trap: {
                title: 'Using simple modulus hashing (hash % N) to distribute cache keys across Redis servers',
                juniorCode: `// ❌ JUNIOR: Adding 1 server from N=4 to N=5 reshuffles 85%+ of all cached keys!
const serverIndex = crc32(key) % serverCount;
// Result: Total cache miss storm! Primary database melts under 100% traffic load.`,
                seniorCode: `// ✅ SENIOR: Consistent Hash Ring with Virtual Nodes
import { createHash } from 'node:crypto';

export class ConsistentHashRing {
    private ring = new Map<number, string>();
    private keys: number[] = [];

    constructor(nodes: string[], private vnodes = 100) {
        for (const node of nodes) this.addNode(node);
    }

    addNode(node: string) {
        for (let i = 0; i < this.vnodes; i++) {
            const hash = this.hash(\`\${node}#\${i}\`);
            this.ring.set(hash, node);
            this.keys.push(hash);
        }
        this.keys.sort((a, b) => a - b);
    }

    getNode(key: string): string {
        const hash = this.hash(key);
        // Binary search to find the first node clockwise on the ring:
        const idx = this.keys.findIndex(k => k >= hash);
        return this.ring.get(this.keys[idx === -1 ? 0 : idx])!;
    }

    private hash(val: string): number {
        return createHash('md5').update(val).digest().readUInt32BE(0);
    }
}`,
                explanation: 'Consistent hashing ensures that adding or removing a node only redistributes a small fraction of keys, preventing catastrophic cache invalidation storms.'
            },
            drill: {
                question: 'Why are "Virtual Nodes" necessary when implementing a Consistent Hash Ring?',
                hint: 'What happens to key distribution if 3 servers are placed randomly on a 360-degree circle?',
                solution: `Without virtual nodes, random hash placement can leave large gaps between servers, causing one server to hold 70% of the keys (non-uniform distribution).
Virtual nodes assign each physical machine to 100+ points across the ring, statistically guaranteeing uniform, balanced load distribution.`,
                explanation: 'Virtual nodes prevent statistical variance and hot spots in hash rings.'
            },
            docLink: {
                title: 'System Design Primer: Consistent Hashing',
                url: 'https://github.com/donnemartin/system-design-primer#consistent-hashing',
                description: 'Comprehensive guide to consistent hashing algorithms and virtual nodes.'
            }
        },
        {
            id: 'sys-11',
            title: 'Observability & Distributed Tracing (OpenTelemetry & P99 Latency)',
            estMinutes: 5,
            concept: {
                summary: 'Modern distributed architectures cannot be debugged with local logs alone. Observability relies on the Three Pillars: 1) Metrics (counters, gauges, P95/P99 latency histograms), 2) Structured Logs (JSON with correlation IDs), and 3) Distributed Tracing (OpenTelemetry trace and span contexts propagated across network calls).',
                analogy: 'Medical diagnostic imaging: metrics are heart rate and blood pressure monitors; logs are doctor appointment notes; distributed tracing is an MRI scan visualizing the exact flow of blood through every vessel in sequence.',
                seniorInsight: 'Never measure system performance by Average (Mean) latency. An average of 100ms can hide the fact that the 99th percentile (P99) of your wealthiest checkout users are experiencing 8-second timeouts. Always optimize for P95 and P99 latency.'
            },
            trap: {
                title: 'Relying on average response times while ignoring severe P99 latency spikes',
                juniorCode: `// ❌ JUNIOR: "Our average API latency is 85ms, the system is performing great!"
// Meanwhile, 1 out of every 100 users (P99) waits 12,000ms and abandons their shopping cart!`,
                seniorCode: `// ✅ SENIOR: OpenTelemetry distributed trace context propagation
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('checkout-service');

export async function handleCheckout(req, res) {
    // Start parent span:
    return tracer.startActiveSpan('processCheckout', async (span) => {
        try {
            span.setAttribute('user.id', req.userId);
            span.setAttribute('order.amount', req.amount);

            // Child span for inventory check:
            await tracer.startActiveSpan('checkInventory', async (invSpan) => {
                await inventoryService.reserve(req.items);
                invSpan.end();
            });

            // Child span for payment:
            await tracer.startActiveSpan('chargeStripe', async (paySpan) => {
                await paymentService.charge(req.amount);
                paySpan.end();
            });

            res.json({ success: true });
        } catch (err: any) {
            span.recordException(err);
            span.setStatus({ code: 2, message: err.message }); // Error status
            res.status(500).json({ error: err.message });
        } finally {
            span.end();
        }
    });
}`,
                explanation: 'OpenTelemetry generates trace IDs that travel across HTTP headers (`traceparent`), allowing engineers to visualize exactly which microservice caused a 5-second bottleneck.'
            },
            drill: {
                question: 'What is the "traceparent" header standardized by the W3C Trace Context specification?',
                hint: 'What 4 fields are encoded into the traceparent string?',
                solution: `The W3C "traceparent" HTTP header propagates distributed tracing context across services in the format:
version-trace_id-parent_id-trace_flags
(e.g. 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01).
This allows downstream microservices to attach their spans to the exact same distributed trace tree.`,
                explanation: 'W3C Trace Context enables vendor-agnostic distributed tracing across multiple clouds and stacks.'
            },
            docLink: {
                title: 'OpenTelemetry Official Documentation',
                url: 'https://opentelemetry.io/docs/',
                description: 'Standardized distributed tracing, metrics, and logging instrumentation.'
            }
        },
        {
            id: 'sys-12',
            title: 'Idempotency Keys & Exactly-Once Semantics in Payment Systems',
            estMinutes: 5,
            concept: {
                summary: 'In distributed networks, packets get dropped, connections timeout, and clients retry requests automatically. If a user clicks "Pay $500" and the mobile connection drops right after the server charges the card, the client retries. An Idempotency Key (sent via `Idempotency-Key: uuid`) guarantees that retrying an operation multiple times produces the exact same outcome as the first attempt, preventing duplicate charges.',
                analogy: 'An elevator call button: pressing the button once summons the elevator; pressing the button 15 times repeatedly does not send 15 elevators—it records the single intent.',
                seniorInsight: 'Implement idempotency using an atomic Redis reservation pattern: store the incoming `Idempotency-Key` with state `PROCESSING`. If a duplicate request arrives while the first is running, return HTTP 409 Conflict. When completed, store the response body so subsequent retries receive the cached result instantly.'
            },
            trap: {
                title: 'Processing duplicate credit card charges when network timeouts trigger client retries',
                juniorCode: `// ❌ JUNIOR: No idempotency check; network retry charges the customer twice!
app.post('/charge', async (req, res) => {
    // If client timeout triggers a retry, this runs twice and charges $1,000 instead of $500!
    const charge = await stripe.charges.create({ amount: req.body.amount });
    res.json(charge);
});`,
                seniorCode: `// ✅ SENIOR: Atomic Idempotency Key gate using Redis
app.post('/charge', async (req, res) => {
    const key = req.headers['idempotency-key'] as string;
    if (!key) return res.status(400).json({ error: 'Idempotency-Key header required' });

    const redisKey = \`idempotency:\${key}\`;

    // 1. Atomically set status to PROCESSING if key does not exist:
    const acquired = await redis.set(redisKey, JSON.stringify({ state: 'PROCESSING' }), 'NX', 'EX', 120);
    if (!acquired) {
        const existing = JSON.parse((await redis.get(redisKey)) || '{}');
        if (existing.state === 'PROCESSING') {
            return res.status(409).json({ error: 'Request currently being processed; retry shortly' });
        }
        // Return previously computed response:
        return res.status(200).json(existing.response);
    }

    try {
        // 2. Perform payment charge:
        const charge = await stripe.charges.create({ amount: req.body.amount });

        // 3. Save successful response for future retries:
        await redis.set(redisKey, JSON.stringify({ state: 'COMPLETED', response: charge }), 'EX', 86400);

        return res.status(200).json(charge);
    } catch (err: any) {
        await redis.del(redisKey); // Release lock on catastrophic failure
        throw err;
    }
});`,
                explanation: 'Atomic idempotency key locking guarantees exactly-once payment processing semantics regardless of client network retries.'
            },
            drill: {
                question: 'Which HTTP methods are defined as inherently idempotent by the HTTP/1.1 specification (RFC 7231)?',
                hint: 'Does repeating GET, PUT, or DELETE multiple times change the server state beyond the first call?',
                solution: `GET, HEAD, OPTIONS, PUT, and DELETE are inherently idempotent.
- Calling PUT (replace) or DELETE (remove) 10 times produces the exact same end state as calling it once.
- POST and PATCH are NOT idempotent by default and require custom application idempotency keys.`,
                explanation: 'Understanding HTTP method idempotency is essential for RESTful API architecture.'
            },
            docLink: {
                title: 'Stripe Engineering: Designing Robust Idempotent APIs',
                url: 'https://stripe.com/blog/idempotency',
                description: 'Stripe architecture deep dive on designing idempotent APIs and financial safety.'
            }
        }
    ]
};
