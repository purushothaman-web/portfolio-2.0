import { SkillRoadmap } from './types';

export const supabaseRoadmap: SkillRoadmap = {
    skillId: 'supabase',
    skillName: 'Supabase (Postgres BaaS)',
    category: 'DATA STORAGE',
    tagline: 'Postgres Core, Row Level Security (RLS), SSR Auth & Realtime Event Subscriptions',
    accentColor: '#3ecf8e',
    officialDocs: [
        {
            title: 'Supabase Official Documentation',
            url: 'https://supabase.com/docs',
            description: 'Comprehensive guides covering Database, Auth, Storage, Edge Functions, and Realtime.',
            badge: 'Official Docs'
        },
        {
            title: 'PostgreSQL Row Level Security (RLS)',
            url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
            description: 'Authoritative guide to database-level access control with auth.uid() and security policies.',
            badge: 'Security Standard'
        },
        {
            title: 'Supabase SSR & Cookie Authentication',
            url: 'https://supabase.com/docs/guides/auth/server-side/creating-a-client',
            description: 'Managing session cookies safely across Next.js Server Components, Actions, and Middleware.',
            badge: 'Architecture'
        }
    ],
    checkpoints: [
        {
            id: 'supabase-1',
            title: 'Core Architecture: Postgres, PostgREST, GoTrue & Realtime Engine',
            estMinutes: 5,
            concept: {
                summary: 'Supabase is not an isolated proprietary database; it is an integrated platform built on top of standard open-source PostgreSQL. The platform orchestrates 4 core components: (1) PostgreSQL: 100% full-featured relational database with extensions (pgvector, postgis, uuid-ossp). (2) PostgREST: A high-performance Haskell daemon that inspects your database schema and instantly generates an OpenAPI RESTful API. (3) GoTrue Auth: Manages user signups, OAuth providers, and issues signed JWTs. (4) Realtime Engine: An Elixir/Phoenix cluster that listens to Postgres Write-Ahead Logs (WAL) via logical replication and broadcasts table changes over WebSockets.',
                analogy: 'A master Swiss watch: the Postgres engine is the precise mechanical escapement gear at the center; PostgREST is the hands showing the time; GoTrue is the master key to the case; and Realtime is the chime that announces every second across the room.',
                seniorInsight: 'Because Supabase is standard PostgreSQL under the hood, you are never locked in: you can connect using raw psql, Drizzle, Prisma, or any standard Postgres driver simply using your database connection string.'
            },
            trap: {
                title: 'Treating Supabase as a simple NoSQL client and bypassing SQL constraints',
                juniorCode: `// ❌ JUNIOR: Performing complex table joins and aggregations in frontend JavaScript
const { data: posts } = await supabase.from('posts').select('*');
const { data: authors } = await supabase.from('authors').select('*');

// Merging and filtering arrays in the browser:
const combined = posts.map(p => ({
    ...p,
    author: authors.find(a => a.id === p.author_id)
})).filter(p => p.author.is_verified);`,
                seniorCode: `// ✅ SENIOR: Declarative PostgREST relational embedding + database views
// PostgREST automatically traverses foreign keys in a single database roundtrip:
const { data, error } = await supabase
    .from('posts')
    .select(\`
        id,
        title,
        created_at,
        author:authors!inner (
            id,
            display_name,
            is_verified
        )
    \`)
    .eq('author.is_verified', true)
    .order('created_at', { ascending: false });

if (error) throw new Error(error.message);`,
                explanation: 'PostgREST relational queries leverage foreign key indexes and join data inside the Postgres engine, transmitting minimal JSON over the wire.'
            },
            drill: {
                question: 'How does Supabase allow web browsers to query database tables directly via `supabase.from("orders").select()` without creating a severe security vulnerability?',
                hint: 'What Postgres feature enforces permissions on every single row before returning data?',
                solution: `Row Level Security (RLS).
When a client makes a query, the Supabase client attaches the user's JWT. PostgREST sets the Postgres session variables (request.jwt.claims) and executes the query. PostgreSQL's RLS engine evaluates policies on every row, ensuring clients can only view and modify records they are explicitly authorized to access.`,
                explanation: 'Row Level Security pushes authorization down from the application server directly into the database engine.'
            },
            docLink: {
                title: 'Supabase Architecture Overview',
                url: 'https://supabase.com/docs/guides/architecture',
                description: 'How Postgres, PostgREST, GoTrue, and Realtime interact.'
            }
        },
        {
            id: 'supabase-2',
            title: 'Row Level Security (RLS): Multi-Tenant Isolation & auth.uid() Policies',
            estMinutes: 5,
            concept: {
                summary: 'Row Level Security (RLS) is Postgres\'s native security mechanism that controls which database rows can be selected, inserted, updated, or deleted based on the executing user\'s credentials. In Supabase, the incoming JWT claims are exposed via SQL helper functions: `auth.uid()` (returns the authenticated user UUID) and `auth.jwt()` (returns the full token payload). By default, RLS is disabled on newly created tables, meaning any public API client with your anon key can read all data. Enabling RLS is mandatory for production tables.',
                analogy: 'An apartment building mailroom: without RLS, all mailboxes have no doors, and anyone in the lobby can read everyone\'s letters. With RLS, every mailbox has a private key lock (policy); your key (`auth.uid()`) only turns the lock on your mailbox, rendering all other mailboxes invisible and unpickable.',
                seniorInsight: 'Always wrap `auth.uid()` in a subquery: `(SELECT auth.uid()) = user_id`. In PostgreSQL, writing `auth.uid() = user_id` without `(SELECT ...)` causes Postgres to re-evaluate the function on EVERY SINGLE candidate row, degrading query performance from an index seek to a full table scan.'
            },
            trap: {
                title: 'Forgetting to enable RLS or using service_role key in frontend browser code',
                juniorCode: `// ❌ JUNIOR: Using service_role secret in browser client to "make queries work"
// .env.local
// NEXT_PUBLIC_SUPABASE_KEY=eyJhbGciOi... (THIS IS THE SERVICE_ROLE SECRET!)

import { createClient } from '@supabase/supabase-js';
// 🚨 CATASTROPHIC VULNERABILITY: service_role key completely bypasses all RLS policies!
// Any visitor can open DevTools and run: supabase.from('users').delete().neq('id', '0')
export const supabase = createClient(process.env.NEXT_PUBLIC_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);`,
                seniorCode: `// ✅ SENIOR: Strict RLS with anon key + optimized (SELECT auth.uid()) subquery
-- In Postgres Schema (Migration):
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 1. Read Policy: Users can only see their own documents or public ones
CREATE POLICY "Users can view own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id OR is_public = true
);

-- 2. Insert Policy: Users can only insert records matching their own auth UID
CREATE POLICY "Users can create own documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
    (SELECT auth.uid()) = user_id
);

-- Index the foreign key column to ensure RLS evaluation uses an index scan
CREATE INDEX idx_documents_user_id ON public.documents(user_id);`,
                explanation: 'The anon key respects RLS, while (SELECT auth.uid()) and foreign key indexing ensure RLS checks execute at sub-millisecond speeds.'
            },
            drill: {
                question: 'Why does writing `(SELECT auth.uid()) = user_id` perform dramatically faster on 100,000 rows than writing `auth.uid() = user_id` in an RLS policy?',
                hint: 'How does the Postgres query planner treat function calls vs scalar subqueries?',
                solution: `PostgreSQL treats auth.uid() as a volatile/stable function.
If you write "auth.uid() = user_id", Postgres may call auth.uid() repeatedly for all 100,000 rows during the table scan.
By wrapping it in a subquery "(SELECT auth.uid())", Postgres executes the function once at query startup as a cached scalar value and uses an index seek on idx_documents_user_id.`,
                explanation: 'Scalar subqueries allow Postgres to optimize RLS policies with index lookups instead of row-by-row function execution.'
            },
            docLink: {
                title: 'Row Level Security Best Practices',
                url: 'https://supabase.com/docs/guides/database/postgres/row-level-security',
                description: 'Official Supabase RLS security policies, performance optimizations, and role definitions.'
            }
        },
        {
            id: 'supabase-3',
            title: 'SSR Authentication & Cookie Sessions with @supabase/ssr',
            estMinutes: 5,
            concept: {
                summary: 'Modern web frameworks (Next.js App Router, Remix, SvelteKit) render components on the server before sending HTML to the client. The legacy `@supabase/supabase-js` stored JWT tokens in browser `localStorage`, making tokens invisible to server-side code (causing flash of unauthenticated content, redirect loops, and blocking SSR data fetching). The official `@supabase/ssr` package solves this by reading and writing auth tokens in secure `HttpOnly` cookie chunks across middleware, server components, and route handlers.',
                analogy: 'Checking into a hotel: storing tokens in localStorage is keeping your room key card in your personal gym locker at home—when you arrive at the front desk, the concierge cannot see your card. Cookie storage is pinning your guest credential to your shirt lapel: the hotel doorman (middleware) and the elevator staff (server component) verify your access instantly on arrival.',
                seniorInsight: 'In Next.js App Router, never update cookies directly inside Server Components (Next.js Server Components are read-only for cookies). Always refresh user sessions inside `middleware.ts` using `supabase.auth.getUser()`, which updates response cookies before page components render.'
            },
            trap: {
                title: 'Calling supabase.auth.getSession() in server code instead of supabase.auth.getUser()',
                juniorCode: `// ❌ JUNIOR: Trusting getSession() on server without cryptographic verification
import { createServerClient } from '@supabase/ssr';

export async function checkAuth(cookies) {
    const supabase = createClient(cookies);
    // 🚨 VULNERABILITY: getSession() reads unverified cookie data without revalidating with Supabase Auth!
    // A forged or expired cookie may pass getSession() if not checked against the auth server.
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
}`,
                seniorCode: `// ✅ SENIOR: Strictly use supabase.auth.getUser() in server code
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Handled in middleware
                    }
                },
            },
        }
    );
}

// In Server Component or Route Handler:
export async function getAuthenticatedUser() {
    const supabase = await createClient();
    // ✅ Re-authenticates JWT signature and guarantees valid user state:
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
}`,
                explanation: 'supabase.auth.getUser() contacts the Supabase Auth server or cryptographically validates token integrity, preventing forged cookie bypasses.'
            },
            drill: {
                question: 'Why does the Supabase SSR documentation mandate calling `supabase.auth.getUser()` in Next.js `middleware.ts` rather than inside individual Server Components?',
                hint: 'Can Next.js Server Components modify response cookies?',
                solution: `Next.js Server Components are read-only and cannot mutate response headers or set cookies.
If an access token expires and needs to be refreshed via the refresh token, the fresh cookies MUST be attached to the HTTP response headers in "middleware.ts" before the page component renders. If done in a Server Component, the refreshed session will be lost.`,
                explanation: 'Middleware acts as the single gateway for rotating and writing renewed cookie credentials in SSR frameworks.'
            },
            docLink: {
                title: 'Supabase SSR Client Configuration',
                url: 'https://supabase.com/docs/guides/auth/server-side/nextjs',
                description: 'Step-by-step setup for Next.js App Router with Server Components and Middleware.'
            }
        },
        {
            id: 'supabase-4',
            title: 'Database Triggers: Atomic User Profile Creation & Webhooks',
            estMinutes: 5,
            concept: {
                summary: 'When a new user registers through Supabase Auth (email, Google, GitHub), their core identity record is inserted into the private `auth.users` table (which is inaccessible from your public schema). Your application typically stores user profile information (display name, avatar, subscription tier, billing address) in `public.profiles`. Rather than relying on unreliable client-side code to make a second `POST` request to create the profile, a Postgres `AFTER INSERT` trigger with a `SECURITY DEFINER` function creates the profile record atomically inside the database transaction.',
                analogy: 'An automated municipal birth registry: when a baby is registered at the county hospital (auth.users), the town hall computer automatically creates a library card, census entry, and tax profile (public.profiles) in the exact same legal instant. If the hospital database crashed, neither record would exist.',
                seniorInsight: 'Declare your trigger function as `SECURITY DEFINER` and set `search_path = public`. `SECURITY DEFINER` allows the trigger to execute with database owner privileges, bypassing RLS restrictions during profile initialization.'
            },
            trap: {
                title: 'Creating user profiles on the client side after signup, leading to orphaned users',
                juniorCode: `// ❌ JUNIOR: Fragile two-step client signup
const { data, error } = await supabase.auth.signUp({ email, password });

// If user loses internet, closes browser, or mobile app crashes here:
// User exists in auth.users, but public.profiles record is NEVER CREATED!
await supabase.from('profiles').insert({
    id: data.user.id,
    display_name: 'Alex'
});`,
                seniorCode: `// ✅ SENIOR: Atomic Postgres Database Trigger (SQL Migration)
-- 1. Create public profiles table linked to auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Security Definer trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New Member'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- 3. Trigger executes automatically after every user insertion in auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,
                explanation: 'Database triggers guarantee that every authenticated user has a corresponding public profile row with zero race conditions.'
            },
            drill: {
                question: 'Why is it critical to explicitly add `SET search_path = public` to a PostgreSQL `SECURITY DEFINER` function?',
                hint: 'What happens if a malicious user creates a custom schema or table with the same name as a built-in function?',
                solution: `Without "SET search_path = public", a SECURITY DEFINER function executes with the creator's elevated privileges using the caller's search_path.
A malicious user could manipulate their search_path or create a rogue table/function to trick the elevated function into running untrusted code (Search Path Hijacking). Setting a fixed search_path completely seals this vulnerability.`,
                explanation: 'Explicit search_path definition is an essential OWASP hardening practice for Postgres SECURITY DEFINER triggers.'
            },
            docLink: {
                title: 'Supabase Managing User Data & Triggers',
                url: 'https://supabase.com/docs/guides/auth/managing-user-data',
                description: 'Trigger examples for syncing auth.users with public profile tables.'
            }
        }
    ]
};
