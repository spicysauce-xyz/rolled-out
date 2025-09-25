import { Config } from "@services/config";
import type { Member } from "@services/db";
import { Github } from "@services/github";
import { JWT } from "@services/jwt";
import { err, ok, ResultAsync } from "neverthrow";
import { IntegrationRepository } from "./integration.repository";

export const IntegrationService = {
  getGithubIntegration: (member: Member) => {
    return IntegrationRepository.getGithubIntegrationByOrganizationId(
      member.organizationId
    );
  },
  getGithubIntegrationByInstallationId: (installationId: number) => {
    return IntegrationRepository.getGithubIntegrationByInstallationId(
      installationId
    );
  },
  getGithubIntegrationPendingCommit: (member: Member) => {
    return IntegrationRepository.getGithubIntegrationByOrganizationId(
      member.organizationId
    )
      .andThen((integration) => {
        if (!integration) {
          return err(new Error("GitHub integration not found"));
        }
        return ok(integration);
      })
      .andThen((integration) => {
        return IntegrationRepository.getGithubIntegrationPendingCommits(
          integration.id
        );
      });
  },
  createGithubIntegration: (member: Member, installationId: number) => {
    return IntegrationRepository.createGithubIntegration({
      organizationId: member.organizationId,
      installationId: installationId.toString(),
    });
  },
  createGithubSetupUrl: (member: Member) => {
    return JWT.sign({
      memberId: member.id,
      organizationId: member.organizationId,
    }).map(
      (token) =>
        `https://github.com/apps/${Config.github.appName}/installations/new?state=${token}`
    );
  },
  addGithubRepositoriesToIntegration: (
    installationId: number,
    repositories: {
      id: number;
      name: string;
      owner: string;
    }[]
  ) => {
    return IntegrationRepository.getGithubIntegrationByInstallationId(
      installationId
    )
      .andThen((integration) => {
        if (!integration) {
          return err(new Error("GitHub integration not found"));
        }
        return ok(integration);
      })
      .andThen((integration) => {
        return ResultAsync.combine(
          repositories.map((repository) => {
            return Github.getRepositoryBaseBranch(
              Number(integration.installationId),
              repository.owner,
              repository.name
            ).andThen((baseBranch) =>
              IntegrationRepository.createGithubRepository({
                integrationId: integration.id,
                repositoryId: String(repository.id),
                name: repository.name,
                owner: repository.owner,
                mainBranch: baseBranch,
              })
            );
          })
        );
      });
  },
  deleteGithubIntegrationByInstallationId: (installationId: number) => {
    return IntegrationRepository.deleteGithubIntegrationByInstallationId(
      installationId
    );
  },
};
