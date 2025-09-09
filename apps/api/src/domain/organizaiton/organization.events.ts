import type { User } from "better-auth";
import type { Organization } from "better-auth/plugins";

export class OrganizationCreatedEvent {
  static readonly eventName = "organization.created";

  constructor(
    readonly organization: Organization,
    readonly user: User
  ) {}
}
