export const config = {
  api: {
    url: `http${import.meta.env.VITE_API_HOST === "localhost" ? "" : "s"}://${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT ? `:${import.meta.env.VITE_API_PORT}` : ""}`,
    host: import.meta.env.VITE_API_HOST,
    port: import.meta.env.VITE_API_PORT,
  },
};
