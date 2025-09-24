import { Transition } from "@components/transition";
import { repositoriesQuery } from "@lib/api/queries";
import { Button, Select, Skeleton } from "@mono/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

type RepositorySelectorProps = {
  organizationId: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  organizationId,
  value,
  onChange,
}) => {
  const { data: repositories, isPending: isLoadingRepositories } = useQuery(
    repositoriesQuery(organizationId)
  );

  useEffect(() => {
    if (!value && repositories?.[0]) {
      onChange(repositories?.[0].id);
    }
  }, [value, onChange, repositories]);

  const repositorySelectItems = useMemo(() => {
    return (repositories || [])?.map((repo) => ({
      value: repo.id,
      label: `${repo.owner}/${repo.name}`,
    }));
  }, [repositories]);

  return (
    <Transition.Root>
      {isLoadingRepositories || !value ? (
        <Transition.Item key="skeleton">
          <Skeleton.Root className="h-9 w-30 rounded-md" />
        </Transition.Item>
      ) : (
        <Transition.Item key="select">
          <Select.Root
            items={repositorySelectItems}
            onValueChange={onChange}
            value={value}
          >
            <Select.Trigger
              render={
                <Button.Root variant="secondary">
                  <Select.Value />
                  <Button.Icon render={<Select.Icon />} />
                </Button.Root>
              }
            />
            <Select.Content align="end">
              {repositorySelectItems.map((repository) => (
                <Select.Item key={repository.value} value={repository.value}>
                  <Select.ItemText>{repository.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Transition.Item>
      )}
    </Transition.Root>
  );
};
