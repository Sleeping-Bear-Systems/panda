import { Command } from "@event-driven-io/emmett";

import { type CommandMetadata } from "../commandMetadata";
import { type AccountEvent } from "./accountEvent";
import { type AccountState } from "./accountState";

/**
 * Create account command.
 */
export type CreateAccount = Command<
  "CreateAccount",
  {
    userId: string;
    email: string;
    username: string;
    passwordHash: string;
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
        userId: command.data.userId,
        email: command.data.email,
        username: command.data.username,
        passwordHash: command.data.passwordHash,
      },
      metadata: {
        userId: command.metadata.userId,
        timestamp: command.metadata.timestamp,
        correlationId: command.metadata.correlationId,
      },
    },
  ];
}
