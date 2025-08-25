#!/usr/bin/env tsx

import "dotenv/config";
import { scheduledPostsWorker } from "@lib/queue";

console.log("Starting scheduled posts worker...");

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await scheduledPostsWorker.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await scheduledPostsWorker.close();
  process.exit(0);
});

// Keep the process alive
console.log("Worker is running. Press Ctrl+C to stop.");