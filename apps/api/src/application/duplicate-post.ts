import { EditorService } from "@domain/editor";
import { PostService } from "@domain/post";
import { applyTitleToDocumentState } from "@domain/post/post.utils";
import type { Member } from "@services/db";

export const duplicatePost = (member: Member, id: string) => {
  return PostService.findPostById(member, id)
    .andThen((post) => {
      const title = `Copy of ${post.title}`;

      return PostService.create(member, {
        byteContent: applyTitleToDocumentState(post.byteContent, title),
        organizationId: member.organizationId,
        title,
      });
    })
    .andThrough((post) =>
      EditorService.createEditor(post.id, member.id, "creator")
    );
};
