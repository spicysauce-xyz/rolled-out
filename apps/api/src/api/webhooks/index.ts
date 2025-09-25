import { Hono } from "hono";
import { GithubWebhooksRouter } from "./github";

export const webhooksApi = new Hono().route("/github", GithubWebhooksRouter);
