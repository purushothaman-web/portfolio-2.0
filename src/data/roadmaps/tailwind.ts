import { SkillRoadmap } from './types';

export const tailwindRoadmap: SkillRoadmap = {
    skillId: 'tailwind',
    skillName: 'Tailwind CSS v4 & Modern Styling',
    category: 'CLIENT-SIDE',
    tagline: 'CSS-first @theme token configuration, container queries, OKLCH color spaces, subgrid, and high-performance design systems.',
    accentColor: '#38bdf8',
    officialDocs: [
        {
            title: 'Tailwind CSS v4 Official Documentation',
            url: 'https://tailwindcss.com/docs',
            description: 'The canonical modern CSS-first documentation for utility classes, CSS functions, and theme tokens.',
            badge: 'Official Canonical Docs'
        },
        {
            title: 'Tailwind CSS v4 Announcement & Architecture',
            url: 'https://tailwindcss.com/blog/tailwindcss-v4-alpha',
            description: 'How Tailwind v4 eliminated tailwind.config.js in favor of native CSS cascade layers, Lightning CSS, and the Rust-based Oxide compiler.',
            badge: 'Architecture Guide'
        },
        {
            title: 'Tailwind CSS Interactive Cheat Sheet',
            url: 'https://nerdcave.com/tailwind-cheat-sheet',
            description: 'Fast interactive visual class lookup for layout, flexbox, grid, subgrid, and typography.',
            badge: 'Quick Cheatsheet'
        }
    ],
    checkpoints: [
        {
            id: 'tw-1',
            title: 'CSS-First @theme Configuration vs Legacy JS Config',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind CSS v4 completely removes the legacy `tailwind.config.js` in favor of native CSS `@theme` directives configured directly inside your stylesheet. Powered by the Rust-based Oxide compiler and Lightning CSS, v4 builds up to 10x faster and automatically exposes all theme values as native CSS custom properties (e.g. var(--color-brand)).',
                analogy: 'Instead of an interpreter translating JavaScript configurations into CSS at build time, you write directly in the browser native dialect: CSS variables inside stylesheets.',
                seniorInsight: 'Senior architects define design tokens using native CSS custom properties inside `@theme`. This allows runtime theme switching (such as tenant white-labeling or dark mode) simply by overriding CSS variables without touching JavaScript bundles.'
            },
            trap: {
                title: 'Creating legacy tailwind.config.js files in a Tailwind v4 project',
                juniorCode: `// ❌ JUNIOR: Legacy JS config in v4 causes confusion and misses Oxide optimizations
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                brand: '#3b82f6',
                surface: '#0f172a'
            }
        }
    }
};`,
                seniorCode: `/* ✅ SENIOR: Native CSS-first @theme directive inside main stylesheet */
@import "tailwindcss";

@theme {
    --color-brand: #3b82f6;
    --color-surface: #0f172a;
    --font-heading: "Plus Jakarta Sans", sans-serif;
    --radius-card: 1rem;
    --spacing-container: 80rem;
}`,
                explanation: 'Tailwind v4 parses @theme directly into utility classes like bg-brand, font-heading, and rounded-card. It eliminates duplicate configuration files and makes tokens universally accessible in CSS.'
            },
            drill: {
                question: 'How do you define a custom brand color in Tailwind v4 so it automatically produces bg-brand, text-brand, and border-brand utilities?',
                hint: 'In Tailwind v4, what CSS variable prefix inside @theme designates color tokens?',
                solution: `Inside your CSS file with @import "tailwindcss":
@theme {
    --color-brand: #3b82f6;
}
Tailwind v4 automatically maps '--color-*' tokens to all color-related utilities (bg-brand, text-brand, border-brand, ring-brand, etc.).`,
                explanation: 'The --color-* namespace convention inside @theme instructs the Oxide compiler to generate the complete suite of color utilities with built-in opacity modifier support.'
            },
            docLink: {
                title: 'Tailwind CSS v4: Theme Configuration',
                url: 'https://tailwindcss.com/docs/theme',
                description: 'Using @theme to configure fonts, colors, breakpoints, and design tokens directly in CSS.'
            }
        },
        {
            id: 'tw-2',
            title: 'Native Cascade Layers (@layer) & Specificity Management',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind v4 organizes styles into native CSS cascade layers (@layer theme, base, components, utilities). Because cascade layers dictate priority regardless of selector specificity, standard utility classes (like p-4) reliably override base styles and component rules without requiring specificity hacks or "!important".',
                analogy: 'A legal system with courts of differing jurisdiction: a federal supreme court ruling (utilities layer) always takes precedence over municipal bylaws (base layer), no matter how detailed the municipal document was.',
                seniorInsight: 'Avoid sprinkling "!important" (e.g. !p-4) to solve styling conflicts. Instead, place custom component abstractions in @layer components so that standard utility modifiers (hover:, md:, p-8) can effortlessly override them.'
            },
            trap: {
                title: 'Using !important to override component styles due to specificity conflicts',
                juniorCode: `/* ❌ JUNIOR: Using !important creates unmaintainable specificity escalation */
.btn-primary {
    background-color: #2563eb !important;
    padding: 12px 24px !important;
}
/* In JSX, utility overrides fail unless forced with '!': */
<button className="btn-primary bg-red-600!">Delete</button>`,
                seniorCode: `/* ✅ SENIOR: Encapsulate reusable class patterns in @layer components */
@layer components {
    .btn-primary {
        background-color: var(--color-brand);
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: background-color 150ms ease;
    }
}
/* In JSX: standard utility classes naturally win because @layer utilities beats @layer components */
<button className="btn-primary bg-red-600 hover:bg-red-700">Delete</button>`,
                explanation: 'Because @layer utilities sits higher in the cascade order than @layer components, utility classes override component defaults naturally without specificity wars.'
            },
            drill: {
                question: 'Why does an unlayered custom CSS class often fail to be overridden by a Tailwind utility class like "hidden"?',
                hint: 'Where do unlayered CSS rules sit in relation to CSS cascade layers?',
                solution: `Unlayered CSS styles have HIGHER specificity than any style inside a CSS cascade layer (@layer utilities).
When you write a raw selector like ".card { display: flex; }" outside of any layer, it will override Tailwind's ".hidden { display: none; }" because Tailwind utilities live inside the utilities layer.
Wrapping custom classes in "@layer components { ... }" restores predictable cascade priority.`,
                explanation: 'Styles outside of cascade layers always take precedence over layered styles according to CSS specifications.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Adding Custom Styles',
                url: 'https://tailwindcss.com/docs/adding-custom-styles',
                description: 'Managing base, components, and utilities with native CSS cascade layers.'
            }
        },
        {
            id: 'tw-3',
            title: 'Native Container Queries (@container) vs Viewport Breakpoints',
            estMinutes: 5,
            concept: {
                summary: 'Viewport media queries (sm:, md:, lg:) measure the entire browser window width, which fails when the same component is reused in varying page contexts (e.g. a wide main feed vs a narrow 300px sidebar). Container queries (@container) allow an element to adapt its layout based on the width of its direct parent container.',
                analogy: 'Water taking the shape of its glass: a widget adapts to the size of the box it was placed into, rather than caring how big the entire kitchen counter is.',
                seniorInsight: 'Make reusable UI components (cards, profile badges, comment threads) container-responsive using `@container` and `@sm:`, `@md:`, `@lg:`. This guarantees the component looks perfect whether displayed in a full-width hero or a compressed modal.'
            },
            trap: {
                title: 'Using viewport queries (md:, lg:) on cards placed inside dynamic multi-column layouts',
                juniorCode: `// ❌ JUNIOR: Relies on screen width; breaks if card is placed in a narrow sidebar!
export const UserCard = ({ user }) => (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-xl">
        <img src={user.avatar} className="w-16 h-16 rounded-full" />
        <div className="text-center md:text-left">
            <h4 className="font-bold text-lg">{user.name}</h4>
            <p className="text-sm text-slate-500">{user.role}</p>
        </div>
    </div>
);`,
                seniorCode: `// ✅ SENIOR: Marks parent as a container and styles children relative to container size
export const UserCard = ({ user }) => (
    <div className="@container p-4 border rounded-xl">
        <div className="flex flex-col @sm:flex-row items-center gap-4">
            <img src={user.avatar} className="w-16 h-16 rounded-full" />
            <div className="text-center @sm:text-left">
                <h4 className="font-bold text-lg">{user.name}</h4>
                <p className="text-sm text-slate-500">{user.role}</p>
            </div>
        </div>
    </div>
);`,
                explanation: 'Using @container on the card wrapper and @sm:flex-row on the inner content ensures the card switches to row layout only when its own container has at least 384px of width.'
            },
            drill: {
                question: 'What Tailwind classes are needed to turn a div into a query container and change a child layout from a single column to 2 columns when that container exceeds 400px?',
                hint: 'Container declaration class + container query breakpoint class.',
                solution: `<div className="@container">
    <div className="grid grid-cols-1 @[400px]:grid-cols-2 gap-4">
        ...
    </div>
</div>`,
                explanation: 'The @container utility declares container-type: inline-size, and @[400px]:grid-cols-2 activates the 2-column grid when the container width reaches 400px.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Container Queries',
                url: 'https://tailwindcss.com/docs/container-queries',
                description: 'Designing modular, container-responsive components with @container utilities.'
            }
        },
        {
            id: 'tw-4',
            title: 'Modern OKLCH Colors, Gamut Mixing & Dynamic Opacity',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind v4 adopts the OKLCH color space for its default color palette. OKLCH provides uniform perceived brightness across hues, eliminating the muddy darkening that occurs with traditional sRGB color interpolation. Furthermore, Tailwind supports color-mix() and slash opacity modifiers (e.g. bg-brand/20) seamlessly.',
                analogy: 'Standard RGB is like mixing physical paint on paper where colors can turn muddy and dull; OKLCH is like mixing pure calibrated light with mathematically consistent optical luminance.',
                seniorInsight: 'Use OKLCH color tokens in @theme for brand palettes. Unlike HEX or HSL, OKLCH ensures accessible contrast ratios (WCAG AA/AAA) remain mathematically consistent across all color shades from 50 to 950.'
            },
            trap: {
                title: 'Hardcoding HEX colors with opacity hacks instead of native opacity modifiers',
                juniorCode: `// ❌ JUNIOR: Hardcoding HEX alpha channel breaks theme reusability
<div className="bg-[#3b82f633] text-[#3b82f6] border border-[#3b82f640]">
    Notice
</div>`,
                seniorCode: `// ✅ SENIOR: Uses theme semantic tokens with dynamic slash opacity modifiers
<div className="bg-brand/10 text-brand border border-brand/25 dark:bg-brand/20">
    Notice
</div>`,
                explanation: 'Slash opacity syntax (bg-brand/10) dynamically modifies alpha transparency without requiring pre-computed hex codes or extra CSS definitions.'
            },
            drill: {
                question: 'Why is OKLCH preferred over traditional HSL and RGB color models in modern web design systems?',
                hint: 'What happens to perceived brightness when comparing HSL yellow (l=50%) to HSL blue (l=50%)?',
                solution: `OKLCH is perceptually uniform.
In HSL, pure blue at 50% lightness appears much darker to human eyes than pure yellow at 50% lightness.
In OKLCH, a lightness value of 0.7 has the exact same perceived brightness across every single hue, making automated accessible contrast calculations reliable.`,
                explanation: 'Perceptual uniformity in OKLCH guarantees that color ramps have smooth, predictable contrast steps.'
            },
            docLink: {
                title: 'Tailwind CSS v4: Colors & OKLCH Palettes',
                url: 'https://tailwindcss.com/docs/customizing-colors',
                description: 'Leveraging modern wide-gamut OKLCH palettes and color utilities.'
            }
        },
        {
            id: 'tw-5',
            title: 'CSS Grid, Subgrid (grid-cols-subgrid) & Gapless Bento Systems',
            estMinutes: 5,
            concept: {
                summary: 'Modern dashboards and portfolios rely on asymmetric bento grid layouts. CSS Subgrid (`grid-cols-subgrid` and `grid-rows-subgrid`) allows nested child elements to inherit and align directly to the parent grid tracks, solving the age-old problem of misaligned card headers and footers across dynamic card items.',
                analogy: 'A skyscraper construction frame: subgrid allows individual interior rooms on different floors to align perfectly with the building external load-bearing pillars.',
                seniorInsight: 'Combine `grid-rows-subgrid` with `row-span-3` on card components. This ensures card titles, descriptions, and action buttons align horizontally across every card in a row, regardless of text length variations.'
            },
            trap: {
                title: 'Using flexbox or fixed heights on cards where titles have differing lengths',
                juniorCode: `// ❌ JUNIOR: Differing title lengths cause button rows to be misaligned!
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {cards.map(card => (
        <div className="flex flex-col justify-between p-6 border rounded-xl">
            <h3 className="font-bold text-xl">{card.title}</h3>
            <p className="text-slate-600">{card.body}</p>
            <button className="btn">Action</button>
        </div>
    ))}
</div>`,
                seniorCode: `// ✅ SENIOR: Subgrid locks headers, bodies, and footers into shared parent tracks
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {cards.map(card => (
        <div key={card.id} className="grid grid-rows-subgrid row-span-3 p-6 border rounded-xl gap-y-4">
            <h3 className="font-bold text-xl">{card.title}</h3>
            <p className="text-slate-600">{card.body}</p>
            <button className="btn self-end">Action</button>
        </div>
    ))}
</div>`,
                explanation: 'With grid-rows-subgrid and row-span-3, each card participates directly in the 3 rows of the parent grid, aligning all titles, bodies, and CTA buttons across the row.'
            },
            drill: {
                question: 'What two Tailwind utility classes must be placed on a child element to make its internal items align with the parent grid columns?',
                hint: 'One specifies row/column span, and the other enables subgrid inheritance.',
                solution: `The child requires:
1. col-span-{n} (to define how many parent columns it covers)
2. grid-cols-subgrid (to inherit those column tracks directly for its children)`,
                explanation: 'Subgrid requires an explicit track span so the browser engine knows which parent tracks to inherit.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Grid Template Columns & Subgrid',
                url: 'https://tailwindcss.com/docs/grid-template-columns',
                description: 'Building advanced multi-track layouts with grid-cols-subgrid.'
            }
        },
        {
            id: 'tw-6',
            title: 'Advanced Selector Variants: has-*, group-has-*, and :not() Negations',
            estMinutes: 5,
            concept: {
                summary: 'The `:has()` CSS relational pseudo-class acts as a parent selector. Tailwind provides `has-*` and `group-has-*` variants, enabling an element to style itself or its surroundings based on the presence or state of child elements (e.g. styling a form card when any input inside is focused or invalid).',
                analogy: 'A smoke detector: when a small flame appears inside the kitchen (child element), the entire house alarm system (parent container) lights up and sounds an alert.',
                seniorInsight: 'Use `has-checked:border-blue-600` on selectable card wrappers. This eliminates the need for React state just to style a radio or checkbox card when selected.'
            },
            trap: {
                title: 'Writing redundant React state handlers just to style a container when a checkbox is checked',
                juniorCode: `// ❌ JUNIOR: Manages boolean state in React to style card wrapper
const [isSelected, setIsSelected] = useState(false);

return (
    <label className={\`p-4 border rounded-xl \${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}\`}>
        <input type="checkbox" checked={isSelected} onChange={e => setIsSelected(e.target.checked)} />
        <span>Pro Plan</span>
    </label>
);`,
                seniorCode: `// ✅ SENIOR: Pure CSS parent styling using the has-* variant (Zero re-renders!)
export const PlanCard = () => (
    <label className="p-4 border border-slate-200 rounded-xl cursor-pointer transition-colors has-checked:border-blue-600 has-checked:bg-blue-50/50 flex items-center gap-3">
        <input type="checkbox" className="accent-blue-600" />
        <span className="font-medium text-slate-900">Pro Plan</span>
    </label>
);`,
                explanation: 'The has-checked variant detects when the child input is checked and applies border and background changes natively in CSS without triggering React component re-renders.'
            },
            drill: {
                question: 'How would you write a Tailwind utility class on a form element that darkens the form background only when any button inside is hovered?',
                hint: 'Use the has-* selector with a hover pseudo-class on button.',
                solution: `<form className="bg-slate-50 p-6 rounded-2xl has-[button:hover]:bg-slate-100 transition-colors">
    <input type="text" />
    <button type="submit">Submit</button>
</form>`,
                explanation: 'The has-[button:hover] variant activates when a button descendant is in the :hover state.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Hover, Focus, and Other States',
                url: 'https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-descendants',
                description: 'Using has-* and group-has-* to style parents based on descendant states.'
            }
        },
        {
            id: 'tw-7',
            title: 'Dynamic & Arbitrary Values without Inline Style Tags',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind arbitrary value syntax (`[value]`) allows developers to inject one-off pixel values, custom CSS functions (`clamp()`, `calc()`), and CSS custom properties (`[var(--dynamic)]`) into utility classes. This preserves utility consistency while eliminating the need for raw `style={{ ... }}` objects in JSX.',
                analogy: 'A bespoke suit tailored to exact measurements: standard off-the-rack sizes work for 95% of cases, but when a unique measurement is needed, the tailor cuts the exact dimension cleanly into the fabric.',
                seniorInsight: 'When animating or dynamically calculating positions (e.g. cursor trackers or progress bars), pass the numeric value as a CSS variable in style={{ "--progress": `${pct}%` }} and apply `w-(--progress)` in className to keep the styling pipeline in CSS.'
            },
            trap: {
                title: 'Scattering inline style objects in JSX instead of CSS variable arbitrary values',
                juniorCode: `// ❌ JUNIOR: Inline styles break CSS media queries, hover states, and specificity
<div style={{ width: \`\${progress}%\`, backgroundColor: dynamicColor, height: '6px' }} />`,
                seniorCode: `// ✅ SENIOR: Bridges dynamic JS data into CSS custom properties with arbitrary classes
<div 
    style={{ '--progress': \`\${progress}%\`, '--bar-color': dynamicColor } as React.CSSProperties}
    className="h-1.5 w-(--progress) bg-(--bar-color) rounded-full transition-all duration-300"
/>`,
                explanation: 'Using CSS variables with arbitrary classes allows transition utilities, pseudo-classes, and responsive breakpoints to interact cleanly with dynamic runtime data.'
            },
            drill: {
                question: 'How do you write a Tailwind arbitrary grid layout with 1 column of 250px and the rest flexible 1fr?',
                hint: 'Use grid-cols-[...]',
                solution: `className="grid grid-cols-[250px_1fr] gap-6"
Note that underscores (_) replace spaces inside arbitrary bracket syntax in Tailwind CSS.`,
                explanation: 'Tailwind converts underscores inside square brackets into whitespace in the generated CSS rule.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Adding Custom Styles',
                url: 'https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values',
                description: 'Using arbitrary values with brackets and CSS variables.'
            }
        },
        {
            id: 'tw-8',
            title: 'Fluid Typography & Proportional Scaling with clamp()',
            estMinutes: 5,
            concept: {
                summary: 'Traditional responsive typography changes font sizes abruptly at fixed viewport breakpoints (e.g. text-2xl md:text-4xl lg:text-6xl), causing jarring layout shifts during window resizing. Fluid typography uses CSS `clamp(min, preferred_viewport_scaling, max)` to smoothly scale text size proportionally with the screen width.',
                analogy: 'An analog volume dial that glides smoothly between 0 and 100, rather than a notched digital button that snaps loudly between distinct presets.',
                seniorInsight: 'Combine fluid typography with proportional line-height (`leading-[1.1]`) and tracking (`tracking-tight`). When heading text scales smoothly, tight leading prevents disproportionate vertical gaps on large displays.'
            },
            trap: {
                title: 'Stacking 5 different responsive breakpoint classes for a single heading',
                juniorCode: `// ❌ JUNIOR: Jumpy typography snapping at arbitrary breakpoints
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold">
    Next-Gen Engineering
</h1>`,
                seniorCode: `// ✅ SENIOR: Fluid typography that smoothly scales between 2rem and 4.5rem
<h1 className="text-[clamp(2rem,5vw+1rem,4.5rem)] leading-[1.08] tracking-tight font-extrabold text-slate-900">
    Next-Gen Engineering
</h1>`,
                explanation: 'The clamp() utility scales continuously with viewport width (5vw + 1rem) while establishing hard boundaries (min 2rem on phones, max 4.5rem on ultra-wide monitors).'
            },
            drill: {
                question: 'In the expression "text-[clamp(1.5rem,4vw,3rem)]", what will the font size be if 4vw equals 1rem (16px)?',
                hint: 'What does the clamp(min, val, max) mathematical function return when val < min?',
                solution: `The font size will be 1.5rem (24px).
clamp(min, preferred, max) will never drop below the minimum value (1.5rem), even when the preferred calculation (4vw = 1rem) is smaller.`,
                explanation: 'clamp() guarantees the text remains comfortably legible on narrow mobile viewports.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Font Size',
                url: 'https://tailwindcss.com/docs/font-size#using-custom-values',
                description: 'Configuring custom and fluid font sizes with Tailwind utilities.'
            }
        },
        {
            id: 'tw-9',
            title: 'Production Dark Mode Architecture & Multi-Theme Switching',
            estMinutes: 5,
            concept: {
                summary: 'In modern production web apps, dark mode should support both user manual toggling and system OS preferences (`prefers-color-scheme`). In Tailwind v4, dark variants can be bound to the `[data-theme="dark"]` HTML attribute or class selector using `@variant dark (&:where([data-theme="dark"] *))`, preventing theme flashing on initial load.',
                analogy: 'A smart home lighting system: you can let daylight sensors adjust the lights automatically (system preference), or flip the override switch when watching a movie (manual user toggle).',
                seniorInsight: 'Avoid setting explicit hardcoded background and text colors on every single element. Instead, assign CSS semantic variables (e.g. --bg-canvas, --text-primary) on the root `[data-theme]` selector. All components inherit the correct theme automatically.'
            },
            trap: {
                title: 'Scattering hundreds of "dark:bg-slate-900 dark:text-white" across every component',
                juniorCode: `// ❌ JUNIOR: High maintenance overhead; changing dark theme palette requires editing 100 files
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
    <h2 className="text-slate-900 dark:text-white">Title</h2>
    <p className="text-slate-600 dark:text-slate-400">Content</p>
</div>`,
                seniorCode: `/* ✅ SENIOR: Semantic CSS variables defined in @theme and swapped via root attribute */
@theme {
    --color-surface-base: var(--surface-base);
    --color-text-primary: var(--text-primary);
    --color-border-subtle: var(--border-subtle);
}

:root {
    --surface-base: #ffffff;
    --text-primary: #0f172a;
    --border-subtle: #e2e8f0;
}

[data-theme="dark"] {
    --surface-base: #0f172a;
    --text-primary: #f8fafc;
    --border-subtle: #1e293b;
}

/* In JSX: clean, timeless semantic classes without dark: clutter */
<div className="bg-surface-base text-text-primary border border-border-subtle">
    <h2>Title</h2>
    <p>Content</p>
</div>`,
                explanation: 'Semantic CSS tokens decouple your component JSX from specific color names. Dark mode, high-contrast mode, and brand themes are controlled centrally at the stylesheet root.'
            },
            drill: {
                question: 'How do you prevent the dreaded Flash of Unstyled Theme (FOUT/white flash) in Next.js or React when a user has dark mode enabled?',
                hint: 'When must the theme attribute be read from localStorage relative to React hydration?',
                solution: `Inject an inline, blocking <script> tag in the document <head> before React mounts:
<script dangerouslySetInnerHTML={{ __html: \`
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
\` }} />
This executes synchronously before the browser paints the first HTML frame.`,
                explanation: 'A blocking head script ensures the data-theme attribute is present on the root element before any CSS rendering occurs.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Dark Mode',
                url: 'https://tailwindcss.com/docs/dark-mode',
                description: 'Configuring dark mode strategies, selectors, and media queries.'
            }
        },
        {
            id: 'tw-10',
            title: 'Component Encapsulation: cn() Helper & Class Variance Authority (CVA)',
            estMinutes: 5,
            concept: {
                summary: 'When building reusable React component libraries, raw template string concatenation causes Tailwind specificity collisions (e.g. `p-4 p-6` both remain in the DOM, and CSS order determines which wins). Combining `clsx` (for conditional booleans) and `tailwind-merge` inside a `cn()` helper intelligently resolves conflicting utility classes.',
                analogy: 'An intelligent spell-checker: if you accidentally type two conflicting verbs ("he runs walks"), it deletes the old one and keeps the most recent intentional word.',
                seniorInsight: 'Use CVA (Class Variance Authority) to build type-safe, variant-driven components (e.g. Button intent="primary" size="lg"). It defines variant maps with autocomplete and automatically resolves class conflicts via the cn() utility.'
            },
            trap: {
                title: 'Concatenating Tailwind classes with raw template strings or array joins',
                juniorCode: `// ❌ JUNIOR: "bg-red-500" passed via props collides with "bg-blue-600"; CSS cascade decides winner!
export const Button = ({ className, variant = 'primary', ...props }) => {
    const base = 'px-4 py-2 font-bold rounded-lg bg-blue-600 text-white';
    // If className has "bg-red-500", BOTH classes exist on element: class="px-4 ... bg-blue-600 bg-red-500"
    return <button className={\`\${base} \${className || ''}\`} {...props} />;
};`,
                seniorCode: `// ✅ SENIOR: Type-safe CVA variants merged with twMerge
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
    {
        variants: {
            variant: {
                primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
                secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-500',
                danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
                ghost: 'hover:bg-slate-100 text-slate-700'
            },
            size: {
                sm: 'text-xs px-3 py-1.5 gap-1.5',
                md: 'text-sm px-4 py-2 gap-2',
                lg: 'text-base px-6 py-3 gap-2.5'
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md'
        }
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);`,
                explanation: 'tailwind-merge understands Tailwind CSS utility semantics. When a consumer passes className="px-6 bg-red-600", cn() automatically removes px-4 and bg-blue-600.'
            },
            drill: {
                question: 'What is the output of cn("p-4 text-sm bg-blue-500", "p-6 bg-red-500") when using tailwind-merge?',
                hint: 'Which padding and background classes are preserved?',
                solution: `"text-sm p-6 bg-red-500"
tailwind-merge identifies that "p-6" conflicts with "p-4" (padding property) and "bg-red-500" conflicts with "bg-blue-500" (background-color property), safely keeping the last specified values.`,
                explanation: 'Without tailwind-merge, both classes remain in classList and stylesheet declaration order produces unpredictable rendering.'
            },
            docLink: {
                title: 'GitHub: tailwind-merge Documentation',
                url: 'https://github.com/dcastil/tailwind-merge',
                description: 'Utility function to efficiently merge Tailwind CSS classes without style conflicts.'
            }
        },
        {
            id: 'tw-11',
            title: 'Oxide Compiler Optimization & Scanner Rules',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind v4 features the ground-up Rust rewrite known as the Oxide engine. It parses project source files at gigabytes per second, automatically discovering classes across .html, .jsx, .tsx, and .vue files without requiring explicit "content: []" glob configurations in 99% of projects.',
                analogy: 'An ultra-fast airport X-ray baggage scanner that inspects luggage at full conveyor belt speed, instantly cataloging items without needing manual manifests.',
                seniorInsight: 'Never construct class names dynamically with string concatenation (e.g. `text-${color}-500`). The static Oxide scanner does not execute JavaScript; it scans raw strings. Always use complete class names or object lookup maps.'
            },
            trap: {
                title: 'Constructing dynamic Tailwind class names with string interpolation',
                juniorCode: `// ❌ JUNIOR: Broken! The Oxide compiler regex scanner cannot discover dynamic tokens
const Badge = ({ color }) => {
    // Tailwind never generates "bg-red-500" or "text-red-700" because they do not exist as whole strings!
    return <span className={\`bg-\${color}-500 text-\${color}-700\`}>Active</span>;
};`,
                seniorCode: `// ✅ SENIOR: Full static class names mapped via record lookup
type BadgeColor = 'blue' | 'emerald' | 'amber' | 'rose';

const COLOR_MAP: Record<BadgeColor, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200'
};

export const Badge = ({ color = 'blue' }: { color?: BadgeColor }) => (
    <span className={cn('px-2.5 py-1 rounded-md text-xs font-semibold border', COLOR_MAP[color])}>
        Active
    </span>
);`,
                explanation: 'Writing complete class names in code allows the Oxide static analysis scanner to find them during build time and include only those used in the final production CSS bundle.'
            },
            drill: {
                question: 'Why does "bg-" + status + "-500" fail to render in a production Tailwind build even if it worked in local development by coincidence?',
                hint: 'How does Tailwind scan source code during production builds?',
                solution: `Tailwind scans source code files as plain text using regular expressions looking for complete class identifiers.
It does not execute JavaScript runtime expressions. Because the string "bg-green-500" never appears in raw source code, Tailwind strips it during tree-shaking, resulting in an unstyled element.`,
                explanation: 'Always write full class names or use explicit mapping objects so the build scanner reliably captures all utilities.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Dynamic Class Names',
                url: 'https://tailwindcss.com/docs/content-configuration#dynamic-class-names',
                description: 'Best practices for ensuring the Tailwind compiler detects all utility classes.'
            }
        },
        {
            id: 'tw-12',
            title: 'Keyframe Animations & GPU-Accelerated Micro-Interactions',
            estMinutes: 5,
            concept: {
                summary: 'Tailwind provides built-in animation utilities (animate-spin, animate-pulse, animate-bounce) and allows custom `@keyframes` declarations directly within `@theme`. For high-performance 60-120 FPS micro-interactions, animations should strictly mutate `transform` and `opacity` using `transform-gpu` to offload work to the graphics card without triggering layout reflows.',
                analogy: 'Moving a film projector slide (GPU transform) vs redrawing the physical animation frame on paper from scratch (DOM layout reflow).',
                seniorInsight: 'Always test animations with `@media (prefers-reduced-motion: reduce)` using the `motion-reduce:animate-none` or `motion-safe:*` variants to respect accessibility settings for users with vestibular sensitivities.'
            },
            trap: {
                title: 'Animating layout-triggering properties like top, height, or box-shadow',
                juniorCode: `/* ❌ JUNIOR: Animating height and top forces costly browser CPU layout recalculations */
@keyframes slideDown {
    from { height: 0; top: -20px; }
    to { height: 200px; top: 0; }
}
.dropdown { animation: slideDown 0.3s ease; }`,
                seniorCode: `/* ✅ SENIOR: Declaring GPU keyframes in @theme and animating scale/translate */
@import "tailwindcss";

@theme {
    --animate-enter-fade: enterFade 200ms cubic-bezier(0.16, 1, 0.3, 1);

    @keyframes enterFade {
        from {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
}

/* In JSX: Hardware-accelerated with accessibility fallback */
<div className="animate-enter-fade transform-gpu motion-reduce:animate-none">
    Dropdown Content
</div>`,
                explanation: 'Animating transform and opacity runs entirely on the browser compositor thread (GPU). It avoids costly CPU layout and paint cycles, ensuring silky smooth transitions even under heavy load.'
            },
            drill: {
                question: 'Which Tailwind variant utility ensures an animation is disabled when an operating system user has requested reduced motion?',
                hint: 'What is the opposite of motion-safe?',
                solution: `Use "motion-reduce:animate-none" or wrap animations in "motion-safe:animate-pulse".
This adheres to WCAG 2.2 accessibility criterion 2.3.3 for vestibular disorder safety.`,
                explanation: 'Respecting prefers-reduced-motion is essential for web accessibility and user comfort.'
            },
            docLink: {
                title: 'Tailwind CSS Docs: Animation',
                url: 'https://tailwindcss.com/docs/animation',
                description: 'Customizing keyframe animations and transitions with Tailwind CSS.'
            }
        }
    ]
};
