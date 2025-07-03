import {
  Close as RadixDialogClose,
  Content as RadixDialogContent,
  Description as RadixDialogDescription,
  Overlay as RadixDialogOverlay,
  Portal as RadixDialogPortal,
  Root as RadixDialogRoot,
  Title as RadixDialogTitle,
  Trigger as RadixDialogTrigger,
} from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../icon-button";
import { Text } from "../text";

const DialogRoot = RadixDialogRoot;

const DialogTrigger = RadixDialogTrigger;

const DialogPortal = RadixDialogPortal;

const DialogClose = RadixDialogClose;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialogOverlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialogOverlay>
>(({ className, ...props }, ref) => (
  <RadixDialogOverlay
    className={cn(
      // base
      "fixed inset-0 z-50 bg-neutral-900/25",
      // transition
      "transition-all",
      // open
      "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      // closed
      "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      className
    )}
    ref={ref}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialogContent>,
  React.ComponentPropsWithoutRef<typeof RadixDialogContent>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialogContent
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-160 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
        // transition
        "transition-all",
        // open
        "fade-in-0 slide-in-from-top-4 animate-in",
        // closed
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=closed]:animate-out",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <RadixDialogClose asChild>
        <IconButton.Root
          className="absolute top-2.5 right-2.5"
          size="sm"
          variant="tertiary"
        >
          <IconButton.Icon>
            <XIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </RadixDialogClose>
    </RadixDialogContent>
  </DialogPortal>
));

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1", className)} {...props} />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row gap-2 border-neutral-100 border-t pt-6",
      className
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <RadixDialogTitle asChild>
    <Text.Root
      className={className}
      ref={ref}
      size="lg"
      weight="medium"
      {...props}
    />
  </RadixDialogTitle>
));

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <RadixDialogDescription asChild>
    <Text.Root
      className={className}
      color="muted"
      ref={ref}
      size="sm"
      {...props}
    />
  </RadixDialogDescription>
));

export {
  DialogRoot as Root,
  DialogPortal as Portal,
  DialogOverlay as Overlay,
  DialogClose as Close,
  DialogTrigger as Trigger,
  DialogContent as Content,
  DialogHeader as Header,
  DialogFooter as Footer,
  DialogTitle as Title,
  DialogDescription as Description,
};
