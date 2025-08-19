import { index, route } from "@tanstack/virtual-file-routes";

export default [
  index("dashboard/pages/updates/pages/list/page.tsx"),
  route("/$id", "dashboard/pages/updates/pages/editor/page.tsx"),
];
