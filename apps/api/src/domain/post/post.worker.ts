import { Emitter } from "@services/events";
import { createQueueWorker } from "@services/queue";
import type { Job as BullJob } from "bullmq";
import { ScheduledPostPublishedEvent } from "./post.events";
import { SchedulePostPublishJobs } from "./post.jobs";
import { PostService } from "./post.service";

const handlePostPublishJob = (
  job: BullJob<SchedulePostPublishJobs["payload"]>
) => {
  return PostService.publishPostById(
    job.data.member,
    job.data.post.id
  ).andThrough((post) =>
    Emitter.emitAsync(
      ScheduledPostPublishedEvent.eventName,
      new ScheduledPostPublishedEvent(post, job.data.member.organizationId)
    )
  );
};

const registerPostWorker = () => {
  createQueueWorker("post", {
    [SchedulePostPublishJobs.prefix]: handlePostPublishJob,
  });
};

export { registerPostWorker };
