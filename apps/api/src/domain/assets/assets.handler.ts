import { Config } from "@config/config.schema";
import { authMiddleware } from "@domain/auth";
import { S3 } from "@lib/s3";
import { validator } from "@lib/validator";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

export const AssetsHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .post("/avatar", validator("query", z.object({ type: z.string() })), (c) => {
    const filename = uuidv4();

    return S3.createUploadUrl(filename).match(
      (uploadUrl) =>
        ok(c, {
          uploadUrl,
          filename,
          url: `${Config.s3.assetsBase}/${filename}`,
        }),
      (error) => notOk(c, { message: error.message }, 500)
    );
  })
  .post("/logo", validator("query", z.object({ type: z.string() })), (c) => {
    const filename = uuidv4();

    return S3.createUploadUrl(filename).match(
      (uploadUrl) =>
        ok(c, {
          uploadUrl,
          filename,
          url: `${Config.s3.assetsBase}/${filename}`,
        }),
      (error) => notOk(c, { message: error.message }, 500)
    );
  });
