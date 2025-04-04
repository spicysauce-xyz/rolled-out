import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return authClient.getSession();
    },
  });
};
