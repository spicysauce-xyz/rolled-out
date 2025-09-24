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

export const createYJSDocumentFromSchema = (object: {
  title: string;
  sections: Array<{
    title: { text: string; level: "2" | "3" };
    paragraphs: string[];
  }>;
}) => {
  const doc = new Doc();
  const fragment = doc.getXmlFragment("default") as XmlElement;

  const titleElement = new XmlElement("title");
  const titleText = new XmlText(object.title);

  titleElement.setAttribute("level", "1");
  titleElement.insert(0, [titleText]);

  const sections = object.sections.map((section) => {
    const sectionTitleElement = new XmlElement("heading");
    const sectionTitleText = new XmlText(section.title.text);
    sectionTitleElement.setAttribute("level", section.title.level);
    sectionTitleElement.insert(0, [sectionTitleText]);

    const paragraphs = section.paragraphs.map((paragraph) => {
      const sectionParagraphElement = new XmlElement("paragraph");
      const sectionText = new XmlText(paragraph);
      sectionParagraphElement.insert(0, [sectionText]);
      return sectionParagraphElement;
    });

    return [sectionTitleElement, ...paragraphs];
  });

  fragment.insert(0, [titleElement, ...sections.flat()]);

  return encodeStateAsUpdate(doc);
};

export const isPostScheduled = <
  T extends { status: string; scheduledAt: Date | null },
>(
  post: T
): post is T & { status: "scheduled"; scheduledAt: Date } => {
  return post.status === "scheduled" && !!post.scheduledAt;
};
