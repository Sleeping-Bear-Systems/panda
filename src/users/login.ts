import { Hono } from "hono";
import { User } from "./user";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";

const users: User[] = [
  {
    id: "cc57350b-f778-4563-b214-0f9a1d5bc0d9",
    username: "admin",
    password: "password1234",
    role: "Administrator",
  },
  {
    id: "97dfe0c4-b01e-4fbf-a6df-9deb9287502c",
    username: "user",
    password: "password1234",
    role: "General",
  },
  {
    id: "44298c16-7e50-4966-abbc-f653679db543",
    username: "guest",
    password: "password1234",
    role: "Guest",
  },
];

/** The zod validator a login request */
const loginRequestSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

/** Login request */
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Maps the login endpoint. */
export function mapLoginEndpoint(): Hono {
  const app = new Hono();
  app.post("/login", zValidator("json", loginRequestSchema), (c) => {
    const loginRequest = c.req.valid("json");
    const user = users.find(
      (u) =>
        u.username == loginRequest.username &&
        u.password == loginRequest.password,
    );
    if (!user) {
      return c.text("Invalid username or password", 401);
    }
    return c.json(
      {
        username: user.username,
        role: user.role,
      },
      200,
    );
  });
  return app;
}
