import { Hono } from "hono";
import { User } from "./user";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { addDays } from "date-fns";
import { DateProvider } from "../dateProvider";
import { cookieName } from "./constants";

const users: User[] = createTestUsers();

/** The zod validator a login request */
const loginRequestSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

/** Login request */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Maps the login endpoint. */
export function mapLoginEndpoint(dateProvider: DateProvider): Hono {
  const app = new Hono();
  app.post("/login", zValidator("json", loginRequestSchema), async (c) => {
    const loginRequest = c.req.valid("json");
    const lowercaseUsername = loginRequest.username.toLocaleLowerCase();
    const user = users.find(
      (u) => u.username.toLocaleLowerCase() == lowercaseUsername,
    );
    if (!user) {
      return c.text("Invalid username or password", 401);
    }
    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      return c.text("Invalid username or password", 401);
    }
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      return c.text("Unable to create JWT", 500);
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1d" },
    );
    setCookie(c, cookieName, token, {
      httpOnly: true,
      sameSite: "Strict",
      expires: addDays(dateProvider(), 1),
    });
    return c.json({}, 200);
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
