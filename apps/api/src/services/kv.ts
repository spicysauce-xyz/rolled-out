import { createClient } from "@redis/client";
import { Config } from "@services/config";

export const KV = await createClient({
  url: Config.redis.url,
})
  .on("error", (err) => console.log("Redis Client Error:", err))
  .connect();
