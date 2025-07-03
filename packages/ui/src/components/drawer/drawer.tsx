import { XIcon } from "lucide-react";
import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { useScreenBreakpoint } from "../../hooks";
import { cn } from "../../utils";
import { IconButton } from "../icon-button";
import { ScrollArea } from "../scroll-area/";
import { Text } from "../text";

const DrawerRoot = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
  const isMobileScreen = useScreenBreakpoint({
    type: "max",
    breakpoint: "sm",
  });

  return (
    <DrawerPrimitive.Root
      direction={isMobileScreen ? "bottom" : "right"}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
};

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerCloseX = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Close
    className={cn("absolute top-2.5 right-2.5 z-60", className)}
    ref={ref}
    {...props}
    asChild
  >
    <IconButton.Root variant="tertiary">
      <IconButton.Icon>
        <XIcon />
      </IconButton.Icon>
    </IconButton.Root>
  </DrawerPrimitive.Close>
));

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn("fixed inset-0 z-50 animate-in bg-neutral-900/25", className)}
    ref={ref}
    {...props}
  />
));

const DrawerBody = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed top-12 right-0 bottom-0 z-50 flex h-auto max-w-screen flex-col bg-white shadow-xl max-sm:left-0 max-sm:rounded-t-xl sm:top-0",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <ScrollArea.Root type="scroll">
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Viewport>
      <div className={cn("p-6", className)} ref={ref} {...props}>
        {children}
      </div>
    </ScrollArea.Viewport>
  </ScrollArea.Root>
));

const DrawerHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "relative flex flex-col gap-1 border-neutral-100 border-b p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-auto flex flex-col-reverse gap-4 border-neutral-200 border-t p-6 sm:flex-row",
      className
    )}
    {...props}
  />
);

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, children, ...props }, ref) => (
  <Text.Root asChild size="lg" weight="medium">
    <DrawerPrimitive.Title className={className} ref={ref} {...props}>
      {children}
    </DrawerPrimitive.Title>
  </Text.Root>
));

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <Text.Root asChild color="muted" size="sm">
    <DrawerPrimitive.Description className={className} ref={ref} {...props} />
  </Text.Root>
));

export {
  DrawerRoot as Root,
  DrawerTrigger as Trigger,
  DrawerPortal as Portal,
  DrawerOverlay as Overlay,
  DrawerCloseX as CloseX,
  DrawerClose as Close,
  DrawerBody as Body,
  DrawerContent as Content,
  DrawerHeader as Header,
  DrawerFooter as Footer,
  DrawerTitle as Title,
  DrawerDescription as Description,
};
