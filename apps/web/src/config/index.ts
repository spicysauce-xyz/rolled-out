import type { Config } from "./config.types";

const rawConfig = window.__APP_CONFIG__;

export const config: Config = {
  api: {
    base: `http${rawConfig?.apiHost === "localhost" ? "" : "s"}://${rawConfig?.apiHost}${rawConfig?.apiPort ? `:${rawConfig?.apiPort}` : ""}`,
    path: rawConfig?.apiPath ?? "",
  },
};
