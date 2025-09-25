import { createAppAuth } from "@octokit/auth-app";
import { ok, ResultAsync } from "neverthrow";
import { Octokit } from "octokit";
import { Config } from "./config";

const createAuthorizedOctokit = (installationId: number) => {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: Config.github.appId,
      clientId: Config.github.clientId,
      privateKey: Config.github.privateKey,
      installationId,
    },
  });
};

export const Github = {
  getCommitById(
    installationId: number,
    id: string,
    owner: string,
    repo: string
  ) {
    const octokit = createAuthorizedOctokit(installationId);

    return ResultAsync.fromPromise(
      octokit.graphql<{
        repository: {
          object: {
            id: string;
            message: string;
            committedDate: string;
            author: {
              user: {
                login: string;
              };
              avatarUrl: string;
            };
            associatedPullRequests: {
              nodes: {
                id: string;
                number: string;
                title: string;
                body: string;
                url: string;
                mergedAt: string;
              }[];
            };
          };
        };
      }>(
        `query($owner: String!, $repo: String!, $id: GitObjectID!) {
          repository(owner: $owner, name: $repo) {
            object(oid: $id) {
              ... on Commit {
                id
                message
                committedDate
                author {
                  user {
                    login
                  }
                  avatarUrl
                }
                associatedPullRequests(first: 1) {
                  nodes {
                    id
                    number
                    title
                    body
                    url
                    mergedAt
                  }
                }
              }
            }
          }
        }`,
        { owner, repo, id }
      ),
      (error) =>
        new Error("Failed to get commit by id from GitHub", {
          cause: error,
        })
    ).map((response) => {
      const commit = response?.repository?.object;

      if (!commit) {
        return null;
      }

      const isPr = commit.associatedPullRequests.nodes.length > 0;

      if (isPr) {
        const pr = commit.associatedPullRequests.nodes[0];

        return {
          prId: pr.id,
          title: pr.title,
          description: pr.body,
          date: commit.committedDate,
          committer: {
            login: commit.author.user.login,
            avatarUrl: commit.author.avatarUrl,
          },
        };
      }

      return {
        commitId: commit.id,
        title: commit.message,
        date: commit.committedDate,
        committer: {
          login: commit.author.user.login,
          avatarUrl: commit.author.avatarUrl,
        },
      };
    });
  },
  getCommitsFromRepository(
    installationId: number,
    owner: string,
    repo: string,
    ref: string,
    pagination?: {
      limit?: number;
      cursor?: string;
    }
  ) {
    const octokit = createAuthorizedOctokit(installationId);

    return ResultAsync.fromPromise(
      octokit.graphql<{
        repository: {
          ref: {
            target: {
              history: {
                nodes: {
                  id: string;
                  message: string;
                  committedDate: string;
                  author: {
                    user: {
                      login: string;
                    };
                    avatarUrl: string;
                  };
                  associatedPullRequests: {
                    nodes: {
                      id: string;
                      number: number;
                      title: string;
                      body: string;
                      url: string;
                    }[];
                  };
                }[];
                pageInfo: {
                  hasNextPage: boolean;
                  endCursor: string;
                };
              };
            };
          };
        };
      }>(
        `
      query($owner: String!, $repo: String!, $ref: String!, $limit: Int!, $cursor: String) {
        repository(owner: $owner, name: $repo) {
          ref(qualifiedName: $ref) {
            target {
              ... on Commit {
                history(first: $limit, after: $cursor) {
                  nodes {
                    id 
                    message
                    committedDate
                    author {
                      avatarUrl
                      user {
                        login
                      }
                    }
                    associatedPullRequests(first: 1) {
                      nodes {
                        id
                        number
                        title
                        body
                        url
                        mergedAt
                      }
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
        }
      }
      `,
        {
          owner,
          repo,
          ref,
          cursor: pagination?.cursor,
          limit: pagination?.limit ?? 25,
        }
      ),
      (error) =>
        new Error("Failed to get commits from GitHub", { cause: error })
    ).map((response) => {
      const commits = response?.repository?.ref?.target?.history.nodes;
      const paginationInfo =
        response?.repository?.ref?.target?.history.pageInfo;

      if (!commits) {
        return {
          data: [],
          cursor: undefined,
        };
      }

      const list: ({
        title: string;
        date: string;
        committer: {
          login: string;
          avatarUrl: string;
        };
      } & (
        | {
            commitId: string;
          }
        | {
            prId: string;
            description: string;
          }
      ))[] = [];

      for (const commit of commits) {
        const isPr = commit.associatedPullRequests.nodes.length > 0;

        if (isPr) {
          const pr = commit.associatedPullRequests.nodes[0];

          const isPrAlreadyAdded = list.find(
            (listItem) => "prId" in listItem && listItem.prId === pr.id
          );

          if (!isPrAlreadyAdded) {
            list.push({
              prId: pr.id,
              title: pr.title,
              description: pr.body,
              date: commit.committedDate,
              committer: {
                login: commit.author.user.login,
                avatarUrl: commit.author.avatarUrl,
              },
            });
          }
        } else {
          list.push({
            commitId: commit.id,
            title: commit.message,
            date: commit.committedDate,
            committer: {
              login: commit.author.user.login,
              avatarUrl: commit.author.avatarUrl,
            },
          });
        }
      }

      return {
        data: list,
        cursor: paginationInfo.hasNextPage
          ? paginationInfo.endCursor
          : undefined,
      };
    });
  },

  getCommitsContentByIds(installationId: number, ids: string[]) {
    const octokit = createAuthorizedOctokit(installationId);

    return ResultAsync.fromPromise(
      octokit.graphql<{
        nodes: (
          | { id: string; title: string; body: string; mergedAt: string }
          | { id: string; message: string; committedDate: string }
        )[];
      }>(
        `
      query($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on Commit {
            id 
            message
            committedDate
          }
          ... on PullRequest {
            id
            title
            body
            mergedAt
          }
        }
      }
     
      `,
        {
          ids,
        }
      ),
      (error) =>
        new Error("Failed to get commits by ids from GitHub", { cause: error })
    ).andThen((response) => {
      return ok(response.nodes || []);
    });
  },

  getRepositoryBaseBranch: (
    installationId: number,
    owner: string,
    repo: string
  ) => {
    const octokit = createAuthorizedOctokit(installationId);

    return ResultAsync.fromPromise(
      octokit.graphql<{ repository: { defaultBranchRef: { name: string } } }>(
        `query($owner: String!, $repo: String!) {
          repository(owner: $owner, name: $repo) {
            defaultBranchRef {
              name
            }
          }
        }
      `,
        { owner, repo }
      ),
      (error) =>
        new Error("Failed to get repository base branch from GitHub", {
          cause: error,
        })
    ).andThen((response) => {
      return ok(response.repository.defaultBranchRef.name);
    });
  },
};
