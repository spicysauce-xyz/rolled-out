import Placeholder from "@tiptap/extension-placeholder";

export const placeholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    if (["listItem", "orderedList", "bulletList"].includes(node.type.name)) {
      return "";
    }

    if (node.type.name === "title") {
      return "Brief title for your update...";
    }

    if (node.type.name === "blockquote") {
      return "Empty quote...";
    }

    if (node.type.name === "codeBlock") {
      return "Code block...";
    }

    return "Write something or try / for heading, list, etc...";
  },
});
