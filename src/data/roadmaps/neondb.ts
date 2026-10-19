import { SkillRoadmap } from './types';

export const neondbRoadmap: SkillRoadmap = {
    skillId: 'neondb',
    skillName: 'Neon DB (Serverless Postgres)',
    category: 'DATA STORAGE',
    tagline: 'Separation of Storage & Compute, Connection Pooling over WebSockets & Instant Branching',
    accentColor: '#00e599',
    officialDocs: [
        {
            title: 'Neon Official Documentation',
            url: 'https://neon.tech/docs/introduction',
            description: 'Architecture overview of serverless PostgreSQL with decoupled storage and compute.',
            badge: 'Official Docs'
        },
        {
            title: 'Neon Connection Pooling Guide',
            url: 'https://neon.tech/docs/connect/connection-pooling',
            description: 'Managing high-concurrency serverless lambdas with built-in PgBouncer pooling.',
            badge: 'Architecture'
        },
        {
            title: 'Database Branching Guide',
            url: 'https://neon.tech/docs/introduction/branching',
            description: 'Zero-copy, instantaneous copy-on-write database branches for CI/CD and preview deployments.',
            badge: 'DevOps'
        }
    ],
    checkpoints: [
        {
            id: 'neondb-1',
            title: 'Decoupled Storage & Compute Architecture: Safekeepers & Pageservers',
            estMinutes: 5,
            concept: {
                summary: 'Traditional PostgreSQL couples the CPU/RAM compute layer directly to the local disk block storage. If your database server restarts, storage must remount and caches warm up. Neon reimagines Postgres by completely separating compute from storage: the Compute Node is a stateless, ephemeral Postgres process that runs anywhere. Write-Ahead Logs (WAL) are streamed to a consensus quorum of Safekeepers, which stream data into distributed Pageservers backed by cloud object storage (S3). This allows compute to shut down completely without losing state.',
                analogy: 'A high-end restaurant: traditional Postgres is a single chef who must run to the basement freezer to fetch every vegetable, cook the dish, and store the leftovers in their own apron. Neon is an open kitchen with rapid chefs (stateless compute) served by automated dumbwaiter delivery systems (Safekeepers) connected to a massive regional supply warehouse (Pageservers).',
                seniorInsight: 'Because compute is stateless, you can spin up a read replica in a different geographic region in seconds without migrating terabytes of data across disks.'
            },
            trap: {
                title: 'Treating serverless Postgres like a local persistent VM with unlimited stateful connections',
                juniorCode: `// ❌ JUNIOR: Creating new raw pg.Client instances in every serverless function
import { Client } from 'pg';

export async function handler(req: Request) {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect(); // 🚨 Cold-start latency + exhausts Postgres max_connections!
    const res = await client.query('SELECT * FROM users');
    // Forgetting client.end() leaves open orphaned sockets
    return new Response(JSON.stringify(res.rows));
}`,
                seniorCode: `// ✅ SENIOR: Serverless HTTP/WebSocket driver with persistent connection pooling
import { neon } from '@neondatabase/serverless';

// Stateless SQL client querying over HTTP/1.1 or WebSockets without TCP handshake overhead
const sql = neon(process.env.DATABASE_URL!);

export async function handler(req: Request) {
    // Single-roundtrip execution; automatically multiplexed through Neon pooler
    const users = await sql\`SELECT id, email, created_at FROM users WHERE active = true\`;
    return Response.json(users);
}`,
                explanation: 'Using the @neondatabase/serverless HTTP query driver eliminates connection handshakes and prevents connection pool exhaustion in serverless edge functions.'
            },
            drill: {
                question: 'What architectural component in Neon ensures durability when a stateless compute node shuts down or crashes?',
                hint: 'Think about where Postgres Write-Ahead Logs (WAL) are immediately committed.',
                solution: `Neon Safekeepers.
Before acknowledging a transaction commit to the client, the compute node must stream the WAL records to a quorum of independent Safekeeper nodes (using Paxos consensus). The Safekeepers ensure zero data loss even if the compute node immediately disappears.`,
                explanation: 'Safekeepers decouple commit durability from the life cycle of individual compute nodes.'
            },
            docLink: {
                title: 'Neon Architecture Deep Dive',
                url: 'https://neon.tech/docs/reference/architecture',
                description: 'Detailed technical specification of Compute, Safekeepers, and Pageservers.'
            }
        },
        {
            id: 'neondb-2',
            title: 'Scale-to-Zero & Cold-Start Optimization',
            estMinutes: 5,
            concept: {
                summary: 'Traditional cloud databases charge you 24/7 even when no queries are running at 3 AM. Neon features automatic Scale-to-Zero: if no incoming queries are detected for a configurable duration (default 5 minutes), the compute instance pauses (0 Compute Units / 0 CU), dropping CPU and RAM costs to $0. When a new incoming query hits the Neon proxy, the compute node resumes automatically in ~300ms to 1s. For production APIs with strict <50ms p99 SLAs, you can configure a minimum CU of 0.25 to eliminate cold starts entirely.',
                analogy: 'An escalator with a motion sensor: in an empty train station, the motor stops running completely to save electricity. The moment a commuter steps onto the mat, the motor smoothly spins back up to full speed before they reach the steps.',
                seniorInsight: 'Use Scale-to-Zero aggressively on Development and Staging branches. For your primary Production branch, set minimum CU to 0.25 or 1.0 to guarantee instant query execution without latency spikes.'
            },
            trap: {
                title: 'Running long-lived heavy database migrations against a cold, autoscaling compute node',
                juniorCode: `// ❌ JUNIOR: Triggering heavy migrations without warmup or timeout adjustments
// In CI/CD deploy pipeline:
// npx prisma migrate deploy
// If compute is suspended, the initial handshake might time out if client timeout is 2 seconds!`,
                seniorCode: `// ✅ SENIOR: Explicit connection timeout settings in connection string for serverless
// Direct pooled connection string with connect_timeout parameter
// postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=15

import { Pool } from '@neondatabase/serverless';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 15000 // Allows grace period for scale-to-zero wake-up
});`,
                explanation: 'Setting a 10-15s connect_timeout gives serverless Postgres compute sufficient room to resume from cold suspend without dropping deploy scripts.'
            },
            drill: {
                question: 'How can you prevent cold start latency on a Neon production branch while keeping staging branches completely free on Scale-to-Zero?',
                hint: 'Look at the Neon Compute configuration settings per branch.',
                solution: `In the Neon Console or CLI branch settings, configure Compute Auto-suspend:
- Staging / PR Preview branches: Set Suspend Timeout to "5 minutes" and Minimum CU to "0 CU" (Scale-to-Zero enabled).
- Production branch: Set Minimum CU to "0.25 CU" (or "1 CU") with Auto-suspend disabled (Always On).`,
                explanation: 'Per-branch compute quotas let you slash development costs without compromising production responsiveness.'
            },
            docLink: {
                title: 'Neon Scale-to-Zero Guide',
                url: 'https://neon.tech/docs/introduction/auto-suspend',
                description: 'How Neon auto-suspend and compute activation work.'
            }
        },
        {
            id: 'neondb-3',
            title: 'Connection Pooling over WebSockets: Direct vs Pooled Endpoints',
            estMinutes: 5,
            concept: {
                summary: 'Serverless platforms like Vercel, AWS Lambda, and Cloudflare Workers spin up hundreds of concurrent ephemeral containers. In standard PostgreSQL, each client connection consumes ~10MB of server RAM and requires a heavy SSL handshake. Neon provides a built-in PgBouncer Connection Pooler. Your database provides two connection strings: (1) Direct endpoint (`ep-cool-db.neon.tech`) for migrations and schema changes, and (2) Pooled endpoint (`ep-cool-db-pooler.neon.tech`) for application queries. The pooler supports thousands of concurrent serverless queries by multiplexing them across a small set of persistent backend connections.',
                analogy: 'A bank with 5 teller windows: Direct mode is where 500 customers each bring their own private teller inside their pocket into the lobby, collapsing the building. Pooled mode is a ticket dispenser at the door: 500 customers wait in a fast queue, and the 5 tellers rapidly process tickets one by one.',
                seniorInsight: 'Always use the pooled endpoint (`-pooler`) in your app runtime (`DATABASE_URL`). Always use the direct endpoint in `DIRECT_URL` for tools like Prisma (`prisma migrate`) because migrations often use session-level locks and advisory locks that fail under transaction pooling.'
            },
            trap: {
                title: 'Using pooled connection string for database migrations or prepared statements',
                juniorCode: `// ❌ JUNIOR: Pointing Prisma migrations to a PgBouncer pooled connection
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Using -pooler endpoint!
}
// 🚨 ERROR: Prepared statements or Prisma migrate fail with "advisory lock" or "prepared statement already exists"`,
                seniorCode: `// ✅ SENIOR: Dual connection configuration in Prisma for Neon
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // Pooled connection (-pooler) for runtime traffic
  directUrl = env("DIRECT_URL")     // Direct connection (no pooler) for migrations & CLI
}

// .env
// DATABASE_URL="postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
// DIRECT_URL="postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"`,
                explanation: 'Separating pooled runtime connections from direct migration connections prevents PgBouncer session lock conflicts.'
            },
            drill: {
                question: 'Why does `@neondatabase/serverless` query over WebSockets or HTTP instead of raw TCP on platforms like Cloudflare Workers?',
                hint: 'Consider whether Edge runtime environments support arbitrary raw TCP sockets without Polyfills.',
                solution: `Standard Edge runtimes (Vercel Edge, Cloudflare Workers) historically restrict raw TCP socket connections or have strict limits on long-lived TCP sessions.
The Neon serverless driver tunnels PostgreSQL wire protocol packets over WebSockets or HTTP/1.1 requests, allowing edge functions to execute low-latency Postgres queries globally from anywhere.`,
                explanation: 'WebSocket and HTTP tunneling unlocks true global Edge database access without specialized proxies.'
            },
            docLink: {
                title: 'Neon Connection Pooling: Direct vs Pooled',
                url: 'https://neon.tech/docs/connect/connection-pooling',
                description: 'Configuring PgBouncer and dual endpoints for Prisma and Drizzle.'
            }
        },
        {
            id: 'neondb-4',
            title: 'Zero-Copy Database Branching: Ephemeral Preview Environments',
            estMinutes: 5,
            concept: {
                summary: 'Neon treats database storage like a Git repository. Because Pageservers store data as a tree of immutable page versions, creating a new database branch takes ~1 second regardless of whether your database is 100 megabytes or 500 gigabytes. Neon database branching uses Copy-on-Write: a new branch shares all existing historical storage blocks with its parent. Only new writes and modifications on the branch consume additional storage. This enables teams to generate an isolated, full-data database branch for every pull request automatically.',
                analogy: 'Git branches for your data: instead of copying an entire 500GB hard drive to test a new database column, Neon simply records the current commit hash (LSN timestamp) in storage. As you make edits, only the modified pages are written to the branch.',
                seniorInsight: 'Integrate the Neon Vercel/GitHub integration: when a developer opens a Pull Request (`feature/add-stripe-billing`), CI automatically spins up a private database branch, runs migrations, tests the preview deployment, and automatically destroys the branch when the PR is merged.'
            },
            trap: {
                title: 'Manually testing destructive migrations or schema updates on shared staging databases',
                juniorCode: `// ❌ JUNIOR: Running experimental ALTER TABLE directly on shared staging
// "Hey everyone, please don't use staging for 20 minutes, I'm testing a column drop!"
// If migration fails halfway through, staging data is corrupted for the whole engineering team.`,
                seniorCode: `// ✅ SENIOR: Automated instant branch in CI via Neon CLI / API
# In GitHub Actions workflow (.github/workflows/preview.yml):
- name: Create Neon Database Branch for PR
  run: |
    BRANCH_NAME="pr-\${{ github.event.number }}"
    neon branches create --name $BRANCH_NAME --parent main
    CONNECTION_STRING=$(neon connection-string $BRANCH_NAME)
    echo "DATABASE_URL=$CONNECTION_STRING" >> $GITHUB_ENV

- name: Run Migrations on Isolated Branch
  run: npx prisma migrate deploy

- name: Run E2E Integration Tests Against Isolated Branch
  run: npm run test:e2e`,
                explanation: 'Zero-copy branching allows every developer to safely test destructive migrations on real production-scale schemas without risk.'
            },
            drill: {
                question: 'Why does creating a 1 Terabyte branch in Neon take less than 2 seconds and consume almost zero additional disk space initially?',
                hint: 'How does Copy-on-Write (CoW) point to existing parent pages?',
                solution: `Neon uses Copy-on-Write (CoW) metadata pointers.
When a branch is created, Neon does not copy any physical data pages. It simply creates a new logical timeline pointing to the exact Log Sequence Number (LSN) of the parent branch. Both branches read from the exact same storage blocks until a write occurs on the branch.`,
                explanation: 'Copy-on-write turns massive multi-gigabyte database cloning into instantaneous, lightweight pointer operations.'
            },
            docLink: {
                title: 'Neon Branching in CI/CD Workflows',
                url: 'https://neon.tech/docs/guides/branching-github-actions',
                description: 'Automating database branching in GitHub Actions and preview environments.'
            }
        }
    ]
};
