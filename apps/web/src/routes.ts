import { authRoutes } from "@modules/auth/Auth.router";
import { dashboardRoutes } from "@modules/dashboard/Dashboard.router";
import { editorRoutes } from "@modules/editor/Editor.router";
import { settingsRoutes } from "@modules/settings/Settings.router";
import { layout, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  ...authRoutes,
  layout("shared/layouts/authorized.tsx", [
    route(
      "/$organizationSlug",
      "dashboard/Dashboard.layout.tsx",
      dashboardRoutes,
    ),
    route("/$organizationSlug_", [
      route("/settings", "settings/Settings.layout.tsx", settingsRoutes),
      route("/editor", editorRoutes),
    ]),
  ]),
]);
