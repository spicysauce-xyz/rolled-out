import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { ResultAsync } from "neverthrow";
import z from "zod";
import { Config } from "./config";

const openai = createOpenAI({
  apiKey: Config.openai.apiKey,
});

export const AI = {
  generatePostContentFromGithubCommits(
    commits: ({ title: string; body: string } | { message: string })[]
  ) {
    return ResultAsync.fromPromise(
      generateObject({
        model: openai("gpt-5"),
        prompt: `
You are given a list of GitHub commits (with commit messages) and pull requests (with titles and PR bodies). Your task is to generate a structured release note with contextual section headings and short explanatory paragraphs that feel human, simple, and product-driven.

Instructions

Write in clear, simple wording — avoid technical jargon, complex phrasing, or corporate marketing language.

Focus on what changed and why it matters to customers.

Use ## (H2) for high-level themes of the release (e.g., Faster page loading, More control over notifications, Drafts you won’t lose).

Use ### (H3) for related sub-updates when needed.

Write in paragraphs. Do not use bullet lists.

Titles and subtitles must always be contextual to the actual change — never generic categories like New Features, Fixes, or Improvements.

Do not use filler, clichés, or phrases that sound AI-generated (e.g., helping you plan ahead, seamlessly manage, maintain a consistent cadence, empowering you).

Keep the tone natural, like a human PM writing an update. Vary sentence length slightly so it doesn’t feel robotic.

If several commits/PRs relate to the same area, group them into one cohesive update.

Do not mention commit hashes, PR numbers, or internal references.

COMMITS:

${commits
  .map((commit) =>
    "message" in commit ? commit.message : `${commit.title}\n${commit.body}`
  )
  .join("------------\n")}
        `,
        schema: z.object({
          title: z.string().describe("The title of the release note"),
          sections: z
            .array(
              z.object({
                title: z
                  .object({
                    text: z.string().describe("The text of the title"),
                    level: z
                      .enum(["2", "3"])
                      .describe("The level of the title"),
                  })
                  .describe("The title of the section"),
                paragraphs: z.array(
                  z.string().describe("The paragraphs of the section")
                ),
              })
            )
            .describe("The sections of the release note"),
        }),
      }),
      (error) => new Error("Failed to generate text", { cause: error })
    ).map(({ object }) => object);
  },
};
