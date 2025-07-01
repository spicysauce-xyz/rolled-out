import { Clickable, Input, Popover, ScrollArea, Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import _ from "lodash";
import {
  DynamicIcon,
  type IconName,
  iconNames,
  // @ts-expect-error https://github.com/lucide-icons/lucide/issues/2867
} from "lucide-react/dynamic.mjs";
import type React from "react";
import { useMemo, useRef, useState } from "react";

interface ContentProps {
  onIconClick: (icon: IconName) => void;
}

const Content = ({ onIconClick }: ContentProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const filteredIconNames = useMemo(() => {
    return iconNames.filter((icon: IconName) =>
      icon.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const chunks = useMemo(
    () => _.chunk(filteredIconNames, 6),
    [filteredIconNames],
  );

  const rowVirtualizer = useVirtualizer({
    count: chunks.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => 41,
  });

  return (
    <>
      <div className="border-neutral-100 border-b p-2">
        <Input.Root size="sm">
          <Input.Wrapper>
            <Input.Field
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for an icon"
            />
          </Input.Wrapper>
        </Input.Root>
      </div>
      <div className="flex h-64 max-h-64 flex-col">
        <ScrollArea.Root>
          <ScrollArea.Viewport ref={viewportRef} className="p-2 pb-0">
            {chunks.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <Text.Root
                  size="sm"
                  className="text-balance text-center"
                  color="muted"
                >
                  No results found for{" "}
                  <Text.Root size="sm" asChild>
                    <span>"{search}"</span>
                  </Text.Root>
                  . Try a different search
                </Text.Root>
              </div>
            ) : (
              <div
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                className="relative"
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="flex justify-start gap-2 pb-2"
                  >
                    {chunks[virtualItem.index].map((icon: IconName) => (
                      <Clickable.Root
                        key={icon}
                        variant="tertiary"
                        className="flex aspect-square h-full items-center justify-center"
                        onClick={() => onIconClick(icon)}
                      >
                        <Clickable.Icon>
                          <DynamicIcon
                            className="stroke-neutral-500"
                            name={icon}
                          />
                        </Clickable.Icon>
                      </Clickable.Root>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar size="sm">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </>
  );
};

interface SymbolPickerProps
  extends Omit<React.ComponentProps<typeof Popover.Content>, "onChange"> {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export const SymbolPicker: React.FC<SymbolPickerProps> = ({
  isOpen,
  onOpenChange,
  value,
  onChange,
  ...contentProps
}) => {
  const handleIconClick = (icon: IconName) => {
    onChange(icon);
    onOpenChange(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Anchor />
      <Popover.Content
        {...contentProps}
        className={cn("w-64 p-0", contentProps.className)}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <Content onIconClick={handleIconClick} />
      </Popover.Content>
    </Popover.Root>
  );
};
