import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { z } from "zod/v4";

import { decide } from "../shared/account/accountCommand";
import { handle as handle } from "../shared/account/accountState";
import { CreateAccount } from "../shared/account/createAccount";
import { eventStore } from "../shared/database";
import { DefaultDateProvider } from "../shared/dateProvider";
import { Head } from "../shared/head";
import { API_ROUTES, ROUTES } from "../shared/routes";

/**
 * Create Account page endpoint.
 */
export const createAccountPage: Hono = new Hono().get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <nav>
          <a href={ROUTES.HOME}>Home</a>
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
      </body>
    </html>,
  );
});

/**
 * Create account request Zod validator.
 */
const createAccountRequestSchema = z
  .object({
    email: z.email().toLowerCase().trim(),
    username: z.string().nonempty().min(3).toLowerCase().trim(),
    password: z.string().nonempty().min(12).trim(),
    confirmPassword: z.string().nonempty().min(12).trim(),
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
      return c.redirect(ROUTES.LOGIN);
    }
    return c.json({}, 400);
  },
);
