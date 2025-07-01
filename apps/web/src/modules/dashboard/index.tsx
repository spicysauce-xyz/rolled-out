import { index, route } from "@tanstack/virtual-file-routes";

export default [
  index("dashboard/pages/updates/updates.tsx"),
  route("/analytics", "dashboard/pages/index.tsx"),
  route("/contacts", "dashboard/pages/contacts.tsx"),
  route("/boards/$id", "dashboard/pages/board/board.tsx"),
];
