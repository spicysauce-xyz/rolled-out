import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/profile", "settings/pages/profile/profile.tsx"),
  route("/sessions", "settings/pages/sessions/sessions.tsx"),
  route("/members", "settings/pages/members/index.tsx"),
  route("/details", "settings/pages/details/details.tsx"),
  route("/$", "settings/pages/splat.tsx"),
];
