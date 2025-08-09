import { zValidator } from "@hono/zod-validator";
import { addDays } from "date-fns";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { z } from "zod/v4";

import { appConfig } from "../shared/config";
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
          <input id="username" name="username" type="text" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
        <a href={ROUTES.CREATE_ACCOUNT}>Create Account</a>
      </body>
    </html>,
  );
});

const users: User[] = createTestUsers();

/** The zod validator a login request */
const loginRequestSchema = z.object({
  username: z.string().nonempty().toLowerCase().trim(),
  password: z.string().nonempty().toLowerCase().trim(),
});

/** Login request */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Maps the login endpoint. */
export const loginApi = new Hono().post(
  "/",
  zValidator("form", loginRequestSchema),
  async (c) => {
    const { username, password } = c.req.valid("form");
    const lowercaseUsername = username.toLocaleLowerCase();
    const user = users.find(
      (u) => u.username.toLocaleLowerCase() == lowercaseUsername,
    );
    if (!user) {
      logger.info("User not found: '%s'", username);
      return c.text("Invalid username or password", 401);
    }
    const isValidPassword = await Bun.password.verify(
      password,
      user.passwordHash,
      "bcrypt",
    );
    if (!isValidPassword) {
      logger.info("Invalid password: '%s'", username);
      return c.text("Invalid username or password", 401);
    }
    const token = await sign(
      {
        sub: user.id,
        preferred_username: user.username,
        role: user.role,
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

function createTestUsers(): User[] {
  return [
    {
      id: "cc57350b-f778-4563-b214-0f9a1d5bc0d9",
      username: "admin",
      passwordHash: Bun.password.hashSync("password1234", {
        algorithm: "bcrypt",
        cost: 10,
      }),
      role: "Administrator",
    },
    {
      id: "97dfe0c4-b01e-4fbf-a6df-9deb9287502c",
      username: "user",
      passwordHash: Bun.password.hashSync("password1234", {
        algorithm: "bcrypt",
        cost: 10,
      }),
      role: "General",
    },
    {
      id: "44298c16-7e50-4966-abbc-f653679db543",
      username: "guest",
      passwordHash: Bun.password.hashSync("password1234", {
        algorithm: "bcrypt",
        cost: 10,
      }),
      role: "Guest",
    },
  ];
}

export type Role = "Administrator" | "General" | "Guest";

type User = {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
};
