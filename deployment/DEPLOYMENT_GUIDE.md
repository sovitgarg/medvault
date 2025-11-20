# MedVault AWS Amplify Deployment Guide

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Node.js and npm installed

## Deployment Options

### Option 1: AWS Amplify Console (Easiest - Recommended)

This is the simplest method with zero DevOps.

#### Steps:

1. **Build the app locally**
   ```bash
   cd /Users/sovitgarg/Learning/MedVault/medvault
   npm run build
   ```

2. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify
   - Click "New app" → "Deploy without Git provider"

3. **Upload Build**
   - Drag and drop the `dist/` folder
   - App Name: `medvault`
   - Environment: `production`

4. **Deploy**
   - Click "Save and deploy"
   - Wait ~2 minutes for deployment

5. **Access your app**
   - You'll get a URL like: `https://main.d1234567890.amplifyapp.com`

**Cost:** Free tier (1000 build minutes/month, 15GB storage, 5GB served)

---

### Option 2: Amplify CLI with Git (Auto-deploy on push)

For continuous deployment from GitHub.

#### Initial Setup:

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure AWS credentials**
   ```bash
   amplify configure
   ```
   - Sign in to AWS Console
   - Create IAM user with AdministratorAccess
   - Save access key and secret

3. **Initialize Amplify**
   ```bash
   cd /Users/sovitgarg/Learning/MedVault/medvault
   amplify init
   ```
   - Project name: `medvault`
   - Environment: `prod`
   - Default editor: Visual Studio Code
   - App type: javascript
   - Framework: react
   - Source directory: src
   - Distribution directory: dist
   - Build command: npm run build
   - Start command: npm run dev

4. **Add hosting**
   ```bash
   amplify add hosting
   ```
   - Select: "Hosting with Amplify Console"
   - Type: "Continuous deployment"

5. **Connect to GitHub**
   - Follow prompts to connect GitHub repository
   - Select branch: `main`

6. **Publish**
   ```bash
   amplify publish
   ```

#### Future Deployments:

Just push to GitHub:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Amplify automatically builds and deploys!

---

### Option 3: Manual Deployment Script

Use the deployment script for quick local builds and manual uploads.

```bash
cd /Users/sovitgarg/Learning/MedVault/medvault
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

Then manually upload the `dist/` folder to Amplify Console.

---

## Environment Variables

### Setting up Google OAuth in Production

1. **Update Google OAuth Client**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit "MedvaultWebApp"
   - Add your Amplify URL to:
     - Authorized JavaScript origins: `https://your-amplify-url.amplifyapp.com`
     - Authorized redirect URIs: `https://your-amplify-url.amplifyapp.com`

2. **Set Environment Variables in Amplify**
   - Go to Amplify Console → Your App → Environment variables
   - Add:
     ```
     VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
     VITE_GOOGLE_API_KEY=your-google-api-key
     VITE_APP_NAME=MedVault
     VITE_APP_DESCRIPTION=Privacy-First Medical Document Manager
     ```

---

## Custom Domain (Optional)

1. **Buy a domain** (or use existing)
   - Route 53, GoDaddy, Namecheap, etc.

2. **Add to Amplify**
   - Amplify Console → Domain management → Add domain
   - Enter domain: `medvault.com`
   - Amplify auto-configures SSL certificate

3. **DNS Configuration**
   - If domain is NOT in Route 53:
     - Add CNAME record pointing to Amplify URL
   - If domain IS in Route 53:
     - Amplify handles everything automatically

---

## Monitoring & Logs

- **Access Logs**: Amplify Console → Monitoring → Logs
- **Build Logs**: See each deployment's build output
- **Metrics**: View traffic, errors, and performance

---

## Rollback

If deployment fails:
1. Amplify Console → Deployments
2. Find previous working version
3. Click "Redeploy this version"

---

## Cost Estimate

**Free Tier:**
- 1000 build minutes/month
- 15GB storage
- 5GB data served/month

**After free tier:**
- Build: $0.01/minute
- Hosting: $0.15/GB served
- Storage: $0.023/GB/month

**Expected cost for MedVault:** ~$0-5/month (most months free)

---

## Troubleshooting

### Build Fails

Check `amplify.yml` is correct:
- baseDirectory should be `dist` (Vite output)
- Node version should be 18+

### Environment Variables Not Working

- Ensure they start with `VITE_` (Vite requirement)
- Redeploy after adding environment variables

### OAuth Errors

- Verify Amplify URL is added to Google OAuth client
- Check that client ID and API key are correct

---

## Quick Reference

```bash
# Build locally
npm run build

# Deploy with CLI
amplify publish

# View logs
amplify console

# Check status
amplify status

# Delete app
amplify delete
```

---

## Support

For issues:
- AWS Amplify Docs: https://docs.amplify.aws/
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
