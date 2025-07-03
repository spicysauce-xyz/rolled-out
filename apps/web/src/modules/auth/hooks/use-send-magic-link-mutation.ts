import { authClient } from "@lib/auth";
import { Toaster } from "@mono/ui";
import { useMutation } from "@tanstack/react-query";

export const useSendMagicLinkMutation = () =>
  useMutation({
    mutationFn: async (data: { email: string; callbackURL: string }) => {
      const response = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL: data.callbackURL,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    onSuccess: () => {
      Toaster.success("Magic link sent");
    },
    onError: (error) => {
      Toaster.error("Error", { description: error.message });
    },
  });
