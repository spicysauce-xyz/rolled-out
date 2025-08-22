import { Text } from "@mono/ui";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

interface BreadcrumbsProps {
  page: string | string[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ page }) => {
  const items = Array.isArray(page) ? page : [page];

  return (
    <div className="flex items-center gap-2">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          {index !== 0 && (
            <ChevronRightIcon className="size-4 text-neutral-500" />
          )}
          <Text.Root
            color={index === items.length - 1 ? "neutral" : "muted"}
            key={item}
            weight={index === items.length - 1 ? "medium" : "normal"}
          >
            {item}
          </Text.Root>
        </React.Fragment>
      ))}
    </div>
  );
};
