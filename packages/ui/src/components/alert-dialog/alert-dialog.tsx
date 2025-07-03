import {
  Action as RadixAlertDialogAction,
  Cancel as RadixAlertDialogCancel,
  Content as RadixAlertDialogContent,
  Description as RadixAlertDialogDescription,
  Overlay as RadixAlertDialogOverlay,
  Portal as RadixAlertDialogPortal,
  Root as RadixAlertDialogRoot,
  Title as RadixAlertDialogTitle,
  Trigger as RadixAlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { XIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Text } from "../text";

const AlertDialogRoot = RadixAlertDialogRoot;

const AlertDialogTrigger = RadixAlertDialogTrigger;

const AlertDialogPortal = RadixAlertDialogPortal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialogOverlay>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialogOverlay>
>(({ className, ...props }, ref) => (
  <RadixAlertDialogOverlay
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
    {...props}
    ref={ref}
  />
));

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialogContent>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialogContent>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <RadixAlertDialogContent
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-108 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
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
      <RadixAlertDialogCancel asChild>
        <IconButton.Root
          className="absolute top-2.5 right-2.5"
          size="sm"
          variant="tertiary"
        >
          <IconButton.Icon>
            <XIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </RadixAlertDialogCancel>
    </RadixAlertDialogContent>
  </AlertDialogPortal>
));

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1", className)} {...props} />
);

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-row gap-2", className)} {...props} />
);

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <RadixAlertDialogTitle asChild>
    <Text.Root
      className={className}
      ref={ref}
      size="lg"
      weight="medium"
      {...props}
    />
  </RadixAlertDialogTitle>
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <RadixAlertDialogDescription asChild>
    <Text.Root
      className={className}
      color="muted"
      ref={ref}
      size="sm"
      {...props}
    />
  </RadixAlertDialogDescription>
));

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialogAction>,
  React.ComponentPropsWithoutRef<typeof Button.Root>
>(({ className, variant = "filled", color = "neutral", ...props }, ref) => (
  <RadixAlertDialogAction asChild ref={ref}>
    <Button.Root
      className={cn("flex-1", className)}
      color={color}
      variant={variant}
      {...props}
    />
  </RadixAlertDialogAction>
));

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialogCancel>,
  React.ComponentPropsWithoutRef<typeof Button.Root>
>(({ className, variant = "secondary", color = "neutral", ...props }, ref) => (
  <RadixAlertDialogCancel asChild ref={ref}>
    <Button.Root
      className={cn("flex-1", className)}
      color={color}
      variant={variant}
      {...props}
    />
  </RadixAlertDialogCancel>
));

export {
  AlertDialogRoot as Root,
  AlertDialogTrigger as Trigger,
  AlertDialogContent as Content,
  AlertDialogHeader as Header,
  AlertDialogFooter as Footer,
  AlertDialogTitle as Title,
  AlertDialogDescription as Description,
  AlertDialogAction as Action,
  AlertDialogCancel as Cancel,
};
