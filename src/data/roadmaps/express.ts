import { SkillRoadmap } from './types';

export const expressRoadmap: SkillRoadmap = {
    skillId: 'express',
    skillName: 'Express.js Framework',
    category: 'SERVER-SIDE',
    tagline: 'Enterprise middleware pipelines, schema validation, stateless JWT auth, rate limiting, and robust RESTful API architectures.',
    accentColor: '#000000',
    officialDocs: [
        {
            title: 'Express.js Official Documentation',
            url: 'https://expressjs.com/',
            description: 'The authoritative guide for Express routing, middleware composition, and application lifecycle.',
            badge: 'Official Canonical Docs'
        },
        {
            title: 'Express.js Official Getting Started & Tutorials',
            url: 'https://expressjs.com/en/starter/installing.html',
            description: 'Hands-on guided walkthroughs for building robust web servers and REST endpoints.',
            badge: 'Official Interactive Course'
        },
        {
            title: 'Express Production Security Best Practices',
            url: 'https://expressjs.com/en/advanced/best-practice-security.html',
            description: 'Official production guidelines for hardening Express APIs, managing dependencies, and protecting against common exploits.',
            badge: 'Framework Standards'
        }
    ],
    checkpoints: [
        {
            id: 'express-1',
            title: 'Middleware Architecture & Pipeline Execution Flow',
            estMinutes: 5,
            concept: {
                summary: 'Express processes HTTP requests via an onion-style linear middleware pipeline. Each middleware function receives (req, res, next). Calling next() passes control down to the subsequent middleware function in the stack. If next() is not called and no response is sent (e.g. res.send/res.json), the incoming client request hangs indefinitely until a gateway timeout occurs.',
                analogy: 'An assembly line inspection belt: every station (middleware) inspects or stamps the product (adds properties to req). If a station approves, it pushes the item to the next station (next()). If a station detects a problem, it sounds an emergency alarm and diverts the item off the belt (next(err)).',
                seniorInsight: 'Avoid performing mutations directly on global prototype objects inside middleware. Always attach verified data to well-typed request properties (e.g. req.user or req.tenantId).'
            },
            trap: {
                title: 'Forgetting to call next() or return after sending a response',
                juniorCode: `// ❌ JUNIOR: Forgets return statement; headers sent twice crash!
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized' });
        // 💥 Missing "return"! Code continues executing and calls next() below!
    }
    next(); // Throws "Error: Cannot set headers after they are sent to the client"
});`,
                seniorCode: `// ✅ SENIOR: Always return when terminating a response early
app.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
    }
    return next();
});`,
                explanation: 'Calling res.json() does not halt function execution. You must explicitly return from the middleware function to prevent downstream middleware from running.'
            },
            drill: {
                question: 'What happens if a middleware function neither sends a response (res.send) nor calls next()?',
                hint: 'What does the browser or API client experience?',
                solution: `The client request hangs indefinitely until the client, proxy, or server-side socket timeout threshold is reached (typically producing a 504 Gateway Timeout or ECONNRESET).`,
                explanation: 'Every middleware must either terminate the request-response cycle or invoke next() to pass control.'
            },
            docLink: {
                title: 'Express.js Guide: Using Middleware',
                url: 'https://expressjs.com/en/guide/using-middleware.html',
                description: 'Official guide on application-level, router-level, and third-party middleware.'
            }
        },
        {
            id: 'express-2',
            title: 'Centralized Error Handling & Async Boundary Wrappers',
            estMinutes: 5,
            concept: {
                summary: 'In Express 4, asynchronous promises that throw errors do NOT automatically get routed to error middleware; unhandled promise rejections can crash the Node process. Centralized error handling requires two components: 1) An asyncHandler wrapper that catches rejected promises and passes errors to next(err), and 2) Dedicated 4-argument error-handling middleware: (err, req, res, next).',
                analogy: 'A high-wire safety net: each acrobat (async route) is caught by a tether (asyncHandler) if they slip, gently lowering them directly into the medical response bay (the 4-arg error middleware) without hitting the arena floor.',
                seniorInsight: 'Express inspects the parameter count (fn.length === 4) at runtime. If you define an error handler as (err, req, res), Express treats it as regular middleware and skips it during error forwarding.'
            },
            trap: {
                title: 'Missing async error wrapper or omitting the 4th "next" parameter in error handlers',
                juniorCode: `// ❌ JUNIOR: Async rejection hangs or crashes the server
app.get('/users/:id', async (req, res) => {
    const user = await db.find(req.params.id); // If db throws, request hangs forever!
    res.json(user);
});

// Broken error middleware (only 3 arguments):
app.use((err: any, req: any, res: any) => {
    res.status(500).json({ error: err.message }); // Skipped by Express!
});`,
                seniorCode: `// ✅ SENIOR: Async boundary wrapper + strict 4-arg error middleware
type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncRoute) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 500) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

app.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await db.find(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    res.json(user);
}));

// Must declare EXACTLY 4 arguments: (err, req, res, next)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    res.status(status).json({
        success: false,
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});`,
                explanation: 'asyncHandler guarantees that thrown exceptions inside async/await blocks are caught and routed into Express error pipeline without unhandled rejections.'
            },
            drill: {
                question: 'Why does Express require the `next` parameter in an error-handling middleware function even if you never call next() inside the body?',
                hint: 'Check Function.prototype.length.',
                solution: `Express checks fn.length to distinguish regular middleware (length <= 3) from error-handling middleware (length === 4).
If "next" is omitted from the parameter declaration (e.g. (err, req, res)), fn.length is 3, causing Express to treat it as a standard request middleware and fail to route errors to it.`,
                explanation: 'Always include all 4 arguments (err, req, res, next) in your error-handling middleware signature.'
            },
            docLink: {
                title: 'Express.js Guide: Error Handling',
                url: 'https://expressjs.com/en/guide/error-handling.html',
                description: 'Official guide on catching errors, writing error handlers, and default error handlers.'
            }
        },
        {
            id: 'express-3',
            title: 'Request Validation & Prototype Pollution Defense with Zod',
            estMinutes: 5,
            concept: {
                summary: 'Client input from req.body, req.query, and req.params must be strictly validated before entering controller business logic. Schema validation transforms untrusted input into strongly-typed objects while stripping unexpected properties. Using Zod with `.strict()` rejects unexpected keys, preventing Mass Assignment vulnerabilities and Prototype Pollution payloads (__proto__, constructor) that attackers use to gain remote code execution.',
                analogy: 'An airport luggage scanner: passengers cannot board an aircraft simply by claiming their bags contain clothes; luggage is scanned against a strict allowlist of permitted items, and dangerous contraband is rejected at the gate.',
                seniorInsight: 'Define a reusable `validateRequest({ body, query, params })` middleware. When validation succeeds, replace req.body with the sanitized result (schema.parse), guaranteeing downstream handlers never touch raw unverified input.'
            },
            trap: {
                title: 'Using unvalidated req.body directly in database queries or Object.assign',
                juniorCode: `// ❌ JUNIOR: Mass assignment & prototype pollution exploit
app.post('/api/users/profile', async (req, res) => {
    const profile = {};
    // Attacker sends: { "__proto__": { "isAdmin": true }, "role": "ADMIN" }
    Object.assign(profile, req.body);
    await db.user.update({ where: { id: req.user.id }, data: profile });
    res.json({ success: true });
});`,
                seniorCode: `// ✅ SENIOR: Strict Zod schema middleware with type inference
import { z, ZodSchema } from 'zod';

export const validateRequest = (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
        if (schemas.query) req.query = await schemas.query.parseAsync(req.query);
        if (schemas.params) req.params = await schemas.params.parseAsync(req.params);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.flatten().fieldErrors
            });
        }
        next(error);
    }
};

const UpdateProfileSchema = z.object({
    displayName: z.string().min(2).max(50).trim(),
    bio: z.string().max(200).optional()
}).strict(); // .strict() rejects unexpected keys like isAdmin or __proto__

app.post('/api/users/profile', validateRequest({ body: UpdateProfileSchema }), (req, res) => {
    // req.body is guaranteed to only contain displayName and optional bio
    res.json({ success: true });
});`,
                explanation: 'Using z.object().strict() rejects unexpected fields, prevents mass-assignment vulnerabilities, and sanitizes input before it reaches your database.'
            },
            drill: {
                question: 'What is the security difference between Zod `.strip()` and `.strict()`?',
                hint: 'Consider whether unexpected keys throw an error or are silently removed.',
                solution: `.strip() (the default in Zod) silently deletes any keys not defined in the schema from the output object.
.strict() explicitly throws a validation error (ZodError) if any unexpected keys are present in the incoming payload.
For high-security operations (financial transactions, permission updates), .strict() is preferred to detect and block malicious payloads proactively.`,
                explanation: 'strict validation alerts you to probing attacks, while strip safely ignores unexpected metadata.'
            },
            docLink: {
                title: 'Zod Documentation: Object Schemas',
                url: 'https://zod.dev/?id=objects',
                description: 'Official documentation for schema parsing, strict mode, and TypeScript inference.'
            }
        },
        {
            id: 'express-4',
            title: 'Stateless JWT Auth, Argon2id Hashing & Cookie-Parser',
            estMinutes: 5,
            concept: {
                summary: 'Enterprise authentication uses a dual-token architecture: a short-lived stateless Access Token (15m expiry) containing user claims, and a long-lived Refresh Token (7d expiry) transmitted inside an HttpOnly, SameSite, Secure cookie. Password hashing uses Argon2id (the OWASP standard over bcrypt). Express cannot read cookies natively; `cookie-parser` is required to extract and verify signed cookies (`req.signedCookies.refreshToken`).',
                analogy: 'A secure office building: Argon2id is a heavy bank vault lock that resists mechanical drills. Your visitor day-pass (Access Token) grants 15-minute floor access. To renew, you present your tamper-evident biometric passport (Refresh Token in an HttpOnly cookie envelope), and the guard burns the old pass and issues a fresh one.',
                seniorInsight: 'Never store JWTs in browser localStorage—they are vulnerable to Cross-Site Scripting (XSS). Scoping the refresh cookie path to `/api/auth/refresh` prevents the cookie from being transmitted on general API requests.'
            },
            trap: {
                title: 'Returning JWTs in JSON bodies for localStorage or using weak bcrypt salt rounds',
                juniorCode: `// ❌ JUNIOR: Weak bcrypt rounds, token in localStorage, no cookie security
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

app.post('/login', async (req, res) => {
    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    const token = jwt.sign({ id: user.id }, 'secret');
    res.json({ token }); // Client saves in localStorage -> Vulnerable to any XSS exploit!
});`,
                seniorCode: `// ✅ SENIOR: Argon2id password hashing + cookie-parser HttpOnly rotation
import argon2 from 'argon2';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// app.use(cookieParser(process.env.COOKIE_SECRET)); // In Express setup

export async function hashPassword(plainText: string): Promise<string> {
    return argon2.hash(plainText, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64MB memory limit
        timeCost: 3        // 3 iterations
    });
}

export const issueTokens = async (userId: string, res: Response) => {
    const accessToken = jwt.sign(
        { sub: userId, role: 'USER' },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshTokenFamily = crypto.randomUUID();
    const refreshToken = jwt.sign(
        { sub: userId, family: refreshTokenFamily },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    await db.saveRefreshTokenHash(userId, hashToken(refreshToken), refreshTokenFamily);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        signed: true // Tamper-evident signed cookie
    });

    return { accessToken };
};`,
                explanation: 'Argon2id prevents GPU-accelerated hash cracking. Storing the refresh token in an HttpOnly, signed cookie parsed via cookie-parser completely isolates credentials from JavaScript XSS attacks.'
            },
            drill: {
                question: 'Why should the refresh token cookie path be restricted to `/api/auth/refresh` rather than `/`?',
                hint: 'What does the browser do when making requests to /api/products or /api/posts?',
                solution: `If path is set to "/", the browser automatically sends the refresh token cookie on EVERY HTTP request to every endpoint in your app, increasing bandwidth and expanding exposure.
Restricting path to "/api/auth/refresh" guarantees the cookie is only transmitted when the client explicitly requests a token renewal.`,
                explanation: 'Scoping cookie paths minimizes attack surfaces and reduces unnecessary HTTP header overhead.'
            },
            docLink: {
                title: 'OWASP: Password Storage Cheat Sheet (Argon2id)',
                url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
                description: 'Current cryptographic guidelines for memory-hard password hashing algorithms.'
            }
        },
        {
            id: 'express-5',
            title: 'RBAC & Multi-Tenant Data Isolation Guards',
            estMinutes: 5,
            concept: {
                summary: 'Authentication verifies WHO a client is; Authorization verifies WHAT actions they are permitted to perform. In multi-tenant SaaS backends, authorization requires two layers: Role-Based Access Control (RBAC, e.g. USER, AGENT, ADMIN) and Tenant Isolation (ensuring an admin in Tenant A cannot view or mutate records in Tenant B).',
                analogy: 'An apartment building master key: being an apartment owner (Role: Resident) does not give you permission to unlock apartment 4B if you only own apartment 2A (Tenant Isolation).',
                seniorInsight: 'Never trust an organizationId or tenantId passed in req.body or req.params. Always extract the authenticated organizationId directly from the verified session or JWT claims.'
            },
            trap: {
                title: 'Relying solely on role checks while allowing cross-tenant data leakage',
                juniorCode: `// ❌ JUNIOR: Checks role, but accepts target tenant from URL without ownership check
app.delete('/api/tenants/:orgId/users/:userId', requireAdmin, async (req, res) => {
    // If an Admin of Org 1 passes orgId of Org 2, they delete another company's staff!
    await db.user.delete({ where: { id: req.params.userId } });
    res.json({ success: true });
});`,
                seniorCode: `// ✅ SENIOR: Enforces both Role authorization AND strict Tenant boundary scoping
export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

app.delete('/api/users/:userId', authorizeRoles('ADMIN'), async (req: AuthenticatedRequest, res, next) => {
    try {
        // Enforce tenant scoping strictly from req.user:
        const deleted = await db.user.deleteMany({
            where: {
                id: req.params.userId,
                organizationId: req.user.organizationId // Prevents cross-tenant deletion
            }
        });
        if (deleted.count === 0) return res.status(404).json({ error: 'User not found in your organization' });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});`,
                explanation: 'Scoping queries with organizationId: req.user.organizationId ensures that even if an attacker guesses valid resource IDs, the database query will never return or mutate cross-tenant records.'
            },
            drill: {
                question: 'What is the fundamental difference between 401 Unauthorized and 403 Forbidden status codes?',
                hint: 'One means "Who are you?", the other means "I know who you are, but you cannot enter."',
                solution: `401 Unauthorized:
The user is unauthenticated (missing, expired, or invalid credentials/token). The client can authenticate and retry.

403 Forbidden:
The user IS authenticated, but their identity or role lacks the necessary permissions to access the requested resource. Re-authenticating with the same credentials will not change the outcome.`,
                explanation: 'Returning 401 for permission denials confuses client auth refresh interceptors into infinite re-login loops.'
            },
            docLink: {
                title: 'OWASP Guide: Broken Object Level Authorization (BOLA)',
                url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/',
                description: 'Preventing the #1 API vulnerability through strict object-level and tenant-level access verification.'
            }
        },
        {
            id: 'express-6',
            title: 'Rate Limiting, Reverse Proxy Trust & DDoS Defense',
            estMinutes: 5,
            concept: {
                summary: "Rate limiting prevents brute-force credential stuffing, scraping, and denial-of-service attacks by capping the number of requests an IP can make within a time window. In modern cloud setups (behind Nginx, Cloudflare, AWS ALB), Node.js sees the load balancer's internal IP unless app.set('trust proxy', 1) is enabled to inspect the X-Forwarded-For header.",
                analogy: 'A nightclub bouncer: rather than letting 500 people storm through the door at once, the bouncer only admits 10 guests per minute. If one person tries to enter 30 times in 10 seconds, they are made to wait outside.',
                seniorInsight: 'In-memory rate limiters (Map/MemoryStore) fail in multi-instance production environments because each Node cluster process maintains its own separate counters. Use a distributed Redis store (e.g. rate-limit-redis).'
            },
            trap: {
                title: 'Using default in-memory rate limiting behind a reverse proxy',
                juniorCode: `// ❌ JUNIOR: In-memory store; behind Cloudflare/Nginx, ALL users share the proxy IP!
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 // 100 requests per 15 min for ALL users combined!
});
app.use(limiter);`,
                seniorCode: `// ✅ SENIOR: Enables trust proxy and uses Redis distributed token bucket store
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';

// Required so Express reads the true client IP from X-Forwarded-For:
app.set('trust proxy', 1);

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 failed attempts per IP
    standardHeaders: 'draft-7', // Returns RateLimit-* headers
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args)
    }),
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

app.use('/api/auth/login', authLimiter);`,
                explanation: 'Using RedisStore synchronizes request counters across multiple Node instances, Kubernetes pods, and serverless invocations, preventing attackers from bypassing limits by cycling instances.'
            },
            drill: {
                question: 'Why can blindly enabling app.set("trust proxy", true) be a severe security vulnerability?',
                hint: 'What if an attacker manually sends an X-Forwarded-For HTTP header directly to your server?',
                solution: `If trust proxy is set to boolean true without knowing your network topology:
Express trusts whatever IP is at the end of the X-Forwarded-For chain. An attacker can craft a fake header:
X-Forwarded-For: 127.0.0.1
If your application uses that IP for rate-limiting or whitelisting internal admin routes, the attacker bypasses all protections.
Always set 'trust proxy' to the exact number of trusted hops (e.g. 1) or specific trusted subnet CIDRs.`,
                explanation: 'Trust proxy settings dictate whether untrusted client headers can spoof identity.'
            },
            docLink: {
                title: 'Express.js Behind Proxies Guide',
                url: 'https://expressjs.com/en/guide/behind-proxies.html',
                description: 'Configuring trust proxy settings, subnet allowlists, and X-Forwarded-* headers safely.'
            }
        },
        {
            id: 'express-7',
            title: 'Hardening & Performance: Helmet, Strict CORS, HPP & Compression',
            estMinutes: 5,
            concept: {
                summary: 'Production Express hardening combines defense-in-depth and network payload optimization: Helmet establishes secure HTTP headers (CSP, HSTS, X-Content-Type-Options); HPP blocks HTTP Parameter Pollution attacks (preventing query array injection like ?role=user&role=admin); strict CORS stops unauthorized browser cross-origin requests; compression applies Gzip/Brotli to shrink JSON responses by up to 80%; and crypto.timingSafeEqual eliminates timing side-channel leaks on HMAC webhooks.',
                analogy: 'Securing and streamlining a courier convoy: bulletproof glass and locks on the trucks (Helmet and HPP), checking driver manifests at the perimeter gate (CORS), vacuum-packing parcels into a fraction of their size for rapid transit (compression), and opening safety boxes with a constant-cadence clockwork combination lock (timingSafeEqual).',
                seniorInsight: 'Without hpp(), Express automatically parses repeated query keys into an Array. If an endpoint expects a string and does req.query.sort.toLowerCase(), an array parameter crashes the Node process with TypeError: req.query.sort.toLowerCase is not a function!'
            },
            trap: {
                title: 'Wildcard CORS, missing HPP protection against array injection, or uncompressed large JSON',
                juniorCode: `// ❌ JUNIOR: Wildcard CORS, no parameter pollution check, uncompressed 2MB JSON
import cors from 'cors';

app.use(cors()); // Insecure wildcard!

app.get('/search', (req, res) => {
    // Attacker sends: /search?tag=dev&tag=admin
    // req.query.tag is now an Array ['dev', 'admin']!
    const query = req.query.tag.trim(); // 💥 CRASHES process: TypeError .trim is not a function!
    res.json(largePayload); // Uncompressed 2MB network transfer!
});`,
                seniorCode: `// ✅ SENIOR: Helmet + HPP + Compression + Strict CORS + Timing-safe comparison
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import compression from 'compression';
import crypto from 'node:crypto';

// 1. Gzip/Brotli payload compression (skips tiny responses < 1KB)
app.use(compression({
    threshold: 1024,
    filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)
}));

// 2. HTTP Security Headers
app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true
}));

// 3. HTTP Parameter Pollution defense (normalizes repeated params to last string)
app.use(hpp({ whitelist: ['filter', 'tags'] })); // whitelist safe array parameters

// 4. Strict CORS policy with explicit origin allowlist
const allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 5. Constant-time comparison for HMAC webhook signatures
export function verifySignature(signature: string, expected: string): boolean {
    const sigBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}`,
                explanation: 'hpp prevents array-injection DoS attacks on string operations. compression significantly slashes network transfer overhead, and helmet + strict CORS protects client browsers.'
            },
            drill: {
                question: 'What header does Helmet set to prevent MIME-type sniffing, and why does that matter?',
                hint: 'It tells the browser not to guess the content type.',
                solution: `X-Content-Type-Options: nosniff
Without this header, if an attacker uploads a malicious HTML/JavaScript file with a .png extension, older or lenient browsers might "sniff" the contents, interpret it as text/html, and execute it as a Cross-Site Script (XSS) attack.`,
                explanation: 'nosniff forces the browser to adhere strictly to the declared Content-Type header.'
            },
            docLink: {
                title: 'Helmet.js Security Documentation',
                url: 'https://helmetjs.github.io/',
                description: 'Official documentation for configuring HTTP response security headers in Express.'
            }
        },
        {
            id: 'express-8',
            title: 'High-Throughput File Uploads & Streaming to S3 / Cloudinary',
            estMinutes: 5,
            concept: {
                summary: 'Handling file uploads via multipart/form-data can easily exhaust server memory if files are buffered directly into RAM or disk. Senior architects stream incoming multipart chunks directly from the HTTP request into object storage (AWS S3 or Cloudinary) using stream pipes or transform streams, validating file magic numbers (signatures) instead of trusting client-supplied file extensions.',
                analogy: 'Unloading shipping containers: instead of stacking thousands of boxes inside the warehouse office until the floor collapses (RAM buffering), the crane moves boxes directly from the cargo ship onto the outbound transport truck (streaming).',
                seniorInsight: 'Never trust req.file.mimetype or the file extension sent by the browser. A malicious user can rename exploit.php or script.exe to cat.jpg. Always inspect the first 4100 bytes using file-type magic bytes.'
            },
            trap: {
                title: 'Storing multi-gigabyte uploads in memory with Multer MemoryStorage',
                juniorCode: `// ❌ JUNIOR: Buffers entire upload in server RAM before sending to S3
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); // 50 concurrent 100MB uploads = 5GB RAM -> OOM crash!

app.post('/upload', upload.single('video'), async (req, res) => {
    await s3.upload({ Bucket: 'media', Key: req.file.originalname, Body: req.file.buffer }).promise();
    res.json({ success: true });
});`,
                seniorCode: `// ✅ SENIOR: Streams multipart data directly to S3 via Upload with file-type verification
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
        }
        cb(null, true);
    }
});

app.post('/upload', upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Verify magic bytes (true binary file signature):
        const detectedType = await fileTypeFromBuffer(req.file.buffer.subarray(0, 4100));
        if (!detectedType || !['jpg', 'png', 'webp'].includes(detectedType.ext)) {
            return res.status(400).json({ error: 'File content does not match expected image signature' });
        }

        const parallelUpload = new Upload({
            client: new S3Client({}),
            params: {
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: \`avatars/\${crypto.randomUUID()}.\${detectedType.ext}\`,
                Body: req.file.buffer,
                ContentType: detectedType.mime
            }
        });
        const result = await parallelUpload.done();
        res.json({ url: result.Location });
    } catch (err) {
        next(err);
    }
});`,
                explanation: 'Validating magic bytes and enforcing strict file size boundaries prevents remote code execution and disk exhaustion exploits.'
            },
            drill: {
                question: 'Why are magic bytes more trustworthy than the file extension or Content-Type header in file uploads?',
                hint: 'Who controls the Content-Type header sent in an HTTP POST request?',
                solution: `The Content-Type header and file extension are entirely controlled by the client/attacker and can be forged trivially with curl or Postman:
curl -F "file=@malicious.exe;type=image/jpeg" https://api.com/upload

Magic bytes are the actual binary header sequences permanently embedded into the very first bytes of the file itself (e.g. FF D8 FF for JPEG, 89 50 4E 47 for PNG). Inspecting the file buffer reveals what the file truly is, regardless of its filename.`,
                explanation: 'True file identification requires reading binary signatures rather than unverified client metadata.'
            },
            docLink: {
                title: 'AWS SDK for JavaScript v3: Upload Stream Guide',
                url: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/',
                description: 'High-throughput multipart streaming with automatic concurrency and memory tuning.'
            }
        },
        {
            id: 'express-9',
            title: 'Structured JSON Logging & Correlation IDs with Pino-Http',
            estMinutes: 5,
            concept: {
                summary: 'Standard console.log statements are synchronous, lack context, and print unstructured strings that cannot be indexed by log aggregators (Datadog, Grafana Loki, CloudWatch). Production backends use high-performance asynchronous structured loggers like Pino to output single-line JSON with correlation IDs (x-request-id) and automatic redaction of sensitive fields (passwords, tokens, card numbers).',
                analogy: 'A black-box flight recorder: instead of random handwritten post-it notes, every flight event is timestamped, categorized with an exact flight ID, and formatted so automated diagnostics can query it in seconds.',
                seniorInsight: 'Pino is up to 5x faster than Winston because it minimizes serialization overhead and writes directly to process.stdout without blocking the Node.js event loop.'
            },
            trap: {
                title: 'Using console.log or logging sensitive credentials in plain text',
                juniorCode: `// ❌ JUNIOR: Slow synchronous console logging leaking user passwords to logs
app.post('/api/login', (req, res) => {
    console.log('User login request received:', req.body); // Leaks plaintext password into CloudWatch!
    res.json({ ok: true });
});`,
                seniorCode: `// ✅ SENIOR: Structured Pino logging with automatic PII redaction and request correlation
import pino from 'pino';
import pinoHttp from 'pino-http';
import crypto from 'node:crypto';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: ['req.headers.authorization', 'req.body.password', 'req.body.token', 'req.body.creditCard'],
        censor: '[REDACTED]'
    }
});

export const httpLogger = pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    }
});

// app.use(httpLogger); in server setup
// Logs structured JSON: {"level":30,"time":1710000000,"reqId":"abc-123","msg":"User logged in"}`,
                explanation: 'Correlating every log with an x-request-id allows engineers to filter millions of log lines down to the exact lifecycle of a single user request across distributed microservices.'
            },
            drill: {
                question: 'Why should you avoid using console.log() in high-throughput Node.js microservices?',
                hint: 'Consider whether console.log writes synchronously or asynchronously in Node.js when outputting to files or pipes.',
                solution: `In Node.js, console.log() is synchronous when writing to stdout in terminal environments or when piped to a file/process on Windows and Linux under certain conditions.
Synchronous I/O blocks the event loop until the string is completely written, significantly degrading throughput and multiplying request latency under high loads.`,
                explanation: 'Structured loggers like Pino use buffered, non-blocking stream writers to prevent event loop stalls.'
            },
            docLink: {
                title: 'Pino High Performance Node.js Logger Documentation',
                url: 'https://getpino.io/#/docs/benchmarks',
                description: 'Benchmarks and architectural guide for non-blocking structured JSON logging.'
            }
        },
        {
            id: 'express-10',
            title: 'RESTful API Standards, Status Codes & Idempotency Keys',
            estMinutes: 5,
            concept: {
                summary: 'Production REST APIs adhere to precise HTTP semantics: GET/HEAD/PUT/DELETE must be idempotent (calling them multiple times produces the exact same server state). For non-idempotent mutations like payment creation (POST), clients pass an Idempotency-Key header. The server records the key in Redis while processing: if a network glitch triggers a retry, the server returns the cached response rather than double-charging.',
                analogy: 'Ordering an item online: if your internet disconnects right as you click "Pay $50", clicking the button again should not charge your credit card a second time—the checkout system recognizes your order token (Idempotency Key) and prevents duplicate charges.',
                seniorInsight: 'Use 201 Created for resource generation, 204 No Content for successful deletions with no response body, and 409 Conflict when a resource already exists or violates a state lock.'
            },
            trap: {
                title: 'Returning 200 OK for everything or processing duplicate POST charges on network retries',
                juniorCode: `// ❌ JUNIOR: Returns 200 for errors, creates duplicate transactions on network retry
app.post('/api/charges', async (req, res) => {
    // If client network drops before receiving response, client retries -> customer charged twice!
    const charge = await paymentGateway.charge(req.body.amount);
    res.status(200).json({ success: true, charge });
});`,
                seniorCode: `// ✅ SENIOR: Enforces Idempotency-Key header backed by Redis atomic locks
app.post('/api/charges', async (req, res, next) => {
    const idempotencyKey = req.headers['idempotency-key'] as string;
    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Missing Idempotency-Key header' });
    }

    const redisKey = \`idempotency:\${idempotencyKey}\`;
    
    // Acquire lock or return existing cached response
    const cachedResponse = await redis.get(redisKey);
    if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
    }

    // Set processing flag with 60-second TTL
    const acquired = await redis.set(redisKey, JSON.stringify({ status: 'PROCESSING' }), 'EX', 60, 'NX');
    if (!acquired) {
        return res.status(409).json({ error: 'Concurrent request in progress for this key' });
    }

    try {
        const charge = await paymentGateway.charge(req.body.amount);
        const responseData = { success: true, chargeId: charge.id, amount: charge.amount };

        // Cache completed result for 24 hours
        await redis.set(redisKey, JSON.stringify(responseData), 'EX', 86400);
        return res.status(201).json(responseData);
    } catch (err) {
        await redis.del(redisKey); // Release lock on failure
        next(err);
    }
});`,
                explanation: 'The Idempotency Key pattern guarantees that payment operations, booking reservations, and order dispatches are executed exactly once, regardless of client retries or network interruptions.'
            },
            drill: {
                question: 'Which HTTP methods are required by the HTTP/1.1 specification to be idempotent?',
                hint: 'Does repeating a DELETE request change the server state more than the first DELETE request?',
                solution: `GET, HEAD, OPTIONS, PUT, and DELETE are idempotent.
- GET/HEAD/OPTIONS do not change server state.
- PUT replaces the target entity entirely (putting the exact same state 10 times results in the same final state).
- DELETE deletes the entity (deleting an already deleted entity leaves it in a deleted state).

POST and PATCH are NOT inherently idempotent.`,
                explanation: 'Idempotency means that the side-effects of N > 0 identical requests are the same as for a single request.'
            },
            docLink: {
                title: 'IETF RFC 9110: HTTP Semantics & Method Definitions',
                url: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2',
                description: 'The authoritative specification on safe and idempotent HTTP method behaviors.'
            }
        },
        {
            id: 'express-11',
            title: 'Background Queues & Task Decoupling with BullMQ & Redis',
            estMinutes: 5,
            concept: {
                summary: 'Slow, unpredictable operations (dispatching emails, generating invoices, transcoding media, retrying webhooks) must never execute synchronously within the HTTP request cycle. Production backends offload tasks to Redis-backed queues like BullMQ. The Express route enqueues the job and immediately returns 202 Accepted. An isolated worker process picks up the task asynchronously with concurrency controls, automatic exponential backoff retries, and dead-letter queue (DLQ) tracking.',
                analogy: 'A postal dispatch depot: the counter clerk does not wait for an airplane to cross the ocean to deliver a parcel before serving the next customer; they immediately drop the parcel into an outbound sorting bin (Queue) and hand the customer a tracking receipt (Job ID).',
                seniorInsight: 'Always configure exponential backoff retry policies and set removeOnComplete and removeOnFail limits in BullMQ. If omitted, completed jobs accumulate indefinitely in Redis memory, eventually crashing your Redis instance.'
            },
            trap: {
                title: 'Awaiting slow external I/O or background processing directly inside Express handlers',
                juniorCode: `// ❌ JUNIOR: Blocking HTTP handler on external email API
app.post('/api/register', async (req, res) => {
    const user = await db.user.create({ data: req.body });
    
    // 💥 If SendGrid/SMTP hangs or times out, the client waits 30s or gets a 504 error!
    await emailService.sendWelcomeEmail(user.email);
    
    res.status(201).json({ user });
});`,
                seniorCode: `// ✅ SENIOR: Express producer + isolated BullMQ worker with retry policies
import { Queue, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';

// 1. Queue producer initialized in Express app:
export const emailQueue = new Queue('email-queue', { connection: redisConnection });

app.post('/api/register', async (req, res, next) => {
    try {
        const user = await db.user.create({ data: req.body });

        // Enqueue background task with auto-retry and TTL retention
        const job = await emailQueue.add('send-welcome', {
            userId: user.id,
            email: user.email
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: 1000, // Keep last 1,000 completed jobs
            removeOnFail: 5000       // Keep failed jobs for inspection
        });

        // Instant response in ~10ms
        res.status(202).json({
            success: true,
            message: 'User registered. Welcome email queued for delivery.',
            jobId: job.id
        });
    } catch (err) {
        next(err);
    }
});

// 2. Worker runner in a separate worker process/pod:
export const emailWorker = new Worker('email-queue', async (job) => {
    await emailService.sendWelcomeEmail(job.data.email);
}, {
    connection: redisConnection,
    concurrency: 5 // Process up to 5 emails in parallel
});`,
                explanation: 'Decoupling slow tasks using BullMQ guarantees sub-50ms HTTP responses, isolates server load, and automatically retries transient network failures without dropping user requests.'
            },
            drill: {
                question: 'Why should BullMQ worker consumers run in a dedicated process separate from the Express HTTP server in production?',
                hint: 'Consider how high CPU spikes or unhandled worker crashes affect incoming HTTP requests.',
                solution: `Process isolation and horizontal scaling:
1. If a background worker performs a CPU-intensive task or encounters an uncaught exception, running it inside the Express process will block the event loop or crash the entire web server, dropping active user connections.
2. In production (Docker/Kubernetes), web pods can scale based on HTTP request volume, while queue worker pods scale independently based on queue depth (backlog size).`,
                explanation: 'Separating HTTP producers from queue consumers ensures maximum web server availability and fault tolerance.'
            },
            docLink: {
                title: 'BullMQ Official Documentation & Architecture',
                url: 'https://docs.bullmq.io/',
                description: 'The authoritative guide for Redis-backed background queues, workers, repeatable jobs, and flow control.'
            }
        },
        {
            id: 'express-12',
            title: 'Router Modularity & E2E Route Testing with Supertest',
            estMinutes: 5,
            concept: {
                summary: 'Production Express architectures avoid monolithic single-file route lists. Routes are decomposed into modular domain routers (`express.Router()`) and decoupled from server lifecycle code (`app.listen()`). This separation allows testing frameworks (Supertest with Vitest/Jest) to test HTTP routes, headers, status codes, and middlewares in-memory without binding to an actual network port.',
                analogy: 'A wind tunnel test on a car chassis: you can test aerodynamic drag, sensor response, and door latches in an isolated testing rig without having to drive the vehicle onto an actual public highway.',
                seniorInsight: 'Never call app.listen() inside the same file that exports your Express application. Export app from app.ts for testing with Supertest, and import it into server.ts to call listen().'
            },
            trap: {
                title: 'Binding app.listen() in the main file, breaking parallel test runners',
                juniorCode: `// ❌ JUNIOR: app.listen() inside app.ts
const app = express();
// Routes...
app.listen(3000); // 💥 Running Jest with 8 parallel worker threads causes "EADDRINUSE: address already in use :::3000"!
export default app;`,
                seniorCode: `// ✅ SENIOR: app.ts exported for tests, server.ts for network listening
// 1. app.ts (pure middleware & routing):
import express from 'express';
import { usersRouter } from './routes/users';

export const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

// 2. server.ts (production entry point):
// import { app } from './app';
// app.listen(process.env.PORT || 3000);

// 3. users.test.ts (runs in-memory via Supertest without opening real ports):
import request from 'supertest';
import { app } from '../app';

describe('GET /api/users', () => {
    it('returns 200 and list of active users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', 'Bearer valid_token');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.users)).toBe(true);
    });
});`,
                explanation: 'Separating app configuration from network listeners enables blazing fast in-memory integration testing with zero port conflicts.'
            },
            drill: {
                question: 'Why does Supertest not require your Express application to be running on an active port (e.g. localhost:3000)?',
                hint: 'How does Supertest interface with the Node.js http.Server object?',
                solution: `Supertest passes the Express "app" function directly to Node.js internal http.createServer(app) and executes requests using in-memory socket abstractions.
It sends HTTP requests directly to the request listener without making real TCP socket connections over the operating system network stack.`,
                explanation: 'In-memory execution makes Supertest test suites run orders of magnitude faster without network flakiness.'
            },
            docLink: {
                title: 'Express.js Routing Guide: express.Router',
                url: 'https://expressjs.com/en/guide/routing.html',
                description: 'Creating modular, mountable route handlers with express.Router.'
            }
        }
    ]
};
