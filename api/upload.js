import { put } from '@vercel/blob';
import { Buffer } from 'buffer';

export const config = {
  api: { bodyParser: false }
};

let latestUrl = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers['content-type'] || 'image/jpeg';
    const fileName = `ads/${Date.now()}.jpg`;

    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType
    });

    latestUrl = blob.url;

    res.status(200).json({
      success: true,
      url: blob.url
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
