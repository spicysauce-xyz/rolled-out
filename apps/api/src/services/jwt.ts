import { jwtVerify, SignJWT } from "jose";
import { ResultAsync } from "neverthrow";
import { Config } from "./config";

const SECRET = new TextEncoder().encode(Config.jwt.secret);

export const JWT = {
  sign: (payload: Record<string | number | symbol, unknown>, ttl = "1h") => {
    return ResultAsync.fromPromise(
      new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(ttl)
        .sign(SECRET),
      (error) => new Error("Failed to sign JWT", { cause: error })
    );
  },
  verify: <T = Record<string | number | symbol, unknown>>(token: string) => {
    return ResultAsync.fromPromise(
      jwtVerify(token, SECRET),
      (error) => new Error("Failed to verify JWT", { cause: error })
    ).map(({ payload }) => payload as T);
  },
};
