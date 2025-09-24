import { api } from "@lib/api";
import { Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";

type UseGetSetupGithubLinkArgs = {
  organizationId: string;
};

export const useGetSetupGithubLink = (args: UseGetSetupGithubLinkArgs) => {
  const { organizationId } = args;

  const githubQuery = useQuery({
    queryKey: ["github", organizationId],
    queryFn: async ({ queryKey }) => {
      const response = await api.organizations[
        ":organizationId"
      ].integrations.github["setup-url"].$get({
        param: {
          organizationId: queryKey[1],
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    enabled: false,
  });

  const get = async () => {
    const response = await githubQuery.refetch();

    const link = response.data?.link;

    if (!link) {
      Toaster.error("Couldn't connect GitHub", {
        description:
          "Something went wrong while connecting GitHub. Please try again.",
      });
    }

    return link;
  };

  return {
    get,
    isGettingLink: githubQuery.isLoading,
  };
};
