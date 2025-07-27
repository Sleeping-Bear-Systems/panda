import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { cookieName } from "./constants";

/** Maps the logout endpoint. */
export function mapLogoutEndpoint(): Hono {
  const app = new Hono();
  app.post("/logout", (c) => {
    setCookie(c, cookieName, "", {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(0),
    });
    return c.text("Logged out", 200);
  });
  return app;
}
