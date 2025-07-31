import "highlight.js/styles/atom-one-light.min.css";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export const codeBlockLowlightExtension = CodeBlockLowlight.configure({
  lowlight,
});
