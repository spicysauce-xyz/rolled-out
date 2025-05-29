const initializeConfigFromEnv = () => {
  window.__APP_CONFIG__ = {
    type: "env",
    apiHost: import.meta.env.VITE_API_HOST,
    apiPort: import.meta.env.VITE_API_PORT,
  };
};

const initializeConfigFromRemote = async () => {
  const res = await fetch("/config.json");
  const config = await res.json();

  window.__APP_CONFIG__ = {
    type: "remote",
    ...config,
  };
};

const run = async () => {
  const initializeConfig = import.meta.env.PROD
    ? initializeConfigFromRemote
    : initializeConfigFromEnv;

  await initializeConfig();

  console.log("[Config]", window.__APP_CONFIG__);

  const { start } = await import("./app.tsx");

  start();
};

run();
