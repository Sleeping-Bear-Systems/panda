import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { addRatingApi } from "./backend/books/addRating";
import { logout as logoutApi } from "./features/logout";
import { logger } from "./shared/logger";
import { jwt } from "hono/jwt";
import { aboutPage } from "./features/about";
import { loginApi, loginPage } from "./features/login";
import { appConfig } from "./shared/config";
import { startClubPage } from "./features/startClubPage";
import { homePage } from "./features/homePage";
import { API_ROUTES, ROUTES } from "./shared/routes";

logger.info("🚀 Starting application");

const app = new Hono()
  .use(
    "/api/private",
    jwt({ secret: appConfig.JWT_SECRET, cookie: appConfig.jwtCookieName }),
  )
  // back-end routes
  .get(API_ROUTES.PING, (c) => {
    return c.json({}, 200);
  })
  .route(API_ROUTES.ADD_RATING, addRatingApi)
  .route(API_ROUTES.LOGIN, loginApi)
  .route(API_ROUTES.LOGOUT, logoutApi)
  // front-end routes
  .route(ROUTES.LOGIN, loginPage)
  .route(ROUTES.ABOUT, aboutPage)
  .route(ROUTES.START_CLUB, startClubPage)
  .route(ROUTES.HOME, homePage)
  // static assets
  .use("/*", serveStatic({ root: "./public" }));

export default {
  port: appConfig.PORT,
  fetch: app.fetch,
};
