import type { Member, Organization } from "better-auth/plugins";

export class OrganizationCreatedEvent {
  static readonly eventName = "organization.created";

  constructor(
    public readonly organization: Organization,
    public readonly member: Member,
  ) {}
}
