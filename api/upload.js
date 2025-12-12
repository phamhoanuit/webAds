import cloudinary from "cloudinary";
import { Redis } from "@upstash/redis";

// connect Redis
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// connect Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const base64 = "data:image/jpeg;base64," + buffer.toString("base64");

  const upload = await cloudinary.v2.uploader.upload(base64, {
    folder: "vercel-images"
  });

  await redis.set("currentImage", upload.secure_url);

  return res.json({ url: upload.secure_url });
}
