import { Button, Text } from "@mono/ui";
import { ArrowRightIcon, PlayIcon } from "lucide-react";
import { LandingSection } from "../shared/section";

export const JumbotronSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <LandingSection.Title>
              Ship updates. Keep users hooked.
            </LandingSection.Title>
            <LandingSection.Subtitle>
              Rolled Out is the all-in-one toolkit for{" "}
              <span className="font-weight-500 text-accent-500">writing</span>,{" "}
              <span className="font-weight-500 text-success-500">
                organizing
              </span>
              , and{" "}
              <span className="font-weight-500 text-warning-500">
                publishing
              </span>{" "}
              your app’s changelog.
            </LandingSection.Subtitle>
          </div>
          <Text.Root
            className="relative pl-6 after:absolute after:top-0 after:left-0 after:h-full after:w-2 after:rounded-md after:bg-neutral-100 after:content-['']"
            color="muted"
            size="sm"
          >
            Open-source · Free forever tier
          </Text.Root>
          <div className="flex gap-2">
            <Button.Root>
              Get Started
              <Button.Icon>
                <ArrowRightIcon />
              </Button.Icon>
            </Button.Root>
            <Button.Root variant="tertiary">
              Live Demo
              <Button.Icon>
                <PlayIcon />
              </Button.Icon>
            </Button.Root>
          </div>
        </LandingSection.Header>
        <div className="flex w-full flex-col gap-1 rounded-md border border-neutral-100 bg-white p-1">
          <div className="flex items-center justify-between p-2.5">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-danger-500" />
              <div className="size-3 rounded-full bg-warning-500" />
              <div className="size-3 rounded-full bg-success-500" />
            </div>
          </div>
          <div className="flex aspect-[16/9] flex-1 rounded-sm border border-neutral-100 bg-neutral-50" />
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
