import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const WidgetsSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <Text.Root className="text-warning-500" weight="medium">
              Publish
            </Text.Root>
            <LandingSection.Title>
              One-click publishing, everywhere.
            </LandingSection.Title>
            <LandingSection.Subtitle>
              Deliver the release notes to your in-app widget, subscriber
              emails, and public changelog page all at the same time—so every
              user stays in the loop, no copy-paste required.
            </LandingSection.Subtitle>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root weight="medium">
              Rules, not rituals.{" "}
              <span className="font-weight-400 text-neutral-500">
                Set keywords or labels once and new releases route themselves to
                the right board.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root weight="medium">
              Feels like home.{" "}
              <span className="font-weight-400 text-neutral-500">
                Your colors, logo, and domain make the changelog look native,
                not bolted on.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root weight="medium">
              Always in the right place.{" "}
              <span className="font-weight-400 text-neutral-500">
                Boards and tags auto-sort every note—mobile users see mobile,
                finance sees billing.
              </span>
            </Text.Root>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
