import { route } from "@tanstack/virtual-file-routes";

export default [
  route("/profile", "onboarding/pages/profile.tsx"),
  route("/workspace", "onboarding/pages/organization.tsx"),
];
