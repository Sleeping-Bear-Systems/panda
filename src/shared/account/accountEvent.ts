import { type Event } from "@event-driven-io/emmett";

import { type EventMetadata } from "../eventMetadata";

/**
 * Account roles.
 */
export type AccountRole = "Admin" | "Standard";

/**
 * Account created event.
 */
export type AccountCreated = Event<
  "AccountCreated",
  {
    accountId: string;
    email: string;
    username: string;
    passwordHash: string;
    role: AccountRole;
  },
  EventMetadata
>;

/**
 * Password changed event.
 */
export type PasswordChanged = Event<
  "PasswordChanged",
  {
    accountId: string;
    passwordHash: string;
  },
  EventMetadata
>;

/**
 * Account event.
 */
export type AccountEvent = AccountCreated | PasswordChanged;
