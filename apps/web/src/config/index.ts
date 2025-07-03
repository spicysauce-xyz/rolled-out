interface RawConfig {
  version?: string;
  self: string;
  api: string;
  hocus: string;
}

declare global {
  interface Window {
    RUNTIME_CONFIG: RawConfig;
  }
}

export const getServerConfig = (): RawConfig => {
  return {
    version: process.env.VERSION ?? "0.0.0",
    self: process.env.SELF ?? "",
    api: process.env.API ?? "",
    hocus: process.env.HOCUS ?? "",
  };
};

const getClientConfig = () => {
  return window.RUNTIME_CONFIG;
};

const formatConfig = (
  rawConfig:
    | ReturnType<typeof getServerConfig>
    | ReturnType<typeof getClientConfig>
) => {
  return {
    version: rawConfig.version,
    apiUrl: rawConfig.api,
    authUrl: `${rawConfig.api}/auth`,
    hocusUrl: new URL(rawConfig.hocus).origin.replace("http", "ws"),
  };
};

export const config = formatConfig(
  import.meta.env.SSR ? getServerConfig() : getClientConfig()
);
