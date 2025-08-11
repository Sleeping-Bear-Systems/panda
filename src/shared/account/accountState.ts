import { CommandHandler } from "@event-driven-io/emmett";

import { type AccountEvent } from "./accountEvent";

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
    };

/**
 * Initial state function
 */
export function initialState(): AccountState {
  return { status: "Unknown" };
}

/**
 * Evolve function.
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
        };
      }
      break;
    case "Active":
      return state;
  }
  return state;
}

/**
 * Command handler.
 */
export const handler = CommandHandler({ evolve, initialState });

/**
 * Map to stream ID function.
 */
export function mapToStreamId(id: string): string {
  return `account-${id}`;
}
