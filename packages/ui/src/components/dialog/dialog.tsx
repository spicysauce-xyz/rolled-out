import { Dialog } from "@base-ui-components/react/dialog";
import type React from "react";
import { cn } from "../../utils";
import { Button } from "../button";
import { Text } from "../text";

const DialogRoot = Dialog.Root;

const DialogTrigger = Dialog.Trigger;

const DialogContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Popup>) => (
  <Dialog.Portal>
    <Dialog.Backdrop
      className={cn(
        // base
        "fixed inset-0 z-50 bg-neutral-900/25",
        // transition
        "transition-all",
        // open
        "data-[starting-style]:opacity-0",
        // closed
        "data-[ending-style]:opacity-0"
      )}
    />
    <Dialog.Popup
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-160 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
        // transition
        "transition-all",
        // open
        "data-[starting-style]:translate-y-[calc(-50%-1rem)] data-[starting-style]:opacity-0",
        // closed
        "data-[ending-style]:translate-y-[calc(-50%-1rem)] data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </Dialog.Popup>
  </Dialog.Portal>
);

const DialogHeader = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
);

const DialogFooter = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn("flex flex-row justify-end gap-2", className)}
    {...props}
  />
);

const DialogTitle = (props: React.ComponentPropsWithRef<typeof Text.Root>) => (
  <Dialog.Title render={<Text.Root size="lg" weight="medium" {...props} />} />
);

const DialogDescription = (
  props: React.ComponentPropsWithRef<typeof Text.Root>
) => <Dialog.Description render={<Text.Root color="muted" {...props} />} />;

const DialogAction = (
  props: React.ComponentPropsWithRef<typeof Button.Root>
) => <Button.Root {...props} />;

const DialogCancel = (
  props: React.ComponentPropsWithRef<typeof Button.Root>
) => <Dialog.Close render={<Button.Root variant="secondary" {...props} />} />;

export {
  DialogRoot as Root,
  DialogTrigger as Trigger,
  DialogContent as Content,
  DialogHeader as Header,
  DialogFooter as Footer,
  DialogTitle as Title,
  DialogDescription as Description,
  DialogAction as Action,
  DialogCancel as Cancel,
};
