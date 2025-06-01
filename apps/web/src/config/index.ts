const rawConfig = window.__APP_CONFIG__;

export const config = {
  basepath: new URL(rawConfig.self).pathname,
  apiUrl: rawConfig.api,
  authUrl: `${rawConfig.api}/auth`,
};
