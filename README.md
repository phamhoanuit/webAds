# Vercel Blob Admin + Frontend (no-password)

This project provides:
- `admin.html` - simple admin page to upload images to Vercel Blob (no password).
- `index.html` - public advertising page which fetches the latest image from Blob and displays it.
- Serverless API routes (`/api/upload` and `/api/latest`) using `@vercel/blob`.

## Setup (steps)

1. Create a **Blob Store** in your Vercel Project:
   - Go to your Project -> Storage -> Connect -> Blob -> Create Blob store.
   - When creating, note the environment variable name that Vercel suggests (e.g. `VERCEL_BLOB_<STORE>`). It will create a read-write token for you in Project Settings.

2. In your Vercel Project Settings -> Environment Variables, ensure the Blob token environment variable exists for `Preview` and `Production`.

3. Deploy:
   - Zip the project or push to a Git repo and import to Vercel.
   - Vercel will install `@vercel/blob` dependency and deploy serverless functions.

4. Use:
   - Open `/admin.html`, choose an image, click Upload.
   - Open the public URL (`/`) to see the advertising page. It will fetch `/api/latest` for the latest image.

## Notes & Troubleshooting

- The `@vercel/blob` SDK returns different structures depending on versions. If the returned JSON doesn't contain `url`, check the uploaded `blob` JSON in the server response and adapt `index.html` accordingly.
- This project intentionally has **no password** on admin page. Protect the admin URL via Vercel Password Protection or restrict by a secret if needed.
- If you get permission errors, ensure the Blob token has read-write permissions and is available to your Functions.

