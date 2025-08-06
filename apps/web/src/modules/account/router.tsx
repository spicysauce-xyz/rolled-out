import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/profile", "account/pages/profile/page.tsx"),
  route("/sessions", "account/pages/sessions/page.tsx"),
  route("/organizations", "account/pages/organizations/page.tsx"),
  route("/$", "account/pages/splat/page.tsx"),
];
