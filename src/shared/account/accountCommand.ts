import { type AccountEvent } from "./accountEvent";
import { type AccountState } from "./accountState";
import type { ChangePassword } from "./changePassword";
import { changePassword } from "./changePassword";
import { type CreateAccount, createAccount } from "./createAccount";

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
