import Link from "@tiptap/extension-link";

export const linkExtension = Link.configure({
  openOnClick: "whenNotEditable",
  autolink: true,
});
