import { SkillRoadmap } from './types';
export const tailwindRoadmap: SkillRoadmap = {
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
                    juniorCode: `// âŒ JUNIOR: Creating legacy tailwind.config.js in a v4 project
module.exports = {
  theme: {
    extend: {
      colors: { brand: '#2563eb' }
    }
  }
};`,
                    seniorCode: `/* âœ… SENIOR: Native CSS-first @theme in main index.css */
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
                    juniorCode: `// âŒ JUNIOR: Breakpoints trigger on screen size; breaks if card is in a small sidebar on desktop
<div className="flex flex-col md:flex-row gap-4">
  <img className="w-full md:w-32" />
  <div>Content</div>
</div>`,
                    seniorCode: `// âœ… SENIOR: Container queries adapt to the actual available slot
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
};
