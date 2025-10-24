import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const EditorSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <Text.Root className="text-accent-500" size="lg" weight="medium">
              Write
            </Text.Root>
            <LandingSection.Title>
              Production-ready release notes in minutes, together.
            </LandingSection.Title>
            <LandingSection.Subtitle>
              Write side-by-side with your team - rough changes turn into
              polished, on-brand copy in minutes.
            </LandingSection.Subtitle>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-md border border-neutral-100 bg-white sm:col-span-2 md:h-full">
            <div className="relative flex aspect-[16/9] flex-1 md:aspect-auto">
              <div className="absolute top-0 right-0 left-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
              <div className="w-full flex-1 bg-[url('/public/collaboration.png')] bg-center bg-cover bg-no-repeat" />
              <div className="absolute right-0 bottom-0 left-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />
            </div>
            <Text.Root className="text-balance p-4" size="lg" weight="medium">
              Live multi-cursor editing.{" "}
              <span className="font-weight-400 text-neutral-500">
                Type together, not over each other.
              </span>
            </Text.Root>
          </div>

          <div className="flex flex-col overflow-hidden rounded-md border border-neutral-100 bg-white">
            <div className="relative">
              <div className="aspect-[4/3] w-full bg-[url('/public/rich-editor.png')] bg-cover bg-top bg-no-repeat" />
              <div className="absolute right-0 bottom-0 left-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <Text.Root className="text-balance p-4" size="lg" weight="medium">
                Rich Editor.{" "}
                <span className="font-weight-400 text-neutral-500">
                  Headings, code, images, embeds... everything you need.
                </span>
              </Text.Root>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-md border border-neutral-100 bg-white">
            <div className="relative">
              <div className="absolute top-0 right-0 left-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
              <div className="aspect-[4/3] w-full bg-[url('/public/schedule.png')] bg-center bg-cover bg-no-repeat" />
              <div className="absolute right-0 bottom-0 left-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="flex flex-1 flex-col justify-end">
              <Text.Root className="text-balance p-4" size="lg" weight="medium">
                Drafts & Scheduling.{" "}
                <span className="font-weight-400 text-neutral-500">
                  Write now, publish later.
                </span>
              </Text.Root>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-md border border-neutral-100 bg-white sm:col-span-2 md:h-full">
            <div className="relative flex aspect-[16/9] flex-1 md:aspect-auto">
              <div className="absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />
              <div className="w-full flex-1 bg-[top,left] bg-[url('/public/github.png')] bg-cover bg-no-repeat" />
              <div className="absolute right-0 bottom-0 left-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />
            </div>
            <Text.Root className="text-balance p-4" size="lg" weight="medium">
              AI outline from GitHub commits.{" "}
              <span className="font-weight-400 text-neutral-500">
                Turn merged PRs into a draft in seconds.
              </span>
            </Text.Root>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
