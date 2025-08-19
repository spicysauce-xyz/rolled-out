import {
  UpdateEntry,
  UpdatesList,
} from "@modules/dashboard/components/update-list";
import { GroupDivider } from "./components/group-divider";

export const Skeleton = () => {
  return (
    <UpdatesList.Root>
      <GroupDivider.Skeleton />
      {new Array(10).fill(null).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: could be used as key
        <div className="flex w-full" key={index}>
          <UpdateEntry.Skeleton />
        </div>
      ))}
    </UpdatesList.Root>
  );
};
