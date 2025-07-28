import { Text } from "@mono/ui";
import {
  type LucideIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  User2Icon,
} from "lucide-react";
import { LandingSection } from "../shared/section";

interface ProblemItemProps {
  Icon: LucideIcon;
  title: string;
  lines: React.ReactNode[];
}

const ProblemItem = ({ Icon, title, lines }: ProblemItemProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-success-50">
          <Icon className="size-4 text-success-500" />
        </div>
        <Text.Root weight="medium">{title}</Text.Root>
      </div>
      <div className="flex flex-col gap-2">
        {lines.map((line, index) => (
          <Text.Root
            // className="pl-6"
            color="muted"
            // biome-ignore lint/suspicious/noArrayIndexKey: never changes
            key={index}
            size="sm"
            weight="medium"
          >
            {line}
          </Text.Root>
        ))}
      </div>
    </div>
  );
};

export const ProblemSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <LandingSection.Title>
              Your next growth loop{" "}
              <span className="text-neutral-500">you didn’t know about.</span>
            </LandingSection.Title>
            <LandingSection.Subtitle>
              A segmented, in-app changelog turns each shipment into fuel for
              activation, adoption, and retention.
            </LandingSection.Subtitle>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-3 gap-4">
          <ProblemItem
            Icon={User2Icon}
            lines={[
              <>
                Dropbox Capture's revamped onboarding added a{" "}
                <span className="font-weight-600 text-success-500">
                  5% lift
                </span>{" "}
                in week-two returns.
              </>,
              <>
                Intercom's contextual nudges gave Mention a further{" "}
                <span className="font-weight-600 text-success-500">
                  15% activation bump.
                </span>
              </>,
            ]}
            title="Users discover value faster"
          />
          <ProblemItem
            Icon={TrendingUpIcon}
            lines={[
              <>
                JobNimbus saw a{" "}
                <span className="font-weight-600 text-success-500">25%</span>{" "}
                jump in just four weeks.
              </>,
              <>
                ResMan drove feature engagement from{" "}
                <span className="font-weight-600 text-success-500">12%</span> to{" "}
                <span className="font-weight-600 text-success-500">67%</span>{" "}
                with musical release notes.
              </>,
              <>
                Litmus used Appcues flows to spark a{" "}
                <span className="font-weight-600 text-success-500">2,100%</span>{" "}
                surge in usage of its Proof feature.
              </>,
            ]}
            title="Adoption takes off"
          />
          <ProblemItem
            Icon={TrendingDownIcon}
            lines={[
              <>
                Unolo's in-app NPS loops trimmed monthly churn by{" "}
                <span className="font-weight-600 text-success-500">0.5-1</span>{" "}
                percentage points.
              </>,
              <>
                Kissmetrics' 90-day engagement roadmap shaved{" "}
                <span className="font-weight-600 text-success-500">2</span>{" "}
                points off early-stage churn.
              </>,
            ]}
            title="Churn quietly shrinks"
          />
        </div>
        <Text.Root
          className="relative pl-6 after:absolute after:top-0 after:left-0 after:h-full after:w-2 after:rounded-md after:bg-neutral-100 after:content-['']"
          color="muted"
          size="sm"
        >
          Because every announcement goes only to the people it matters to—free
          users get upgrade nudges, power users get pro tips—your changelog
          stops just “informing” and starts guiding customers toward deeper
          usage and higher plans.
        </Text.Root>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
