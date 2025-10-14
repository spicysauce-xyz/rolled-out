export const getCommitId = (
  commit: { commitId: string } | { prId: string }
) => {
  if ("commitId" in commit) {
    return commit.commitId;
  }

  return commit.prId;
};
