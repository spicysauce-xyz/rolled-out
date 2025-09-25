import { githubIntegrationPendingCommitsQuery } from "@lib/api/queries";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { LinkButton, Text, Toaster } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

type PendingCommitsCalloutProps = {
  organizationId: string;
  organizationSlug: string;
};

export const PendingCommitsCallout: React.FC<PendingCommitsCalloutProps> = ({
  organizationId,
  organizationSlug,
}) => {
  const navigate = useNavigate();

  const pendingCommitsQuery = useQuery(
    githubIntegrationPendingCommitsQuery(organizationId)
  );

  const pendingCommits = pendingCommitsQuery?.data || [];

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreateUpdateMutation();

  const handleCreateDraft = () => {
    const toastId = Toaster.loading("Creating draft...");

    createPost(
      {
        organizationId,
        githubIds: pendingCommits.map((commit) => commit.objectId),
      },
      {
        onSuccess: (post) => {
          Toaster.success("Draft created", {
            description: "A new draft has been created and saved.",
            id: toastId,
          });
          navigate({
            to: "/$organizationSlug/updates/$id",
            params: { id: post.id, organizationSlug },
          });
        },
        onError: () => {
          Toaster.error("Couldn't create draft", {
            description:
              "Something went wrong while creating your draft. Please try again.",
            id: toastId,
          });
        },
      }
    );
  };

  if (pendingCommits.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between gap-4 border-neutral-100 border-b bg-neutral-50 px-6 py-4">
      <Text.Root weight="medium">
        {pendingCommits.length} new commit
        {pendingCommits.length === 1 ? "" : "s"} since your last draft. Would
        you like to create a fresh draft with the latest changes?
      </Text.Root>
      <div className="flex gap-4 px-2.5">
        <LinkButton.Root
          isDisabled={isCreatingPost}
          onClick={handleCreateDraft}
        >
          Yes, create draft
        </LinkButton.Root>
        <LinkButton.Root
          className="text-neutral-500"
          isDisabled={isCreatingPost}
        >
          Dismiss
        </LinkButton.Root>
      </div>
    </div>
  );
};
