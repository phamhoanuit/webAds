import { list } from '@vercel/blob';

export default async function handler(req, res) {
  const blobs = await list({ prefix: 'ads/' });

  if (!blobs.blobs.length) {
    return res.status(200).json({ url: null });
  }

  const latest = blobs.blobs.sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
  )[0];

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ url: latest.url });
}
