import { put } from '@vercel/blob';
import { Buffer } from 'buffer';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || 'image/jpeg';

    const blob = await put('ads/latest.jpg', buffer, {
      access: 'public',
      contentType,
      allowOverwrite: true
    });

    res.status(200).json({
      success: true,
      url: blob.url
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
}
