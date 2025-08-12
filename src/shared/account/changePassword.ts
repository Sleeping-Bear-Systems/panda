import type { Command } from "@event-driven-io/emmett";
import { IllegalStateError } from "@event-driven-io/emmett";

import type { CommandMetadata } from "../commandMetadata";
import type { AccountEvent } from "./accountEvent";
import type { AccountState } from "./accountState";

/**
 * Change password command.
 */
export type ChangePassword = Command<
  "ChangePassword",
  {
    accountId: string;
    passwordHash: string;
  },
  CommandMetadata
>;

/**
 * Change password command handler.
 */
export function changePassword(
  command: ChangePassword,
  state: AccountState,
): AccountEvent[] {
  if (state.status == "Unknown") {
    throw new IllegalStateError("Account hasn't been created");
  }
  if (state.accountId != command.data.accountId) {
    throw new IllegalStateError("Account IDs don't match");
  }
  return [
    {
      type: "PasswordChanged",
      data: {
        accountId: command.data.accountId,
        passwordHash: command.data.passwordHash,
      },
      metadata: {
        accountId: command.metadata.accountId,
        correlationId: command.metadata.correlationId,
        timestamp: command.metadata.timestamp,
      },
    },
  ];
}
