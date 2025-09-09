import { Emitter } from "@services/events";
import { createQueueWorker } from "@services/queue";
import type { Job as BullJob } from "bullmq";
import { ScheduledPostPublishedEvent } from "./post.events";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostService } from "./post.service";

const handlePostPublishJob = async (
  job: BullJob<SchedulePostPublishJobs["payload"]>
) => {
  const { postId, organizationId } = job.data;

  const result = await PostService.publishPostById(
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

const registerPostWorker = () => {
  createQueueWorker("post", {
    [SchedulePostPublishJobs.prefix]: handlePostPublishJob,
  });
};

export { registerPostWorker };
