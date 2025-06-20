import * as Confirmer from "@components/feedback/confirmer";
import { api } from "@lib/api";
import { Toaster } from "@mono/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArchiveIcon } from "lucide-react";

export const useUpdateManager = (id: string, organizationId: string) => {
  const queryClient = useQueryClient();

  const archiveUpdateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].archive.$post({
        param: {
          organizationId,
          id,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json;
    },
  });

  const archiveUpdate = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Archive Update",
      description: "Are you sure you want to archive this update?",
      action: {
        label: "Archive",
        icon: ArchiveIcon,
      },
    });

    if (!confirmed) {
      return;
    }

    const toastId = Toaster.loading("Archiving update...");

    await archiveUpdateMutation.mutateAsync(undefined, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["posts", organizationId],
        });

        Toaster.success("Update archived", {
          id: toastId,
        });
      },
      onError: (error) => {
        Toaster.error("Error", {
          description: error.message,
          id: toastId,
        });
      },
    });
  };

  const unarchiveUpdateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.organizations[":organizationId"].posts[
        ":id"
      ].unarchive.$post({
        param: {
          organizationId,
          id,
        },
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json;
    },
  });

  const unarchiveUpdate = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Unarchive Update",
      description:
        "Are you sure you want to unarchive this update? It will be moved to the drafts section.",
      action: {
        label: "Unarchive",
        icon: ArchiveIcon,
      },
    });

    if (!confirmed) {
      return;
    }

    const toastId = Toaster.loading("Unarchiving update...");

    await unarchiveUpdateMutation.mutateAsync(undefined, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["posts", organizationId],
        });

        Toaster.success("Update unarchived", {
          id: toastId,
        });
      },
      onError: (error) => {
        Toaster.error("Error", {
          description: error.message,
          id: toastId,
        });
      },
    });
  };

  return {
    archiveUpdate,
    unarchiveUpdate,
  };
};
