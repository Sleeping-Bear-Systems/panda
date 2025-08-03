import { Hono } from "hono";
import { Head } from "../components/head";
import { pageJwt } from "../../middlewares";

const path = "/";
export const homePage = new Hono().use(path, pageJwt).get(path, (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
        <nav>
          <a href="/about">About</a>
          <a href="/start-club">Start Club</a>
          <button
            hx-post="/api/public/logout"
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
