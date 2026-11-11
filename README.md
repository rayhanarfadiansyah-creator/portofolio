# Dynamic Personal Portfolio

A clean, responsive portfolio built with Next.js App Router, Tailwind CSS, Supabase Auth and PostgreSQL.

## Included
- Public portfolio homepage with profile, status, journey, projects and contact sections.
- Private `/login` and protected `/admin` dashboard.
- Edit profile and student/graduated/working/freelancer status.
- Add and delete projects.
- Upload, replace, and remove a public downloadable CV (PDF, max 8 MB) from the admin dashboard.
- Edit the WhatsApp number; the public site displays a direct WhatsApp chat button.
- Scroll-triggered reveal animations on the hero, page sections, and project cards, with reduced-motion support.
- Supabase Row Level Security policies.
- Starter content placeholders (replace with your own details).

## Requirements
- Node.js 20+
- A Supabase project

## Run locally
```bash
npm install
cp .env.example .env.local
```
Fill `.env.local` with the Project URL and anon/publishable key from Supabase, then run:
```bash
npm run dev
```
Open http://localhost:3000.

## Supabase setup
1. Create a Supabase project.
2. For a fresh database, run `supabase/schema.sql`. If you already ran the earlier portfolio schema, run only `supabase/migrations/20261111_cv_whatsapp.sql` in Supabase SQL Editor (do not rerun the original schema, because its existing table policies may already exist).
3. In Authentication > Users, create your private admin user.
4. Copy the Project URL and anon/publishable key into `.env.local`.
5. Restart the Next.js dev server.
6. Sign in at `/login`, then edit your profile at `/admin`.

## CV and WhatsApp settings
1. Sign in at `/login`, then open `/admin`.
2. Enter your WhatsApp number in international format using digits only, e.g. `6281234567890`.
3. Choose a PDF in the CV field and save the profile. A new upload replaces the previous CV. Tick the remove checkbox and save to remove it.
4. The public portfolio shows a CV download link and a WhatsApp chat button when those fields are configured.

## Image upload
This starter accepts an externally hosted image URL for project images. For production, create a Supabase Storage bucket (for example `portfolio-media`) and implement authenticated uploads with file type/size validation. Do not make an admin-only upload bucket public-write.

## Deploy to Vercel
1. Push this project to a private or public Git repository.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy.
5. Add your production domain to Supabase Auth > URL Configuration.

## Security notes
- Do not expose a Supabase service-role key in browser code or `NEXT_PUBLIC_*` variables.
- Keep Row Level Security enabled.
- Create admin accounts manually in Supabase; do not add public sign-up.
- Review and test policies before publishing.

## Current starter limitations
- Profile image upload UI is not implemented yet; the CV upload flow is implemented.
- Experience and skills tables/management screens are not included yet.
- Add project currently accepts an image URL; Supabase Storage upload is the next implementation step.
- Add server-side validation, URL allowlisting where appropriate, upload limits, and friendly success/error feedback before production use.
