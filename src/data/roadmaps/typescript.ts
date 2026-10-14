import { SkillRoadmap } from './types';
export const typescriptRoadmap: SkillRoadmap = {
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
                title: 'Total TypeScript Interactive Tutorials',
                url: 'https://www.totaltypescript.com/tutorials',
                description: 'The premier interactive tutorial series for TypeScript mastery, generics, and type-level programming.',
                badge: 'Interactive Course'
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
                    juniorCode: `// âŒ JUNIOR: let widens method to string, causing a compiler error when passed to strict fetch
let method = 'POST';
const req = { url: '/api/login', method }; // req.method is typed as string!

// Passing req into a function expecting 'GET' | 'POST' fails:
function send(options: { url: string; method: 'GET' | 'POST' }) {}
send(req); // âŒ Error: Argument of type 'string' is not assignable to 'GET' | 'POST'`,
                    seniorCode: `// âœ… SENIOR: Use "as const" to lock in literal types and readonly immutability
const req = {
    url: '/api/login',
    method: 'POST'
} as const;

function send(options: { url: string; method: 'GET' | 'POST' }) {}
send(req); // âœ… Passes seamlessly with 100% literal safety!`,
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
                    juniorCode: `// âŒ JUNIOR: any disables type checking; a typo in property name crashes in production!
const data: any = await res.json();
console.log(data.usre.profile.name); // âŒ Compiles without error! Crashes at runtime with TypeError!`,
                    seniorCode: `// âœ… SENIOR: Type as unknown and narrow before property access
const data: unknown = await res.json();

function isUserPayload(val: unknown): val is { user: { profile: { name: string } } } {
    return typeof val === 'object' && val !== null && 'user' in val;
}

if (isUserPayload(data)) {
    console.log(data.user.profile.name); // âœ… 100% compile-time guaranteed safe!
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
                    juniorCode: `// âŒ JUNIOR: Interfaces cannot define direct union aliases or mapped types
interface ID = string | number; // âŒ Syntax error!
interface StringMap {
    [K in 'a' | 'b']: string;   // âŒ Syntax error! Mapped types cannot be in interfaces!
}`,
                    seniorCode: `// âœ… SENIOR: Use type aliases for unions, tuples, and mapped types
type ID = string | number;

type StringMap = {
    [K in 'a' | 'b']: string;   // âœ… Clean, valid mapped type alias
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
                    juniorCode: `// âŒ JUNIOR: Inline literal with typo triggers excess property check error
interface ServerConfig {
    host: string;
    port: number;
}
function start(config: ServerConfig) {}

start({
    host: 'localhost',
    port: 8080,
    protocl: 'https' // âŒ Error: Object literal may only specify known properties! Did you mean protocol?
});`,
                    seniorCode: `// âœ… SENIOR: Understanding how structural subtyping behaves vs inline checks
// If you intentionally need to allow extra metadata, add an index signature:
interface FlexibleServerConfig {
    host: string;
    port: number;
    [key: string]: unknown; // Explicitly allows arbitrary extra properties
}
function start(config: FlexibleServerConfig) {}
start({ host: 'localhost', port: 8080, protocol: 'https' }); // âœ… Clean!`,
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
                    juniorCode: `// âŒ JUNIOR: Helper returns boolean; TS does NOT narrow the type inside the if block!
function isValidAdmin(user: any): boolean {
    return user && user.role === 'admin' && typeof user.token === 'string';
}
if (isValidAdmin(account)) {
    console.log(account.token.toUpperCase()); // âŒ TS Error: property token does not exist on type!
}`,
                    seniorCode: `// âœ… SENIOR: Use a type predicate "user is AdminUser" to teach the compiler
interface AdminUser { role: 'admin'; token: string; }

function isValidAdmin(user: any): user is AdminUser {
    return user && user.role === 'admin' && typeof user.token === 'string';
}
if (isValidAdmin(account)) {
    console.log(account.token.toUpperCase()); // âœ… TS knows account is guaranteed AdminUser!
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
                    juniorCode: `// âŒ JUNIOR: One giant type with optional fields. You can have status "success" with no data!
interface ApiResponse {
    status: 'idle' | 'loading' | 'success' | 'error';
    data?: User;
    error?: string;
}`,
                    seniorCode: `// âœ… SENIOR: Discriminated union enforces data presence per state
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
                    seniorInsight: 'Avoid unnecessary generic type parameters. If a type parameter only appears once in a function signature, you probably do not need a genericâ€”a plain type annotation is simpler and faster for the compiler.'
                },
                trap: {
                    title: 'Losing specific type information by returning broad interface types',
                    juniorCode: `// âŒ JUNIOR: Broad return type strips extra properties from the returned object!
interface Identifiable { id: string; }

function attachTimestamp(item: Identifiable): Identifiable {
    return { ...item, timestamp: Date.now() };
}
const user = attachTimestamp({ id: '123', name: 'Purushothaman', role: 'admin' });
console.log(user.name); // âŒ TS Error: Property 'name' does not exist on type 'Identifiable'!`,
                    seniorCode: `// âœ… SENIOR: Generic constraint preserves the exact input shape and all extra fields
interface Identifiable { id: string; }

function attachTimestamp<T extends Identifiable>(item: T): T & { timestamp: number } {
    return { ...item, timestamp: Date.now() };
}
const user = attachTimestamp({ id: '123', name: 'Purushothaman', role: 'admin' });
console.log(user.name); // âœ… TS knows name: string and role: 'admin' still exist!`,
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
// getProperty(user, 'invalid');        // âŒ Compile error: Argument of type '"invalid"' is not assignable to '"name" | "age" | "isDeveloper"'!`,
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
                    juniorCode: `// âŒ JUNIOR: Type annotation widens palette to generic strings
type Palette = Record<string, string | number[]>;
const theme: Palette = { primary: '#2563eb', rgb: [37, 99, 235] };
theme.primary.toUpperCase(); // âŒ TS Error: property toUpperCase does not exist on number[]!`,
                    seniorCode: `// âœ… SENIOR: satisfies validates contract while preserving exact literal types
type Palette = Record<string, string | number[]>;
const theme = { primary: '#2563eb', rgb: [37, 99, 235] } satisfies Palette;
theme.primary.toUpperCase(); // âœ… Works! TS knows primary is specifically a string.`,
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
                    juniorCode: `// âŒ JUNIOR: 3 separate manual interfaces that drift out of sync when User changes
interface User { id: string; name: string; email: string; createdAt: Date; }
interface CreateUserInput { name: string; email: string; }
interface UpdateUserInput { name?: string; email?: string; }`,
                    seniorCode: `// âœ… SENIOR: Single source of truth transformed with utility types
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
                    juniorCode: `// âŒ JUNIOR: Index signature allows ANY property name, silencing spelling mistakes!
interface UserRecord {
    [key: string]: string;
}
const user: UserRecord = { name: 'Admin', emial: 'admin@test.com' }; // Typo "emial" is silently accepted!`,
                    seniorCode: `// âœ… SENIOR: Mapped type or Record with strict union keys prevents typos
type AllowedFields = 'name' | 'email' | 'role';
type UserRecord = {
    [K in AllowedFields]: string;
};
// const user: UserRecord = { name: 'Admin', emial: 'test' }; // âŒ Error: 'emial' does not exist!`,
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
                    juniorCode: `// âŒ JUNIOR: Fragile manual type extraction that breaks on custom types
type ArrayItem<T> = T[0]; // âŒ Error or fragile index lookup!`,
                    seniorCode: `// âœ… SENIOR: Pattern match and extract cleanly using conditional types and infer
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
                    juniorCode: `// âŒ JUNIOR: Both are typed as string; passing them in reverse order compiles silently!
function transferOwnership(userId: string, organizationId: string) {}

const userId = 'usr_123';
const orgId = 'org_456';
transferOwnership(orgId, userId); // âŒ Compiles without warning! Swapped parameters corrupt database!`,
                    seniorCode: `// âœ… SENIOR: Branded types guarantee compile-time parameter differentiation
declare const BrandSymbol: unique symbol;
type Brand<T, B> = T & { readonly [BrandSymbol]: B };

type UserId = Brand<string, 'UserId'>;
type OrgId = Brand<string, 'OrgId'>;

function transferOwnership(userId: UserId, orgId: OrgId) {}

const userId = 'usr_123' as UserId;
const orgId = 'org_456' as OrgId;

// transferOwnership(orgId, userId); 
// âŒ Compile Error: Type 'OrgId' is not assignable to type 'UserId'!`,
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
emit('user:created'); // âœ… Valid!
// emit('user:unknown'); // âŒ Compile error!`,
                    explanation: 'Template literal types automatically cross-multiply union members, producing exhaustive string unions with zero repetitive typing.'
                },
                docLink: {
                    title: 'TypeScript: Template Literal Types',
                    url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html',
                    description: 'Pattern matching and string construction at compile time.'
                }
            }
        ]
};
