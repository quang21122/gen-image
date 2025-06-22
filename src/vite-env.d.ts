/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDFLARE_ACCOUNT_ID: string;
  readonly VITE_CLOUDFLARE_API_TOKEN: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GITHUB_PAGES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global variables defined by Vite
declare const __GITHUB_PAGES__: boolean;
