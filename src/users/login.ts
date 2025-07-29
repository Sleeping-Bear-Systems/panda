import { Hono } from "hono";
import { sign } from "hono/jwt";
import { User } from "./user";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { addDays } from "date-fns";
import { DateProvider } from "../dateProvider";
import { Config } from "../config";

const users: User[] = createTestUsers();

/** The zod validator a login request */
const loginRequestSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

/** Login request */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Maps the login endpoint. */
export function mapLoginEndpoint(
  dateProvider: DateProvider,
  config: Config,
): Hono {
  const app = new Hono();
  app.post("/login", zValidator("form", loginRequestSchema), async (c) => {
    const { username, password } = c.req.valid("form");
    const lowercaseUsername = username.toLocaleLowerCase();
    const user = users.find(
      (u) => u.username.toLocaleLowerCase() == lowercaseUsername,
    );
    if (!user) {
      return c.text("Invalid username or password", 401);
    }
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return c.text("Invalid username or password", 401);
    }
    const token = await sign(
      {
        id: user.id,
        sub: user.username,
        role: user.role,
      },
      config.jwtSecret,
    );
    setCookie(c, config.jwtCookieName, token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      expires: addDays(dateProvider(), 1),
    });
    return c.redirect("/index.html");
  });
  return app;
}

function createTestUsers(): User[] {
  return [
    {
      id: "cc57350b-f778-4563-b214-0f9a1d5bc0d9",
      username: "admin",
      passwordHash: bcrypt.hashSync("password1234", 10),
      role: "Administrator",
    },
    {
      id: "97dfe0c4-b01e-4fbf-a6df-9deb9287502c",
      username: "user",
      passwordHash: bcrypt.hashSync("password1234", 10),
      role: "General",
    },
    {
      id: "44298c16-7e50-4966-abbc-f653679db543",
      username: "guest",
      passwordHash: bcrypt.hashSync("password1234", 10),
      role: "Guest",
    },
  ];
}
