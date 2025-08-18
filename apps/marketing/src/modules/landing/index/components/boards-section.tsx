import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const BoardsSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <Text.Root className="text-success-500" size="lg" weight="medium">
              Organize
            </Text.Root>
            <LandingSection.Title>
              Updates that sort themselves.
            </LandingSection.Title>
            <LandingSection.Subtitle>
              Organize releases into boards so each audience sees exactly what
              matters - nothing extra, nothing missing.
            </LandingSection.Subtitle>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root size="lg" weight="medium">
              Rules, not rituals.{" "}
              <span className="font-weight-400 text-neutral-500">
                Set keywords or labels once and new releases route themselves to
                the right board.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root size="lg" weight="medium">
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
