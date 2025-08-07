# Deployment Instructions

## Step 1: Create GitHub Repository
1. Go to GitHub.com
2. Click "New repository"
3. Name: `bound-ai-dashboard`
4. Make it **Public**
5. Don't initialize with README (we already have code)
6. Click "Create repository"

## Step 2: Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/bound-ai-dashboard.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Digital Ocean App Platform
1. Go to Digital Ocean control panel
2. Go to "Apps" section
3. Click "Create App"
4. Choose "GitHub" as source
5. Select your `bound-ai-dashboard` repository
6. Choose branch: `main`
7. Choose source directory: `/` (root)
8. App info:
   - Name: `bound-ai-dashboard`
   - Region: Choose closest to your users
9. Environment Variables (add these):
   - `NEXT_PUBLIC_N8N_BASE_URL=https://agents.bound.work`
   - `NEXT_PUBLIC_SUPABASE_URL=https://bqkdmozyarxhcwavvuih.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 4: Configure Build Settings
- Build Command: `npm run build`
- Run Command: `npm start`
- Node Version: 18.x or 20.x

## Step 5: Deploy
Click "Create Resources" and wait for deployment!

Your app will be available at: `https://your-app-name-xxxxx.ondigitalocean.app`