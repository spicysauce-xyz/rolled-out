import { err, ok, type Result } from "neverthrow";
import type { Editor, Member, Post } from "./db";

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
        entity: E,
        options?: {
          notAllowedErrorMessage?: string;
        }
      ): Result<boolean, Error> => {
        const allowed = frozenRules.some(
          (rule) =>
            rule.action === action &&
            rule.subject === subject &&
            (!rule.condition || rule.condition(entity))
        );

        return allowed
          ? ok(true)
          : err(new Error(options?.notAllowedErrorMessage ?? "Not allowed"));
      },
    };
  }
}

type CreatePostPolicy = ["create", "post", Pick<Post, "organizationId">];
type DeletePostPolicy = [
  "delete",
  "post",
  Pick<Post, "id"> & {
    editors: (Pick<Editor, "id" | "role"> & { member: Pick<Member, "id"> })[];
  },
];
type Policies = CreatePostPolicy | DeletePostPolicy;

export const Policy = {
  defineAbilityForMember: (member: Member) => {
    const builder = new Builder<Policies>();

    builder.can(
      "create",
      "post",
      (entity) => entity.organizationId === member.organizationId
    );
    builder.can("delete", "post", (entity) =>
      entity.editors.some((editor) => editor.member.id === member.id)
    );

    return builder.build();
  },
};
