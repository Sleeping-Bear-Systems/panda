import type { Command } from "@event-driven-io/emmett";

import { type CommandMetadata } from "../commandMetadata.js";
import type { AccountRole } from "./accountEvent.js";
import { type AccountEvent } from "./accountEvent.js";
import { type AccountState } from "./accountState.js";

/**
 * Create account command.
 */
export type CreateAccount = Command<
  "CreateAccount",
  {
    accountId: string;
    email: string;
    username: string;
    passwordHash: string;
    role: AccountRole;
  },
  CommandMetadata
>;

/**
 * Create account command handler.
 */
export function createAccount(
  command: CreateAccount,
  state: AccountState,
): AccountEvent[] {
  if (state.status != "Unknown") {
    return [];
  }
  return [
    {
      type: "AccountCreated",
      data: {
        accountId: command.data.accountId,
        email: command.data.email,
        username: command.data.username,
        passwordHash: command.data.passwordHash,
        role: command.data.role,
      },
      metadata: {
        accountId: command.metadata.accountId,
        timestamp: command.metadata.timestamp,
        correlationId: command.metadata.correlationId,
      },
    },
  ];
}
