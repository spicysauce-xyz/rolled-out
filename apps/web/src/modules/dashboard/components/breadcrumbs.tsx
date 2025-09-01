import { Text } from "@mono/ui";
import { cn } from "@mono/ui/utils";
import { Link, type LinkProps } from "@tanstack/react-router";
import React from "react";

type Page =
  | string
  | {
      label: string;
      link: LinkProps;
    };

interface BreadcrumbsProps {
  pages: Page[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pages }) => {
  return (
    <div className="flex items-center gap-4">
      {pages.map((page, index) => {
        const label = typeof page === "string" ? page : page.label;
        const isLink = typeof page !== "string";

        return (
          <React.Fragment key={label}>
            {index !== 0 && (
              <Text.Root color="muted" weight="medium">
                /
              </Text.Root>
            )}
            <Text.Root
              className={cn(isLink && "hover:text-neutral-900")}
              color={index === pages.length - 1 ? "neutral" : "muted"}
              key={label}
              render={isLink ? <Link {...page.link} /> : undefined}
              weight="medium"
            >
              {label}
            </Text.Root>
          </React.Fragment>
        );
      })}
    </div>
  );
};
