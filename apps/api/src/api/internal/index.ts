import { authMiddleware } from "@api/middleware/auth";
import { corsMiddleware } from "@api/middleware/cors";
import { organizationMiddleware } from "@api/middleware/organization";
import { Hono } from "hono";
import { AssetsRouter } from "./assets";
import { AuthRouter } from "./auth";
import { BoardsRouter } from "./boards";
import { IntegrationsRouter } from "./integrations";
import { InvitationsRouter } from "./invitations";
import { MeRouter } from "./me";
import { MembersRouter } from "./members";
import { NotificationsRouter } from "./notifications";
import { OrganizationsRouter } from "./organizations";
import { PostsRouter } from "./posts";
import { RepositoryRouter } from "./repository";
import { TagsRouter } from "./tags";
import { WebhooksRouter } from "./webhooks";

const organizationNestedRouter = new Hono()
  .use(organizationMiddleware())
  .route("/members", MembersRouter)
  .route("/invitations", InvitationsRouter)
  .route("/posts", PostsRouter)
  .route("/tags", TagsRouter)
  .route("/boards", BoardsRouter)
  .route("/notifications", NotificationsRouter)
  .route("/repositories", RepositoryRouter)
  .route("/integrations", IntegrationsRouter);

export const internalApi = new Hono()
  .use(corsMiddleware())
  .route("/auth", AuthRouter)
  .route("/webhooks", WebhooksRouter)
  .use(authMiddleware())
  .route("/me", MeRouter)
  .route("/assets", AssetsRouter)
  .route(
    "/organizations",
    OrganizationsRouter.route("/:organizationId", organizationNestedRouter)
  );
