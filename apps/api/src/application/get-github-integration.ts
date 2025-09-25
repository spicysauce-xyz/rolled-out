import { GithubIntegrationService } from "../domain/github-integration";
import type { Member } from "../services/db";

export const getGithubIntegration = (member: Member) => {
  return GithubIntegrationService.getByMember(member);
};
