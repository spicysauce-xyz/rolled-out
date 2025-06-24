import { authClient } from "@lib/auth";
import { useMutation } from "@tanstack/react-query";

export const useSocialLoginMutation = () =>
  useMutation({
    mutationFn: async (data: {
      provider: "google" | "github";
      callbackURL: string;
    }) => {
      const response = await authClient.signIn.social({
        provider: data.provider,
        callbackURL: data.callbackURL,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
