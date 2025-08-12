# SidelineCover (MVP)

Next.js 14 + Prisma MVP for your Ireland-focused marketplace connecting **clubs** and **CORU-verified physios**.

## Features
- Role-based auth (Club, Physio, Admin) via NextAuth (Credentials)
- Physio onboarding with CORU number + ID upload + headshot
- Club onboarding with official email + phone
- Clubs post jobs with coordinates (lat/lng)
- Map of Ireland (Leaflet + OSM) with job pins
- Physios can accept jobs after admin verification
- SQLite for local dev (swap to Postgres in prod)

## Quick start
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000

### Create an admin (dev only)
```bash
curl -X POST http://localhost:3000/api/dev/seed
```

## Production notes
- Move uploads to S3 / R2 (local `/public/uploads` is for dev only)
- Switch DB to Postgres
- Add Stripe payments / escrow
- Add messaging, notifications, ratings, and audit logs
- Replace credentials with passwordless email; add rate limiting / 2FA for admin
