/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOMAIN: string;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
