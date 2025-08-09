import { CommandHandler } from "@event-driven-io/emmett/.";

import { type AccountEvent } from "./accountEvent";

/**
 * Account state.
 */
export type AccountState = { status: "Unknown" } | { status: "Active" };

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
        return state;
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
