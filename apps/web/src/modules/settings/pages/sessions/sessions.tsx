import * as Card from "@components/card";
import * as Confirmer from "@components/feedback/confirmer";
import * as Transition from "@components/transition";
import { sessionsQuery } from "@lib/api/queries";
import type { authClient } from "@lib/auth";
import { useLogoutMutation } from "@modules/auth/hooks/useLogoutMutation";
import { useSession } from "@modules/auth/hooks/useSession";
import { Button, Skeleton, Text } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  BanIcon,
  LogOutIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { match } from "ts-pattern";
import { UAParser } from "ua-parser-js";
import { useTerminateOtherSessionsMutation } from "./hooks/useTerminateOtherSessionsMutation";
import { useTerminateSessionMutation } from "./hooks/useTerminateSessionMutation";

export const Route = createFileRoute(
  "/_authorized/_has-organization/$organizationSlug/settings/sessions",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentSessionData } = useSession();
  const logoutMutation = useLogoutMutation();

  const sessionsData = useQuery(sessionsQuery());

  const terminateSessionMutation = useTerminateSessionMutation();

  const handleTerminateSession = async (
    session: (typeof authClient.$Infer.Session)["session"],
  ) => {
    const parser = new UAParser(session.userAgent || "");
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const confirmed = await Confirmer.confirm({
      title: "Terminate Session",
      description: (
        <>
          Are you sure you want to terminate{" "}
          <Text.Root size="sm" weight="medium" asChild>
            <span>
              {browser.name} on {os.name} ({os.version})
            </span>
          </Text.Root>{" "}
          session?
        </>
      ),
      action: {
        icon: BanIcon,
        label: "Terminate",
        color: "danger",
      },
    });

    if (!confirmed) return;

    await terminateSessionMutation.mutateAsync({
      sessionToken: session.token,
    });
  };

  const terminateOtherSessionsMutation = useTerminateOtherSessionsMutation();

  const handleTerminateOtherSessions = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Terminate Other Sessions",
      description: "Are you sure you want to terminate all other sessions?",
      phrase: "yes",
      action: {
        icon: BanIcon,
        label: "Terminate",
        color: "danger",
      },
    });

    if (!confirmed) return;

    await terminateOtherSessionsMutation.mutateAsync();
  };

  const handleLogout = async () => {
    const confirmed = await Confirmer.confirm({
      title: "Logout",
      description: "Are you sure you want to logout?",
      action: {
        icon: LogOutIcon,
        label: "Logout",
        color: "danger",
      },
    });

    if (!confirmed) return;

    await logoutMutation.mutateAsync();
  };

  return (
    <Card.Root>
      <Card.Header>
        <Card.HeaderCopy>
          <Card.HeaderTitle>Devices & Sessions</Card.HeaderTitle>
          <Card.HeaderDescription>
            Manage your active sessions and devices
          </Card.HeaderDescription>
        </Card.HeaderCopy>
      </Card.Header>
      <Card.Content>
        <Transition.Root>
          {match(sessionsData)
            .with({ isPending: true }, () => (
              <Transition.Item key="loading">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Skeleton.Root className="size-10 rounded-md" />
                    <div className="flex flex-col gap-2">
                      <Skeleton.Root className="h-3.5 w-40 rounded-xs" />
                      <Skeleton.Root className="h-3 w-28 rounded-xs" />
                    </div>
                  </div>
                </div>
              </Transition.Item>
            ))
            .with({ isError: true }, () => (
              <Transition.Item key="error">
                <div>Error</div>
              </Transition.Item>
            ))
            .otherwise(({ data }) => (
              <Transition.Item key="list" className="flex flex-col gap-4">
                {data.map((session) => {
                  const parser = new UAParser(session.userAgent || "");
                  const browser = parser.getBrowser();
                  const os = parser.getOS();
                  const device = parser.getDevice();
                  const isCurrentSession =
                    session.id === currentSessionData?.data?.session.id;

                  return (
                    <div
                      className="group flex items-start justify-between gap-4"
                      key={session.id}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative size-10 rounded-md border border-neutral-100 bg-neutral-50">
                          <div className="flex size-full items-center justify-center">
                            {match(device)
                              .with({ type: "mobile" }, () => (
                                <SmartphoneIcon className="size-4" />
                              ))
                              .with({ type: "tablet" }, () => (
                                <TabletIcon className="size-4" />
                              ))
                              .otherwise(() => (
                                <MonitorIcon className="size-4" />
                              ))}
                          </div>
                          {isCurrentSession && (
                            <div className="-right-1.5 -top-1.5 absolute flex size-3 items-center justify-center rounded-full bg-white p-0.75">
                              <div className="h-full w-full animate-pulse rounded-full bg-success-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <Text.Root size="sm" weight="medium">
                            {browser.name} on {os.name} ({os.version})
                          </Text.Root>
                          <Text.Root size="xs" color="muted">
                            Logged in on {format(session.createdAt, "MMM d")}
                          </Text.Root>
                        </div>
                      </div>
                      {isCurrentSession ? (
                        <Button.Root
                          onClick={handleLogout}
                          className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
                          variant="tertiary"
                        >
                          <Button.Icon>
                            <LogOutIcon />
                          </Button.Icon>
                          Logout
                        </Button.Root>
                      ) : (
                        <Button.Root
                          onClick={() => handleTerminateSession(session)}
                          className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
                          variant="tertiary"
                        >
                          <Button.Icon>
                            <BanIcon />
                          </Button.Icon>
                          Terminate
                        </Button.Root>
                      )}
                    </div>
                  );
                })}
              </Transition.Item>
            ))}
        </Transition.Root>
      </Card.Content>
      {sessionsData.data && sessionsData.data.length > 1 && (
        <Card.Footer>
          <Button.Root
            variant="secondary"
            color="danger"
            onClick={handleTerminateOtherSessions}
          >
            <Button.Icon>
              <BanIcon />
            </Button.Icon>
            Terminate Other Sessions
          </Button.Root>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
