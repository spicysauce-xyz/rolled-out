import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../icon-button";
import { Text } from "../text";

const DialogRoot = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // base
      "fixed inset-0 z-50 bg-neutral-900/25",
      // transition
      "transition-all",
      // open
      "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      // closed
      "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      className,
    )}
    {...props}
  />
));

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-160 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
        // transition
        "transition-all",
        // open
        "fade-in-0 slide-in-from-top-4 animate-in",
        // closed
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close asChild>
        <IconButton.Root
          variant="tertiary"
          size="sm"
          className="absolute top-2.5 right-2.5"
        >
          <IconButton.Icon>
            <XIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
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
      className,
    )}
    {...props}
  />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title asChild>
    <Text.Root
      ref={ref}
      size="lg"
      weight="medium"
      className={className}
      {...props}
    />
  </DialogPrimitive.Title>
));

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description asChild>
    <Text.Root
      ref={ref}
      size="sm"
      color="muted"
      className={className}
      {...props}
    />
  </DialogPrimitive.Description>
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
