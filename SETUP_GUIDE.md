# MedVault Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Drive API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. Create **OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "MedVault"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Click "Create"
   - **Copy your Client ID** (looks like `xxx.apps.googleusercontent.com`)

5. Create **API Key** (optional, but recommended):
   - Click "Create Credentials" → "API key"
   - **Copy your API Key**

### Step 2: Local Development Setup

```bash
# 1. Navigate to project
cd medvault

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local
# Add your Google credentials:
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here

# 5. Start development server
npm run dev

# 6. Open browser at http://localhost:5173
```

### Step 3: Test It Out

1. Click "Get Started with Google"
2. Sign in with your Google account
3. Grant permissions (drive.file, drive.metadata.readonly, drive.folders)
4. You should see your Google Drive folders!

---

## 🌐 Production Deployment (Cloudflare Pages)

### Why Cloudflare Pages?
- ✅ Free unlimited bandwidth
- ✅ Global CDN (300+ locations)
- ✅ Auto-deploy from Git
- ✅ Free SSL certificates
- ✅ Zero configuration needed

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/medvault.git
   git push -u origin main
   ```

2. **Connect Cloudflare Pages**:
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create a project"
   - Connect your GitHub account
   - Select your `medvault` repository
   - Build settings:
     - **Framework preset**: Vite
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click "Save and Deploy"

3. **Add Environment Variables**:
   - In Cloudflare Pages dashboard, go to "Settings" → "Environment variables"
   - Add:
     - `VITE_GOOGLE_CLIENT_ID` = your-client-id
     - `VITE_GOOGLE_API_KEY` = your-api-key
   - Save and redeploy

4. **Update Google OAuth**:
   - Go back to Google Cloud Console
   - Update OAuth redirect URIs:
     - Add your Cloudflare Pages URL (e.g., `https://medvault.pages.dev`)

5. **Done!** Your app is live at `https://your-project.pages.dev`

---

## 📱 Testing on Mobile

### Option 1: Deploy to Cloudflare (Recommended)
- Follow deployment steps above
- Open the Cloudflare URL on your mobile device
- Camera features will work because it's HTTPS

### Option 2: Local Testing with ngrok
```bash
# 1. Install ngrok (if not installed)
npm install -g ngrok

# 2. Start your dev server
npm run dev

# 3. In a new terminal, expose it
ngrok http 5173

# 4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# 5. Update Google OAuth redirect URIs with the ngrok URL
# 6. Open the ngrok URL on your mobile device
```

---

## 🔧 Common Issues & Solutions

### Issue: "Failed to initialize authentication"
**Solution:**
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly in `.env.local`
- Verify the redirect URI is authorized in Google Cloud Console
- Clear browser cache and reload

### Issue: "Failed to access camera"
**Solution:**
- Camera requires HTTPS (except localhost)
- Check browser permissions: Settings → Privacy → Camera
- Try a different browser (Chrome works best)

### Issue: "Failed to upload file"
**Solution:**
- Check that Google Drive API is enabled
- Verify you granted all required permissions during OAuth
- Try logging out and logging back in

### Issue: Build errors with Tailwind CSS
**Solution:**
```bash
# Make sure you have the correct Tailwind PostCSS plugin
npm install -D @tailwindcss/postcss
```

---

## 🔐 Security Checklist

Before going to production:

- [ ] Update Google OAuth redirect URIs to production URL
- [ ] Set up API restrictions in Google Cloud Console
- [ ] Enable Content Security Policy headers (already configured in `public/_headers`)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Test on mobile devices (iOS Safari, Chrome Android)
- [ ] Review privacy policy and update contact information

---

## 📊 Monitoring & Analytics

### Cloudflare Analytics (Built-in)
- Go to your Cloudflare Pages project
- Click "Analytics" tab
- View traffic, bandwidth, and performance metrics

### Google Drive API Quotas
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to "APIs & Services" → "Google Drive API" → "Quotas"
- Monitor API usage (default: 1000 requests/minute)

---

## 🆘 Need Help?

1. **Check the code** - It's all TypeScript with comments
2. **Browser console** - Look for error messages
3. **Google Cloud logs** - Check OAuth and API errors
4. **Privacy policy** - See `public/privacy-policy.html`

---

## 🎉 You're All Set!

Your MedVault instance is now:
- ✅ Privacy-first (zero-access architecture)
- ✅ HIPAA-compliant design
- ✅ Fully responsive (mobile & desktop)
- ✅ Production-ready

**Remember:** All files stay in your Google Drive. MedVault never sees or stores your documents.
