import { zValidator } from "@hono/zod-validator";
import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { z } from "zod/v4";

import { decide } from "../../shared/account/accountCommand";
import { handler as handle } from "../../shared/account/accountState";
import { CreateAccount } from "../../shared/account/createAccount";
import { eventStore } from "../../shared/database";
import { DefaultDateProvider } from "../../shared/dateProvider";
import { Head } from "../../shared/head";
import { API_ROUTES, ROUTES } from "../../shared/routes";

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
          <label htmlFor="email" name="email">
            Email
          </label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />

          <button type="submit">Submit</button>
        </form>
      </body>
    </html>,
  );
});

/**
 * Create account request Zod validator.
 */
const createAccountRequestSchema = z.object({
  email: z.email().nonempty().toLowerCase().trim(),
  username: z.string().nonempty().min(3).toLowerCase().trim(),
  password: z.string().nonempty().min(12).trim(),
});

/**
 * Create account API endpoint.
 */
export const createAccountApi: Hono = new Hono().post(
  "/",
  zValidator("form", createAccountRequestSchema),
  async (c) => {
    const request = c.req.valid("form");
    const now = DefaultDateProvider();
    const passwordHash = await Bun.password.hash(request.email, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const userId = randomUUIDv7("hex", now);
    const command: CreateAccount = {
      type: "CreateAccount",
      data: {
        userId,
        email: request.email,
        username: request.username,
        passwordHash: passwordHash,
      },
      metadata: {
        userId: "",
        timestamp: now,
        correlationId: randomUUIDv7("hex", now),
      },
    };
    const result = await handle(eventStore, userId, (state) =>
      decide(command, state),
    );
    if (result.createdNewStream) {
      c.redirect(ROUTES.LOGIN);
    }
    return c.json({}, 400);
  },
);
