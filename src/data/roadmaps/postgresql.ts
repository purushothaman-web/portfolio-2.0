import { SkillRoadmap } from './types';

export const postgresqlRoadmap: SkillRoadmap = {
    skillId: 'postgresql',
    skillName: 'PostgreSQL & Database Design',
    category: 'DATA STORAGE',
    tagline: 'Relational data modeling, B-Tree and GIN index architectures, ACID transaction isolation, query execution plans, and high-concurrency locking.',
    accentColor: '#336791',
    officialDocs: [
        {
            title: 'PostgreSQL Official Documentation',
            url: 'https://www.postgresql.org/docs/current/index.html',
            description: 'The authoritative reference manual for SQL syntax, internal storage engines, vacuum mechanics, and query planner optimization.',
            badge: 'Official Manual'
        },
        {
            title: 'PG Exercises Interactive SQL Labs',
            url: 'https://pgexercises.com/',
            description: 'Hands-on interactive SQL training playground covering joins, window functions, recursive CTEs, and aggregations.',
            badge: 'Official Interactive Course'
        },
        {
            title: 'Use The Index, Luke! by Markus Winand',
            url: 'https://use-the-index-luke.com/',
            description: 'The industry-standard guide to database indexing internals, B-Trees, range predicates, and multi-column sorting.',
            badge: 'Indexing Bible'
        }
    ],
    checkpoints: [
        {
            id: 'pg-1',
            title: 'B-Tree Multicolumn Indexes & The Leftmost Prefix Rule',
            estMinutes: 5,
            concept: {
                summary: 'A B-Tree composite index on columns (A, B, C) creates a multi-level balanced tree sorted hierarchically: first by A, then by B within matching values of A, and finally by C. Queries that filter by A, or (A and B), or (A, B, and C) traverse the tree in O(log N) time. However, if a query filters ONLY by B or C, PostgreSQL cannot enter the tree hierarchically and must fall back to a full Sequential Scan.',
                analogy: 'A printed telephone directory ordered by (Last Name, First Name). You can immediately find everyone named "Smith", or "Smith, John". But if someone asks you to find everyone whose First Name is "John" regardless of their last name, you must read the entire book cover to cover.',
                seniorInsight: 'When designing composite indexes, place strict equality columns first (e.g. tenant_id, status) and range/sort columns last (e.g. created_at). The first range operator (<, >, BETWEEN) prevents the B-tree from utilizing subsequent index columns for index lookup.'
            },
            trap: {
                title: 'Creating an index on (tenant_id, created_at) and expecting it to optimize queries on created_at alone',
                juniorCode: `-- ❌ JUNIOR: Assumes the index works for created_at filtering
CREATE INDEX idx_audit_tenant_date ON audit_logs (tenant_id, created_at);

-- Query filters ONLY by created_at:
SELECT * FROM audit_logs 
WHERE created_at > NOW() - INTERVAL '7 days';
-- 💥 RESULT: Sequential Table Scan! Scanning 10,000,000 rows from disk.`,
                seniorCode: `-- ✅ SENIOR: Orders columns by query access patterns or creates dedicated index
-- 1. If queries are always scoped by tenant:
SELECT * FROM audit_logs 
WHERE tenant_id = 'org_abc' AND created_at > NOW() - INTERVAL '7 days';
-- Uses idx_audit_tenant_date (Index Scan)

-- 2. If global time-range queries are required, create a standalone or inverted index:
CREATE INDEX idx_audit_created_at_desc ON audit_logs (created_at DESC);`,
                explanation: 'PostgreSQL cannot jump to second-level keys in a B-Tree without a match on the leading leftmost column. Always align composite index definitions with your WHERE clause filters.'
            },
            drill: {
                question: 'Given an index on (organization_id, status, priority, created_at), which of the following queries CANNOT use the index efficiently?',
                starterCode: `-- Query A:
WHERE organization_id = 10 AND status = 'OPEN' AND priority = 2

-- Query B:
WHERE status = 'OPEN' AND priority = 2

-- Query C:
WHERE organization_id = 10 AND priority = 2`,
                hint: 'Check which query skips the very first leftmost column.',
                solution: `Query B CANNOT use the index efficiently!
Explanation: Query B completely omits organization_id (the leading column). Without organization_id, PostgreSQL cannot enter the B-Tree and must perform a full sequential scan.
Query A uses the first 3 columns with 100% index efficiency.
Query C uses organization_id to narrow the search, but must filter priority through index-level checking because status was skipped.`,
                explanation: 'The leftmost prefix rule requires that leading columns must be present in the query to traverse the index tree.'
            },
            docLink: {
                title: 'PostgreSQL Manual: Multicolumn Indexes',
                url: 'https://www.postgresql.org/docs/current/indexes-multicolumn.html',
                description: 'Official rules on composite index sorting, column ordering, and operator class matching.'
            }
        },
        {
            id: 'pg-2',
            title: 'Query Plan Analysis with EXPLAIN (ANALYZE, BUFFERS)',
            estMinutes: 5,
            concept: {
                summary: 'EXPLAIN without flags only outputs the query planner estimate calculated from table statistics (pg_statistic). EXPLAIN (ANALYZE, BUFFERS) actually executes the query, outputting real execution times and showing the physical I/O: shared hits (pages read from RAM cache) vs shared reads (pages read from slow disk NVMe/SSD).',
                analogy: 'A GPS route planner vs your car dashcam: raw EXPLAIN is the GPS estimating a 20-minute drive based on speed limits; EXPLAIN ANALYZE BUFFERS is the dashcam footage showing you were stuck in traffic for 55 minutes and paid 3 physical toll booths (disk reads).',
                seniorInsight: 'A query can have an execution time of 5ms in staging (where tables fit entirely in RAM shared hits), but cause massive production latency spikes when millions of shared reads must be fetched from physical disk.'
            },
            trap: {
                title: 'Trusting cost estimates alone without checking Shared Hit vs Read buffers',
                juniorCode: `-- ❌ JUNIOR: Runs basic EXPLAIN and assumes low cost = high production performance
EXPLAIN SELECT * FROM orders WHERE total_cents > 50000;
-- Shows: "Seq Scan on orders (cost=0.00..452.00 rows=321 width=72)"
-- Does NOT tell you how many megabytes were read from disk or true run duration!`,
                seniorCode: `-- ✅ SENIOR: Uses ANALYZE, BUFFERS, and TIMING to evaluate true cache impact
EXPLAIN (ANALYZE, BUFFERS, TIMING) 
SELECT * FROM orders WHERE total_cents > 50000;

-- Output reveals:
-- Seq Scan on orders (actual time=0.045..142.312 rows=312 loops=1)
-- Buffers: shared hit=42 read=1289 written=0
-- ⚠️ 1289 blocks (10MB+) read from physical disk! Needs an index or cache warming.`,
                explanation: 'Cost numbers are unitless relative weights. Only ANALYZE BUFFERS reveals the true memory and I/O footprint of a query in production.'
            },
            drill: {
                question: 'What is the fundamental difference between an "Index Scan" and an "Index Only Scan"?',
                hint: 'Consider whether the database engine has to visit the underlying table heap pages.',
                solution: `Index Scan:
Traverses the B-Tree index to locate row pointers (TIDs), then visits the physical table heap to fetch the actual row columns requested in SELECT.

Index Only Scan:
ALL requested columns in SELECT and WHERE exist directly inside the index itself (via indexed columns or an INCLUDE clause). If table pages are marked clean in the visibility map, the database never touches the physical table heap at all, delivering maximum performance.`,
                explanation: 'Index Only Scans eliminate table heap lookups entirely, turning queries into pure memory lookups.'
            },
            docLink: {
                title: 'PostgreSQL Documentation: Using EXPLAIN',
                url: 'https://www.postgresql.org/docs/current/using-explain.html',
                description: 'Complete guide to reading execution nodes, join algorithms, and buffer counters.'
            }
        },
        {
            id: 'pg-3',
            title: 'Partial & Expression / Functional Indexes',
            estMinutes: 5,
            concept: {
                summary: 'Standard indexes index every single row in a table. A Partial Index includes a WHERE predicate, indexing only the small subset of rows that queries actually filter on (e.g. WHERE deleted_at IS NULL or WHERE status = "PENDING"). An Expression (Functional) Index indexes the result of a function or expression (e.g. LOWER(email)), ensuring case-insensitive lookups utilize the index.',
                analogy: 'A VIP club guest list: rather than printing a 500-page directory of all 50,000 registered club members, the security bouncer carries a 2-page laminated sheet of the 40 VIP guests expected tonight (partial index).',
                seniorInsight: 'Partial indexes reduce index storage by 80–95%, keep index trees cached entirely in RAM, and speed up write throughput because INSERTs on unindexed rows skip index maintenance completely.'
            },
            trap: {
                title: 'Querying with LOWER() on an unindexed expression, forcing a full table scan',
                juniorCode: `-- ❌ JUNIOR: Index exists on email, but query uses LOWER(), completely bypassing it
CREATE INDEX idx_users_email ON users (email);

SELECT * FROM users WHERE LOWER(email) = 'alex@example.com';
-- 💥 FULL TABLE SCAN: B-Tree was sorted on raw email, not LOWER(email)!`,
                seniorCode: `-- ✅ SENIOR: Expression index + Partial index for active users
-- 1. Expression index for case-insensitive logins:
CREATE UNIQUE INDEX idx_users_lower_email ON users (LOWER(email));

-- 2. Partial index for active tasks (ignores 98% of completed archive rows):
CREATE INDEX idx_tasks_pending 
ON tasks (priority, scheduled_at) 
WHERE status = 'PENDING';

-- This query uses idx_tasks_pending instantly:
SELECT * FROM tasks 
WHERE status = 'PENDING' AND priority > 3;`,
                explanation: 'A query cannot use an index on column X if the query transforms X with a function (LOWER, DATE_TRUNC, COALESCE). The function must be declared directly in the index definition.'
            },
            drill: {
                question: 'Why will the query `SELECT * FROM tasks WHERE status = \'COMPLETED\';` NOT use the partial index `CREATE INDEX idx_active ON tasks (user_id) WHERE status = \'ACTIVE\';`?',
                hint: 'Does the query filter match the index WHERE clause?',
                solution: `Because the query filter (status = 'COMPLETED') does not satisfy the partial index predicate (WHERE status = 'ACTIVE').
The partial index contains ZERO entries for completed tasks. PostgreSQL recognizes this mismatch during query planning and ignores the index.`,
                explanation: 'Partial indexes are strictly scoped to rows that evaluate to true on the index condition.'
            },
            docLink: {
                title: 'PostgreSQL Guide: Partial Indexes',
                url: 'https://www.postgresql.org/docs/current/indexes-partial.html',
                description: 'Design patterns for reducing index bloat and accelerating localized query filters.'
            }
        },
        {
            id: 'pg-4',
            title: 'Foreign Key Constraints & The Unindexed Foreign Key Trap',
            estMinutes: 5,
            concept: {
                summary: 'In relational databases, declaring a FOREIGN KEY constraint enforces referential integrity, but PostgreSQL does NOT automatically create an index on the foreign key column. If the child table lacks an index on the foreign key column, deleting or updating a row in the parent table requires a full sequential scan of the child table, and acquires a table-level SHARE ROW EXCLUSIVE lock, blocking concurrent transactions.',
                analogy: 'A library catalog: the parent table is "Authors" and the child table is "Books". If you delete an author, the librarian must verify no books exist by that author. Without an author index on Books, the librarian must walk down every single aisle and check all 200,000 books by hand.',
                seniorInsight: 'Unindexed foreign keys are the #1 cause of sudden database deadlocks during CASCADE DELETE or parent primary key updates under high-concurrency production traffic.'
            },
            trap: {
                title: 'Declaring foreign keys without corresponding indexes on the referencing child table',
                juniorCode: `-- ❌ JUNIOR: Foreign key declared, but no index created on customer_id
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    total_cents INT NOT NULL
);

-- When a customer is deleted:
DELETE FROM customers WHERE id = 'cust_123';
-- 💥 PostgreSQL locks the ENTIRE orders table with a ShareLock while scanning every order!`,
                seniorCode: `-- ✅ SENIOR: Always create explicit indexes on every foreign key column
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    total_cents INT NOT NULL
);

-- Essential index to eliminate full table scans during parent updates/deletions:
CREATE INDEX idx_orders_customer_id ON orders (customer_id);`,
                explanation: 'Indexing child foreign keys turns parent deletion checks from O(N) full table scans into O(log N) index lookups, preventing severe table-locking deadlocks.'
            },
            drill: {
                question: 'How do you query PostgreSQL system catalogs (pg_stat_user_tables / pg_constraint) to find all unindexed foreign keys in your database?',
                hint: 'Look for constraints of type "f" where no matching index exists in pg_index.',
                solution: `SELECT 
    conrelid::regclass AS child_table,
    conname AS foreign_key_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
WHERE contype = 'f' 
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i 
    WHERE i.indrelid = c.conrelid 
      AND c.conkey = (i.indkey::smallint[])[1:array_length(c.conkey, 1)]
  );`,
                explanation: 'Regularly running unindexed foreign key audits in CI or maintenance sweeps prevents sudden deadlock regressions.'
            },
            docLink: {
                title: 'PostgreSQL Wiki: Foreign Keys and Indexes',
                url: 'https://wiki.postgresql.org/wiki/Foreign_key_indexing',
                description: 'Detailed analysis of lock escalation, table-wide ShareLock risks, and automated indexing queries.'
            }
        },
        {
            id: 'pg-5',
            title: 'ACID Guarantees & Transaction Isolation Levels',
            estMinutes: 5,
            concept: {
                summary: 'ACID guarantees Atomicity, Consistency, Isolation, and Durability. Isolation levels control how changes made by one transaction are visible to concurrent transactions: 1) READ COMMITTED (PostgreSQL default; sees only committed data, but subject to Non-Repeatable Reads and Phantom Reads), 2) REPEATABLE READ (takes a snapshot at transaction start; prevents non-repeatable reads), and 3) SERIALIZABLE (emulates serial execution; throws 40001 serialization_failure on write skew).',
                analogy: 'Reading a shared document: READ COMMITTED is reading paragraph by paragraph as other editors make live changes; REPEATABLE READ is printing out a physical photocopy of the document when you sit down so text never changes while you read; SERIALIZABLE ensures only one editor can submit edits at a time.',
                seniorInsight: 'In READ COMMITTED mode, checking a balance with SELECT and then running an UPDATE in two separate queries is NOT thread-safe. A concurrent transaction can deduct funds in between the two statements.'
            },
            trap: {
                title: 'Assuming READ COMMITTED isolation prevents concurrent race-condition overdrafts',
                juniorCode: `-- ❌ JUNIOR: Classic Check-Then-Act race condition in READ COMMITTED
-- Transaction 1:
SELECT balance FROM accounts WHERE id = 1; -- Returns 100
-- (Transaction 2 concurrently runs and deducts 100)
UPDATE accounts SET balance = balance - 100 WHERE id = 1; 
-- 💥 Account balance is now -100!`,
                seniorCode: `-- ✅ SENIOR: Atomic inline arithmetic or pessimistic row locking
-- Approach 1: Atomic conditional update (No locks, instant execution)
UPDATE accounts 
SET balance = balance - 100 
WHERE id = 1 AND balance >= 100;

-- Approach 2: Explicit row-level lock (FOR UPDATE)
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- Any other transaction trying to touch this row waits until COMMIT
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;`,
                explanation: 'A conditional UPDATE statement evaluates its WHERE clause atomically on the current row version, preventing race conditions without requiring higher isolation levels.'
            },
            drill: {
                question: 'What is a "Non-Repeatable Read" and which PostgreSQL isolation level prevents it?',
                hint: 'Think about what happens if you run the exact same SELECT query twice within the same transaction.',
                solution: `A Non-Repeatable Read occurs when a transaction reads the same row twice, but finds different data because another concurrent transaction committed changes in between the two reads.
REPEATABLE READ (and SERIALIZABLE) prevents Non-Repeatable Reads by capturing a single MVCC snapshot at the start of the transaction.`,
                explanation: 'In REPEATABLE READ, subsequent reads always see the exact snapshot taken at the transaction start.'
            },
            docLink: {
                title: 'PostgreSQL Manual: Transaction Isolation',
                url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
                description: 'The standard reference for MVCC snapshot isolation, dirty reads, and serializable conflict detection.'
            }
        },
        {
            id: 'pg-6',
            title: 'Pessimistic Row Locking (FOR UPDATE) & SKIP LOCKED',
            estMinutes: 5,
            concept: {
                summary: 'Pessimistic locking locks selected rows using SELECT ... FOR UPDATE or SELECT ... FOR SHARE, forcing concurrent transactions trying to acquire a lock on the same rows to wait until the holding transaction issues COMMIT or ROLLBACK. When building distributed queues or ticket booking systems, SELECT ... FOR UPDATE SKIP LOCKED instructs PostgreSQL to lock unlocked rows and skip already-locked rows without waiting.',
                analogy: 'A fitting room in a clothing store: SELECT FOR UPDATE is waiting in line outside a locked room until the occupant leaves. SKIP LOCKED is looking down a row of 20 fitting rooms, walking straight past any occupied rooms, and entering the very first unlocked room immediately.',
                seniorInsight: 'Never build a database worker queue with raw SELECT ... FOR UPDATE without SKIP LOCKED. All workers will pile up waiting behind worker #1, causing lock contention and serialization bottlenecks.'
            },
            trap: {
                title: 'Building a background job queue with SELECT FOR UPDATE without SKIP LOCKED',
                juniorCode: `-- ❌ JUNIOR: 10 worker threads run this simultaneously; all block on row #1!
BEGIN;
SELECT * FROM background_jobs 
WHERE status = 'QUEUED' 
ORDER BY id ASC 
LIMIT 1 FOR UPDATE; -- All 10 workers fight for the exact same lock!`,
                seniorCode: `-- ✅ SENIOR: High-concurrency worker polling with SKIP LOCKED
BEGIN;
SELECT * FROM background_jobs 
WHERE status = 'QUEUED' 
ORDER BY priority DESC, created_at ASC 
LIMIT 1 
FOR UPDATE SKIP LOCKED;

-- Mark job processing and commit:
UPDATE background_jobs 
SET status = 'PROCESSING', locked_by = 'worker_a', updated_at = NOW()
WHERE id = :job_id;
COMMIT;`,
                explanation: 'SKIP LOCKED allows multiple concurrent workers to dequeue independent jobs simultaneously with zero lock contention or blocking delays.'
            },
            drill: {
                question: 'What happens when two concurrent transactions attempt to lock the same two rows in reverse order? (e.g. Tx1 locks Row A then B; Tx2 locks Row B then A)',
                hint: 'What error does PostgreSQL raise when two transactions wait on each other?',
                solution: `A Deadlock occurs!
Transaction 1 waits for Transaction 2 to release Row B, while Transaction 2 waits for Transaction 1 to release Row A. Neither can progress.
PostgreSQL detects this circular dependency via its internal deadlock_timeout (default 1s) and forcefully aborts one of the transactions with:
ERROR: deadlock detected (SQLSTATE 40P01).`,
                explanation: 'To prevent deadlocks, all transactions in your codebase must acquire row locks in the exact same deterministic order (e.g. sorted by ID).'
            },
            docLink: {
                title: 'PostgreSQL Manual: The Locking Clause',
                url: 'https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE',
                description: 'Official syntax and rules for FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, and SKIP LOCKED.'
            }
        },
        {
            id: 'pg-7',
            title: 'Optimistic Concurrency Control (OCC) with Version Tokens',
            estMinutes: 5,
            concept: {
                summary: 'Pessimistic locking (FOR UPDATE) acquires database locks that hold open network connections and risk deadlocks. Optimistic Concurrency Control (OCC) assumes conflicts are rare: rows include a version integer or updated_at timestamp. During an update, the application checks WHERE version = :expectedVersion AND version = version + 1. If zero rows are updated, another user modified the record concurrently, allowing the app to reload and retry gracefully.',
                analogy: 'Collaborative document editing: rather than locking the entire document so your coworker cannot type while you are reading, both editors work freely. When you hit save, the server checks if you are saving on top of version 4. If someone already saved version 5, you are notified to rebase your changes.',
                seniorInsight: 'Use Optimistic Locking for human-interactive editing workflows (wikis, settings forms, user profiles) where holding a database transaction open while a human reads a screen would exhaust your database connection pool.'
            },
            trap: {
                title: 'Holding a database transaction open while awaiting an external third-party HTTP call',
                juniorCode: `// ❌ JUNIOR: Holds database row lock while calling Stripe API over internet
await db.$transaction(async (tx) => {
    const booking = await tx.$queryRaw\`SELECT * FROM bookings WHERE id = \${id} FOR UPDATE\`;
    
    // 💥 External network latency (2–5 seconds) holds open DB connection & row lock!
    const charge = await stripe.charges.create({ amount: booking.amount });
    
    await tx.booking.update({ where: { id }, data: { status: 'PAID' } });
});`,
                seniorCode: `// ✅ SENIOR: OCC with atomic state transitions without holding DB locks during I/O
// 1. Atomically claim intent to charge using version check (instant DB transaction):
const updated = await db.booking.updateMany({
    where: { id: bookingId, status: 'PENDING', version: currentVersion },
    data: { status: 'CHARGING', version: { increment: 1 } }
});
if (updated.count === 0) throw new ConflictError('Booking was modified concurrently');

// 2. Perform external network I/O outside of any database transaction:
const charge = await stripe.charges.create({ amount: booking.amount });

// 3. Mark completed:
await db.booking.update({
    where: { id: bookingId },
    data: { status: 'PAID', chargeId: charge.id }
});`,
                explanation: 'Never perform external HTTP requests, file uploads, or slow computation inside open database transactions. Isolate database state transitions from external network calls.'
            },
            drill: {
                question: 'How does an application know that an Optimistic Concurrency conflict occurred during an UPDATE statement?',
                hint: 'What does the database return when an UPDATE statement matches zero rows?',
                solution: `By checking the affected row count (or command tag UPDATE count):
In SQL: UPDATE products SET stock = stock - 1, version = version + 1 WHERE id = 10 AND version = 3;
If another transaction already committed version 4, the WHERE clause fails to match any row.
The database returns an affected row count of 0. When rowCount === 0, the application detects the conflict.`,
                explanation: 'A zero rowCount indicates that the record state shifted out from under the caller.'
            },
            docLink: {
                title: 'PostgreSQL Patterns: Concurrency and MVCC',
                url: 'https://www.postgresql.org/docs/current/mvcc.html',
                description: 'Understanding multi-version concurrency control, snapshots, and optimistic patterns.'
            }
        },
        {
            id: 'pg-8',
            title: 'Atomic Upserts & Deduplication (INSERT ... ON CONFLICT)',
            estMinutes: 5,
            concept: {
                summary: 'In high-throughput systems, checking if a record exists with SELECT before executing INSERT leads to duplicate key violations under concurrent traffic. PostgreSQL provides atomic upserts via INSERT ... ON CONFLICT (target_column) DO UPDATE or DO NOTHING. This operation evaluates unique constraints atomically at the engine level without race conditions.',
                analogy: 'A key hook in an office: instead of looking at the hook, walking over to make a new key, and discovering someone hung a key on the hook while you were walking (race condition), you walk up with the key: if the hook is empty, you hang it; if already occupied, you click the digital counter on the hook (DO UPDATE).',
                seniorInsight: 'The special table named EXCLUDED represents the row values that you attempted to insert. For example, DO UPDATE SET views = analytics.views + EXCLUDED.views dynamically combines existing and incoming data.'
            },
            trap: {
                title: 'Using application-level SELECT then INSERT instead of atomic ON CONFLICT',
                juniorCode: `// ❌ JUNIOR: Race condition! Two concurrent requests both pass the check
const exists = await db.userStats.findUnique({ where: { userId } });
if (!exists) {
    // Both requests enter here at the exact same millisecond:
    await db.userStats.create({ data: { userId, visitCount: 1 } });
    // 💥 Second request crashes with UniqueConstraintViolation (P2002)!
}`,
                seniorCode: `-- ✅ SENIOR: Atomic PostgreSQL upsert with DO UPDATE and EXCLUDED
INSERT INTO user_stats (user_id, last_seen, visit_count)
VALUES ('user_123', NOW(), 1)
ON CONFLICT (user_id) 
DO UPDATE SET 
    last_seen = EXCLUDED.last_seen,
    visit_count = user_stats.visit_count + EXCLUDED.visit_count;`,
                explanation: 'Atomic upserts resolve concurrency at the database kernel level, eliminating application race conditions and avoiding costly rollback transactions.'
            },
            drill: {
                question: 'What is required on the target column(s) for `INSERT INTO ... ON CONFLICT (column_name)` to be valid in PostgreSQL?',
                hint: 'What type of database constraint or index must be declared?',
                solution: `A UNIQUE constraint or UNIQUE index must exist on the column(s) specified in the ON CONFLICT target.
PostgreSQL uses the unique index to identify conflict collisions during row insertion. If no unique index matches the target, PostgreSQL raises a syntax error:
ERROR: there is no unique or exclusion constraint matching the ON CONFLICT specification.`,
                explanation: 'ON CONFLICT requires an explicit unique index or primary key constraint.'
            },
            docLink: {
                title: 'PostgreSQL Manual: INSERT ON CONFLICT Clause',
                url: 'https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT',
                description: 'Official specification for upserts, EXCLUDED pseudotables, and conflict targets.'
            }
        },
        {
            id: 'pg-9',
            title: 'JSONB Storage & GIN Inverted Indexes for Semi-Structured Data',
            estMinutes: 5,
            concept: {
                summary: 'PostgreSQL supports two JSON data types: JSON (stored as plain text, re-parsed on every read) and JSONB (decomposed binary format, slightly slower to write but drastically faster to query, sort, and index). Using Generalized Inverted Indexes (GIN) on JSONB columns enables lightning-fast querying on nested attributes, arrays, and keys using the containment operator (@>).',
                analogy: 'A physical library: plain JSON is storing a scanned PDF of a document (you have to re-read the entire document every time you want to find a word). JSONB with a GIN index is extracting every single keyword into a sorted back-of-the-book index with direct page pointers.',
                seniorInsight: 'Do not use JSONB as an excuse to avoid relational schema design. Relational columns are best for core business entities with foreign keys and strict constraints; JSONB is best for third-party webhook payloads, dynamic audit logs, and flexible user preferences.'
            },
            trap: {
                title: 'Using JSON instead of JSONB or using string LIKE to query JSON fields',
                juniorCode: `-- ❌ JUNIOR: Plain JSON type with slow substring query
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY,
    payload JSON NOT NULL -- Plain text! Cannot use GIN indexes!
);

-- Full table text search on every incoming request:
SELECT * FROM webhook_events WHERE payload::text LIKE '%"status":"failed"%';`,
                seniorCode: `-- ✅ SENIOR: JSONB with GIN index and containment operator (@>)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payload JSONB NOT NULL
);

-- Fast GIN inverted index on top-level and nested JSON attributes:
CREATE INDEX idx_webhooks_payload ON webhook_events USING gin (payload);

-- Query utilizes the GIN index using the containment operator (@>):
SELECT * FROM webhook_events 
WHERE payload @> '{"event": "payment_failed", "customer": {"tier": "enterprise"}}';`,
                explanation: 'The @> containment operator paired with a GIN index queries nested documents in O(log N) time, turning PostgreSQL into a high-performance document store.'
            },
            drill: {
                question: 'What is the performance difference between the JSON operator ->> and the operator ->?',
                hint: 'Look at the data type returned by each operator.',
                solution: `-> returns a JSON/JSONB object (preserving quotes, types, and nested structure):
payload->'user' -- Returns {"name": "Alex"} as JSONB

->> returns the extracted value as plain text (unquoted string):
payload->'user'->>'name' -- Returns Alex as text

For SQL comparisons (WHERE payload->>'status' = 'ACTIVE'), ->> is used so the string matches the SQL text literal.`,
                explanation: '-> extracts nested JSON objects, while ->> casts the final leaf value to a standard text string.'
            },
            docLink: {
                title: 'PostgreSQL Manual: JSON Types & GIN Indexing',
                url: 'https://www.postgresql.org/docs/current/datatype-json.html',
                description: 'Comprehensive guide to JSONB operators, path queries, and GIN index configuration.'
            }
        },
        {
            id: 'pg-10',
            title: 'Full-Text Search with tsvector, tsquery & GIN Indexes',
            estMinutes: 5,
            concept: {
                summary: 'Standard SQL wildcard queries (WHERE title LIKE "%keyword%") cannot use B-Tree indexes and require full sequential scans. PostgreSQL includes an enterprise full-text search engine built around two core types: tsvector (a sorted list of distinct normalized lexemes/word roots) and tsquery (search terms with Boolean operators &, |, !). Storing tsvectors with GIN indexes delivers sub-millisecond search across millions of documents.',
                analogy: 'Searching an encyclopedia: LIKE "%jump%" requires scanning every syllable on every page. Full-text search stems "jumping", "jumped", and "jumps" to the root lexeme "jump", matching all variations instantly from an alphabetical index.',
                seniorInsight: 'Use a generated column (GENERATED ALWAYS AS ... STORED) to precompute the tsvector on INSERT/UPDATE, eliminating the CPU cost of tokenizing text during search queries.'
            },
            trap: {
                title: 'Using ILIKE with leading wildcards for text search on large production tables',
                juniorCode: `-- ❌ JUNIOR: Leading wildcard LIKE query
SELECT * FROM articles 
WHERE title ILIKE '%developer%' OR content ILIKE '%developer%';
-- 💥 Sequential scan across 5,000,000 rows; 100% CPU spike!`,
                seniorCode: `-- ✅ SENIOR: Generated tsvector column backed by GIN index
ALTER TABLE articles ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') || 
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
) STORED;

CREATE INDEX idx_articles_search ON articles USING gin (search_vector);

-- Lightning-fast indexed search with stemming and ranking:
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'developer & remote') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;`,
                explanation: 'Generated tsvector columns precompute lexemes during writes. The @@ operator uses the GIN index to deliver sub-millisecond full-text searches with relevance ranking.'
            },
            drill: {
                question: 'Why does full-text search with to_tsvector("english", "The cats are running") match the search query to_tsquery("english", "cat & run")?',
                hint: 'Consider stemming and stop words.',
                solution: `Because of normalization and stemming:
1. Stop words ("The", "are") are removed because they carry no semantic search value.
2. English stemming reduces "cats" to the lexeme "cat" and "running" to the lexeme "run".
The stored vector is 'cat':2 'run':4, which exactly matches the query 'cat' & 'run'.`,
                explanation: 'Stemming ensures variations in plurals and verb tenses match without manual regexes.'
            },
            docLink: {
                title: 'PostgreSQL Manual: Full Text Search',
                url: 'https://www.postgresql.org/docs/current/textsearch.html',
                description: 'Official guide to language dictionaries, tsvector weights, and ts_rank algorithms.'
            }
        },
        {
            id: 'pg-11',
            title: 'Connection Pooling & PgBouncer Mechanics (Session vs Transaction)',
            estMinutes: 5,
            concept: {
                summary: 'PostgreSQL uses a process-based connection model: every direct client connection spawns a separate backend OS process consuming ~5–10MB of RAM and competing for CPU scheduler time. Exceeding a few hundred direct connections causes severe context-switching performance degradation. Connection poolers like PgBouncer maintain a small pool of direct database connections (e.g. 50) and multiplex thousands of client connections over them.',
                analogy: 'A bank teller counter: instead of hiring 2,000 bank tellers who sit idle at empty desks all day (direct connections), the bank maintains 10 active tellers who serve customer transactions in rapid succession as they arrive at the queue (connection pooling).',
                seniorInsight: 'In Transaction Pooling mode, a database connection is returned to the pool the moment a transaction finishes. This means session-level state (prepared statements, LISTEN/NOTIFY, TEMPORARY TABLEs) will leak or fail unless configured specifically (e.g. Prisma connection string flag ?pgbouncer=true).'
            },
            trap: {
                title: 'Connecting serverless functions directly to PostgreSQL without connection pooling',
                juniorCode: `// ❌ JUNIOR: Serverless Next.js route connects directly to Postgres port 5432
// When 1,000 users visit the site, 1,000 serverless lambda instances spin up
// and open 1,000 direct connections:
const client = new Client({ connectionString: 'postgresql://db:5432/prod' });
await client.connect();
// 💥 FATAL: "remaining connection slots are reserved for non-replication superuser connections"`,
                seniorCode: `// ✅ SENIOR: Connect through PgBouncer or serverless connection pool (e.g. Neon, Supabase)
// Port 6543 / pooler URL with transaction-level pooling:
const poolerUrl = process.env.DATABASE_URL; // 'postgresql://db:6543/prod?pgbouncer=true'

// Configure Prisma or pg driver with connection pool limits:
export const prisma = new PrismaClient({
    datasources: { db: { url: poolerUrl } },
    log: ['error']
});`,
                explanation: 'Using transaction-level connection pooling allows hundreds of ephemeral serverless functions to share a compact, high-efficiency pool of physical database connections.'
            },
            drill: {
                question: 'What is the crucial difference between Session Pooling and Transaction Pooling in PgBouncer?',
                hint: 'When is the physical server connection released back to the pool?',
                solution: `Session Pooling:
PgBouncer assigns a physical database connection when the client connects, and holds it until the client completely disconnects. Safe for all session features, but limits total concurrent clients to the pool size.

Transaction Pooling:
PgBouncer assigns a physical connection ONLY for the duration of a single transaction (BEGIN ... COMMIT). As soon as the transaction ends, the connection is instantly given to another client. Delivers maximum connection concurrency, but forbids session-level state (like SET TIME ZONE or prepared statements without special handling).`,
                explanation: 'Transaction pooling is the industry standard for high-throughput microservices and serverless architectures.'
            },
            docLink: {
                title: 'PgBouncer Architecture & Pooling Modes',
                url: 'https://www.pgbouncer.org/features.html',
                description: 'Official guide on configuring Session, Transaction, and Statement pooling modes.'
            }
        },
        {
            id: 'pg-12',
            title: 'Declarative Table Partitioning for High-Volume Timeseries',
            estMinutes: 5,
            concept: {
                summary: 'When tables grow beyond tens of millions of rows (audit logs, metrics, sensor events), single B-Tree indexes become too large to fit in RAM, degrading query performance. Declarative Partitioning splits one logical table into smaller physical partition tables by RANGE, LIST, or HASH. When queries filter by the partition key (e.g. created_at), the planner performs Partition Pruning, scanning only the relevant partition.',
                analogy: 'Filing tax receipts: instead of dumping 20 years of business receipts into one gigantic 500-pound box, you maintain 20 separate labeled binders (one per year). When auditing 2024, you pull only the 2024 binder off the shelf and leave the other 19 untouched.',
                seniorInsight: 'Deleting old records from a 100M row table with DELETE FROM table WHERE created_at < NOW() - INTERVAL "1 year" generates massive WAL traffic, locks tables, and creates table bloat. With partitioning, dropping an old partition table is instantaneous: DROP TABLE logs_2023_q1.'
            },
            trap: {
                title: 'Deleting millions of old rows with DELETE instead of dropping partitions',
                juniorCode: `-- ❌ JUNIOR: Deleting 10,000,000 rows on a live table
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '6 months';
-- 💥 Takes 45 minutes, spikes disk I/O to 100%, generates gigabytes of WAL logs,
-- and leaves massive dead-tuple table bloat requiring VACUUM FULL!`,
                seniorCode: `-- ✅ SENIOR: Declarative Range Partitioning with instant zero-cost partition drops
CREATE TABLE audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL,
    organization_id UUID NOT NULL,
    event TEXT NOT NULL,
    PRIMARY KEY (id, created_at) -- Partition key must be part of primary key
) PARTITION BY RANGE (created_at);

-- Create quarterly partition tables:
CREATE TABLE audit_logs_2026_q1 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE audit_logs_2026_q2 PARTITION OF audit_logs
    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

-- To archive/purge Q1 2026 data instantly in O(1) time with ZERO bloat:
DROP TABLE audit_logs_2026_q1;`,
                explanation: 'Dropping a partition is an instantaneous DDL operation that immediately frees disk space without vacuum bloat, WAL spikes, or row lock contention.'
            },
            drill: {
                question: 'What is "Partition Pruning" and why does it make queries on partitioned tables fast?',
                hint: 'How does the query optimizer know which partitions to exclude?',
                solution: `Partition Pruning is a query optimization technique where PostgreSQL examines the query WHERE clause and determines at plan/execution time which partition tables CANNOT contain matching data.
The database completely excludes those irrelevant partitions from the execution plan, reading only the exact physical table segment needed.`,
                explanation: 'Partition pruning ensures queries only scan the fraction of data that matches the partition boundaries.'
            },
            docLink: {
                title: 'PostgreSQL Manual: Table Partitioning',
                url: 'https://www.postgresql.org/docs/current/ddl-partitioning.html',
                description: 'Official documentation for declarative range, list, and hash partitioning and partition maintenance.'
            }
        }
    ]
};
