import { describe, expect, test } from "bun:test";

import { AccountCreated, PasswordChanged } from "./accountEvent";
import { Account, evolve } from "./accountsProjection";

const existingAccount: Account = {
  accountId: "user-1",
  email: "user@example.com",
  username: "test-user",
  passwordHash: "hash123",
  role: "Standard",
};

const metadata = {
  accountId: "user-1",
  timestamp: new Date("2025-08-10T00:00:00Z"),
  correlationId: "corr-1",
};

describe("accountsProjection evolve", () => {
  test("creates account on AccountCreated event", () => {
    const event: AccountCreated = {
      type: "AccountCreated",
      data: {
        accountId: "user-2",
        email: "new@example.com",
        username: "new-user",
        passwordHash: "new-hash",
        role: "Standard",
      },
      metadata: {
        accountId: "user-2",
        timestamp: new Date("2025-08-10T00:00:00Z"),
        correlationId: "corr-2",
      },
    };
    const result = evolve(null, event);
    expect(result).toEqual({
      accountId: "user-2",
      email: "new@example.com",
      username: "new-user",
      passwordHash: "new-hash",
      role: "Standard",
    });
  });

  test("updates password on PasswordChanged event", () => {
    const event: PasswordChanged = {
      type: "PasswordChanged",
      data: {
        accountId: "user-1",
        passwordHash: "updated-hash",
      },
      metadata: metadata,
    };
    const result = evolve(existingAccount, event);
    expect(result).toEqual({
      ...existingAccount,
      passwordHash: "updated-hash",
    });
  });
});
