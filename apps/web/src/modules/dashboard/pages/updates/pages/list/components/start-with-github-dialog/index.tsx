import type { api, SuccessResponse } from "@lib/api";
import { useCreateUpdateMutation } from "@modules/dashboard/hooks/use-create-update-mutation";
import { Dialog, Toaster } from "@mono/ui";
import { useNavigate } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { useState } from "react";
import { Content } from "./content";
import { RepositorySelector } from "./repository-selector";
import { getCommitId } from "./utils";

type Commit = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["repositories"][":repositoryId"]["commits"]["$get"]
  >
>[number];

type StartWithGithubDialogProps = {
  organizationSlug: string;
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const StartWithGithubDialog: React.FC<StartWithGithubDialogProps> = ({
  organizationSlug,
  organizationId,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  const [repositoryId, setRepositoryId] = useState<string | undefined>();
  const [selectedCommits, setSelectedCommits] = useState<Commit[]>([]);

  const { mutateAsync: createPost, isPending: isCreatingPost } =
    useCreateUpdateMutation();

  const handleCommitClick = (commit: Commit) => {
    if (isCreatingPost) {
      return;
    }

    setSelectedCommits((prev) => {
      const index = prev.findIndex(
        (c) => getCommitId(c) === getCommitId(commit)
      );

      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return [...prev, commit];
    });
  };

  const handleCreate = () => {
    createPost(
      { organizationId, githubIds: selectedCommits.map(getCommitId) },
      {
        onSuccess: (post) => {
          navigate({
            to: "/$organizationSlug/updates/$id",
            params: { id: post.id, organizationSlug },
          });
          onOpenChange(false);
          Toaster.success("Post created", {
            description: "Your post has been created successfully.",
          });
        },
        onError: () => {
          Toaster.error("Couldn't create post", {
            description:
              "Something went wrong while creating your post. Please try again.",
          });
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedCommits([]);
    }

    if (!isCreatingPost) {
      onOpenChange(isOpen);
    }
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Content className="max-h-[calc(100vh-4rem)] gap-0 p-0">
        <Dialog.Header className="flex-row justify-between border-neutral-100 border-b p-6">
          <div className="flex flex-col gap-2">
            <Dialog.Title>Create from GitHub</Dialog.Title>
            <Dialog.Description>
              Select commits or PRs to turn into a draft.
            </Dialog.Description>
          </div>
          <RepositorySelector
            onChange={setRepositoryId}
            organizationId={organizationId}
            value={repositoryId}
          />
        </Dialog.Header>
        <Content
          onCommitClick={handleCommitClick}
          organizationId={organizationId}
          repositoryId={repositoryId}
          selectedCommits={selectedCommits}
        />
        <Dialog.Footer className="border-neutral-100 border-t p-6">
          <Dialog.Cancel isDisabled={isCreatingPost}>Cancel</Dialog.Cancel>
          <Dialog.Action
            isDisabled={selectedCommits.length === 0}
            isLoading={isCreatingPost}
            onClick={handleCreate}
          >
            Create from {selectedCommits.length} commit
            {selectedCommits.length === 1 ? "" : "s"}
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
