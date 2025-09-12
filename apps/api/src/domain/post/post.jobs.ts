import type { Member, Post } from "@services/db";
import type { Job } from "@services/queue";
import { differenceInMilliseconds } from "date-fns";

type SchedulePostPublishJobsPayload = {
  post: Post & {
    scheduledAt: Date;
  };
  member: Member;
};

export class SchedulePostPublishJobs
  implements Job<SchedulePostPublishJobsPayload>
{
  static readonly prefix = "publish";
  static readonly queue = "post" as const;

  static id(post: SchedulePostPublishJobsPayload["post"]) {
    return `${SchedulePostPublishJobs.prefix}:${post.id}`;
  }

  id: string;
  payload: SchedulePostPublishJobsPayload;
  delay: number;
  name = "publish-scheduled-post";

  constructor(
    post: SchedulePostPublishJobsPayload["post"],
    member: SchedulePostPublishJobsPayload["member"]
  ) {
    this.id = SchedulePostPublishJobs.id(post);
    this.payload = { post, member };
    this.delay = Math.max(
      differenceInMilliseconds(post.scheduledAt, new Date()),
      0
    );
  }
}
