import { SkillRoadmap } from './types';
export const postgresqlRoadmap: SkillRoadmap = {
        skillId: 'postgresql',
        skillName: 'PostgreSQL & Database Design',
        category: 'DATA STORAGE',
        tagline: 'Relational modeling, B-Tree index optimization, ACID transactions, and query plans.',
        accentColor: '#0284c7',
        officialDocs: [
            {
                title: 'PostgreSQL Official Documentation',
                url: 'https://www.postgresql.org/docs/current/index.html',
                description: 'The canonical database manual for query optimization, indexes, and concurrency.',
                badge: 'Official Manual'
            },
            {
                title: 'Use The Index, Luke!',
                url: 'https://use-the-index-luke.com/',
                description: 'The industry-standard SQL indexing guide for backend developers.',
                badge: 'Indexing Bible'
            },
            {
                title: 'PG Exercises Interactive Playground',
                url: 'https://pgexercises.com/',
                description: 'Interactive real-world SQL exercises covering joins, aggregates, and recursive queries.',
                badge: 'Interactive SQL Labs'
            }
        ],
        checkpoints: [
            {
                id: 'pg-1',
                title: 'B-Tree Composite Indexes & Leftmost Prefix Rule',
                estMinutes: 5,
                concept: {
                    summary: 'A composite index on (A, B) sorts first by column A, then by column B. Queries filtering by A alone or (A and B) will use the index, but queries filtering ONLY by B cannot use it.',
                    analogy: 'A phone book sorted by (Last Name, First Name). You can easily find all people with Last Name "Smith", but finding everyone with First Name "John" requires reading the entire book from page 1.',
                    seniorInsight: 'Senior backend engineers order composite index columns by equality filters first, followed by range/sort filters to ensure optimal index scans.'
                },
                trap: {
                    title: 'Creating an index on (org_id, created_at) and expecting it to optimize queries on created_at alone',
                    juniorCode: `-- âŒ JUNIOR ASSUMPTION: Index exists on (org_id, created_at), so this query should be fast:
SELECT * FROM audit_logs WHERE created_at > NOW() - INTERVAL '1 day';
-- Result: FULL TABLE SCAN! The index cannot jump to created_at without org_id.`,
                    seniorCode: `-- âœ… SENIOR SOLUTION: Create a dedicated index or lead with the search filter
CREATE INDEX idx_audit_created ON audit_logs (created_at DESC);
-- Or if queries are always scoped by organization:
SELECT * FROM audit_logs WHERE org_id = 'org_123' AND created_at > NOW() - INTERVAL '1 day';`,
                    explanation: 'PostgreSQL B-Tree indexes must follow the leftmost prefix. If column A is omitted from the WHERE clause, the index on (A, B) is bypassed.'
                },
                drill: {
                    question: 'If you have an index on (status, priority, created_at), which of these WHERE clauses CANNOT use the index efficiently?',
                    starterCode: `Query 1: WHERE status = 'open' AND priority = 1
Query 2: WHERE priority = 1 AND created_at > NOW()
Query 3: WHERE status = 'open' AND created_at > NOW()`,
                    solution: `Query 2 CANNOT use the index efficiently!
Explanation: Query 2 skips the leftmost column (status). The index starts by sorting on status; without status, PostgreSQL must perform a sequential scan.`,
                    explanation: 'Query 1 uses the first two columns. Query 3 can use the index on status to filter rows before scanning created_at. Query 2 cannot enter the index tree.'
                },
                docLink: {
                    title: 'PostgreSQL: Multicolumn Indexes',
                    url: 'https://www.postgresql.org/docs/current/indexes-multicolumn.html',
                    description: 'Official guide on column order and execution planning in composite indexes.'
                }
            },
            {
                id: 'pg-2',
                title: 'Preventing the N+1 Query Problem',
                estMinutes: 5,
                concept: {
                    summary: 'The N+1 query problem occurs when an application executes 1 initial query to fetch parent records, followed by N separate queries to fetch related children inside a loop.',
                    analogy: 'Going to the grocery store to buy 10 ingredients, but making 10 individual trips to buy one ingredient at a time instead of putting all 10 in a single shopping cart.',
                    seniorInsight: 'Senior developers detect N+1 queries using ORM logging and fix them using SQL JOINs, subqueries, or dataloader batching (WHERE id IN (...)).'
                },
                trap: {
                    title: 'Querying child relationships inside a JavaScript map() loop',
                    juniorCode: `// âŒ JUNIOR: 1 query for users + 100 queries for each user's orders = 101 queries!
const users = await db.query('SELECT * FROM users LIMIT 100');
for (const user of users) {
    user.orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [user.id]);
}`,
                    seniorCode: `// âœ… SENIOR: Single query with JOIN or Prisma relation inclusion
const usersWithOrders = await prisma.user.findMany({
    take: 100,
    include: { orders: true } // Fetches users and orders in 1 or 2 optimized queries!
});`,
                    explanation: 'Running queries inside loops multiplies network latency by N. Using JOINs or batching IN (...) executes the entire retrieval in constant time (O(1)).'
                },
                drill: {
                    question: 'Write a single SQL query to fetch all users and their total order counts without running a query per user.',
                    hint: 'Use a LEFT JOIN and GROUP BY.',
                    solution: `SELECT u.id, u.name, COUNT(o.id) AS total_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;`,
                    explanation: 'A LEFT JOIN connects users to orders in a single database pass, and COUNT with GROUP BY aggregates the count directly in the database engine.'
                },
                docLink: {
                    title: 'Prisma Guide: Solving the N+1 Query Problem',
                    url: 'https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#the-n1-problem',
                    description: 'Understanding N+1 queries and how to batch relations efficiently.'
                }
            }
        ]
};
