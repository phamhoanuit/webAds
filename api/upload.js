export const config = {
  runtime: "edge",
};

import { put } from "@vercel/blob";

export default async function handler(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return new Response(JSON.stringify({ url: blob.url }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}
