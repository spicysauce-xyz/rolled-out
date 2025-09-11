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
  name = "publish-scheduled-post";
  queue = "post" as const;

  constructor(
    private readonly post: SchedulePostPublishJobsPayload["post"],
    private readonly member: SchedulePostPublishJobsPayload["member"]
  ) {}

  get id() {
    return `${SchedulePostPublishJobs.prefix}:${this.post.id}`;
  }

  get payload() {
    return { post: this.post, member: this.member };
  }

  get delay() {
    return Math.max(
      differenceInMilliseconds(this.post.scheduledAt, new Date()),
      0
    );
  }
}
