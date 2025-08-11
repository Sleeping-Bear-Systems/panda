import { pongoMultiStreamProjection } from "@event-driven-io/emmett-postgresql";

import { AccountEvent } from "./accountEvent";

/**
 * Accounts collection.
 */
const accountsCollectionName = "Accounts";

/**
 * Account.
 */
export type Account = {
  accountId: string;
  email: string;
  username: string;
  passwordHash: string;
};

/**
 * Evolve function.
 */
export function evolve(
  document: Account | null,
  { type, data }: AccountEvent,
): Account | null {
  if (document) {
    switch (type) {
      case "PasswordChanged":
        return { ...document, passwordHash: data.passwordHash };
    }
  } else {
    switch (type) {
      case "AccountCreated":
        return {
          accountId: data.accountId,
          email: data.email,
          username: data.username,
          passwordHash: data.passwordHash,
        };
    }
  }
  return document;
}

/**
 * Accounts projection.
 */
export const accountsProjection = pongoMultiStreamProjection({
  collectionName: accountsCollectionName,
  getDocumentId: (event) => event.data.accountId,
  evolve,
  canHandle: ["AccountCreated"],
});
