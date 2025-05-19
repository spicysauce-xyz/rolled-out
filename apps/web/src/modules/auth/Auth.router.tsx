import { route } from "@tanstack/virtual-file-routes";

export const authRoutes = [
  route("/login", "auth/pages/login.tsx"),
  route("/signup", "auth/pages/signup.tsx"),
];
