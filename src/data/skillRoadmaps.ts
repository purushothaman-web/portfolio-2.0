export interface ExternalResource {
    title: string;
    url: string;
    description: string;
    badge?: string; // e.g. "Official Docs", "RFC", "Interactive Practice"
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
    category: 'CLIENT-SIDE' | 'SERVER-SIDE' | 'DATA STORAGE' | 'FOUNDATIONS' | 'ARCHITECTURE';
    tagline: string;
    accentColor: string;
    officialDocs: ExternalResource[];
    checkpoints: Checkpoint[];
}

export const SKILL_ROADMAPS: Record<string, SkillRoadmap> = {
    'javascript': {
        skillId: 'javascript',
        skillName: 'JavaScript (ESNext)',
        category: 'FOUNDATIONS',
        tagline: 'Execution contexts, event loop internals, reactivity with Proxies, V8 engine optimizations, and modern ESNext standards.',
        accentColor: '#eab308',
        officialDocs: [
            {
                title: 'MDN Web Docs: JavaScript Reference',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                description: 'The authoritative global standard for ECMAScript specifications, syntax, and Web APIs.',
                badge: 'Official Spec & Docs'
            },
            {
                title: 'JavaScript.info (The Modern JS Tutorial)',
                url: 'https://javascript.info/',
                description: 'Visual deep dives into JS engine internals, event loop phases, and closures by Ilya Kantor.',
                badge: 'Visual Masterclass'
            },
            {
                title: 'GreatFrontEnd JS Coding Drills',
                url: 'https://www.greatfrontend.com/questions/javascript',
                description: 'Interactive coding environment for polyfills, asynchronous puzzles, and design patterns.',
                badge: 'Interactive Practice'
            }
        ],
        checkpoints: [
            {
                id: 'js-1',
                title: 'Execution Context, Call Stack & Hoisting (var vs let/const & TDZ)',
                estMinutes: 5,
                concept: {
                    summary: 'Every time JavaScript executes, it runs inside an Execution Context created in two phases: Creation (memory allocation) and Execution. var variables are hoisted and initialized to undefined, while let and const are hoisted into the Temporal Dead Zone (TDZ) and throw ReferenceError if accessed before their declaration line.',
                    analogy: 'Checking into a hotel: with var, you get a blank room key before payment (it exists but is empty). With let and const, the door is secured in a lock corridor (TDZ) until your ID is validated at the front desk.',
                    seniorInsight: 'Senior developers never rely on variable hoisting. Treating the TDZ as a safety barrier prevents subtle initialization order bugs where code reads uninitialized state.'
                },
                trap: {
                    title: 'Accidental var closure leaking in asynchronous loops',
                    juniorCode: `// ❌ JUNIOR: var is function-scoped; all callbacks share the exact same variable i after loop finishes
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Outputs: 3, 3, 3`,
                    seniorCode: `// ✅ SENIOR: let creates a fresh lexical block binding for each loop iteration
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Outputs: 0, 1, 2`,
                    explanation: 'Because var lacks block scope, all 3 timeout callbacks point to the single outer binding of i after the loop completes. let re-binds i for each iteration, preserving the snapshot inside each closure.'
                },
                drill: {
                    question: 'What gets logged to the console when executing this snippet, and why?\n\nconsole.log(typeof nonExistent);\nconsole.log(typeof myLet);\nlet myLet = 42;',
                    hint: 'Consider how typeof behaves on undeclared variables vs variables currently trapped in the Temporal Dead Zone.',
                    solution: `// 1. console.log(typeof nonExistent) -> "undefined" (Safe check for undeclared variables)
// 2. console.log(typeof myLet)       -> Throws ReferenceError: Cannot access 'myLet' before initialization!

Explanation:
typeof on an undeclared variable safely returns "undefined". But attempting typeof on a variable declared with let/const inside its TDZ triggers a fatal ReferenceError by design!`,
                    explanation: 'The Temporal Dead Zone (TDZ) is strictly enforced by the ECMAScript spec: any access (even typeof) before the declaration statement executes throws a ReferenceError.'
                },
                docLink: {
                    title: 'MDN Reference: Temporal Dead Zone (TDZ)',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz',
                    description: 'Understanding variable declaration phases and lexical scoping rules.'
                }
            },
            {
                id: 'js-2',
                title: 'Data Types, Type Coercion (== vs ===) & Memory Storage (Stack vs Heap)',
                estMinutes: 5,
                concept: {
                    summary: 'JavaScript has 7 primitive types (string, number, boolean, null, undefined, symbol, bigint) stored on the call stack/registers by value, and reference types (Object, Array, Function) stored on the heap by memory address. Loose equality (==) performs implicit type coercion, producing notorious bugs like [] == ![] becoming true, while strict equality (===) compares both value and type without conversion.',
                    analogy: 'Strict equality (===) is a high-security biometric passport scanner: your photo, name, and nationality must match exactly. Loose equality (==) is a chaotic currency exchange counter that tries to convert your foreign transit pass into local currency before deciding if it matches.',
                    seniorInsight: 'Always use ===. Additionally, beware of historic quirks: typeof null === "object" is an unfixable 1995 engine bug, and NaN === NaN is always false (use Number.isNaN(x) to test for NaN).'
                },
                trap: {
                    title: 'Implicit coercion surprises with loose equality (==)',
                    juniorCode: `// ❌ JUNIOR: Relying on loose equality causing unexpected truthiness
console.log([] == 0);          // true (empty array coerced to "")
console.log('' == 0);          // true (empty string coerced to 0)
console.log('0' == 0);         // true
console.log([] == ![]);        // true (![] is false, [] == false -> 0 == 0 -> true!)`,
                    seniorCode: `// ✅ SENIOR: Always use strict equality === and explicit type casting
console.log([] === 0);         // false (Array !== Number)
console.log('' === 0);         // false
console.log(Number('0') === 0);// true (explicit and obvious intent)
console.log(Boolean([]));      // true (all objects/arrays are truthy in boolean context)`,
                    explanation: 'Loose equality follows a complex 12-step type coercion matrix in the ECMAScript spec. Strict equality (===) avoids coercion completely, making code predictable and optimizing JIT compilation.'
                },
                drill: {
                    question: 'Why does [1, 2] + [3, 4] evaluate to "1,23,4" instead of [1, 2, 3, 4] or an error in JavaScript?',
                    hint: 'Think about what the + operator does when applied to objects or arrays (Hint: ToPrimitive algorithm).',
                    solution: `Explanation:
1. The binary + operator only supports numbers (addition) and strings (concatenation).
2. When passed arrays, JavaScript runs the internal ToPrimitive algorithm.
3. Arrays call .toString(), producing "1,2" and "3,4".
4. The + operator sees two strings and concatenates them: "1,2" + "3,4" = "1,23,4"!

Correct way to merge arrays:
const merged = [...[1, 2], ...[3, 4]]; // [1, 2, 3, 4]`,
                    explanation: 'Array arithmetic in JavaScript invokes the ToPrimitive abstract operation, defaulting to Array.prototype.toString() which joins elements with commas.'
                },
                docLink: {
                    title: 'MDN Guide: Equality Comparisons and Sameness',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness',
                    description: 'In-depth breakdown of loose equality, strict equality, Object.is(), and coercion rules.'
                }
            },
            {
                id: 'js-3',
                title: 'Closures, Lexical Scope & Memory Leak Prevention',
                estMinutes: 5,
                concept: {
                    summary: 'A closure is a function bundled together with references to its surrounding lexical environment. Functions retain access to outer variables even after the outer function has completed execution and popped off the Call Stack.',
                    analogy: 'A backpack you pack before leaving home: even when you travel across town (new execution scope), you can unzip your backpack and use whatever items you packed earlier.',
                    seniorInsight: 'Closures prevent garbage collection of referenced variables. If a long-running interval, WebSocket callback, or DOM event listener captures large objects, those objects will linger in V8 heap memory forever.'
                },
                trap: {
                    title: 'Event listener closures trapping large objects in memory',
                    juniorCode: `// ❌ JUNIOR: Listener holds a closure over bigData indefinitely, causing a memory leak
function attachListener() {
    const bigData = new Array(1000000).fill('payload');
    window.addEventListener('scroll', () => {
        console.log('Scroll tick, data size:', bigData.length);
    });
}`,
                    seniorCode: `// ✅ SENIOR: Clean up event listeners with AbortController or removeEventListener
function attachListener() {
    const controller = new AbortController();
    const bigData = new Array(1000000).fill('payload');
    
    window.addEventListener('scroll', () => {
        console.log('Scroll tick, data size:', bigData.length);
    }, { signal: controller.signal });
    
    return () => controller.abort(); // Allows V8 to garbage collect bigData!
}`,
                    explanation: 'As long as the window event listener is active, its closure keeps bigData reachable in the V8 heap. Aborting or removing the listener frees the closure and enables garbage collection.'
                },
                drill: {
                    question: 'Write a createCounter function using a closure that maintains a private count and exposes increment(), decrement(), and getCount() methods without exposing the count variable directly.',
                    hint: 'Return an object containing methods that close over the private local variable.',
                    solution: `function createCounter(initialValue = 0) {
    let count = initialValue; // Private variable trapped inside the closure
    
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount()  { return count; }
    };
}

const counter = createCounter(10);
counter.increment(); // 11
console.log(counter.getCount()); // 11
console.log(counter.count); // undefined (completely private!)`,
                    explanation: 'The internal count variable cannot be modified or accessed from the outside, achieving true object encapsulation purely through JavaScript lexical scoping.'
                },
                docLink: {
                    title: 'MDN Guide: Closures in JavaScript',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
                    description: 'Deep dive into lexical scoping, practical closures, and memory considerations.'
                }
            },
            {
                id: 'js-4',
                title: 'Prototypes, Delegation Chain & The "this" Binding Rules',
                estMinutes: 5,
                concept: {
                    summary: 'JavaScript does not use classical inheritance; it uses Prototypal Delegation via internal [[Prototype]] links. When accessing a property, the V8 engine traverses up the prototype chain until it finds it or reaches Object.prototype (null). The "this" keyword is dynamically determined by HOW a function is invoked (default, implicit, explicit with call/apply/bind, or new), while arrow functions inherit "this" lexically from their enclosing scope.',
                    analogy: 'An apprentice asking a technical question: if they do not know the answer, they ask their supervisor ([[Prototype]]), who asks the chief engineer. Arrow functions act like an earpiece—they don’t have their own voice, they channel the person in the room with them.',
                    seniorInsight: 'Arrow functions do not possess their own "this", "arguments", or "prototype". They cannot be used as constructors (calling new Arrow() throws TypeError) and should not be used for object method declarations where dynamic context is required.'
                },
                trap: {
                    title: 'Losing "this" context when passing an object method as a callback',
                    juniorCode: `// ❌ JUNIOR: Passing object method as callback loses "this" binding
const timer = {
    seconds: 0,
    start() {
        setInterval(function() {
            this.seconds++; // In non-strict mode, "this" points to window/global; in strict mode, it throws TypeError!
        }, 1000);
    }
};`,
                    seniorCode: `// ✅ SENIOR: Arrow function preserves lexical "this" from the start() method scope
const timer = {
    seconds: 0,
    start() {
        setInterval(() => {
            this.seconds++; // "this" lexically resolves to the timer instance!
        }, 1000);
    }
};`,
                    explanation: 'Regular function callbacks default to the global object or undefined in strict mode. Arrow functions do not define their own this, capturing the lexical context of the enclosing start() method.'
                },
                drill: {
                    question: 'Given an object with a method, what happens when you extract the method to a standalone variable and call it? How can you fix it using Function.prototype.bind?',
                    hint: 'Think about implicit binding (obj.method()) vs default function invocation (fn()).',
                    solution: `const user = {
    name: 'Purushothaman',
    greet() { return \`Hello, \${this.name}\`; }
};

const unboundGreet = user.greet;
console.log(unboundGreet()); // "Hello, undefined" (lost implicit binding!)

// Fix: Bind the function permanently to the user instance
const boundGreet = user.greet.bind(user);
console.log(boundGreet()); // "Hello, Purushothaman"`,
                    explanation: 'When a method is called without a dot receiver, it falls back to default binding where "this" is undefined or window. .bind(thisArg) creates an exotic bound function with locked context.'
                },
                docLink: {
                    title: 'MDN Reference: The "this" Keyword in JavaScript',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this',
                    description: 'Comprehensive review of explicit binding, arrow functions, and class contexts.'
                }
            },
            {
                id: 'js-5',
                title: 'The Event Loop: Call Stack, Microtasks vs Macrotasks',
                estMinutes: 5,
                concept: {
                    summary: 'JavaScript is single-threaded. Synchronous code executes on the Call Stack. When asynchronous operations complete, Microtasks (Promise.then, queueMicrotask, MutationObserver) take absolute priority over Macrotasks (setTimeout, setInterval, setImmediate, I/O). The Microtask Queue must completely drain before the engine runs even one Macrotask or updates DOM rendering.',
                    analogy: 'An airport boarding gate: Macrotasks are general passengers waiting in line. Microtasks are VIP passengers. Every time a VIP arrives, they cut straight to the front—the regular line never moves until the VIP queue is completely empty.',
                    seniorInsight: 'Recursively queueing microtasks (e.g. chaining immediate Promise.resolve().then) starves the event loop, causing complete UI unresponsiveness because DOM rendering is deferred until microtasks drain.'
                },
                trap: {
                    title: 'Assuming setTimeout(fn, 0) executes before Promise.then()',
                    juniorCode: `// ❌ JUNIOR: Assuming setTimeout(0) runs first because it has delay 0ms
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('Sync');
// Junior expects: Sync -> Timeout -> Promise`,
                    seniorCode: `// ✅ SENIOR: Understanding that Microtasks always execute before Macrotasks
// Output is ALWAYS:
// 1. "Sync"    (Call stack executes first)
// 2. "Promise" (Microtask queue drains before any macrotasks)
// 3. "Timeout" (Macrotask queue executes next tick)`,
                    explanation: 'setTimeout registers a timer macrotask. Promises register a microtask. Even with a 0ms delay, the event loop prioritizes draining the entire microtask queue before picking the next macrotask.'
                },
                drill: {
                    question: 'What is the exact log order of this code snippet?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => {\n    console.log(3);\n    queueMicrotask(() => console.log(4));\n});\nconsole.log(5);',
                    hint: 'Follow the execution order: Synchronous -> Drain all Microtasks (including nested microtasks!) -> Next Macrotask.',
                    solution: `// Log output:
1
5
3
4
2

Explanation step-by-step:
1. "1" (Synchronous call stack)
2. setTimeout(..., 0) queues "2" into the Macrotask Queue.
3. Promise.resolve().then queues a microtask.
4. "5" (Synchronous call stack)
5. Call stack is empty! Draining Microtask Queue:
   - Logs "3"
   - queueMicrotask adds "4" to the CURRENT Microtask Queue.
   - Microtask queue still has "4", so it immediately logs "4".
6. Microtask Queue is now empty! Moving to Macrotask Queue:
   - Logs "2" from the setTimeout callback.`,
                    explanation: 'Nested microtasks queued during microtask execution run in the same tick before moving to the macrotask queue.'
                },
                docLink: {
                    title: 'JavaScript.info: Event Loop - Microtasks and Macrotasks',
                    url: 'https://javascript.info/event-loop',
                    description: 'Interactive diagrams illustrating task queues, rendering cycles, and execution order.'
                }
            },
            {
                id: 'js-6',
                title: 'Promises, Async/Await & Parallel Concurrency (Promise.all vs allSettled)',
                estMinutes: 5,
                concept: {
                    summary: 'Promises manage asynchronous states: pending, fulfilled, or rejected. async/await provides syntactic sugar over generators and promises. When fetching independent resources, Promise.all runs requests concurrently but fails fast (rejects immediately if 1 promise fails). Promise.allSettled guarantees all promises complete, returning a detailed array of results regardless of individual errors.',
                    analogy: 'A team project (Promise.all): if one member drops out, the entire project is marked failed. An individual exam hall (Promise.allSettled): every student gets their score recorded regardless of who passed or failed.',
                    seniorInsight: 'Never put "await" inside a standard loop when operations are independent. It creates a synchronous waterfall where each request waits for the previous one, multiplying latency by N.'
                },
                trap: {
                    title: 'Creating an asynchronous waterfall inside a loop',
                    juniorCode: `// ❌ JUNIOR: Sequential waterfall! 10 requests taking 300ms each = 3000ms total
const results = [];
for (const id of userIds) {
    const data = await fetchUser(id); // Blocks loop iteration until response returns!
    results.push(data);
}`,
                    seniorCode: `// ✅ SENIOR: Concurrent execution with Promise.allSettled runs all 10 requests in parallel (~300ms total)
const results = await Promise.allSettled(userIds.map(id => fetchUser(id)));
const successfulUsers = results
    .filter((r): r is PromiseFulfilledResult<User> => r.status === 'fulfilled')
    .map(r => r.value);`,
                    explanation: 'Sequential awaiting in loops serializes independent network requests. Promise.allSettled executes all requests concurrently and handles partial failures without crashing the entire batch.'
                },
                drill: {
                    question: 'Write a concurrency-limited batch runner function pLimit(tasks, limit) that runs an array of async task functions with a maximum of N tasks running concurrently.',
                    hint: 'Use a Set or loop with Promise.race to track currently active in-flight promises.',
                    solution: `async function pLimit(tasks, limit) {
    const results = [];
    const executing = new Set();
    
    for (const task of tasks) {
        const promise = Promise.resolve().then(() => task());
        results.push(promise);
        executing.add(promise);
        
        const clean = () => executing.delete(promise);
        promise.then(clean, clean);
        
        if (executing.size >= limit) {
            await Promise.race(executing); // Wait for ANY in-flight task to finish before starting next
        }
    }
    
    return Promise.all(results);
}`,
                    explanation: 'Promise.race awaits the fastest resolving in-flight promise in the executing set, freeing up a concurrency slot before dequeuing the next task.'
                },
                docLink: {
                    title: 'MDN Reference: Promise.allSettled()',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled',
                    description: 'Handling concurrent asynchronous operations with partial failure resilience.'
                }
            },
            {
                id: 'js-7',
                title: 'DOM Event Propagation: Bubbling, Capturing, Delegation & Passive Listeners',
                estMinutes: 5,
                concept: {
                    summary: 'Browser events travel through 3 phases: Capturing (down from window to target), Target, and Bubbling (up from target to window). Event Delegation leverages bubbling by attaching a single listener to a common ancestor instead of hundreds of listeners to child nodes. Adding { passive: true } guarantees the handler will not call e.preventDefault(), allowing browser scroll and touch pipelines to run without jank.',
                    analogy: 'An elevator in a skyscraper: goes down from the roof to your floor (Capturing), passengers board (Target), then ascends back up to the roof (Bubbling).',
                    seniorInsight: 'In high-frequency scroll or touch interactions, omitting { passive: true } forces the browser compositor thread to halt and wait for the JavaScript main thread before scrolling, causing perceptible dropped frames.'
                },
                trap: {
                    title: 'Attaching separate event listeners to 1,000 dynamically rendered list rows',
                    juniorCode: `// ❌ JUNIOR: 1,000 listeners consume significant memory and break when new items are added dynamically
document.querySelectorAll('.table-row').forEach(row => {
    row.addEventListener('click', (e) => handleSelect(row.dataset.id));
});`,
                    seniorCode: `// ✅ SENIOR: Event delegation with element.closest() on 1 single parent listener
const tableBody = document.querySelector('#table-body');
tableBody.addEventListener('click', (e) => {
    const row = (e.target as HTMLElement).closest('.table-row');
    if (!row || !tableBody.contains(row)) return;
    handleSelect(row.dataset.id);
});`,
                    explanation: 'Event delegation consumes memory for only 1 listener regardless of whether the table contains 10 or 100,000 rows, and automatically handles elements added to the DOM in the future.'
                },
                drill: {
                    question: 'What is the critical difference between e.stopPropagation() and e.stopImmediatePropagation()?',
                    hint: 'Consider whether there are multiple listeners attached to the exact same DOM node.',
                    solution: `Explanation:
1. e.stopPropagation() stops the event from traversing further up the ancestor tree (prevents bubbling to parent elements), but other listeners attached to the SAME element will still execute!
2. e.stopImmediatePropagation() halts everything: it prevents bubbling to parents AND prevents any other listeners registered on the CURRENT element from firing.`,
                    explanation: 'stopImmediatePropagation is essential when building security hooks or form validation interceptors where you must guarantee subsequent handlers on the same element never run.'
                },
                docLink: {
                    title: 'MDN Guide: Introduction to Events',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events',
                    description: 'Understanding event bubbling, capturing phases, and event delegation patterns.'
                }
            },
            {
                id: 'js-8',
                title: 'Debounce vs Throttle: Rate-Limiting User Input & Window Events',
                estMinutes: 5,
                concept: {
                    summary: 'Debounce and Throttle are rate-limiting techniques for controlling how frequently a function executes. Debounce delays execution until a set silence period has passed since the last invocation (ideal for search autocomplete inputs). Throttle guarantees execution at most once every N milliseconds (ideal for scroll listeners, window resizing, and mouse movement).',
                    analogy: 'Debounce is an elevator waiting for people to finish walking in: every time someone steps in, the door countdown resets. Throttle is a commuter train on a strict schedule: departs every 15 minutes regardless of how many people arrive.',
                    seniorInsight: 'Production debounce implementations must always expose a .cancel() method so components can clear pending timers on unmount (e.g. in React useEffect cleanup), preventing setState calls on unmounted components.'
                },
                trap: {
                    title: 'Firing expensive API searches on every raw keystroke',
                    juniorCode: `// ❌ JUNIOR: Fires an HTTP request on every single letter typed
input.addEventListener('input', async (e) => {
    const results = await api.search(e.target.value); // 10 keystrokes = 10 network requests!
});`,
                    seniorCode: `// ✅ SENIOR: Debounce waits until the user pauses typing for 300ms
function debounce(fn: Function, delay: number) {
    let timer: any;
    const debounced = (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}
input.addEventListener('input', debounce((e: any) => api.search(e.target.value), 300));`,
                    explanation: 'Debouncing cuts API traffic by 90%+, eliminates race conditions from out-of-order network responses, and keeps the browser UI fluid.'
                },
                drill: {
                    question: 'Write a basic throttle(fn, limit) function in pure JavaScript that ensures fn is called at most once every limit milliseconds.',
                    hint: 'Track whether the function is currently throttled with a boolean flag or timestamp.',
                    solution: `function throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage for scroll:
window.addEventListener('scroll', throttle(() => {
    console.log('Scroll measured at most once every 200ms');
}, 200));`,
                    explanation: 'Throttling locks execution using a cooldown timer, ensuring steady interval updates without clogging the JavaScript event loop.'
                },
                docLink: {
                    title: 'CSS-Tricks: Debouncing and Throttling Explained Through Examples',
                    url: 'https://css-tricks.com/debouncing-throttling-explained-through-examples/',
                    description: 'Visual comparison of debounce vs throttle with real-time graphical simulations.'
                }
            },
            {
                id: 'js-9',
                title: 'Deep Immutability, Memory References & native structuredClone()',
                estMinutes: 5,
                concept: {
                    summary: 'JavaScript primitive types are stored and copied by value. Objects and arrays are stored on the V8 heap and copied by reference. The spread operator (...) and Object.assign only create shallow copies: nested objects retain their original memory references. The native structuredClone() API performs true deep cloning, including cyclic graphs, Maps, Sets, and Dates.',
                    analogy: 'Photocopying the index page of a binder vs cloning every page, subfolder, and divider into an independent second binder.',
                    seniorInsight: 'Never use JSON.parse(JSON.stringify(obj)) to clone objects. It silently strips functions, undefined, Symbols, converts Date instances to ISO strings, converts RegExp to empty objects, and throws unhandled exceptions on circular references.'
                },
                trap: {
                    title: 'Shallow spread mutation corrupting shared nested state',
                    juniorCode: `// ❌ JUNIOR: Shallow spread creates a new outer object, but nested settings shares the same memory!
const original = { user: 'Admin', settings: { theme: 'dark', notifications: true } };
const clone = { ...original };
clone.settings.theme = 'light';

console.log(original.settings.theme); // "light" -> Original state mutated unexpectedly!`,
                    seniorCode: `// ✅ SENIOR: Native structuredClone creates a completely independent deep memory graph
const original = { user: 'Admin', settings: { theme: 'dark', notifications: true } };
const clone = structuredClone(original);
clone.settings.theme = 'light';

console.log(original.settings.theme); // "dark" -> 100% immutable and safe!`,
                    explanation: 'The spread operator only copies top-level properties. Nested objects maintain reference equality. structuredClone performs recursive deep replication supported natively in all modern browsers and Node 17+.'
                },
                drill: {
                    question: 'What types does structuredClone support that JSON.parse(JSON.stringify()) completely breaks or fails on?',
                    hint: 'Think about complex built-in structures like Date, Set, Map, and cyclic graphs.',
                    solution: `structuredClone natively supports:
1. Circular references: objects referencing themselves (JSON throws TypeError: cyclic object value).
2. Maps and Sets: cloned with full functionality (JSON converts them to {} and []).
3. Date objects: cloned as real Date instances (JSON converts them to flat strings).
4. RegExp, ArrayBuffer, TypedArrays, and Error objects.

Note: Neither method can clone functions or DOM nodes (throws DOMException for structuredClone).`,
                    explanation: 'structuredClone utilizes the HTML structured clone algorithm, preserving complex runtime data structures without serialization compromises.'
                },
                docLink: {
                    title: 'MDN Reference: structuredClone()',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/API/structuredClone',
                    description: 'Deep copying JavaScript values using the standard browser and Node.js structured clone algorithm.'
                }
            },
            {
                id: 'js-10',
                title: 'ES Modules (ESM) vs CommonJS (CJS) & Dynamic import() (Tree-Shaking)',
                estMinutes: 5,
                concept: {
                    summary: 'CommonJS (require, module.exports) is synchronous and evaluated at runtime. ES Modules (import, export) are asynchronous, statically analyzed before execution, and support live read-only bindings. Because ESM structures are determined at compile-time, modern bundlers (Vite, Rollup, esbuild) can safely tree-shake (eliminate unused exports). Dynamic import() returns a Promise, enabling route-level and component code splitting.',
                    analogy: 'CJS is ordering a meal item-by-item at your table (runtime dynamic loading). ESM is a pre-fixed catering contract analyzed before the banquet, allowing the chef to discard ingredients for dishes nobody ordered (tree-shaking).',
                    seniorInsight: 'Avoid the "dual-package hazard" in full-stack apps where both CJS and ESM versions of the same library are bundled simultaneously, resulting in duplicate memory state and broken instanceof checks.'
                },
                trap: {
                    title: 'Statically importing huge heavy libraries on initial page load',
                    juniorCode: `// ❌ JUNIOR: Statically importing a 5MB charting library forces all users to download it on initial page load
import { HeavyChartEngine } from 'heavy-chart-library';

export function Dashboard({ showCharts }) {
    if (!showCharts) return <div>Summary View</div>;
    return <HeavyChartEngine />;
}`,
                    seniorCode: `// ✅ SENIOR: Dynamic import() loads the chunk on demand only when needed
export function Dashboard({ showCharts }) {
    const [Chart, setChart] = useState(null);
    
    useEffect(() => {
        if (showCharts && !Chart) {
            import('heavy-chart-library').then(mod => setChart(() => mod.HeavyChartEngine));
        }
    }, [showCharts]);
    
    if (!showCharts || !Chart) return <div>Summary View</div>;
    return <Chart />;
}`,
                    explanation: 'Dynamic import() breaks your application bundle into separate asynchronous chunks, reducing initial JavaScript payload and dramatically improving Largest Contentful Paint (LCP).'
                },
                drill: {
                    question: 'How do "live bindings" in ES Modules differ from value copying in CommonJS?',
                    hint: 'Consider what happens when an exported counter variable is updated inside the module that defines it.',
                    solution: `Explanation:
1. In CommonJS: require() returns a copy of the exported value at the time of export. If the source module changes the variable later, the importer continues seeing the old copied value.
2. In ES Modules: import creates a live read-only pointer to the source variable. When the exporting module updates the variable, the importing module instantly reflects the new value!`,
                    explanation: 'ESM exports are live references into the module environment record, enabling circular dependency resolution and real-time state synchronization.'
                },
                docLink: {
                    title: 'MDN Guide: JavaScript Modules (ESM)',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
                    description: 'Comprehensive guide to static imports, exports, dynamic imports, and module scoping.'
                }
            },
            {
                id: 'js-11',
                title: 'Generators, Custom Iterators & Async Streaming (for await...of)',
                estMinutes: 5,
                concept: {
                    summary: 'The Iteration Protocol defines how any object can be looped over with for...of by implementing [Symbol.iterator](). Generator functions (function*) can pause execution with "yield" and resume when .next() is invoked, enabling lazy evaluation. Async Generators (async function*) combine this with promises, enabling memory-efficient streaming of pagination and real-time feeds using for await...of.',
                    analogy: 'A vending machine dispenser: instead of baking 10,000 cookies and filling up your whole kitchen (RAM), you bake exactly one cookie only when the user presses the button (lazy evaluation).',
                    seniorInsight: 'Generators excel at memory-constrained data processing. Instead of loading a 500MB CSV file into a giant array, a generator yields one row at a time, keeping memory footprint constant at O(1).'
                },
                trap: {
                    title: 'Loading 100,000 records into memory vs streaming with generators',
                    juniorCode: `// ❌ JUNIOR: Fetches and stores all 50 pages in an array at once, overloading client memory
async function getAllProducts() {
    let all = [];
    for (let page = 1; page <= 50; page++) {
        const data = await api.getProducts(page);
        all.push(...data.items);
    }
    return all; // Huge memory allocation
}`,
                    seniorCode: `// ✅ SENIOR: Async generator yields items on demand, streaming with constant O(1) memory
async function* streamProducts() {
    let page = 1;
    while (true) {
        const { items, hasMore } = await api.getProducts(page++);
        for (const item of items) yield item;
        if (!hasMore) break;
    }
}
// Usage: for await (const product of streamProducts()) { render(product); }`,
                    explanation: 'The async generator fetches subsequent pages only as the consumer loop demands them. If the user closes the page after 10 items, no further network requests or memory allocations occur.'
                },
                drill: {
                    question: 'Implement a custom range(start, end, step) generator function that lazily yields numbers without creating an intermediate array.',
                    hint: 'Use function* and the yield keyword inside a while loop.',
                    solution: `function* range(start, end, step = 1) {
    let current = start;
    while (current <= end) {
        yield current;
        current += step;
    }
}

// Consuming without array overhead:
for (const num of range(0, 10, 2)) {
    console.log(num); // 0, 2, 4, 6, 8, 10
}
// Array.from(range(1, 5)) -> [1, 2, 3, 4, 5]`,
                    explanation: 'The generator function produces numbers on-the-fly when .next() is called, consuming zero memory regardless of whether the range spans 10 numbers or 10,000,000.'
                },
                docLink: {
                    title: 'MDN Guide: Iterators and Generators',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators',
                    description: 'Practical guide to writing custom iterators, generator functions, and lazy evaluation sequences.'
                }
            },
            {
                id: 'js-12',
                title: 'Proxy & Reflect API: Metaprogramming & Reactivity Systems',
                estMinutes: 5,
                concept: {
                    summary: 'The Proxy object wraps a target object and intercepts fundamental low-level operations (traps like get, set, has, deleteProperty). Paired with the Reflect API—which mirrors default internal operations and returns clean booleans—Proxies are the core foundation behind modern JavaScript reactivity frameworks (Vue 3, Immer, MobX).',
                    analogy: 'A security guard stationed at the front desk of an office: instead of visitors walking straight to desks (direct property access), every request passes through the guard who logs the visit, verifies permissions, and notifies the team (triggers reactivity).',
                    seniorInsight: 'Always forward operations using Reflect within your traps (e.g. Reflect.set(target, prop, value, receiver)). In strict mode, failing to return a boolean true from a set trap throws a fatal TypeError.'
                },
                trap: {
                    title: 'Object.defineProperty limitations vs Proxy reactivity',
                    juniorCode: `// ❌ JUNIOR: Object.defineProperty requires knowing property keys in advance; cannot detect new keys or array pushes
const state = {};
Object.defineProperty(state, 'count', {
    set(val) { console.log('Updated count:', val); }
});
state.newKey = 'hello'; // Silent failure! Reactivity system never notices newKey was added!`,
                    seniorCode: `// ✅ SENIOR: Proxy transparently intercepts ALL property additions, deletions, and array mutations
function createReactiveState(target: any, onChange: Function) {
    return new Proxy(target, {
        set(obj, prop, value, receiver) {
            const success = Reflect.set(obj, prop, value, receiver);
            if (success) onChange(prop, value);
            return success;
        }
    });
}
const state = createReactiveState({}, (k: any, v: any) => console.log(\`Changed \${String(k)} to \${v}\`));
state.newKey = 'hello'; // "Changed newKey to hello" -> Dynamically detected!`,
                    explanation: 'Proxies operate at the object level, intercepting operations before they touch the target. Object.defineProperty operates at the property level, making it incapable of observing dynamically appended keys or array length changes.'
                },
                drill: {
                    question: 'Write a safe negative-index array proxy so that arr[-1] returns the last item, arr[-2] returns second-to-last, etc.',
                    hint: 'Intercept the get trap, convert the property string to a number, and offset from length if negative.',
                    solution: `function createNegativeArray(arr) {
    return new Proxy(arr, {
        get(target, prop, receiver) {
            const index = Number(prop);
            if (Number.isInteger(index) && index < 0) {
                prop = String(target.length + index);
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

const list = createNegativeArray(['alpha', 'beta', 'gamma']);
console.log(list[-1]); // "gamma"
console.log(list[-2]); // "beta"`,
                    explanation: 'The get trap converts negative numeric string keys into length-offset positive indexes, seamlessly extending array behavior without monkey-patching Array.prototype.'
                },
                docLink: {
                    title: 'MDN Reference: Proxy and Reflect',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy',
                    description: 'Complete specification of Proxy traps and Reflect forwarding methods.'
                }
            },
            {
                id: 'js-13',
                title: 'Modern ESNext Standards (Nullish Coalescing ??, Optional Chaining ?., WeakMap, Private Fields #)',
                estMinutes: 5,
                concept: {
                    summary: 'Modern ECMAScript introduces critical syntax to eliminate historic edge cases: Nullish Coalescing (??) falls back ONLY on null or undefined (preserving valid falsy values like 0, "", and false). Optional Chaining (?.) short-circuits safely on nullish values. Private class fields (#privateField) provide true engine-level hard privacy. WeakMap and WeakSet hold weak object references that allow automatic garbage collection.',
                    analogy: 'A smart security guard: the logical OR (||) ejects anyone who says nothing (treats 0 or "" as empty and rejects them). Nullish coalescing (??) only intervenes if the person is truly non-existent (null or undefined).',
                    seniorInsight: 'Using || for configuration defaults is a notorious bug factory when configuring numbers or booleans: e.g. "retries = config.retries || 3" causes 0 retries to be overwritten by 3! Always use "??" for defaults.'
                },
                trap: {
                    title: 'Logical OR (||) accidentally overriding valid 0 and false inputs',
                    juniorCode: `// ❌ JUNIOR: Using || for fallback defaults overrides valid 0 or false!
function setSessionTimeout(seconds) {
    // If user passes 0 (meaning no timeout), || treats 0 as falsy and resets to 60!
    const timeout = seconds || 60;
    return timeout;
}
console.log(setSessionTimeout(0)); // 60 -> BUG!`,
                    seniorCode: `// ✅ SENIOR: Nullish Coalescing (??) respects 0, false, and ""
function setSessionTimeout(seconds) {
    const timeout = seconds ?? 60; // Only defaults if seconds is null or undefined
    return timeout;
}
console.log(setSessionTimeout(0)); // 0 -> Correct!`,
                    explanation: 'The || operator checks for truthiness, treating 0, false, and "" as false. The ?? operator specifically checks for nullish values (null or undefined), allowing valid falsy values to pass through.'
                },
                drill: {
                    question: 'Why should you use a WeakMap instead of a regular Map when associating private metadata or event listeners with DOM elements?',
                    hint: 'Consider what happens when a DOM element is removed from the document.',
                    solution: `// In a regular Map:
const map = new Map();
let element = document.getElementById('btn');
map.set(element, { clicks: 10 });
// If element is removed from DOM: element.remove(); element = null;
// The Map still holds a strong reference in memory! The DOM element cannot be garbage collected (Memory Leak!)

// With WeakMap:
const weakMap = new WeakMap();
weakMap.set(element, { clicks: 10 });
// When element = null, the WeakMap does NOT prevent garbage collection.
// V8 automatically purges the entry from memory!`,
                    explanation: 'WeakMap keys must be objects and are held weakly. When no other references to the key object exist, the entry is automatically reclaimed by the garbage collector.'
                },
                docLink: {
                    title: 'MDN Reference: Nullish Coalescing Operator (??)',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing',
                    description: 'Understanding nullish evaluation vs truthiness in modern JavaScript.'
                }
            },
            {
                id: 'js-14',
                title: 'V8 Engine Internals: Hidden Classes, Inline Caches & Garbage Collection (Mark-and-Sweep)',
                estMinutes: 5,
                concept: {
                    summary: 'The Google V8 engine (Chrome, Node.js) compiles JavaScript to machine code via Ignition (interpreter) and TurboFan (optimizing JIT compiler). V8 assigns "Hidden Classes" (Shapes) to objects: objects with identical properties added in identical order share the same shape, allowing TurboFan to optimize property lookups into direct memory offsets using Inline Caches (IC). Memory is managed via Generational Garbage Collection: Young Generation (fast Scavenge algorithm for ephemeral objects) and Old Generation (Mark-Sweep-Compact for long-lived survivors).',
                    analogy: 'Airport automated baggage scanners: suitcases with standard dimensions (uniform Hidden Classes) zip through the express conveyor belt (Inline Cache). A suitcase with unusual protrusions or loose straps triggers alarms and gets diverted to manual inspection (JIT de-optimization).',
                    seniorInsight: 'Initializing object properties in different orders across functions creates distinct hidden classes, turning monomorphic call sites into megamorphic ones and causing a 5x to 10x performance penalty in high-throughput hot paths.'
                },
                trap: {
                    title: 'Using the "delete" operator in performance-critical code',
                    juniorCode: `// ❌ JUNIOR: Using delete alters the hidden class, demoting the object to slow dictionary/hash mode
function removeSensitiveData(user: any) {
    delete user.password; // Destroys V8 Hidden Class! De-optimizes TurboFan JIT!
    return user;
}`,
                    seniorCode: `// ✅ SENIOR: Set to undefined or construct a new clean object with predictable shape
function removeSensitiveData(user: any) {
    const { password, ...safeUser } = user; // Clean immutable extraction
    return safeUser;
}`,
                    explanation: 'The delete keyword alters an object structural shape, forcing V8 to throw away its optimized Hidden Class and fall back to slow hashtable lookups (dictionary mode).'
                },
                drill: {
                    question: 'How does initializing properties in different orders affect V8 Hidden Classes? Illustrate with point A = {x: 1, y: 2} and point B = {y: 2, x: 1}.',
                    hint: 'V8 builds a transition tree where each property addition points to the next hidden class.',
                    solution: `Explanation:
1. Object A initializes "x" first, transitioning to HiddenClass_1, then initializes "y", transitioning to HiddenClass_2.
2. Object B initializes "y" first, transitioning to HiddenClass_3, then initializes "x", transitioning to HiddenClass_4.
3. Even though A and B have identical keys and values, they have two completely different Hidden Classes!
4. Any function processing both A and B becomes polymorphic instead of monomorphic, slowing down TurboFan inline caching.

Best Practice:
Always initialize object properties in the exact same order (preferably inside a constructor or factory function).`,
                    explanation: 'V8 relies on property declaration order to compute static field offsets. Consistent ordering maintains monomorphic inline caching in TurboFan hot loops.'
                },
                docLink: {
                    title: 'V8 Dev Guide: Fast Properties in V8',
                    url: 'https://v8.dev/blog/fast-properties',
                    description: 'Deep dive into hidden classes, shape transitions, and inline cache mechanics by the V8 team.'
                }
            }
        ]
    },
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
                title: 'Overreacted.io by Dan Abramov',
                url: 'https://overreacted.io/',
                description: 'Deep dives on how React Fiber reconciliation and mental models work under the hood.',
                badge: 'Deep Architecture'
            },
            {
                title: 'Next.js App Router Documentation',
                url: 'https://nextjs.org/docs/app',
                description: 'Server components, streaming, layouts, and route handlers.',
                badge: 'Framework Standard'
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
                    seniorInsight: 'Senior engineers treat latency as an interface problem, not just a network problem. useOptimistic eliminates perceived latency without corrupting true server state.'
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
            }
        ]
    },
    'typescript': {
        skillId: 'typescript',
        skillName: 'TypeScript',
        category: 'FOUNDATIONS',
        tagline: 'Strict type safety, generic constraints, discriminated unions, and advanced type-level metaprogramming.',
        accentColor: '#3178c6',
        officialDocs: [
            {
                title: 'TypeScript Official Handbook',
                url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
                description: 'The complete reference for TypeScript language design and compiler options.',
                badge: 'Official Handbook'
            },
            {
                title: 'Total TypeScript by Matt Pocock',
                url: 'https://www.totaltypescript.com/tutorials',
                description: 'The gold standard for TypeScript mastery, generics, and type-level programming.',
                badge: 'Master Guide'
            },
            {
                title: 'Type Challenges Interactive Puzzles',
                url: 'https://github.com/type-challenges/type-challenges',
                description: 'Interactive type-level gymnastics and test-driven challenges.',
                badge: 'Interactive Drills'
            }
        ],
        checkpoints: [
            {
                id: 'ts-1',
                title: 'Primitive Types, Type Inference & Type Widening (as const)',
                estMinutes: 5,
                concept: {
                    summary: 'TypeScript infers types automatically from initial values. When declaring with let, TypeScript widens the type to its general primitive (e.g. "GET" widens to string). Declaring with const or adding an "as const" assertion locks the type into its exact immutable literal, preventing unintentional widening.',
                    analogy: 'Writing down an address: declaring with let is like writing "somewhere in downtown" (general string); const or as const is writing the exact GPS coordinates down to the millimeter.',
                    seniorInsight: 'Senior developers avoid redundant manual type annotations on variables when the compiler already infers them accurately (e.g. const count = 0 instead of const count: number = 0), keeping code clean while using "as const" for configuration objects.'
                },
                trap: {
                    title: 'Type widening breaking strict HTTP method or route contracts',
                    juniorCode: `// ❌ JUNIOR: let widens method to string, causing a compiler error when passed to strict fetch
let method = 'POST';
const req = { url: '/api/login', method }; // req.method is typed as string!

// Passing req into a function expecting 'GET' | 'POST' fails:
function send(options: { url: string; method: 'GET' | 'POST' }) {}
send(req); // ❌ Error: Argument of type 'string' is not assignable to 'GET' | 'POST'`,
                    seniorCode: `// ✅ SENIOR: Use "as const" to lock in literal types and readonly immutability
const req = {
    url: '/api/login',
    method: 'POST'
} as const;

function send(options: { url: string; method: 'GET' | 'POST' }) {}
send(req); // ✅ Passes seamlessly with 100% literal safety!`,
                    explanation: 'as const turns all properties into deeply readonly literal types, preventing TypeScript from widening string or number values into generic primitives.'
                },
                drill: {
                    question: 'What is the inferred type of config.routes in this snippet?\n\nconst config = {\n    port: 3000,\n    routes: [\'/home\', \'/dashboard\']\n} as const;',
                    hint: 'Think about array mutability and literal string preservation.',
                    solution: `// Inferred Type:
// config.routes: readonly ["/home", "/dashboard"]
// config.port: 3000 (literal number, not generic number)

Explanation:
Without "as const", config.routes would be inferred as string[] (mutable array of arbitrary strings). With "as const", it becomes a readonly tuple of exact string literals!`,
                    explanation: 'The const assertion locks arrays into fixed readonly tuples with exact literal types for every item.'
                },
                docLink: {
                    title: 'TypeScript Handbook: Literal Types & Const Assertions',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
                    description: 'Understanding type widening, literal types, and const assertions.'
                }
            },
            {
                id: 'ts-2',
                title: 'any vs unknown vs never vs void: The Type Hierarchy',
                estMinutes: 5,
                concept: {
                    summary: 'TypeScript has a strict type hierarchy: "any" is the escape hatch that disables the compiler completely; "unknown" is the type-safe top type that requires narrowing before any property access; "never" is the bottom type representing impossible states; and "void" represents the absence of a return value.',
                    analogy: 'any is a blank security pass allowing anyone to walk into any room without questions. unknown is a visitor who must show a badge and be escorted (type-narrowed) before entering any room. never is a room that does not exist.',
                    seniorInsight: 'Never type external untrusted data (like JSON.parse or fetch responses) as any. Always type it as unknown and validate it with a type guard or schema parser (Zod).'
                },
                trap: {
                    title: 'Using any for API responses causing silent runtime crashes',
                    juniorCode: `// ❌ JUNIOR: any disables type checking; a typo in property name crashes in production!
const data: any = await res.json();
console.log(data.usre.profile.name); // ❌ Compiles without error! Crashes at runtime with TypeError!`,
                    seniorCode: `// ✅ SENIOR: Type as unknown and narrow before property access
const data: unknown = await res.json();

function isUserPayload(val: unknown): val is { user: { profile: { name: string } } } {
    return typeof val === 'object' && val !== null && 'user' in val;
}

if (isUserPayload(data)) {
    console.log(data.user.profile.name); // ✅ 100% compile-time guaranteed safe!
}`,
                    explanation: 'any infects surrounding code by disabling compiler diagnostics. unknown forces developers to verify the runtime shape before accessing properties.'
                },
                drill: {
                    question: 'How is the "never" type used in function return signatures vs exhaustive switch checks?',
                    hint: 'Consider functions that throw errors or run infinite loops vs switch default statements.',
                    solution: `1. In function returns:
function throwError(msg: string): never {
    throw new Error(msg); // Never returns normally!
}

2. In exhaustive checks:
type Status = 'open' | 'closed';
function check(s: Status) {
    switch (s) {
        case 'open': return 1;
        case 'closed': return 2;
        default:
            const _exhaustive: never = s; // Compile error if a 3rd status is added!
            return _exhaustive;
    }
}`,
                    explanation: 'never represents a state that can never occur. If an unhandled case falls into a never assignment, TypeScript flags it immediately.'
                },
                docLink: {
                    title: 'TypeScript: The Top and Bottom Types',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#never',
                    description: 'Understanding unknown, never, void, and type hierarchy principles.'
                }
            },
            {
                id: 'ts-3',
                title: 'Interfaces vs Type Aliases & Declaration Merging',
                estMinutes: 5,
                concept: {
                    summary: 'Interfaces define the shape of objects and support "Declaration Merging" (multiple interfaces with the same name automatically combine, essential for library authoring). Type Aliases can name any type including unions, primitives, tuples, and mapped types, but cannot be reopened once declared.',
                    analogy: 'An interface is an open municipal zoning blueprint: different departments can append amendments to it. A type alias is an engraved marble tablet: once declared, its definition is immutable.',
                    seniorInsight: 'Use interfaces for public API definitions and object shapes where consumers might need to augment global window or express types. Use type aliases for unions, complex transformations, and utility types.'
                },
                trap: {
                    title: 'Trying to union or map properties directly inside an interface',
                    juniorCode: `// ❌ JUNIOR: Interfaces cannot define direct union aliases or mapped types
interface ID = string | number; // ❌ Syntax error!
interface StringMap {
    [K in 'a' | 'b']: string;   // ❌ Syntax error! Mapped types cannot be in interfaces!
}`,
                    seniorCode: `// ✅ SENIOR: Use type aliases for unions, tuples, and mapped types
type ID = string | number;

type StringMap = {
    [K in 'a' | 'b']: string;   // ✅ Clean, valid mapped type alias
};

// Use interface when defining extensible contracts:
interface UserBase {
    id: ID;
    name: string;
}`,
                    explanation: 'Type aliases are far more expressive for algebraic data types (unions, intersections, tuples, mapped types), while interfaces excel at object-oriented inheritance and augmentation.'
                },
                drill: {
                    question: 'How do you augment the global Window interface in TypeScript to add a custom analytics tracking object without compiler errors?',
                    hint: 'Leverage declaration merging inside a declare global block.',
                    solution: `declare global {
    interface Window {
        myAnalytics?: {
            trackEvent: (event: string, meta?: Record<string, unknown>) => void;
        };
    }
}

// Now you can call it safely with full autocompletion:
window.myAnalytics?.trackEvent('page_view');`,
                    explanation: 'Because interface supports declaration merging, declaring an interface Window with new properties merges them seamlessly into TypeScript standard browser library definitions.'
                },
                docLink: {
                    title: 'TypeScript Handbook: Interfaces vs Types',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces',
                    description: 'Direct comparison of syntax, capabilities, and merging rules between interfaces and types.'
                }
            },
            {
                id: 'ts-4',
                title: 'Structural Typing ("Duck Typing") & Excess Property Checks',
                estMinutes: 5,
                concept: {
                    summary: 'TypeScript uses a structural type system (if it walks like a duck and quacks like a duck, it is a duck). Compatibility is based on property shape rather than class name. However, TypeScript applies strict "Excess Property Checking" on inline object literals to catch typos where passing extra properties is almost certainly an error.',
                    analogy: 'A key fitting into a lock: the lock only cares about the physical notches on the key (shape), not whether the key has a red or blue plastic keychain attached (extra fields).',
                    seniorInsight: 'Excess property checks only trigger on freshly created inline object literals. Assigning the object to a temporary intermediate variable first bypasses this check due to structural subtyping.'
                },
                trap: {
                    title: 'Excess property error when passing inline object with subtle typo',
                    juniorCode: `// ❌ JUNIOR: Inline literal with typo triggers excess property check error
interface ServerConfig {
    host: string;
    port: number;
}
function start(config: ServerConfig) {}

start({
    host: 'localhost',
    port: 8080,
    protocl: 'https' // ❌ Error: Object literal may only specify known properties! Did you mean protocol?
});`,
                    seniorCode: `// ✅ SENIOR: Understanding how structural subtyping behaves vs inline checks
// If you intentionally need to allow extra metadata, add an index signature:
interface FlexibleServerConfig {
    host: string;
    port: number;
    [key: string]: unknown; // Explicitly allows arbitrary extra properties
}
function start(config: FlexibleServerConfig) {}
start({ host: 'localhost', port: 8080, protocol: 'https' }); // ✅ Clean!`,
                    explanation: 'Excess property checking exists specifically to protect developers from typos in options objects that would otherwise silently be ignored at runtime.'
                },
                drill: {
                    question: 'Why does this code compile without error even though extraProp is not declared in the Point interface?\n\ninterface Point { x: number; y: number; }\nconst obj = { x: 10, y: 20, extraProp: true };\nconst p: Point = obj;',
                    hint: 'Think about fresh object literals vs existing variable references in structural typing.',
                    solution: `Explanation:
1. obj is an existing variable reference, not a fresh inline object literal.
2. Under TypeScript structural typing, obj contains { x, y, extraProp }, which satisfies all required properties of Point ({ x, y }).
3. Excess property checks are only applied when passing fresh object literals directly (e.g. const p: Point = { x: 10, y: 20, extraProp: true }; would error!).`,
                    explanation: 'Structural subtyping allows broader objects to satisfy narrower types as long as all required properties are present.'
                },
                docLink: {
                    title: 'TypeScript: Excess Property Checks',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks',
                    description: 'How TypeScript balances duck typing with strict object literal inspection.'
                }
            },
            {
                id: 'ts-5',
                title: 'Type Narrowing & User-Defined Type Guards (val is Type)',
                estMinutes: 5,
                concept: {
                    summary: 'Type narrowing is the process of refining a broad type (like string | number | null) into a more specific type within a branch of code. TypeScript uses Control Flow Analysis with typeof, instanceof, and the "in" operator. For complex domain objects, User-Defined Type Guards using the "val is Type" return signature allow custom validation functions to inform the compiler.',
                    analogy: 'Water flowing through a series of filtration grates: each filter (if condition) removes broader debris, leaving pure, specific mineral water at the final tap.',
                    seniorInsight: 'Always use "val is Type" over boolean return types when writing validation helpers. A standard boolean function validates at runtime but leaves TypeScript completely blind, forcing ugly and dangerous manual type assertions ("as").'
                },
                trap: {
                    title: 'Returning boolean instead of type predicate in validation helpers',
                    juniorCode: `// ❌ JUNIOR: Helper returns boolean; TS does NOT narrow the type inside the if block!
function isValidAdmin(user: any): boolean {
    return user && user.role === 'admin' && typeof user.token === 'string';
}
if (isValidAdmin(account)) {
    console.log(account.token.toUpperCase()); // ❌ TS Error: property token does not exist on type!
}`,
                    seniorCode: `// ✅ SENIOR: Use a type predicate "user is AdminUser" to teach the compiler
interface AdminUser { role: 'admin'; token: string; }

function isValidAdmin(user: any): user is AdminUser {
    return user && user.role === 'admin' && typeof user.token === 'string';
}
if (isValidAdmin(account)) {
    console.log(account.token.toUpperCase()); // ✅ TS knows account is guaranteed AdminUser!
}`,
                    explanation: 'The return type "user is AdminUser" tells TypeScript control flow analysis that if this function returns true, the parameter can be safely narrowed to AdminUser in that scope.'
                },
                drill: {
                    question: 'Write a custom type guard isNonNullable<T>(val: T): val is NonNullable<T> that filters null and undefined out of an array with 100% type safety.',
                    hint: 'The function should check val !== null && val !== undefined.',
                    solution: `function isNonNullable<T>(val: T): val is NonNullable<T> {
    return val !== null && val !== undefined;
}

const mixed = ['hello', null, 'world', undefined, 42];
// Filtered array is strictly typed as (string | number)[] instead of (string | number | null | undefined)[]:
const clean = mixed.filter(isNonNullable);`,
                    explanation: 'Standard .filter(Boolean) often loses specific types. A custom isNonNullable type predicate cleanly narrows array types in one line.'
                },
                docLink: {
                    title: 'TypeScript: Using Type Predicates',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
                    description: 'Official documentation on writing user-defined type guards.'
                }
            },
            {
                id: 'ts-6',
                title: 'Discriminated Unions & Exhaustive Type Checks (never)',
                estMinutes: 5,
                concept: {
                    summary: 'A discriminated union uses a common literal property (like "status" or "kind") to narrow down polymorphic data models with 100% compile-time safety. By pairing a switch statement with an exhaustive "never" check in the default branch, adding a new state variant in the future instantly triggers a compile error until all consumers handle it.',
                    analogy: 'Color-coded emergency badges: a paramedic wearing red has access to medical supplies; an engineer wearing blue has access to servers. The badge color guarantees their permissions.',
                    seniorInsight: 'Senior developers model async states exclusively as discriminated unions. This prevents "impossible states" like { status: "success", data: undefined, error: "Something broke" } from ever existing in the codebase.'
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
    | { status: 'error'; error: string };

function render(res: ApiResponse) {
    switch (res.status) {
        case 'success': return res.data.name; // Guaranteed present!
        case 'error':   return res.error;
        case 'idle':    return 'Ready';
        case 'loading': return 'Fetching...';
        default: {
            const _exhaustiveCheck: never = res; // Compile error if new state added!
            return _exhaustiveCheck;
        }
    }
}`,
                    explanation: 'If someone adds a new status like "paused" to ApiResponse, TypeScript will throw a compile error at _exhaustiveCheck because "paused" cannot be assigned to type "never".'
                },
                drill: {
                    question: 'How does an exhaustive check with "const _unreachable: never = val" protect production apps when refactoring?',
                    hint: 'Imagine a team member adds a new state to a union 6 months from now.',
                    solution: `Explanation:
1. When you add a new variant to a union (e.g. | { status: 'cancelled' }), TypeScript re-evaluates the switch statement.
2. In the default branch, "res" is no longer reduced to "never" because 'cancelled' fell through unhandled.
3. The compiler throws: Type '{ status: "cancelled" }' is not assignable to type 'never'.
4. The build breaks at compile-time across all 20 UI files that forgot to handle the 'cancelled' state!`,
                    explanation: 'Exhaustiveness checking converts potential silent runtime bugs across multiple files into loud, self-documenting compile errors.'
                },
                docLink: {
                    title: 'TypeScript: Narrowing & Discriminated Unions',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions',
                    description: 'Official guide on narrowing types using discriminant properties.'
                }
            },
            {
                id: 'ts-7',
                title: 'Generics & Generic Constraints (<T extends ...>)',
                estMinutes: 5,
                concept: {
                    summary: 'Generics allow you to write reusable, type-safe functions, interfaces, and classes that work over a variety of types rather than a single one. Type constraints (<T extends Constraint>) enforce that the generic parameter must possess specific properties (like an ID or length) while preserving the exact input and return types.',
                    analogy: 'A universal USB-C charging dock: it accepts any device (generic T), but only if the device has a USB-C port (<T extends USB_Device>). The dock gives you back the exact same device charged, not a generic "electric object".',
                    seniorInsight: 'Avoid unnecessary generic type parameters. If a type parameter only appears once in a function signature, you probably do not need a generic—a plain type annotation is simpler and faster for the compiler.'
                },
                trap: {
                    title: 'Losing specific type information by returning broad interface types',
                    juniorCode: `// ❌ JUNIOR: Broad return type strips extra properties from the returned object!
interface Identifiable { id: string; }

function attachTimestamp(item: Identifiable): Identifiable {
    return { ...item, timestamp: Date.now() };
}
const user = attachTimestamp({ id: '123', name: 'Purushothaman', role: 'admin' });
console.log(user.name); // ❌ TS Error: Property 'name' does not exist on type 'Identifiable'!`,
                    seniorCode: `// ✅ SENIOR: Generic constraint preserves the exact input shape and all extra fields
interface Identifiable { id: string; }

function attachTimestamp<T extends Identifiable>(item: T): T & { timestamp: number } {
    return { ...item, timestamp: Date.now() };
}
const user = attachTimestamp({ id: '123', name: 'Purushothaman', role: 'admin' });
console.log(user.name); // ✅ TS knows name: string and role: 'admin' still exist!`,
                    explanation: 'Using <T extends Identifiable> guarantees that the input has an id, while returning T & { timestamp } preserves every original property on the caller side.'
                },
                drill: {
                    question: 'Write a type-safe getProperty<T, K extends keyof T>(obj: T, key: K): T[K] function that prevents accessing invalid keys on any object.',
                    hint: 'Use the keyof operator to constrain the second generic parameter to the keys of the first.',
                    solution: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: 'Purushothaman', age: 26, isDeveloper: true };

const name = getProperty(user, 'name'); // Typed as string
const age = getProperty(user, 'age');   // Typed as number
// getProperty(user, 'invalid');        // ❌ Compile error: Argument of type '"invalid"' is not assignable to '"name" | "age" | "isDeveloper"'!`,
                    explanation: 'K extends keyof T binds the second parameter strictly to the known keys of T, providing instant autocomplete and compile-time verification.'
                },
                docLink: {
                    title: 'TypeScript: Generics & Generic Constraints',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints',
                    description: 'Deep dive on generic functions, interfaces, and the extends constraint.'
                }
            },
            {
                id: 'ts-8',
                title: 'The satisfies Operator vs Type Annotations & Assertions (as)',
                estMinutes: 5,
                concept: {
                    summary: 'The `satisfies` operator validates that a value matches a type definition WITHOUT widening literal types or losing specific autocomplete inference. Type assertions (`as Type`) forcefully override the compiler, hiding bugs. Standard annotations (`const x: Type = ...`) widen literal properties, destroying exact member types.',
                    analogy: 'Showing your passport at an airport gate to prove you are an adult without having to surrender your passport or change your name on ticket records to "Generic Passenger".',
                    seniorInsight: 'Use `satisfies` whenever creating configuration dictionaries, route maps, or theme palettes. It gives you 100% schema validation while keeping exact string and function signatures intact.'
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
                id: 'ts-9',
                title: 'High-Yield Built-in Utility Types (Pick, Omit, Record, ReturnType, Awaited)',
                estMinutes: 5,
                concept: {
                    summary: 'TypeScript provides high-yield utility types to transform existing types without duplication: Pick<T, K> and Omit<T, K> cherry-pick or exclude fields; Partial<T> makes all fields optional (great for updates); Required<T> removes optionality; Record<K, V> constructs key-value dictionaries; ReturnType<T> extracts function output types; and Awaited<T> unwraps nested Promise resolutions.',
                    analogy: 'Custom cookie cutters: instead of baking a completely new batch of dough (writing duplicate types), you press Pick or Omit into the existing dough to cut out the exact shape you need.',
                    seniorInsight: 'Avoid manually duplicating database entity types for API payloads. Derive them with Pick (e.g. for user signup payloads) and Omit (e.g. to strip passwordHash from responses), ensuring schema changes propagate automatically.'
                },
                trap: {
                    title: 'Manually duplicating types across create, update, and read endpoints',
                    juniorCode: `// ❌ JUNIOR: 3 separate manual interfaces that drift out of sync when User changes
interface User { id: string; name: string; email: string; createdAt: Date; }
interface CreateUserInput { name: string; email: string; }
interface UpdateUserInput { name?: string; email?: string; }`,
                    seniorCode: `// ✅ SENIOR: Single source of truth transformed with utility types
interface User { id: string; name: string; email: string; createdAt: Date; }

type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
type UpdateUserInput = Partial<CreateUserInput>;`,
                    explanation: 'When the User schema adds new fields (like avatarUrl), CreateUserInput and UpdateUserInput automatically inherit the changes, preventing synchronization bugs.'
                },
                drill: {
                    question: 'How do you extract the resolved data type of an asynchronous API function using ReturnType and Awaited?',
                    hint: 'Combine Awaited<ReturnType<typeof myFunction>>.',
                    solution: `async function fetchUserProfile(id: string) {
    const res = await fetch(\`/api/users/\${id}\`);
    return (await res.json()) as { id: string; username: string; badges: string[] };
}

// Extract the resolved return type automatically:
type UserProfile = Awaited<ReturnType<typeof fetchUserProfile>>;

// UserProfile is { id: string; username: string; badges: string[] }!`,
                    explanation: 'ReturnType extracts Promise<{ ... }>, and Awaited recurses into the Promise to unwrap the underlying resolution type.'
                },
                docLink: {
                    title: 'TypeScript: Utility Types Reference',
                    url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
                    description: 'Complete guide to all built-in TypeScript utility types and their mechanical definitions.'
                }
            },
            {
                id: 'ts-10',
                title: 'Mapped Types, Index Signatures & Key Remapping (as)',
                estMinutes: 5,
                concept: {
                    summary: 'Mapped Types iterate over property keys to transform interfaces dynamically ([K in keyof T]). You can add or strip modifiers using +readonly, -readonly, +?, and -?. Key Remapping using the "as" clause allows you to transform key names (e.g. capitalizing keys to generate getter/setter methods) using Template Literal Types.',
                    analogy: 'An automated assembly line: every part that passes through the conveyor ([K in keyof T]) gets a coat of paint, a barcode label, or is stamped into a new shape.',
                    seniorInsight: 'Mapped types are how built-in utilities like Partial, Readonly, and Pick are implemented under the hood. Mastering them allows you to write domain-specific type transformations.'
                },
                trap: {
                    title: 'Using unconstrained string index signatures that swallow typos',
                    juniorCode: `// ❌ JUNIOR: Index signature allows ANY property name, silencing spelling mistakes!
interface UserRecord {
    [key: string]: string;
}
const user: UserRecord = { name: 'Admin', emial: 'admin@test.com' }; // Typo "emial" is silently accepted!`,
                    seniorCode: `// ✅ SENIOR: Mapped type or Record with strict union keys prevents typos
type AllowedFields = 'name' | 'email' | 'role';
type UserRecord = {
    [K in AllowedFields]: string;
};
// const user: UserRecord = { name: 'Admin', emial: 'test' }; // ❌ Error: 'emial' does not exist!`,
                    explanation: 'A generic [key: string] index signature tells TypeScript that any property name is valid, destroying autocomplete and typo prevention.'
                },
                drill: {
                    question: 'Write a mapped type Getters<T> that takes an interface and generates getter functions for every property with key remapping: e.g. { name: string } becomes { getName: () => string }.',
                    hint: 'Use [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]',
                    solution: `type Getters<T> = {
    [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// Result:
// {
//     getName: () => string;
//     getAge: () => number;
// }`,
                    explanation: 'Key remapping with as allows template literal string interpolation on object keys, dynamically generating type contracts for OOP accessors.'
                },
                docLink: {
                    title: 'TypeScript: Mapped Types & Key Remapping',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as',
                    description: 'Transforming property names, modifiers, and shapes with mapped types.'
                }
            },
            {
                id: 'ts-11',
                title: 'Conditional Types & the infer Keyword (T extends U ? X : Y)',
                estMinutes: 5,
                concept: {
                    summary: 'Conditional types enable type-level ternary logic: T extends U ? X : Y. When combined with the "infer" keyword, conditional types allow you to declare a type variable on-the-fly and extract internal components from complex types (like extracting the return type of a function or the element type of an array).',
                    analogy: 'A genetic DNA sequencer: it tests whether a sample has a certain sequence (T extends Promise<infer R>). If it matches, it extracts the hidden gene (R) and hands it to you.',
                    seniorInsight: 'When conditional types act on a generic parameter that is a union (naked type parameter), they automatically distribute over the union: (A | B) extends U ? X : Y becomes (A extends U ? X : Y) | (B extends U ? X : Y).'
                },
                trap: {
                    title: 'Trying to manually unwrap nested types without infer',
                    juniorCode: `// ❌ JUNIOR: Fragile manual type extraction that breaks on custom types
type ArrayItem<T> = T[0]; // ❌ Error or fragile index lookup!`,
                    seniorCode: `// ✅ SENIOR: Pattern match and extract cleanly using conditional types and infer
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type StringArray = Flatten<string[]>; // string
type PureNumber = Flatten<number>;     // number (falls back to T gracefully)`,
                    explanation: 'The infer keyword pattern-matches within the conditional check, letting TypeScript figure out what Item must be to satisfy the shape.'
                },
                drill: {
                    question: 'Write a custom utility type MyReturnType<T> using conditional types and infer that re-implements TypeScript built-in ReturnType<T>.',
                    hint: 'Match against a generic function signature: T extends (...args: any[]) => infer R ? R : any.',
                    solution: `type MyReturnType<T extends (...args: any[]) => any> = 
    T extends (...args: any[]) => infer R ? R : never;

function calculateArea(radius: number): number {
    return Math.PI * radius * radius;
}

type AreaResult = MyReturnType<typeof calculateArea>; // Inferred as number!`,
                    explanation: 'TypeScript inspects the function signature, captures the output type in the type variable R, and returns it.'
                },
                docLink: {
                    title: 'TypeScript: Conditional Types & Type Inference with infer',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types',
                    description: 'Advanced type-level programming using conditional types and the infer keyword.'
                }
            },
            {
                id: 'ts-12',
                title: 'Template Literal Types & Branded / Nominal Types',
                estMinutes: 5,
                concept: {
                    summary: 'Template Literal Types build on string literal types, allowing you to create complex string pattern validations at compile-time (e.g. CSS utilities or event names). Branded (Nominal) Types attach a unique compile-time tag (brand) to primitives, preventing catastrophic domain bugs like accidentally passing a PostId into a function expecting a UserId.',
                    analogy: 'Two identical-looking door keys: they are both physically brass keys (strings), but one is stamped "Master Server Room" and the other "Janitor Closet". A branded type ensures you never put the closet key into the server lock.',
                    seniorInsight: 'TypeScript is structural by default. Branded types give you nominal type safety when you need to distinguish between different types of IDs, USD vs EUR amounts, or sanitized HTML vs raw unsanitized user strings.'
                },
                trap: {
                    title: 'Accidentally swapping two string IDs in function calls',
                    juniorCode: `// ❌ JUNIOR: Both are typed as string; passing them in reverse order compiles silently!
function transferOwnership(userId: string, organizationId: string) {}

const userId = 'usr_123';
const orgId = 'org_456';
transferOwnership(orgId, userId); // ❌ Compiles without warning! Swapped parameters corrupt database!`,
                    seniorCode: `// ✅ SENIOR: Branded types guarantee compile-time parameter differentiation
declare const BrandSymbol: unique symbol;
type Brand<T, B> = T & { readonly [BrandSymbol]: B };

type UserId = Brand<string, 'UserId'>;
type OrgId = Brand<string, 'OrgId'>;

function transferOwnership(userId: UserId, orgId: OrgId) {}

const userId = 'usr_123' as UserId;
const orgId = 'org_456' as OrgId;

// transferOwnership(orgId, userId); 
// ❌ Compile Error: Type 'OrgId' is not assignable to type 'UserId'!`,
                    explanation: 'Attaching a unique symbol brand forces the structural type checker to treat UserId and OrgId as completely incompatible types, making parameter order mistakes impossible.'
                },
                drill: {
                    question: 'Create a template literal type EventName that generates all combinations of ("user" | "order") and ("created" | "updated" | "deleted") separated by a colon.',
                    hint: 'Syntax: `${Entity}:${Action}`',
                    solution: `type Entity = 'user' | 'order';
type Action = 'created' | 'updated' | 'deleted';

type EventName = \`\${Entity}:\${Action}\`;

// Inferred Union of 6 types:
// "user:created" | "user:updated" | "user:deleted" |
// "order:created" | "order:updated" | "order:deleted"

function emit(event: EventName) {}
emit('user:created'); // ✅ Valid!
// emit('user:unknown'); // ❌ Compile error!`,
                    explanation: 'Template literal types automatically cross-multiply union members, producing exhaustive string unions with zero repetitive typing.'
                },
                docLink: {
                    title: 'TypeScript: Template Literal Types',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html',
                    description: 'Pattern matching and string construction at compile time.'
                }
            }
        ]
    },
    'tailwind': {
        skillId: 'tailwind',
        skillName: 'Tailwind CSS v4 & Styling',
        category: 'CLIENT-SIDE',
        tagline: 'CSS-first @theme token configuration, container queries, and high-performance layout engines.',
        accentColor: '#38bdf8',
        officialDocs: [
            {
                title: 'Tailwind CSS v4 Official Documentation',
                url: 'https://tailwindcss.com/docs',
                description: 'The modern CSS-first documentation for utility classes, CSS functions, and theme tokens.',
                badge: 'Official Canonical Docs'
            },
            {
                title: 'Tailwind v4 CSS-First Architecture',
                url: 'https://tailwindcss.com/blog/tailwindcss-v4-alpha',
                description: 'How Tailwind v4 eliminated tailwind.config.js in favor of native CSS cascade layers and @theme.',
                badge: 'Architecture Guide'
            },
            {
                title: 'NerdCave Tailwind Cheat Sheet',
                url: 'https://nerdcave.com/tailwind-cheat-sheet',
                description: 'Fast interactive visual class lookup for layout, flexbox, grid, and typography.',
                badge: 'Quick Cheatsheet'
            }
        ],
        checkpoints: [
            {
                id: 'tw-1',
                title: 'CSS-First @theme Configuration vs Legacy JS Config',
                estMinutes: 5,
                concept: {
                    summary: 'Tailwind v4 replaces the legacy `tailwind.config.js` with pure CSS `@theme` directives directly inside your CSS file, compiling up to 10x faster via the Rust-based Oxide engine.',
                    analogy: 'Instead of having a translator convert your thoughts from English to French (JS config to CSS variables), you write directly in the native language (CSS variables inside CSS).',
                    seniorInsight: 'Senior developers define brand tokens using native CSS custom properties inside `@theme`. This enables dynamic runtime theming (dark mode, client white-labeling) without triggering JavaScript re-renders.'
                },
                trap: {
                    title: 'Creating redundant JavaScript config files in Tailwind v4',
                    juniorCode: `// ❌ JUNIOR: Creating legacy tailwind.config.js in a v4 project
module.exports = {
  theme: {
    extend: {
      colors: { brand: '#2563eb' }
    }
  }
};`,
                    seniorCode: `/* ✅ SENIOR: Native CSS-first @theme in main index.css */
@import "tailwindcss";

@theme {
  --color-brand: #2563eb;
  --font-display: "Outfit", sans-serif;
  --radius-card: 1rem;
}`,
                    explanation: 'Tailwind v4 reads tokens directly from CSS cascade layers. Keeping tokens in CSS makes them accessible to standard CSS functions like calc() and color-mix() automatically.'
                },
                drill: {
                    question: 'How do you define a custom brand color in Tailwind v4 so it can be used with opacity modifiers (e.g. bg-brand/20)?',
                    hint: 'Define --color-brand inside the @theme block.',
                    solution: `@theme {
  --color-brand: #2563eb;
}

/* Usage in JSX: */
<div className="bg-brand/20 text-brand border border-brand/40" />`,
                    explanation: 'Tailwind v4 automatically registers any variable prefixed with --color-* into its color palette, generating all opacity variants automatically.'
                },
                docLink: {
                    title: 'Tailwind v4: Theme Configuration',
                    url: 'https://tailwindcss.com/docs/theme',
                    description: 'Official guide to customizing colors, fonts, and spacing using @theme.'
                }
            },
            {
                id: 'tw-2',
                title: 'Container Queries (@container) vs Viewport Breakpoints',
                estMinutes: 5,
                concept: {
                    summary: 'Container queries style a component based on the width of its direct parent container rather than the global browser window (viewport).',
                    analogy: 'A modular couch that adjusts its shape depending on the size of the room it is placed in (container), rather than the total square footage of the entire building (viewport).',
                    seniorInsight: 'Senior engineers use `@container` on reusable components (like cards or widgets) so they look great whether placed in a narrow 300px sidebar or an 800px main content area.'
                },
                trap: {
                    title: 'Using viewport breakpoints (sm:, md:) inside reusable sidebar cards',
                    juniorCode: `// ❌ JUNIOR: Breakpoints trigger on screen size; breaks if card is in a small sidebar on desktop
<div className="flex flex-col md:flex-row gap-4">
  <img className="w-full md:w-32" />
  <div>Content</div>
</div>`,
                    seniorCode: `// ✅ SENIOR: Container queries adapt to the actual available slot
<div className="@container">
  <div className="flex flex-col @sm:flex-row gap-4">
    <img className="w-full @sm:w-32" />
    <div>Content</div>
  </div>
</div>`,
                    explanation: 'When placed in a narrow 300px sidebar on a wide desktop screen, the junior card triggers md:flex-row and overflows horribly. The @container version measures its own slot correctly.'
                },
                drill: {
                    question: 'What are the two steps required to use container queries in Tailwind?',
                    hint: 'Mark the parent element as a container, then use @ prefix on child breakpoints.',
                    solution: `// Step 1: Add '@container' class to the parent wrapper:
<div className="@container">

// Step 2: Use '@sm:', '@md:', or '@lg:' on children:
  <div className="grid grid-cols-1 @md:grid-cols-2" />
</div>`,
                    explanation: 'Declaring @container creates a CSS containment context, enabling child classes with @ breakpoints to query that container width.'
                },
                docLink: {
                    title: 'Tailwind CSS: Container Queries',
                    url: 'https://tailwindcss.com/docs/container-queries',
                    description: 'Complete guide to building responsive component-level containers.'
                }
            }
        ]
    },
    'framer-motion': {
        skillId: 'framer-motion',
        skillName: 'Framer Motion & Web Motion',
        category: 'CLIENT-SIDE',
        tagline: 'Spring physics, layout animations, GPU-accelerated transforms, and gesture-driven UI.',
        accentColor: '#a855f7',
        officialDocs: [
            {
                title: 'Motion.dev (Framer Motion) Official Docs',
                url: 'https://motion.dev/',
                description: 'The canonical documentation for motion components, layout animations, and springs.',
                badge: 'Official Documentation'
            },
            {
                title: 'Animations on the Web by Emil Kowalski',
                url: 'https://animations.dev/',
                description: 'The premier course and guide on timing curves, spring physics, and micro-interactions.',
                badge: 'Design Engineering'
            }
        ],
        checkpoints: [
            {
                id: 'fm-1',
                title: 'Layout Animations with layoutId',
                estMinutes: 5,
                concept: {
                    summary: '`layoutId` connects two completely separate component instances across re-renders, causing Framer Motion to smoothly morph and animate between them as if they were a single continuous element.',
                    analogy: 'Passing a baton in a relay race: the runner changes, but the baton travels in one continuous, uninterrupted motion.',
                    seniorInsight: 'Senior developers use `layoutId` for active navigation pills, tabs, and shared element modals. It eliminates jumpy cuts without requiring manual coordinate math.'
                },
                trap: {
                    title: 'Animating layout dimensions manually with width & height vs layoutId',
                    juniorCode: `// ❌ JUNIOR: Animating width/left causes costly browser layout reflows (laggy 30 FPS)
<div style={{ left: activeIndex * 80, width: 75 }} className="transition-all duration-300" />`,
                    seniorCode: `// ✅ SENIOR: layoutId calculates transforms automatically on GPU (60+ FPS)
{tabs.map((tab) => (
  <button key={tab.id} onClick={() => setSelected(tab.id)}>
    {tab.label}
    {selected === tab.id && (
      <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-blue-50 rounded-xl" />
    )}
  </button>
))}`,
                    explanation: 'layoutId uses the FLIP technique (First, Last, Invert, Play) to transform the element using GPU-accelerated CSS transforms rather than slow DOM geometry reflows.'
                },
                drill: {
                    question: 'What is the performance advantage of animating transform and opacity compared to top, left, width, and height?',
                    hint: 'Consider browser rendering pipeline: layout, paint, composite.',
                    solution: `Animating 'transform' (scale, translate, rotate) and 'opacity' only touches the Composite phase of the browser engine.
It does NOT trigger Layout recalculations or Paint repaints, allowing animations to run on the GPU at a buttery 60 to 120 FPS.`,
                    explanation: 'Properties like width, height, top, and left trigger full page reflows, causing jank on mobile devices. Transforms are handled entirely by the GPU compositor thread.'
                },
                docLink: {
                    title: 'Motion.dev: Shared Layout Animations',
                    url: 'https://motion.dev/docs/layout-animations',
                    description: 'Mastering layoutId and shared element transitions.'
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
            },
            {
                title: 'OWASP API Security Top 10',
                url: 'https://owasp.org/www-project-api-security/',
                description: 'The essential security standards for REST endpoints and token protection.',
                badge: 'Security Standard'
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
                    seniorInsight: 'Senior developers know that a runaway loop of process.nextTick or recursive Promises will starve the event loop and freeze I/O entirely.'
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
                    seniorInsight: 'Senior engineers use pipeline() from node:stream/promises instead of raw .pipe() to ensure proper error cleanup and automatic backpressure regulation.'
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
                    seniorInsight: 'Senior developers detect N+1 queries using ORM logging and fix them using SQL JOINs, subqueries, or dataloader batching (WHERE id IN (...)).'
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
    },
    'prisma': {
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
                    juniorCode: `// ❌ JUNIOR: Using db push in production can silently drop columns and data!
npx prisma db push --accept-data-loss`,
                    seniorCode: `// ✅ SENIOR: CI/CD runs reviewed declarative migrations strictly
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
    },
    'mongodb': {
        skillId: 'mongodb',
        skillName: 'MongoDB & Document Modeling',
        category: 'DATA STORAGE',
        tagline: 'Flexible document modeling, aggregation pipelines, compound indexing, and distributed clusters.',
        accentColor: '#15803d',
        officialDocs: [
            {
                title: 'MongoDB Official Documentation',
                url: 'https://www.mongodb.com/docs/',
                description: 'The authoritative reference for queries, indexes, and aggregation pipelines.',
                badge: 'Official Manual'
            },
            {
                title: 'MongoDB University Free Courses',
                url: 'https://learn.mongodb.com/',
                description: 'Free interactive labs and certification tracks on document modeling.',
                badge: 'Interactive Labs'
            }
        ],
        checkpoints: [
            {
                id: 'mongo-1',
                title: 'Embedding vs Referencing (1-to-N vs 1-to-Squillion)',
                estMinutes: 5,
                concept: {
                    summary: 'In MongoDB, embed child documents when the relationship has a bounded size (e.g. 1 user with 2 addresses). Reference with ObjectIds when the relationship is unbounded (e.g. 1 post with 1,000,000 logs).',
                    analogy: 'Keep your driver license in your wallet (embedded, bounded). Keep your car in a parking garage with a parking ticket number (referenced, unbounded).',
                    seniorInsight: 'MongoDB documents have a strict 16MB limit. Embedding an unbounded array will eventually corrupt the document or hit the 16MB ceiling.'
                },
                trap: {
                    title: 'Embedding unbounded arrays inside a parent document',
                    juniorCode: `// ❌ JUNIOR: Embedding infinite logs inside a single user document
const userSchema = new Schema({
    name: String,
    activityLogs: [{ action: String, timestamp: Date }] // Crashes when logs exceed 16MB!
});`,
                    seniorCode: `// ✅ SENIOR: Separate collection with parent reference and compound index
const logSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: String,
    timestamp: { type: Date, index: true }
});`,
                    explanation: 'Storing unbounded data inside a parent array degrades write performance (document re-allocation) and will eventually breach MongoDB 16MB BSON limit.'
                },
                drill: {
                    question: 'If an e-commerce order has 3 shipping updates, should the updates be embedded in the Order document or stored in a separate collection?',
                    hint: 'Consider whether an order can ever have 100,000 shipping updates.',
                    solution: `They should be EMBEDDED inside the Order document!
Explanation: An order typically has fewer than 10 tracking updates. Embedding allows fetching the complete order and tracking status in 1 single, atomic read operation.`,
                    explanation: 'Embedding bounded arrays (1-to-few) optimizes read latency and maintains atomicity without needing costly $lookup joins.'
                },
                docLink: {
                    title: 'MongoDB: Data Model Design',
                    url: 'https://www.mongodb.com/docs/manual/core/data-model-design/',
                    description: 'Official principles of document modeling and relationship strategies.'
                }
            }
        ]
    },
    'git': {
        skillId: 'git',
        skillName: 'Git & GitHub Workflows',
        category: 'FOUNDATIONS',
        tagline: 'Branching strategies, interactive rebasing, clean commit history, and conflict resolution.',
        accentColor: '#f97316',
        officialDocs: [
            {
                title: 'Pro Git Official Book (Free by Scott Chacon)',
                url: 'https://git-scm.com/book/en/v2',
                description: 'The canonical complete book on Git internals, branching, and team collaboration.',
                badge: 'Official Book'
            },
            {
                title: 'Learn Git Branching (Interactive Sandbox)',
                url: 'https://learngitbranching.js.org/',
                description: 'Interactive visual simulator for practicing rebasing, cherry-picking, and merges.',
                badge: 'Interactive Sandbox'
            }
        ],
        checkpoints: [
            {
                id: 'git-1',
                title: 'Interactive Rebase (git rebase -i) vs Messy Commit History',
                estMinutes: 5,
                concept: {
                    summary: 'Interactive rebasing allows you to squash noisy WIP commits ("fix typo", "test 2", "wip") into clean, descriptive atomic commits before opening a pull request.',
                    analogy: 'Editing your rough draft notes into polished book chapters before publishing the book for others to read.',
                    seniorInsight: 'Senior developers keep git history clean with interactive rebasing so that commands like `git bisect` (binary search to find bug-introducing commits) work effortlessly.'
                },
                trap: {
                    title: 'Merging 15 micro-commits with messages like "fix", "asdf" directly into main',
                    juniorCode: `// ❌ JUNIOR GIT LOG:
commit 9a: fix
commit 8b: test
commit 7c: oops another fix
commit 6d: wip`,
                    seniorCode: `// ✅ SENIOR: Squash into a single semantic commit before merging
git rebase -i HEAD~4
// Result: 1 clean commit: "feat(auth): implement JWT refresh token rotation with redis"`,
                    explanation: 'Polluting git history with trivial micro-commits makes code reviews painful and destroys the ability to revert individual features cleanly.'
                },
                drill: {
                    question: 'What command allows you to selectively take a specific commit from another branch and apply it to your current branch?',
                    hint: 'Named after picking fruit.',
                    solution: `git cherry-pick <commit-hash>`,
                    explanation: 'Cherry-picking applies the exact diff of a specific commit onto your active branch without having to merge the entire branch.'
                },
                docLink: {
                    title: 'Git Documentation: Rewriting History',
                    url: 'https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History',
                    description: 'Mastering interactive rebasing, squashing, and amending commits.'
                }
            }
        ]
    },
    'system-design': {
        skillId: 'system-design',
        skillName: 'System Architecture & Design',
        category: 'ARCHITECTURE',
        tagline: 'High availability, caching topologies, rate limiters, circuit breakers, and distributed queues.',
        accentColor: '#6366f1',
        officialDocs: [
            {
                title: 'Roadmap.sh Full-Stack & System Design',
                url: 'https://roadmap.sh/full-stack',
                description: 'The global community roadmap for scalable backend and frontend architecture.',
                badge: 'Interactive Roadmap'
            },
            {
                title: 'System Design Primer (GitHub)',
                url: 'https://github.com/donnemartin/system-design-primer',
                description: 'The premier open-source repository for learning how to design large-scale distributed systems.',
                badge: 'Open-Source Playbook'
            },
            {
                title: 'ByteByteGo Architecture Breakdowns',
                url: 'https://bytebytego.com/',
                description: 'Visual system design breakdowns by Alex Xu (author of System Design Interview).',
                badge: 'Visual Deep Dives'
            }
        ],
        checkpoints: [
            {
                id: 'sys-1',
                title: 'Cache-Aside Pattern & Cache Stampede Prevention',
                estMinutes: 5,
                concept: {
                    summary: 'In Cache-Aside, the app checks the in-memory cache (Redis) first. On a cache miss, it reads from the database, writes the result into cache, and returns it. To prevent a "stampede" when a key expires, distributed locks or probabilistic early expiration are used.',
                    analogy: 'Keeping the most frequent customer menus on a quick-grab counter (Redis). If a special menu is requested, the waiter walks to the filing room (DB) to fetch it and leaves a copy on the counter.',
                    seniorInsight: 'Senior architects set randomized TTL jitter (e.g. 5 minutes ± 30 seconds) on cache keys so that 10,000 keys don\'t expire at the exact same second and overload the database.'
                },
                trap: {
                    title: 'Setting identical expiration times on bulk-cached items',
                    juniorCode: `// ❌ JUNIOR: 10,000 products expire at exact same second -> DB crashes from simultaneous queries
await redis.set(key, JSON.stringify(data), 'EX', 3600);`,
                    seniorCode: `// ✅ SENIOR: Adding random TTL jitter to spread database read spikes
const baseTTL = 3600;
const jitter = Math.floor(Math.random() * 300); // ± 5 min jitter
await redis.set(key, JSON.stringify(data), 'EX', baseTTL + jitter);`,
                    explanation: 'When cached keys expire simultaneously under heavy traffic, thousands of concurrent requests bypass the cache and hit the database at once (Cache Stampede).'
                },
                drill: {
                    question: 'What is the difference between Write-Through and Write-Back (Write-Behind) caching?',
                    hint: 'Consider whether the cache or the database is updated first during a write.',
                    solution: `Write-Through: Writes data to both the cache and the database synchronously at the same time before acknowledging success.
Write-Back: Writes data to the cache immediately (fast response) and asynchronously batches writes to the database in the background.`,
                    explanation: 'Write-Through guarantees strong consistency. Write-Back provides maximum write throughput at the cost of potential data loss if the cache server crashes before flushing.'
                },
                docLink: {
                    title: 'System Design Primer: Caching Architectures',
                    url: 'https://github.com/donnemartin/system-design-primer#cache',
                    description: 'Comprehensive guide on caching patterns, eviction policies, and cache invalidation.'
                }
            }
        ]
    }
};
