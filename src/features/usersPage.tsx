import { Hono } from "hono";

import { Layout } from "../shared/Layout.js";
import type { PandaJwtVariables } from "../shared/middlewares.js";
import { pageJwt } from "../shared/middlewares.js";

/**
 * User page.
 */
export const usersPage = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", pageJwt)
  .get("/", (c) => {
    return c.html(
      <Layout title="Users">
        <h1>Users</h1>
        <div>Under Construction</div>
      </Layout>,
    );
  });
