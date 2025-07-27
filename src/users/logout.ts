import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { Config } from "../config";

/** Maps the logout endpoint. */
export function mapLogoutEndpoint(config: Config): Hono {
  const app = new Hono();
  app.post("/logout", (c) => {
    setCookie(c, config.jwtCookieName, "", {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(0),
    });
    return c.text("Logged out", 200);
  });
  return app;
}
