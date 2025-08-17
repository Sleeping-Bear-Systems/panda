import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { z } from "zod/v4";

import { decide } from "../shared/account/accountCommand.js";
import { handle } from "../shared/account/accountState.js";
import type { ChangePassword } from "../shared/account/changePassword.js";
import { eventStore } from "../shared/database.js";
import { DefaultDateProvider } from "../shared/dateProvider.js";
import { Layout } from "../shared/Layout.js";
import type { PandaJwtVariables } from "../shared/middlewares.js";
import { apiJwt, pageJwt } from "../shared/middlewares.js";
import { API_ROUTES, PAGE_ROUTES } from "../shared/routes.js";

/**
 * Change password page.
 */
export const changePasswordPage = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", pageJwt)
  .get("/", (c) => {
    return c.html(
      <Layout title="Change Password">
        <nav>
          <a href={PAGE_ROUTES.HOME}>Home</a>
        </nav>
        <header>
          <h1>Change Password</h1>
        </header>
        <form action={API_ROUTES.CHANGE_PASSWORD} method="post">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autocomplete="new-password"
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autocomplete="new-password"
          />
          <button type="submit">Submit</button>
        </form>
        <div id="errors"></div>
      </Layout>,
    );
  });

/**
 * Change password request schema.
 */
const changPasswordRequestSchema = z
  .object({
    password: z.string().nonempty().min(12).trim(),
    confirmPassword: z.string().nonempty().min(12).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Change password API.
 */
export const changePasswordApi = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", apiJwt)
  .post("/", zValidator("form", changPasswordRequestSchema), async (c) => {
    const accountId = c.get("jwtPayload").sub;
    const { password } = c.req.valid("form");
    const now = DefaultDateProvider();
    const passwordHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const command: ChangePassword = {
      type: "ChangePassword",
      data: {
        accountId,
        passwordHash,
      },
      metadata: {
        accountId,
        correlationId: randomUUIDv7("hex", now),
        timestamp: now,
      },
    };
    await handle(eventStore, accountId, (state) => decide(command, state));
    return c.redirect(PAGE_ROUTES.HOME);
  });
