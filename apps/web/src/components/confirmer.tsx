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
  description: React.ReactNode;
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

const confirm = (payload: Omit<Confirm, "id" | "resolve" | "dismissed">) => {
  const id = Math.random().toString(36).substring(2, 15);

  const promise = new Promise<boolean>((resolve) => {
    confirmStore.setState((state) => ({
      confirms: [
        ...state.confirms.filter((c) => !c.dismissed),
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

const ConfirmAlert: React.FC<Confirm> = ({
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

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setOpen(false);

      confirmStore.setState((state) =>
        produce(state, (draft) => {
          const data = draft.confirms.find((c) => c.id === id);

          if (data) {
            data.dismissed = true;
          }
        })
      );

      if (!resolvedRef.current) {
        resolve(false);
      }
    }
  };

  if (isMobileScreen) {
    return (
      <Drawer.Root onOpenChange={handleOpenChange} open={open}>
        <Drawer.Body className="top-auto">
          <Drawer.Header className={cn(!phrase && "border-b-0")}>
            <Drawer.Title>{title}</Drawer.Title>
            <Drawer.Description>{description}</Drawer.Description>
            <Drawer.CloseX />
          </Drawer.Header>
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            {!!phrase && (
              <Drawer.Content>
                <div className="flex flex-col gap-2">
                  <Text.Root color="muted" size="sm">
                    Type{" "}
                    <Text.Root asChild size="sm" weight="medium">
                      <span>{phrase}</span>
                    </Text.Root>{" "}
                    to confirm
                  </Text.Root>
                  <Input.Root className="w-full" size="sm">
                    <Input.Wrapper>
                      <Input.Field
                        autoFocus
                        onChange={(e) => setPhraseConfirm(e.target.value)}
                        placeholder={phrase}
                        type="text"
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </Drawer.Content>
            )}
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button.Root size="sm" variant="secondary">
                  Cancel
                </Button.Root>
              </Drawer.Close>
              <Drawer.Close asChild>
                <Button.Root
                  autoFocus
                  color={action?.color}
                  isDisabled={!!phrase && phraseConfirm !== phrase}
                  onClick={() => {
                    resolvedRef.current = true;
                    resolve(true);
                  }}
                  type="submit"
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
    <AlertDialog.Root onOpenChange={handleOpenChange} open={open}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <form
          className="flex flex-col sm:gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {!!phrase && (
            <div className="flex flex-col gap-2 border-neutral-100 border-y py-4">
              <Text.Root color="muted" size="sm">
                Type{" "}
                <Text.Root asChild size="sm" weight="medium">
                  <span>{phrase}</span>
                </Text.Root>{" "}
                to confirm
              </Text.Root>
              <Input.Root className="w-full" size="sm">
                <Input.Wrapper>
                  <Input.Field
                    autoFocus
                    onChange={(e) => setPhraseConfirm(e.target.value)}
                    placeholder={phrase}
                    type="text"
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          )}
          <AlertDialog.Footer>
            <AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              autoFocus
              color={action?.color}
              isDisabled={!!phrase && phraseConfirm !== phrase}
              onClick={() => {
                resolvedRef.current = true;
                resolve(true);
              }}
              type="submit"
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

const ConfirmerRoot = () => {
  const { confirms } = confirmStore();

  return confirms.map((payload) => (
    <ConfirmAlert key={payload.id} {...payload} />
  ));
};

export const Confirmer = {
  Root: ConfirmerRoot,
  confirm,
};
