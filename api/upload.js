import { put } from '@vercel/blob';


export const config = {
api: { bodyParser: false }
};


export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).end('Method Not Allowed');
}


try {
const contentType = req.headers['content-type'];


const blob = await put('ads/latest.jpg', req, {
access: 'public',
contentType
});


res.status(200).json({
success: true,
url: blob.url
});
} catch (e) {
res.status(500).json({
success: false,
error: e.message
});
}
}