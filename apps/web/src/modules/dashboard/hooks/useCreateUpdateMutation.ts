import { type SuccessResponse, api } from "@lib/api";
import type { ApiError } from "@mono/api";
import { Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";
import type { InferResponseType } from "hono";

type CreatedUpdate = SuccessResponse<
  InferResponseType<
    (typeof api.organizations)[":organizationId"]["posts"]["$post"]
  >
>;

interface UseCreateUpdateMutationArgs {
  onSuccess?: (update: CreatedUpdate) => void;
  onError?: (error: ApiError) => void;
}

export const useCreateUpdateMutation = (args?: UseCreateUpdateMutationArgs) =>
  useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await api.organizations[":organizationId"].posts.$post({
        param: {
          organizationId,
        },
        json: {},
      });

      const json = await response.json();

      if (!json.success) {
        throw json.error;
      }

      return json.data;
    },
    onMutate: () => {
      return { toastId: Toaster.loading("Creating new draft...") };
    },
    onSuccess: async (post, _, context) => {
      args?.onSuccess?.(post);

      Toaster.success("Successfully created new draft", {
        id: context.toastId,
      });
    },
    onError: (error, __, context) => {
      if (context) {
        Toaster.error("Error creating new draft", {
          description: error.message,
          id: context.toastId,
        });
      }
    },
  });
