import { type AccountEvent } from "./accountEvent.js";
import { type AccountState } from "./accountState.js";
import type { ChangePassword } from "./changePassword.js";
import { changePassword } from "./changePassword.js";
import { type CreateAccount, createAccount } from "./createAccount.js";

/**
 * Account command.
 */
export type AccountCommand = CreateAccount | ChangePassword;

/**
 * Decide function.
 */
export function decide(
  command: AccountCommand,
  state: AccountState,
): AccountEvent[] {
  switch (command.type) {
    case "CreateAccount":
      return createAccount(command, state);
    case "ChangePassword":
      return changePassword(command, state);
    default:
      return [];
  }
}
