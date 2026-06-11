# 🎬 Creator OS

> An AI-powered content workspace built for YouTube creators — from idea to published, all in one place.

![Creator OS Banner](https://placehold.co/1200x400/0a0a0f/a855f7?text=Creator+OS+—+AI+Content+Workspace)

---

## 📌 Overview

**Creator OS** is a full-stack SaaS application that helps YouTube creators streamline their content workflow using AI. Generate scripts with a single prompt, repurpose content across platforms, analyze competitors, and manage your content calendar — all from one dark-themed, creator-focused dashboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Idea Engine** | AI-generated video ideas based on your niche and trending topics |
| ✍️ **Script Writer** | Full YouTube scripts generated via Groq (LLaMA 3.3 70B) in seconds |
| 🔄 **Repurpose Studio** | Turn scripts into Twitter threads, LinkedIn posts, and email newsletters |
| 📅 **Content Calendar** | Plan and schedule your content with a visual calendar |
| 📊 **Analytics** | Track views, engagement, and growth using YouTube Data API |
| 🔍 **Competitor Analysis** | Analyze competitor channels and uncover content gaps |

---

## 🛠 Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Nova theme)

**Backend**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [NextAuth.js](https://next-auth.js.org/) (Google OAuth)
- [Prisma v5.22](https://www.prisma.io/) ORM
- [PostgreSQL](https://www.postgresql.org/)

**AI & APIs**
- [Groq API](https://groq.com/) — LLaMA 3.3 70B for script generation
- [YouTube Data API v3](https://developers.google.com/youtube/v3) — Channel analytics

**Deployment**
- [Vercel](https://vercel.com/) (Frontend + API)
- [Neon](https://neon.tech/) / [Supabase](https://supabase.com/) (PostgreSQL)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- Google Cloud project with OAuth 2.0 credentials
- Groq API key
- YouTube Data API v3 key

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/creator-os.git
cd creator-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/creator_os"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI
GROQ_API_KEY="your-groq-api-key"

# YouTube
YOUTUBE_API_KEY="your-youtube-api-key"
```

### 4. Set up the database

```powershell
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
creator-os/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth handlers
│   │   ├── scripts/       # Script generation & management
│   │   └── youtube/       # YouTube Data API
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Auth page
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   └── dashboard/         # Dashboard-specific components
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   └── groq.ts            # Groq API client
├── prisma/
│   └── schema.prisma      # Database schema
├── proxy.ts               # Route protection (replaces middleware)
└── .env.local             # Environment variables
```

---

## 🔐 Auth Notes

- Authentication is handled by **NextAuth.js** with Google OAuth provider.
- Route protection uses `proxy.ts` (instead of `middleware.ts`) for Next.js 16 compatibility.
- Protected routes: `/dashboard/*`

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local`
4. Update `NEXTAUTH_URL` to your Vercel deployment URL
5. Deploy!

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

---
