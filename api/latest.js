import { list } from "@vercel/blob";

export const config = { runtime: "nodejs20" };

export default async function handler(req, res) {
  try {
    const result = await list();
    const items = result && (result.blobs || result.items || []) || [];

    items.sort((a,b) => {
      const ta = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const tb = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return tb - ta;
    });

    if (!items || items.length === 0) {
      return res.status(404).json({ error: "No images uploaded" });
    }

    const latest = items[0];
    const url = latest.url || latest.publicUrl || latest.path || latest.key || null;
    return res.status(200).json({ url, blobs: items });
  } catch (err) {
    console.error("LATEST ERROR:", err);
    return res.status(500).json({ error: String(err) });
  }
};
