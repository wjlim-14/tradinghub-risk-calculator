# 🚀 Deployment Guide - InvestHub Risk Calculator

## 📂 Step 1: Push to GitHub

### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI if you haven't
# brew install gh (on macOS)

# Create GitHub repository
gh repo create investhub-risk-calculator --public --description "Multi-Market Risk Management Calculator for Global Trading"

# Push code
git remote add origin https://github.com/YOUR_USERNAME/investhub-risk-calculator.git
git push -u origin main
```

### Option B: Manual GitHub Setup
1. Go to https://github.com/new
2. Repository name: `investhub-risk-calculator`
3. Description: `Multi-Market Risk Management Calculator for Global Trading`
4. Make it **Public**
5. Click "Create repository"
6. Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/investhub-risk-calculator.git
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel (Instant Live Website)

### Option A: Automatic Deployment (Easiest)
1. Go to https://vercel.com
2. Sign up/login with your GitHub account
3. Click "Import Project"
4. Select your `investhub-risk-calculator` repository
5. Vercel will auto-detect Next.js and deploy immediately!
6. Your site will be live at: `https://investhub-risk-calculator.vercel.app`

### Option B: Manual Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: investhub-risk-calculator
# - Directory: ./
# - Override settings? No
```

## 🔐 Step 3: Environment Variables (Optional)

If you want to add Firebase later:
1. In Vercel dashboard → Settings → Environment Variables
2. Add these variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## ✅ Step 4: Test Your Live Website

Your calculator will be live at:
- **Vercel URL**: `https://investhub-risk-calculator.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/investhub-risk-calculator`

### Test These Features:
- ✅ Risk calculator works on mobile
- ✅ All market currencies display correctly  
- ✅ Lot calculations for Asian markets
- ✅ Share calculations for US market
- ✅ Responsive design on different devices

## 🎯 Step 5: Custom Domain (Optional)

1. Buy a domain (e.g., `riskcalculator.com`)
2. In Vercel → Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

## 🔄 Future Updates

Every time you push to GitHub, Vercel will automatically redeploy:
```bash
git add .
git commit -m "Add new feature"
git push origin main
# Vercel auto-deploys in ~30 seconds!
```

## 📊 Analytics & Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: Ready for your GA4 tracking ID
- **Firebase Analytics**: Ready for user behavior tracking

## 🎉 You're Live!

Your professional Risk Management Calculator is now:
- ✅ Live on the internet
- ✅ Mobile-optimized
- ✅ SEO-friendly
- ✅ Auto-deploying from GitHub
- ✅ Ready for global users

**Perfect for sharing with traders, investors, and anyone learning risk management!** 🌍📈