import { authRoutes } from "@modules/auth/Auth.router";
import { dashboardRoutes } from "@modules/dashboard/Dashboard.router";
import { editorRoutes } from "@modules/editor/Editor.router";
import { onboardingRoutes } from "@modules/onboarding/Onboarding.router";
import { settingsRoutes } from "@modules/settings/Settings.router";
import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  layout("shared/layouts/outside.tsx", [
    layout("auth/Auth.layout.tsx", authRoutes),
    route("/onboarding", "onboarding/Onboarding.layout.tsx", onboardingRoutes),
  ]),
  layout("shared/layouts/authorized.tsx", [
    index("splash.tsx"),
    route("/$organizationSlug", "shared/layouts/organization.tsx", [
      layout("dashboard/Dashboard.layout.tsx", dashboardRoutes),
      route("/settings", "settings/Settings.layout.tsx", settingsRoutes),
      route("/editor", editorRoutes),
    ]),
  ]),
]);
