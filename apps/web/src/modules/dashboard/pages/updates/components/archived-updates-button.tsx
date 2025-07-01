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
      variant="tertiary"
      className="flex items-center justify-center gap-2 rounded-none px-6 py-4"
      onClick={onClick}
    >
      {isOpen ? (
        <Text.Root size="sm" color="muted" className="text-center">
          Click here to hide archived updates
        </Text.Root>
      ) : (
        <Text.Root size="sm" color="muted" className="text-center">
          You have {count} archived update{count === 1 ? "" : "s"}. Click here
          to view them
        </Text.Root>
      )}
    </Clickable.Root>
  );
};
