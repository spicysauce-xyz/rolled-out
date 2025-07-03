import type { Member, Organization } from "better-auth/plugins";

export class OrganizationCreatedEvent {
  static readonly eventName = "organization.created";

  constructor(
    readonly organization: Organization,
    readonly member: Member
  ) {}
}
