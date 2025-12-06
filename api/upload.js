import { put } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: String(err) });
  }
}
