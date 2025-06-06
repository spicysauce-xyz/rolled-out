import auth from "@modules/auth";
import dashboard from "@modules/dashboard";
import editor from "@modules/editor";
import onboarding from "@modules/onboarding";
import settings from "@modules/settings";
import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  layout("auth/layouts/guest-only.tsx", auth),
  layout("auth/layouts/authorized.tsx", [
    route("/onboarding", onboarding),
    layout("dashboard/layouts/has-organization.tsx", [
      index("dashboard/pages/splash.tsx"),
      route(
        "/$organizationSlug",
        "dashboard/layouts/selected-organization.tsx",
        [
          layout("dashboard/layouts/index.tsx", dashboard),
          route("/settings", "settings/layouts/index.tsx", settings),
          route("/editor", editor),
        ],
      ),
    ]),
  ]),
]);
