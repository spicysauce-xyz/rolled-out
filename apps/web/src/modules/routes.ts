import account from "@modules/account/router";
import auth from "@modules/auth/router";
import dashboard from "@modules/dashboard/router";
import onboarding from "@modules/onboarding";
import settings from "@modules/settings/router";
import { index, layout, rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  layout("auth/guards/guest-only.tsx", auth),
  layout("auth/guards/authorized.tsx", [
    route("/onboarding", "onboarding/layout.tsx", onboarding),
    route("/account", "account/layout.tsx", account),
    layout("dashboard/guards/has-organization.tsx", [
      index("dashboard/pages/index/page.tsx"),
      route(
        "/$organizationSlug",
        "dashboard/guards/selected-organization.tsx",
        [
          layout("dashboard/layout.tsx", dashboard),
          route("/settings", "settings/layout.tsx", settings),
        ]
      ),
    ]),
  ]),
]);
