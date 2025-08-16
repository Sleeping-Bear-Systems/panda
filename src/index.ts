import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { aboutPage } from "./features/aboutPage.js";
import {
  changePasswordApi,
  changePasswordPage,
} from "./features/changePasswordPage.js";
import {
  createAccountApi,
  createAccountPage,
} from "./features/createAccountPage.js";
import { homePage } from "./features/homePage.js";
import { loginApi, loginPage } from "./features/loginPage.js";
import { logout as logoutApi } from "./features/logout.js";
import { usersPage } from "./features/usersPage.js";
import { appConfig } from "./shared/config.js";
import { logger } from "./shared/logger.js";
import { API_ROUTES, PAGE_ROUTES } from "./shared/routes.js";

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
  .route(PAGE_ROUTES.LOGIN, loginPage)
  .route(PAGE_ROUTES.ABOUT, aboutPage)
  .route(PAGE_ROUTES.HOME, homePage)
  .route(PAGE_ROUTES.CREATE_ACCOUNT, createAccountPage)
  .route(PAGE_ROUTES.CHANGE_PASSWORD, changePasswordPage)
  .route(PAGE_ROUTES.USERS, usersPage)
  // static assets
  .use("/*", serveStatic({ root: "./public" }));

export default {
  port: appConfig.PORT,
  fetch: app.fetch,
};
