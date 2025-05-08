import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { Slash } from "./slash";
import { Title } from "./title";
import { onlyInAllowedNodesForMarks } from "./utils";

export const extensions = [
  Document.extend({
    content: "title block*",
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "title") {
        return "Brief title for your update...";
      }

      if (node.type.name === "blockquote") {
        return "Empty quote...";
      }

      return "Write something or try / for heading, list, etc...";
    },
  }),
  Title.configure({ levels: [1] }),
  Heading.configure({ levels: [2, 3] }),
  Paragraph,
  Text,
  Blockquote,
  Image,
  Bold.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-b": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleBold,
          ),
      };
    },
  }),
  Italic.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-i": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleItalic,
          ),
      };
    },
  }),
  Strike.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-s": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleStrike,
          ),
      };
    },
  }),
  Underline.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-u": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleUnderline,
          ),
      };
    },
  }),
  Code.extend({
    addKeyboardShortcuts() {
      return {
        "Mod-e": () =>
          onlyInAllowedNodesForMarks(
            this.editor,
            this.editor.commands.toggleCode,
          ),
      };
    },
  }),
  Link.configure({
    openOnClick: "whenNotEditable",
    autolink: true,
  }),
  Slash,
];
