import { SkillRoadmap } from './types';

export const mongodbRoadmap: SkillRoadmap = {
    skillId: 'mongodb',
    skillName: 'MongoDB & Document Modeling',
    category: 'DATA STORAGE',
    tagline: 'Flexible document modeling, aggregation pipelines, ESR compound indexing, change streams, and replica sets.',
    accentColor: '#15803d',
    officialDocs: [
        {
            title: 'MongoDB Official Documentation & Manual',
            url: 'https://www.mongodb.com/docs/manual/',
            description: 'The authoritative reference manual for CRUD operations, aggregation pipelines, indexes, and cluster administration.',
            badge: 'Official Manual'
        },
        {
            title: 'MongoDB University Free Interactive Courses',
            url: 'https://learn.mongodb.com/',
            description: 'Free interactive labs and certification curriculum on document modeling patterns, Mongoose, and performance tuning.',
            badge: 'Interactive Labs'
        },
        {
            title: 'MongoDB Aggregation Pipeline Builder Guide',
            url: 'https://www.mongodb.com/docs/manual/core/aggregation-pipeline/',
            description: 'In-depth architectural guide for multi-stage analytics, $lookup joins, and facet filtering.',
            badge: 'Architecture Guide'
        }
    ],
    checkpoints: [
        {
            id: 'mongo-1',
            title: 'Embedding vs Referencing (1-to-N vs 1-to-Squillion)',
            estMinutes: 5,
            concept: {
                summary: 'In MongoDB, data modeling is dictated by application query access patterns rather than normalized tables. Embed child documents when data is bounded, queried together, and rarely updated independently (e.g. 1 user with 2 billing addresses). Reference using ObjectId pointers when the relationship is unbounded or independently growing (e.g. 1 user with 1,000,000 log events).',
                analogy: 'Keep your driver license in your wallet (embedded, bounded, always needed together). Keep your car in a parking garage with a claim ticket number (referenced, unbounded, independent lifecycle).',
                seniorInsight: 'BSON documents have a strict 16MB ceiling. Embedding an unbounded array will eventually corrupt write performance due to document relocation on disk, and ultimately crash when reaching 16MB.'
            },
            trap: {
                title: 'Embedding unbounded activity logs inside a single user document',
                juniorCode: `// ❌ JUNIOR: Unbounded array embedded inside a parent document; blows past 16MB!
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: String,
    // As user performs actions over months, this array grows into hundreds of thousands of items!
    auditLogs: [{
        action: String,
        ip: String,
        timestamp: { type: Date, default: Date.now }
    }]
});`,
                seniorCode: `// ✅ SENIOR: Separate collection with parent ObjectId reference and compound index
const auditLogSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Compound index for high-speed chronological queries per tenant/user
auditLogSchema.index({ userId: 1, timestamp: -1 });`,
                explanation: 'Referencing unbounded relationships keeps individual documents small and fast in memory, while compound indexes ensure fetching the latest 20 logs for a user takes less than 2ms.'
            },
            drill: {
                question: 'What is the maximum allowed size of a single BSON document in MongoDB, and what tool handles files larger than that?',
                hint: 'Think about binary document ceilings and MongoDB file storage specification.',
                solution: `The maximum single BSON document size is 16MB.
For binary files exceeding 16MB (e.g. video files, large PDFs, disk images), MongoDB provides GridFS, which chunks the file into 255KB parts across two collections (fs.files and fs.chunks).`,
                explanation: 'The 16MB limit ensures documents fit into RAM and prevents single documents from saturating network buffers.'
            },
            docLink: {
                title: 'MongoDB Docs: Model One-to-Many Relationships',
                url: 'https://www.mongodb.com/docs/manual/tutorial/model-embedded-one-to-many-relationships-between-documents/',
                description: 'Best practices for choosing between embedded documents and references.'
            }
        },
        {
            id: 'mongo-2',
            title: 'The ESR Rule for High-Performance Compound Indexing',
            estMinutes: 5,
            concept: {
                summary: 'When designing compound indexes in MongoDB to support queries with filters and sorting, keys must follow the ESR Rule: Equality first, Sort second, Range last. Following this exact key order ensures the query engine can filter matching equality sets, leverage the index order for sorting without an in-memory sort, and scan the range boundary efficiently.',
                analogy: 'A physical library card catalog: first go to the Subject drawer (Equality: "Computer Science"), flip through author surnames in order (Sort: "Knuth"), then pick publication years between 1990 and 2000 (Range).',
                seniorInsight: 'If you place Range before Sort (e.g. { age: 1, status: 1 }), MongoDB can still use the index to find documents, but it cannot use the index for sorting. It falls back to an in-memory sort, throwing an error if the result set exceeds 100MB.'
            },
            trap: {
                title: 'Ordering compound index fields arbitrarily (e.g. Range before Sort)',
                juniorCode: `// ❌ JUNIOR: Index order { createdAt: 1, status: 1, score: -1 } violates ESR!
// Query: find active users created this year, sorted by score descending
const query = { status: 'ACTIVE', createdAt: { $gte: startOfYear } };
const sort = { score: -1 };

// MongoDB must fetch all rows from createdAt range into RAM to perform an expensive in-memory sort!`,
                seniorCode: `// ✅ SENIOR: Strict ESR Rule: Equality (status) -> Sort (score) -> Range (createdAt)
// 1. Equality: status
// 2. Sort: score
// 3. Range: createdAt
userSchema.index({ status: 1, score: -1, createdAt: 1 });

// Query now executes with ZERO in-memory sort and minimal key scans:
const users = await User.find({
    status: 'ACTIVE',
    createdAt: { $gte: startOfYear }
})
.sort({ score: -1 })
.limit(20);`,
                explanation: 'Following ESR allows the query planner to narrow candidate keys down via Equality, traverse them in exact requested Sort order, and evaluate Range conditions linearly.'
            },
            drill: {
                question: 'Given the query: db.orders.find({ customerId: "abc", total: { $gt: 100 } }).sort({ orderDate: -1 }), what is the optimal compound index under the ESR rule?',
                hint: 'Classify customerId, total, and orderDate into Equality, Sort, and Range.',
                solution: `Optimal Index: { customerId: 1, orderDate: -1, total: 1 }
- Equality: customerId (exact match)
- Sort: orderDate (descending sort order)
- Range: total ($gt inequality comparison)`,
                explanation: 'Placing orderDate before total allows MongoDB to return pre-sorted keys directly from the index tree.'
            },
            docLink: {
                title: 'MongoDB Docs: The ESR (Equality, Sort, Range) Rule',
                url: 'https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/',
                description: 'Guidelines for structuring compound index keys for optimal query execution.'
            }
        },
        {
            id: 'mongo-3',
            title: 'Aggregation Pipeline Mastery ($match, $lookup, $unwind, $facet)',
            estMinutes: 5,
            concept: {
                summary: 'The MongoDB Aggregation Pipeline processes documents through a multi-stage sequential conveyor belt. Early stages filter and project fields to minimize RAM usage ($match, $project), followed by joins ($lookup), array deconstructions ($unwind), grouped calculations ($group), and multi-faceted analytics ($facet).',
                analogy: 'An industrial fruit processing plant: bad fruits are rejected at the entrance sorter ($match), fruits are peeled ($project), blended and measured ($group), and packaged in parallel shipping lanes ($facet).',
                seniorInsight: 'Always place `$match` as the very first stage in an aggregation pipeline. When $match is first, MongoDB can utilize indexes to filter candidate documents. Placing $match after $lookup forces full collection scans.'
            },
            trap: {
                title: 'Placing $lookup before $match, joining millions of unneeded records',
                juniorCode: `// ❌ JUNIOR: Joins the entire orders collection BEFORE filtering active customers!
const results = await Customer.aggregate([
    {
        $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'customerId',
            as: 'allOrders'
        }
    },
    { $match: { 'status': 'ACTIVE', 'country': 'IN' } } // Too late! Thousands of unused orders joined in RAM!
]);`,
                seniorCode: `// ✅ SENIOR: Filters first via index, joins only matching records, and uses pipeline lookup
const results = await Customer.aggregate([
    // 1. Stage 1: $match first uses compound index { country: 1, status: 1 }
    { $match: { country: 'IN', status: 'ACTIVE' } },
    // 2. Stage 2: Join only required recent orders via correlated sub-pipeline
    {
        $lookup: {
            from: 'orders',
            let: { custId: '$_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$customerId', '$$custId'] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 5 }
            ],
            as: 'recentOrders'
        }
    },
    // 3. Stage 3: Project only necessary fields
    {
        $project: {
            name: 1,
            email: 1,
            orderCount: { $size: '$recentOrders' }
        }
    }
]);`,
                explanation: 'Placing $match first allows index scans. Correlated sub-pipeline lookups filter and limit joined items before pulling them into parent memory.'
            },
            drill: {
                question: 'What is the purpose of the "$facet" aggregation stage in MongoDB e-commerce applications?',
                hint: 'How do websites calculate search results, price range histograms, and category counts in a single query?',
                solution: `"$facet" allows you to execute multiple parallel aggregation pipelines within a single stage over the same incoming document stream.
For example, in one database round-trip, one facet sub-pipeline computes paginated search results, while another facet computes price histograms, and a third calculates category counts.`,
                explanation: '$facet provides multi-dimensional faceted search without multiple separate round-trip queries.'
            },
            docLink: {
                title: 'MongoDB Docs: Aggregation Pipeline Stages',
                url: 'https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/',
                description: 'Complete guide to aggregation stages, expressions, and pipeline optimization.'
            }
        },
        {
            id: 'mongo-4',
            title: 'Write Concerns & Read Concerns for Distributed Consistency',
            estMinutes: 5,
            concept: {
                summary: 'In MongoDB replica sets, Write Concerns (`w`) dictate how many nodes must acknowledge a write before the driver returns success (e.g. `w: 1` acknowledges primary only; `w: "majority"` acknowledges a quorum of nodes). Read Concerns (`readConcern`) dictate data isolation (e.g. "local", "majority", "linearizable"), preventing dirty reads of uncommitted writes.',
                analogy: 'Sending a registered legal contract: "w: 1" is having the front desk clerk sign the receipt; "w: majority" is waiting until three partners of the firm co-sign the physical ledger.',
                seniorInsight: 'Always use `w: "majority"` with `j: true` (journaled) for critical transactions like financial balance updates. If a primary crashes immediately after acknowledging `w: 1`, the write may be rolled back when a new primary is elected, causing phantom data loss.'
            },
            trap: {
                title: 'Using default w:1 for financial or billing ledger mutations',
                juniorCode: `// ❌ JUNIOR: w:1 returns success as soon as primary writes to memory; vulnerable to rollback!
await paymentCollection.insertOne({
    userId: 'u123',
    amount: 500,
    status: 'PAID'
}, { writeConcern: { w: 1 } });
// If primary node experiences power outage before syncing to secondaries, this payment disappears!`,
                seniorCode: `// ✅ SENIOR: Quorum-backed majority write concern with on-disk journaling
await paymentCollection.insertOne({
    userId: 'u123',
    amount: 500,
    status: 'PAID',
    recordedAt: new Date()
}, {
    writeConcern: {
        w: 'majority',
        j: true, // Guarantees write is flushed to on-disk journal before returning
        wtimeoutMS: 5000 // Prevents hanging if replica set network partition occurs
    }
});`,
                explanation: 'w: "majority" guarantees that a majority of voting replica set members have committed the write, making it mathematically impossible for a subsequent primary election to roll it back.'
            },
            drill: {
                question: 'What is the risk of setting "w: 0" (unacknowledged write) on database insert operations?',
                hint: 'Does the application wait for network or syntax validation errors?',
                solution: `With "w: 0", the driver sends the write over the network socket and immediately returns success without waiting for server response.
The application will never receive duplicate key errors (E11000), schema validation errors, or network dropped packet exceptions.`,
                explanation: 'w: 0 is fire-and-forget; only acceptable for non-critical high-frequency telemetry where data loss is inconsequential.'
            },
            docLink: {
                title: 'MongoDB Docs: Write Concern',
                url: 'https://www.mongodb.com/docs/manual/reference/write-concern/',
                description: 'Configuring write guarantees, journaling, and timeout thresholds.'
            }
        },
        {
            id: 'mongo-5',
            title: 'Schema Validation with JSON Schema ($jsonSchema)',
            estMinutes: 5,
            concept: {
                summary: 'While MongoDB is schema-flexible, production enterprise databases enforce document structural integrity using `$jsonSchema` validators directly in the database engine. This prevents corrupted or missing required fields even if non-Mongoose scripts, migrations, or microservices write to the collection.',
                analogy: 'Airport security passport control: anyone can pack whatever they want in their luggage (flexible schema), but everyone must show a valid, unexpired passport with photo and name (strict schema validation).',
                seniorInsight: 'Do not rely solely on Mongoose client-side validations. Mongoose validation is easily bypassed by `collection.updateOne()`, raw mongo shell commands, or external services. Database-level `$jsonSchema` guarantees ironclad constraints.'
            },
            trap: {
                title: 'Relying exclusively on Mongoose schema rules without database-level validation',
                juniorCode: `// ❌ JUNIOR: Only validated inside this specific Node.js process using Mongoose
const orderSchema = new Schema({
    price: { type: Number, required: true, min: 0 }
});
// A raw Mongo shell command or secondary microservice can insert { price: -500 } or { price: "free" }!`,
                seniorCode: `// ✅ SENIOR: Native database-enforced $jsonSchema validation on the collection
await db.createCollection('orders', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['customerId', 'total', 'status'],
            properties: {
                customerId: { bsonType: 'objectId', description: 'must be an ObjectId and is required' },
                total: { bsonType: 'double', minimum: 0, description: 'must be a non-negative double' },
                status: {
                    enum: ['PENDING', 'PAID', 'CANCELLED'],
                    description: 'can only be one of the specified enum values'
                }
            }
        }
    },
    validationAction: 'error', // Rejects invalid documents; 'warn' logs to diagnostic log
    validationLevel: 'strict'
});`,
                explanation: '$jsonSchema is evaluated by the MongoDB storage engine on every insert and update, protecting database integrity across all connected clients and tools.'
            },
            drill: {
                question: 'What is the difference between validationLevel: "strict" and validationLevel: "moderate" in MongoDB schema validation?',
                hint: 'How does it treat existing legacy documents that do not conform to newly added schema rules?',
                solution: `"strict" applies schema validation rules to all inserts and all updates.
"moderate" applies validation to inserts and only to updates on existing documents that ALREADY fulfilled validation criteria, allowing legacy non-compliant documents to be modified without failing.`,
                explanation: 'validationLevel: "moderate" is ideal during zero-downtime rolling migrations of legacy collections.'
            },
            docLink: {
                title: 'MongoDB Docs: Schema Validation',
                url: 'https://www.mongodb.com/docs/manual/core/schema-validation/',
                description: 'Enforcing data integrity and types using JSON Schema validation rules.'
            }
        },
        {
            id: 'mongo-6',
            title: 'Multi-Document ACID Transactions (session.withTransaction)',
            estMinutes: 5,
            concept: {
                summary: 'Since MongoDB 4.0, replica sets support multi-document ACID transactions. By starting a ClientSession and wrapping mutations in `session.withTransaction()`, multiple insert, update, and delete operations across multiple collections commit atomically: all succeed or all roll back.',
                analogy: 'A dual-custody bank vault: both the client key and the bank officer key must turn simultaneously to open the deposit box; if either key fails, the mechanism resets locked.',
                seniorInsight: 'Avoid long-running transactions. MongoDB transactions acquire pessimistic snapshot locks and have a default 60-second execution limit. Keep transactions brief and handle transient transaction errors with automatic retry logic.'
            },
            trap: {
                title: 'Performing multi-step debit and credit operations sequentially without a transaction session',
                juniorCode: `// ❌ JUNIOR: If step 2 fails, sender loses money but recipient never receives it!
await Account.updateOne({ _id: senderId }, { $inc: { balance: -100 } });
// If process crashes here or recipientId is invalid, money is lost forever!
await Account.updateOne({ _id: recipientId }, { $inc: { balance: 100 } });`,
                seniorCode: `// ✅ SENIOR: Atomic ACID transaction using ClientSession and withTransaction
const session = await mongoose.startSession();

try {
    await session.withTransaction(async () => {
        const sender = await Account.findOneAndUpdate(
            { _id: senderId, balance: { $gte: 100 } }, // Atomic balance check
            { $inc: { balance: -100 } },
            { session, new: true }
        );

        if (!sender) {
            throw new Error('Insufficient funds or sender account not found');
        }

        const recipient = await Account.findOneAndUpdate(
            { _id: recipientId },
            { $inc: { balance: 100 } },
            { session }
        );

        if (!recipient) {
            throw new Error('Recipient account not found');
        }
    });
} finally {
    await session.endSession();
}`,
                explanation: 'withTransaction automatically handles commit retries for transient transaction errors (like write conflicts) and issues a rollback if any exception is thrown.'
            },
            drill: {
                question: 'Can MongoDB multi-document transactions be executed on a standalone, single-node MongoDB instance without replica sets?',
                hint: 'What clustering feature is required for transaction oplog tracking?',
                solution: `No. Multi-document transactions require a replica set (even a single-node replica set with rs.initiate()) because transactions rely heavily on the replication operation log (oplog) and global cluster timestamps.`,
                explanation: 'Transactions are integrated directly into the replication engine architecture.'
            },
            docLink: {
                title: 'MongoDB Docs: Transactions',
                url: 'https://www.mongodb.com/docs/manual/core/transactions/',
                description: 'Implementing multi-document ACID transactions with ClientSession.'
            }
        },
        {
            id: 'mongo-7',
            title: 'Real-Time Data Pipelines with Change Streams (watch())',
            estMinutes: 5,
            concept: {
                summary: 'Change Streams allow applications to subscribe to real-time data changes across collections, databases, or entire deployment clusters using the MongoDB oplog. Using `collection.watch()`, applications receive notification events for inserts, updates, deletes, and drop operations with resume token guarantees.',
                analogy: 'A real-time news ticker tape: whenever a news bulletin is filed in the newsroom, it prints out continuously on the wire service ticker across remote subscriber offices.',
                seniorInsight: 'Always store the `_id` resume token (`resumeAfter`) of change stream events in a persistent store (like Redis or DB). If your Node service restarts, passing the resume token ensures zero missed events.'
            },
            trap: {
                title: 'Polling the database with setInterval() to detect newly created records',
                juniorCode: `// ❌ JUNIOR: Inefficient polling wastes database IOPS and introduces up to 5s latency
setInterval(async () => {
    const newOrders = await Order.find({ createdAt: { $gt: lastChecked } });
    newOrders.forEach(processOrder);
    lastChecked = new Date();
}, 5000);`,
                seniorCode: `// ✅ SENIOR: Real-time event-driven Change Stream with resume token resilience
const pipeline = [
    { $match: { 'operationType': 'insert', 'fullDocument.total': { $gt: 1000 } } }
];

const changeStream = Order.watch(pipeline, {
    fullDocument: 'updateLookup',
    resumeAfter: savedResumeToken // Seamlessly resumes after service reboot
});

changeStream.on('change', async (event) => {
    console.log('High-value order created:', event.fullDocument._id);
    await processOrder(event.fullDocument);
    await saveResumeToken(event._id); // Persist resume token
});

changeStream.on('error', (err) => {
    console.error('Change stream encountered error; reconnecting:', err);
});`,
                explanation: 'Change streams tail the MongoDB oplog natively in memory, delivering sub-millisecond change notifications without expensive repetitive polling queries.'
            },
            drill: {
                question: 'What is the purpose of the "fullDocument: \'updateLookup\'" option when opening a change stream?',
                hint: 'By default, what does an update operation event return regarding document fields?',
                solution: `By default, an 'update' event only returns the updated fields delta (updatedFields: { status: "PAID" }).
Setting "fullDocument: 'updateLookup'" instructs MongoDB to fetch and attach the complete, current state of the document at the time of the event.`,
                explanation: 'updateLookup gives downstream consumers the full document without a secondary findOne() query.'
            },
            docLink: {
                title: 'MongoDB Docs: Change Streams',
                url: 'https://www.mongodb.com/docs/manual/changeStreams/',
                description: 'Subscribing to real-time database modifications using watch().'
            }
        },
        {
            id: 'mongo-8',
            title: 'Time-Series Collections & The Bucket Pattern',
            estMinutes: 5,
            concept: {
                summary: 'For high-frequency write workloads (IoT sensor metrics, crypto tick prices, server monitoring), storing one document per data point creates massive index overhead and storage bloat. MongoDB Time-Series collections and the Bucket Pattern group data into time intervals (e.g. 1 hour buckets), storing points inside arrays with columnar compression.',
                analogy: 'Shipping bulk grain: packing every individual grain of rice into its own miniature cardboard box vs pouring 50kg of grain into a sturdy burlap sack for bulk shipping.',
                seniorInsight: 'MongoDB native Time-Series collections (`timeseries: { timeField, metaField, granularity }`) compress data automatically using columnar storage algorithms (zstd/snappy), reducing disk usage by up to 70% compared to standard collections.'
            },
            trap: {
                title: 'Inserting a separate document for every sensor reading at 100Hz',
                juniorCode: `// ❌ JUNIOR: 100 documents per second per device creates billions of docs and explodes indexes!
await TemperatureLog.insertOne({
    deviceId: 'sensor-42',
    temperature: 24.5,
    timestamp: new Date()
});`,
                seniorCode: `// ✅ SENIOR: Native MongoDB Time-Series collection optimized for high-throughput writes
await db.createCollection('sensor_metrics', {
    timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'seconds' // 'seconds' | 'minutes' | 'hours'
    },
    expireAfterSeconds: 86400 * 90 // Built-in TTL automatically purges data older than 90 days
});

// App code inserts standard records; MongoDB automatically groups into columnar buckets on disk:
await db.collection('sensor_metrics').insertOne({
    metadata: { deviceId: 'sensor-42', location: 'Rack-3' },
    temperature: 24.5,
    humidity: 58.2,
    timestamp: new Date()
});`,
                explanation: 'Time-series collections automatically optimize write throughput, reduce disk space through columnar compression, and speed up range queries over time intervals.'
            },
            drill: {
                question: 'What is the "metaField" in a MongoDB time-series collection, and why is it critical for bucket grouping?',
                hint: 'How does MongoDB distinguish which sensor or entity generated the reading?',
                solution: `The "metaField" contains static metadata identifying the source of the metric (e.g. deviceId, serverId, tags).
MongoDB uses the metaField combined with time windows to route incoming points into the correct internal compressed bucket.`,
                explanation: 'Grouping by metadata ensures points from the same source reside together in storage blocks.'
            },
            docLink: {
                title: 'MongoDB Docs: Time Series Collections',
                url: 'https://www.mongodb.com/docs/manual/core/timeseries-collections/',
                description: 'Creating and querying high-performance time-series data collections.'
            }
        },
        {
            id: 'mongo-9',
            title: 'Atlas Search & Vector Search for AI Embeddings',
            estMinutes: 5,
            concept: {
                summary: 'While traditional MongoDB `$regex` queries cause expensive collection scans, MongoDB Atlas Search integrates an Apache Lucene engine for typo-tolerant full-text search. Atlas Vector Search indexes high-dimensional vector embeddings (via Hierarchical Navigable Small World - HNSW), enabling semantic similarity search and Retrieval-Augmented Generation (RAG) for AI applications.',
                analogy: 'Searching a library: regex is checking every word in every book manually; Atlas Search is using an exhaustive alphabetical index; Vector Search understands conceptual meaning ("canine health" matches "puppy nutrition").',
                seniorInsight: 'Combine `$vectorSearch` with `$match` filters inside an aggregation pipeline. This allows pre-filtering by user permissions or tenant IDs before computing nearest neighbors, preventing cross-tenant vector leakage.'
            },
            trap: {
                title: 'Using unindexed $regex queries for user-facing product search',
                juniorCode: `// ❌ JUNIOR: Regex with leading wildcard triggers full collection scan (COLLSCAN) on every keystroke
const products = await Product.find({
    title: { $regex: req.query.q, $options: 'i' }
}).limit(20);`,
                seniorCode: `// ✅ SENIOR: Atlas Search with Lucene fuzzy matching and relevancy scoring
const products = await Product.aggregate([
    {
        $search: {
            index: 'product_search_index',
            compound: {
                must: [
                    {
                        text: {
                            query: req.query.q,
                            path: ['title', 'description'],
                            fuzzy: { maxEdits: 1 } // Allows 1 typo/character transposition
                        }
                    }
                ],
                filter: [
                    { equals: { path: 'inStock', value: true } }
                ]
            }
        }
    },
    { $limit: 20 },
    {
        $project: {
            title: 1,
            price: 1,
            score: { $meta: 'searchScore' } // Returns search relevance score
        }
    }
]);`,
                explanation: '$search utilizes Lucene inverted indexes, delivering sub-10ms typo-tolerant search results ordered by mathematical relevance.'
            },
            drill: {
                question: 'What vector indexing algorithm does MongoDB Atlas Vector Search use for fast approximate nearest neighbor search?',
                hint: 'It is a graph-based algorithm widely used in AI vector databases.',
                solution: `HNSW (Hierarchical Navigable Small World).
HNSW builds a multi-layer graph where upper layers have longer links for rapid navigation and bottom layers contain fine-grained clustering for precise nearest-neighbor identification.`,
                explanation: 'HNSW delivers sub-linear query time for million-scale vector collections.'
            },
            docLink: {
                title: 'MongoDB Docs: Atlas Vector Search',
                url: 'https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/',
                description: 'Building AI semantic search and RAG applications with vector embeddings.'
            }
        },
        {
            id: 'mongo-10',
            title: 'Query Optimization with explain("executionStats")',
            estMinutes: 5,
            concept: {
                summary: 'To diagnose slow queries and verify index usage, MongoDB provides the `.explain("executionStats")` helper. Senior engineers inspect three vital metrics: `executionStages.stage` (verifying `IXSCAN` over `COLLSCAN`), `totalKeysExamined` (keys scanned), and `totalDocsExamined` (documents read from disk).',
                analogy: 'A car dashboard diagnostics tool: instead of guessing why the engine is making a grinding noise, plugging into the OBD port reveals the exact RPM, pressure, and faulty component.',
                seniorInsight: 'In an optimal query, `totalKeysExamined` equals `nReturned`, and `totalDocsExamined` is 0 (a "Covered Query", where all requested fields reside in the index itself without touching disk documents).'
            },
            trap: {
                title: 'Assuming an index is being used without checking executionStats',
                juniorCode: `// ❌ JUNIOR: Adds an index and assumes queries are fast without verification
userSchema.index({ email: 1 });
// But query uses: User.find({ email: /.*gmail.*/ }) which cannot use index prefix and performs COLLSCAN!`,
                seniorCode: `// ✅ SENIOR: Verifies index efficiency via executionStats plan analysis
const stats = await User.find({ status: 'ACTIVE', department: 'ENG' })
    .sort({ hireDate: -1 })
    .explain('executionStats');

const { nReturned, totalKeysExamined, totalDocsExamined, executionTimeMillis } = stats.executionStats;

console.log({
    executionTimeMillis,
    efficiencyRatio: totalKeysExamined / nReturned, // Should be close to 1.0
    stage: stats.executionStats.executionStages.stage // MUST BE 'IXSCAN' or 'FETCH', NEVER 'COLLSCAN'
});`,
                explanation: 'Checking executionStats exposes whether the query engine performs full collection scans, inefficient key scans, or memory-consuming SORT stages.'
            },
            drill: {
                question: 'What is a "Covered Query" in MongoDB, and why does it represent the theoretical maximum query performance?',
                hint: 'What does totalDocsExamined equal in a covered query?',
                solution: `A Covered Query is a query where:
1. All fields in the query predicate are part of an index.
2. All fields returned in the projection are part of that SAME index.
3. The "_id" field is explicitly excluded (unless it is part of the index).
In a covered query, totalDocsExamined is exactly ZERO. MongoDB never inspects documents on disk, serving the response entirely from RAM-resident index structures.`,
                explanation: 'Covered queries achieve the highest possible throughput in database benchmarking.'
            },
            docLink: {
                title: 'MongoDB Docs: Analyze Query Performance',
                url: 'https://www.mongodb.com/docs/manual/tutorial/analyze-query-plan/',
                description: 'Interpreting explain output and executionStats to identify performance bottlenecks.'
            }
        },
        {
            id: 'mongo-11',
            title: 'Atomic Field Operations & Array Filters (arrayFilters)',
            estMinutes: 5,
            concept: {
                summary: 'Fetching a document into JavaScript, mutating an array in memory, and writing the whole document back causes dangerous race conditions under concurrent traffic. MongoDB atomic update operators (`$set`, `$inc`, `$push`, `$addToSet`, `$pull`) and `arrayFilters` allow precise in-place mutations inside deeply nested arrays in a single atomic database operation.',
                analogy: 'Using a laparoscopic surgical tool to repair a specific valve inside a heart, rather than removing the entire heart onto an external tray, altering it, and sewing it back in.',
                seniorInsight: 'Use `arrayFilters` with identifier placeholders like `items.$[elem].price` to update specific nested elements matching a condition in an array without reading the document first.'
            },
            trap: {
                title: 'Reading, mutating in JavaScript, and calling doc.save() concurrently',
                juniorCode: `// ❌ JUNIOR: Classic read-modify-write race condition! Concurrent requests overwrite each other
const user = await User.findById(userId);
user.loginAttempts += 1; // If 2 requests arrive simultaneously, one increment is lost!
await user.save();`,
                seniorCode: `// ✅ SENIOR: Atomic in-place database mutation with arrayFilters
// 1. Atomic increment of attempts:
await User.updateOne({ _id: userId }, { $inc: { loginAttempts: 1 } });

// 2. Modifying a specific nested order item inside an embedded array atomically:
await Order.updateOne(
    { _id: orderId },
    { $set: { 'items.$[targetItem].status': 'SHIPPED', 'items.$[targetItem].shippedAt': new Date() } },
    {
        arrayFilters: [{ 'targetItem.sku': 'SKU-PRO-99' }] // Matches only the intended array element
    }
);`,
                explanation: 'Atomic operators execute directly inside the WiredTiger storage engine locked at the document level, completely eliminating race conditions and minimizing payload sizes.'
            },
            drill: {
                question: 'What is the functional difference between $push and $addToSet when appending items to an array in MongoDB?',
                hint: 'What happens if the item already exists in the array?',
                solution: `"$push" appends the value to the array unconditionally, allowing duplicate entries.
"$addToSet" treats the array as a mathematical set: it only appends the value if an identical element does NOT already exist in the array.`,
                explanation: '$addToSet guarantees array uniqueness without requiring preliminary find queries.'
            },
            docLink: {
                title: 'MongoDB Docs: Update Operators with arrayFilters',
                url: 'https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/',
                description: 'Updating specific array elements conditionally using arrayFilters.'
            }
        },
        {
            id: 'mongo-12',
            title: 'High Availability & Sharding Topologies (Replica Sets vs Sharding)',
            estMinutes: 5,
            concept: {
                summary: 'MongoDB achieves High Availability via Replica Sets (1 Primary with 2+ Secondaries holding identical data) with automatic Raft-based failover elections. Horizontal Scaling is achieved via Sharding, partitioning collections across independent replica sets (shards) coordinated by Query Routers (`mongos`) and Config Servers based on a chosen Shard Key.',
                analogy: 'High Availability is having a co-pilot ready to grab the airplane controls if the pilot faints. Sharding is operating an airline fleet of 10 separate planes to transport 3,000 passengers instead of trying to build a single giant airplane.',
                seniorInsight: 'Choosing a Shard Key is a one-way architectural decision. A poor shard key (like an auto-incrementing ID or timestamp) creates a "hotspot", routing 100% of writes to a single shard and nullifying the benefits of the cluster. Use a high-cardinality compound shard key (e.g. { tenantId: 1, _id: 1 }).'
            },
            trap: {
                title: 'Using monotonically increasing values (ObjectId, Date) as the sole shard key',
                juniorCode: `// ❌ JUNIOR: Monotonic timestamp shard key routes all current writes to the latest shard!
sh.shardCollection('metrics.events', { createdAt: 1 });
// Result: Shard #1 receives 100% of write traffic while Shards #2, #3, and #4 sit idle!`,
                seniorCode: `// ✅ SENIOR: High-cardinality hashed shard key or compound tenant shard key
// Option A: Hashed shard key distributes writes uniformly across all cluster nodes
sh.shardCollection('metrics.events', { deviceId: 'hashed' });

// Option B: Multi-tenant compound key co-locates customer data while distributing tenants
sh.shardCollection('saas.organizations', { tenantId: 1, _id: 1 });`,
                explanation: 'Hashed or compound shard keys evenly distribute write IOPS across all shards in the cluster, preventing single-node bottlenecks.'
            },
            drill: {
                question: 'In a 3-node MongoDB replica set (1 Primary, 2 Secondaries), how many nodes must be online to elect a new Primary if the current Primary fails?',
                hint: 'What constitutes a quorum in voting replication?',
                solution: `At least 2 nodes (a strict majority: (3 / 2) + 1).
If 2 of the 3 nodes go offline simultaneously, the remaining 1 node cannot form a quorum and will step down to secondary-only read mode, preventing split-brain scenarios.`,
                explanation: 'Strict majority quorum is essential to prevent split-brain partition corruption in distributed systems.'
            },
            docLink: {
                title: 'MongoDB Docs: Sharding Architecture',
                url: 'https://www.mongodb.com/docs/manual/sharding/',
                description: 'Architecting horizontally scalable MongoDB sharded clusters and selecting shard keys.'
            }
        }
    ]
};
