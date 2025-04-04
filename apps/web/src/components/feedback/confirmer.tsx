import { AlertDialog, Button, Drawer, Input, Text } from "@mono/ui";
import { useScreenBreakpoint } from "@mono/ui/hooks";
import { cn } from "@mono/ui/utils";
import { produce } from "immer";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { create } from "zustand";

interface Confirm {
  id: string;
  title: string;
  description: string;
  phrase?: string;
  action?: {
    icon?: LucideIcon;
    label?: string;
    color?: "accent" | "danger" | "success" | "warning";
  };
  resolve: (result: boolean) => void;
  dismissed: boolean;
}

interface ConfirmState {
  confirms: Confirm[];
}

const confirmStore = create<ConfirmState>(() => ({
  confirms: [],
}));

export const confirm = (
  payload: Omit<Confirm, "id" | "resolve" | "dismissed">,
) => {
  const id = Math.random().toString(36).substring(2, 15);

  const promise = new Promise<boolean>((resolve) => {
    confirmStore.setState((state) => ({
      confirms: [
        ...state.confirms.filter((confirm) => !confirm.dismissed),
        {
          id,
          title: payload.title,
          description: payload.description,
          phrase: payload.phrase,
          action: payload.action,
          dismissed: false,
          resolve,
        },
      ],
    }));
  });

  return promise;
};

const Confirm: React.FC<Confirm> = ({
  id,
  title,
  description,
  phrase,
  resolve,
  action,
}: Confirm) => {
  const isMobileScreen = useScreenBreakpoint({
    breakpoint: "sm",
    type: "max",
  });

  const resolvedRef = useRef(false);
  const [open, setOpen] = useState(true);
  const [phraseConfirm, setPhraseConfirm] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);

      confirmStore.setState((state) =>
        produce(state, (draft) => {
          const confirm = draft.confirms.find((confirm) => confirm.id === id);
          if (confirm) {
            confirm.dismissed = true;
          }
        }),
      );

      if (!resolvedRef.current) {
        resolve(false);
      }
    }
  };

  if (isMobileScreen) {
    return (
      <Drawer.Root key={id} open={open} onOpenChange={handleOpenChange}>
        <Drawer.Body className="top-auto">
          <Drawer.Header className={cn(!phrase && "border-b-0")}>
            <Drawer.Title>{title}</Drawer.Title>
            <Drawer.Description>{description}</Drawer.Description>
            <Drawer.CloseX />
          </Drawer.Header>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            {!!phrase && (
              <Drawer.Content>
                <div className="flex flex-col gap-2">
                  <Text.Root size="sm" color="muted">
                    Type{" "}
                    <Text.Root weight="medium" size="sm" asChild>
                      <span>{phrase}</span>
                    </Text.Root>{" "}
                    to confirm
                  </Text.Root>
                  <Input.Root size="sm" className="w-full">
                    <Input.Wrapper>
                      <Input.Field
                        autoFocus
                        type="text"
                        placeholder={phrase}
                        onChange={(e) => setPhraseConfirm(e.target.value)}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </Drawer.Content>
            )}
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button.Root variant="secondary" size="sm">
                  Cancel
                </Button.Root>
              </Drawer.Close>
              <Drawer.Close asChild>
                <Button.Root
                  type="submit"
                  autoFocus
                  color={action?.color}
                  isDisabled={!!phrase && phraseConfirm !== phrase}
                  onClick={() => {
                    resolvedRef.current = true;
                    resolve(true);
                  }}
                >
                  {action?.icon && (
                    <Button.Icon>
                      <action.icon />
                    </Button.Icon>
                  )}
                  {action?.label || "Confirm"}
                </Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </form>
        </Drawer.Body>
      </Drawer.Root>
    );
  }

  return (
    <AlertDialog.Root key={id} open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:gap-4"
        >
          {!!phrase && (
            <div className="flex flex-col gap-2 border-neutral-100 border-y py-4">
              <Text.Root size="sm" color="muted">
                Type{" "}
                <Text.Root weight="medium" size="sm" asChild>
                  <span>{phrase}</span>
                </Text.Root>{" "}
                to confirm
              </Text.Root>
              <Input.Root size="sm" className="w-full">
                <Input.Wrapper>
                  <Input.Field
                    autoFocus
                    type="text"
                    placeholder={phrase}
                    onChange={(e) => setPhraseConfirm(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          )}
          <AlertDialog.Footer>
            <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              type="submit"
              autoFocus
              color={action?.color}
              isDisabled={!!phrase && phraseConfirm !== phrase}
              onClick={() => {
                resolvedRef.current = true;
                resolve(true);
              }}
            >
              {action?.icon && (
                <Button.Icon>
                  <action.icon />
                </Button.Icon>
              )}
              {action?.label || "Confirm"}
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export const Confirmer = () => {
  const { confirms } = confirmStore();

  return confirms.map((payload) => <Confirm key={payload.id} {...payload} />);
};
