import { addRepositoriesToIntegration } from "./add-repositories-to-integration";
import { clearPendingCommits } from "./clear-pending-commits";
import { createGithubSetupUrl } from "./create-github-setup-url";
import { createPendingCommit } from "./create-pending-commit";
import { createPost } from "./create-post";
import { deleteGithubIntegration } from "./delete-github-integration";
import { duplicatePost } from "./duplicate-post";
import { getGithubIntegration } from "./get-github-integration";
import { getIntegrationWithPendingCommits } from "./get-integration-with-pending-commits";
import { getRepositories } from "./get-repositories";
import { getRepositoryCommits } from "./get-repository-commits";
import { setupGithubIntegration } from "./setup-github-integration";

export const Application = {
  addRepositoriesToIntegration,
  clearPendingCommits,
  createGithubSetupUrl,
  createPendingCommit,
  createPost,
  deleteGithubIntegration,
  duplicatePost,
  getGithubIntegration,
  getIntegrationWithPendingCommits,
  getRepositories,
  getRepositoryCommits,
  setupGithubIntegration,
};
