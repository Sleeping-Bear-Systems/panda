import { SQL } from "bun";
import { parseArgs } from "util";
import z from "zod/v4";

/**
 * Obfuscates an URL by replacing the password.
 * @param rawUrl The original URL.
 * @returns The obfuscated URL.
 */
function getUrls(rawUrl: string): {
  url: URL;
  safeUrl: URL;
} {
  const url = new URL(rawUrl);
  const safeUrl = new URL(url);
  safeUrl.password = "******";
  return { url, safeUrl };
}

/**
 * Drops a Postgres database.
 * @param url The URL for the database to be dropped.
 * @param force Force the database to be dropped.
 */
async function dropDatabase(url: URL, force: boolean): Promise<void> {
  const localUrl = new URL(url);
  const database = localUrl.pathname.substring(1);
  localUrl.pathname = "";
  const sql = new SQL({ url: localUrl });
  let query = `DROP DATABASE IF EXISTS "${database}"`;
  if (force) {
    query += " WITH (FORCE)";
  }
  await sql.unsafe(query);
}

/**
 * Creates a new Postgres database.
 * @param url The URL for the new database.
 */
async function createDatabase(url: URL): Promise<void> {
  const localUrl = new URL(url);
  const database = localUrl.pathname.substring(1);
  localUrl.pathname = "";
  const sql = new SQL({ url: localUrl });
  const query = `CREATE DATABASE "${database}"`;
  await sql.unsafe(query);
}

/**
 * Environment schema.
 */
const environmentSchema = z.object({
  POSTGRES_CONNECTION_STRING: z.url(),
});

/**
 * Environment type.
 */
type Environment = Readonly<z.infer<typeof environmentSchema>>;

// get the CLI arguments
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    url: {
      type: "string",
    },
    action: {
      type: "string",
    },
    force: {
      type: "boolean",
    },
  },
  strict: true,
  allowPositionals: true,
});

// get the environment variable
const environment: Environment = {
  ...environmentSchema.parse(process.env),
};

// parse the database URLs
const { url, safeUrl } = getUrls(
  values.url ?? environment.POSTGRES_CONNECTION_STRING,
);
const force = values.force ?? false;

// execute the action
const action = values.action?.toLocaleLowerCase() ?? "";
if (action == "drop" || (action == "create" && force)) {
  console.log("Dropping database: " + safeUrl.toString());
  await dropDatabase(url, force);
}
if (action == "create") {
  console.log("Creating database: " + safeUrl.toString());
  await createDatabase(url);
}
