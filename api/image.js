import { Redis } from "@upstash/redis";

// Redis
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export default async function handler(req, res) {
  const url = await redis.get("currentImage");
  return res.json({ url });
}
