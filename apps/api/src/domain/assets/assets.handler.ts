import { Config } from "@config/config.schema";
import { authMiddleware } from "@domain/auth";
import { zValidator } from "@hono/zod-validator";
import { S3 } from "@lib/s3";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { ResultAsync } from "neverthrow";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

export const AssetsHandler = new Hono()
  .use(authMiddleware({ required: true }))
  .post(
    "/avatar",
    zValidator("query", z.object({ type: z.string() })),
    async (c) => {
      const filename = uuidv4();

      const uploadUrlResult = await ResultAsync.fromPromise(
        S3.createUploadUrl(filename),
        (error) => new Error("Failed to create upload url", { cause: error })
      );

      if (uploadUrlResult.isErr()) {
        return notOk(c, { message: uploadUrlResult.error.message }, 500);
      }

      return ok(c, {
        uploadUrl: uploadUrlResult.value,
        filename,
        url: `${Config.s3.assetsBase}/${filename}`,
      });
    }
  )
  .post(
    "/logo",
    zValidator("query", z.object({ type: z.string() })),
    async (c) => {
      const filename = uuidv4();

      const uploadUrlResult = await ResultAsync.fromPromise(
        S3.createUploadUrl(filename),
        (error) => new Error("Failed to create upload url", { cause: error })
      );

      if (uploadUrlResult.isErr()) {
        return notOk(c, { message: uploadUrlResult.error.message }, 500);
      }

      return ok(c, {
        uploadUrl: uploadUrlResult.value,
        filename,
        url: `${Config.s3.assetsBase}/${filename}`,
      });
    }
  );
