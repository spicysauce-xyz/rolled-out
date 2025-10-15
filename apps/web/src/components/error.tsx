import { useInitializePosthog } from "@lib/posthog";
import { Text } from "@mono/ui";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { AlertOctagonIcon } from "lucide-react";
import { useEffect } from "react";

export const GlobalError: React.FC<ErrorComponentProps> = ({ error, info }) => {
  const posthog = useInitializePosthog();

  useEffect(() => {
    posthog.captureException(error, info);
  }, [error, info, posthog]);

  return (
    <div className="flex h-[100vh] w-screen flex-col items-center justify-center gap-4">
      <AlertOctagonIcon className="size-10 text-danger-500" />
      <div className="flex flex-col gap-1 text-center">
        <Text.Root weight="medium">Oops, something went wrong</Text.Root>
        <Text.Root color="muted" size="sm">
          Error: {error.message}
        </Text.Root>
      </div>
      <Text.Root color="muted" size="sm">
        support@rolledout.xyz
      </Text.Root>
    </div>
  );
};
