import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import type React from "react";
import { cn } from "../../utils";
import { Button } from "../button";
import { Text } from "../text";

const AlertDialogRoot = AlertDialog.Root;

const AlertDialogTrigger = AlertDialog.Trigger;

const AlertDialogContent = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AlertDialog.Popup>) => (
  <AlertDialog.Portal>
    <AlertDialog.Backdrop
      className={cn(
        // base
        "fixed inset-0 z-50 bg-neutral-900/25",
        // transition
        "transition-all",
        // open
        "data-[starting-style]:opacity-0",
        // closed
        "data-[ending-style]:opacity-0",
        className
      )}
    />
    <AlertDialog.Popup
      className={cn(
        // base
        "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 flex w-full max-w-108 flex-col gap-6 rounded-xl bg-white p-6 shadow-xl outline-none",
        // transition
        "transition-all",
        // open
        "data-[starting-style]:-mt-4 data-[starting-style]:opacity-0",
        // closed
        "data-[ending-style]:-mt-4 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </AlertDialog.Popup>
  </AlertDialog.Portal>
);

const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
);

const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => (
  <div
    className={cn("flex flex-row justify-end gap-2", className)}
    {...props}
  />
);

const AlertDialogTitle = (
  props: React.ComponentPropsWithRef<typeof Text.Root>
) => (
  <AlertDialog.Title
    render={<Text.Root size="lg" weight="medium" {...props} />}
  />
);

const AlertDialogDescription = (
  props: React.ComponentPropsWithRef<typeof Text.Root>
) => (
  <AlertDialog.Description render={<Text.Root color="muted" {...props} />} />
);

const AlertDialogAction = (
  props: React.ComponentPropsWithRef<typeof Button.Root>
) => <Button.Root {...props} />;

const AlertDialogCancel = (
  props: React.ComponentPropsWithRef<typeof Button.Root>
) => (
  <AlertDialog.Close render={<Button.Root variant="secondary" {...props} />} />
);

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
