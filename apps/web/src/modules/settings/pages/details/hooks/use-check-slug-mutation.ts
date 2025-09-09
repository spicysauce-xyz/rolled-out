import { api } from "@lib/api";
import { useMutation } from "@tanstack/react-query";

export const useCheckSlugMutation = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await api.organizations["check-slug"].$get({
        query: {
          slug,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
  });
};
