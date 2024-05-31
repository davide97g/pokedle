/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BACKEND_URL: string;
  readonly VITE_APP_STRIPE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
