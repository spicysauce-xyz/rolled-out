interface RawConfig {
  self: string;
  api: string;
  hocus: string;
  public: string;
}

declare global {
  interface Window {
    RUNTIME_CONFIG: RawConfig;
  }
}

export const getServerConfig = (): RawConfig => {
  return {
    self: process.env.SELF ?? "",
    api: process.env.API ?? "",
    hocus: process.env.HOCUS ?? "",
    public: process.env.PUBLIC ?? "",
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
    apiUrl: rawConfig.api,
    authUrl: `${rawConfig.api}/auth`,
    hocusUrl: new URL(rawConfig.hocus).origin.replace("http", "ws"),
    publicUrl: rawConfig.public,
  };
};

export const config = formatConfig(
  import.meta.env.SSR ? getServerConfig() : getClientConfig()
);
