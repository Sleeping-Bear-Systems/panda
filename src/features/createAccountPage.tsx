import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { z } from "zod/v4";

import { decide } from "../shared/account/accountCommand.js";
import { handle as handle } from "../shared/account/accountState.js";
import type { CreateAccount } from "../shared/account/createAccount.js";
import { eventStore } from "../shared/database.js";
import { DefaultDateProvider } from "../shared/dateProvider.js";
import { Layout } from "../shared/Layout.js";
import { API_ROUTES, PAGE_ROUTES } from "../shared/routes.js";

/**
 * Create Account page endpoint.
 */
export const createAccountPage: Hono = new Hono().get("/", (c) => {
  return c.html(
    <Layout title="Create Account">
      <nav>
        <a href={PAGE_ROUTES.HOME}>Home</a>
      </nav>
      <header>
        <h1>Create Account</h1>
      </header>
      <form action={API_ROUTES.CREATE_ACCOUNT} method="post">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autocomplete="email"
        />
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
 * Create account request Zod validator.
 */
const createAccountRequestSchema = z
  .object({
    email: z.email().toLowerCase(),
    username: z.string().trim().toLowerCase().min(3),
    password: z.string().min(12),
    confirmPassword: z.string().min(12),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Create account API endpoint.
 */
export const createAccountApi: Hono = new Hono().post(
  "/",
  zValidator("form", createAccountRequestSchema, (result, c) => {
    if (!result.success) {
      return c.html(
        <div id="errors" hx-swap-oob="true">
          Errors
        </div>,
      );
    }
  }),
  async (c) => {
    const request = c.req.valid("form");
    const now = DefaultDateProvider();
    const passwordHash = await Bun.password.hash(request.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const accountId = randomUUIDv7("hex", now);
    const command: CreateAccount = {
      type: "CreateAccount",
      data: {
        accountId,
        email: request.email,
        username: request.username,
        passwordHash: passwordHash,
        role: "Standard",
      },
      metadata: {
        accountId,
        timestamp: now,
        correlationId: randomUUIDv7("hex", now),
      },
    };
    const result = await handle(eventStore, accountId, (state) =>
      decide(command, state),
    );
    if (result.createdNewStream) {
      return c.redirect(PAGE_ROUTES.LOGIN);
    }
    return c.json({}, 400);
  },
);
