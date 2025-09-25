import { createGithubSetupUrl } from "./create-github-setup-url";
import { createPost } from "./create-post";
import { duplicatePost } from "./duplicate-post";
import { getGithubIntegration } from "./get-github-integration";
import { getIntegrationWithPendingCommits } from "./get-integration-with-pending-commits";
import { getRepositories } from "./get-repositories";
import { getRepositoryCommits } from "./get-repository-commits";

export const Application = {
  createGithubSetupUrl,
  createPost,
  duplicatePost,
  getGithubIntegration,
  getIntegrationWithPendingCommits,
  getRepositories,
  getRepositoryCommits,
};
