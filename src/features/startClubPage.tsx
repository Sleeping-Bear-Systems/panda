import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { z } from "zod/v4";

import { handle } from "../backend/clubs/clubState";
import type { StartClub} from "../backend/clubs/startClub";
import { startClub } from "../backend/clubs/startClub";
import { appConfig } from "../shared/config";
import { eventStore } from "../shared/database";
import { DefaultDateProvider } from "../shared/dateProvider";
import { Head } from "../shared/head";
import { pageJwt } from "../shared/middlewares";
import { API_ROUTES, ROUTES } from "../shared/routes";

export const startClubPage = new Hono().use("/", pageJwt).get("/", (c) => {
  return c.html(
    <html>
      <Head />
      <body>
        <nav>
          <a href={ROUTES.HOME}>Home</a>
        </nav>
        <header>
          <h1>Start Club</h1>
        </header>
        <form action={API_ROUTES.START_CLUB} method="post">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" />
          <label htmlFor="description">Description</label>
          <input id="description" name="description" type="text" />
          <input id="isPublic" name="isPublic" type="checkbox" defaultChecked />
          <label htmlFor="isPublic">Public</label>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>,
  );
});

const startClubRequestSchema = z.object({
  name: z.string(),
  description: z.string().default(""),
  isPublic: z.coerce.boolean(),
});

export const startClubApi = new Hono()
  .use(jwt({ secret: appConfig.JWT_SECRET, cookie: appConfig.jwtCookieName }))
  .post("/", zValidator("form", startClubRequestSchema), async (c) => {
    const { name, description, isPublic } = c.req.valid("form");
    const { sub } = c.get("jwtPayload");

    const now = DefaultDateProvider();
    const id = Bun.randomUUIDv7("hex", now);
    const command: StartClub = {
      type: "StartClub",
      data: {
        id,
        name,
        description,
        isPublic,
      },
      metadata: {
        accountId: sub,
        timestamp: now,
        correlationId: Bun.randomUUIDv7("hex", now),
      },
    };
    await handle(eventStore, id, (state) => startClub(command, state));
    return c.json({}, 200);
  });
