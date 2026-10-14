import { SkillRoadmap } from './types';
export const javascriptRoadmap: SkillRoadmap = {
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
                badge: 'Interactive Course'
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
                    juniorCode: `// âŒ JUNIOR: var is function-scoped; all callbacks share the exact same variable i after loop finishes
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Outputs: 3, 3, 3`,
                    seniorCode: `// âœ… SENIOR: let creates a fresh lexical block binding for each loop iteration
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
                    juniorCode: `// âŒ JUNIOR: Relying on loose equality causing unexpected truthiness
console.log([] == 0);          // true (empty array coerced to "")
console.log('' == 0);          // true (empty string coerced to 0)
console.log('0' == 0);         // true
console.log([] == ![]);        // true (![] is false, [] == false -> 0 == 0 -> true!)`,
                    seniorCode: `// âœ… SENIOR: Always use strict equality === and explicit type casting
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
                    juniorCode: `// âŒ JUNIOR: Listener holds a closure over bigData indefinitely, causing a memory leak
function attachListener() {
    const bigData = new Array(1000000).fill('payload');
    window.addEventListener('scroll', () => {
        console.log('Scroll tick, data size:', bigData.length);
    });
}`,
                    seniorCode: `// âœ… SENIOR: Clean up event listeners with AbortController or removeEventListener
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
                    analogy: 'An apprentice asking a technical question: if they do not know the answer, they ask their supervisor ([[Prototype]]), who asks the chief engineer. Arrow functions act like an earpieceâ€”they donâ€™t have their own voice, they channel the person in the room with them.',
                    seniorInsight: 'Arrow functions do not possess their own "this", "arguments", or "prototype". They cannot be used as constructors (calling new Arrow() throws TypeError) and should not be used for object method declarations where dynamic context is required.'
                },
                trap: {
                    title: 'Losing "this" context when passing an object method as a callback',
                    juniorCode: `// âŒ JUNIOR: Passing object method as callback loses "this" binding
const timer = {
    seconds: 0,
    start() {
        setInterval(function() {
            this.seconds++; // In non-strict mode, "this" points to window/global; in strict mode, it throws TypeError!
        }, 1000);
    }
};`,
                    seniorCode: `// âœ… SENIOR: Arrow function preserves lexical "this" from the start() method scope
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
                    analogy: 'An airport boarding gate: Macrotasks are general passengers waiting in line. Microtasks are VIP passengers. Every time a VIP arrives, they cut straight to the frontâ€”the regular line never moves until the VIP queue is completely empty.',
                    seniorInsight: 'Recursively queueing microtasks (e.g. chaining immediate Promise.resolve().then) starves the event loop, causing complete UI unresponsiveness because DOM rendering is deferred until microtasks drain.'
                },
                trap: {
                    title: 'Assuming setTimeout(fn, 0) executes before Promise.then()',
                    juniorCode: `// âŒ JUNIOR: Assuming setTimeout(0) runs first because it has delay 0ms
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('Sync');
// Junior expects: Sync -> Timeout -> Promise`,
                    seniorCode: `// âœ… SENIOR: Understanding that Microtasks always execute before Macrotasks
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
                    juniorCode: `// âŒ JUNIOR: Sequential waterfall! 10 requests taking 300ms each = 3000ms total
const results = [];
for (const id of userIds) {
    const data = await fetchUser(id); // Blocks loop iteration until response returns!
    results.push(data);
}`,
                    seniorCode: `// âœ… SENIOR: Concurrent execution with Promise.allSettled runs all 10 requests in parallel (~300ms total)
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
                    juniorCode: `// âŒ JUNIOR: 1,000 listeners consume significant memory and break when new items are added dynamically
document.querySelectorAll('.table-row').forEach(row => {
    row.addEventListener('click', (e) => handleSelect(row.dataset.id));
});`,
                    seniorCode: `// âœ… SENIOR: Event delegation with element.closest() on 1 single parent listener
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
                    juniorCode: `// âŒ JUNIOR: Fires an HTTP request on every single letter typed
input.addEventListener('input', async (e) => {
    const results = await api.search(e.target.value); // 10 keystrokes = 10 network requests!
});`,
                    seniorCode: `// âœ… SENIOR: Debounce waits until the user pauses typing for 300ms
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
                    juniorCode: `// âŒ JUNIOR: Shallow spread creates a new outer object, but nested settings shares the same memory!
const original = { user: 'Admin', settings: { theme: 'dark', notifications: true } };
const clone = { ...original };
clone.settings.theme = 'light';

console.log(original.settings.theme); // "light" -> Original state mutated unexpectedly!`,
                    seniorCode: `// âœ… SENIOR: Native structuredClone creates a completely independent deep memory graph
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
                    juniorCode: `// âŒ JUNIOR: Statically importing a 5MB charting library forces all users to download it on initial page load
import { HeavyChartEngine } from 'heavy-chart-library';

export function Dashboard({ showCharts }) {
    if (!showCharts) return <div>Summary View</div>;
    return <HeavyChartEngine />;
}`,
                    seniorCode: `// âœ… SENIOR: Dynamic import() loads the chunk on demand only when needed
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
                    juniorCode: `// âŒ JUNIOR: Fetches and stores all 50 pages in an array at once, overloading client memory
async function getAllProducts() {
    let all = [];
    for (let page = 1; page <= 50; page++) {
        const data = await api.getProducts(page);
        all.push(...data.items);
    }
    return all; // Huge memory allocation
}`,
                    seniorCode: `// âœ… SENIOR: Async generator yields items on demand, streaming with constant O(1) memory
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
                    summary: 'The Proxy object wraps a target object and intercepts fundamental low-level operations (traps like get, set, has, deleteProperty). Paired with the Reflect APIâ€”which mirrors default internal operations and returns clean booleansâ€”Proxies are the core foundation behind modern JavaScript reactivity frameworks (Vue 3, Immer, MobX).',
                    analogy: 'A security guard stationed at the front desk of an office: instead of visitors walking straight to desks (direct property access), every request passes through the guard who logs the visit, verifies permissions, and notifies the team (triggers reactivity).',
                    seniorInsight: 'Always forward operations using Reflect within your traps (e.g. Reflect.set(target, prop, value, receiver)). In strict mode, failing to return a boolean true from a set trap throws a fatal TypeError.'
                },
                trap: {
                    title: 'Object.defineProperty limitations vs Proxy reactivity',
                    juniorCode: `// âŒ JUNIOR: Object.defineProperty requires knowing property keys in advance; cannot detect new keys or array pushes
const state = {};
Object.defineProperty(state, 'count', {
    set(val) { console.log('Updated count:', val); }
});
state.newKey = 'hello'; // Silent failure! Reactivity system never notices newKey was added!`,
                    seniorCode: `// âœ… SENIOR: Proxy transparently intercepts ALL property additions, deletions, and array mutations
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
                    juniorCode: `// âŒ JUNIOR: Using || for fallback defaults overrides valid 0 or false!
function setSessionTimeout(seconds) {
    // If user passes 0 (meaning no timeout), || treats 0 as falsy and resets to 60!
    const timeout = seconds || 60;
    return timeout;
}
console.log(setSessionTimeout(0)); // 60 -> BUG!`,
                    seniorCode: `// âœ… SENIOR: Nullish Coalescing (??) respects 0, false, and ""
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
                    juniorCode: `// âŒ JUNIOR: Using delete alters the hidden class, demoting the object to slow dictionary/hash mode
function removeSensitiveData(user: any) {
    delete user.password; // Destroys V8 Hidden Class! De-optimizes TurboFan JIT!
    return user;
}`,
                    seniorCode: `// âœ… SENIOR: Set to undefined or construct a new clean object with predictable shape
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
};
