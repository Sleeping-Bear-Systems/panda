import { Hono } from "hono";
import { Head } from "../components/head";

export function mapHomePage(): Hono {
  const app = new Hono();

  app.get("/home", (c) => {
    return c.html(
      <html>
        <Head />
        <body>
          <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
          <nav>
            <a href="/login">Login</a>
            <a href="/about">About</a>
            <a href="/create-club">Create Club</a>
            <button
              hx-post="/api/users/logout"
              hx-include="none"
              hx-trigger="click"
              hx-on--after-request="window.location.href='/login'"
            >
              Logout
            </button>
          </nav>
          <h1>Welcome to Panda</h1>
          <p>Your app is running!</p>
        </body>
      </html>,
    );
  });

  return app;
}
