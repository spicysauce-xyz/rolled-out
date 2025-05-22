import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Text } from "../text";

const AlertDialogRoot = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
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
    ref={ref}
  />
));

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-108 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
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
      <AlertDialogPrimitive.Cancel asChild>
        <IconButton.Root
          variant="tertiary"
          size="sm"
          className="absolute top-2.5 right-2.5"
        >
          <IconButton.Icon>
            <XIcon />
          </IconButton.Icon>
        </IconButton.Root>
      </AlertDialogPrimitive.Cancel>
    </AlertDialogPrimitive.Content>
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
  <AlertDialogPrimitive.Title asChild>
    <Text.Root
      ref={ref}
      size="lg"
      weight="medium"
      className={className}
      {...props}
    />
  </AlertDialogPrimitive.Title>
));

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof Text.Root>,
  React.ComponentPropsWithoutRef<typeof Text.Root>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description asChild>
    <Text.Root
      ref={ref}
      size="sm"
      color="muted"
      className={className}
      {...props}
    />
  </AlertDialogPrimitive.Description>
));

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof Button.Root>
>(({ className, variant = "filled", color = "neutral", ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild>
    <Button.Root
      variant={variant}
      color={color}
      className={cn("flex-1", className)}
      {...props}
    />
  </AlertDialogPrimitive.Action>
));

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof Button.Root>
>(({ className, variant = "secondary", color = "neutral", ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild>
    <Button.Root
      variant={variant}
      color={color}
      className={cn("flex-1", className)}
      {...props}
    />
  </AlertDialogPrimitive.Cancel>
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
