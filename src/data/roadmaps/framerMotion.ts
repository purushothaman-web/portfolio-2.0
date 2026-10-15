import { SkillRoadmap } from './types';

export const framerMotionRoadmap: SkillRoadmap = {
    skillId: 'framer-motion',
    skillName: 'Framer Motion & Web Animation Engineering',
    category: 'CLIENT-SIDE',
    tagline: 'Spring physics, shared layout transitions, gesture engines, scroll parallax, and 120 FPS hardware-accelerated motion.',
    accentColor: '#a855f7',
    officialDocs: [
        {
            title: 'Motion.dev (Framer Motion) Official Docs',
            url: 'https://motion.dev/',
            description: 'The canonical documentation for motion components, layout animations, gestures, and spring physics.',
            badge: 'Official Documentation'
        },
        {
            title: 'Animations on the Web by Emil Kowalski',
            url: 'https://animations.dev/',
            description: 'The premier engineering guide on timing curves, physics parameters, interruptible gestures, and polish.',
            badge: 'Design Engineering'
        },
        {
            title: 'Motion Examples & Interactive Sandboxes',
            url: 'https://motion.dev/examples',
            description: 'Interactive recipes for drawers, carousels, tabs, shared element modals, and notification stacks.',
            badge: 'Interactive Examples'
        }
    ],
    checkpoints: [
        {
            id: 'fm-1',
            title: 'Shared Element Transitions with layoutId (The FLIP Technique)',
            estMinutes: 5,
            concept: {
                summary: '`layoutId` connects two completely separate component instances across re-renders, causing Framer Motion to smoothly morph between them as if they were a single continuous element. Under the hood, Framer Motion uses the FLIP technique (First, Last, Invert, Play) to compute bounding box coordinates and apply GPU-accelerated CSS transforms rather than expensive layout changes.',
                analogy: 'Passing a baton in a relay race: the runner changes, but the baton travels in one continuous, uninterrupted motion trajectory.',
                seniorInsight: 'Use `layoutId` for active navigation pills, tabs, and shared element modals. It eliminates jumpy cuts without requiring manual coordinate math or state-driven absolute positioning hacks.'
            },
            trap: {
                title: 'Calculating manual left/width pixel offsets with CSS transitions',
                juniorCode: `// ❌ JUNIOR: Manual left & width calculation causes browser reflows and lags on mobile
export const Tabs = ({ tabs, activeIndex, onChange }) => (
    <div className="relative flex border-b">
        {tabs.map((tab, i) => (
            <button key={tab.id} onClick={() => onChange(i)} className="px-4 py-2">
                {tab.title}
            </button>
        ))}
        {/* Forces layout reflow on every click! */}
        <div 
            style={{ left: activeIndex * 90, width: 80 }} 
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
        />
    </div>
);`,
                seniorCode: `// ✅ SENIOR: layoutId automatically computes FLIP transforms on the GPU (60+ FPS)
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTabId, onSelect }) => (
    <div className="flex border-b border-slate-200">
        {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => onSelect(tab.id)}
                    className="relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                    {tab.title}
                    {isActive && (
                        <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                    )}
                </button>
            );
        })}
    </div>
);`,
                explanation: 'When activeTabId changes, Framer Motion measures the previous position of activeTabIndicator and inverts it with transform: translate(), delivering a smooth spring animation across tabs of varying text widths.'
            },
            drill: {
                question: 'Why is animating transform and opacity with layoutId significantly faster than animating CSS width, height, and left?',
                hint: 'Which phases of the browser rendering pipeline are skipped?',
                solution: `CSS 'width', 'height', and 'left' trigger the browser Layout (reflow) and Paint phases, forcing the CPU to recalculate page geometry.
'transform' (scale, translate) and 'opacity' bypass Layout and Paint entirely, executing directly on the GPU Compositor thread at full refresh rate (60 to 120 FPS).`,
                explanation: 'FLIP calculates the difference in geometry and simulates the movement using GPU compositor transforms.'
            },
            docLink: {
                title: 'Motion.dev: Shared Layout Animations',
                url: 'https://motion.dev/docs/react-layout-animations#shared-layout-animations',
                description: 'Mastering layoutId, shared transitions, and FLIP animations.'
            }
        },
        {
            id: 'fm-2',
            title: 'Animation Orchestration with Variants & Staggering',
            estMinutes: 5,
            concept: {
                summary: 'Variants decouple animation states (initial, animate, exit) into declarative JavaScript objects that can be shared across component trees. Crucially, when a parent `<motion.div>` has variants, it can orchestrate its children using `staggerChildren` and `delayChildren`, propagating state down without manual delay calculations.',
                analogy: 'A symphony conductor: rather than every musician counting seconds on their own watch, the conductor points their baton, cueing the strings, then the woodwinds, then the brass in sequenced harmony.',
                seniorInsight: 'Avoid manually multiplying delays like `delay: index * 0.1` in child maps. Parent variants with `staggerChildren: 0.08` automatically adjust when items are filtered, inserted, or removed.'
            },
            trap: {
                title: 'Manually calculating animation delay based on index in child components',
                juniorCode: `// ❌ JUNIOR: Manual index math breaks if items are filtered, reordered, or deleted
{items.map((item, index) => (
    <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
    >
        {item.name}
    </motion.div>
))}`,
                seniorCode: `// ✅ SENIOR: Declarative container variant orchestrating children via staggerChildren
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { type: 'spring', stiffness: 400, damping: 28 } 
    }
};

export const ItemList = ({ items }) => (
    <motion.ul variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
        {items.map((item) => (
            <motion.li key={item.id} variants={itemVariants} className="p-3 bg-white rounded-xl shadow-xs">
                {item.name}
            </motion.li>
        ))}
    </motion.ul>
);`,
                explanation: 'Parent variants automatically pass the active variant string ("hidden", "show") down through the DOM hierarchy. staggerChildren handles the sequencing cleanly without prop-drilling.'
            },
            drill: {
                question: 'If a parent motion component has variants with initial="hidden" and animate="visible", do child motion components need to declare initial and animate explicitly?',
                hint: 'How does Framer Motion variant propagation work between parent and child motion elements?',
                solution: `No. Child motion components automatically inherit the active variant name ("hidden" and "visible") from their parent motion ancestor as long as the child declares its own matching variant dictionary:
<motion.div variants={childVariants} />`,
                explanation: 'Variant names propagate down the tree, eliminating boilerplate on child elements.'
            },
            docLink: {
                title: 'Motion.dev: Variants & Orchestration',
                url: 'https://motion.dev/docs/react-animation#variants',
                description: 'Organizing complex animations with variants, staggering, and children orchestration.'
            }
        },
        {
            id: 'fm-3',
            title: 'AnimatePresence & The Unmounting Lifecycle (mode="wait")',
            estMinutes: 5,
            concept: {
                summary: 'In standard React, when a component is unmounted from the DOM, it vanishes instantly with no opportunity to animate out. `<AnimatePresence>` intercepts component removal, keeping the element in the DOM until its `exit` animation completes. Its `mode="wait"` option guarantees that the exiting element fully departs before the entering element mounts.',
                analogy: 'A subway carriage door: departing passengers must fully step off onto the platform before arriving passengers enter the train, avoiding collisions in the doorway.',
                seniorInsight: 'Always ensure direct children of `<AnimatePresence>` have a unique `key` prop (such as a pathname for page transitions or unique item ID). Framer Motion uses the key to detect when one element replaces another.'
            },
            trap: {
                title: 'Both entering and exiting components rendering simultaneously, breaking layout flow',
                juniorCode: `// ❌ JUNIOR: Without mode="wait", exiting and entering elements exist simultaneously, jumping page height!
<AnimatePresence>
    {status === 'loading' ? (
        <motion.div key="loader" exit={{ opacity: 0 }}>Loading...</motion.div>
    ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Loaded Data</motion.div>
    )}
</AnimatePresence>`,
                seniorCode: `// ✅ SENIOR: mode="wait" ensures sequential transition without layout height jumping
<AnimatePresence mode="wait">
    {status === 'loading' ? (
        <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
        >
            <LoadingSpinner />
        </motion.div>
    ) : (
        <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
            <DataView />
        </motion.div>
    )}
</AnimatePresence>`,
                explanation: 'mode="wait" pauses the mounting of the incoming component until the departing component completes its exit animation, preserving layout height and aesthetic flow.'
            },
            drill: {
                question: 'What is the purpose of "mode=\'popLayout\'" in AnimatePresence when animating items in a grid or list?',
                hint: 'What happens to sibling items when an item is removed from normal document flow during its exit animation?',
                solution: `'mode="popLayout"' instantly pops the exiting element out of the normal document layout flow (applying position: absolute) so sibling items can immediately and smoothly slide into their new positions using layout animations, rather than waiting for the exit animation to finish.`,
                explanation: 'popLayout prevents empty holes in lists during exit animations.'
            },
            docLink: {
                title: 'Motion.dev: AnimatePresence',
                url: 'https://motion.dev/docs/react-animate-presence',
                description: 'Animating components when they are removed from the React component tree.'
            }
        },
        {
            id: 'fm-4',
            title: 'Spring Physics vs Duration Easings (stiffness, damping, mass)',
            estMinutes: 5,
            concept: {
                summary: 'Duration-based animations (`ease-in-out`, `cubic-bezier`) feel mechanical and robotic because physical objects in the real world do not move at fixed clock durations regardless of distance. Spring physics calculate motion based on physical properties: `stiffness` (spring tension), `damping` (resistance/friction), and `mass` (inertia).',
                analogy: 'A real spring or plucked guitar string: pulling a heavy weight releases momentum that bounces and settles naturally based on friction, rather than abruptly halting when a timer expires.',
                seniorInsight: 'Spring animations are inherently interruptible. If a user hovers, unhovers, and re-hovers rapidly, a spring seamlessly preserves existing velocity. A duration transition resets or jerks abruptly.'
            },
            trap: {
                title: 'Using linear or duration-based transitions on interactive micro-elements',
                juniorCode: `// ❌ JUNIOR: Duration transition feels artificial and stutters when interrupted mid-animation
<motion.button
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
>
    Click Me
</motion.button>`,
                seniorCode: `// ✅ SENIOR: Tuned spring physics that feel tactile, responsive, and natural
<motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25, 
        mass: 0.8 
    }}
    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-xs"
>
    Click Me
</motion.button>`,
                explanation: 'High stiffness with moderate damping delivers a snappy, physical bounce that feels high-end and instantly tactile under finger or cursor control.'
            },
            drill: {
                question: 'What happens to a spring animation if you significantly increase "damping" while keeping "stiffness" constant?',
                hint: 'Think of damping as moving through water or honey versus air.',
                solution: `Increasing damping increases friction/resistance. The spring will oscillate (bounce) LESS and settle much faster. If damping is high enough (overdamped), it will glide smoothly to its destination with ZERO overshoot or bounce.`,
                explanation: 'Damping controls the bounce factor; stiffness controls the speed and urgency.'
            },
            docLink: {
                title: 'Motion.dev: Springs & Physics',
                url: 'https://motion.dev/docs/react-spring',
                description: 'Tuning natural spring physics with stiffness, damping, mass, and velocity.'
            }
        },
        {
            id: 'fm-5',
            title: 'Gesture-Driven Interactions (Hover, Tap & Drag Constraints)',
            estMinutes: 5,
            concept: {
                summary: 'Framer Motion provides high-level gesture props: `whileHover`, `whileTap`, `whileDrag`, and `whileFocus`. For drag gestures, setting `dragConstraints` and `dragElastic` enables native mobile-app tactile behaviors, such as rubber-band resistance when pulling past boundaries.',
                analogy: 'Pulling an elastic rubber band attached to a corkboard: it moves freely within its boundaries, offers increasing tension when stretched beyond them, and snaps back when released.',
                seniorInsight: 'Combine `drag="y"` with `dragConstraints={{ top: 0, bottom: 0 }}` and `onDragEnd` velocity checks to build native-feeling bottom sheets and pull-to-dismiss notification banners.'
            },
            trap: {
                title: 'Writing manual touch and mouse event listeners with mousemove/mouseup calculations',
                juniorCode: `// ❌ JUNIOR: 60 lines of imperative event handlers for a draggable card
const [pos, setPos] = useState({ x: 0, y: 0 });
const onMouseDown = (e) => {
    const startX = e.clientX - pos.x;
    const onMouseMove = (ev) => setPos({ x: ev.clientX - startX, y: 0 });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMouseMove), { once: true });
};`,
                seniorCode: `// ✅ SENIOR: Declarative drag gesture with bounded elastic physics
import { motion, type PanInfo } from 'framer-motion';

export const SwipeableCard = ({ onDismiss }: { onDismiss: () => void }) => {
    const handleDragEnd = (_: any, info: PanInfo) => {
        // If swiped with sufficient velocity or distance, trigger dismiss
        if (info.offset.x > 150 || info.velocity.x > 500) {
            onDismiss();
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm cursor-grab"
        >
            Swipe right to dismiss
        </motion.div>
    );
};`,
                explanation: 'Framer Motion calculates pointer offsets and instantaneous velocity automatically, snapping back elastically unless a dismissal threshold is reached.'
            },
            drill: {
                question: 'What does "dragElastic={0.2}" do when a user drags an element past its dragConstraints boundaries?',
                hint: 'Does it stop hard like a brick wall, or does it give resistance?',
                solution: `'dragElastic={0.2}' creates a rubber-band resistance effect. The element moves only 20% of the pointer distance when pulled outside its defined constraints, and snaps back to constraints on release.`,
                explanation: 'Elastic drag mimics iOS and macOS physical rubber-banding.'
            },
            docLink: {
                title: 'Motion.dev: Gestures & Drag',
                url: 'https://motion.dev/docs/react-gestures',
                description: 'Implementing hover, tap, pan, and drag interactions.'
            }
        },
        {
            id: 'fm-6',
            title: 'Scroll-Triggered & Parallax Motion (whileInView vs useScroll)',
            estMinutes: 5,
            concept: {
                summary: 'Framer Motion supports two fundamental scroll models: 1) Trigger-based viewport animations via `whileInView` and `viewport={{ once: true }}`, and 2) Continuous scroll-linked parallax animations via `useScroll()` and `useTransform()`, mapping scroll progress (0 to 1) directly to CSS visual properties.',
                analogy: '1) A motion-activated light (whileInView): trips on when someone walks into the room. 2) A direct gear train (useScroll): turning the crank on the scrollbar physically turns the cogs of the animation in lockstep.',
                seniorInsight: 'Always add `viewport={{ once: true, margin: "-10% 0px" }}` to section entrance animations. Triggering the animation when the element is 10% inside the viewport ensures the user actually sees the transition start.'
            },
            trap: {
                title: 'Re-triggering entrance animations every single time the user scrolls up and down',
                juniorCode: `// ❌ JUNIOR: Forgetting once: true causes annoying repeated flashing as user scrolls
<motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    // Missing viewport={{ once: true }}; runs every time element crosses viewport!
>
    Section Content
</motion.div>`,
                seniorCode: `// ✅ SENIOR: Smooth parallax scrub linked directly to container scroll progress
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ParallaxHero = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start start', 'end start']
    });

    // Maps 0% -> 100% scroll to 0px -> 150px translation and 100% -> 0% opacity
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div ref={targetRef} className="relative h-screen overflow-hidden bg-slate-950 text-white flex items-center justify-center">
            <motion.div style={{ y, opacity }} className="text-center space-y-4">
                <h1 className="text-6xl font-bold tracking-tight">Kinetic Interface</h1>
                <p className="text-slate-400">Scroll-linked hardware-accelerated parallax</p>
            </motion.div>
        </div>
    );
};`,
                explanation: 'useScroll combined with useTransform updates CSS properties directly on the GPU compositor without triggering React re-renders, delivering flawless 120 FPS scrubbing.'
            },
            drill: {
                question: 'How do you configure whileInView so that an animation triggers only once and does not fire until at least 100px of the element is visible?',
                hint: 'What properties belong inside the viewport object prop?',
                solution: `<motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
/>`,
                explanation: 'viewport={{ once: true, margin: "-100px" }} guarantees the entrance animation plays once and only after the element has penetrated 100px into the viewport.'
            },
            docLink: {
                title: 'Motion.dev: Scroll Animations',
                url: 'https://motion.dev/docs/react-scroll-animations',
                description: 'Creating scroll-triggered and scroll-linked continuous animations.'
            }
        },
        {
            id: 'fm-7',
            title: 'Motion Values (useMotionValue) & Zero Re-render DOM Updates',
            estMinutes: 5,
            concept: {
                summary: 'Standard React state updates (`useState`) trigger reconciliation, virtual DOM diffing, and full component function re-execution on every frame (60 to 120 times per second), causing heavy CPU bottlenecks. `MotionValue` (`useMotionValue`, `useSpring`, `useVelocity`) tracks animation state outside of React render cycles, mutating the DOM directly.',
                analogy: 'A mechanical speedometer in a sports car: the needle moves fluidly and continuously on an analog cable without rebooting the car computer 60 times a second.',
                seniorInsight: 'Use `useMotionValue` and `useSpring` for mouse-following cursor glows and 3D card tilt effects. The component mounts once, and mouse movements update GPU styles with 0% React re-render overhead.'
            },
            trap: {
                title: 'Storing mouse coordinates in useState for cursor or hover effects',
                juniorCode: `// ❌ JUNIOR: Re-renders the entire component on every single mousemove pixel!
const [coords, setCoords] = useState({ x: 0, y: 0 });

return (
    <div onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}>
        <div style={{ transform: \`translate(\${coords.x}px, \${coords.y}px)\` }} />
    </div>
);`,
                seniorCode: `// ✅ SENIOR: useMotionValue + useSpring mutates DOM styles directly without re-renders
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const InteractiveCursorCard = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics smoothing applied to raw mouse values
    const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    return (
        <div onMouseMove={handleMouseMove} className="relative overflow-hidden p-8 bg-slate-900 rounded-3xl border border-slate-800">
            {/* Directly bound motion value; 0 component re-renders! */}
            <motion.div
                style={{ x: smoothX, y: smoothY }}
                className="pointer-events-none absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl"
            />
            <h3 className="text-xl font-bold text-white">Zero Re-render Kinetic Glow</h3>
        </div>
    );
};`,
                explanation: 'Calling mouseX.set() updates internal MotionValue listeners which write directly to the element transform style attribute, bypassing React virtual DOM diffing entirely.'
            },
            drill: {
                question: 'Can you read the current numeric value of a MotionValue synchronously inside an event handler?',
                hint: 'What getter method does MotionValue expose?',
                solution: `Yes, by calling "motionValue.get()".
Unlike asynchronous React state setters, motionValue.get() immediately returns the exact current floating-point number.`,
                explanation: 'MotionValue provides synchronous .get() and .set() access.'
            },
            docLink: {
                title: 'Motion.dev: MotionValues',
                url: 'https://motion.dev/docs/react-motion-value',
                description: 'Managing high-performance animation state outside of React render cycles.'
            }
        },
        {
            id: 'fm-8',
            title: 'Dynamic SVG Path Morphing & Line Drawing (pathLength)',
            estMinutes: 5,
            concept: {
                summary: 'Framer Motion can animate SVG elements directly using dedicated motion SVG components (`<motion.path>`, `<motion.circle>`). By animating `pathLength` from 0 to 1, Framer Motion animates SVG path strokes as if they were being drawn by hand in real time.',
                analogy: 'An artist pen tracing an outline on a light table: the pen tip glides smoothly across the contours until the entire illustration appears connected and complete.',
                seniorInsight: 'Combine `pathLength` animations with `transition={{ duration: 1.5, ease: "easeInOut" }}` for interactive checkmarks, status icons, and architectural schema diagrams that assemble themselves on scroll.'
            },
            trap: {
                title: 'Attempting to manually calculate stroke-dasharray and stroke-dashoffset via CSS',
                juniorCode: `// ❌ JUNIOR: Brittle manual pixel dashoffset math that breaks if path coordinates change
<svg>
    <path 
        d="M5 13l4 4L19 7" 
        className="stroke-current" 
        style={{ strokeDasharray: 50, strokeDashoffset: isChecked ? 0 : 50 }} 
    />
</svg>`,
                seniorCode: `// ✅ SENIOR: Normalized pathLength automatically calculates geometric stroke length
import { motion } from 'framer-motion';

export const AnimatedCheckmark = ({ isChecked }: { isChecked: boolean }) => (
    <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
            d="M4 12l5 5L20 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
                pathLength: isChecked ? 1 : 0, 
                opacity: isChecked ? 1 : 0 
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
    </svg>
);`,
                explanation: 'pathLength normalizes the total geometric length of any complex bezier curve to a scale of 0 to 1, eliminating the need to manually compute SVG stroke lengths.'
            },
            drill: {
                question: 'What SVG CSS properties does Framer Motion animate under the hood when you pass "pathLength: 1"?',
                hint: 'Think about SVG dash stroke styling.',
                solution: `It animates 'stroke-dasharray' and 'stroke-dashoffset'.
Framer Motion measures the total curve length using the SVG DOM API (getTotalLength()) and computes the exact dash offset values automatically.`,
                explanation: 'pathLength abstracts SVG dash calculation into a clean normalized property.'
            },
            docLink: {
                title: 'Motion.dev: SVG Animations',
                url: 'https://motion.dev/docs/react-svg-animation',
                description: 'Creating dynamic SVG line drawing and path morphing effects.'
            }
        },
        {
            id: 'fm-9',
            title: 'Layout Shift Prevention with layout & layout="position"',
            estMinutes: 5,
            concept: {
                summary: 'When an accordion expands or a list item is deleted, surrounding elements snap abruptly into their new positions. Adding the `layout` prop instructs Framer Motion to automatically animate the change in size and position using FLIP transforms. Setting `layout="position"` animates positional changes without distorting child content or aspect ratios.',
                analogy: 'Water flowing around river rocks: when one rock is removed, the water glides smoothly into the gap rather than teleporting instantaneously.',
                seniorInsight: 'When animating cards that change width/height (like expanding accordions), use `layout="position"` on inner text or images. This prevents text from looking stretched or distorted while the parent container expands.'
            },
            trap: {
                title: 'Adding layout to a container which unintentionally stretches child typography',
                juniorCode: `// ❌ JUNIOR: Full 'layout' prop scales child text horizontally, distorting font geometry!
<motion.div layout className="p-4 border rounded-xl">
    <motion.h4 layout>Card Title (looks distorted and stretched during animation!)</motion.h4>
</motion.div>`,
                seniorCode: `// ✅ SENIOR: Uses layout="position" to translate text without distorting font aspect ratio
<motion.div layout className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
    <motion.h4 layout="position" className="text-xl font-bold text-slate-900">
        Card Title
    </motion.h4>
    {isOpen && (
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.2 }}
            className="text-slate-600 mt-2"
        >
            Detailed content expanding smoothly without typographic distortion.
        </motion.p>
    )}
</motion.div>`,
                explanation: 'layout="position" tells Framer Motion to calculate and animate X/Y translation coordinates while leaving width and height scaling untouched, preserving typographic sharpness.'
            },
            drill: {
                question: 'Why does adding "layout" to list items in a filtered grid cause cards to glide smoothly into their new slots instead of snapping?',
                hint: 'What does the FLIP technique do when an element is re-rendered at a new coordinate?',
                solution: `When React re-renders the list, Framer Motion measures the old position (First) and new position (Last), inverts the difference with a CSS transform (Invert), and plays a spring transition back to zero offset (Play).`,
                explanation: 'The FLIP technique turns discrete DOM position updates into smooth hardware-accelerated animations.'
            },
            docLink: {
                title: 'Motion.dev: Layout Animations',
                url: 'https://motion.dev/docs/react-layout-animations',
                description: 'Smoothing layout shifts and accordion expansions with the layout prop.'
            }
        },
        {
            id: 'fm-10',
            title: 'Accessible Motion: useReducedMotion & WCAG Compliance',
            estMinutes: 5,
            concept: {
                summary: 'Vestibular disorders can cause motion sickness, dizziness, and migraines when users encounter large-scale parallax scrolling, zooms, or rapid translational motion. The `useReducedMotion()` hook queries the operating system preference (`prefers-reduced-motion`) and allows engineers to replace aggressive movement with gentle opacity cross-fades.',
                analogy: 'Wheelchair accessibility ramps alongside staircases: designing an interface that provides equal comfort and dignity for users with differing physical sensory thresholds.',
                seniorInsight: 'Never disable transitions completely for reduced motion users—instantaneous content appearing and disappearing can be equally disorienting. Instead, replace translational movement (y: 50 -> 0) with a calm fade (opacity: 0 -> 1).'
            },
            trap: {
                title: 'Ignoring prefers-reduced-motion, violating WCAG 2.2 Criterion 2.3.3',
                juniorCode: `// ❌ JUNIOR: Forcibly subjects all users to massive bouncing translation transitions
<motion.div
    initial={{ y: 200, scale: 0.5, rotate: 15 }}
    animate={{ y: 0, scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 200 }}
>
    Hero Banner
</motion.div>`,
                seniorCode: `// ✅ SENIOR: Respects operating system reduced motion preference gracefully
import { motion, useReducedMotion } from 'framer-motion';

export const AccessibleHero = () => {
    const shouldReduceMotion = useReducedMotion();

    // If reduced motion is requested: calm fade; otherwise: full dynamic spring
    const animation = shouldReduceMotion
        ? { opacity: 1, y: 0 }
        : { opacity: 1, y: 0, scale: 1 };

    const initial = shouldReduceMotion
        ? { opacity: 0, y: 0 }
        : { opacity: 0, y: 32, scale: 0.98 };

    return (
        <motion.div
            initial={initial}
            animate={animation}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: 'easeOut' }}
            className="p-8 bg-white rounded-3xl shadow-sm"
        >
            Accessible Experience
        </motion.div>
    );
};`,
                explanation: 'useReducedMotion() returns a boolean indicating whether the user has requested minimal motion in their operating system accessibility preferences.'
            },
            drill: {
                question: 'Which WCAG 2.2 Level AAA success criterion requires websites to allow users to disable non-essential motion animations?',
                hint: 'Look for animation from interactions / vestibular safety criteria.',
                solution: `WCAG 2.2 Criterion 2.3.3 (Animation from Interactions - Level AAA).
It states that motion animation triggered by user interaction can be disabled unless the animation is essential to the functionality or the information being conveyed.`,
                explanation: 'Respecting user motion preferences is a fundamental pillar of inclusive design.'
            },
            docLink: {
                title: 'Motion.dev: Accessibility & Reduced Motion',
                url: 'https://motion.dev/docs/react-accessibility',
                description: 'Building accessible web animations with useReducedMotion.'
            }
        },
        {
            id: 'fm-11',
            title: 'Imperative Animation Control with useAnimate & Scoped Selectors',
            estMinutes: 5,
            concept: {
                summary: 'While declarative props (`animate={{ ... }}`) cover standard component transitions, complex multi-step choreographies (such as an interactive checkout button that morphs into a spinner, then draws a checkmark, then expands a confirmation card) become unwieldy with pure state. `useAnimate()` provides an imperative async `animate()` function scoped directly to a DOM container ref.',
                analogy: 'A film director giving line-by-line instructions on a movie set: "First look left, then pause for two seconds, then deliver your line and exit right."',
                seniorInsight: '`useAnimate` can target child elements via CSS selectors (e.g. `animate(".checkmark", { pathLength: 1 })`). This allows you to choreograph complex micro-interactions across child DOM nodes without wrapping every single child in a motion component.'
            },
            trap: {
                title: 'Creating 6 different state variables and useEffect chains to sequence a multi-step animation',
                juniorCode: `// ❌ JUNIOR: Spaghetti state machine trying to sequence 3 animations
const [step1, setStep1] = useState(false);
const [step2, setStep2] = useState(false);
useEffect(() => {
    if (step1) setTimeout(() => setStep2(true), 300);
}, [step1]);`,
                seniorCode: `// ✅ SENIOR: Clean async/await sequence with useAnimate scoped selectors
import { useAnimate } from 'framer-motion';

export const SubmitButton = () => {
    const [scope, animate] = useAnimate();

    const handleClick = async () => {
        // Step 1: Compress button width into a circular badge
        await animate(scope.current, { width: 48, borderRadius: 24 }, { duration: 0.2 });
        // Step 2: Hide label text
        await animate('.btn-text', { opacity: 0 }, { duration: 0.1 });
        // Step 3: Draw checkmark icon
        await animate('.btn-check', { pathLength: 1, opacity: 1 }, { type: 'spring', stiffness: 300 });
        // Step 4: Expand into success toast
        await animate(scope.current, { width: 220, backgroundColor: '#10b981' }, { duration: 0.3 });
    };

    return (
        <button ref={scope} onClick={handleClick} className="relative h-12 w-44 bg-blue-600 text-white font-medium rounded-xl flex items-center justify-center overflow-hidden">
            <span className="btn-text">Complete Order</span>
            <svg className="absolute w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path className="btn-check" d="M5 13l4 4L19 7" style={{ pathLength: 0, opacity: 0 }} />
            </svg>
        </button>
    );
};`,
                explanation: 'useAnimate returns an async animate function. Awaiting animate() calls creates clear, readable, imperative animation timelines without nested timeouts or state flags.'
            },
            drill: {
                question: 'What is the key advantage of useAnimate over the traditional useAnimationControls hook?',
                hint: 'How does useAnimate interact with DOM references and child selectors?',
                solution: `useAnimate scopes selectors to a DOM container ref (scope). It can animate standard non-motion HTML elements directly using CSS selectors (".btn-text", "li:nth-child(2)"), without requiring motion() wrappers on every child.`,
                explanation: 'useAnimate combines timeline sequencing with scoped CSS DOM queries.'
            },
            docLink: {
                title: 'Motion.dev: useAnimate Hook',
                url: 'https://motion.dev/docs/react-use-animate',
                description: 'Imperative animation timelines and scoped selector control.'
            }
        },
        {
            id: 'fm-12',
            title: 'Performance Optimization: LazyMotion & Bundle Size Splitting',
            estMinutes: 5,
            concept: {
                summary: 'By default, importing `motion` from `framer-motion` bundles all animation features (layout animations, drag gesture engine, SVG path morphing, springs), which can add up to 35kB+ (min+gzip) to the initial client JavaScript bundle. `<LazyMotion>` with `domAnimation` removes the layout and gesture engines from the initial bundle, slashing the footprint down to under 15kB.',
                analogy: 'Ordering a lightweight compact car for daily highway commuting, rather than hauling an entire multi-ton moving trailer with construction equipment you do not need.',
                seniorInsight: 'In Next.js and high-traffic marketing sites, wrap your application root or page with `<LazyMotion features={domAnimation} strict>`. This enforces optimal bundle splitting and guarantees that unnecessary physics engines are not loaded until required.'
            },
            trap: {
                title: 'Importing full "motion" across 50 small components, bloating initial page load bundle',
                juniorCode: `// ❌ JUNIOR: Pulls in the entire 35kB+ Framer Motion suite in every UI button
import { motion } from 'framer-motion';

export const SimpleFade = ({ children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {children}
    </motion.div>
);`,
                seniorCode: `// ✅ SENIOR: LazyMotion with m component and domAnimation reduces bundle by ~60%
import { LazyMotion, domAnimation, m } from 'framer-motion';

export const OptimizedApp = ({ children }: { children: React.ReactNode }) => (
    <LazyMotion features={domAnimation} strict>
        {children}
    </LazyMotion>
);

// In components: Use 'm' instead of 'motion'
export const SimpleFade = ({ children }: { children: React.ReactNode }) => (
    <m.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
    >
        {children}
    </m.div>
);`,
                explanation: 'The "m" component is a lightweight proxy that loads its animation implementation dynamically from the nearest LazyMotion provider, keeping the primary bundle lean.'
            },
            drill: {
                question: 'What happens if you use the "m" component without wrapping your application in a <LazyMotion> provider?',
                hint: 'Where does "m" look for its animation feature bundle?',
                solution: `The "m" component will render standard HTML elements without animating, or log a warning in development mode.
It requires a parent <LazyMotion features={...}> provider to supply the necessary animation driver.`,
                explanation: 'LazyMotion is the context provider that feeds features into the "m" proxy component.'
            },
            docLink: {
                title: 'Motion.dev: Reduce Bundle Size with LazyMotion',
                url: 'https://motion.dev/docs/react-reduce-bundle-size',
                description: 'Slashing bundle size using LazyMotion, domAnimation, and the m component.'
            }
        }
    ]
};
