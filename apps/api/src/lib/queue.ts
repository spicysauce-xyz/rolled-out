import { Config } from "@config";
import { Queue, Worker } from "bullmq";
import { PostsRepository } from "@domain/post/post.repository";

export const SCHEDULED_POSTS_QUEUE = "scheduled-posts";

// Create the queue
export const scheduledPostsQueue = new Queue(SCHEDULED_POSTS_QUEUE, {
  connection: {
    host: new URL(Config.redis.url).hostname,
    port: parseInt(new URL(Config.redis.url).port) || 6379,
    password: new URL(Config.redis.url).password || undefined,
    db: parseInt(new URL(Config.redis.url).pathname.slice(1)) || 0,
  },
});

// Job data interface
export interface ScheduledPostJobData {
  postId: string;
  organizationId: string;
}

// Queue service functions
export const QueueService = {
  // Schedule a post to be published
  schedulePost: async (
    postId: string,
    organizationId: string,
    scheduledAt: Date
  ): Promise<string> => {
    const delay = scheduledAt.getTime() - Date.now();
    
    if (delay <= 0) {
      throw new Error("Cannot schedule a post in the past");
    }

    const job = await scheduledPostsQueue.add(
      "publish-post",
      { postId, organizationId } as ScheduledPostJobData,
      {
        delay,
        removeOnComplete: 10,
        removeOnFail: 10,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    return job.id!;
  },

  // Remove a scheduled job
  removeScheduledJob: async (jobId: string): Promise<boolean> => {
    try {
      const job = await scheduledPostsQueue.getJob(jobId);
      if (job) {
        await job.remove();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to remove scheduled job:", error);
      return false;
    }
  },

  // Reschedule a post (remove old job and create new one)
  reschedulePost: async (
    oldJobId: string,
    postId: string,
    organizationId: string,
    scheduledAt: Date
  ): Promise<string> => {
    // Remove the old job
    await this.removeScheduledJob(oldJobId);
    
    // Schedule the new job
    return await this.schedulePost(postId, organizationId, scheduledAt);
  },
};

// Worker to process scheduled posts
export const scheduledPostsWorker = new Worker(
  SCHEDULED_POSTS_QUEUE,
  async (job) => {
    const { postId, organizationId } = job.data as ScheduledPostJobData;

    console.log(`Processing scheduled post: ${postId} for organization: ${organizationId}`);

    try {
      // Update post status to published and remove scheduledAt
      const result = await PostsRepository.updatePostStatus(
        postId,
        organizationId,
        "published"
      );

      if (result.isErr()) {
        throw new Error(`Failed to publish post: ${result.error.message}`);
      }

      // Clear the scheduledAt and scheduleJobId fields
      await PostsRepository.clearScheduleData(postId, organizationId);

      console.log(`Successfully published post: ${postId}`);
      return { success: true, postId };
    } catch (error) {
      console.error(`Failed to publish post ${postId}:`, error);
      throw error;
    }
  },
  {
    connection: {
      host: new URL(Config.redis.url).hostname,
      port: parseInt(new URL(Config.redis.url).port) || 6379,
      password: new URL(Config.redis.url).password || undefined,
      db: parseInt(new URL(Config.redis.url).pathname.slice(1)) || 0,
    },
    concurrency: 5,
  }
);

// Worker event handlers
scheduledPostsWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

scheduledPostsWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

scheduledPostsWorker.on("error", (err) => {
  console.error("Worker error:", err);
});