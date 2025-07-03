import { Clickable, Text } from "@mono/ui";

interface ArchivedUpdatesButtonProps {
  count: number;
  isOpen: boolean;
  onClick: () => void;
}

export const ArchivedUpdatesButton: React.FC<ArchivedUpdatesButtonProps> = ({
  count,
  isOpen,
  onClick,
}) => {
  return (
    <Clickable.Root
      className="flex items-center justify-center gap-2 rounded-none px-6 py-4"
      onClick={onClick}
      variant="tertiary"
    >
      {isOpen ? (
        <Text.Root className="text-center" color="muted" size="sm">
          Click here to hide archived updates
        </Text.Root>
      ) : (
        <Text.Root className="text-center" color="muted" size="sm">
          You have {count} archived update{count === 1 ? "" : "s"}. Click here
          to view them
        </Text.Root>
      )}
    </Clickable.Root>
  );
};
