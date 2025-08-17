import { Hono } from "hono";

import { Layout } from "../shared/Layout.js";
import type { PandaJwtVariables } from "../shared/middlewares.js";
import { pageJwt } from "../shared/middlewares.js";
import { API_ROUTES, PAGE_ROUTES } from "../shared/routes.js";

export const homePage = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", pageJwt)
  .get("/", (c) => {
    const { preferred_username: username, role } = c.get("jwtPayload");
    return c.html(
      <Layout title="Home">
        <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
        <nav>
          <a href={PAGE_ROUTES.ABOUT}>About</a>
          <a href={PAGE_ROUTES.CHANGE_PASSWORD}>Change Password</a>
          <a href={PAGE_ROUTES.ACCOUNTS}>Accounts</a>
          <span>{`${username} (${role})`}</span>
          <button
            type="button"
            hx-post={API_ROUTES.LOGOUT}
            hx-include="none"
            hx-trigger="click"
          >
            Logout
          </button>
        </nav>
        <hr />
        <h2>Under Construction</h2>
        <hr />
      </Layout>,
    );
  });
