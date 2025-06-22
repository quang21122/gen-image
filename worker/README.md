# Cloudflare Worker API Proxy

This Cloudflare Worker acts as a CORS-enabled API proxy for the AI image generation application, solving the CORS issues when deploying to GitHub Pages.

## Features

- ✅ **CORS Support**: Properly configured CORS headers for GitHub Pages
- 🔒 **Secure**: API credentials stored as Worker secrets (not exposed to browser)
- 🚀 **Fast**: Edge computing with global distribution
- 🎨 **AI Image Generation**: Proxies requests to Cloudflare AI API
- 🌐 **Translation**: Supports text translation via Cloudflare AI

## Setup

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Configure Environment

```bash
# Set your Cloudflare account ID
wrangler secret put CLOUDFLARE_ACCOUNT_ID

# Set your Cloudflare API token
wrangler secret put CLOUDFLARE_API_TOKEN
```

### 3. Update Allowed Origins

Edit `wrangler.toml` and update the `ALLOWED_ORIGINS` variable with your GitHub Pages URL:

```toml
[vars]
ALLOWED_ORIGINS = "https://yourusername.github.io,http://localhost:5173"
```

### 4. Deploy

```bash
# Deploy to production
npm run deploy

# Or deploy to development
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Image Generation
```
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "a beautiful sunset",
  "num_steps": 20,
  "guidance": 12.0,
  "width": 1024,
  "height": 1024
}
```

### Translation
```
POST /api/translate
Content-Type: application/json

{
  "text": "Hello world",
  "source_lang": "auto",
  "target_lang": "spanish"
}
```

## Testing

```bash
# Test health endpoint
curl https://your-worker.workers.dev/api/health

# Test image generation
curl -X POST https://your-worker.workers.dev/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a beautiful sunset"}'
```

## Security

- API credentials are stored as Worker secrets (never exposed to browser)
- CORS is properly configured for your specific domains
- All requests are validated and sanitized
- Error messages don't expose sensitive information
