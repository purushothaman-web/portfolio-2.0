import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body ?? {};

  // Validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message too short.' });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials not configured');
    return res.status(500).json({ error: 'Email service not configured.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Portfolio" <${smtpUser}>`,
      to: smtpUser,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio message from ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff9ed;padding:40px;border-radius:16px">
          <div style="border-left:4px solid #e63946;padding-left:20px;margin-bottom:32px">
            <h1 style="margin:0;font-size:22px;color:#1d3557;font-weight:700">New Portfolio Message</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#888">via purushoth.is-a.dev</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.05em;width:80px">From</td>
              <td style="padding:10px 0;font-size:15px;font-weight:600;color:#1d3557">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:.05em">Reply&nbsp;to</td>
              <td style="padding:10px 0"><a href="mailto:${email}" style="color:#e63946;text-decoration:none;font-size:15px">${email}</a></td>
            </tr>
          </table>
          <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid rgba(0,0,0,.06)">
            <p style="margin:0;font-size:15px;color:#333;line-height:1.75;white-space:pre-wrap">${message.trim()}</p>
          </div>
          <p style="margin:24px 0 0;font-size:12px;color:#bbb;text-align:center">Hit reply to respond directly to ${name}.</p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Nodemailer error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}