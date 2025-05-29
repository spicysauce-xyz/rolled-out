export interface RawConfig {
  type: "env" | "remote";
  apiHost: string;
  apiPort: string;
}

export interface Config {
  api: {
    url: string;
  };
}

declare global {
  interface Window {
    __APP_CONFIG__?: RawConfig;
  }
}
