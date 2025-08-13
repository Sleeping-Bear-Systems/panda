import { randomUUIDv7, SQL } from "bun";
import { parseArgs } from "util";

import { decide } from "../src/shared/account/accountCommand.js";
import type { AccountRole } from "../src/shared/account/accountEvent.js";
import { handle } from "../src/shared/account/accountState.js";
import type { CreateAccount } from "../src/shared/account/createAccount.js";
import { appConfig } from "../src/shared/config.js";
import { eventStore } from "../src/shared/database.js";
import { DefaultDateProvider } from "../src/shared/dateProvider.js";

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

type AccountSpecification = {
  accountId: string;
  username: string;
  password: string;
  email: string;
  role: AccountRole;
};

/**
 *
 */
async function createAccounts(accounts: AccountSpecification[]): Promise<void> {
  const now = DefaultDateProvider();
  for (const account of accounts) {
    const passwordHash = await Bun.password.hash(account.password, {
      algorithm: "bcrypt",
      cost: 10,
    });
    const command: CreateAccount = {
      type: "CreateAccount",
      data: {
        accountId: account.accountId,
        email: account.email,
        username: account.username,
        passwordHash: passwordHash,
        role: account.role,
      },
      metadata: {
        accountId: account.accountId,
        timestamp: now,
        correlationId: randomUUIDv7("hex", now),
      },
    };
    await handle(eventStore, account.accountId, (state) =>
      decide(command, state),
    );
  }
}

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

// parse the database URLs
const { url, safeUrl } = getUrls(appConfig.POSTGRES_CONNECTION_STRING);
const force = values.force ?? false;

// execute the action
const action = values.action?.toLocaleLowerCase() ?? "";
if (action === "drop" || (action === "create" && force)) {
  console.log(`Dropping database: ${safeUrl.toString()}`);
  await dropDatabase(url, force);
}
if (action === "create") {
  console.log(`Creating database: ${safeUrl.toString()}`);
  await createDatabase(url);
  console.log("Creating accounts");
  await createAccounts([
    {
      accountId: "6261320e-bb5c-47af-8be4-5f55838c8e15",
      username: "administrator",
      password: "password_123456",
      role: "Administrator",
      email: "admin@example.com",
    },
    {
      accountId: "cbba3e73-80ca-4929-80c5-3289d3887d2d",
      username: "standard",
      password: "password_123456",
      role: "Standard",
      email: "standard@example.com",
    },
  ]);
}
