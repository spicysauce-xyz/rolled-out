import { Config } from "@config";
import { Queue } from "bullmq";
import { differenceInMilliseconds } from "date-fns";
import { ResultAsync } from "neverthrow";

const redisUrl = URL.parse(Config.redis.url);

export const POST_QUEUE_NAME = "post";

const queue = new Queue(POST_QUEUE_NAME, {
  connection: {
    host: redisUrl?.hostname,
    port: Number(redisUrl?.port),
    password: redisUrl?.password,
  },
});

export type PostPublishJob = {
  postId: string;
  organizationId: string;
};

export class SchedulePostPublishJobs {
  static readonly prefix = "publish";

  private id(postId: string) {
    return `${SchedulePostPublishJobs.prefix}:${postId}`;
  }

    const ms = differenceInMilliseconds(scheduledAt, new Date());
    return ms < 0 ? 0 : ms;
  }

  add(postId: string, organizationId: string, scheduledAt: Date) {
    const id = this.id(postId);
    const delay = this.delay(scheduledAt);

    return ResultAsync.fromPromise(
      queue.add(
        id,
        { postId, organizationId },
        {
          jobId: id,
          delay,
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        }
      ),
      (error) => new Error("Failed to add job to queue", { cause: error })
    );
  }

  remove(postId: string) {
    const id = this.id(postId);
    return ResultAsync.fromPromise(
      queue.remove(id),
      (error) => new Error("Failed to remove job from queue", { cause: error })
    );
  }
}
