import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { getServerConfig } from "@config";
import { createRouter } from "./router";

// Create a custom stream handler that injects the config
const customStreamHandler = async (
  context: Parameters<typeof defaultStreamHandler>[0],
) => {
  const configScript = `
    <script>
      window.RUNTIME_CONFIG = ${JSON.stringify(getServerConfig())};
    </script>
  `;

  const response = await defaultStreamHandler(context);

  if (response.headers.get("content-type")?.includes("text/html")) {
    const html = await response.text();
    const modifiedHtml = html.replace("</head>", `${configScript}</head>`);

    return new Response(modifiedHtml, {
      headers: response.headers,
      status: response.status,
    });
  }

  return response;
};

export default createStartHandler({
  createRouter,
})(customStreamHandler);
