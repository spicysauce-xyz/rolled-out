import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  route("/login", "auth/login.tsx"),
  route("/signup", "auth/signup.tsx"),
  layout("auth/authorized.tsx", [
    route("/$organizationSlug", "dashboard/layout.tsx", [
      index("dashboard/pages/index.tsx"),
      route("/updates", "dashboard/pages/updates/updates.tsx"),
      route("/contacts", "dashboard/pages/contacts.tsx"),
    ]),
    route("/$organizationSlug_", [
      route("/settings", "settings/layout.tsx", [
        route("/profile", "settings/pages/profile.tsx"),
        route("/sessions", "settings/pages/sessions.tsx"),
        route("/$", "settings/splat.tsx"),
      ]),
      route("/editor", [route("/$id", "editor/pages/$id.tsx")]),
    ]),
  ]),
]);
