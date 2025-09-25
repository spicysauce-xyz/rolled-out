import { registerMemberSubscriptions } from "./member";
import { registerNotificationSubscriptions } from "./notification";
import { registerTagSubscriptions } from "./tag";

export const registerEvents = () => {
  registerMemberSubscriptions();
  registerNotificationSubscriptions();
  registerTagSubscriptions();
};

import { registerPostWorker } from "./post/post.worker";

export const registerWorkers = () => {
  registerPostWorker();
};
