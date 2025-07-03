import { TiptapTransformer } from "@hocuspocus/transformer";
import _ from "lodash";
import { applyUpdate, Doc } from "yjs";
import { PublicRepository } from "./public.repository";

export const PublicService = {
  getPublishedPostsFromOrganization: (slug: string) => {
    return PublicRepository.getOrganizationBySlug(slug)
      .andThen(PublicRepository.getPublishedPostsFromOrganization)
      .map((posts) =>
        posts.map((post) => {
          const doc = new Doc();

          if (post.byteContent) {
            applyUpdate(doc, post.byteContent);
          }

          return {
            ..._.omit(post, "byteContent"),
            contentJSON: TiptapTransformer.fromYdoc(doc),
          };
        })
      );
  },
};
