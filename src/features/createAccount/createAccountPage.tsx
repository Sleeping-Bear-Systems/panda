import { Hono } from "hono";

import { Head } from "../../shared/head";
import { API_ROUTES, ROUTES } from "../../shared/routes";

export const createAccountPage: Hono = new Hono().get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <nav>
          <a href={ROUTES.HOME}>Home</a>
        </nav>
        <header>
          <h1>Create Account</h1>
        </header>
        <form action={API_ROUTES.CREATE_ACCOUNT} method="post">
          <label htmlFor="email" name="email">
            Email
          </label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          <button type="submit">Submit</button>
          <button type="reset">Reset</button>
        </form>
      </body>
    </html>,
  );
});

export const createAccountApi: Hono = new Hono().post("/", (c) => {
  return c.json({}, 400);
});
