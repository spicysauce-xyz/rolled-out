import { Confirmer } from "@components/confirmer";
import { LogoutSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { api, SuccessResponse } from "@lib/api";
import { Avatar, Button, Text, Toaster } from "@mono/ui";
import type { InferResponseType } from "hono";
import { useLeaveOrganizationMutation } from "../hooks/use-leave-organization";

type Organization = SuccessResponse<
  InferResponseType<(typeof api.me)["organizations"]["$get"]>
>[number];

interface OrganizationItemProps {
  data: Organization;
  isActive: boolean;
}

export const OrganizationItem: React.FC<OrganizationItemProps> = ({
  data,
  isActive,
}) => {
  const { mutateAsync: leaveOrganization } = useLeaveOrganizationMutation();

  const handleLeave = () => {
    Confirmer.confirm({
      title: "Leave organization",
      description: `Are you sure you want to leave ${data.name}?`,
      phrase: data.slug,
      action: {
        icon: LogoutSquare02Icon,
        label: "Yes, leave",
        color: "danger",
        run: () =>
          leaveOrganization(
            {
              organizationId: data.id,
            },
            {
              onSuccess() {
                Toaster.success("Left organization", {
                  description: `You’ve successfully left ${data.name}.`,
                });
              },
              onError() {
                Toaster.error("Couldn't leave organization", {
                  description: "Something went wrong. Please try again.",
                });
              },
            }
          ),
      },
    });
  };

  return (
    <div className="group flex items-start justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar.Root className="size-10 rounded-md">
            <Avatar.Image src={data?.logo || ""} />
            <Avatar.Fallback>{data?.name[0]}</Avatar.Fallback>
          </Avatar.Root>
          {isActive && (
            <div className="-right-1.5 -top-1.5 absolute flex items-center justify-center rounded-full bg-accent-500 px-0.75 text-[8px] text-white">
              Active
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <Text.Root weight="medium">{data?.name}</Text.Root>
          <Text.Root className="capitalize" color="muted" size="sm">
            {data.role}
          </Text.Root>
        </div>
      </div>
      <Button.Root
        className="opacity-0 transition-[background-color,border-color,opacity] group-hover:opacity-100"
        onClick={handleLeave}
        variant="tertiary"
      >
        <Button.Icon
          render={<HugeiconsIcon icon={LogoutSquare02Icon} strokeWidth={2} />}
        />
        Leave
      </Button.Root>
    </div>
  );
};
