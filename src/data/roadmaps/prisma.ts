import { SkillRoadmap } from './types';
export const prismaRoadmap: SkillRoadmap = {
        skillId: 'prisma',
        skillName: 'Prisma ORM & Migrations',
        category: 'DATA STORAGE',
        tagline: 'Declarative schemas, type-safe database queries, connection pooling, and zero-downtime migrations.',
        accentColor: '#10b981',
        officialDocs: [
            {
                title: 'Prisma Official Documentation',
                url: 'https://www.prisma.io/docs',
                description: 'The complete reference for Prisma Client, Prisma Migrate, and relation filters.',
                badge: 'Official Docs'
            },
            {
                title: 'Prisma Data Guide',
                url: 'https://www.prisma.io/dataguide',
                description: 'Educational guides on relational modeling, connection management, and indexes.',
                badge: 'Architecture Guide'
            }
        ],
        checkpoints: [
            {
                id: 'prisma-1',
                title: 'Safe Schema Migrations in Production',
                estMinutes: 5,
                concept: {
                    summary: '`prisma migrate deploy` executes pending SQL migrations in production CI/CD pipelines without generating new migrations or prompting for confirmation.',
                    analogy: 'Installing pre-approved architectural blueprints on a construction site rather than sketching new blueprints while workers are pouring concrete.',
                    seniorInsight: 'Never use `prisma migrate dev` or `prisma db push` on production databases. `prisma migrate deploy` guarantees that only reviewed, tracked SQL scripts are executed.'
                },
                trap: {
                    title: 'Running prisma db push or prisma migrate dev in production pipelines',
                    juniorCode: `// âŒ JUNIOR: Using db push in production can silently drop columns and data!
npx prisma db push --accept-data-loss`,
                    seniorCode: `// âœ… SENIOR: CI/CD runs reviewed declarative migrations strictly
npx prisma migrate deploy`,
                    explanation: 'db push does not create a migration history and can drop tables if there is a conflict. migrate deploy checks _prisma_migrations and applies only audited, versioned changes.'
                },
                drill: {
                    question: 'How do you rename a column in Prisma without causing downtime or losing data?',
                    hint: 'Think about a 3-step expand-and-contract migration strategy.',
                    solution: `1. Add the new column as optional in schema.prisma and deploy.
2. Deploy app code that writes to both columns and reads from the new column.
3. Backfill old rows with SQL, mark the new column required, and drop the old column.`,
                    explanation: 'Renaming a column directly in a live database causes instant errors if old application instances are still querying the old column name during a zero-downtime rolling deployment.'
                },
                docLink: {
                    title: 'Prisma Guide: Production Deployment Best Practices',
                    url: 'https://www.prisma.io/docs/guides/deployment/deploy-database-changes-with-prisma-migrate',
                    description: 'Deploying migrations reliably in production environments.'
                }
            }
        ]
};
