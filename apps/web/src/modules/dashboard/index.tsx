import { index, route } from "@tanstack/virtual-file-routes";

export default [
  index("dashboard/pages/index.tsx"),
  route("/updates", "dashboard/pages/updates/updates.tsx"),
  route("/contacts", "dashboard/pages/contacts.tsx"),
];
