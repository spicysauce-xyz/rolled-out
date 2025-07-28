/** biome-ignore-all lint/a11y/noStaticElementInteractions: for interactivity */
/** biome-ignore-all lint/nursery/noNoninteractiveElementInteractions: for interactivity */
import { useGSAP } from "@gsap/react";
import { Button, Text } from "@mono/ui";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  CalendarIcon,
  CodeIcon,
  CopyIcon,
  GitMergeIcon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
} from "lucide-react";
import { useRef } from "react";
import { LandingSection } from "../shared/section";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(SplitText);

const RichEditorCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const tl = useRef<GSAPTimeline>(null);

  useGSAP(
    () => {
      const padding = 16;

      const containerHeight =
        containerRef.current?.getBoundingClientRect()?.height ?? 0;
      const textHeight = textRef.current?.getBoundingClientRect().height ?? 0;
      const itemsHeight = itemsRef.current?.getBoundingClientRect().height ?? 0;

      const visibleHeight = containerHeight - textHeight;

      tl.current = gsap.timeline({ defaults: { duration: 0.3 }, paused: true });

      const items = Array.from(itemsRef.current?.children || []);

      for (const [index, item] of items.entries()) {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        if (!isFirst) {
          tl.current.set(item, {
            attr: { "data-active": "false" },
          });

          tl.current.to(item, {
            attr: { "data-active": "true" },
            duration: 0.3,
            ease: "none",
          });
        }

        if (!isLast) {
          tl.current.set(item, {
            attr: { "data-active": "false" },
          });
        }
      }

      tl.current.to(
        itemsRef.current,
        {
          y: visibleHeight - itemsHeight - padding * 2,
          duration: 0.3 * (items.length - 1),
        },
        "0"
      );
    },
    { scope: itemsRef }
  );

  return (
    <div
      className="flex flex-col gap-4 "
      onMouseEnter={() => {
        tl.current?.play();
      }}
      onMouseLeave={() => {
        tl.current?.reverse();
      }}
    >
      <div
        className="relative aspect-square h-full w-full flex-1 overflow-hidden rounded-md border border-neutral-100 bg-white p-4"
        ref={containerRef}
      >
        <div className="flex w-full flex-col gap-1" ref={itemsRef}>
          {[
            {
              Icon: Heading2Icon,
              text: "Heading 2",
            },
            {
              Icon: Heading3Icon,
              text: "Heading 3",
            },
            {
              Icon: ImageIcon,
              text: "Image",
            },
            {
              Icon: QuoteIcon,
              text: "Quote",
            },
            {
              Icon: ListIcon,
              text: "Bullet List",
            },
            {
              Icon: ListOrderedIcon,
              text: "Ordered List",
            },
          ].map(({ Icon, text }, index) => (
            <div
              className="group flex h-10 items-center gap-3 rounded-md bg-white px-3 transition-colors data-[active=true]:bg-neutral-50"
              data-active={index === 0}
              key={text}
            >
              <Icon className="size-4 stroke-neutral-400 transition-colors group-data-[active=true]:stroke-neutral-500" />
              <Text.Root
                className="transition-colors group-data-[active=true]:text-neutral-900"
                color="muted"
                data-text
                weight="medium"
              >
                {text}
              </Text.Root>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 ">
        <Text.Root className="z-10 text-balance" size="sm" weight="medium">
          Rich WYSIWYG + Markdown.{" "}
          <span className="font-weight-400 text-neutral-500">
            Headings, code, images, embeds—all.
          </span>
        </Text.Root>
      </div>
    </div>
  );
};

const ScheduleCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dateItemsRef = useRef<HTMLDivElement>(null);
  const timeItemsRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    const itemHeight = 40;

    tl.current = gsap.timeline({ defaults: { duration: 0.3 }, paused: true });

    for (let i = 1; i <= 3; i++) {
      tl.current.to(timeItemsRef.current, {
        y: -itemHeight * i,
      });
    }

    tl.current.to(
      dateItemsRef.current,
      {
        y: -itemHeight,
      },
      "0"
    );
  });

  return (
    <div
      className="flex flex-col gap-4"
      onMouseEnter={() => tl.current?.play()}
      onMouseLeave={() => tl.current?.reverse()}
      ref={containerRef}
    >
      <div className="flex aspect-square h-full w-full flex-col justify-center overflow-hidden rounded-md border border-neutral-100 bg-white px-4">
        <div className="flex h-full w-full flex-col justify-center">
          <div className="z-10 flex-1 bg-gradient-to-t from-transparent via-20% via-white/50 to-white" />
          <div className="flex h-10 items-center gap-3 rounded-md bg-neutral-50 px-3 pr-11">
            <CalendarIcon className="size-4 stroke-neutral-500" />
            <div className="flex flex-1 justify-center gap-2">
              <div className="flex flex-col" ref={dateItemsRef}>
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map(
                  (day) => (
                    <div
                      className="flex h-10 items-center justify-end"
                      key={day}
                    >
                      <Text.Root weight="medium">July {day}</Text.Root>
                    </div>
                  )
                )}
              </div>
              <div className="flex flex-col" ref={timeItemsRef}>
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                  <div className="flex h-10 items-center" key={hour}>
                    <Text.Root weight="medium">{hour}:00 PM</Text.Root>
                  </div>
                ))}
                {[12, 1, 2, 3, 4].map((hour) => (
                  <div className="flex h-10 items-center" key={hour}>
                    <Text.Root weight="medium">{hour}:00 AM</Text.Root>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="z-10 flex-1 bg-gradient-to-b from-transparent via-20% via-white/50 to-white" />
        </div>
      </div>
      <div className="px-4">
        <Text.Root className="z-10 text-balance" size="sm" weight="medium">
          Drafts & Scheduling.{" "}
          <span className="font-weight-400 text-neutral-500">
            Write now, queue for launch day with a single click.
          </span>
        </Text.Root>
      </div>
    </div>
  );
};

const GithubCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const commitItemsRef = useRef<HTMLDivElement>(null);
  const changelogTextRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    // const itemHeight = 40;

    tl.current = gsap.timeline({ defaults: { duration: 0.3 }, paused: true });

    const commitItems = Array.from(
      commitItemsRef.current?.children || []
    ).reverse() as HTMLElement[];

    for (const item of commitItems) {
      tl.current.to(item, {
        opacity: 0,
        duration: 0.1,
      });
    }

    tl.current.to(commitItemsRef.current, {
      opacity: 0,
      duration: 0.1,
    });

    tl.current.to(
      changelogTextRef.current,
      {
        opacity: 1,
        duration: 0.1,
      },
      "<"
    );

    const split = new SplitText(changelogTextRef.current, {
      type: "words",
    });

    tl.current.fromTo(
      split.words,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        stagger: 0.01,
        duration: 0.3,
      }
    );
  });

  return (
    <div
      className="relative col-span-2 flex h-full w-full flex-col gap-4 overflow-hidden rounded-md"
      onMouseEnter={() => tl.current?.play()}
      onMouseLeave={() => tl.current?.reverse()}
      ref={containerRef}
    >
      <div className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-md border border-neutral-100 bg-white">
        <div
          className="absolute inset-4 flex flex-1 flex-col divide-y divide-neutral-100 overflow-hidden"
          ref={commitItemsRef}
        >
          <div className="flex justify-between gap-2 pb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <GitMergeIcon className="size-4 stroke-success-500" />
                <Text.Root weight="medium">
                  feat: add real-time collaboration
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs">
                sarah committed 2 days ago
              </Text.Root>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-success-500 px-2 py-0.5">
                <Text.Root color="success" size="xs" weight="medium">
                  Verified
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs" weight="medium">
                8def4a2
              </Text.Root>
              <CopyIcon className="size-4 stroke-neutral-400" />
              <CodeIcon className="size-4 stroke-neutral-400" />
            </div>
          </div>
          <div className="flex justify-between gap-2 py-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <GitMergeIcon className="size-4 stroke-success-500" />
                <Text.Root weight="medium">
                  fix: improve loading performance
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs">
                alex committed 3 days ago
              </Text.Root>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-success-500 px-2 py-0.5">
                <Text.Root color="success" size="xs" weight="medium">
                  Verified
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs" weight="medium">
                3bac91e
              </Text.Root>
              <CopyIcon className="size-4 stroke-neutral-400" />
              <CodeIcon className="size-4 stroke-neutral-400" />
            </div>
          </div>
          <div className="flex justify-between gap-2 py-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <GitMergeIcon className="size-4 stroke-success-500" />
                <Text.Root weight="medium">
                  feat: add AI-powered suggestions
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs">
                michael committed 4 days ago
              </Text.Root>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-success-500 px-2 py-0.5">
                <Text.Root color="success" size="xs" weight="medium">
                  Verified
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs" weight="medium">
                5cfe2d7
              </Text.Root>
              <CopyIcon className="size-4 stroke-neutral-400" />
              <CodeIcon className="size-4 stroke-neutral-400" />
            </div>
          </div>
          <div className="flex justify-between gap-2 py-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <GitMergeIcon className="size-4 stroke-success-500" />
                <Text.Root weight="medium">
                  feat: implement tag management
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs">
                emma committed 5 days ago
              </Text.Root>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-success-500 px-2 py-0.5">
                <Text.Root color="success" size="xs" weight="medium">
                  Verified
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs" weight="medium">
                7def9b1
              </Text.Root>
              <CopyIcon className="size-4 stroke-neutral-400" />
              <CodeIcon className="size-4 stroke-neutral-400" />
            </div>
          </div>
          <div className="flex justify-between gap-2 py-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <GitMergeIcon className="size-4 stroke-success-500" />
                <Text.Root weight="medium">
                  fix: resolve merge conflicts
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs">
                james committed 6 days ago
              </Text.Root>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full border border-success-500 px-2 py-0.5">
                <Text.Root color="success" size="xs" weight="medium">
                  Verified
                </Text.Root>
              </div>
              <Text.Root color="muted" size="xs" weight="medium">
                2abc45f
              </Text.Root>
              <CopyIcon className="size-4 stroke-neutral-400" />
              <CodeIcon className="size-4 stroke-neutral-400" />
            </div>
          </div>
        </div>
        <div
          className="absolute inset-4 flex flex-col gap-4 bg-white opacity-0"
          ref={changelogTextRef}
        >
          <Text.Root className="text-balance" weight="medium">
            Product Updates - July 2025
          </Text.Root>

          <div className="flex flex-col gap-2">
            <Text.Root size="sm" weight="medium">
              Real-time Collaboration
            </Text.Root>
            <Text.Root color="muted" size="xs">
              Work together in real-time with your team - see each other's
              cursors, edits, and comments as they happen. No more waiting for
              others to finish before you can start working.
            </Text.Root>
          </div>

          <div className="flex flex-col gap-2">
            <Text.Root size="sm" weight="medium">
              Smart Tags
            </Text.Root>
            <Text.Root color="muted" size="xs">
              Introducing smart tags to help you organize your content library.
              Easily categorize, filter, and find the right content when you
              need it. Perfect for managing multiple product lines or content
              types.
            </Text.Root>
          </div>

          <div className="flex flex-col gap-4">
            <Text.Root size="sm" weight="medium">
              Version Control
            </Text.Root>
            <Text.Root color="muted" size="xs">
              We've streamlined our version control system to prevent any
              conflicts when multiple team members are working on the same
              content.
            </Text.Root>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Text.Root size="sm" weight="medium">
          AI outline from GitHub commits.{" "}
          <span className="font-weight-400 text-neutral-500">
            Turn merged PRs into a ready-to-edit draft in seconds. And
            blablabla. And more.
          </span>
        </Text.Root>
      </div>
    </div>
  );
};

export const EditorSection = () => {
  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text.Root className="text-accent-500" size="sm" weight="medium">
                Compose
              </Text.Root>
              <LandingSection.Title>Collaborative Editor</LandingSection.Title>
            </div>
            <LandingSection.Subtitle>
              Write, polish, and queue every update in one focused workspace—so
              your team moves faster and your users always know what’s new.
            </LandingSection.Subtitle>
          </div>
          <div className="flex gap-6">
            <Button.Root color="accent">Try the Editor</Button.Root>
          </div>
        </LandingSection.Header>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex h-full w-full flex-col gap-4">
            <div className="h-full w-full rounded-md border border-neutral-100 bg-white p-4" />
            <div className="px-4">
              <Text.Root className="text-balance" size="sm" weight="medium">
                Feature One-liner for the landing Live multi-cursor editing.{" "}
                <span className="font-weight-400 text-neutral-500">
                  See teammates type in real time—no more v3_final.docx chaos.
                </span>
              </Text.Root>
            </div>
          </div>
          <RichEditorCard />
          <ScheduleCard />
          <GithubCard />
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
