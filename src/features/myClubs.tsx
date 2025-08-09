import { randomUUIDv7 } from "bun";
import { Hono } from "hono";
import { jwt } from "hono/jwt";

import { appConfig } from "../shared/config";
import { DefaultDateProvider } from "../shared/dateProvider";

type Club = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
};

const clubs: Club[] = [
  {
    id: randomUUIDv7("hex", DefaultDateProvider()),
    name: "Club #1",
    description: "The first book club",
    isPublic: true,
  },
  {
    id: randomUUIDv7("hex", DefaultDateProvider()),
    name: "Club #2",
    description: "The second book club",
    isPublic: true,
  },
];

export const myClubsApi = new Hono()
  .use(
    jwt({
      secret: appConfig.JWT_SECRET,
      cookie: appConfig.jwtCookieName,
    }),
  )
  .get("/", (c) => {
    //const { sub } = c.get("jwtPayload");
    return c.html(
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Public</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.id}>
              <td>{club.name}</td>
              <td>{club.description}</td>
              <td>{club.isPublic ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>,
    );
  });
