/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
  readonly VITE_REVIEW_MODE?: string
  readonly VITE_REVIEW_GATE_TOKEN?: string
  readonly VITE_REVIEW_HOST_ALLOWLIST?: string
  // agrega aquí otras VITE_... si las usas
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
