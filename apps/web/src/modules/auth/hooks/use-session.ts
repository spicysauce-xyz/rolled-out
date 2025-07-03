import { sessionQuery } from "@lib/api/queries";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery(sessionQuery());
};
