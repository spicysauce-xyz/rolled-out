import { Button, Text } from "@mono/ui";
import { LandingSection } from "../shared/section";

export const BoardsSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text.Root className="text-success-500" size="sm" weight="medium">
                Organize
              </Text.Root>
              <LandingSection.Title> Dynamic Boards </LandingSection.Title>
            </div>
            <LandingSection.Subtitle>
              A board is a branded page that shows only the updates you tag for
              it. Group releases into boards so every audience sees only what
              matters.
            </LandingSection.Subtitle>
            <div className="w-fit rounded-md bg-neutral-100 px-2 py-1">
              <Text.Root size="sm" weight="medium">
                Teams that segment see 23% higher CTR
              </Text.Root>
            </div>
          </div>
          <div className="flex gap-6">
            <Button.Root color="success">Create Your First Board</Button.Root>
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
