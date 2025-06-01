export interface RawConfig {
  self: string;
  api: string;
}

declare global {
  interface Window {
    __APP_CONFIG__: RawConfig;
  }
}
