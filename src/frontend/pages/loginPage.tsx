import { Hono } from "hono";
import { Head } from "../components/head";

export const loginPage = new Hono().get("/login", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <h1>Login</h1>
        <form action="/api/public/login" method="post">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>,
  );
});
