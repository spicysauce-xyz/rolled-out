import { authClient } from "@lib/auth";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await authClient.getSession();

      if (response.error) {
        throw response.error;
      }

      return response;
    },
  });
};
