import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/details", "settings/pages/details/page.tsx"),
  route("/members", "settings/pages/members/page.tsx"),
  route("/integrations", "settings/pages/integrations/page.tsx"),
  route("/$", "settings/pages/splat/page.tsx"),
];
