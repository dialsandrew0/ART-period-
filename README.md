# ArtPeriod

> Where art meets obsession. A full-stack platform for discovering, tracking, and collecting fine art — built for speed, scale, and taste.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | GSAP 3 + @gsap/react |
| State | Zustand 5 |
| Database ORM | Prisma 6 |
| Runtime | React 19 |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- A PostgreSQL database (local or hosted)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/dialsandrew0/ART-period-.git
cd ART-period-

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp next-env.d.ts .env.local
# Add your DATABASE_URL in .env.local

# 4. Generate Prisma client
npx prisma generate

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see ArtPeriod running.

---

## Project Structure

```
ART-period-/
├── app/                  # Next.js App Router pages and layouts
│   ├── layout.tsx        # Root layout (fonts, global styles)
│   └── page.tsx          # Home page
├── prisma/               # Database schema and migrations
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── DEPLOYMENT.md         # Deployment guide
```

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

Quick deploy to Vercel:
1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables
4. Deploy

---

## Roadmap

- [ ] Artist profiles and portfolios
- [ ] Artwork discovery feed with filters
- [ ] Collection management dashboard
- [ ] Auction and pricing intelligence
- [ ] AI-powered artwork analysis
- [ ] Collector-to-collector marketplace

---

## License

Private — all rights reserved.
