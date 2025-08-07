import { LandingSection } from "@components/section";
import { Text } from "@mono/ui";

export const EditorSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <Text.Root className="text-accent-500" weight="medium">
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
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="flex-1" />
            <Text.Root className="text-balance" weight="medium">
              Live multi-cursor editing.{" "}
              <span className="font-weight-400 text-neutral-500">
                See teammates type in real time—no more v3_final.docx chaos.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root className="text-balance" weight="medium">
              Rich WYSIWYG + Markdown.{" "}
              <span className="font-weight-400 text-neutral-500">
                Headings, code, images, embeds—all.
              </span>
            </Text.Root>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="aspect-[16/9] w-full" />
            <Text.Root className="text-balance" weight="medium">
              Drafts & Scheduling.{" "}
              <span className="font-weight-400 text-neutral-500">
                Write now, queue for launch day with a single click.
              </span>
            </Text.Root>
          </div>
          <div className="col-span-2 flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-4">
            <div className="flex-1" />
            <Text.Root className="text-balance" weight="medium">
              AI outline from GitHub commits.{" "}
              <span className="font-weight-400 text-neutral-500">
                Turn merged PRs into a ready-to-edit draft in seconds.
              </span>
            </Text.Root>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
