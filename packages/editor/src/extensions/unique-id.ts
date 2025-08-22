import { isChangeOrigin } from "@tiptap/extension-collaboration";
import UniqueID from "@tiptap/extension-unique-id";

export const uniqueIdExtension = UniqueID.configure({
  types: ["customImage", "paragraph"],
  filterTransaction: (transaction) => !isChangeOrigin(transaction),
});
