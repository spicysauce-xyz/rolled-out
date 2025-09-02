import type * as Y from "yjs";

const DEFAULT_TITLE = "Untitled Update";
const TAGS_KEY = "update:tags";

export const getDocumentTags = (document: Y.Doc) => {
  const tagsJSON = document.getMap(TAGS_KEY).toJSON() ?? {};

  return Object.entries(tagsJSON).map(([tagId]) => ({ id: tagId }));
};

export const getDocumentTitle = (document: Y.Doc) => {
  let title: string | undefined;

  const yContent = document.getXmlFragment("default");

  if (yContent.length) {
    const titleNode = yContent.get(0) as Y.XmlElement;

    if (titleNode) {
      const titleContent = titleNode.get(0);

      if (titleContent) {
        title = titleContent.toString();
      }
    }
  }

  return title || DEFAULT_TITLE;
};
