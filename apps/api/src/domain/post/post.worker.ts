import { Config } from "@config";
import { Emitter } from "@events";
import { type Job, Worker } from "bullmq";
import { ScheduledPostPublishedEvent } from "./post.events";
import {
  POST_QUEUE_NAME,
  type PostPublishJob,
  SchedulePostPublishJobs,
} from "./post.jobs";
import { PostsService } from "./post.service";

const handlePostPublishJob = async (job: Job<PostPublishJob>) => {
  const { postId, organizationId } = job.data;

  const result = await PostsService.publishPostById(
    { organizationId },
    postId
  ).andThrough((post) =>
    Emitter.emitAsync(
      ScheduledPostPublishedEvent.eventName,
      new ScheduledPostPublishedEvent(post, organizationId)
    )
  );

  if (result.isErr()) {
    throw result.error;
  }
};

const redisUrl = URL.parse(Config.redis.url);

new Worker(
  POST_QUEUE_NAME,
  (job) => {
    if (!job.id) {
      return Promise.reject(new Error("Job ID is required"));
    }

    if (job.name.startsWith(SchedulePostPublishJobs.prefix)) {
      return handlePostPublishJob(job);
    }

    return Promise.reject(new Error("Unknown job type"));
  },
  {
    connection: {
      family: 0,
      host: redisUrl?.hostname,
      port: Number(redisUrl?.port),
      password: redisUrl?.password,
    },
    removeOnComplete: { count: 0 },
    concurrency: 10,
  }
);
