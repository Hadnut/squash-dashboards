# 🎯 Quick Start Guide - Squash Dashboards

Your app is now configured to use **Supabase** (database) and **GitHub Pages** (hosting) so multiple people can use it!

## 📋 What You Need to Do

### 1️⃣ Setup Supabase Database (5-10 minutes)

Follow the detailed instructions in **`SUPABASE_SETUP.md`**

Quick summary:
- Create tables in Supabase SQL Editor
- Get your Project URL and API key
- Create `.env.local` file with your credentials

### 2️⃣ Test Locally

```bash
npm run dev
```

Open http://localhost:5173 and test:
- ✅ Create a match day
- ✅ Add matches
- ✅ View leaderboard
- ✅ Check that data persists after refresh

### 3️⃣ Deploy to GitHub Pages (5 minutes)

Follow the detailed instructions in **`GITHUB_PAGES_SETUP.md`**

Quick summary:
- Add Supabase credentials to GitHub Secrets
- Enable GitHub Pages in repository settings
- Push to `master` branch (auto-deploys)

## 🎉 That's It!

After deployment, your app will be live at:
```
https://YOUR_USERNAME.github.io/squash-dashboards/
```

**Multiple people can access it, and everyone will see the same data in real-time!**

## 📁 Files Created

- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `src/services/database.ts` - Database operations (CRUD)
- ✅ `src/types/database.ts` - TypeScript types for database
- ✅ `.github/workflows/deploy.yml` - Auto-deployment workflow
- ✅ `.env.example` - Environment variables template
- ✅ `SUPABASE_SETUP.md` - Detailed Supabase instructions
- ✅ `GITHUB_PAGES_SETUP.md` - Detailed deployment instructions

## 🔧 Changes Made

- ✅ Installed `@supabase/supabase-js`
- ✅ Updated `App.tsx` to use Supabase instead of localStorage
- ✅ Added real-time data synchronization
- ✅ Added loading and error states
- ✅ Configured for GitHub Pages deployment

## 🚀 Features

- ✅ **Multi-user**: Everyone sees the same data
- ✅ **Real-time**: Changes sync automatically
- ✅ **Persistent**: Data stored in cloud database
- ✅ **Free hosting**: GitHub Pages
- ✅ **Free database**: Supabase free tier

## ❓ Need Help?

1. **Database issues** → See `SUPABASE_SETUP.md`
2. **Deployment issues** → See `GITHUB_PAGES_SETUP.md`
3. **Local dev issues** → Check console for errors

## 🔐 Important Notes

- ⚠️ **NEVER commit `.env.local`** - It contains secrets!
- ✅ `.env.local` is already in `.gitignore`
- ✅ Use GitHub Secrets for deployment
- ✅ Current setup allows public read/write (no authentication)

If you want to add user authentication later, you can enable Supabase Auth!
