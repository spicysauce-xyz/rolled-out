import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />, {
  onRecoverableError(err, info) {
    // surfaces hydration mismatches & other silent errors
    console.error("[hydrate] recoverable", info, err);
  },
});
