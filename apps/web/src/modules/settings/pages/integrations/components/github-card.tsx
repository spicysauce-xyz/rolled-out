import { GithubIcon, UnavailableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { githubIntegrationQuery } from "@lib/api/queries";
import { Avatar, Button, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { useGetSetupGithubLink } from "../hooks/use-get-setup-github-link";

type GithubCardProps = {
  organizationId: string;
};

export const GithubCard: React.FC<GithubCardProps> = ({ organizationId }) => {
  const setupGithubLink = useGetSetupGithubLink({ organizationId });

  const handleConnectGithubClick = async () => {
    const link = await setupGithubLink.get();

    if (link) {
      window.open(link, "_blank");
    }
  };

  const githubIntegration = useQuery(githubIntegrationQuery(organizationId));

  const isConnected = !!githubIntegration.data?.id;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between">
        <Avatar.Root>
          <Avatar.Fallback>
            <HugeiconsIcon
              className="size-4"
              icon={GithubIcon}
              strokeWidth={2}
            />
          </Avatar.Fallback>
        </Avatar.Root>
        {isConnected ? (
          <Text.Root
            className="rounded-md bg-success-50 px-2 py-1"
            color="success"
            size="sm"
            weight="medium"
          >
            Connected
          </Text.Root>
        ) : (
          <Text.Root
            className="rounded-md bg-neutral-50 px-2 py-1"
            color="muted"
            size="sm"
            weight="medium"
          >
            Not connected
          </Text.Root>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <Text.Root weight="medium">GitHub</Text.Root>
        <Text.Root color="muted">
          Connect your GitHub account to be able to create releases from your
          GitHub commits.
        </Text.Root>
      </div>
      {isConnected ? (
        <Button.Root
          color="danger"
          render={
            <a
              href="https://github.com/settings/installations"
              rel="noopener"
              target="_blank"
            />
          }
          variant="secondary"
        >
          <div className="flex w-full items-center justify-center gap-2">
            <Button.Icon
              render={<HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} />}
            />
            Disconnect
          </div>
        </Button.Root>
      ) : (
        <Button.Root
          isLoading={setupGithubLink.isGettingLink}
          onClick={handleConnectGithubClick}
          variant="secondary"
        >
          <div className="flex w-full items-center justify-center gap-2">
            Connect
          </div>
        </Button.Root>
      )}
    </div>
  );
};
