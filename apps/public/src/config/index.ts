interface RawConfig {
  api: string;
}

declare global {
  interface Window {
    RUNTIME_CONFIG: RawConfig;
  }
}

export const getServerConfig = (): RawConfig => {
  return {
    api: process.env.API ?? "",
  };
};

const getClientConfig = () => {
  return window.RUNTIME_CONFIG;
};

const formatConfig = (
  config:
    | ReturnType<typeof getServerConfig>
    | ReturnType<typeof getClientConfig>,
) => {
  return {
    apiUrl: config.api,
  };
};

export const config = formatConfig(
  import.meta.env.SSR ? getServerConfig() : getClientConfig(),
);
