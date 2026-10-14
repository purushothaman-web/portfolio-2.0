import { SkillRoadmap } from './types';
export const framerMotionRoadmap: SkillRoadmap = {
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
                    juniorCode: `// âŒ JUNIOR: Animating width/left causes costly browser layout reflows (laggy 30 FPS)
<div style={{ left: activeIndex * 80, width: 75 }} className="transition-all duration-300" />`,
                    seniorCode: `// âœ… SENIOR: layoutId calculates transforms automatically on GPU (60+ FPS)
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
};
