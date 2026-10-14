export interface ExternalResource {
    title: string;
    url: string;
    description: string;
    badge?: string; // e.g. "Official Docs", "RFC", "Deep Dive"
}

export interface Checkpoint {
    id: string;
    title: string;
    estMinutes: number; // e.g. 5
    concept: {
        summary: string;
        analogy: string;
        seniorInsight: string;
    };
    trap: {
        title: string;
        juniorCode: string;
        seniorCode: string;
        explanation: string;
    };
    drill: {
        question: string;
        starterCode?: string;
        hint?: string;
        solution: string;
        explanation: string;
    };
    docLink: ExternalResource;
}

export interface SkillRoadmap {
    skillId: string;
    skillName: string;
    category: 'CLIENT-SIDE' | 'SERVER-SIDE' | 'DATA STORAGE' | 'FOUNDATIONS';
    tagline: string;
    accentColor: string;
    officialDocs: ExternalResource[];
    checkpoints: Checkpoint[];
}

export const SKILL_ROADMAPS: Record<string, SkillRoadmap> = {
    'react': {
        skillId: 'react',
        skillName: 'React 19 & Next.js',
        category: 'CLIENT-SIDE',
        tagline: 'Modern component systems, compiler architecture, and asynchronous server actions.',
        accentColor: '#2563eb',
        officialDocs: [
            {
                title: 'React 19 Official Documentation',
                url: 'https://react.dev/reference/react',
                description: 'The canonical documentation for modern hooks, actions, and architectural patterns.',
                badge: 'Official Canonical Docs'
            },
            {
                title: 'Next.js App Router Documentation',
                url: 'https://nextjs.org/docs/app',
                description: 'Server components, streaming, layouts, and route handlers.',
                badge: 'Framework Standard'
            },
            {
                title: 'React Working Group RFCs',
                url: 'https://github.com/reactwg/react-19',
                description: 'Deep architectural discussions behind React 19 compiler and server actions.',
                badge: 'Deep Architecture'
            }
        ],
        checkpoints: [
            {
                id: 'react-1',
                title: 'Server Actions & Form Mutations',
                estMinutes: 5,
                concept: {
                    summary: 'React 19 Server Actions allow you to run asynchronous server-side mutations directly from forms without creating separate REST endpoints or managing manual loading state boilerplate.',
                    analogy: 'Instead of walking to a separate mail office (writing a custom fetch POST API handler), you drop your letter directly into an on-premise chute that delivers and verifies it in one movement.',
                    seniorInsight: 'Senior engineers use Server Actions alongside `useActionState` and optimistic updates to achieve progressive enhancement: the form functions even before client JavaScript finishes hydrating.'
                },
                trap: {
                    title: 'Manual useEffect fetching & submit state tracking vs Server Actions',
                    juniorCode: `// ❌ JUNIOR: Manual fetch, state boilerplate, race conditions
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/update-user', { method: 'POST', body: JSON.stringify(data) });
    setLoading(false);
};`,
                    seniorCode: `// ✅ SENIOR: React 19 Server Action with useActionState
async function updateUserAction(prevState: any, formData: FormData) {
    'use server';
    return await db.user.update({ name: formData.get('name') as string });
}
const [state, formAction, isPending] = useActionState(updateUserAction, null);
return <form action={formAction}><button disabled={isPending}>Save</button></form>;`,
                    explanation: 'The junior pattern leads to race conditions, requires manual state tracking, and breaks if JS is slow. The React 19 action handles pending state natively and enables progressive enhancement.'
                },
                drill: {
                    question: 'How do you define a Server Action inside a Next.js Server Component vs a separate shared actions file?',
                    hint: 'Look for the special directive string at the top of the function or file.',
                    solution: `// Inside a Server Component: place 'use server' at top of the async function:
async function myAction() {
    'use server';
    // server-only logic
}

// In a dedicated actions file (e.g. actions.ts): place 'use server' at the very top of the file:
'use server';
export async function myAction() { /* ... */ }`,
                    explanation: 'The "use server" directive marks entry points for client-to-server RPCs. It bundles only the action reference on the client while keeping execution strictly on the server.'
                },
                docLink: {
                    title: 'React Reference: useActionState',
                    url: 'https://react.dev/reference/react/useActionState',
                    description: 'Official API reference for managing action pending states and return values.'
                }
            },
            {
                id: 'react-2',
                title: 'Optimistic UI with useOptimistic',
                estMinutes: 5,
                concept: {
                    summary: 'Optimistic UI renders the expected outcome on the screen immediately before the server responds, automatically rolling back if the request fails.',
                    analogy: 'Sending a WhatsApp message: the message bubble appears with a faint clock icon immediately so the app feels instant, without waiting for the server acknowledgment.',
                    seniorInsight: 'Senior engineers treat latency as an interface problem, not just a network problem. `useOptimistic` eliminates perceived latency without corrupting true server state.'
                },
                trap: {
                    title: 'Mutating local state directly before server response without rollback',
                    juniorCode: `// ❌ JUNIOR: Modifying state optimistically with no rollback if server rejects
const handleLike = async () => {
    setLikes(likes + 1); // If network drops, UI shows wrong like count!
    await api.post('/like');
};`,
                    seniorCode: `// ✅ SENIOR: React 19 useOptimistic with automatic rollback on rejection
const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (state, delta: number) => state + delta
);
const handleLike = async () => {
    startTransition(async () => {
        setOptimisticLikes(1);
        await api.post('/like'); // If this throws, React rolls back optimisticLikes
    });
};`,
                    explanation: 'Mutating normal state directly leaves the UI in a broken state if the server fails. `useOptimistic` is paired with React Transitions to discard the draft state automatically if the action fails.'
                },
                drill: {
                    question: 'Why does useOptimistic need to be wrapped inside startTransition or an async form action?',
                    hint: 'Think about how React coordinates optimistic state during an in-flight server mutation.',
                    solution: `// useOptimistic state only persists while an associated Transition or Action is pending:
startTransition(async () => {
    setOptimisticLikes(1);
    await updateServer();
});
// When the transition completes (or fails), React automatically syncs back to the real state.`,
                    explanation: 'React uses transitions to identify the lifetime of an optimistic update. Once the transition promise settles, React reverts the optimistic state and re-renders with the true server result.'
                },
                docLink: {
                    title: 'React Reference: useOptimistic',
                    url: 'https://react.dev/reference/react/useOptimistic',
                    description: 'Deep dive on optimistic state updates with rollback guarantees.'
                }
            },
            {
                id: 'react-3',
                title: 'React 19 Compiler vs manual useMemo / useCallback',
                estMinutes: 5,
                concept: {
                    summary: 'The React 19 compiler automatically memoizes component outputs and derived values at build-time, rendering manual useMemo and useCallback mostly obsolete.',
                    analogy: 'A smart automatic transmission car: you no longer need to manually manage gears (useMemo dependency arrays); the engine shifts seamlessly for maximum efficiency.',
                    seniorInsight: 'Senior developers write idiomatic, clean JavaScript and let the compiler optimize, avoiding the bugs caused by forgotten or bloated manual dependency arrays.'
                },
                trap: {
                    title: 'Over-memoizing primitive calculations vs clean readable code',
                    juniorCode: `// ❌ JUNIOR: Wrapping cheap calculations in useMemo (adds memory overhead & clutter)
const fullName = useMemo(() => {
    return \`\${user.firstName} \${user.lastName}\`;
}, [user.firstName, user.lastName]);`,
                    seniorCode: `// ✅ SENIOR: Plain, direct computation
// In React 19, the compiler auto-optimizes this without manual memory allocations
const fullName = \`\${user.firstName} \${user.lastName}\`;`,
                    explanation: 'Creating a useMemo closure has a memory cost that is often higher than simply concatenating two strings. In React 19, the compiler handles memoization at the AST level.'
                },
                drill: {
                    question: 'When should you STILL care about object identity in React even with modern optimizations?',
                    hint: 'Consider third-party library listeners, WebSockets, or custom hook dependencies.',
                    solution: `// When passing callbacks or objects into external imperative APIs:
useEffect(() => {
    const socket = connect();
    socket.on('event', onMessage); // If onMessage reference changes every render, listeners leak!
    return () => socket.disconnect();
}, [onMessage]);`,
                    explanation: 'When interfacing with external imperative systems (Canvas, WebSockets, Chart.js), maintaining reference stability ensures you do not continuously detach and reattach event listeners.'
                },
                docLink: {
                    title: 'React Compiler Overview',
                    url: 'https://react.dev/learn/react-compiler',
                    description: 'Understanding how the React compiler works and what changes in React 19.'
                }
            },
            {
                id: 'react-4',
                title: 'Avoiding Memory Leaks in useEffect & Event Listeners',
                estMinutes: 5,
                concept: {
                    summary: 'Every subscription, interval, or event listener created inside useEffect must have an exact cleanup return function, otherwise closures leak memory across re-renders.',
                    analogy: 'Borrowing a book from a library: every time you take a book (subscribe), you must return it when you are done (cleanup function), otherwise the library runs out of space.',
                    seniorInsight: 'Senior engineers use `AbortController` in `useEffect` so that both DOM event listeners and in-flight fetch requests are canceled cleanly with a single signal.'
                },
                trap: {
                    title: 'Setting up event listener without returning cleanup',
                    juniorCode: `// ❌ JUNIOR: Listener added on every re-render; never removed
useEffect(() => {
    window.addEventListener('resize', handleResize);
}, []); // Even with empty deps, in Strict Mode or unmount this leaves an orphaned listener!`,
                    seniorCode: `// ✅ SENIOR: AbortController handles all cleanup in one return
useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('resize', handleResize, { signal: controller.signal });
    return () => controller.abort(); // Automatically removes listener cleanly
}, []);`,
                    explanation: 'Passing { signal: controller.signal } into addEventListener allows you to remove the listener cleanly simply by calling controller.abort() in the cleanup return.'
                },
                drill: {
                    question: 'How do you cancel an in-flight fetch request inside useEffect if the user navigates away before it resolves?',
                    hint: 'Use the same AbortController signal in fetch options.',
                    solution: `useEffect(() => {
    const controller = new AbortController();
    fetch('/api/user', { signal: controller.signal })
        .then(res => res.json())
        .then(setData)
        .catch(err => {
            if (err.name !== 'AbortError') console.error(err);
        });
    return () => controller.abort();
}, []);`,
                    explanation: 'Calling controller.abort() causes fetch to reject with AbortError, preventing state updates on unmounted components and canceling network transmission.'
                },
                docLink: {
                    title: 'React Reference: Synchronizing with Effects',
                    url: 'https://react.dev/learn/synchronizing-with-effects',
                    description: 'Mastering cleanup functions and lifecycle behavior in React.'
                }
            },
            {
                id: 'react-5',
                title: 'Fiber Reconciliation & The Danger of Index as Key',
                estMinutes: 5,
                concept: {
                    summary: 'React uses keys to identify which items in a list have changed, been added, or removed. Using array indices as keys destroys component identity when items are reordered or deleted.',
                    analogy: 'Labeling employees by their cubicle number (Index) instead of Employee ID. If employee #2 leaves and everyone shifts down, everyone gets the wrong paycheck.',
                    seniorInsight: 'Using index as key causes subtle bugs with input states, checkbox selections, and CSS animations, because React reuses the existing DOM nodes instead of recreating them.'
                },
                trap: {
                    title: 'Using array index as key in dynamic or filterable lists',
                    juniorCode: `// ❌ JUNIOR: Index as key breaks state on delete or reorder
{items.map((item, index) => (
    <TodoItem key={index} item={item} />
))}`,
                    seniorCode: `// ✅ SENIOR: Stable unique business identifier as key
{items.map((item) => (
    <TodoItem key={item.id} item={item} />
))}`,
                    explanation: 'When item 0 is deleted from an index-keyed list, React thinks item 0 is still there (key 0) and deletes the last item instead, causing stale inputs and state bleed.'
                },
                drill: {
                    question: 'If you have a list of static items with no unique ID, how should you generate keys safely without Math.random()?',
                    hint: 'Consider string composition of immutable fields or crypto.randomUUID during data creation, NOT inside render.',
                    solution: `// Generate IDs once when data is created, NOT during render:
const items = rawData.map(text => ({ id: crypto.randomUUID(), text }));

// Or use a composite of immutable properties:
<Item key={\`\${item.category}-\${item.slug}\`} />`,
                    explanation: 'Generating random IDs inside JSX render (key={Math.random()}) forces React to destroy and recreate the DOM on every single render, tanking performance.'
                },
                docLink: {
                    title: 'React Reference: Rendering Lists & Keys',
                    url: 'https://react.dev/learn/rendering-lists',
                    description: 'Understanding key reconciliation and state preservation across renders.'
                }
            }
        ]
    },
    'typescript': {
        skillId: 'typescript',
        skillName: 'TypeScript',
        category: 'FOUNDATIONS',
        tagline: 'Strict type safety, discriminated unions, and scalable type engineering.',
        accentColor: '#3178c6',
        officialDocs: [
            {
                title: 'TypeScript Official Handbook',
                url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
                description: 'The complete reference for TypeScript language design and compiler options.',
                badge: 'Official Handbook'
            },
            {
                title: 'TypeScript Utility Types',
                url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
                description: 'Documentation for Pick, Omit, Record, Partial, and ReturnType.',
                badge: 'Utility Types'
            }
        ],
        checkpoints: [
            {
                id: 'ts-1',
                title: 'Discriminated Unions & Exhaustive Type Checks',
                estMinutes: 5,
                concept: {
                    summary: 'A discriminated union uses a common literal property (like "status" or "type") to narrow down polymorphic data models with 100% compile-time safety.',
                    analogy: 'Color-coded emergency badges: a paramedic wearing red has access to medical supplies; an engineer wearing blue has access to servers. The badge color guarantees their permissions.',
                    seniorInsight: 'Senior developers pair discriminated unions with an exhaustive `never` check in switch statements, so adding a new state causes a compile-time error until all cases are handled.'
                },
                trap: {
                    title: 'Optional field soup vs clear discriminated union',
                    juniorCode: `// ❌ JUNIOR: One giant type with optional fields. You can have status "success" with no data!
interface ApiResponse {
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: User;
    error?: string;
}`,
                    seniorCode: `// ✅ SENIOR: Discriminated union enforces data presence per state
type ApiResponse =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: User }
    | { status: 'error'; error: string };`,
                    explanation: 'With the junior type, TS lets you read `response.data` even when status is "error", causing runtime crashes. The senior union makes `data` accessible ONLY when status is "success".'
                },
                drill: {
                    question: 'How do you guarantee a switch statement handles all cases of a discriminated union at compile time?',
                    hint: 'Assign the unhandled case to the "never" type in the default branch.',
                    solution: `function handleState(state: ApiResponse) {
    switch (state.status) {
        case 'idle': return 'Waiting';
        case 'loading': return 'Fetching...';
        case 'success': return state.data.name;
        case 'error': return state.error;
        default: {
            const _exhaustiveCheck: never = state;
            return _exhaustiveCheck;
        }
    }
}`,
                    explanation: 'If someone adds a new status like "paused" to ApiResponse, TypeScript will throw a compile error at _exhaustiveCheck because "paused" cannot be assigned to type "never".'
                },
                docLink: {
                    title: 'TypeScript: Narrowing & Discriminated Unions',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions',
                    description: 'Official guide on narrowing types using discriminant properties.'
                }
            },
            {
                id: 'ts-2',
                title: 'The satisfies Operator vs Type Annotations',
                estMinutes: 5,
                concept: {
                    summary: 'The `satisfies` operator validates that a value matches a type definition WITHOUT widening literal types or losing specific autocomplete inference.',
                    analogy: 'Showing your ID to prove you are over 18 without having to surrender your ID or change your name to "Generic Adult".',
                    seniorInsight: 'Before `satisfies`, typing an object with a Record widened literal keys to `string`, destroying exact key and value autocompletion.'
                },
                trap: {
                    title: 'Type annotation widening vs satisfies precision',
                    juniorCode: `// ❌ JUNIOR: Type annotation widens palette to generic strings
type Palette = Record<string, string | number[]>;
const theme: Palette = { primary: '#2563eb', rgb: [37, 99, 235] };
theme.primary.toUpperCase(); // ❌ TS Error: property toUpperCase does not exist on number[]!`,
                    seniorCode: `// ✅ SENIOR: satisfies validates contract while preserving exact literal types
type Palette = Record<string, string | number[]>;
const theme = { primary: '#2563eb', rgb: [37, 99, 235] } satisfies Palette;
theme.primary.toUpperCase(); // ✅ Works! TS knows primary is specifically a string.`,
                    explanation: 'Using : Palette loses exact type information. Using satisfies verifies that theme conforms to Palette while preserving exact member types.'
                },
                drill: {
                    question: 'Given an object with colors, use satisfies to ensure all values are valid hex codes or RGB tuples without losing specific property autocompletion.',
                    hint: 'Syntax: const myObject = { ... } satisfies Interface;',
                    solution: `type ColorConfig = Record<string, string | [number, number, number]>;

const colors = {
    brand: '#2563eb',
    accent: [16, 185, 129]
} satisfies ColorConfig;

// TS knows colors.brand is string and colors.accent is [number, number, number]
colors.accent.map(val => val * 2); // Fully typed!`,
                    explanation: 'satisfies ensures missing properties or wrong types are caught, while keeping specific array methods and string methods intact on individual keys.'
                },
                docLink: {
                    title: 'TypeScript 4.9: The satisfies Operator',
                    url: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator',
                    description: 'Official release documentation explaining the satisfies operator.'
                }
            },
            {
                id: 'ts-3',
                title: 'Generics with Extends Constraints',
                estMinutes: 5,
                concept: {
                    summary: 'Generics let functions work across multiple data types, while `extends` puts a minimum requirement on what those types must possess.',
                    analogy: 'A phone charging dock that works for any phone model (generic), as long as it has a USB-C port (`T extends { port: "usb-c" }`).',
                    seniorInsight: 'Senior developers avoid unconstrained `T` when working with properties. Constraining with `extends` gives full property access without resorting to `any`.'
                },
                trap: {
                    title: 'Using any or unconstrained T when accessing properties',
                    juniorCode: `// ❌ JUNIOR: Unconstrained T cannot access .id
function getEntityId<T>(entity: T) {
    return (entity as any).id; // Dangerous bypass!
}`,
                    seniorCode: `// ✅ SENIOR: Generic constrained by required shape
function getEntityId<T extends { id: string | number }>(entity: T): T['id'] {
    return entity.id; // 100% type safe and autocompleted
}`,
                    explanation: 'Constraining with extends guarantees to the compiler that entity always contains an id, removing the need for unsafe type casts.'
                },
                drill: {
                    question: 'Write a generic function "getProperty" that takes an object and a key, and returns the property value with exact return type inference.',
                    hint: 'Use two generic parameters: T and K extends keyof T.',
                    solution: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: 'Purushothaman', age: 24 };
const name = getProperty(user, 'name'); // Type is strictly 'string'!`,
                    explanation: 'K extends keyof T restricts the key argument to only valid keys on the object, and T[K] automatically infers the exact return type.'
                },
                docLink: {
                    title: 'TypeScript: Generic Constraints',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints',
                    description: 'How to restrict generic parameters to maintain type safety.'
                }
            }
        ]
    },
    'nodejs': {
        skillId: 'nodejs',
        skillName: 'Node.js & Express',
        category: 'SERVER-SIDE',
        tagline: 'Asynchronous event-loop runtime, streams, security middlewares, and REST APIs.',
        accentColor: '#16a34a',
        officialDocs: [
            {
                title: 'Node.js Official API Documentation',
                url: 'https://nodejs.org/docs/latest/api/',
                description: 'Complete documentation for Node.js core modules (fs, stream, http, crypto).',
                badge: 'Official API Docs'
            },
            {
                title: 'Node.js Event Loop Guide',
                url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
                description: 'The authoritative guide on timers, I/O polling, and microtask queues.',
                badge: 'Event Loop Deep Dive'
            }
        ],
        checkpoints: [
            {
                id: 'node-1',
                title: 'The Event Loop: Microtasks vs Macrotasks',
                estMinutes: 5,
                concept: {
                    summary: 'Node.js is single-threaded. Microtasks (Promise.then, process.nextTick) are executed immediately after the current operation, BEFORE any macrotasks (setTimeout, setImmediate, I/O).',
                    analogy: 'An emergency room doctor (CPU): patients with critical emergency updates (microtasks) skip the waiting queue and are seen before the regular appointment list (macrotasks).',
                    seniorInsight: 'Senior developers know that a runaway loop of `process.nextTick` or recursive Promises will starve the event loop and freeze I/O entirely.'
                },
                trap: {
                    title: 'Misunderstanding execution order between setTimeout and Promise.resolve',
                    juniorCode: `// ❌ JUNIOR: Expects setTimeout(0) to run before Promise.then
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('Sync');
// Output: Sync -> Promise -> Timeout!`,
                    seniorCode: `// ✅ SENIOR: Understands that Microtask queue drains before Macrotask queue
// Sync code runs first -> Microtasks (Promises) drain completely -> Timers execute next`,
                    explanation: 'Promises live in the Microtask queue. The event loop guarantees that the entire microtask queue is drained before advancing to the next phase of macrotasks.'
                },
                drill: {
                    question: 'What is the exact console log output order of the following script?',
                    starterCode: `console.log('1');
setTimeout(() => console.log('2'), 0);
process.nextTick(() => console.log('3'));
Promise.resolve().then(() => console.log('4'));
console.log('5');`,
                    solution: `Output:
1
5
3
4
2`,
                    explanation: '1 and 5 are synchronous. process.nextTick runs first in microtask queue (3), followed by Promise microtask (4), and finally the timer macrotask executes (2).'
                },
                docLink: {
                    title: 'Node.js Guide: Event Loop Execution Phases',
                    url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
                    description: 'Understanding the mechanics of phases and queues in Node.js.'
                }
            },
            {
                id: 'node-2',
                title: 'Stream Backpressure & Avoiding Memory Spikes',
                estMinutes: 5,
                concept: {
                    summary: 'Backpressure occurs when data is read faster than it can be written. If unmanaged, memory accumulates in the buffer until the Node process crashes with an Out of Memory error.',
                    analogy: 'Pouring water into a funnel: if you pour faster than the funnel drains, the water overflows. Backpressure tells you to pause pouring until the funnel clears.',
                    seniorInsight: 'Senior engineers use `pipeline()` from `node:stream/promises` instead of raw `.pipe()` to ensure proper error cleanup and automatic backpressure regulation.'
                },
                trap: {
                    title: 'Reading large files into memory with fs.readFile vs streaming',
                    juniorCode: `// ❌ JUNIOR: Loads a 2GB file entirely into RAM; server crashes under traffic
app.get('/download', async (req, res) => {
    const file = await fs.promises.readFile('./large-video.mp4');
    res.send(file);
});`,
                    seniorCode: `// ✅ SENIOR: Streams the file with backpressure handling and auto-cleanup
import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

app.get('/download', async (req, res) => {
    res.setHeader('Content-Type', 'video/mp4');
    await pipeline(createReadStream('./large-video.mp4'), res);
});`,
                    explanation: 'readFile allocates the entire file size in Node memory. pipeline streams data in tiny chunks (~64KB), keeping memory consumption flat regardless of file size.'
                },
                drill: {
                    question: 'Why is stream.pipeline() preferred over stream.pipe() in modern Node.js?',
                    hint: 'Think about what happens when the client disconnects halfway through a download.',
                    solution: `// pipeline() automatically destroys both readable and writable streams if an error occurs or the client closes the connection:
import { pipeline } from 'node:stream/promises';
await pipeline(sourceStream, destinationStream);`,
                    explanation: 'The classic .pipe() method does not destroy the source stream if the destination stream errors or closes prematurely, leaking open file descriptors.'
                },
                docLink: {
                    title: 'Node.js Documentation: Stream Pipeline',
                    url: 'https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback',
                    description: 'Official API documentation for robust stream piping with backpressure handling.'
                }
            }
        ]
    },
    'postgresql': {
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
                    juniorCode: `-- ❌ JUNIOR ASSUMPTION: Index exists on (org_id, created_at), so this query should be fast:
SELECT * FROM audit_logs WHERE created_at > NOW() - INTERVAL '1 day';
-- Result: FULL TABLE SCAN! The index cannot jump to created_at without org_id.`,
                    seniorCode: `-- ✅ SENIOR SOLUTION: Create a dedicated index or lead with the search filter
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
                    seniorInsight: 'Senior developers detect N+1 queries using ORM logging and fix them using SQL `JOIN`s, subqueries, or dataloader batching (`WHERE id IN (...)`).'
                },
                trap: {
                    title: 'Querying child relationships inside a JavaScript map() loop',
                    juniorCode: `// ❌ JUNIOR: 1 query for users + 100 queries for each user's orders = 101 queries!
const users = await db.query('SELECT * FROM users LIMIT 100');
for (const user of users) {
    user.orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [user.id]);
}`,
                    seniorCode: `// ✅ SENIOR: Single query with JOIN or Prisma relation inclusion
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
    }
};
