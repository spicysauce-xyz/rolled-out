import { TiptapTransformer } from "@hocuspocus/transformer";
import _ from "lodash";
import { applyUpdate, Doc } from "yjs";
import { PublicRepository } from "./public.repository";

export const PublicService = {
  getPublishedPostsFromOrganization: (slug: string) => {
    return PublicRepository.getOrganizationBySlug(slug)
      .andThen((organization) => 
        PublicRepository.getPublishedPostsFromOrganization(organization)
          .map((posts) => ({ organization, posts }))
      )
      .map(({ organization, posts }) => ({
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        },
        posts: posts.map((post) => {
          const doc = new Doc();

          if (post.byteContent) {
            applyUpdate(doc, post.byteContent);
          }

          return {
            ..._.omit(post, "byteContent"),
            contentJSON: TiptapTransformer.fromYdoc(doc),
          };
        })
      }));
  },
};
