# BiotechAgro Vercel Deployment Notes

This version was converted for Vercel.

## Vercel settings

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 22.x

## What changed

- Added `api/index.ts` as a Vercel serverless API function.
- Added `vercel.json` rewrites so existing frontend calls like `/api/content`, `/api/messages`, `/api/auth/login`, `/api/products/...`, and `/api/assistant` keep working.
- Changed the build script to `vite build` only, removing the old `server.ts` CommonJS bundle that caused the `import.meta` warning.

## Environment variables to add in Vercel

Required for AI assistant:

- `GEMINI_API_KEY`

Recommended for security:

- `SESSION_SECRET`

Required for real email sending:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Important database note

The current project uses `src/db/db.json` as a JSON database. On Vercel, serverless functions cannot persist file changes permanently inside the deployed source tree. This conversion seeds a temporary writable database in `/tmp` so the API can run, but admin-panel edits may reset after cold starts or redeploys.

For production, move the database to a real persistent service such as Vercel Postgres, Supabase, Firebase Firestore, or MongoDB Atlas.
