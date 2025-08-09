import { type AccountEvent } from "./accountEvent";
import { type AccountState } from "./accountState";
import { type CreateAccount, createAccount } from "./createAccount";

/**
 * Account command.
 */
export type AccountCommand = CreateAccount;

export function decide(
  command: AccountCommand,
  state: AccountState,
): AccountEvent[] {
  switch (command.type) {
    case "CreateAccount":
      return createAccount(command, state);
  }
  return [];
}
