// Serverless function to list blobs and return the latest public URL
// Uses '@vercel/blob' SDK's list function
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    // list blobs, descending order (SDK may support cursor/pagination)
    const items = await list();
    // items is expected to be array of { key, url?, createdAt? }
    if (!items || items.length === 0) {
      res.json({ url: null });
      return;
    }
    // sort by createdAt if exists, else by key
    items.sort((a,b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    const latest = items[0];
    const url = latest.url || latest.publicUrl || latest.path || latest.key || null;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
