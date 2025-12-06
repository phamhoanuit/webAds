import { list } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const result = await list();

    const items = result.blobs || [];

    // sắp xếp theo thời gian upload mới nhất
    items.sort((a, b) => {
      return (b.uploadedAt || 0) - (a.uploadedAt || 0);
    });

    if (items.length === 0) {
      return res.status(404).json({ error: "No images uploaded" });
    }

    return res.status(200).json({ url: items[0].url });
  } catch (err) {
    console.error("LATEST ERROR:", err);
    return res.status(500).json({ error: String(err) });
  }
}
