import { Card } from "@components/card";
import { Confirmer } from "@components/confirmer";
import { Transition } from "@components/transition";
import { sessionsQuery } from "@lib/api/queries";
import type { authClient } from "@lib/auth";
import { useLogoutMutation } from "@modules/auth/hooks/use-logout-mutation";
import { useSession } from "@modules/auth/hooks/use-session";
import { Button, Skeleton, Text, Toaster } from "@mono/ui";
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
import { useTerminateOtherSessionsMutation } from "./hooks/use-terminate-other-sessions-mutation";
import { useTerminateSessionMutation } from "./hooks/use-terminate-session-mutation";

export const Route = createFileRoute("/_authorized/account/sessions")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentSessionData } = useSession();

  const sessionsData = useQuery(sessionsQuery());

  const { mutateAsync: terminateSession } = useTerminateSessionMutation();

  const handleTerminateSession = (
    session: (typeof authClient.$Infer.Session)["session"]
  ) => {
    const parser = new UAParser(session.userAgent || "");
    const browser = parser.getBrowser();
    const os = parser.getOS();

    Confirmer.confirm({
      title: "Terminate session",
      description: (
        <>
          Are you sure you want to terminate{" "}
          <Text.Root render={<span />} weight="medium">
            {browser.name} on {os.name} ({os.version})
          </Text.Root>{" "}
          session?
        </>
      ),
      action: {
        icon: BanIcon,
        label: "Yes, terminate",
        color: "danger",
        run: () =>
          terminateSession(
            {
              sessionToken: session.token,
            },
            {
              onSuccess() {
                Toaster.success("Session terminated", {
                  description: `The session on ${browser.name} (${os.name} ${os.version}) has been terminated.`,
                });
              },
              onError() {
                Toaster.error("Couldn't terminate session", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  const { mutateAsync: terminateOtherSessions } =
    useTerminateOtherSessionsMutation();

  const handleTerminateOtherSessions = () => {
    Confirmer.confirm({
      title: "Terminate other sessions",
      description:
        "Are you sure you want to terminate all other active sessions? You’ll stay signed in on this one.",
      action: {
        icon: BanIcon,
        label: "Yes, terminate",
        color: "danger",
        run: () =>
          terminateOtherSessions(undefined, {
            onSuccess() {
              Toaster.success("Sessions terminated", {
                description: "All other active sessions have been terminated.",
              });
            },
            onError() {
              Toaster.error("Couldn't terminate other sessions", {
                description: "Something went wrong. Please try again.",
              });
            },
          }),
      },
    });
  };

  const { mutateAsync: logout } = useLogoutMutation();

  const handleLogout = () => {
    Confirmer.confirm({
      title: "Log out",
      description: "Are you sure you want to log out?",
      action: {
        icon: LogOutIcon,
        label: "Yes, log out",
        color: "danger",
        run: () =>
          logout(undefined, {
            onSuccess() {
              Toaster.success("Logged out", {
                description: "You’ve been successfully logged out.",
              });
            },
            onError() {
              Toaster.error("Couldn't log out", {
                description: "Something went wrong. Please try again.",
              });
            },
          }),
      },
    });
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
              <Transition.Item className="flex flex-col gap-4" key="list">
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
                          <Text.Root weight="medium">
                            {browser.name} on {os.name} ({os.version})
                          </Text.Root>
                          <Text.Root color="muted" size="sm">
                            Logged in on {format(session.createdAt, "MMM d")}
                          </Text.Root>
                        </div>
                      </div>
                      {isCurrentSession ? (
                        <Button.Root
                          className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
                          onClick={handleLogout}
                          variant="tertiary"
                        >
                          <Button.Icon render={<LogOutIcon />} />
                          Logout
                        </Button.Root>
                      ) : (
                        <Button.Root
                          className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
                          onClick={() => handleTerminateSession(session)}
                          variant="tertiary"
                        >
                          <Button.Icon render={<BanIcon />} />
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
            color="danger"
            onClick={handleTerminateOtherSessions}
            variant="secondary"
          >
            <Button.Icon render={<BanIcon />} />
            Terminate Other Sessions
          </Button.Root>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
