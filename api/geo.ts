import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // Get IP from Vercel headers or socket
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;

  try {
    // If local or no IP, use the server's IP for demonstration
    const ipToLookup = (!ip || ip === '127.0.0.1' || ip === '::1') ? '' : ip;
    const url = ipToLookup ? `https://ipapi.co/${ipToLookup}/json/` : `https://ipapi.co/json/`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('GeoIP fetch failed');
    
    const data = await response.json();

    const payload = {
      city: data.city || 'somewhere awesome',
      region: data.region || 'Planet Earth',
      country: data.country_name || 'the Universe',
      welcomeMessage: `Welcome! Greetings to you in ${data.city || 'your city'} from Bangalore.`,
      ip: data.ip
    };

    return res.status(200).json(payload);
  } catch (err) {
    console.error('GeoIP error:', err);
    return res.status(200).json({ 
      city: 'somewhere awesome',
      region: 'Planet Earth',
      country: 'the Universe',
      welcomeMessage: 'Welcome! It is great to have you here.',
      fallback: true
    });
  }
}
