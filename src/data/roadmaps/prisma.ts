import { SkillRoadmap } from './types';

export const prismaRoadmap: SkillRoadmap = {
    skillId: 'prisma',
    skillName: 'Prisma ORM & Schema Migrations',
    category: 'DATA STORAGE',
    tagline: 'Declarative schema modeling, end-to-end type safety, zero-downtime migrations, client extensions, and high-concurrency connection pooling.',
    accentColor: '#10b981',
    officialDocs: [
        {
            title: 'Prisma Official Documentation',
            url: 'https://www.prisma.io/docs',
            description: 'The canonical documentation for Prisma Client, Prisma Migrate, schema syntax, and relation filters.',
            badge: 'Official Canonical Docs'
        },
        {
            title: 'Prisma Interactive Getting Started & Tutorials',
            url: 'https://www.prisma.io/docs/getting-started',
            description: 'Step-by-step interactive walkthroughs for modeling relational schemas, seeding data, and querying with TypeScript.',
            badge: 'Official Interactive Course'
        },
        {
            title: 'Prisma Data Guide: Relational Database Architecture',
            url: 'https://www.prisma.io/dataguide',
            description: 'In-depth educational guide on normalization, indexing, connection pooling, and ACID transactions.',
            badge: 'Architecture Guide'
        }
    ],
    checkpoints: [
        {
            id: 'prisma-1',
            title: 'Declarative Schema Modeling & Type Generation',
            estMinutes: 5,
            concept: {
                summary: 'Prisma replaces manual SQL DDL files and disjointed TypeScript interfaces with a single source of truth: schema.prisma. Running `prisma generate` parses models, fields, enums, and relation attributes (@id, @default, @unique, @relation) to generate an end-to-end type-safe TypeScript client tailored strictly to your database structure.',
                analogy: 'An architectural laser blueprint: instead of an architect drawing a floor plan and a separate construction crew guessing the room dimensions in wood, the digital CAD model automatically manufactures precision prefabricated walls that fit together with zero millimeter error.',
                seniorInsight: 'Always run `prisma generate` in your CI/CD build scripts immediately following `npm install` (via postinstall or build lifecycle). Prisma generates code into node_modules/.prisma/client, which is excluded from git.'
            },
            trap: {
                title: 'Manually duplicating Prisma types in TypeScript interfaces instead of importing generated models',
                juniorCode: `// ❌ JUNIOR: Manual TypeScript interface that drifts from the database schema
interface User {
    id: string;
    email: string;
    role: string; // Database renamed role to userRole or added enum, but this interface never caught it!
}`,
                seniorCode: `// ✅ SENIOR: Import 100% synchronized types directly from Prisma Client
import { User, Prisma } from '@prisma/client';

// For payload validation with exact nested relations:
type UserWithPosts = Prisma.UserGetPayload<{
    include: { posts: true; profile: true }
}>;

// For type-safe input arguments:
function createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
}`,
                explanation: 'Using Prisma.UserGetPayload and Prisma.UserCreateInput guarantees that database column renames, nullability changes, or new fields immediately trigger TypeScript compilation errors across your codebase.'
            },
            drill: {
                question: 'What is the purpose of the `Prisma.UserGetPayload` utility type?',
                hint: 'What type does a query return when you use `include: { profile: true }`?',
                solution: `Prisma.UserGetPayload<{ include: ... }> calculates the exact TypeScript return type of a query with nested relation includes or field selections.
Without it, TypeScript only knows the base User model (without posts or profile), forcing developers into unsafe type assertions ("as any").`,
                explanation: 'UserGetPayload generates exact types for any custom combination of select and include clauses.'
            },
            docLink: {
                title: 'Prisma Docs: Generating the Client',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client',
                description: 'Official guide on client compilation, custom output paths, and type inference.'
            }
        },
        {
            id: 'prisma-2',
            title: 'Relational Modeling: 1:1, 1:N, and Implicit vs Explicit M:N',
            estMinutes: 5,
            concept: {
                summary: 'Prisma models relationships via the @relation attribute. While 1:1 and 1:N relations define foreign keys directly, Many-to-Many (M:N) relations can be defined either as Implicit (Prisma automatically creates and manages a hidden join table like _PostToTag) or Explicit (you declare the join model explicitly to store extra metadata like assignedAt or role).',
                analogy: 'A company badge system: an implicit M:N relation is a blank visitor sticker saying "Guest X visited Room Y". An explicit M:N relation is an official visitor log entry that also records who authorized the visit, the timestamp, and whether an escort was required.',
                seniorInsight: 'Use Implicit M:N relations only for simple tagging systems. If the relationship ever needs metadata in the future (e.g. invitedBy, joinedAt, permissions), you must migrate to an Explicit relation model.'
            },
            trap: {
                title: 'Using Implicit Many-to-Many when the relationship requires timestamp or status metadata',
                juniorCode: `// ❌ JUNIOR: Implicit relation cannot store when a user joined a project
model User {
    id       String    @id @default(uuid())
    projects Project[] // Implicit relation: creates _ProjectToUser join table with ONLY IDs
}

model Project {
    id    String @id @default(uuid())
    users User[]
}`,
                seniorCode: `-- ✅ SENIOR: Explicit join model with composite primary key and contextual metadata
model User {
    id          String           @id @default(uuid())
    memberships ProjectMember[]
}

model Project {
    id          String           @id @default(uuid())
    members     ProjectMember[]
}

model ProjectMember {
    userId     String
    projectId  String
    role       ProjectRole   @default(MEMBER)
    assignedAt DateTime      @default(now())
    assignedBy String

    user       User          @relation(fields: [userId], references: [id], onDelete: Cascade)
    project    Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)

    @@id([userId, projectId]) // Composite primary key prevents duplicate memberships
    @@index([projectId])      // Essential foreign key index
}`,
                explanation: 'Explicit join models allow you to query memberships with roles, filter by assignment dates, and enforce composite primary keys to guarantee uniqueness.'
            },
            drill: {
                question: 'What does `onDelete: Cascade` do in a Prisma relation attribute?',
                hint: 'What happens to child records when the parent entity is deleted?',
                solution: `onDelete: Cascade instructs the database to automatically delete all dependent child records when the parent record is deleted.
For example, deleting a User will automatically delete all of their ProjectMember records, preventing foreign key constraint violation errors.`,
                explanation: 'Cascade delete keeps the database clean and avoids orphaned records without requiring manual multi-step deletion code.'
            },
            docLink: {
                title: 'Prisma Docs: Relations Guide',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-schema/relations',
                description: 'Complete specification for one-to-one, one-to-many, and many-to-many relationships.'
            }
        },
        {
            id: 'prisma-3',
            title: 'Production Migration Lifecycle & Zero-Downtime Expand-and-Contract',
            estMinutes: 5,
            concept: {
                summary: 'Prisma Migrate maintains a history of versioned SQL files in `prisma/migrations`. In development, `prisma migrate dev` creates and applies new SQL migrations. In production CI/CD pipelines, ONLY `prisma migrate deploy` must be executed. It applies unexecuted migration files against the `_prisma_migrations` table without prompting or altering schema definitions.',
                analogy: 'Installing pre-inspected steel beams on a skyscraper: `prisma migrate dev` is the engineering lab drafting and stress-testing the beam blueprints; `prisma migrate deploy` is the crane operator installing the pre-approved beams on the live construction site.',
                seniorInsight: 'Never run `prisma db push` or `prisma migrate dev` in production. Both commands can result in accidental data loss and bypass migration version tracking.'
            },
            trap: {
                title: 'Renaming a database column directly in schema.prisma during a live deployment',
                juniorCode: `// ❌ JUNIOR: Renames column directly in one step:
// Old: fullName String
// New: name     String
// Prisma generates: ALTER TABLE "User" DROP COLUMN "fullName"; ALTER TABLE "User" ADD COLUMN "name" TEXT;
// 💥 All user names in production are permanently DELETED!
// 💥 Old server instances still running during rolling deploy crash instantly looking for "fullName"!`,
                seniorCode: `// ✅ SENIOR: 3-Phase Expand-and-Contract Migration Strategy
// Phase 1 (Expand): Add new column as optional without deleting old column
model User {
    id       String  @id @default(uuid())
    fullName String? // Kept temporarily
    name     String? // New column deployed first
}
// Deploy app code that writes to BOTH columns and reads from "name || fullName".

// Phase 2: Backfill existing production records with SQL:
// UPDATE "User" SET name = "fullName" WHERE name IS NULL;

// Phase 3 (Contract): After 100% of servers run new code, drop old column in a final migration.`,
                explanation: 'Directly renaming columns drops the old column and creates a fresh empty one. The Expand-and-Contract pattern guarantees zero data loss and zero downtime during rolling container deployments.'
            },
            drill: {
                question: 'Why should you never run `npx prisma db push --accept-data-loss` in production?',
                hint: 'Does db push track migration history?',
                solution: `Because prisma db push synchronizes the database directly without generating or tracking SQL migration files.
If a column or table definition has changed, it will silently drop production tables and columns if required to match the schema, destroying user data without an audit log or rollback path.`,
                explanation: 'Only prisma migrate deploy should be used in production CI/CD.'
            },
            docLink: {
                title: 'Prisma Guide: Production Deployment Best Practices',
                url: 'https://www.prisma.io/docs/guides/deployment/deploy-database-changes-with-prisma-migrate',
                description: 'Automating database migrations in CI/CD pipelines with zero downtime.'
            }
        },
        {
            id: 'prisma-4',
            title: 'Solving the N+1 Query Problem with include vs select',
            estMinutes: 5,
            concept: {
                summary: 'The N+1 query problem occurs when an application executes 1 initial query to fetch N parent records, and then executes N separate database queries inside a loop to fetch each child relation. Prisma solves this natively: when you use `include: { posts: true }`, Prisma executes exactly TWO queries (one for users, and one using `WHERE userId IN (...)`), assembling the relational tree in Node memory.',
                analogy: 'Ordering groceries for 50 neighbors: the N+1 trap is driving to the supermarket 50 separate times to buy one bag of milk per trip. Prisma batching is driving to the supermarket once, loading all 50 milk bags into the van, and sorting them when you return home.',
                seniorInsight: 'Avoid blindly using `include: { relation: true }` on wide models. Use `select` to fetch only the exact fields your frontend UI needs, preventing high database memory serialization and network overhead.'
            },
            trap: {
                title: 'Iterating over records with map/for-of and executing queries in the loop',
                juniorCode: `// ❌ JUNIOR: 1 query for 100 users + 100 queries for orders = 101 database round-trips!
const users = await prisma.user.findMany({ take: 100 });

const result = await Promise.all(
    users.map(async (user) => {
        const orders = await prisma.order.findMany({ where: { userId: user.id } }); // N queries!
        return { ...user, orders };
    })
);`,
                seniorCode: `// ✅ SENIOR: Batched relation fetching with field selection (exactly 2 queries)
const usersWithOrders = await prisma.user.findMany({
    take: 100,
    select: {
        id: true,
        email: true,
        orders: {
            select: {
                id: true,
                totalCents: true,
                createdAt: true
            },
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' }
        }
    }
});
// Prisma executes:
// 1. SELECT id, email FROM "User" LIMIT 100;
// 2. SELECT id, totalCents, createdAt, userId FROM "Order" WHERE userId IN (...) AND status = 'COMPLETED';`,
                explanation: 'Prisma internal query engine batches relation lookups using SQL IN operators, transforming 101 round-trips into 2 optimized queries.'
            },
            drill: {
                question: 'Can you use both `select` and `include` at the top level of the same Prisma query?',
                hint: 'What does the Prisma query compiler enforce when specifying returned fields?',
                solution: `No. Prisma throws a compilation error if you specify both "select" and "include" at the same level.
When using "select", you define the entire shape of the returned object—including any relations you wish to fetch (e.g. select: { id: true, posts: { select: { title: true } } }).`,
                explanation: 'select and include are mutually exclusive at the same query object level.'
            },
            docLink: {
                title: 'Prisma Docs: Select fields and Include relations',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/select-fields',
                description: 'Optimizing payload sizes with selective field querying and nested includes.'
            }
        },
        {
            id: 'prisma-5',
            title: 'Interactive vs Sequential Batch Transactions ($transaction)',
            estMinutes: 5,
            concept: {
                summary: 'Prisma provides two transaction modes: Sequential Batch (`prisma.$transaction([op1, op2])`) which executes a list of queries atomically in a single database transaction, and Interactive Transactions (`prisma.$transaction(async (tx) => { ... })`) which passes a scoped transaction client (tx) allowing intermediate application logic, calculations, and conditional branching before committing.',
                analogy: 'Sending money: a Batch Transaction is an automated wire form with 2 fixed checkboxes: deduct $100 from Account A, add $100 to Account B. An Interactive Transaction is an in-person teller interview: check Account A balance, if balance is sufficient, calculate foreign exchange rate, deduct fee, and credit Account B.',
                seniorInsight: 'Interactive transactions hold an active database connection and open transaction locks for the entire duration of the async callback. Always configure explicit timeouts: `prisma.$transaction(async (tx) => { ... }, { maxWait: 5000, timeout: 10000 })`.'
            },
            trap: {
                title: 'Using the global prisma client inside an interactive transaction callback',
                juniorCode: `// ❌ JUNIOR: Calls the global prisma client inside $transaction instead of tx!
await prisma.$transaction(async (tx) => {
    // 💥 BUG: "prisma.account" runs OUTSIDE the transaction on a different connection!
    const account = await prisma.account.update({
        where: { id: senderId },
        data: { balance: { decrement: 100 } }
    });

    // If this fails, the update above is NOT rolled back!
    await tx.transferLog.create({ data: { accountId: senderId, amount: 100 } });
});`,
                seniorCode: `// ✅ SENIOR: Strictly uses the scoped tx client with timeout protection
const result = await prisma.$transaction(async (tx) => {
    // Both operations run on the exact same transactional connection:
    const sender = await tx.account.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
    });

    if (sender.balance < 0) {
        throw new Error('Insufficient funds: rolling back transaction');
    }

    const receiver = await tx.account.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } }
    });

    return { sender, receiver };
}, {
    maxWait: 3000, // Max time to wait for a connection from pool (3s)
    timeout: 5000  // Max execution time before automatic rollback (5s)
});`,
                explanation: 'Only calls made against the provided `tx` object participate in the atomic database transaction. Any error thrown inside the callback triggers an immediate, safe rollback.'
            },
            drill: {
                question: 'When should you prefer a Sequential Batch Transaction (`$transaction([op1, op2])`) over an Interactive Transaction?',
                hint: 'Does operation 2 depend on the output value of operation 1?',
                solution: `Use Sequential Batch Transactions when you have multiple independent operations that do not require intermediate JavaScript calculation or conditional branching.
Batch transactions are faster, consume less connection resources, and execute in a single round-trip to the Prisma query engine.`,
                explanation: 'Batch transactions eliminate the overhead of interactive network back-and-forth between Node.js and the database.'
            },
            docLink: {
                title: 'Prisma Docs: Transactions and Concurrency',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/transactions',
                description: 'Official guide on batch transactions, interactive callbacks, and isolation levels.'
            }
        },
        {
            id: 'prisma-6',
            title: 'Client Extensions ($extends) for Soft Deletes & Multi-Tenancy',
            estMinutes: 5,
            concept: {
                summary: 'Prisma Client Extensions (`prisma.$extends`) allow you to enhance Prisma Client with custom functionality across models, queries, and results. You can intercept every query to automatically filter out soft-deleted records (`WHERE deletedAt IS NULL`) or inject organization scoping (`WHERE organizationId = currentOrgId`), preventing data leakage across your entire application without modifying every repository call.',
                analogy: 'A security lens on a camera: rather than manually checking every single photo to ensure classified documents are blurred out, the specialized camera lens automatically blurs classified text at the moment the shutter clicks.',
                seniorInsight: 'Client extensions completely replace deprecated Prisma query middleware ($use), offering full TypeScript type inference and custom model method creation.'
            },
            trap: {
                title: 'Relying on developers to remember soft-delete and tenant filters on every query',
                juniorCode: `// ❌ JUNIOR: Developer forgot to add "deletedAt: null", exposing deleted user data!
app.get('/users', async (req, res) => {
    // 💥 Returns deleted users and cross-tenant users because filter was omitted!
    const users = await prisma.user.findMany();
    res.json(users);
});`,
                seniorCode: `// ✅ SENIOR: Centralized Prisma Extension for automated soft-delete enforcement
export const db = prisma.$extends({
    query: {
        user: {
            async findMany({ args, query }) {
                // Automatically inject deletedAt: null into where clause
                args.where = { ...args.where, deletedAt: null };
                return query(args);
            },
            async findUnique({ args, query }) {
                args.where = { ...args.where, deletedAt: null };
                return query(args);
            },
            async delete({ args }) {
                // Transform delete() into a soft delete (update deletedAt)
                return prisma.user.update({
                    where: args.where,
                    data: { deletedAt: new Date() }
                });
            }
        }
    }
});

// Now standard queries automatically exclude soft-deleted records:
const activeUsers = await db.user.findMany();`,
                explanation: 'Client extensions enforce multi-tenant boundaries and soft-delete invariants at the driver level, making security leaks structurally impossible.'
            },
            drill: {
                question: 'What are the four main types of extensions supported by `prisma.$extends`?',
                hint: 'Think about modifying models, client instances, queries, and returned results.',
                solution: `The 4 extension types are:
1. model: Add custom methods to models (e.g. prisma.user.signUp()).
2. client: Add top-level helper methods to the PrismaClient instance.
3. query: Intercept, modify, or log raw query arguments and execution.
4. result: Add computed virtual fields to query results (e.g. user.fullName computed from firstName + lastName).`,
                explanation: 'Prisma extensions provide a modular, composable plugin architecture with 100% type safety.'
            },
            docLink: {
                title: 'Prisma Docs: Client Extensions Overview',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions',
                description: 'Creating composable extensions for soft deletes, multi-tenancy, and computed properties.'
            }
        },
        {
            id: 'prisma-7',
            title: 'Raw SQL Execution & Injection Safety ($queryRaw vs $queryRawUnsafe)',
            estMinutes: 5,
            concept: {
                summary: 'When queries require complex PostgreSQL features not directly expressed in Prisma Client (e.g. recursive CTEs, window functions, full-text ranking, spatial PostGIS queries), Prisma provides `$queryRaw`. Using tagged template literals (`$queryRaw\`SELECT * FROM users WHERE id = \${userId}\``), Prisma automatically converts interpolations into parameterized SQL ($1, $2), completely preventing SQL Injection.',
                analogy: 'A bank teller deposit slip: `$queryRaw` is writing your name in a designated, bounded box on the deposit slip (parameterized data). `$queryRawUnsafe` is letting someone paste arbitrary text onto the bank ledger with scissors and glue.',
                seniorInsight: 'Never use `prisma.$queryRawUnsafe` with concatenated user strings. If dynamic table or column identifiers must be injected, use `Prisma.raw()` or `Prisma.sql` helper functions with strict input allowlists.'
            },
            trap: {
                title: 'Using string concatenation inside $queryRawUnsafe, creating critical SQL injection',
                juniorCode: `// ❌ JUNIOR: Catastrophic SQL injection vulnerability
app.get('/users/search', async (req, res) => {
    const searchTerm = req.query.term; // Attacker sends: "' OR '1'='1"
    const users = await prisma.$queryRawUnsafe(
        "SELECT * FROM \"User\" WHERE email = '" + searchTerm + "'"
    );
    res.json(users);
});`,
                seniorCode: `// ✅ SENIOR: Parameterized Tagged Template Literal with typed return values
import { Prisma } from '@prisma/client';

interface UserSearchResult {
    id: string;
    email: string;
    rank: number;
}

app.get('/users/search', async (req, res, next) => {
    try {
        const searchTerm = String(req.query.term || '');

        // Prisma automatically parameterizes \${searchTerm} into $1:
        const users = await prisma.$queryRaw<UserSearchResult[]>\`
            SELECT id, email, ts_rank(search_vector, to_tsquery('english', \${searchTerm})) AS rank
            FROM "User"
            WHERE search_vector @@ to_tsquery('english', \${searchTerm})
            ORDER BY rank DESC
            LIMIT 20;
        \`;

        res.json(users);
    } catch (err) {
        next(err);
    }
});`,
                explanation: 'Tagged template literals compile parameters into isolated database placeholders, ensuring user input is never interpreted as executable SQL syntax.'
            },
            drill: {
                question: 'Why does prisma.$queryRaw with tagged template literals prevent SQL injection while Prisma.raw with string interpolation does not?',
                hint: 'How does tagged template literal parsing differ from standard string evaluation?',
                solution: `Tagged template literals pass strings and values as separate arguments to the tag function ($queryRaw):
$queryRaw(["SELECT * FROM \"User\" WHERE id = ", ""], id)
This allows Prisma to pass the SQL string to PostgreSQL and send the "id" value separately as a bound parameter ($1).
Prisma.raw() bypasses parameterization and treats the entire evaluated string as raw executable SQL syntax.`,
                explanation: 'Always rely on the tagged template syntax for user-supplied data.'
            },
            docLink: {
                title: 'Prisma Docs: Raw Database Access',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access',
                description: 'Safely executing raw SQL queries and mutations with tagged templates and Prisma.sql.'
            }
        },
        {
            id: 'prisma-8',
            title: 'Connection Pooling, Serverless Drivers & PgBouncer Optimization',
            estMinutes: 5,
            concept: {
                summary: 'By default, Prisma Client opens a dedicated pool of physical database connections. In serverless environments (AWS Lambda, Vercel, Netlify), every incoming request can spin up an ephemeral container that initializes a new PrismaClient instance, quickly exhausting database connections. To prevent connection exhaustion, production apps connect via PgBouncer (using ?pgbouncer=true) or use serverless driver adapters (like @prisma/adapter-neon or @prisma/adapter-pg).',
                analogy: 'A restaurant valet parking team: direct connections are letting 500 customers park their cars haphazardly across the front lawn; PgBouncer and serverless adapters are a designated team of 5 valet drivers who park and retrieve cars through a controlled, orderly lane.',
                seniorInsight: 'When using Transaction Pooling in PgBouncer, append `?pgbouncer=true` to your database URL. This tells Prisma to avoid preparing statements globally on connections, preventing "prepared statement does not exist" errors.'
            },
            trap: {
                title: 'Instantiating a new PrismaClient() on every API request or inside Next.js route handlers',
                juniorCode: `// ❌ JUNIOR: Creates a brand new connection pool on every HTTP request!
import { PrismaClient } from '@prisma/client';

export async function GET() {
    const prisma = new PrismaClient(); // Opens 5–10 new DB connections on EVERY call!
    const users = await prisma.user.findMany();
    return Response.json(users);
}`,
                seniorCode: `// ✅ SENIOR: Singleton pattern with globalThis caching for Next.js / serverless
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Configure connection pool limits for serverless / edge environments:
const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString, max: 10 });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;`,
                explanation: 'Caching PrismaClient on `globalThis` in development prevents Next.js hot-reloads from exhausting connections, while driver adapters optimize serverless container scaling.'
            },
            drill: {
                question: 'Why does connecting to PgBouncer in Transaction mode cause "prepared statement already exists" errors without `?pgbouncer=true`?',
                hint: 'What does PgBouncer do with the physical connection between transactions?',
                solution: `In transaction pooling, PgBouncer reassigns the physical database connection to different clients between transactions.
Prisma caches prepared statements on connections. If Client A prepares a statement named "s1" on Connection 1, and Connection 1 is later given to Client B who tries to prepare "s1", PostgreSQL throws an error because "s1" already exists on that physical connection.
Appending ?pgbouncer=true tells Prisma to disable global prepared statements.`,
                explanation: 'Transaction pooling requires stateless connections without global prepared statement conflicts.'
            },
            docLink: {
                title: 'Prisma Guide: Connection Management with PgBouncer',
                url: 'https://www.prisma.io/docs/guides/performance-and-optimization/connection-management',
                description: 'Tuning connection pool sizing, PgBouncer configuration, and serverless driver adapters.'
            }
        },
        {
            id: 'prisma-9',
            title: 'High-Performance Pagination: Offset vs Keyset (Cursor-Based)',
            estMinutes: 5,
            concept: {
                summary: 'Offset pagination (`skip: 10000, take: 20`) forces the database to read, sort, and discard 10,000 physical rows before returning the requested 20 rows, degrading performance linearly as users scroll deeper into datasets. Keyset (Cursor-based) pagination (`cursor: { id: lastSeenId }, skip: 1, take: 20`) uses indexed B-Tree pointers (`WHERE id > :cursor LIMIT 20`), providing constant O(log N) lookup regardless of page depth.',
                analogy: 'Finding chapter 15 in a physical book: Offset pagination is counting every single page from page 1 to page 350 one by one. Cursor pagination is placing a physical bookmark on page 350 and immediately opening directly to the bookmark next time.',
                seniorInsight: 'Use Offset pagination only for shallow admin tables where users jump to specific page numbers (e.g. page 1 to 5). Use Cursor pagination for infinite scroll feeds, message timelines, and high-volume mobile APIs.'
            },
            trap: {
                title: 'Using skip: 50000 on large production tables, causing query timeouts',
                juniorCode: `// ❌ JUNIOR: Offset pagination on large table
app.get('/feed', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;

    // 💥 On page 2,500, skip: 50000 scans 50,000 rows from disk before returning 20!
    const posts = await prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
});`,
                seniorCode: `// ✅ SENIOR: Cursor-based pagination with O(log N) constant time lookup
app.get('/feed', async (req, res, next) => {
    try {
        const cursor = req.query.cursor as string | undefined;
        const limit = 20;

        const posts = await prisma.post.findMany({
            take: limit + 1, // Fetch +1 to check if another page exists
            ...(cursor && {
                skip: 1, // Skip the cursor itself
                cursor: { id: cursor }
            }),
            orderBy: { id: 'desc' }, // Must order by a unique, indexed column
            select: { id: true, title: true, createdAt: true }
        });

        const hasNextPage = posts.length > limit;
        const items = hasNextPage ? posts.slice(0, -1) : posts;
        const nextCursor = hasNextPage ? items[items.length - 1].id : null;

        res.json({ items, nextCursor });
    } catch (err) {
        next(err);
    }
});`,
                explanation: 'Cursor pagination uses B-Tree indexes to jump directly to the target record, guaranteeing uniform sub-5ms response times across millions of records.'
            },
            drill: {
                question: 'What is a major UI limitation of cursor-based pagination compared to offset pagination?',
                hint: 'Can a user click a button that says "Jump directly to Page 42"?',
                solution: `Cursor pagination cannot jump directly to an arbitrary page number (e.g. "Page 42") without having retrieved the cursor from Page 41 first.
It is primarily designed for sequential forward/backward navigation ("Next Page", "Previous Page", or Infinite Scrolling).`,
                explanation: 'Offset pagination allows arbitrary page jumping; cursor pagination guarantees high-speed sequential retrieval.'
            },
            docLink: {
                title: 'Prisma Docs: Pagination Strategies',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/pagination',
                description: 'Implementing cursor-based vs offset pagination with Prisma Client.'
            }
        },
        {
            id: 'prisma-10',
            title: 'Aggregations, GroupBy & Nested Relational Filters',
            estMinutes: 5,
            concept: {
                summary: 'Prisma provides powerful aggregation APIs (`aggregate`, `groupBy`, `count`) that execute native SQL aggregation functions (`SUM`, `AVG`, `MIN`, `MAX`, `COUNT`) directly inside the database engine. In addition, Prisma supports advanced relational existence filters: `some` (at least one related item matches), `every` (all related items match), and `none` (zero related items match).',
                analogy: 'An audit inspection: instead of loading 50,000 paper expense receipts into the boardroom to add up the total by hand (application-side loop), the database accountant runs a single calculator sweep over the column and hands you the total dollar sum in one second.',
                seniorInsight: 'Never fetch raw arrays into Node.js memory just to calculate `.length` or sum values. Always use `prisma.model.count()` or `prisma.model.aggregate()` to let PostgreSQL do the work at hardware speeds.'
            },
            trap: {
                title: 'Fetching thousands of records into memory just to count them or sum amounts',
                juniorCode: `// ❌ JUNIOR: Pulls 50,000 order records across the network to calculate total revenue
const orders = await prisma.order.findMany(); // Huge memory spike!
const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
const orderCount = orders.length;`,
                seniorCode: `// ✅ SENIOR: Database-level aggregation and relational existence filtering
// 1. Aggregation executed directly inside PostgreSQL:
const stats = await prisma.order.aggregate({
    _sum: { amount: true },
    _avg: { amount: true },
    _count: { id: true },
    where: { status: 'COMPLETED' }
});

// 2. Relational existence filtering (e.g. Find users who have NO failed orders):
const premiumUsers = await prisma.user.findMany({
    where: {
        orders: {
            some: { amount: { gte: 10000 } }, // Has at least one high-value order
            none: { status: 'DISPUTED' }       // Has zero disputed orders
        }
    }
});`,
                explanation: 'Database engines compute sums and averages using vectorized memory operations. Letting PostgreSQL aggregate reduces network latency and Node RAM consumption to near zero.'
            },
            drill: {
                question: 'What is the difference between `_count: true` on a model vs `_count: { posts: true }` in a select clause?',
                hint: 'One counts total rows matching a query; the other counts related children per parent record.',
                solution: `1. prisma.user.aggregate({ _count: true }):
Returns the total number of User rows matching the query.

2. prisma.user.findMany({ select: { id: true, _count: { select: { posts: true } } } }):
Returns each user along with the count of their related posts (e.g. { id: "1", _count: { posts: 14 } }), without fetching the post bodies.`,
                explanation: 'Prisma _count relations generate efficient subqueries or joins to count children without transferring payload data.'
            },
            docLink: {
                title: 'Prisma Docs: Aggregation, Grouping, and Summarizing',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing',
                description: 'Official API guide for count, aggregate, and groupBy operations.'
            }
        },
        {
            id: 'prisma-11',
            title: 'Query Logging, Observability & Slow Query Detection',
            estMinutes: 5,
            concept: {
                summary: 'Understanding what SQL Prisma emits under the hood is critical for debugging latency and index utilization. Prisma Client supports event-based query logging: configuring `log: [{ emit: "event", level: "query" }]` exposes an event listener (`prisma.$on("query", (e) => { ... })`) providing the exact compiled SQL statement, bound parameters, and execution duration in milliseconds.',
                analogy: 'An engine diagnostic telemetry port: rather than wondering why your sports car is stalling on steep hills, the telemetry computer graphs the exact fuel injector timings and RPM bottlenecks in real time.',
                seniorInsight: 'Set up an automated slow query alert threshold (e.g. if `e.duration > 200` ms) in your application logger. This surfaces missing indexes and query regressions in staging and production before customers report latency issues.'
            },
            trap: {
                title: 'Running blind in production without tracking query execution durations',
                juniorCode: `// ❌ JUNIOR: Default client with zero query visibility
const prisma = new PrismaClient();
// Queries take 3,500ms in production, but developer has no idea which query is responsible!`,
                seniorCode: `// ✅ SENIOR: Structured logging with slow query alerting via Pino
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' }
    ]
});

const SLOW_QUERY_THRESHOLD_MS = 200;

prisma.$on('query', (e) => {
    if (e.duration >= SLOW_QUERY_THRESHOLD_MS) {
        logger.warn({
            query: e.query,
            params: e.params,
            durationMs: e.duration,
            target: e.target
        }, \`⚠️ SLOW DATABASE QUERY (\${e.duration}ms)\`);
    } else if (process.env.NODE_ENV === 'development') {
        logger.debug({ durationMs: e.duration, query: e.query }, 'Prisma Query');
    }
});`,
                explanation: 'Logging compiled queries with execution times pinpoints missing indexes and inefficient joins before they cause production database CPU exhaustion.'
            },
            drill: {
                question: 'Why should you avoid logging all Prisma query events in high-traffic production environments?',
                hint: 'Think about log volume and I/O overhead under thousands of requests per second.',
                solution: `Emitting a query log on every single database operation under high traffic (e.g. 10,000 QPS) generates gigabytes of log output, placing massive serialization pressure on the Node event loop and multiplying CloudWatch/Datadog logging costs.
Instead, log queries selectively (only when duration exceeds a slow query threshold like 200ms) or enable distributed tracing via OpenTelemetry.`,
                explanation: 'Threshold-based slow query logging captures performance issues without log flooding.'
            },
            docLink: {
                title: 'Prisma Docs: Logging and Event Listeners',
                url: 'https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/logging',
                description: 'Configuring stdout vs event loggers, capturing query durations, and OpenTelemetry tracing.'
            }
        },
        {
            id: 'prisma-12',
            title: 'Migration Drift, Baseline Migrations & Database Repair',
            estMinutes: 5,
            concept: {
                summary: 'Migration Drift occurs when the actual database schema no longer matches the migration history recorded in `_prisma_migrations` (often caused by manual SQL changes made in database management tools like pgAdmin or DBeaver). Prisma provides diagnostic and repair tools: `prisma migrate diff` compares two schema states, and `prisma migrate resolve` marks failed migrations as rolled-back or applied.',
                analogy: 'A source code rebase conflict: someone pushed commits directly to the production server via FTP without committing them to git. The version control system (Prisma migration history) detects the unexpected changes and halts deployments until the divergence is reconciled.',
                seniorInsight: 'When introducing Prisma to an existing legacy database, use `prisma migrate diff --from-empty --to-schema-datamodel --script > migration.sql` to generate a Baseline Migration without wiping existing tables.'
            },
            trap: {
                title: 'Manually modifying production database columns with DBeaver without creating a migration',
                juniorCode: `-- ❌ JUNIOR: Runs manual SQL in production DBeaver:
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN DEFAULT false;

-- Later, CI/CD runs "prisma migrate deploy":
-- 💥 FATAL: Database drift detected! Production schema diverged from migration history!
-- Subsequent migrations fail to apply, blocking all production deployments.`,
                seniorCode: `-- ✅ SENIOR: Resolving migration drift safely with prisma migrate resolve
# 1. Detect the exact drift difference:
npx prisma migrate diff \\
  --from-migrations ./prisma/migrations \\
  --to-url "$DATABASE_URL"

# 2. If a migration partially failed mid-flight, mark it rolled-back to retry:
npx prisma migrate resolve --rolled-back "20260315120000_add_user_verification"

# 3. Or if manually applied in an emergency, register it as applied:
npx prisma migrate resolve --applied "20260315120000_add_user_verification"`,
                explanation: 'Every schema modification must pass through version-controlled migration files. When drift occurs, `prisma migrate resolve` aligns the state tracking table safely.'
            },
            drill: {
                question: 'What is the purpose of the `_prisma_migrations` table inside your PostgreSQL database?',
                hint: 'How does Prisma know which migrations have already been applied?',
                solution: `The _prisma_migrations table stores the execution history of all migrations applied to that database.
It records migration IDs, checksums (to detect if a migration file was altered after deployment), timestamps, and status (whether it completed successfully or rolled back).`,
                explanation: 'Prisma compares local migration files against _prisma_migrations to decide what SQL to run during migrate deploy.'
            },
            docLink: {
                title: 'Prisma Docs: Resolving Migration Issues & Drift',
                url: 'https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/troubleshooting-development',
                description: 'Handling migration drift, baselining existing databases, and resolving failed migrations.'
            }
        }
    ]
};
