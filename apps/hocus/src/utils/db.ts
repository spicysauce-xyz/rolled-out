import { Database, schema } from "@database";
import { eq } from "drizzle-orm";

export const getPostByDocumentName = async (documentName: string) => {
  const post = await Database.query.post.findFirst({
    where: eq(schema.post.id, documentName),
  });

  return post;
};

export const updatePostByDocumentName = (
  documentName: string,
  data: Pick<typeof schema.post.$inferInsert, "byteContent" | "title">
) => {
  return Database.update(schema.post)
    .set({
      byteContent: data.byteContent,
      title: data.title,
      updatedAt: new Date(),
    })
    .where(eq(schema.post.id, documentName));
};

export const upsertEditorsByDocumentName = (
  documentName: string,
  editorsIds: string[]
) => {
  return Database.insert(schema.editor)
    .values(
      editorsIds.map((id) => ({
        postId: documentName,
        userId: id,
      }))
    )
    .onConflictDoNothing();
};

export const deletePostTagsByDocumentName = (documentName: string) => {
  return Database.delete(schema.postTag).where(
    eq(schema.postTag.postId, documentName)
  );
};

export const insertPostTagsByDocumentName = (
  documentName: string,
  tagsIds: string[]
) => {
  return Database.insert(schema.postTag)
    .values(tagsIds.map((id) => ({ postId: documentName, tagId: id })))
    .onConflictDoNothing();
};
