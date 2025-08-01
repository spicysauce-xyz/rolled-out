import { Config } from "@config";
import { createClient } from "@redis/client";

export const KV = await createClient({
  url: Config.redis.url,
})
  .on("error", (err) => console.log("Redis Client Error:", err))
  .connect();
