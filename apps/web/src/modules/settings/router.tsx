import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/members", "settings/pages/members/page.tsx"),
  route("/details", "settings/pages/details/page.tsx"),
  route("/$", "settings/pages/splat/page.tsx"),
];
