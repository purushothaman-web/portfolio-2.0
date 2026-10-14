import { SkillRoadmap } from './types';
export const reactRoadmap: SkillRoadmap = {
        skillId: 'react',
        skillName: 'React 19',
        category: 'CLIENT-SIDE',
        tagline: 'Modern component systems, Fiber reconciliation, concurrent transitions, and React 19 compiler architecture.',
        accentColor: '#00d8ff',
        officialDocs: [
            {
                title: 'React 19 Official Documentation',
                url: 'https://react.dev/reference/react',
                description: 'The canonical documentation for modern hooks, actions, and architectural patterns.',
                badge: 'Official Canonical Docs'
            },
            {
                title: 'React 19 Upgrade Guide & Architecture',
                url: 'https://react.dev/blog/2024/04/25/react-19',
                description: 'Official deep dive into React 19 primitives: ref as prop, useActionState, useOptimistic, and Server Actions.',
                badge: 'Release Architecture'
            },
            {
                title: 'React Official Learn Course',
                url: 'https://react.dev/learn',
                description: 'The official hands-on, interactive tutorial series by the React core team with live sandboxes.',
                badge: 'Official Interactive Course'
            }
        ],
        checkpoints: [
            {
                id: 'react-1',
                title: 'JSX Internals, Fiber Reconciliation & Key Prop Diffing',
                estMinutes: 5,
                concept: {
                    summary: 'JSX is syntax sugar compiled into jsxRuntime.jsx() calls that produce lightweight Virtual DOM object descriptions. React Fiber represents components as mutable units of work on a linked-list tree. During reconciliation, React diffs the WorkInProgress tree against the Current tree. The "key" prop gives items stable identity across renders: using array indexes as keys destroys component identity when items are added, removed, or sorted.',
                    analogy: 'A postal sorting office: stable keys are unique national passport numbers. Using array indexes is like assigning a person a number based on where they stand in line: the moment someone leaves the line, everyone gets the wrong passport and mail.',
                    seniorInsight: 'Never use Math.random() as a key: generating fresh keys every render forces React to completely unmount and destroy the DOM subtree and its internal state on every tick.'
                },
                trap: {
                    title: 'Using array index as key in dynamic, filterable, or sortable lists',
                    juniorCode: `// âŒ JUNIOR: Using array index causes input text and local state to stick to the wrong row after deletion!
{todos.map((todo, index) => (
    <TodoItem key={index} todo={todo} />
))}`,
                    seniorCode: `// âœ… SENIOR: Use a persistent unique domain identifier as the key
{todos.map((todo) => (
    <TodoItem key={todo.id} todo={todo} />
))}`,
                    explanation: 'When deleting the first item, index 0 is reused for the second item. React thinks the component type and key are unchanged, preserving local input focus and state on the wrong entity.'
                },
                drill: {
                    question: 'Why does passing a new unique key to a component (e.g. <UserProfile key={userId} />) force React to reset its internal state without useEffect?',
                    hint: 'Consider what Fiber does when it encounters a different key for the same component type.',
                    solution: `Explanation:
When React encounters a different "key" for the same component position in the Fiber tree:
1. It unmounts and completely tears down the existing Fiber node.
2. It discards all associated useState/useReducer state.
3. It creates a brand-new Fiber instance with fresh initial state.

Pattern: "Resetting state with a key" is the cleanest senior pattern to reset form or modal state when switching entities without writing defensive useEffect reset logic!`,
                    explanation: 'Key changes tell the reconciliation engine that the old entity no longer exists, triggering a clean teardown and fresh initialization.'
                },
                docLink: {
                    title: 'React Learn: Keeping List Items in Order with Keys',
                    url: 'https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key',
                    description: 'Understanding key reconciliation, diffing algorithms, and avoiding index bugs.'
                }
            },
            {
                id: 'react-2',
                title: 'State Immutability, Automatic Batching & Functional Updates',
                estMinutes: 5,
                concept: {
                    summary: 'State in React is treated as an immutable snapshot. React 18/19 automatically batches state updates togetherâ€”even inside asynchronous fetch callbacks, setTimeout, or native eventsâ€”triggering a single consolidated re-render. When new state depends on previous state, functional updates (setCount(prev => prev + 1)) must be used to avoid stale closure values.',
                    analogy: 'Sending batch orders to a kitchen: instead of ringing the chef bell 4 separate times for 4 drinks, the waiter writes all 4 drinks on one ticket and hands it to the kitchen at once (batching).',
                    seniorInsight: 'Direct array or object mutation (e.g. items.push(newItem); setItems(items);) fails React Object.is() shallow reference comparison, causing React to completely skip re-rendering.'
                },
                trap: {
                    title: 'Calling state setters multiple times in asynchronous closures without updater functions',
                    juniorCode: `// âŒ JUNIOR: Both calls read the same snapshot value of count from closure!
const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1); // Only increments by 1 total, not 2!
};`,
                    seniorCode: `// âœ… SENIOR: Functional state updates read the pending queue value
const handleClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // Correctly increments by 2!
};`,
                    explanation: 'The variable count is a constant within the current render execution. Passing an updater function (prev => prev + 1) reads from React pending state queue rather than the captured closure.'
                },
                drill: {
                    question: 'What gets logged to the console immediately after calling setCount(42)?\n\nconst [count, setCount] = useState(0);\nconst update = () => {\n    setCount(42);\n    console.log(count);\n};',
                    hint: 'Think about whether state updates are synchronous or snapshot-based.',
                    solution: `Output: 0

Explanation:
Setting state does NOT alter the existing local variable count in the current execution block. State updates schedule a re-render for the next tick. The new value of 42 will only be reflected when the component function executes its NEXT render!`,
                    explanation: 'State setters in React are asynchronous relative to the current function frame: count remains locked to the snapshot value of the current render.'
                },
                docLink: {
                    title: 'React Learn: Queueing a Series of State Updates',
                    url: 'https://react.dev/learn/queueing-a-series-of-state-updates',
                    description: 'Detailed guide on batching, queueing, and functional updater functions.'
                }
            },
            {
                id: 'react-3',
                title: 'Effect Synchronization, Lifecycles & Memory Leaks (AbortController)',
                estMinutes: 5,
                concept: {
                    summary: 'useEffect is not for computing derived data or managing component lifecycles: it is an escape hatch to synchronize React state with external systems (DOM APIs, WebSockets, network connections). Effect cleanups run before re-running the effect and upon component unmount. In React Strict Mode, effects intentionally run twice in development to uncover missing cleanups.',
                    analogy: 'Plugging in an electrical appliance: when you turn it on (effect), you must also unplug it and wind the cord (cleanup) when you leave the room so it doesnâ€™t overheat.',
                    seniorInsight: 'Never put derived state calculations in useEffect (e.g. useEffect(() => setFullName(first + " " + last), [first, last])). Compute derived values directly in the render body or use useMemo if expensive.'
                },
                trap: {
                    title: 'Race condition from out-of-order network responses in useEffect',
                    juniorCode: `// âŒ JUNIOR: If user changes search query fast, query A may return AFTER query B, displaying stale data!
useEffect(() => {
    fetchUserData(userId).then(data => setUser(data));
}, [userId]);`,
                    seniorCode: `// âœ… SENIOR: AbortController cancels in-flight requests when dependencies change or unmount
useEffect(() => {
    const controller = new AbortController();
    
    fetch(\`/api/user/\${userId}\`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => {
            if (err.name !== 'AbortError') setError(err);
        });
        
    return () => controller.abort(); // Cancels stale in-flight request!
}, [userId]);`,
                    explanation: 'Network latency is unpredictable. If request 1 returns after request 2, it overwrites the UI with stale data. AbortController cancels obsolete requests immediately.'
                },
                drill: {
                    question: 'Why does React in StrictMode run useEffect mount and cleanup twice in development mode?',
                    hint: 'Consider what happens when users navigate away and back quickly.',
                    solution: `Explanation:
React intentionally runs: Mount -> Cleanup -> Mount in development to verify that your cleanup function completely undoes whatever the mount function did.

If your code breaks during the second mount (e.g. duplicate event listeners, memory leaks, double WebSockets), your effect was NOT written symmetrically!`,
                    explanation: 'Strict Mode enforces resilient effect design, guaranteeing components withstand fast tab switching, caching, and future concurrent remounting.'
                },
                docLink: {
                    title: 'React Learn: Synchronizing with Effects',
                    url: 'https://react.dev/learn/synchronizing-with-effects',
                    description: 'Understanding effect lifecycles, dependencies, and cleanup contracts.'
                }
            },
            {
                id: 'react-4',
                title: 'DOM Access, Mutable Values & React 19 ref as Prop',
                estMinutes: 5,
                concept: {
                    summary: 'useRef creates a persistent container object { current: value } that survives re-renders. Unlike useState, updating ref.current does NOT trigger a re-render, making it ideal for DOM nodes, timer IDs, and previous values. In React 19, forwardRef is completely deprecated: you can now pass ref directly as a standard component prop!',
                    analogy: 'A sticky note on your computer monitor: you can write and update a phone number on it (ref.current) as often as you want without having to restart your computer (re-render).',
                    seniorInsight: 'Do not read or write ref.current during rendering (JSX generation) because concurrent rendering can call render functions multiple times out of order. Read/write refs only in event handlers or useEffect.'
                },
                trap: {
                    title: 'Using forwardRef boilerplate in React 19',
                    juniorCode: `// âŒ JUNIOR: React 18 forwardRef boilerplate (deprecated in React 19)
const CustomInput = forwardRef((props, ref) => {
    return <input ref={ref} {...props} />;
});`,
                    seniorCode: `// âœ… SENIOR: React 19 passes ref directly as a first-class prop!
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
}

function CustomInput({ ref, ...props }: InputProps) {
    return <input ref={ref} {...props} />;
}`,
                    explanation: 'React 19 simplifies component composition by removing forwardRef entirely. Refs are now standard props, eliminating wrapping wrappers and simplifying TypeScript definitions.'
                },
                drill: {
                    question: 'How do you create a usePrevious<T>(value: T): T | undefined custom hook using useRef?',
                    hint: 'Update ref.current inside a useEffect after the render has committed.',
                    solution: `function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    
    useEffect(() => {
        ref.current = value; // Updates AFTER render commits to screen
    }, [value]);
    
    return ref.current; // Returns previous render value
}`,
                    explanation: 'Because useEffect executes after render painting, returning ref.current yields the value from the preceding render cycle.'
                },
                docLink: {
                    title: 'React 19: ref as a Prop',
                    url: 'https://react.dev/blog/2024/04/25/react-19#ref-as-a-prop',
                    description: 'Official release documentation detailing the deprecation of forwardRef and direct ref props.'
                }
            },
            {
                id: 'react-5',
                title: 'State Architecture: Context API vs Atomic Stores (Zustand)',
                estMinutes: 5,
                concept: {
                    summary: 'React Context is designed for low-frequency dependency injection (user auth, theme, locale). When a Context value changes, EVERY component that calls useContext re-renders, even if it only consumes a property that did not change. External state managers like Zustand use the useSyncExternalStore subscription pattern to re-render only the exact components whose selected slice changed.',
                    analogy: 'Context is a PA loudspeaker announcement: the whole school stops and listens. Zustand is a private text message sent only to the specific person who needs the update.',
                    seniorInsight: 'Never put high-frequency state (form typing, mouse coordinates, audio scrubbers) into Context without splitting providers. Use Zustand with fine-grained selectors for complex interactive apps.'
                },
                trap: {
                    title: 'Giant monolithic Context causing massive re-rendering cascades',
                    juniorCode: `// âŒ JUNIOR: Any change to theme re-renders components that only care about user!
const AppContext = createContext({ user: null, theme: 'light', notifications: [] });`,
                    seniorCode: `// âœ… SENIOR: Zustand atomic store with fine-grained selector subscription
import { create } from 'zustand';

interface AppStore {
    user: User | null;
    theme: string;
    setTheme: (t: string) => void;
}
export const useAppStore = create<AppStore>((set) => ({
    user: null,
    theme: 'light',
    setTheme: (theme) => set({ theme })
}));

// Component only re-renders if theme specifically changes!
function ThemeButton() {
    const theme = useAppStore(state => state.theme);
    return <span>{theme}</span>;
}`,
                    explanation: 'Zustand selectors subscribe to a strict equality slice of state. When other properties update, components using different selectors do not re-render at all.'
                },
                drill: {
                    question: 'If you MUST use Context, how can you prevent unnecessary child re-renders without external libraries?',
                    hint: 'Split context into multiple focused providers or wrap expensive children in memo or pass them as children props.',
                    solution: `Strategy: Split State and Dispatch Contexts!

const StateContext = createContext(state);
const DispatchContext = createContext(dispatch);

// Components that only dispatch actions (like buttons) consume DispatchContext
// and NEVER re-render when state changes!`,
                    explanation: 'Splitting state and dispatch separates read-consumers from write-consumers, preventing dispatch buttons from re-rendering on data updates.'
                },
                docLink: {
                    title: 'React Learn: Scaling Up with Reducer and Context',
                    url: 'https://react.dev/learn/scaling-up-with-reducer-and-context',
                    description: 'Best practices for managing application-wide state with React built-ins.'
                }
            },
            {
                id: 'react-6',
                title: 'Concurrent React: Non-Blocking Transitions (useTransition & useDeferredValue)',
                estMinutes: 5,
                concept: {
                    summary: 'Concurrent React prioritizes user interactions. Updates are categorized as Urgent (typing, clicking, tapping) and Non-Urgent (re-filtering lists, rendering heavy charts). Wrapping non-urgent updates in startTransition or using useDeferredValue allows React to interrupt long render tasks so the input field remains 60 FPS responsive without jank.',
                    analogy: 'A chef preparing a complex banquet dish: if a customer walks up to ask for a glass of water (urgent event), the chef pauses chopping for 2 seconds to pour water, then resumes the banquet dish.',
                    seniorInsight: 'useTransition gives you an isPending boolean for loading indicators when YOU trigger the state update. useDeferredValue is used when you receive a value from a parent via props.'
                },
                trap: {
                    title: 'Synchronously rendering heavy lists freezing user typing',
                    juniorCode: `// âŒ JUNIOR: Filtering 10,000 items on every keystroke freezes the input!
const handleSearch = (e) => {
    setQuery(e.target.value);
    setFilteredList(hugeList.filter(item => item.includes(e.target.value)));
};`,
                    seniorCode: `// âœ… SENIOR: useTransition keeps typing responsive while list updates concurrently
const [isPending, startTransition] = useTransition();

const handleSearch = (e) => {
    setQuery(e.target.value); // Urgent: updates input immediately
    startTransition(() => {
        setFilteredList(hugeList.filter(item => item.includes(e.target.value))); // Non-urgent!
    });
};`,
                    explanation: 'If the user types a second letter while the first list filter is still rendering, React interrupts the first render, discards it, and begins rendering the second search.'
                },
                drill: {
                    question: 'How does useDeferredValue(query) differ from standard client-side debouncing (setTimeout)?',
                    hint: 'Consider fixed millisecond delays vs computer hardware rendering speed.',
                    solution: `Explanation:
1. Debouncing waits for a fixed arbitrary delay (e.g. 300ms) regardless of machine speed, introducing artificial latency even on fast laptops.
2. useDeferredValue does NOT use fixed timers! On a fast M3 Mac, it updates immediately in 5ms. On a slow budget phone, it yields until the main thread is idle, adapting organically to device CPU speed.`,
                    explanation: 'useDeferredValue is deeply integrated with the React Fiber scheduler, yielding to high-priority events without arbitrary timer delays.'
                },
                docLink: {
                    title: 'React Reference: useTransition',
                    url: 'https://react.dev/reference/react/useTransition',
                    description: 'Official API documentation for non-blocking concurrent transitions.'
                }
            },
            {
                id: 'react-7',
                title: 'React 19 Server Actions, Progressive Forms & useActionState',
                estMinutes: 5,
                concept: {
                    summary: 'React 19 Server Actions allow you to run asynchronous server-side mutations directly from forms without creating separate REST endpoints or managing manual loading state boilerplate. useActionState manages the action return state, pending status, and execution seamlessly, supporting progressive enhancement before client JavaScript hydrates.',
                    analogy: 'Instead of walking to a separate mail office (writing a custom fetch POST API handler), you drop your letter directly into an on-premise chute that delivers and verifies it in one movement.',
                    seniorInsight: 'Senior engineers use Server Actions alongside useActionState and optimistic updates to achieve progressive enhancement: the form functions even before client JavaScript finishes hydrating.'
                },
                trap: {
                    title: 'Manual useEffect fetching & submit state tracking vs Server Actions',
                    juniorCode: `// âŒ JUNIOR: Manual fetch, state boilerplate, race conditions
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/update-user', { method: 'POST', body: JSON.stringify(data) });
    setLoading(false);
};`,
                    seniorCode: `// âœ… SENIOR: React 19 Server Action with useActionState
async function updateUserAction(prevState: any, formData: FormData) {
    'use server';
    return await db.user.update({ name: formData.get('name') as string });
}
const [state, formAction, isPending] = useActionState(updateUserAction, null);
return <form action={formAction}><button disabled={isPending}>Save</button></form>;`,
                    explanation: 'The junior pattern leads to race conditions, requires manual state tracking, and breaks if JS is slow. The React 19 action handles pending state natively and enables progressive enhancement.'
                },
                drill: {
                    question: 'How do you access pending form status inside a deeply nested child submit button without passing props in React 19?',
                    hint: 'Look for the new useFormStatus hook.',
                    solution: `import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending, data, method } = useFormStatus();
    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Submit'}
        </button>
    );
}`,
                    explanation: 'useFormStatus reads the parent <form> action status directly from React context without needing prop drilling.'
                },
                docLink: {
                    title: 'React Reference: useActionState',
                    url: 'https://react.dev/reference/react/useActionState',
                    description: 'Official API reference for managing action pending states and return values.'
                }
            },
            {
                id: 'react-8',
                title: 'Optimistic UI with useOptimistic & Automatic Rollbacks',
                estMinutes: 5,
                concept: {
                    summary: 'Optimistic UI renders the expected outcome on the screen immediately before the server responds, automatically rolling back if the request fails.',
                    analogy: 'Sending a WhatsApp message: the message bubble appears with a faint clock icon immediately so the app feels instant, without waiting for the server acknowledgment.',
                    seniorInsight: 'Senior engineers treat latency as an interface problem, not just a network problem. useOptimistic eliminates perceived latency without corrupting true server state.'
                },
                trap: {
                    title: 'Mutating local state directly before server response without rollback',
                    juniorCode: `// âŒ JUNIOR: Modifying state optimistically with no rollback if server rejects
const handleLike = async () => {
    setLikes(likes + 1); // If network drops, UI shows wrong like count!
    await api.post('/like');
};`,
                    seniorCode: `// âœ… SENIOR: React 19 useOptimistic with automatic rollback on rejection
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
                    explanation: 'Mutating normal state directly leaves the UI in a broken state if the server fails. useOptimistic is paired with React Transitions to discard the draft state automatically if the action fails.'
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
                id: 'react-9',
                title: 'React 19 use() Hook: Unwrapping Promises & Conditional Context',
                estMinutes: 5,
                concept: {
                    summary: 'React 19 introduces the use() APIâ€”a versatile primitive that unwraps Promises and reads React Context. Unlike all traditional hooks (useState, useEffect, useContext), use() can be called conditionally inside if-statements, switch cases, and loops! When reading a Promise, it integrates with <Suspense>, suspending the component until resolution.',
                    analogy: 'A vending machine on demand: traditional hooks force you to order your lunch at 8 AM when the office opens (top of the function). use() lets you walk up to the machine and grab a snack only if you get hungry at 3 PM (inside an if-statement).',
                    seniorInsight: 'Senior developers pass Promises directly from Server Components or route loaders into Client Components and unwrap them with use(promise). This completely eliminates the old useEffect + setLoading + setError boilerplate.'
                },
                trap: {
                    title: 'Creating a fresh Promise directly inside the render body passed into use()',
                    juniorCode: `// âŒ JUNIOR: Creating a new fetch promise on every single render triggers infinite Suspense loops!
function UserProfile({ userId }: { userId: string }) {
    // ðŸ’¥ Every render creates a NEW Promise reference -> use() suspends infinitely!
    const user = use(fetch(\`/api/users/\${userId}\`).then(r => r.json()));
    return <div>{user.name}</div>;
}`,
                    seniorCode: `// âœ… SENIOR: Pass promise from parent, cache with cache() or create outside render
// Parent or loader initiates the promise once:
const userPromise = fetchUser(userId); // Cached promise

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
    // use() reads the stable promise and cleanly integrates with Suspense fallback
    const user = use(userPromise);
    return <div>{user.name}</div>;
}`,
                    explanation: 'Calling use(new Promise()) in render creates an infinite loop because each re-render instantiates a brand new pending promise, causing React to suspend forever.'
                },
                drill: {
                    question: 'Why can use(ThemeContext) be called inside an "if (userPreferences.enableCustomTheme)" block, whereas useContext(ThemeContext) cannot?',
                    hint: 'Think about how React stores hooks internally on a linked list vs how use() resolves context.',
                    solution: `Explanation:
1. Traditional hooks (useState, useContext, useEffect) rely on a fixed, call-order linked-list inside the Fiber node. Calling them conditionally alters the hook count between renders and crashes React with "Rendered fewer hooks than expected".
2. The use() API does NOT use the Fiber hook linked list for context lookup. It looks up the fiber ancestor tree directly via React's internal Context stack at the exact point of execution, making conditional branching 100% safe!`,
                    explanation: 'use() was intentionally engineered by the React core team to break free from the "rules of hooks" restriction regarding conditional calls.'
                },
                docLink: {
                    title: 'React Reference: use',
                    url: 'https://react.dev/reference/react/use',
                    description: 'Official API documentation for the React 19 use() hook for Promises and Context.'
                }
            },
            {
                id: 'react-10',
                title: 'Form Subtree Feedback with useFormStatus & Action Enhancements',
                estMinutes: 5,
                concept: {
                    summary: 'useFormStatus is a React DOM hook that provides status information of the parent <form> (such as pending, data, method, action) to child components without needing prop drilling. It must be called from a component rendered inside the <form>.',
                    analogy: "A dashboard warning light inside a car door: the light does not need a dedicated wire directly from the driver's hand to know the door is open; it reads the car's centralized chassis bus signal.",
                    seniorInsight: 'Never call useFormStatus in the same component that renders the <form>: it will return pending: false because it can only read status from an ancestor form provider! Always encapsulate <SubmitButton /> as a child component.'
                },
                trap: {
                    title: 'Calling useFormStatus inside the same component that declares the <form>',
                    juniorCode: `// âŒ JUNIOR: useFormStatus() does NOT track the form rendered in its own return JSX!
function UserForm() {
    const { pending } = useFormStatus(); // Always false! It has no parent form!
    return (
        <form action={updateUser}>
            <input name="name" />
            <button disabled={pending}>Save</button>
        </form>
    );
}`,
                    seniorCode: `// âœ… SENIOR: Extract button into an isolated child component inside the form
function SubmitButton() {
    // Reads status from ancestor <form action={...}>
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="disabled:opacity-50">
            {pending ? 'Saving Changes...' : 'Save Profile'}
        </button>
    );
}

function UserForm() {
    return (
        <form action={updateUser}>
            <input name="name" />
            <SubmitButton />
        </form>
    );
}`,
                    explanation: 'useFormStatus utilizes React Context provided by the DOM <form> element. The component calling the hook must be physically nested within that form in the virtual tree.'
                },
                drill: {
                    question: 'How do you determine which specific button triggered the form submission when using useFormStatus with multiple submit buttons?',
                    hint: 'Inspect the "data" object returned by useFormStatus().',
                    solution: `function SubmitAction({ actionType }: { actionType: string }) {
    const { pending, data } = useFormStatus();
    // data is the FormData object of the active submission
    const isThisButtonSubmitting = pending && data?.get('intent') === actionType;
    
    return (
        <button type="submit" name="intent" value={actionType} disabled={pending}>
            {isThisButtonSubmitting ? 'Processing...' : actionType}
        </button>
    );
}`,
                    explanation: 'The data property in useFormStatus exposes the FormData object being submitted, allowing child components to inspect form values and submitted button names.'
                },
                docLink: {
                    title: 'React Reference: useFormStatus',
                    url: 'https://react.dev/reference/react-dom/hooks/useFormStatus',
                    description: 'Official API documentation for accessing parent form status without prop drilling.'
                }
            },
            {
                id: 'react-11',
                title: 'Error Boundaries & Production Crash Resilience',
                estMinutes: 5,
                concept: {
                    summary: 'An Error Boundary is a React component that catches JavaScript runtime errors anywhere in its child component tree during rendering, lifecycle methods, and constructors. It logs those errors and renders a localized fallback UI instead of unmounting the entire application and displaying a blank white screen.',
                    analogy: 'Circuit breakers in a modern building: if the microwave in the kitchen shorts out, the kitchen breaker trips, but the hospital lights, elevators, and living room continue running normally.',
                    seniorInsight: "Senior engineers wrap independent widgets (e.g. Comments widget, Chart panel, Sidebar) in localized Error Boundaries so that a malformed third-party payload in one widget does not crash the entire user session."
                },
                trap: {
                    title: 'Using try/catch inside functional component render to catch child errors',
                    juniorCode: `// âŒ JUNIOR: try/catch does NOT catch errors thrown during child component rendering!
function Dashboard() {
    try {
        return <AnalyticsChart data={chartData} />;
    } catch (err) {
        // This will NEVER execute for errors thrown inside <AnalyticsChart />!
        return <div>Chart failed to load</div>;
    }
}`,
                    seniorCode: `// âœ… SENIOR: Wrap volatile subtrees in dedicated Error Boundaries with reset capabilities
import { Component, ReactNode, ErrorInfo } from 'react';

interface Props { fallback: ReactNode; children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        logErrorToSentry(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}`,
                    explanation: "JSX tags like <AnalyticsChart /> do not invoke the component immediately: they merely return an object description. The actual rendering happens inside React Fiber reconciler, far outside the calling function's try/catch block."
                },
                drill: {
                    question: 'What four categories of errors do React Error Boundaries NOT catch?',
                    hint: 'Think about event handlers, async code, server rendering, and boundary self-errors.',
                    solution: `Error Boundaries do NOT catch:
1. Event handlers (e.g. onClick={() => { throw new Error(); }}) -> Use regular try/catch here!
2. Asynchronous code (e.g. setTimeout, requestAnimationFrame, unhandled Promise rejections).
3. Server-side rendering (SSR) errors before hydration.
4. Errors thrown inside the Error Boundary itself (rather than in its children).`,
                    explanation: 'Error Boundaries only catch errors that occur during the declarative rendering phase and React lifecycle execution of their children.'
                },
                docLink: {
                    title: 'React Reference: Catching rendering errors with an Error Boundary',
                    url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary',
                    description: 'Class-based Error Boundary specification, getDerivedStateFromError, and componentDidCatch.'
                }
            },
            {
                id: 'react-12',
                title: 'Portals (createPortal) & Event Bubbling across Stacking Contexts',
                estMinutes: 5,
                concept: {
                    summary: 'createPortal lets you render children into a different part of the DOM tree (like document.body) while keeping them in their original position within the React Virtual DOM hierarchy. Even though the DOM node is teleported out of the parent, React synthetic events still bubble up through the virtual React tree as if the node were physically nested inside the parent!',
                    analogy: 'A projection beam: the movie projector sits inside a booth (React component tree), projecting the image directly onto a distant billboard outside the window (DOM body), but pressing the remote still controls the projector booth.',
                    seniorInsight: 'Portals break out of parent CSS constraints (overflow: hidden, position: relative, z-index, transform which creates a new stacking context that traps fixed children) without breaking React Context or event bubbling.'
                },
                trap: {
                    title: 'Rendering fixed position modal dialogs inside an ancestor with CSS transform',
                    juniorCode: `// âŒ JUNIOR: CSS transform, perspective, or filter on parent traps fixed modals!
<div style={{ transform: 'scale(1)', overflow: 'hidden' }}>
    <button onClick={() => setOpen(true)}>Open Modal</button>
    {/* ðŸ’¥ Modal is clipped by parent overflow and positioned relative to parent, NOT the viewport! */}
    {open && <div className="fixed inset-0 bg-black/50 z-50">Modal Content</div>}
</div>`,
                    seniorCode: `// âœ… SENIOR: Teleport modal to document.body while keeping event propagation intact
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
                {children}
            </div>
        </div>,
        document.body
    );
}`,
                    explanation: 'CSS specifications dictate that any element with transform, filter, or will-change creates a new stacking context and containing block, breaking position: fixed relative to the viewport. createPortal mounts the node directly into document.body to bypass this constraint.'
                },
                drill: {
                    question: 'If a user clicks a button inside a modal rendered via createPortal(button, document.body), does an onClick handler on the parent container in React catch the click event? Why?',
                    hint: 'Distinguish between DOM event bubbling and React SyntheticEvent bubbling.',
                    solution: `Answer: YES!
Explanation:
Even though the modal DOM node lives directly under document.body in the real HTML DOM, React event propagation follows the VIRTUAL DOM component hierarchy, not the physical DOM hierarchy.
An onClick listener attached to the parent component where <Modal /> was declared will successfully intercept the bubbled event!`,
                    explanation: 'React SyntheticEvent system maintains component tree continuity regardless of physical DOM destination.'
                },
                docLink: {
                    title: 'React Reference: createPortal',
                    url: 'https://react.dev/reference/react-dom/createPortal',
                    description: 'Official guide on teleporting nodes into different DOM trees while preserving React context and bubbling.'
                }
            },
            {
                id: 'react-13',
                title: 'The React 19 Compiler vs Manual useMemo / useCallback',
                estMinutes: 5,
                concept: {
                    summary: 'The React 19 compiler automatically memoizes component outputs and derived values at build-time, rendering manual useMemo and useCallback mostly obsolete.',
                    analogy: 'A smart automatic transmission car: you no longer need to manually manage gears (useMemo dependency arrays); the engine shifts seamlessly for maximum efficiency.',
                    seniorInsight: 'Senior developers write idiomatic, clean JavaScript and let the compiler optimize, avoiding the bugs caused by forgotten or bloated manual dependency arrays.'
                },
                trap: {
                    title: 'Over-memoizing primitive calculations vs clean readable code',
                    juniorCode: `// âŒ JUNIOR: Wrapping cheap calculations in useMemo (adds memory overhead & clutter)
const fullName = useMemo(() => {
    return \`\${user.firstName} \${user.lastName}\`;
}, [user.firstName, user.lastName]);`,
                    seniorCode: `// âœ… SENIOR: Plain, direct computation
// In React 19, the compiler auto-optimizes this without manual memory allocations
const fullName = \`\${user.firstName} \${user.lastName}\`;`,
                    explanation: 'Creating a useMemo closure has a memory cost that is often higher than simply concatenating two strings. In React 19, the compiler handles memoization at the AST level.'
                },
                drill: {
                    question: 'When should you STILL care about object identity in React even with modern compiler optimizations?',
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
                id: 'react-14',
                title: 'Compound Components & Custom Hook Architecture',
                estMinutes: 5,
                concept: {
                    summary: 'Compound Components share implicit state between child components (e.g. <Tabs>, <Tabs.List>, <Tabs.Tab>, <Tabs.Panel>) without prop drilling. Custom hooks extract stateful logic into reusable functions, separating business logic from view rendering.',
                    analogy: 'A stereo system: the amplifier, volume dial, and speaker jacks work together as an intuitive unit without having to wire individual cables for every button press.',
                    seniorInsight: 'Avoid creating giant "God Components" with 30 boolean configuration props (hasIcon, isHeader, isDense, borderTop). Compose flexible UIs using compound children and custom hooks.'
                },
                trap: {
                    title: 'Prop drilling 8 layers deep vs cleanly composed compound components',
                    juniorCode: `// âŒ JUNIOR: Passing 12 props through 5 intermediate layout containers
<Modal isOpen={open} onClose={close} title="Edit" showSave isSaving={saving} onSave={save} />`,
                    seniorCode: `// âœ… SENIOR: Compound component pattern with flexible composition
<Modal open={open} onOpenChange={setOpen}>
    <Modal.Trigger>Open</Modal.Trigger>
    <Modal.Content>
        <Modal.Title>Edit Profile</Modal.Title>
        <Modal.Actions onSave={handleSave} />
    </Modal.Content>
</Modal>`,
                    explanation: 'Compound components allow consumers to rearrange layout, insert custom icons, and style sub-elements without modifying the underlying component code.'
                },
                drill: {
                    question: 'Write a useToggle(initialValue) custom hook in pure TypeScript that returns [value, toggle, setTrue, setFalse].',
                    hint: 'Return a tuple with stable callback functions.',
                    solution: `function useToggle(initialValue = false): [boolean, () => void, () => void, () => void] {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue(v => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    return [value, toggle, setTrue, setFalse];
}`,
                    explanation: 'Custom hooks package common UI primitives into clean, testable units with 100% type safety.'
                },
                docLink: {
                    title: 'React Learn: Reusing Logic with Custom Hooks',
                    url: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
                    description: 'Mastering custom hook conventions, composition, and state isolation.'
                }
            }
        ]
};
