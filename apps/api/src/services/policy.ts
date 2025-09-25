import type { Organization } from "better-auth/plugins/organization";
import { err, ok, type Result } from "neverthrow";
import type { Editor, Invitation, Member, Post } from "./db";

type AnyEntity = Record<string | number | symbol, unknown> | undefined;

class Builder<T extends [string, string, AnyEntity]> {
  private rules: {
    action: string;
    subject: string;
    condition?: (entity: AnyEntity) => boolean;
  }[] = [];

  can<
    A extends T[0],
    S extends Extract<T, [A, unknown, unknown]>[1],
    E extends Extract<T, [A, S, unknown]>[2],
  >(action: A, subject: S, condition?: (entity: E) => boolean) {
    const updatedCondition = condition
      ? (entity: AnyEntity) => condition(entity as E)
      : undefined;

    this.rules.push({ action, subject, condition: updatedCondition });
  }

  build() {
    const frozenRules = Object.freeze(this.rules);

    return {
      can: <
        A extends T[0],
        S extends Extract<T, [A, unknown, unknown]>[1],
        E extends Extract<T, [A, S, unknown]>[2],
      >(
        action: A,
        subject: S,
        entity: E
      ): Result<boolean, Error> => {
        const allowed = frozenRules.some(
          (rule) =>
            rule.action === action &&
            rule.subject === subject &&
            (!rule.condition || rule.condition(entity))
        );

        return allowed ? ok(true) : err(new Error("Not allowed"));
      },
    };
  }
}

type ReadOrganizationPolicy = [
  "read",
  "organization",
  Pick<Organization, "id">,
];
type UpdateOrganizationPolicy = [
  "update",
  "organization",
  Pick<Organization, "id">,
];
type ReadPostPolicy = ["read", "post", Pick<Post, "organizationId">];
type CreatePostPolicy = ["create", "post", Pick<Post, "organizationId">];
type PublishPostPolicy = [
  "publish",
  "post",
  Pick<Post, "id" | "organizationId"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type UnpublishPostPolicy = [
  "unpublish",
  "post",
  Pick<Post, "id" | "organizationId"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type SchedulePostPolicy = [
  "schedule",
  "post",
  Pick<Post, "id" | "organizationId"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type UnschedulePostPolicy = [
  "unschedule",
  "post",
  Pick<Post, "id" | "organizationId"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type DeletePostPolicy = [
  "delete",
  "post",
  Pick<Post, "id" | "organizationId"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type ReadMemberPolicy = ["read", "member", Pick<Member, "organizationId">];
type DeleteMemberPolicy = [
  "delete",
  "member",
  Pick<Member, "id" | "organizationId" | "role">,
];
type UpdateMemberPolicy = [
  "update",
  "member",
  Pick<Member, "id" | "organizationId" | "role">,
];
type ReadInvitationPolicy = [
  "read",
  "invitation",
  Pick<Invitation, "organizationId">,
];
type CreateInvitationPolicy = [
  "create",
  "invitation",
  Pick<Invitation, "organizationId" | "role">,
];
type DeleteInvitationPolicy = [
  "delete",
  "invitation",
  Pick<Invitation, "id" | "organizationId" | "inviterId">,
];

type Policies =
  | ReadOrganizationPolicy
  | UpdateOrganizationPolicy
  | ReadPostPolicy
  | CreatePostPolicy
  | PublishPostPolicy
  | UnpublishPostPolicy
  | SchedulePostPolicy
  | UnschedulePostPolicy
  | DeletePostPolicy
  | ReadMemberPolicy
  | DeleteMemberPolicy
  | UpdateMemberPolicy
  | ReadInvitationPolicy
  | CreateInvitationPolicy
  | DeleteInvitationPolicy;

export const Policy = {
  defineAbilityForMember: (member: Member) => {
    const builder = new Builder<Policies>();

    builder.can(
      "read",
      "organization",
      (entity) => entity.id === member.organizationId
    );
    builder.can("update", "organization", (entity) => {
      return entity.id === member.organizationId && member.role === "owner";
    });
    builder.can(
      "read",
      "post",
      (entity) => entity.organizationId === member.organizationId
    );
    builder.can(
      "create",
      "post",
      (entity) => entity.organizationId === member.organizationId
    );
    builder.can("publish", "post", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (["admin", "owner"].includes(member.role)) {
        return true;
      }

      return entity.editors.some(
        (editor) => editor.member.id === member.id && editor.role === "creator"
      );
    });
    builder.can("unpublish", "post", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (["admin", "owner"].includes(member.role)) {
        return true;
      }

      return entity.editors.some(
        (editor) => editor.member.id === member.id && editor.role === "creator"
      );
    });
    builder.can("schedule", "post", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (["admin", "owner"].includes(member.role)) {
        return true;
      }

      return entity.editors.some(
        (editor) => editor.member.id === member.id && editor.role === "creator"
      );
    });
    builder.can("unschedule", "post", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (["admin", "owner"].includes(member.role)) {
        return true;
      }

      return entity.editors.some(
        (editor) => editor.member.id === member.id && editor.role === "creator"
      );
    });
    builder.can("delete", "post", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (["admin", "owner"].includes(member.role)) {
        return true;
      }

      return entity.editors.some(
        (editor) => editor.member.id === member.id && editor.role === "creator"
      );
    });

    builder.can(
      "read",
      "member",
      (entity) => entity.organizationId === member.organizationId
    );
    builder.can("delete", "member", (entity) => {
      if (entity.id === member.id) {
        return false;
      }

      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (member.role === "owner") {
        return true;
      }

      if (member.role === "admin") {
        return entity.role === "member" || entity.role === "admin";
      }

      return false;
    });
    builder.can("update", "member", (entity) => {
      if (entity.id === member.id) {
        return false;
      }

      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (member.role === "owner") {
        return true;
      }

      if (member.role === "admin") {
        return entity.role === "member" || entity.role === "admin";
      }

      return false;
    });

    builder.can(
      "read",
      "invitation",
      (entity) => entity.organizationId === member.organizationId
    );
    builder.can("create", "invitation", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (
        member.role === "owner" &&
        ["owner", "admin", "member"].includes(entity.role)
      ) {
        return true;
      }

      if (
        member.role === "admin" &&
        ["admin", "member"].includes(entity.role)
      ) {
        return true;
      }

      return false;
    });
    builder.can("delete", "invitation", (entity) => {
      if (entity.organizationId !== member.organizationId) {
        return false;
      }

      if (member.role === "owner") {
        return true;
      }

      if (member.role === "admin") {
        return entity.inviterId === member.id;
      }

      return false;
    });

    return builder.build();
  },
};
