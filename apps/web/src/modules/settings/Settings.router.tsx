import { route } from "@tanstack/virtual-file-routes";

export const settingsRoutes = [
  route("/profile", "settings/pages/profile.tsx"),
  route("/sessions", "settings/pages/sessions.tsx"),
  route("/$", "settings/pages/splat.tsx"),
];
