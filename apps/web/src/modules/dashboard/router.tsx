import { route } from "@tanstack/virtual-file-routes";
import updates from "./pages/updates/router";

export default [
  route("/analytics", "dashboard/pages/analytics/page.tsx"),
  route("/contacts", "dashboard/pages/contacts/page.tsx"),
  route("/boards/$id", "dashboard/pages/board/page.tsx"),
  route("/updates", updates),
  route("$", "dashboard/splat.tsx"),
];
