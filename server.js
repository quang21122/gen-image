// Simple Express server to handle CORS for production builds
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to Cloudflare
app.use('/api/cloudflare', createProxyMiddleware({
  target: 'https://api.cloudflare.com/client/v4',
  changeOrigin: true,
  pathRewrite: {
    '^/api/cloudflare': '', // Remove /api/cloudflare from the path
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error occurred' });
  },
  onProxyReq: (proxyReq, req, res) => {
  },
  onProxyRes: (proxyRes, req, res) => {
  }
}));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
});
