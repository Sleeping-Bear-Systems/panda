import { Hono } from "hono";

import { Head } from "../shared/head.js";
import type { PandaJwtVariables } from "../shared/middlewares.js";
import { pageJwt } from "../shared/middlewares.js";
import { API_ROUTES, ROUTES } from "../shared/routes.js";

export const homePage = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", pageJwt)
  .get("/", (c) => {
    const { preferred_username: username, role } = c.get("jwtPayload");
    return c.html(
      <html>
        <Head />
        <body>
          <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
          <nav>
            <a href={ROUTES.ABOUT}>About</a>
            <a href={ROUTES.CHANGE_PASSWORD}>Change Password</a>
            <button
              hx-post={API_ROUTES.LOGOUT}
              hx-include="none"
              hx-trigger="click"
              hx-on--after-request={
                "window.location.href='" + ROUTES.LOGIN + "'"
              }
            >
              Logout
            </button>
            <h2>{username + " " + role}</h2>
          </nav>
          <hr />
          <h2>Under Construction</h2>
          <hr />
        </body>
      </html>,
    );
  });
