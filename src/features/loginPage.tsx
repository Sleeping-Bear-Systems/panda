import { zValidator } from "@hono/zod-validator";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod/v4";

import type { Account } from "../shared/account/accountsProjection.js";
import { accountsCollectionName } from "../shared/account/accountsProjection.js";
import { appConfig } from "../shared/config.js";
import { pongo } from "../shared/database.js";
import { DefaultDateProvider } from "../shared/dateProvider.js";
import { Layout } from "../shared/Layout.js";
import { logger } from "../shared/logger.js";
import { API_ROUTES, PAGE_ROUTES } from "../shared/routes.js";

/**
 * Login page endpoint.
 */
export const loginPage = new Hono().get("/", (c) => {
  return c.html(
    <Layout title="Login">
      <h1>Login</h1>
      <form hx-post={API_ROUTES.LOGIN} hx-target="#errors">
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
        <div id="errors"></div>
        <button type="submit">Submit</button>
      </form>
      <a href={PAGE_ROUTES.CREATE_ACCOUNT}>Create Account</a>
    </Layout>,
  );
});

/**
 * The zod validator a login request
 */
const loginRequestSchema = z.object({
  username: z.string().trim().toLowerCase().min(3),
  password: z.string().min(12),
});

/**
 * Login API endpoint.
 */
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
      return c.html(<div>🛑 Invalid username or password</div>);
    }
    const isValidPassword = await Bun.password.verify(
      password,
      account.passwordHash,
      "bcrypt",
    );
    if (!isValidPassword) {
      logger.info("Invalid password: '%s'", username);
      return c.html(<div>🛑 Invalid username or password</div>);
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
    logger.info("Account '%s' logged in", account.accountId);
    c.header("HX-Redirect", PAGE_ROUTES.HOME);
    c.status(204);
    return c.text("");
  },
);
