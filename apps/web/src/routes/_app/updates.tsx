import { LinkButton, Text } from "@mono/ui";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import * as Page from "../../components/layout/page";

export const Route = createFileRoute("/_app/updates")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page.Root>
      <Page.Header>
        <LinkButton.Root>
          <LinkButton.Icon>
            <PlusIcon />
          </LinkButton.Icon>
          New update
        </LinkButton.Root>
      </Page.Header>
      <Page.Content className="flex flex-col">
        <div className="relative mx-auto flex max-w-264 items-start">
          <div className="sticky top-6 flex w-33 flex-col gap-4">
            <Text.Root color="muted" size="sm" className="h-7.5 content-end">
              Jan 20th, 2023
            </Text.Root>
          </div>
          <div className="flex-1 px-6">
            <Text.Root
              size="sm"
              variant="display"
              weight="medium"
              className="mb-4"
            >
              Initiative updates
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/ad882d526c5847f8f200c5606d351c6b255c4549-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Write initiative updates to report on progress and summarize work
              across multiple projects. Important changes like revised target
              dates are automatically appended to updates. From the initiatives
              list, monitor health across all initiatives, quickly read
              individual updates, and leave feedback.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/d3501ace38d994ced5085182224ab8472d095323-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Configure initiative updates to cross-post to Slack for additional
              visibility. Comments and reactions sync bi-directionally and
              appear in both Linear and Slack.
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
          </div>
        </div>
        <div className="h-px bg-neutral-100" />
        <div className="relative mx-auto flex max-w-264 items-start">
          <div className="sticky top-6 w-33">
            <Text.Root color="muted" size="sm">
              Jan 20th, 2023
            </Text.Root>
          </div>
          <div className="flex-1 flex-col px-6">
            <Text.Root
              size="sm"
              variant="display"
              weight="medium"
              className="mb-4"
            >
              Initiative updates
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/ad882d526c5847f8f200c5606d351c6b255c4549-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Write initiative updates to report on progress and summarize work
              across multiple projects. Important changes like revised target
              dates are automatically appended to updates. From the initiatives
              list, monitor health across all initiatives, quickly read
              individual updates, and leave feedback.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/d3501ace38d994ced5085182224ab8472d095323-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Configure initiative updates to cross-post to Slack for additional
              visibility. Comments and reactions sync bi-directionally and
              appear in both Linear and Slack.
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
          </div>
        </div>
        <div className="h-px bg-neutral-100" />
        <div className="relative mx-auto flex max-w-264 items-start">
          <div className="sticky top-6 w-33">
            <Text.Root color="muted" size="sm">
              Jan 20th, 2023
            </Text.Root>
          </div>
          <div className="flex-1 flex-col px-6">
            <Text.Root
              size="sm"
              variant="display"
              weight="medium"
              className="mb-4"
            >
              Initiative updates
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/ad882d526c5847f8f200c5606d351c6b255c4549-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Write initiative updates to report on progress and summarize work
              across multiple projects. Important changes like revised target
              dates are automatically appended to updates. From the initiatives
              list, monitor health across all initiatives, quickly read
              individual updates, and leave feedback.
            </Text.Root>
            <img
              src="https://webassets.linear.app/images/ornj730p/production/d3501ace38d994ced5085182224ab8472d095323-3312x1732.png?q=95&auto=format&dpr=2"
              className="my-6 w-full rounded-xl"
              alt="asdf"
            />
            <Text.Root color="muted" className="my-2">
              Configure initiative updates to cross-post to Slack for additional
              visibility. Comments and reactions sync bi-directionally and
              appear in both Linear and Slack.
            </Text.Root>
            <Text.Root color="muted" className="my-2">
              The latest initiative and project updates now display in their
              respective overview tabs.
            </Text.Root>
          </div>
        </div>
      </Page.Content>
    </Page.Root>
  );
}
