export class UserAcceptedInvitationEvent {
  static readonly eventName = "user.acceptedInvitation";

  constructor(
    readonly userId: string,
    readonly organizationId: string,
    readonly role: "member" | "admin" | "owner"
  ) {}
}
