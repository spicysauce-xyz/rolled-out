import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";

const APP_ID = 1_948_006;
const CLIENT_ID = "Iv23liEOkpaASeCD4KfA";
const CLIENT_SECRET = "SECRET";
const PEM = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA7uiWaUj8tsun2ivhnF/rtZjZ5yqX2RcDae1xL3x81s7zAcU5
13pRQyKrZaJGBiKq83M1Ge8Ye1K0JZT2uFngnHzHnSj1LKHzitk/7URrgFOJAMou
QiO2wwgPD0Rp2su1a5+JrokZLvTcTjEYT5NwOzw+bQ6Ka77L72XesCNcWXkhEx3T
RHtZJqj5xIWIAi7c7D3FAijFF2GD7YtmuWEcYSAc1irYIm96gV24ea9pja3A32nv
YfADIFg8XzpJDfEaPUxNnJzn7JRKiXxhL6NuBn/rGgo4AbQWO1nBm3xo068sPO2g
UzVbUpSVR8prFoNhRNbQO3Fy+CIU5e1nliAxrwIDAQABAoIBAQDMszrVITVvBlZe
qASaMNHMehgSartKxd4l781wK5DnmNA8LxndV6+y/0yuO3kWHrQs/gR8oRFv8S/r
l5RB5rh+PKfoL8TKpkT/LiAJEvutK2YS6Cj0gJdCym/k2/B7CNn8Sej1RADw69qr
oIM9A45BIuA2HyRZJ1SjXbyNXO7utSO36IcfFMxbP5gtF/pgEUPZ+ZMKiwm7ibr0
Qx2799qjovTy50CpXIxj4EatViJytVosXy2unGT4/EEwLny8+xO0NyHjtIXmxjbY
TluvMkXWYih6EUV0i8b5vOZwBlKrBRfiMF7VGcRyuAtNGqgGUQIyhZuRYcctLHCw
mabXVAjRAoGBAP6oCfRCrBbmf0Ij9+S06BUK3NSu4LuxxXdFYwMQ6dVGdpMJ7OAg
ssW9E8or9e/Q/fEnYk9ixBMNBCpyxu90gEuAN9e97dQPmfAV0SxY10jpxEgOPQVA
+mgbBfp8B40DpyncICWMwGaO94xI7VBdfAxyJ1nnUTjRvNlCkubj8ManAoGBAPAr
RzpSDW1xL5GvKyvK8RA3bWX7lapnTatZpbqpP1TykDlkUJbwW3y2VdYdj1Cs07a+
/ono1RKx0e7vo4eTEWvvaWcZeqWKDLkhVTJlwNtXK33vXk7XbGKN7O+LBsryiguZ
grQGT8jID4wdkY1wuSIsyQdN0uUyxAO+slokEaW5AoGABS76dOReiGDMulXtF9Su
3K7J6/JbVLa7pD/fUhKoD9VNWJTdI3rG6Mt+eaEHcog4gw4gLCmAgDrFmO+ZKQqg
CelkOZn+G1Dt+zsWdOaiCzPm8OiJSXAXKMNUDdM0fCRU5L88UEdbKztBwrNBUV91
xPMV5fiVaKisRWfbgaOmJQUCgYBS17rUBSWYkKhF6lRL4M7SNyxHN0bi5otGBcBC
6MpttNXG1jFuPy5vkD1/g+bBfzvwF2WZkHSe5DNz5blUtIgX4RdMdt91Zm8JFNRc
c/jYL/NSl1TCgVBjlm0aG6yWKJ8xbRxGmL7AlTG3tSNV1IInpacaG+AZKy+t0wOW
UEa+EQKBgQCyc/UXAtFf4488bxSBohIRyE0kp5gfNmAdUL3cHhc6W69E7Ib8cA5Q
0lIJxlNj2/d52eIbQwg5SBIZg2V7x2QrKElsL/REnmWudJ61mBZaS9XzSCa8+b5z
eUqlc3mK7kGoOlziB/Q0pXhfcs1HEeQwvFSBMhpzc7Tb4NfbX8pYzQ==
-----END RSA PRIVATE KEY-----
`;

const createAuthorizedOctokit = (installationId: number) => {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      privateKey: PEM,
      installationId,
    },
  });
};

export const Github = {
  getCommits: async (
    installationId: number,
    filters: {
      owner: string;
      repo: string;
      ref: string;
    },
    pagination?: {
      limit?: number;
      cursor?: string;
    }
  ) => {
    const octokit = createAuthorizedOctokit(installationId);

    const response = await octokit.graphql<{
      repository: {
        ref: {
          target: {
            history: {
              nodes: {
                oid: string;
                message: string;
                committedDate: string;
                author: {
                  user: {
                    login: string;
                  };
                  avatarUrl: string;
                };
                associatedPullRequests: {
                  totalCount: number;
                  nodes: {
                    number: number;
                    title: string;
                    body: string;
                    url: string;
                    state: string;
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
                    oid 
                    message
                    committedDate
                    author {
                      avatarUrl
                      user {
                        login
                      }
                    }
                    associatedPullRequests(first: 1) {
                      totalCount
                      nodes {
                        number
                        title
                        body
                        url
                        mergedAt
                        state
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
        owner: filters.owner,
        repo: filters.repo,
        ref: filters.ref,
        cursor: pagination?.cursor,
        limit: pagination?.limit ?? 25,
      }
    );

    const commits = response.repository?.ref?.target?.history.nodes;
    const paginationInfo = response.repository?.ref?.target?.history.pageInfo;

    if (!commits) {
      return {
        data: [],
        cursor: undefined,
      };
    }

    const list: {
      sha: string;
      type: "pr" | "commit";
      title: string;
      description?: string;
      number?: number;
      date: string;
      committer: {
        login: string;
        avatarUrl: string;
      };
    }[] = [];

    for (const commit of commits) {
      const isPr = commit.associatedPullRequests.nodes.length > 0;

      if (isPr) {
        const pr = commit.associatedPullRequests.nodes[0];

        const isPrAlreadyAdded = list.find(
          (listItem) => listItem.number === pr.number
        );

        if (!isPrAlreadyAdded) {
          list.push({
            sha: commit.oid,
            type: "pr",
            number: pr.number,
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
          sha: commit.oid,
          type: "commit",
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
      cursor: paginationInfo.hasNextPage ? paginationInfo.endCursor : undefined,
    };
  },
};
