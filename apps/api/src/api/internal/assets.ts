import { validate } from "@api/middleware/validate";
import { Config } from "@services/config";
import { S3 } from "@services/s3";
import { notOk, ok } from "@utils/network";
import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

export const AssetsRouter = new Hono()
  .post("/avatar", validate("query", z.object({ type: z.string() })), (c) => {
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
  .post("/logo", validate("query", z.object({ type: z.string() })), (c) => {
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
  .post("/image", validate("query", z.object({ type: z.string() })), (c) => {
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
