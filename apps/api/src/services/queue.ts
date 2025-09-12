import { Config } from "@services/config";
import { type Job as BullJob, Queue as BullQueue, Worker } from "bullmq";
import { ResultAsync } from "neverthrow";

const redisUrl = URL.parse(Config.redis.url);

const connection = {
  family: 0,
  host: redisUrl?.hostname,
  port: Number(redisUrl?.port),
  password: redisUrl?.password,
};

export interface Job<
  T extends Record<string | number | symbol, unknown> = Record<string, unknown>,
> {
  id: string;
  name: string;
  payload: T;
  delay?: number;
}

const createQueue = (name: string) => {
  return new BullQueue(name, {
    connection,
  });
};

type QueueName = "post";

const QUEUE_MAP: Record<QueueName, BullQueue> = {
  post: createQueue("post"),
};

export const Queue = {
  add(queue: QueueName, job: Job) {
    return ResultAsync.fromPromise(
      QUEUE_MAP[queue].add(job.name, job.payload, {
        jobId: job.id,
        delay: job.delay ?? 0,
      }),
      (error) => new Error("Failed to add job to queue", { cause: error })
    );
  },
  remove(queue: QueueName, id: Job["id"]) {
    return ResultAsync.fromPromise(
      QUEUE_MAP[queue].remove(id),
      (error) => new Error("Failed to remove job from queue", { cause: error })
    );
  },
};

export const createQueueWorker = (
  name: string,
  handlers: Record<string, (job: BullJob) => ResultAsync<unknown, Error>>
) => {
  new Worker(
    name,
    async (job) => {
      if (!job.id) {
        return Promise.reject(new Error("Job id is required"));
      }

      const prefix = job.id.split(":")[0];
      const handler = handlers[prefix];

      if (!handler) {
        return Promise.reject(new Error(`No handler found for job ${job.id}`));
      }

      const result = await handler(job);

      if (result.isErr()) {
        return Promise.reject(result.error);
      }

      return result.value;
    },
    {
      connection,
      removeOnComplete: { count: 0 },
      concurrency: 10,
    }
  );
};
