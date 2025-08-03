import { Hono } from "hono";
import { Head } from "../shared/head";
import { pageJwt } from "../shared/middlewares";
import { API_ROUTES, ROUTES } from "../shared/routes";

export const homePage = new Hono().use("/", pageJwt).get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <img src="/images/sleeping_bear_logo.svg" alt="Sleeping Bear Logo" />
        <nav>
          <a href={ROUTES.ABOUT}>About</a>
          <a href="/start-club">Start Club</a>
          <button
            hx-post={API_ROUTES.LOGOUT}
            hx-include="none"
            hx-trigger="click"
            hx-on--after-request={"window.location.href='" + ROUTES.LOGIN + "'"}
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
