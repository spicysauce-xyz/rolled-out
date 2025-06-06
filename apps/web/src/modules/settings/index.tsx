import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/profile", "settings/pages/profile.tsx"),
  route("/sessions", "settings/pages/sessions.tsx"),
  route("/members", "settings/pages/members/index.tsx"),
  route("/details", "settings/pages/details.tsx"),
  route("/$", "settings/pages/splat.tsx"),
];
