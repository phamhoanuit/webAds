import Busboy from "busboy";
import { put } from "@vercel/blob";

export const config = { runtime: "nodejs20" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const bb = Busboy({ headers: req.headers });

    const url = await new Promise((resolve, reject) => {
      bb.on("file", async (name, file, info) => {
        const { filename } = info;
        const newName = `${Date.now()}-${filename}`;

        try {
          const blob = await put(newName, file, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          resolve(blob.url || blob.publicUrl || null);
        } catch (err) {
          reject(err);
        }
      });

      bb.on("error", (err) => reject(err));
      req.pipe(bb);
    });

    if (!url) return res.status(500).json({ error: "Upload returned no URL" });
    return res.status(200).json({ url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ error: String(err) });
  }
};
