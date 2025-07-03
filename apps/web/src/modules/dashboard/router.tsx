import { index, route } from "@tanstack/virtual-file-routes";

export default [
  index("dashboard/pages/updates/page.tsx"),
  route("/analytics", "dashboard/pages/analytics/page.tsx"),
  route("/contacts", "dashboard/pages/contacts/page.tsx"),
  route("/boards/$id", "dashboard/pages/board/page.tsx"),
];
