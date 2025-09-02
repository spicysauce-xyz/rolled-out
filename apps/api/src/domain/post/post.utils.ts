import {
  applyUpdate,
  Doc,
  encodeStateAsUpdate,
  XmlElement,
  XmlText,
} from "yjs";

export const applyTitleToDocumentState = (
  state: Uint8Array | null,
  title: string
) => {
  const doc = new Doc();

  if (state) {
    applyUpdate(doc, state);
  }

  const fragment = doc.getXmlFragment("default") as XmlElement;

  const firstChild = fragment.get(0) as XmlElement;

  if (firstChild) {
    const titleText = firstChild.get(0) as XmlText;

    titleText.delete(0, titleText.length);
    titleText.insert(0, title);
  } else {
    const titleElement = new XmlElement("title");
    const titleText = new XmlText(title);

    titleElement.setAttribute("level", "1");
    titleElement.insert(0, [titleText]);

    fragment.insert(0, [titleElement]);
  }

  return encodeStateAsUpdate(doc);
};
