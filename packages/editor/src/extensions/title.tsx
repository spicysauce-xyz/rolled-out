import { Heading } from "@tiptap/extension-heading";

export const Title = Heading.extend({
  name: "title",
  group: "block",
  content: "text*",
  defining: true,
  addInputRules() {
    return [];
  },
  parseHTML() {
    return [{ tag: "h1:first-child" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["h1", HTMLAttributes, 0];
  },
});
