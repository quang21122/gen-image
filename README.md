# AI Image Generator

A modern React + TypeScript + Vite application for generating images using Cloudflare Workers AI.

## Environment Setup

Before running the application, you need to set up your environment variables:

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Get your Cloudflare credentials:

   - **Account ID**: Found in the right sidebar of any page in your Cloudflare dashboard
   - **API Token**: Go to "My Profile" > "API Tokens" > "Create Token" with AI permissions

3. Update the `.env` file with your actual credentials:

   ```env
   VITE_CLOUDFLARE_ACCOUNT_ID=your_actual_account_id
   VITE_CLOUDFLARE_API_TOKEN=your_actual_api_token
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Production Deployment

For production deployment with maximum security:

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start the secure production server**:

   ```bash
   npm run serve
   ```

3. **Environment Setup**:

   - Set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` on your server
   - These credentials will be completely hidden from browser inspection
   - The frontend will automatically use the secure backend proxy

4. **Verify Security**:
   - Open browser dev tools → Network tab
   - Generate an image and inspect the requests
   - You should only see requests to `/api/*` endpoints (no Cloudflare credentials visible)

## Security Features

🔒 **Secure API Communication**:

- API credentials are stored server-side only and never exposed to the browser
- All Cloudflare API calls go through a secure backend proxy
- Frontend cannot access sensitive credentials even through browser dev tools

🛡️ **Environment Security**:

- Server-side credentials (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) are never sent to the browser
- Client-side credentials (`VITE_*`) are only used for development fallback
- Production builds completely hide API keys from network inspection

📋 **Security Best Practices**:

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Environment variables are validated at runtime
- Use the `checkEnvironmentSetup()` function to verify your configuration

## Development

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
