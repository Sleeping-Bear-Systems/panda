import { Command } from "@event-driven-io/emmett";

import { type CommandMetadata } from "../commandMetadata";
import { type AccountEvent, AccountRole } from "./accountEvent";
import { type AccountState } from "./accountState";

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
