import { Config } from "@services/config";
import type { Member } from "@services/db";
import { JWT } from "@services/jwt";
import { GithubIntegrationRepository } from "./github-integration.repository";

export const GithubIntegrationService = {
  getByMember: (member: Member) => {
    return GithubIntegrationRepository.getByOrganizationId(
      member.organizationId
    );
  },
  getByInstallationId: (installationId: number) => {
    return GithubIntegrationRepository.getByInstallationId(installationId);
  },
  create: (member: Member, installationId: number) => {
    return GithubIntegrationRepository.create({
      organizationId: member.organizationId,
      installationId: installationId.toString(),
    });
  },
  createSetupUrl: (member: Member) => {
    return JWT.sign({
      memberId: member.id,
      organizationId: member.organizationId,
    }).map(
      (token) =>
        `https://github.com/apps/${Config.github.appName}/installations/new?state=${token}`
    );
  },
  deleteByInstallationId: (installationId: number) => {
    return GithubIntegrationRepository.deleteByInstallationId(installationId);
  },
};
