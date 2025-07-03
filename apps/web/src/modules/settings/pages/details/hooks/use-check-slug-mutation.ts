import { authClient } from "@lib/auth";
import { useMutation } from "@tanstack/react-query";

export const useCheckSlugMutation = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await authClient.organization.checkSlug({ slug });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};
