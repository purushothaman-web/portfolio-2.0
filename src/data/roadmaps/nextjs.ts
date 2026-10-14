import { SkillRoadmap } from './types';

export const nextjsRoadmap: SkillRoadmap = {
    skillId: 'nextjs',
    skillName: 'Next.js (App Router)',
    category: 'CLIENT-SIDE',
    tagline: 'Fullstack React architecture, Server Components (RSC), 4-layer caching engine, edge middleware, and Partial Prerendering (PPR).',
    accentColor: '#000000',
    officialDocs: [
        {
            title: 'Next.js Official Documentation',
            url: 'https://nextjs.org/docs',
            description: 'The authoritative reference for the App Router, Server Components, and deployment paradigms.',
            badge: 'Official Canonical Docs'
        },
        {
            title: 'Next.js App Router Architecture Guide',
            url: 'https://nextjs.org/docs/app/building-your-application/routing',
            description: 'Deep architectural breakdowns of layouts, templates, streaming, and parallel routing.',
            badge: 'Architecture Guide'
        },
        {
            title: 'Next.js Official Interactive Course',
            url: 'https://nextjs.org/learn',
            description: 'The official hands-on, step-by-step interactive course building fullstack production apps with the App Router.',
            badge: 'Official Interactive Course'
        }
    ],
    checkpoints: [
        {
            id: 'next-1',
            title: 'App Router File-System Conventions (layout, page, template, loading, error)',
            estMinutes: 5,
            concept: {
                summary: 'The Next.js App Router maps folders to routes and uses reserved file conventions: layout.tsx wraps route segments and preserves state across navigations; template.tsx creates a fresh instance and remounts on navigation; loading.tsx wraps the page in an automated Suspense boundary; error.tsx creates an Error Boundary around the subtree.',
                analogy: 'A modular theater stage: layout.tsx is the fixed proscenium arch and stage lighting (it never moves). page.tsx is the current play act. template.tsx is an actor who exits stage left and re-enters fresh with brand-new costumes for each scene.',
                seniorInsight: 'Use template.tsx sparingly: only when you explicitly need enter/exit page transition animations or to reset stateful inputs between route changes. For everything else, layout.tsx preserves expensive DOM state and avoids layout thrashing.'
            },
            trap: {
                title: 'Putting page-change scroll listeners or enter animations inside layout.tsx',
                juniorCode: `// ❌ JUNIOR: layout.tsx does NOT remount when navigating between sub-routes!
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 💥 This effect only runs ONCE on initial load; it will NOT trigger when navigating /dashboard/orders -> /dashboard/users!
    useEffect(() => {
        logPageView();
        window.scrollTo(0, 0);
    }, []);
    return <section>{children}</section>;
}`,
                seniorCode: `// ✅ SENIOR: Use template.tsx when you genuinely require remounting on route transitions
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
    // Guaranteed to remount and execute on every sub-route change:
    useEffect(() => {
        logPageView();
    }, []);
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{children}</motion.div>;
}`,
                explanation: 'Next.js layouts are intentionally persistent: they preserve component state, maintain scroll positions, and do not re-render shared UI elements when sibling pages change.'
            },
            drill: {
                question: 'Why must error.tsx always be marked with "use client", while layout.tsx defaults to a Server Component?',
                hint: 'Think about where runtime exceptions in the browser are caught and interactive recovery buttons are executed.',
                solution: `Answer:
error.tsx must be a Client Component because:
1. It defines an Error Boundary that catches runtime errors that occur in the browser during client-side hydration or rendering.
2. It usually provides interactive recovery mechanisms (e.g. <button onClick={() => reset()}>Try Again</button>), which require client event listeners and state!`,
                explanation: 'React Error Boundaries must be class or client components capable of managing failure state and interactive resets.'
            },
            docLink: {
                title: 'Next.js Docs: Routing Fundamentals',
                url: 'https://nextjs.org/docs/app/building-your-application/routing',
                description: 'Complete reference for reserved App Router file conventions.'
            }
        },
        {
            id: 'next-2',
            title: "Server Components (RSC) vs Client Components ('use client')",
            estMinutes: 5,
            concept: {
                summary: "By default, all components in the App Router are React Server Components (RSC). They execute strictly on the server and emit an RSC wire payload (a JSON tree representation), shipping 0kb of JavaScript to the browser. The 'use client' directive is NOT a sign that code runs ONLY on the client: it is a boundary marker that tells Next.js to package the component and its imports into the browser bundle.",
                analogy: 'Ordering pre-baked pizza vs a meal-kit: Server Components send hot, ready-to-eat pizza (static HTML/data with zero kitchen cleanup). Client components send raw dough, cheese, and a recipe (JavaScript bundle) that the user must bake in their own oven (browser CPU).',
                seniorInsight: "Push 'use client' to the furthest leaves of your component tree. Never make an entire page a Client Component just because one button needs an onClick handler."
            },
            trap: {
                title: "Marking an entire page with 'use client' to handle a single interactive toggle",
                juniorCode: `// ❌ JUNIOR: 'use client' at top-level pulls heavy database queries and libraries into browser bundle!
'use client';

import { db } from '@/lib/db'; // 💥 Bundles DB client or leaks server secrets into browser!
import { useState } from 'react';

export default async function ProductPage() {
    const products = await db.product.findMany(); // Fails or exposes credentials!
    const [filter, setFilter] = useState('');
    return <div>...</div>;
}`,
                seniorCode: `// ✅ SENIOR: Server Component page fetches data; only leaf widget is a Client Component
import { db } from '@/lib/db';
import { ProductFilterBar } from '@/components/ProductFilterBar'; // 'use client' inside this leaf only!

export default async function ProductPage() {
    const products = await db.product.findMany(); // Runs safely on server with zero bundle overhead
    return (
        <div>
            <ProductFilterBar />
            <ProductGrid items={products} />
        </div>
    );
}`,
                explanation: "Placing 'use client' at the top of a page ruins the benefits of Server Components, inflates the JavaScript bundle, and causes security or compilation errors if server modules are imported."
            },
            drill: {
                question: 'Can you render a Server Component inside a Client Component? If so, what design pattern makes this possible?',
                hint: 'Consider the React children composition pattern.',
                solution: `Answer: YES, through the "Children Composition Pattern":
You CANNOT directly import a Server Component into a Client Component.
HOWEVER, you can pass a Server Component as a "children" or JSX slot prop from a parent Server Component:

// ClientContainer.tsx ('use client')
export function ClientContainer({ children }: { children: React.ReactNode }) {
    return <div className="client-wrapper">{children}</div>;
}

// Page.tsx (Server Component)
export default function Page() {
    return (
        <ClientContainer>
            <ServerDataWidget /> {/* Rendered on server, passed as JSX child! */}
        </ClientContainer>
    );
}`,
                explanation: 'When passed via children, the Server Component is executed on the server first, and only its rendered output is slotted into the client boundary.'
            },
            docLink: {
                title: 'Next.js Docs: Server and Client Composition Patterns',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns',
                description: 'Official guide on combining Server and Client Components cleanly.'
            }
        },
        {
            id: 'next-3',
            title: 'Direct Server Data Fetching & Waterfall Elimination',
            estMinutes: 5,
            concept: {
                summary: 'Server Components fetch data asynchronously right inside the component function using standard async/await. When fetching multiple independent datasets, sequential awaits create an unneeded latency waterfall. Parallelizing requests with Promise.all() or breaking data fetching into separate streaming sub-components ensures maximum responsiveness.',
                analogy: 'Ordering breakfast: asking the kitchen for toast and waiting until it pops, THEN asking for eggs and waiting until they fry takes 20 minutes (waterfall). Asking for toast and eggs at the same second takes 10 minutes (parallel).',
                seniorInsight: 'Component-level data fetching beats page-level Promise.all(): when you fetch data directly inside the child component that needs it, Next.js can stream each component individually as soon as its promise settles!'
            },
            trap: {
                title: 'Writing sequential async/await calls for independent datasets',
                juniorCode: `// ❌ JUNIOR: Waterfall latency: 300ms + 400ms = 700ms total blocking delay
export default async function DashboardPage() {
    const user = await fetchUser();       // 300ms
    const analytics = await fetchStats(); // 400ms (waits for user to finish first!)
    return <Dashboard user={user} stats={analytics} />;
}`,
                seniorCode: `// ✅ SENIOR: Execute independent server requests in parallel
export default async function DashboardPage() {
    const userPromise = fetchUser();
    const analyticsPromise = fetchStats();

    // Both requests fire concurrently: total time = max(300ms, 400ms) = 400ms!
    const [user, analytics] = await Promise.all([userPromise, analyticsPromise]);

    return <Dashboard user={user} stats={analytics} />;
}`,
                explanation: 'Awaiting the first fetch before initiating the second blocks the server thread and doubles user time-to-first-byte (TTFB).'
            },
            drill: {
                question: 'What is Request Memoization in Next.js Server Components, and why does calling fetch("/api/user") in 5 different child components not trigger 5 network calls?',
                hint: 'Think about React cache() per render pass.',
                solution: `Answer:
Next.js extends the native fetch() API with automatic Request Memoization.
During a single server render pass:
1. The first component that calls fetch('https://api.example.com/user') executes the real HTTP call and caches the response in memory.
2. The remaining 4 child components that make the exact same GET request read directly from memory cache.
3. Once the server finishes generating the HTML/RSC payload for that user request, the memory cache is destroyed.`,
                explanation: 'Request memoization allows developers to fetch data directly where it is consumed without having to prop-drill data from the top of the tree.'
            },
            docLink: {
                title: 'Next.js Docs: Data Fetching and Caching',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/fetching',
                description: 'Best practices for server data fetching and avoiding sequential waterfalls.'
            }
        },
        {
            id: 'next-4',
            title: 'Streaming SSR, Suspense Boundaries & Instant Loading UI',
            estMinutes: 5,
            concept: {
                summary: 'Streaming Server-Side Rendering breaks down the page into chunks streamed over HTTP chunked transfer encoding. Fast static content (headers, navigation, sidebars) renders and sends immediately to the browser, while slow dynamic widgets wrapped in <Suspense fallback={<Skeleton />}> stream into place the millisecond their database queries complete.',
                analogy: 'A restaurant bringing you complimentary warm bread and water within 30 seconds of sitting down, while the slow wood-fired steak is cooking in the back. You feel cared for immediately rather than waiting 40 minutes in an empty room.',
                seniorInsight: 'Search engine crawlers (Googlebot) wait for all streamed Suspense boundaries to resolve before indexing, meaning streaming delivers instant perceived performance for humans without harming SEO!'
            },
            trap: {
                title: 'Relying solely on loading.tsx for complex dashboards with one slow widget',
                juniorCode: `// ❌ JUNIOR: A single 2-second query blocks the ENTIRE screen behind a full-page spinner!
// app/dashboard/loading.tsx triggers for everything on /dashboard
export default function Loading() {
    return <FullScreenSpinner />; // Whole screen is blank for 2 seconds!
}`,
                seniorCode: `// ✅ SENIOR: Fast shell renders instantly; granular Suspense surrounds only the heavy widget
export default function DashboardPage() {
    return (
        <div>
            <QuickMetrics /> {/* Renders in 50ms */}
            <RecentOrders /> {/* Renders in 80ms */}
            <Suspense fallback={<RevenueChartSkeleton />}>
                <SlowAIRevenueChart /> {/* Streams in 1.8s later without blocking the rest of the page */}
            </Suspense>
        </div>
    );
}`,
                explanation: 'A global loading.tsx causes the entire viewport to flash a skeleton. Granular Suspense boundaries allow 90% of the page to become interactive instantaneously.'
            },
            drill: {
                question: 'What is the difference between page-level loading.tsx and component-level <Suspense>?',
                hint: 'Think about how Next.js translates loading.tsx internally.',
                solution: `Answer:
Under the hood, Next.js automatically compiles loading.tsx as:
<Layout>
    <Suspense fallback={<Loading />}>
        <Page />
    </Suspense>
</Layout>

Therefore:
- loading.tsx replaces the ENTIRE page content with the fallback while the page-level async component is pending.
- Component-level <Suspense> allows parts of <Page /> to render immediately, suspending only specific children.`,
                explanation: 'loading.tsx is convenient shorthand, but granular Suspense gives fine-grained control over layout shift and interactive timing.'
            },
            docLink: {
                title: 'Next.js Docs: Loading UI and Streaming',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming',
                description: 'Official guide on streaming server components with React Suspense.'
            }
        },
        {
            id: 'next-5',
            title: 'The Next.js 4-Layer Caching Architecture',
            estMinutes: 5,
            concept: {
                summary: 'Next.js features four distinct caching mechanisms: 1. Request Memoization (deduplicates identical GET requests in one render pass); 2. Data Cache (persists data across server requests and deployments via fetch options); 3. Full Route Cache (caches static HTML & RSC payload at build or revalidation time); 4. Router Cache (in-memory client browser cache for prefetched routes).',
                analogy: 'A multi-tier library: Request Memoization is the notepad on your desk for today. Data Cache is the central library archive. Full Route Cache is pre-printed copies of popular magazines. Router Cache is the book you are currently carrying in your backpack.',
                seniorInsight: "When dynamic data is required on every request (e.g. user authentication checks, real-time balances), use 'no-store' or export const dynamic = 'force-dynamic' to bypass the Full Route Cache."
            },
            trap: {
                title: 'Expecting fetch() to always query live database data without configuring cache rules',
                juniorCode: `// ❌ JUNIOR: In Next.js, default fetch() is aggressively cached indefinitely!
export default async function StockTicker() {
    // 💥 Product price updates in DB, but this continues returning yesterday's cached response!
    const res = await fetch('https://api.stocks.com/apple');
    const data = await res.json();
    return <div>{data.price}</div>;
}`,
                seniorCode: `// ✅ SENIOR: Explicitly declare caching semantics based on data volatility
// Option A: Time-based ISR revalidation (fresh every 60s)
const res = await fetch('https://api.stocks.com/apple', {
    next: { revalidate: 60 }
});

// Option B: Real-time dynamic fetch (never cache)
const liveRes = await fetch('https://api.stocks.com/apple', {
    cache: 'no-store'
});`,
                explanation: 'App Router fetch requests default to persistent caching. Failing to specify revalidate intervals or no-store leads to stale data bugs in production.'
            },
            drill: {
                question: 'What happens to the Full Route Cache when a route uses headers(), cookies(), or searchParams?',
                hint: 'Consider whether a page can be statically pre-rendered if it depends on incoming request cookies.',
                solution: `Answer:
The route automatically switches from Static Rendering to Dynamic Rendering at request time!
Because cookies(), headers(), and searchParams are unique to each individual user request, Next.js cannot pre-render static HTML at build time and will dynamically render the page on every hit.`,
                explanation: 'Dynamic functions act as an automatic opt-out from the Full Route Cache.'
            },
            docLink: {
                title: 'Next.js Docs: Caching in Next.js',
                url: 'https://nextjs.org/docs/app/building-your-application/caching',
                description: 'The definitive architectural breakdown of all 4 caching layers.'
            }
        },
        {
            id: 'next-6',
            title: 'On-Demand Revalidation (revalidatePath & revalidateTag)',
            estMinutes: 5,
            concept: {
                summary: 'On-demand revalidation clears cached data immediately without waiting for a TTL timer to expire. revalidateTag("tag-name") invalidates all fetch calls associated with a specific tag across the entire website. revalidatePath("/path") purges the Full Route Cache for a specific URL pathname.',
                analogy: 'A restaurant menu board: instead of replacing every printed menu every 60 minutes (timer ISR), the manager uses a laser eraser on the "Catch of the Day" line (tag) the second the kitchen runs out of salmon.',
                seniorInsight: 'Prefer revalidateTag over revalidatePath. Tags are decoupled from URLs: if a product is shown on the homepage, category page, search results, and cart, revalidating tag "product-123" updates all 4 pages in a single call!'
            },
            trap: {
                title: 'Calling revalidatePath("/", "layout") inside every mutation',
                juniorCode: `// ❌ JUNIOR: Nukes the entire website's static cache for a single comment submission!
export async function postCommentAction(formData: FormData) {
    'use server';
    await saveComment(formData);
    // 💥 Purges cache for all 50,000 pages on the website! DB experiences huge traffic spike!
    revalidatePath('/', 'layout');
}`,
                seniorCode: `// ✅ SENIOR: Surgical invalidation using granular tags
export async function postCommentAction(postId: string, formData: FormData) {
    'use server';
    await saveComment(postId, formData);
    // ✅ Invalidates ONLY the comments cache for this specific post:
    revalidateTag(\`post-comments-\${postId}\`);
}`,
                explanation: 'Broad path invalidations destroy CDN cache hit ratios and cause thundering herd database spikes. Granular cache tags purge only the affected data.'
            },
            drill: {
                question: 'How do you attach a cache tag to a fetch request in a Server Component?',
                hint: 'Check the next option in fetch.',
                solution: `const res = await fetch('https://api.store.com/products/42', {
    next: {
        tags: ['products', 'product-42']
    }
});`,
                explanation: 'Multiple tags can be attached to a single request, enabling both broad category invalidations and specific entity updates.'
            },
            docLink: {
                title: 'Next.js Reference: revalidateTag',
                url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag',
                description: 'API reference for tag-based on-demand cache revalidation.'
            }
        },
        {
            id: 'next-7',
            title: "Server Actions ('use server') & Progressive Form Mutations",
            estMinutes: 5,
            concept: {
                summary: "Server Actions are asynchronous functions that execute securely on the server, invokable directly from client forms, buttons, or transitions. Defined with the 'use server' directive, they automatically handle serialization, CSRF protection, and route cache revalidation without manual API route wiring.",
                analogy: 'A pneumatic bank tube: you slide your deposit slip into the canister at the counter (form action) and it gets sucked directly into the secure bank vault behind bulletproof glass (server execution) without an intermediary courier.',
                seniorInsight: 'Always validate input inside Server Actions using schemas like Zod. Never trust client-supplied data just because the function executes on the server!'
            },
            trap: {
                title: 'Wrapping redirect() inside a try/catch block within a Server Action',
                juniorCode: `// ❌ JUNIOR: redirect() intentionally throws a NEXT_REDIRECT error that gets caught!
export async function createPost(formData: FormData) {
    'use server';
    try {
        await db.post.create({ data: { title: formData.get('title') } });
        redirect('/dashboard'); // 💥 Caught by catch block below! Never redirects!
    } catch (err) {
        return { error: 'Failed to create post' };
    }
}`,
                seniorCode: `// ✅ SENIOR: Call redirect() outside the try/catch block
export async function createPost(formData: FormData) {
    'use server';
    try {
        await db.post.create({ data: { title: formData.get('title') } });
    } catch (err) {
        return { error: 'Failed to create post' };
    }
    // redirect() throws a special control-flow error caught by Next.js router:
    redirect('/dashboard');
}`,
                explanation: 'Next.js implements redirect() by throwing an internal NEXT_REDIRECT exception. Catching it in a general catch block aborts the redirect process.'
            },
            drill: {
                question: 'How do Server Actions achieve progressive enhancement when client JavaScript fails to load or is disabled?',
                hint: 'Think about native HTML form behavior with action attributes.',
                solution: `Answer:
When passed to an HTML <form action={myServerAction}>:
1. If JavaScript is disabled or still loading, the browser performs a native standard POST request to the server, where Next.js runs the Server Action and re-renders the page!
2. If JavaScript is hydrated, Next.js intercepts the submit event and executes the Server Action over an asynchronous fetch request with zero full-page reload!`,
                explanation: 'Server Actions restore the web standard philosophy of resilient HTML forms with modern SPA responsiveness.'
            },
            docLink: {
                title: 'Next.js Docs: Server Actions and Mutations',
                url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations',
                description: 'Complete architecture guide for secure server actions.'
            }
        },
        {
            id: 'next-8',
            title: 'Route Handlers (route.ts) & Web Standard Requests/Responses',
            estMinutes: 5,
            concept: {
                summary: 'Route Handlers allow you to build custom HTTP API endpoints inside app/api/.../route.ts using Web Standard Request and Response objects. Supported methods include GET, POST, PUT, PATCH, DELETE, and OPTIONS. They can execute on either the Node.js runtime or the lightweight V8 Edge runtime.',
                analogy: 'The customs gate at an airport: instead of a full flight tour (rendering React HTML), the gate officer only inspects your passport documents and stamps a JSON approval slip.',
                seniorInsight: "Route Handlers with GET are cached by default if they do not use the Request object or dynamic headers! Always verify whether your API endpoint should be static or dynamic."
            },
            trap: {
                title: 'Using Node.js Express syntax (req.body, res.status) inside Route Handlers',
                juniorCode: `// ❌ JUNIOR: Next.js App Router does NOT use Express req/res!
export async function POST(req: any, res: any) {
    const data = req.body; // Undefined!
    res.status(200).json({ success: true }); // res.status is not a function!
}`,
                seniorCode: `// ✅ SENIOR: Use Web Standard Request and NextResponse
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    return NextResponse.json({ success: true, received: body }, { status: 201 });
}`,
                explanation: 'App Router Route Handlers strictly follow modern Fetch API specifications (Request, Response, Headers, ReadableStream).'
            },
            drill: {
                question: 'How do you configure a Route Handler to run on the V8 Edge Runtime instead of standard Node.js?',
                hint: 'Look for route segment configuration options.',
                solution: `// In your app/api/endpoint/route.ts:
export const runtime = 'edge'; // Deploys to globally distributed edge workers

export async function GET() {
    return new Response('Served from the edge in 15ms!');
}`,
                explanation: 'Setting runtime to edge spins up the handler in lightweight V8 isolates close to the user worldwide.'
            },
            docLink: {
                title: 'Next.js Docs: Route Handlers',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
                description: 'Official guide on building REST and streaming endpoints.'
            }
        },
        {
            id: 'next-9',
            title: 'Webhook Security & Raw Body Verification in Route Handlers',
            estMinutes: 5,
            concept: {
                summary: 'When receiving webhooks from payment processors (Stripe) or version control systems (GitHub), the payload signature is cryptographically validated using HMAC SHA-256. This requires access to the exact, untouched raw string of the request body. Calling request.json() parses and re-serializes JSON, changing whitespace and breaking cryptographic signature verification.',
                analogy: 'A wax-sealed royal envelope: reading the letter requires checking the unbroken wax stamp first. If you tear the envelope open and photocopy the text (request.json()), the stamp is destroyed and you cannot prove authenticity.',
                seniorInsight: 'Always use await request.text() inside webhook Route Handlers before passing the buffer into stripe.webhooks.constructEvent().'
            },
            trap: {
                title: 'Parsing webhook body with request.json() before signature verification',
                juniorCode: `// ❌ JUNIOR: Parsing JSON alters whitespace and breaks HMAC signature verification!
export async function POST(req: NextRequest) {
    const body = await req.json(); // 💥 JSON parsing breaks raw byte comparison!
    const signature = req.headers.get('stripe-signature')!;
    const event = stripe.webhooks.constructEvent(JSON.stringify(body), signature, secret); // FAILS!
}`,
                seniorCode: `// ✅ SENIOR: Read raw body string directly via request.text()
export async function POST(req: NextRequest) {
    const rawBody = await req.text(); // Preserves exact byte structure
    const signature = req.headers.get('stripe-signature')!;
    
    try {
        const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        // Handle verified event:
        return NextResponse.json({ received: true });
    } catch (err: any) {
        return new NextResponse(\`Webhook Error: \${err.message}\`, { status: 400 });
    }
}`,
                explanation: 'Cryptographic hashes are bit-sensitive: any spacing or formatting difference caused by JSON.parse() fails HMAC validation.'
            },
            drill: {
                question: 'Can you read request.text() twice in the same Route Handler if you also need to read request.json()?',
                hint: 'Think about whether request bodies in the Fetch API are consumable streams.',
                solution: `Answer: NO.
In the Web Fetch API, the request body is a ReadableStream that can only be read ONCE.
Calling await request.text() consumes the stream: a subsequent await request.json() will throw "TypeError: body stream already read".
To parse JSON after reading text, use: JSON.parse(rawText)!`,
                explanation: 'Streams in JavaScript can only be consumed once unless explicitly cloned via request.clone().'
            },
            docLink: {
                title: 'Stripe Webhooks in Next.js App Router',
                url: 'https://docs.stripe.com/webhooks/quickstart',
                description: 'Verifying webhook signatures with raw text in modern Next.js endpoints.'
            }
        },
        {
            id: 'next-10',
            title: 'Edge Middleware: Authentication, Session Cookies & Security Headers',
            estMinutes: 5,
            concept: {
                summary: 'middleware.ts sits in front of the entire Next.js application at the V8 Edge, intercepting incoming requests before they hit the cache or renderers. It is used for route protection, reading and modifying cookies, path rewrites, geo-location routing, and injecting Content Security Policy (CSP) headers.',
                analogy: 'The bouncer at the VIP nightclub entrance: they check your ID wristband (session cookie) out on the street before you even step into the foyer, turning away uninvited guests before the club serves any drinks.',
                seniorInsight: 'Keep middleware lightweight (< 1MB bundle). Never import heavy Node.js libraries (bcrypt, full Prisma clients) inside Edge Middleware: use lightweight JWT libraries like "jose" designed for Edge runtimes.'
            },
            trap: {
                title: 'Redirecting inside middleware without excluding static assets and images',
                juniorCode: `// ❌ JUNIOR: Middleware intercepts every single CSS, favicon, and image request!
export function middleware(req: NextRequest) {
    // 💥 Every single .png, .css, and font file runs auth logic and gets redirected!
    if (!req.cookies.get('token')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}`,
                seniorCode: `// ✅ SENIOR: Use a matcher configuration to strictly filter target routes
export function middleware(req: NextRequest) {
    const token = req.cookies.get('session');
    if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    // Exclude static assets, api routes, and Next internals from middleware:
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};`,
                explanation: 'Without a matcher, middleware executes on every tiny asset request, creating huge latency and infinite redirect loops on public static files.'
            },
            drill: {
                question: 'What is the architectural difference between a "redirect" and a "rewrite" in Next.js Middleware?',
                hint: 'Consider whether the user sees the new URL in their browser address bar.',
                solution: `Answer:
- Redirect (NextResponse.redirect): Returns an HTTP 307/308 status code. The browser updates its address bar to the new URL and makes a new request.
- Rewrite (NextResponse.rewrite): The browser URL address bar remains UNCHANGED, but Next.js internally renders and serves the content from a completely different path!`,
                explanation: 'Rewrites are essential for multi-tenant subdomains (tenant.app.com -> app/tenants/[tenant]) and A/B testing.'
            },
            docLink: {
                title: 'Next.js Docs: Middleware',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/middleware',
                description: 'Complete specification of Edge Middleware, matchers, and response headers.'
            }
        },
        {
            id: 'next-11',
            title: 'Dynamic Routing, Catch-All & Static Generation (generateStaticParams)',
            estMinutes: 5,
            concept: {
                summary: 'Dynamic route segments ([slug], [...slug], [[...slug]]) allow dynamic URL parameterization. generateStaticParams() pre-computes dynamic route combinations at build-time, turning dynamic routes into high-speed static HTML cached on global CDN edge nodes.',
                analogy: 'Printing concert tickets in advance: instead of waiting for a fan to arrive at the box office and printing their ticket one-by-one, you pre-print all 5,000 numbered tickets before the gates open so fans walk straight through.',
                seniorInsight: 'Combine generateStaticParams with export const dynamicParams = true to statically pre-render top popular items at build time, while allowing rare long-tail items to be generated on-demand on their first visit!'
            },
            trap: {
                title: 'Not providing generateStaticParams for high-traffic content sites',
                juniorCode: `// ❌ JUNIOR: Every user request causes an on-demand database query and server render!
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await db.post.findUnique({ where: { slug: params.slug } });
    return <article>{post.content}</article>;
}`,
                seniorCode: `// ✅ SENIOR: Pre-render all blog posts at build-time for instant CDN delivery
export async function generateStaticParams() {
    const posts = await db.post.findMany({ select: { slug: true } });
    return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await db.post.findUnique({ where: { slug: params.slug } });
    return <article>{post.content}</article>;
}`,
                explanation: 'Without generateStaticParams, dynamic routes are rendered server-side on every user hit, sacrificing TTFB and increasing database costs.'
            },
            drill: {
                question: 'What is the difference between [...slug] (Catch-All) and [[...slug]] (Optional Catch-All)?',
                hint: 'Consider whether the base route with zero slugs matches.',
                solution: `Answer:
- Catch-All ([...slug]): Matches one or more segments (/docs/a, /docs/a/b), but does NOT match the base /docs route.
- Optional Catch-All ([[...slug]]): Matches ZERO or more segments, meaning it matches /docs, /docs/a, and /docs/a/b all within the exact same page.tsx!`,
                explanation: 'Optional catch-all is ideal for documentation portals and dynamic CMS page builders.'
            },
            docLink: {
                title: 'Next.js Reference: generateStaticParams',
                url: 'https://nextjs.org/docs/app/api-reference/functions/generate-static-params',
                description: 'Pre-rendering dynamic routes during the build phase.'
            }
        },
        {
            id: 'next-12',
            title: 'Next.js 15 Async Request APIs (await params, cookies, headers)',
            estMinutes: 5,
            concept: {
                summary: 'In Next.js 15, request-time data access points—specifically params, searchParams, cookies(), and headers()—transitioned from synchronous objects to asynchronous Promises. This architectural change allows Next.js to start rendering components before request parameters are fully resolved, paving the way for advanced optimizations like Partial Prerendering.',
                analogy: 'A secure package delivery: in the old days, you assumed the box was already unboxed on your counter (synchronous). Now, you sign for the package and unbox it with an async receipt (await params) so the delivery drone can fly away immediately.',
                seniorInsight: 'Always type params as Promise<{ slug: string }> in Next.js 15 to ensure future-proof compatibility and silence deprecation warnings.'
            },
            trap: {
                title: 'Synchronously accessing params or cookies() in Next.js 15',
                juniorCode: `// ❌ JUNIOR: Synchronous access in Next.js 15 throws runtime warnings or errors!
export default function UserPage({ params }: { params: { id: string } }) {
    // 💥 Warning: Route "/user/[id]" used "params.id". "params" should be awaited!
    return <div>User: {params.id}</div>;
}`,
                seniorCode: `// ✅ SENIOR: Await params and searchParams asynchronously
export default async function UserPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id } = await params; // Clean, compliant Next.js 15 syntax
    return <div>User: {id}</div>;
}`,
                explanation: 'Next.js 15 makes runtime APIs asynchronous to enable partial static pre-rendering of components that do not rely on dynamic request parameters.'
            },
            drill: {
                question: 'How do you read a cookie asynchronously in a Next.js 15 Server Component?',
                hint: 'Remember that cookies() returns a Promise in Next.js 15.',
                solution: `import { cookies } from 'next/headers';

export default async function ProfileHeader() {
    const cookieStore = await cookies();
    const theme = cookieStore.get('theme')?.value ?? 'dark';
    return <div>Active Theme: {theme}</div>;
}`,
                explanation: 'Both cookies() and headers() must be awaited before accessing get(), set(), or delete() methods.'
            },
            docLink: {
                title: 'Next.js 15 Upgrade Guide: Async Request APIs',
                url: 'https://nextjs.org/docs/app/building-your-application/upgrading/version-15',
                description: 'Migrating synchronous cookies, headers, and params to async Promises.'
            }
        },
        {
            id: 'next-13',
            title: 'Parallel Routes (@slot) & Multi-Panel Dashboards',
            estMinutes: 5,
            concept: {
                summary: 'Parallel Routing allows you to simultaneously render multiple independent pages within the same layout using named slots (@slot). Each slot can navigate independently, have its own error and loading boundaries, and be conditionally rendered based on user permissions or authentication status.',
                analogy: 'A split-screen television: you can watch the football game on the left slot while the news ticker scrolls on the right slot. Changing channels on the news ticker does not interrupt or restart the football game.',
                seniorInsight: 'Always provide a default.tsx inside every parallel slot directory! If a user performs a hard refresh on an unmatched sub-route, Next.js renders default.tsx as the fallback.'
            },
            trap: {
                title: 'Omitting default.tsx in parallel route slots resulting in 404s on page refresh',
                juniorCode: `// ❌ JUNIOR: Navigating to /dashboard/settings renders 404 because @analytics has no matching page!
// app/dashboard/layout.tsx:
export default function Layout({ children, analytics }: { children: React.ReactNode, analytics: React.ReactNode }) {
    return <div>{children}{analytics}</div>;
}
// app/dashboard/@analytics/page.tsx exists, but NO @analytics/default.tsx exists!`,
                seniorCode: `// ✅ SENIOR: Always provide default.tsx to maintain slot state during hard reloads
// app/dashboard/@analytics/default.tsx
export default function AnalyticsDefault() {
    return null; // Or a fallback placeholder when current URL doesn't match analytics
}`,
                explanation: 'When navigating via hard refresh or external URL, Next.js cannot recover the previous slot state unless a default.tsx is provided.'
            },
            drill: {
                question: 'How can Parallel Routes be used to conditionally render an Admin panel vs a Member panel based on user role?',
                hint: 'Inspect layout.tsx props where slots are injected.',
                solution: `// app/dashboard/layout.tsx
export default async function DashboardLayout({
    admin,
    member
}: {
    admin: React.ReactNode;
    member: React.ReactNode;
}) {
    const user = await getCurrentUser();
    return (
        <div className="dashboard-container">
            {user.role === 'ADMIN' ? admin : member}
        </div>
    );
}`,
                explanation: 'Parallel route slots act as dynamic JSX props in the layout, enabling clean server-side role gating without nested redirects.'
            },
            docLink: {
                title: 'Next.js Docs: Parallel Routes',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/parallel-routes',
                description: 'Official guide on parallel slots, conditional rendering, and independent navigation.'
            }
        },
        {
            id: 'next-14',
            title: 'Intercepting Routes ((.), (..)) for Modal URLs & Feed Previews',
            estMinutes: 5,
            concept: {
                summary: 'Intercepting routes allow you to load a route from another part of your application within the current layout while updating the browser URL. When clicking a photo in a feed, an intercepting route renders the photo in a modal over the feed. When refreshing the page or copying the link, the dedicated standalone photo page renders normally.',
                analogy: 'Hovering over a book in a library: picking up the book to read the back-cover summary right there in the aisle (intercepted modal) vs checking the book out and reading the whole book at home (full standalone page).',
                seniorInsight: 'Combine intercepting routes (.) with parallel routes (@modal) for the ultimate production modal pattern: shareable URLs, browser back-button history, and zero client modal state hacks.'
            },
            trap: {
                title: 'Managing modal dialogs entirely in client state without shareable URLs',
                juniorCode: `// ❌ JUNIOR: User cannot share photo link; pressing browser Back button exits the whole website!
function PhotoFeed() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    return (
        <div>
            {photos.map(p => <img onClick={() => setSelectedPhoto(p)} />)}
            {selectedPhoto && <Modal photo={selectedPhoto} />}
        </div>
    );
}`,
                seniorCode: `// ✅ SENIOR: Use Intercepting Route (.)photo/[id] with <Link href="/photo/123">
// Clicking the link opens the modal AND updates URL to /photo/123.
// Refreshing /photo/123 renders the full standalone photo page with dedicated SEO!
export default function PhotoCard({ photo }: { photo: Photo }) {
    return (
        <Link href={\`/photo/\${photo.id}\`} scroll={false}>
            <Image src={photo.url} alt={photo.title} width={300} height={200} />
        </Link>
    );
}`,
                explanation: 'Client state modals break deep linking, SEO indexing, and standard browser navigation semantics.'
            },
            drill: {
                question: 'What do the route intercepting convention prefixes (.), (..), (..)(..), and (...) represent?',
                hint: 'Think about relative directory traversal like ./ and ../ in file paths.',
                solution: `Answer:
- (.) matches segments on the SAME level.
- (..) matches segments ONE level above.
- (..)(..) matches segments TWO levels above.
- (...) matches segments from the ROOT app directory.`,
                explanation: 'These prefixes tell Next.js how many levels up in the folder tree to intercept the target route.'
            },
            docLink: {
                title: 'Next.js Docs: Intercepting Routes',
                url: 'https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes',
                description: 'Deep dive on modal URLs and soft navigation interception.'
            }
        },
        {
            id: 'next-15',
            title: 'Partial Prerendering (PPR): Static Shell + Dynamic Stream in One Response',
            estMinutes: 5,
            concept: {
                summary: 'Partial Prerendering (PPR) is Next.js’s breakthrough rendering architecture that merges static pre-rendering with dynamic streaming into the same HTTP response. At build time, Next.js pre-renders a static HTML shell (navigation, headers, marketing copy) and embeds Suspense holes. When a request arrives, the static shell is served instantly from the edge CDN, while dynamic content streams into the holes simultaneously.',
                analogy: 'A pre-printed newspaper with a live digital clock in the center: the physical newspaper is printed hours ago (static shell), but the digital display updates with current live data the second you open it.',
                seniorInsight: 'PPR gives you the 0ms TTFB speed of static site generation (SSG) combined with the full personalized capabilities of server-side rendering (SSR), eliminating the traditional speed vs dynamism tradeoff.'
            },
            trap: {
                title: 'Forgetting to isolate dynamic personalized components in Suspense boundaries under PPR',
                juniorCode: `// ❌ JUNIOR: Without Suspense, a single user cookie de-opts the ENTIRE page from static prerendering!
export default async function ProductPage() {
    const cookieStore = await cookies();
    const user = cookieStore.get('user'); // 💥 Whole page becomes slow dynamic SSR!
    return <div>Welcome {user?.value} <ProductList /></div>;
}`,
                seniorCode: `// ✅ SENIOR: Wrap only dynamic user-specific holes in Suspense
export default function ProductPage() {
    return (
        <div>
            {/* Statically pre-rendered shell served from Edge CDN in 15ms: */}
            <Header />
            <ProductList />
            
            {/* Dynamic personalized hole streamed progressively: */}
            <Suspense fallback={<UserGreetingSkeleton />}>
                <DynamicUserGreeting />
            </Suspense>
        </div>
    );
}`,
                explanation: 'Under PPR, any component that accesses dynamic functions (cookies, headers) must be enclosed inside a Suspense boundary to avoid blocking the static shell.'
            },
            drill: {
                question: 'How do you enable Partial Prerendering in next.config.js and on an individual page?',
                hint: 'Look for experimental.ppr in configuration.',
                solution: `// 1. In next.config.js:
module.exports = {
    experimental: {
        ppr: 'incremental' // Enables PPR adoption incrementally per route
    }
};

// 2. In your page.tsx:
export const experimental_ppr = true;`,
                explanation: 'Incremental PPR allows you to test and deploy Partial Prerendering on individual high-traffic pages without rewriting your entire application.'
            },
            docLink: {
                title: 'Next.js Docs: Partial Prerendering',
                url: 'https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering',
                description: 'Official architecture and configuration guide for Partial Prerendering.'
            }
        },
        {
            id: 'next-16',
            title: 'Asset Optimization & Core Web Vitals (next/image, next/font, dynamic OG)',
            estMinutes: 5,
            concept: {
                summary: 'Next.js provides built-in optimizers for Core Web Vitals: next/image prevents Cumulative Layout Shift (CLS) through intrinsic sizing and automatically converts images to AVIF/WebP; next/font self-hosts Google Fonts at build time with zero external network roundtrips; ImageResponse from next/og generates dynamic social cards directly at the edge.',
                analogy: 'A tailored suit: instead of shipping a one-size-fits-all 5MB graphic to mobile phones, next/image custom-tailors the exact dimensions and compression format tailored to each device screen before sending it over the wire.',
                seniorInsight: 'Always add the "priority" prop to your above-the-fold hero image! This preloads the image and directly optimizes your Largest Contentful Paint (LCP) score for Google ranking.'
            },
            trap: {
                title: 'Using standard <img> tags or using <Image fill /> without the sizes prop',
                juniorCode: `// ❌ JUNIOR: Omitting "sizes" forces mobile phones to download massive 4K desktop images!
<div className="relative w-full h-64">
    {/* 💥 Downloads huge default image on mobile; causes major bandwidth waste */}
    <Image src="/hero.jpg" fill alt="Hero" />
</div>`,
                seniorCode: `// ✅ SENIOR: Configure responsive sizes and priority for above-the-fold media
<div className="relative w-full h-64">
    <Image 
        src="/hero.jpg" 
        fill 
        priority 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt="Hero banner" 
        className="object-cover"
    />
</div>`,
                explanation: 'The sizes attribute informs the browser which responsive image source to request from the Next.js image optimization pipeline, cutting mobile image payloads by up to 80%.'
            },
            drill: {
                question: 'How do you create a dynamic Open Graph (OG) social card in Next.js using ImageResponse in an opengraph-image.tsx file?',
                hint: 'Check the next/og package.',
                solution: `import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { slug: string } }) {
    return new ImageResponse(
        (
            <div style={{ display: 'flex', background: '#0f172a', color: '#fff', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 'bold' }}>
                Article: {params.slug}
            </div>
        ),
        { ...size }
    );
}`,
                explanation: 'Special file opengraph-image.tsx automatically generates dynamic social preview cards rendered as PNGs on edge workers.'
            },
            docLink: {
                title: 'Next.js Docs: Image Optimization',
                url: 'https://nextjs.org/docs/app/building-your-application/optimizing/images',
                description: 'Core Web Vitals image optimization, AVIF compression, and responsive sizing.'
            }
        }
    ]
};
