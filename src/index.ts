import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { aboutPage } from "./features/about.js";
import {
  changePasswordApi,
  changePasswordPage,
} from "./features/changePasswordPage.js";
import {
  createAccountApi,
  createAccountPage,
} from "./features/createAccountPage.js";
import { homePage } from "./features/homePage.js";
import { loginApi, loginPage } from "./features/login.js";
import { logout as logoutApi } from "./features/logout.js";
import { appConfig } from "./shared/config.js";
import { logger } from "./shared/logger.js";
import { API_ROUTES, ROUTES } from "./shared/routes.js";

logger.info("🚀 Starting application");

const app = new Hono()
  // back-end routes
  .get(API_ROUTES.PING, (c) => {
    return c.json({}, 200);
  })
  .route(API_ROUTES.LOGIN, loginApi)
  .route(API_ROUTES.LOGOUT, logoutApi)
  .route(API_ROUTES.CREATE_ACCOUNT, createAccountApi)
  .route(API_ROUTES.CHANGE_PASSWORD, changePasswordApi)
  // front-end routes
  .route(ROUTES.LOGIN, loginPage)
  .route(ROUTES.ABOUT, aboutPage)
  .route(ROUTES.HOME, homePage)
  .route(ROUTES.CREATE_ACCOUNT, createAccountPage)
  .route(ROUTES.CHANGE_PASSWORD, changePasswordPage)
  // static assets
  .use("/*", serveStatic({ root: "./public" }));

export default {
  port: appConfig.PORT,
  fetch: app.fetch,
};
