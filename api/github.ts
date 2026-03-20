import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DayEntry {
  date: string;
  count: number;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

// ─── In-Memory Cache (survives warm invocations) ─────────────────────────────
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data as T;
}

// ─── GitHub fetch helper ──────────────────────────────────────────────────────
async function ghFetch(path: string): Promise<unknown> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${path}`);
  return res.json();
}

async function graphqlFetch(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not configured');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);
  return res.json();
}


// ─── Handler ─────────────────────────────────────────────────────────────────
const USERNAME = process.env.GITHUB_USERNAME ?? 'purushothaman-web';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const type = req.query.type as string;

  // ── /api/github?type=profile ─────────────────────────────────────────────
  if (type === 'profile') {
    const cacheKey = `profile:${USERNAME}`;
    const cached = getCache<unknown>(cacheKey);
    if (cached) return res.json(cached);

    try {
      const [user, repos] = await Promise.all([
        ghFetch(`/users/${USERNAME}`),
        ghFetch(`/users/${USERNAME}/repos?per_page=100&sort=updated`),
      ]) as [Record<string, unknown>, Array<Record<string, unknown>>];

      const totalStars = repos.reduce((n, r) => n + ((r.stargazers_count as number) || 0), 0);
      const langMap: Record<string, number> = {};
      repos.forEach(r => {
        if (r.language) langMap[r.language as string] = (langMap[r.language as string] || 0) + 1;
      });
      const topLanguages = Object.entries(langMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => ({ lang, count }));

      const payload = {
        name: user.name ?? user.login,
        login: user.login,
        bio: user.bio,
        avatar: user.avatar_url,
        followers: user.followers,
        publicRepos: user.public_repos,
        totalStars,
        topLanguages,
        profileUrl: user.html_url,
      };

      setCache(cacheKey, payload);
      return res.json(payload);
    } catch (err) {
      console.error(err);
      return res.status(502).json({ error: 'Failed to fetch GitHub profile' });
    }
  }

  // ── /api/github?type=contributions ──────────────────────────────────────
  if (type === 'contributions') {
    const cacheKey = `contributions:${USERNAME}`;
    const cached = getCache<unknown>(cacheKey);
    if (cached) return res.json(cached);

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    try {
      const result = await graphqlFetch(query, { username: USERNAME });
      const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) throw new Error('Could not fetch contribution calendar');

      const contributions = calendar.weeks.flatMap((w: any) => 
        w.contributionDays.map((d: any) => ({
          date: d.date,
          count: d.contributionCount
        }))
      );

      const payload = { 
        contributions, 
        total: calendar.totalContributions, 
        username: USERNAME 
      };

      setCache(cacheKey, payload);
      return res.json(payload);
    } catch (err) {
      console.error(err);
      return res.status(502).json({ error: 'Failed to fetch contributions' });
    }
  }

  return res.status(400).json({ error: 'Missing ?type= param. Use "profile" or "contributions".' });
}