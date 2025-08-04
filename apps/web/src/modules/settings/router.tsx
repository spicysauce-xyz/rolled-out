import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/profile", "settings/pages/profile/page.tsx"),
  route("/sessions", "settings/pages/sessions/page.tsx"),
  route("/members", "settings/pages/members/page.tsx"),
  route("/details", "settings/pages/details/page.tsx"),
  route("/organizations", "settings/pages/organizations/page.tsx"),
  route("/$", "settings/pages/splat/page.tsx"),
];
