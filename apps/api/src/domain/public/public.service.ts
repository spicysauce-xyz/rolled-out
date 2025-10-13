import { TiptapTransformer } from "@hocuspocus/transformer";
import _ from "lodash";
import { applyUpdate, Doc } from "yjs";
import { PublicRepository } from "./public.repository";

export const PublicService = {
  getOrganizationBySlug: (slug: string) => {
    return PublicRepository.getOrganizationBySlug(slug).map((organization) => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      websiteUrl: organization.websiteUrl,
    }));
  },

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
