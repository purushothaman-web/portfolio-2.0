import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createCanvas } from '@napi-rs/canvas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'purushothaman-web';

// ─── In-Memory Cache ────────────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function setCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

// ─── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['https://purushoth.is-a.dev', 'http://localhost:5173', 'http://localhost:4173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ─── GitHub Helpers ──────────────────────────────────────────────────────────
const githubFetch = async (path) => {
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
};

const graphqlFetch = async (query, variables = {}) => {
  if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not configured');
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);
  return res.json();
};


// ─── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Single GitHub endpoint to match Vercel function behavior
app.get('/api/github', async (req, res) => {
  const type = req.query.type;
  const username = GITHUB_USERNAME;

  if (type === 'profile') {
    const cacheKey = `github_profile_${username}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    try {
      const [user, repos] = await Promise.all([
        githubFetch(`/users/${username}`),
        githubFetch(`/users/${username}/repos?per_page=100&sort=updated`),
      ]);

      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      const languages = {};
      repos.forEach(r => {
        if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
      });
      const topLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([lang, count]) => ({ lang, count }));

      const payload = {
        name: user.name || user.login,
        login: user.login,
        bio: user.bio,
        avatar: user.avatar_url,
        followers: user.followers,
        following: user.following,
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

  if (type === 'contributions') {
    const cacheKey = `github_contributions_${username}`;
    const cached = getCache(cacheKey);
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
      const result = await graphqlFetch(query, { username });
      const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
      
      if (!calendar) throw new Error('Could not fetch contribution calendar');

      const contributions = calendar.weeks.flatMap(w => 
        w.contributionDays.map(d => ({
          date: d.date,
          count: d.contributionCount
        }))
      );

      const payload = { 
        contributions, 
        total: calendar.totalContributions, 
        username 
      };

      setCache(cacheKey, payload);
      return res.json(payload);
    } catch (err) {
      console.error(err);
      return res.status(502).json({ error: 'Failed to fetch contributions' });
    }
  }

  return res.status(400).json({ error: 'Missing ?type= param. Use "profile" or "contributions".' });
});

// Dynamic OG Image Generator (@napi-rs/canvas)
app.get('/api/og', async (req, res) => {
  const { title = 'Purushothaman R', desc = 'Full Stack Developer' } = req.query;
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1d3557');
  gradient.addColorStop(1, '#e63946');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 20;
  ctx.fillText(title, width / 2, height / 2 - 20);

  ctx.font = '300 40px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(desc, width / 2, height / 2 + 60);

  ctx.font = 'italic bold 24px sans-serif';
  ctx.fillStyle = 'rgba(168,218,220,0.6)';
  ctx.fillText('purushoth.is-a.dev', width / 2, height - 60);

  const buffer = await canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
});

// Geo-Analytics (ipapi.co)
app.get('/api/geo', async (req, res) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;

  try {
    const ipToLookup = (!ip || ip === '127.0.0.1' || ip === '::1') ? '' : ip;
    const url = ipToLookup ? `https://ipapi.co/${ipToLookup}/json/` : `https://ipapi.co/json/`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('GeoIP fetch failed');
    const data = await response.json();

    return res.json({
      city: data.city || 'somewhere awesome',
      region: data.region || 'Planet Earth',
      country: data.country_name || 'the Universe',
      welcomeMessage: `Welcome! Greetings to you in ${data.city || 'your city'} from Bangalore.`,
      ip: data.ip
    });
  } catch (err) {
    console.error('GeoIP lookup failed, using fallback:', err.message);
    res.json({ 
      city: 'somewhere awesome',
      region: 'Planet Earth',
      country: 'the Universe',
      welcomeMessage: 'Welcome! It is great to have you here.',
      fallback: true
    });
  }
});

// Contact form (nodemailer)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New message from ${name} via Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fff9ed;border-radius:12px">
          <h2 style="color:#1d3557;margin:0 0 24px">New Portfolio Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;font-size:13px;width:80px">From</td><td style="padding:8px 0;font-weight:600;color:#111">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#e63946">${email}</a></td></tr>
          </table>
          <div style="margin:24px 0;padding:20px;background:#fff;border-left:4px solid #e63946;border-radius:4px">
            <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap">${message}</p>
          </div>
          <p style="color:#999;font-size:12px;margin:0">Sent from purushoth.is-a.dev</p>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`✅  Portfolio backend running on port ${PORT}`);
  console.log(`   GitHub username: ${GITHUB_USERNAME}`);
});