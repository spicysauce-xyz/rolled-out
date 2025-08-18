import { Text } from "@mono/ui";

interface BreadcrumbsProps {
  page: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ page }) => {
  return (
    <div className="flex items-center gap-4">
      <Text.Root weight="medium">{page}</Text.Root>
    </div>
  );
};
