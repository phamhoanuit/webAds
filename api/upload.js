import Busboy from "busboy";
import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const busboy = Busboy({ headers: req.headers });

  let uploadPromise = new Promise((resolve, reject) => {
    busboy.on("file", async (name, file, info) => {
      const { filename } = info;
      const newName = `${Date.now()}-${filename}`;

      try {
        const blob = await put(newName, file, {
          access: "public",
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        resolve(blob.url);
      } catch (err) {
        reject(err);
      }
    });

    busboy.on("error", (err) => reject(err));
    busboy.on("finish", () => {});
  });

  req.pipe(busboy);

  try {
    const url = await uploadPromise;
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}

export const config = {
  runtime: "nodejs20.x"
};
