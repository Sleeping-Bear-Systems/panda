import type { Command } from "@event-driven-io/emmett";

import { addRating } from "./addRating";
import type { BookEvent } from "./bookEvent";
import type { BookState } from "./bookState";
import { recommendBook } from "./recommendBook";
import { removeRating } from "./removeRating";

export type AddRating = Command<
  "AddRating",
  {
    isbn: string;
    rating: number;
    reason: string;
    accountId: string;
  }
>;

/** Recommend book command. */
export type RecommendBook = Command<
  "RecommendBook",
  { isbn: string; title: string; year: number }
>;

/** Remove rating command. */
export type RemoveRating = Command<
  "RemoveRating",
  {
    isbn: string;
    reason: string;
    accountId: string;
  }
>;

/** Book command. */
export type BookCommand = RecommendBook | AddRating | RemoveRating;

/** Decide function for book commands. */
export function decide(command: BookCommand, state: BookState): BookEvent[] {
  switch (command.type) {
    case "RecommendBook":
      return recommendBook(command, state);
    case "AddRating":
      return addRating(command, state);
    case "RemoveRating":
      return removeRating(command, state);
    default:
      return [];
  }
}
