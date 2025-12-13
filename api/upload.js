import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const arrayBuffer = await req.arrayBuffer();

    const contentType = req.headers['content-type'];
    const fileName = req.headers['x-file-name'] || 'latest.jpg';

    const blob = await put(`ads/latest.jpg`, arrayBuffer, {
      access: 'public',
      contentType
    });

    res.status(200).json({
      success: true,
      url: blob.url
    });
  } catch (e) {
    console.error('UPLOAD ERROR:', e);
    res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
