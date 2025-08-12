import { zValidator } from "@hono/zod-validator";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod/v4";

import type {
  Account} from "../shared/account/accountsProjection";
import {
  accountsCollectionName,
} from "../shared/account/accountsProjection";
import { appConfig } from "../shared/config";
import { pongo } from "../shared/database";
import { DefaultDateProvider } from "../shared/dateProvider";
import { Head } from "../shared/head";
import { logger } from "../shared/logger";
import { API_ROUTES, ROUTES } from "../shared/routes";

export const loginPage = new Hono().get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <h1>Login</h1>
        <form action={API_ROUTES.LOGIN} method="post">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autocomplete="username"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autocomplete="current-password"
          />
          <button type="submit">Submit</button>
        </form>
        <a href={ROUTES.CREATE_ACCOUNT}>Create Account</a>
      </body>
    </html>,
  );
});

/** The zod validator a login request */
const loginRequestSchema = z.object({
  username: z.string().nonempty().toLowerCase().trim(),
  password: z.string().nonempty().trim(),
});

/** Login request */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Maps the login endpoint. */
export const loginApi = new Hono().post(
  "/",
  zValidator("form", loginRequestSchema),
  async (c) => {
    const { username, password } = c.req.valid("form");
    const account = await pongo
      .db()
      .collection<Account>(accountsCollectionName)
      .findOne({ username });
    if (!account) {
      logger.info("User not found: '%s'", username);
      return c.text("Invalid username or password", 401);
    }
    const isValidPassword = await Bun.password.verify(
      password,
      account.passwordHash,
      "bcrypt",
    );
    if (!isValidPassword) {
      logger.info("Invalid password: '%s'", username);
      return c.text("Invalid username or password", 401);
    }
    const token = await sign(
      {
        sub: account.accountId,
        preferred_username: account.username,
        email: account.email,
        role: account.role,
        iss: "panda",
        exp: Math.floor(addDays(DefaultDateProvider(), 1).getTime() / 1000),
        iat: Math.floor(Date.now() / 1000),
      },
      appConfig.JWT_SECRET,
    );
    setCookie(c, appConfig.jwtCookieName, token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      expires: addDays(DefaultDateProvider(), 1),
    });
    logger.info("User '%s' logged in", username);
    return c.redirect(ROUTES.HOME);
  },
);
