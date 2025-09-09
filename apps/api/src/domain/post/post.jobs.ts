import type { Job } from "@services/queue";
import { differenceInMilliseconds } from "date-fns";

export class SchedulePostPublishJobs
  implements Job<{ postId: string; organizationId: string }>
{
  static readonly prefix = "publish";
  name = "publish-scheduled-post";
  queue = "post" as const;

  constructor(
    private readonly post: {
      id: string;
      organizationId: string;
      scheduledAt: Date;
    }
  ) {}

  get id() {
    return `${SchedulePostPublishJobs.prefix}:${this.post.id}`;
  }

  get payload() {
    return { postId: this.post.id, organizationId: this.post.organizationId };
  }

  get delay() {
    return Math.max(
      differenceInMilliseconds(this.post.scheduledAt, new Date()),
      0
    );
  }
}
