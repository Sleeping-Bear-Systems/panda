import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { JwtVariables } from "hono/jwt";
import { jwt } from "hono/jwt";

import { appConfig } from "./config.js";
import { logger } from "./logger.js";
import { PAGE_ROUTES } from "./routes.js";

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
    return c.redirect(PAGE_ROUTES.LOGIN, 302);
  }
});

export const AdministratorAuth = createMiddleware(
  async (c: Context<{ Variables: PandaJwtVariables }>, next) => {
    const claims = getJwtClaims(c);
    if (!claims) {
      return c.text("Not Authorized", 401);
    }
    if (claims.role !== "Administrator") {
      return c.text("Forbidden", 403);
    }
    await next();
  },
);

/**
 * JWT Claims.
 */
export type PandaJwtClaims = {
  sub: string;
  preferred_username: string;
  email: string;
  role: string;
  iss: string;
  exp: number;
  iat: number;
};

/**
 * Hono variable supporting the JWT payload.
 */
export type PandaJwtVariables = JwtVariables<PandaJwtClaims>;

/**
 * Gets the Panda JWT claims.
 */
export function getJwtClaims(
  c: Context<{ Variables: PandaJwtVariables }>,
): PandaJwtClaims | undefined {
  return c.get("jwtPayload");
}
