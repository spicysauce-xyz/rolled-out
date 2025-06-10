import { Config } from "@config/config.schema";
import { authMiddleware } from "@domain/auth";
import { zValidator } from "@hono/zod-validator";
import { S3 } from "@lib/s3";
import { ok } from "@utils/network";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

export const AssetsHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .post("/avatar", zValidator("query", z.object({ type: z.string() })), async (c) => {
    const filename = uuidv4();

    const uploadUrl = await S3.createUploadUrl(filename);

    return ok(c, { uploadUrl, filename, url: `${Config.s3.assetsBase}/${filename}` });
  });
