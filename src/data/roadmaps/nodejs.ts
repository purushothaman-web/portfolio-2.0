import { SkillRoadmap } from './types';
export const nodejsRoadmap: SkillRoadmap = {
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
                    juniorCode: `// âŒ JUNIOR: Expects setTimeout(0) to run before Promise.then
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));
console.log('Sync');
// Output: Sync -> Promise -> Timeout!`,
                    seniorCode: `// âœ… SENIOR: Understands that Microtask queue drains before Macrotask queue
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
                    juniorCode: `// âŒ JUNIOR: Loads a 2GB file entirely into RAM; server crashes under traffic
app.get('/download', async (req, res) => {
    const file = await fs.promises.readFile('./large-video.mp4');
    res.send(file);
});`,
                    seniorCode: `// âœ… SENIOR: Streams the file with backpressure handling and auto-cleanup
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
};
