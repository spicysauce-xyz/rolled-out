import { GithubIntegrationService } from "../domain/github-integration";
import type { Member } from "../services/db";

export const createGithubSetupUrl = (member: Member) => {
  return GithubIntegrationService.createSetupUrl(member);
};
