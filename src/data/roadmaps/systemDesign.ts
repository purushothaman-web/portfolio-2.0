import { SkillRoadmap } from './types';
export const systemDesignRoadmap: SkillRoadmap = {
        skillId: 'system-design',
        skillName: 'System Architecture & Design',
        category: 'ARCHITECTURE',
        tagline: 'High availability, caching topologies, rate limiters, circuit breakers, and distributed queues.',
        accentColor: '#6366f1',
        officialDocs: [
            {
                title: 'Roadmap.sh Full-Stack & System Design',
                url: 'https://roadmap.sh/full-stack',
                description: 'The global community roadmap for scalable backend and frontend architecture.',
                badge: 'Interactive Roadmap'
            },
            {
                title: 'System Design Primer (GitHub)',
                url: 'https://github.com/donnemartin/system-design-primer',
                description: 'The premier open-source repository for learning how to design large-scale distributed systems.',
                badge: 'Open-Source Playbook'
            },
            {
                title: 'ByteByteGo Architecture Breakdowns',
                url: 'https://bytebytego.com/',
                description: 'Visual system design breakdowns by Alex Xu (author of System Design Interview).',
                badge: 'Visual Deep Dives'
            }
        ],
        checkpoints: [
            {
                id: 'sys-1',
                title: 'Cache-Aside Pattern & Cache Stampede Prevention',
                estMinutes: 5,
                concept: {
                    summary: 'In Cache-Aside, the app checks the in-memory cache (Redis) first. On a cache miss, it reads from the database, writes the result into cache, and returns it. To prevent a "stampede" when a key expires, distributed locks or probabilistic early expiration are used.',
                    analogy: 'Keeping the most frequent customer menus on a quick-grab counter (Redis). If a special menu is requested, the waiter walks to the filing room (DB) to fetch it and leaves a copy on the counter.',
                    seniorInsight: 'Senior architects set randomized TTL jitter (e.g. 5 minutes Â± 30 seconds) on cache keys so that 10,000 keys don\'t expire at the exact same second and overload the database.'
                },
                trap: {
                    title: 'Setting identical expiration times on bulk-cached items',
                    juniorCode: `// âŒ JUNIOR: 10,000 products expire at exact same second -> DB crashes from simultaneous queries
await redis.set(key, JSON.stringify(data), 'EX', 3600);`,
                    seniorCode: `// âœ… SENIOR: Adding random TTL jitter to spread database read spikes
const baseTTL = 3600;
const jitter = Math.floor(Math.random() * 300); // Â± 5 min jitter
await redis.set(key, JSON.stringify(data), 'EX', baseTTL + jitter);`,
                    explanation: 'When cached keys expire simultaneously under heavy traffic, thousands of concurrent requests bypass the cache and hit the database at once (Cache Stampede).'
                },
                drill: {
                    question: 'What is the difference between Write-Through and Write-Back (Write-Behind) caching?',
                    hint: 'Consider whether the cache or the database is updated first during a write.',
                    solution: `Write-Through: Writes data to both the cache and the database synchronously at the same time before acknowledging success.
Write-Back: Writes data to the cache immediately (fast response) and asynchronously batches writes to the database in the background.`,
                    explanation: 'Write-Through guarantees strong consistency. Write-Back provides maximum write throughput at the cost of potential data loss if the cache server crashes before flushing.'
                },
                docLink: {
                    title: 'System Design Primer: Caching Architectures',
                    url: 'https://github.com/donnemartin/system-design-primer#cache',
                    description: 'Comprehensive guide on caching patterns, eviction policies, and cache invalidation.'
                }
            }
        ]
};
