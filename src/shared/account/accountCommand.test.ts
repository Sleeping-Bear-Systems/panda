import { DeciderSpecification } from "@event-driven-io/emmett";
import { describe, test } from "bun:test";

import { decide } from "./accountCommand.js";
import { evolve, initialState } from "./accountState.js";

const given = DeciderSpecification.for({ decide, evolve, initialState });
const now = new Date("2025-08-09");

describe("Unknown", () => {
  test("apply CreateAccount command results in AccountCreated event", () => {
    given([])
      .when({
        type: "CreateAccount",
        data: {
          accountId: "1234",
          email: "test@localhost",
          username: "test_user",
          passwordHash: "1234",
          role: "Standard",
        },
        metadata: {
          accountId: "3579",
          correlationId: "2468",
          timestamp: now,
        },
      })
      .then({
        type: "AccountCreated",
        data: {
          accountId: "1234",
          email: "test@localhost",
          username: "test_user",
          passwordHash: "1234",
          role: "Standard",
        },
        metadata: {
          accountId: "3579",
          correlationId: "2468",
          timestamp: now,
        },
      });
  });
});
