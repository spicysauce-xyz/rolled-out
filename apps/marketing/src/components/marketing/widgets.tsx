import { Button, Text } from "@mono/ui";
import { LandingSection } from "../shared/section";

export const WidgetsSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text.Root className="text-warning-500" size="sm" weight="medium">
                Publish
              </Text.Root>
              <LandingSection.Title> Widgets & Emails </LandingSection.Title>
            </div>
            <LandingSection.Subtitle>
              Push updates to in-app widgets, email, and web with one click—so
              no user misses a thing, wherever they are.
            </LandingSection.Subtitle>
          </div>
          <div className="flex gap-6">
            <Button.Root color="warning">Learn More</Button.Root>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root size="sm" weight="medium">
              Rules, not rituals.
              <span className="font-weight-400 text-neutral-500">
                Set keywords or labels once and new releases route themselves to
                the right board.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root size="sm" weight="medium">
              Feels like home.{" "}
              <span className="font-weight-400 text-neutral-500">
                Your colors, logo, and domain make the changelog look native,
                not bolted on.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root size="sm" weight="medium">
              Always in the right place.
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
