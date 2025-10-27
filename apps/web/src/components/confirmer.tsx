import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { AlertDialog, Button, Input, Text } from "@mono/ui";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { create } from "zustand";

interface Confirm {
  id: string;
  title: string;
  description: React.ReactNode;
  phrase?: string;
  action: {
    icon?: IconSvgElement;
    label?: string;
    color?: "accent" | "danger" | "success" | "warning";
    run: () => Promise<unknown> | unknown;
  };
  dismissed: boolean;
}

interface ConfirmState {
  confirms: Confirm[];
}

const confirmStore = create<ConfirmState>(() => ({
  confirms: [],
}));

const confirm = (payload: Omit<Confirm, "id" | "dismissed">) => {
  const id = Math.random().toString(36).substring(2, 15);

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
      },
    ],
  }));
};

const ConfirmAlert: React.FC<Confirm> = ({
  id,
  title,
  description,
  phrase,
  action,
}: Confirm) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const [phraseConfirm, setPhraseConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await action.run();

      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  return (
    <AlertDialog.Root onOpenChange={handleOpenChange} open={open}>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>{description}</AlertDialog.Description>
        </AlertDialog.Header>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {!!phrase && (
            <div className="-mx-6 flex flex-col gap-2 border-neutral-100 border-y bg-neutral-50 px-6 py-4">
              <Text.Root>
                Type{" "}
                <Text.Root color="accent" render={<span />} weight="medium">
                  {phrase}
                </Text.Root>{" "}
                to confirm
              </Text.Root>
              <Input.Root className="w-full">
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
            <AlertDialog.Cancel isDisabled={isLoading} type="button">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              autoFocus
              color={action?.color}
              isDisabled={!!phrase && phraseConfirm !== phrase}
              isLoading={isLoading}
              onClick={handleConfirm}
              type="submit"
            >
              {action?.icon && (
                <Button.Icon
                  render={<HugeiconsIcon icon={action.icon} strokeWidth={2} />}
                />
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
