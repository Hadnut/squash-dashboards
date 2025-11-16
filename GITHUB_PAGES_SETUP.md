# GitHub Pages Deployment Guide

## Prerequisites

✅ You've completed the Supabase setup (see `SUPABASE_SETUP.md`)
✅ Your app works locally with `npm run dev`
✅ You have a GitHub account

## Step 1: Update Vite Configuration

Your `vite.config.ts` needs to know the base URL for GitHub Pages.

1. Open `vite.config.ts`
2. Add the `base` property:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/squash-dashboards/', // Replace with your repo name
})
```

**Important**: Replace `squash-dashboards` with your actual repository name!

## Step 2: Add GitHub Secrets

Your Supabase credentials need to be securely stored in GitHub:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL (from `.env.local`)

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key (from `.env.local`)

## Step 3: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**

## Step 4: Deploy!

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already set up.

### Option A: Push to trigger deployment

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin master
```

### Option B: Manual deployment

1. Go to **Actions** tab in your repo
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow**

## Step 5: Access Your App

After deployment completes (1-2 minutes):

1. Go to **Settings** → **Pages**
2. You'll see: "Your site is live at https://YOUR_USERNAME.github.io/squash-dashboards/"
3. Click the link to view your app!

## Troubleshooting

### 404 Error / Blank Page

- Check that the `base` in `vite.config.ts` matches your repo name
- Make sure it starts and ends with `/` like `/squash-dashboards/`

### Build Fails

- Check GitHub Actions logs in the **Actions** tab
- Verify your secrets are correctly set
- Make sure all dependencies are in `package.json` (not just `package-lock.json`)

### Data Not Loading

- Check browser console for errors
- Verify Supabase URL/key are correct in GitHub Secrets
- Check Supabase RLS policies are set (see `SUPABASE_SETUP.md`)

## Updating Your App

Every time you push to the `master` branch, GitHub Actions will automatically:
1. Build your app
2. Deploy to GitHub Pages
3. Update your live site

No manual steps needed! 🎉

## Custom Domain (Optional)

Want a custom domain like `squash.yourdomain.com`?

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Follow GitHub's DNS configuration instructions
