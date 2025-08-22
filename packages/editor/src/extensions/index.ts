import { blockquoteExtension } from "./blockquote";
import { boldExtension } from "./bold";
import { bulletListExtension } from "./bullet-list";
import { codeExtension } from "./code";
import { codeBlockLowlightExtension } from "./code-block-lowlight";
import { documentExtension } from "./document";
import { dropCursorExtension } from "./drop-cursor";
import { gapCursorExtension } from "./gap-cursor";
import { hardBreakExtension } from "./hard-break";
import { headingExtension } from "./heading";
import { italicExtension } from "./italic";
import { linkExtension } from "./link";
import { listItemExtension } from "./list-item";
import { orderedListExtension } from "./ordered-list";
import { paragraphExtension } from "./paragraph";
import { placeholderExtension } from "./placeholder";
import { slashExtension } from "./slash";
import { strikeExtension } from "./strike";
import { textExtension } from "./text";
import { titleExtension } from "./title";
import { underlineExtension } from "./underline";
import { uniqueIdExtension } from "./unique-id";

export default [
  documentExtension,
  placeholderExtension,
  headingExtension,
  paragraphExtension,
  textExtension,
  hardBreakExtension,
  blockquoteExtension,
  boldExtension,
  italicExtension,
  strikeExtension,
  underlineExtension,
  codeExtension,
  linkExtension,
  codeBlockLowlightExtension,
  slashExtension,
  bulletListExtension,
  orderedListExtension,
  listItemExtension,
  gapCursorExtension,
  dropCursorExtension,
  titleExtension,
  uniqueIdExtension,
];
