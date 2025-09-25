import { githubIntegrationPendingCommitsQuery } from "@lib/api/queries";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { LinkButton, Text, Toaster } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import _ from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const getDismissedLocalStorageKey = (
  organizationId: string,
  commitId: string
) => {
  return `dismissed-pending-commits:${organizationId}-${commitId}`;
};

interface ContentProps {
  pendingCommitsCount: number;
  lastCommitId: string;
  organizationId: string;
  isCreatingPost: boolean;
  handleCreateDraft: () => void;
}

const Content: React.FC<ContentProps> = ({
  pendingCommitsCount,
  lastCommitId,
  organizationId,
  isCreatingPost,
  handleCreateDraft,
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(
    localStorage.getItem(
      getDismissedLocalStorageKey(organizationId, lastCommitId)
    ) === "true"
  );

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(
      getDismissedLocalStorageKey(organizationId, lastCommitId),
      "true"
    );
  };

  return (
    <AnimatePresence>
      {!isDismissed && pendingCommitsCount > 0 && (
        <motion.div
          animate={{ height: 53 }}
          className="flex-shrink-0 overflow-hidden border-neutral-100 border-b bg-neutral-50"
          exit={{ height: 0 }}
          initial={{ height: 0 }}
        >
          <div className="flex justify-between gap-4 px-6 py-4">
            <Text.Root weight="medium">
              {pendingCommitsCount} new commit
              {pendingCommitsCount === 1 ? "" : "s"} since your last draft.
              Would you like to create a fresh draft with the latest changes?
            </Text.Root>
            <div className="flex gap-4 px-2.5">
              <LinkButton.Root
                isDisabled={isCreatingPost}
                onClick={handleCreateDraft}
              >
                Yes, create draft
              </LinkButton.Root>
              <LinkButton.Root
                className={cn(!isCreatingPost && "text-neutral-500")}
                isDisabled={isCreatingPost}
                onClick={handleDismiss}
              >
                Dismiss
              </LinkButton.Root>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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

  if (import.meta.env.SSR) {
    return null;
  }

  return (
    <Content
      handleCreateDraft={handleCreateDraft}
      isCreatingPost={isCreatingPost}
      lastCommitId={_.first(pendingCommits)?.id || ""}
      organizationId={organizationId}
      pendingCommitsCount={pendingCommits.length}
    />
  );
};
