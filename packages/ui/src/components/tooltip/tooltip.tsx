import { Tooltip } from "@base-ui-components/react/tooltip";
import type React from "react";
import { cn } from "../../utils";
import { Text } from "../text";

const TooltipProvider = Tooltip.Provider;

const TooltipRoot = Tooltip.Root;

const TooltipTrigger = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Tooltip.Trigger>) => {
  return (
    <Tooltip.Trigger
      className={cn(
        "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
};

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg fill="none" height="10" viewBox="0 0 20 10" width="20" {...props}>
      <title>Arrow</title>
      <path
        className="fill-neutral-900"
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
      />
      <path
        className="fill-gray-200"
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
      />
      <path
        className="dark:fill-gray-300"
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
      />
    </svg>
  );
}

type TooltipContentProps = React.ComponentPropsWithRef<typeof Tooltip.Popup> &
  Pick<React.ComponentPropsWithoutRef<typeof Tooltip.Positioner>, "side">;

const TooltipContent = ({
  side,
  className,
  children,
  ...rest
}: TooltipContentProps) => {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner collisionPadding={8} side={side} sideOffset={10}>
        <Tooltip.Popup
          {...rest}
          className={cn(
            "z-10 flex max-w-80 flex-col gap-0.5 rounded-md bg-neutral-900 px-3 py-2 shadow-lg",
            // transition
            "transition-all",
            // animation
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[instant]:duration-0",
            // // animation left
            "data-[side=left]:data-[ending-style]:-translate-x-1 data-[side=left]:data-[starting-style]:-translate-x-1",
            // // animation top
            "data-[side=top]:data-[ending-style]:-translate-y-1 data-[side=top]:data-[starting-style]:-translate-y-1",
            // // animation right
            "data-[side=right]:data-[ending-style]:translate-x-1 data-[side=right]:data-[starting-style]:translate-x-1",
            // // animation bottom
            "data-[side=bottom]:data-[ending-style]:translate-y-1 data-[side=bottom]:data-[starting-style]:translate-y-1",
            className
          )}
        >
          <Tooltip.Arrow className="data-[side=right]:-rotate-90 data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=top]:rotate-180">
            <ArrowSvg />
          </Tooltip.Arrow>
          {children}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
};

const TooltipTitle = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<typeof Text.Root>) => {
  return (
    <Text.Root
      className={cn("text-white", className)}
      size="sm"
      weight="medium"
      {...rest}
    />
  );
};

const TooltipDescription = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<typeof Text.Root>) => {
  return (
    <Text.Root
      className={cn("text-neutral-200", className)}
      size="sm"
      {...rest}
    />
  );
};

export {
  TooltipProvider as Provider,
  TooltipRoot as Root,
  TooltipTrigger as Trigger,
  TooltipContent as Content,
  TooltipTitle as Title,
  TooltipDescription as Description,
};
