export interface RawConfig {
  type: "env" | "remote";
  apiHost: string;
  apiPort?: string;
  apiPath?: string;
}

export interface Config {
  api: {
    base: string;
    path: string;
  };
}

declare global {
  interface Window {
    __APP_CONFIG__?: RawConfig;
  }
}
