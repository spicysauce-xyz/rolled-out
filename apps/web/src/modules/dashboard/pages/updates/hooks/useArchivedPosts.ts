import { useMemo, useState } from "react";

export const useArchivedPosts = (data: { status: string }[]) => {
  const [archivedVisible, setArchivedVisible] = useState(false);

  const count = useMemo(() => {
    return data.filter((post) => post.status === "archived").length;
  }, [data]);

  const allPostsAreArchived = data.length > 0 && data.length === count;

  return {
    count,
    isOpen: allPostsAreArchived || archivedVisible,
    toggle: () => setArchivedVisible((v) => !v),
    buttonVisible: count > 0 && !allPostsAreArchived,
  };
};
