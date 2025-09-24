import { LandingSection } from "@components/section";
import { useGSAP } from "@gsap/react";
import { Button, Text } from "@mono/ui";
import { gsap } from "gsap";
import { ArrowRightIcon } from "lucide-react";
import { useRef } from "react";

export const JumbotronSection = () => {
  const title = useRef<HTMLParagraphElement>(null);
  const subtitle = useRef<HTMLParagraphElement>(null);
  const buttons = useRef<HTMLDivElement>(null);
  const screenshot = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const TITLE_ANIMATION_DURATION = 1;
    const SUBTITLE_ANIMATION_START = 0.5;
    const SUBTITLE_ANIMATION_DURATION = 0.5;
    const BUTTONS_ANIMATION_START = 0.75;
    const BUTTONS_ANIMATION_DURATION = 0.5;
    const SCREENSHOT_ANIMATION_START = 1;
    const SCREENSHOT_ANIMATION_DURATION = 0.5;

    const tl = gsap.timeline();

    const titleWords = Array.from(title.current?.children ?? []);

    tl.to(titleWords, {
      opacity: 1,
      duration: TITLE_ANIMATION_DURATION / 2,
      stagger: TITLE_ANIMATION_DURATION / 2 / titleWords.length,
    });

    tl.to(
      subtitle.current,
      {
        opacity: 1,
        duration: SUBTITLE_ANIMATION_DURATION,
      },
      `${SUBTITLE_ANIMATION_START}`
    );

    tl.to(
      buttons.current,
      {
        opacity: 1,
        y: 0,
        duration: BUTTONS_ANIMATION_DURATION,
      },
      `${BUTTONS_ANIMATION_START}`
    );

    tl.to(
      screenshot.current,
      {
        opacity: 1,
        duration: SCREENSHOT_ANIMATION_DURATION,
      },
      `${SCREENSHOT_ANIMATION_START}`
    );
  });

  return (
    <LandingSection.Root>
      <LandingSection.Content>
        <LandingSection.Header>
          <div className="flex flex-col gap-4">
            <LandingSection.Title className="[&>span]:opacity-0" ref={title}>
              <span>Ship</span> <span>updates.</span> <span>Keep</span>{" "}
              <span>users</span> <span>hooked.</span>
            </LandingSection.Title>
            <LandingSection.Subtitle className="opacity-0" ref={subtitle}>
              Rolled Out is the all-in-one toolkit for writing, organizing , and
              publishing your app’s changelog.
            </LandingSection.Subtitle>
          </div>
          <div className="flex gap-2 opacity-0" ref={buttons}>
            <Button.Root size="lg">
              <span className="text-lg">Get Started</span>
              <Button.Icon render={<ArrowRightIcon />} />
            </Button.Root>
            <Button.Root
              render={
                <a
                  href="https://changelog.rolledout.xyz/"
                  rel="noopener"
                  target="_blank"
                />
              }
              size="lg"
              variant="tertiary"
            >
              <span className="text-lg">Live Demo</span>
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
          <div className="flex aspect-[16/9] flex-1 overflow-hidden rounded-sm border border-neutral-100 bg-neutral-50">
            <div
              className="flex-1 bg-center bg-cover opacity-0"
              ref={screenshot}
              style={{
                backgroundImage:
                  "url(https://cdn.dribbble.com/userupload/8490108/file/original-d8b02f177cb6bc660f1bf5a4456a92de.png?resize=2048x1536&vertical=center)",
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <Text.Root
            className="text-balance"
            size="xs"
            variant="display"
            weight="medium"
          >
            Trusted by 100+ companies
          </Text.Root>
          <div className="grid grid-cols-10 gap-4">
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
            <div className="flex aspect-square w-full items-center justify-center rounded-md bg-neutral-50 p-4">
              <div
                className="h-full w-full bg-center bg-contain"
                style={{
                  backgroundImage:
                    "url(https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/openai.png)",
                }}
              />
            </div>
          </div>
        </div>
      </LandingSection.Content>
    </LandingSection.Root>
  );
};
