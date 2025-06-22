# GitHub Pages Deployment Guide

This guide will help you deploy your AI Image Generator application to GitHub Pages with automatic deployment via GitHub Actions.

## Prerequisites

- A GitHub account
- Your Cloudflare API credentials (Account ID and API Token)
- Git installed on your local machine

## Step 1: Repository Setup

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `gen-image` (or update the base path in `vite.config.ts` if you use a different name)
3. Make it public (required for free GitHub Pages)
4. Don't initialize with README, .gitignore, or license (since you already have a project)

### 1.2 Connect Local Repository to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: AI Image Generator application"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gen-image.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Configure GitHub Repository Settings

### 2.1 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. This enables GitHub Actions to deploy to Pages

### 2.2 Set Repository Secrets

Your Cloudflare API credentials need to be stored as GitHub repository secrets for security:

1. In your repository, go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add the following secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your Cloudflare Account ID

   **Secret 2:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your Cloudflare API Token

**Note:** These secrets are used for the production deployment. The application will use direct API calls to Cloudflare when deployed on GitHub Pages.

## Step 3: Update Configuration

### 3.1 Update Repository Name in Vite Config

If your repository name is different from `gen-image`, update the base path in `vite.config.ts`:

```typescript
// Replace 'gen-image' with your actual repository name
const base = isGitHubPages ? '/your-repo-name/' : '/';
```

### 3.2 Environment Variables for Production

Create a `.env.production` file for production environment variables:

```bash
# Production environment variables
VITE_GITHUB_PAGES=true
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_API_TOKEN=your_api_token_here
```

**Important:** Add `.env.production` to your `.gitignore` file to keep credentials secure:

```bash
echo ".env.production" >> .gitignore
```

## Step 4: Deploy

### 4.1 Automatic Deployment

Once you push to the `main` branch, GitHub Actions will automatically:

1. Build your application with GitHub Pages configuration
2. Deploy to GitHub Pages
3. Your site will be available at: `https://YOUR_USERNAME.github.io/gen-image/`

### 4.2 Manual Deployment

You can also trigger deployment manually:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow**

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

1. Go to **Actions** tab in your repository
2. Check the latest workflow run
3. Ensure all steps complete successfully
4. Green checkmarks indicate successful deployment

### 5.2 Access Your Application

Your application will be available at:
```
https://YOUR_USERNAME.github.io/gen-image/
```

### 5.3 Test Functionality

1. Open your deployed application
2. Try generating an image with a simple prompt
3. Verify that the image generation works correctly
4. Check that the theme toggle and other features work

## Troubleshooting

### Common Issues

**1. 404 Error on Deployment**
- Check that the repository name matches the base path in `vite.config.ts`
- Ensure GitHub Pages is enabled in repository settings

**2. API Errors**
- Verify Cloudflare credentials are correctly set in repository secrets
- Check that your Cloudflare API token has the necessary permissions

**3. Build Failures**
- Check the Actions tab for detailed error logs
- Ensure all dependencies are properly listed in `package.json`

**4. CORS Issues**
- This is expected when calling Cloudflare API directly from the browser
- The application is configured to handle CORS appropriately

### Getting Help

If you encounter issues:

1. Check the GitHub Actions logs for detailed error messages
2. Verify all configuration steps were followed correctly
3. Ensure your Cloudflare credentials are valid and have proper permissions

## Security Notes

- API credentials are stored as GitHub repository secrets
- The application uses direct API calls to Cloudflare when deployed on GitHub Pages
- Credentials are exposed in the browser for GitHub Pages deployment (this is a limitation of static hosting)
- For production applications with sensitive data, consider using a backend service instead

## Updating Your Application

To update your deployed application:

1. Make changes to your code locally
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and redeploy your application

Your deployment is now complete! 🎉
