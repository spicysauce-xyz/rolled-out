import EventEmitter2 from "eventemitter2";
import { ResultAsync } from "neverthrow";

const ee = new EventEmitter2({
  wildcard: false,
  delimiter: ".",
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: true,
  ignoreErrors: true,
});

const Emitter = {
  on: <T = unknown>(eventName: string, callback: (payload: T) => ResultAsync<unknown, unknown>) => {
    ee.on(eventName, callback);
  },
  emitAsync: <T = unknown>(eventName: string, payload: T) =>
    ResultAsync.fromSafePromise(ee.emitAsync(eventName, payload))
      .andThen(ResultAsync.combine)
      .map(() => payload)
      .mapErr((error) => error as Error),
};

export { Emitter };
