interface RawConfig {
  api: string;
  posthogKey: string;
  posthogHost: string;
}

declare global {
  interface Window {
    RUNTIME_CONFIG: RawConfig;
  }
}

export const getServerConfig = (): RawConfig => {
  return {
    api: process.env.API ?? "",
    posthogKey: process.env.POSTHOG_KEY ?? "",
    posthogHost: process.env.POSTHOG_HOST ?? "",
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
    posthog: {
      key: rawConfig.posthogKey,
      host: rawConfig.posthogHost,
    },
  };
};

export const config = formatConfig(
  import.meta.env.SSR ? getServerConfig() : getClientConfig()
);
