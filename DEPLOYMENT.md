# Deployment Guide: CORS-Free GitHub Pages with Cloudflare Worker

This guide explains how to deploy your AI image generation app to GitHub Pages without CORS errors using a Cloudflare Worker as an API proxy.

## 🎯 Solution Overview

**Problem**: GitHub Pages is static hosting and can't run your Node.js backend. Direct API calls to Cloudflare from the browser cause CORS errors.

**Solution**: Deploy a Cloudflare Worker that:
- ✅ Handles CORS headers properly
- 🔒 Keeps API credentials secure (server-side only)
- 🚀 Provides fast, global edge computing
- 🌐 Proxies requests to Cloudflare AI API

## 📋 Prerequisites

1. **Cloudflare Account** with AI access
2. **GitHub Repository** with your code
3. **GitHub Pages** enabled for your repository

## 🚀 Step-by-Step Deployment

### Step 1: Deploy the Cloudflare Worker

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Navigate to Worker directory**:
   ```bash
   cd worker
   npm install
   ```

4. **Set Worker secrets** (your API credentials):
   ```bash
   # Set your Cloudflare account ID
   wrangler secret put CLOUDFLARE_ACCOUNT_ID
   # Enter your account ID when prompted

   # Set your Cloudflare API token
   wrangler secret put CLOUDFLARE_API_TOKEN
   # Enter your API token when prompted
   ```

5. **Update allowed origins** in `worker/wrangler.toml`:
   ```toml
   [vars]
   ALLOWED_ORIGINS = "https://yourusername.github.io,http://localhost:5173"
   ```
   Replace `yourusername` with your actual GitHub username.

6. **Deploy the Worker**:
   ```bash
   npm run deploy
   ```

7. **Note your Worker URL** (e.g., `https://gen-image-worker.your-subdomain.workers.dev`)

### Step 2: Configure GitHub Repository

1. **Add Worker URL as Repository Secret**:
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `WORKER_PROXY_URL`
   - Value: Your Worker URL (e.g., `https://gen-image-worker.your-subdomain.workers.dev`)

2. **Remove old secrets** (if they exist):
   - Delete `CLOUDFLARE_ACCOUNT_ID` secret
   - Delete `CLOUDFLARE_API_TOKEN` secret
   
   These are no longer needed since credentials are now stored securely in the Worker.

### Step 3: Deploy to GitHub Pages

1. **Push your changes** to the main branch:
   ```bash
   git add .
   git commit -m "Add Cloudflare Worker proxy for CORS-free deployment"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Build your app with the Worker proxy URL
   - Deploy to GitHub Pages
   - No API credentials are exposed in the client

3. **Access your deployed app**:
   - URL: `https://yourusername.github.io/repository-name`

## 🧪 Testing the Deployment

### Test Worker Directly

```bash
# Test health endpoint
curl https://your-worker.workers.dev/api/health

# Test image generation
curl -X POST https://your-worker.workers.dev/api/generate-image \
  -H "Content-Type: application/json" \
  -H "Origin: https://yourusername.github.io" \
  -d '{"prompt": "a beautiful sunset"}'
```

### Test GitHub Pages App

1. Open your GitHub Pages URL
2. Open browser developer tools (F12)
3. Go to **Network** tab
4. Generate an image
5. **Verify**:
   - ✅ No CORS errors in console
   - ✅ API calls go to your Worker URL
   - ✅ No `CLOUDFLARE_API_TOKEN` visible in requests
   - ✅ Image generates successfully

## 🔧 Troubleshooting

### CORS Errors Still Occurring

1. **Check Worker URL**: Ensure `WORKER_PROXY_URL` secret is set correctly
2. **Check Allowed Origins**: Update `worker/wrangler.toml` with your exact GitHub Pages URL
3. **Redeploy Worker**: Run `npm run deploy` in the worker directory

### Worker Not Responding

1. **Check Worker logs**:
   ```bash
   wrangler tail
   ```

2. **Verify secrets are set**:
   ```bash
   wrangler secret list
   ```

3. **Test Worker health**:
   ```bash
   curl https://your-worker.workers.dev/api/health
   ```

### GitHub Pages Build Failing

1. **Check GitHub Actions logs** in your repository
2. **Verify `WORKER_PROXY_URL` secret** is set in repository settings
3. **Ensure Worker is deployed** and responding

## 🔒 Security Benefits

✅ **API credentials never exposed** to browser  
✅ **CORS properly configured** for your domain only  
✅ **Request validation** and sanitization  
✅ **Error messages** don't leak sensitive information  
✅ **Rate limiting** can be added to Worker if needed  

## 📝 Environment Variables Summary

### Repository Secrets (GitHub)
- `WORKER_PROXY_URL`: Your deployed Worker URL

### Worker Secrets (Cloudflare)
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token

### Local Development (.env)
- `VITE_WORKER_PROXY_URL`: Worker URL for testing
- `CLOUDFLARE_ACCOUNT_ID`: For local backend proxy
- `CLOUDFLARE_API_TOKEN`: For local backend proxy

## 🎉 Success!

Your app is now deployed to GitHub Pages with:
- ✅ No CORS errors
- 🔒 Secure API credential handling
- 🚀 Fast global performance via Cloudflare Workers
- 🌐 Professional production deployment

The deployed app will use the Cloudflare Worker proxy for all API calls, ensuring a smooth user experience without browser security restrictions.
