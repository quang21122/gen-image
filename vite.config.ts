import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Determine if we're building for GitHub Pages
  const isGitHubPages =
    mode === "github-pages" || process.env.GITHUB_PAGES === "true";

  // Set base path for GitHub Pages deployment
  // Replace 'gen-image' with your actual repository name
  const base = isGitHubPages ? "/gen-image/" : "/";

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      // Optimize for GitHub Pages
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false, // Disable sourcemaps for production
      rollupOptions: {
        output: {
          // Ensure consistent asset naming
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
        },
      },
    },
    server: {
      proxy: {
        "/api/cloudflare": {
          target: "https://api.cloudflare.com/client/v4",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cloudflare/, ""),
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.error("Proxy error:", err);
            });
          },
        },
      },
    },
    // Environment variable handling for different modes
    define: {
      __GITHUB_PAGES__: JSON.stringify(isGitHubPages),
    },
  };
});
