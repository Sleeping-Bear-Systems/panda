import { CommandHandler } from "@event-driven-io/emmett";

import { type AccountEvent, AccountRole } from "./accountEvent";

/**
 * Account state.
 */
export type AccountState =
  | { status: "Unknown" }
  | {
      status: "Active";
      accountId: string;
      email: string;
      username: string;
      passwordHash: string;
      role: AccountRole;
    };

/**
 * Initial state function for accounts.
 */
export function initialState(): AccountState {
  return { status: "Unknown" };
}

/**
 * Evolve function for accounts.
 */
export function evolve(state: AccountState, event: AccountEvent): AccountState {
  switch (state.status) {
    case "Unknown":
      if (event.type == "AccountCreated") {
        return {
          status: "Active",
          accountId: event.data.accountId,
          email: event.data.email,
          username: event.data.username,
          passwordHash: event.data.passwordHash,
          role: event.data.role,
        };
      }
      break;
    case "Active":
      if (
        event.type == "PasswordChanged" &&
        state.accountId == event.data.accountId
      ) {
        return {
          ...state,
          passwordHash: event.data.passwordHash,
        };
      }
      break;
  }
  return state;
}

/**
 * Map to stream ID function for account streams.
 */
export function mapToStreamId(id: string): string {
  return `account-${id}`;
}

/**
 * Command handler for accounts.
 */
export const handle = CommandHandler({ evolve, initialState, mapToStreamId });
