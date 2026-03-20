import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for internal calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const { title = 'Purushothaman R', desc = 'Full Stack Developer' } = req.query;

  // 1200x630 is the standard OG image size
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background: Navy to Red gradient (Portfolio palette)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1d3557'); // Navy
  gradient.addColorStop(1, '#e63946'); // Red
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Subtle overlay
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(0, 0, width, height);

  // Text Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  // Render Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 80px sans-serif'; // Fallback to system sans-serif
  ctx.textAlign = 'center';
  ctx.fillText(title as string, width / 2, height / 2 - 20);

  // Render Description
  ctx.font = '300 40px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(desc as string, width / 2, height / 2 + 60);

  // Bottom branding
  ctx.font = 'italic bold 24px sans-serif';
  ctx.fillStyle = 'rgba(168,218,220,0.6)'; // Minty light blue
  ctx.fillText('purushoth.is-a.dev', width / 2, height - 60);

  // Return as PNG
  const buffer = await canvas.encode('png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  return res.status(200).send(buffer);
}
