import { createMiddleware } from "hono/factory";
import type { JwtVariables } from "hono/jwt";
import { jwt } from "hono/jwt";

import { appConfig } from "./config.js";
import { logger } from "./logger.js";
import { ROUTES } from "./routes.js";

/**
 * API JWT middleware.
 */
export const apiJwt = createMiddleware(async (c, next) => {
  return await jwt({
    secret: appConfig.JWT_SECRET,
    cookie: appConfig.jwtCookieName,
  })(c, next);
});

/**
 * Page JWT middleware.
 */
export const pageJwt = createMiddleware(async (c, next) => {
  try {
    return await jwt({
      secret: appConfig.JWT_SECRET,
      cookie: appConfig.jwtCookieName,
    })(c, next);
  } catch (error) {
    logger.error(error);
    return c.redirect(ROUTES.LOGIN, 302);
  }
});

/**
 * Hono variable supporting the JWT payload.
 */
export type PandaJwtVariables = JwtVariables<{
  sub: string;
  preferred_username: string;
  email: string;
  role: string;
  iss: string;
  exp: number;
  iat: number;
}>;
