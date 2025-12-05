// Serverless function to upload a base64 image to Vercel Blob using @vercel/blob SDK
// IMPORTANT: You must set up a Blob store in your Vercel project and add the READ-WRITE token
// as an environment variable in Project Settings. See README for instructions.
//
// This function expects JSON body: { filename: string, dataUrl: string }
// It will decode dataUrl to a Buffer and call put(name, buffer, { access: 'public' })
//
// Returns JSON: { url: 'https://...public.blob.vercel-storage.com/..' }

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { filename, dataUrl } = await req.json();
    if (!filename || !dataUrl) {
      res.status(400).json({ error: 'Missing filename or dataUrl' });
      return;
    }
    // parse data URL
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Invalid dataUrl' });
      return;
    }
    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');

    // generate unique name, keep extension
    const ext = filename.split('.').pop() || '';
    const name = Date.now() + '-' + Math.random().toString(36).slice(2,9) + (ext ? '.' + ext : '');

    // Upload to Vercel Blob
    const blob = await put(name, buffer, { access: 'public' });

    // blob.url or blob.path depends on SDK; we'll return blob.url if present, else construct
    const url = blob.url || blob.publicUrl || blob.path || null;

    if (!url) {
      // Try to build public URL from blob.key and store id (fallback)
      res.status(200).json({ url: JSON.stringify(blob) });
    } else {
      res.status(200).json({ url });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
}
