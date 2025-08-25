import { Config } from "@config";
import { createClient } from "redis";

export const redis = createClient({
  url: Config.redis.url,
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Connect to Redis
redis.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

export default redis;