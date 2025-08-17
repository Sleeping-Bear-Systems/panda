import { Hono } from "hono";

import type { Account } from "../shared/account/accountsProjection.js";
import { accountsCollectionName } from "../shared/account/accountsProjection.js";
import { pongo } from "../shared/database.js";
import { Layout } from "../shared/Layout.js";
import type { PandaJwtVariables } from "../shared/middlewares.js";
import { AdministratorAuth, apiJwt, pageJwt } from "../shared/middlewares.js";
import { API_ROUTES, PAGE_ROUTES } from "../shared/routes.js";

/**
 * Accounts page endpoint.
 */
export const accountsPage = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", pageJwt)
  .use("/", AdministratorAuth)
  .get("/", (c) => {
    return c.html(
      <Layout title="Users">
        <nav>
          <a href={PAGE_ROUTES.HOME}>Home</a>
        </nav>
        <h1>Users</h1>
        <table
          hx-get={API_ROUTES.ACCOUNTS}
          hx-trigger="load"
          hx-target="#body"
          hx-swap="outerHTML"
        >
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody id="body"></tbody>
        </table>
      </Layout>,
    );
  });

/**
 * Accounts API endpoint.
 */
export const accountsApi = new Hono<{ Variables: PandaJwtVariables }>()
  .use("/", apiJwt)
  .use("/", AdministratorAuth)
  .get("/", async (c) => {
    const accounts = await pongo
      .db()
      .collection<Account>(accountsCollectionName)
      .find();
    return await c.html(
      <tbody id="body">
        {accounts.map((a) => (
          <tr id={a._id}>
            <td>{a.username}</td>
            <td>{a.email}</td>
            <td>{a.role}</td>
          </tr>
        ))}
      </tbody>,
    );
  });
