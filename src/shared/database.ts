import { projections } from "@event-driven-io/emmett";
import { getPostgreSQLEventStore } from "@event-driven-io/emmett-postgresql";
import { pongoClient } from "@event-driven-io/pongo";

import { accountsProjection } from "./account/accountsProjection.js";
import { appConfig } from "./config.js";
import { logger } from "./logger.js";

logger.info("Starting Pongo client");
export const pongo = pongoClient(appConfig.POSTGRES_CONNECTION_STRING);

logger.info("Starting event store");
export const eventStore = getPostgreSQLEventStore(
  appConfig.POSTGRES_CONNECTION_STRING,
  {
    projections: projections.inline([accountsProjection]),
  },
);
