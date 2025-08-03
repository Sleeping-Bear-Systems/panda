import { getPostgreSQLEventStore } from "@event-driven-io/emmett-postgresql";
import { appConfig } from "./config";
import { pongoClient } from "@event-driven-io/pongo";
import { logger } from "./logger";

logger.info("Starting event store");
export const eventStore = getPostgreSQLEventStore(
  appConfig.POSTGRES_CONNECTION_STRING,
);

logger.info("Starting Pongo client");
export const pongo = pongoClient(appConfig.POSTGRES_CONNECTION_STRING);
