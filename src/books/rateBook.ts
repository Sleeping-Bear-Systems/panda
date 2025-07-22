import type { Command } from "@event-driven-io/emmett";
import { BookState } from "./bookState";
import { BookEvent } from "./bookEvent";

export type RateBook = Command<
  "RateBook",
  {
    isbn: string;
    rating: number;
    reason: string;
    userId: string;
  }
>;

export function rateBook(command: RateBook, state: BookState): BookEvent[] {
  if (state.status != "Recommended" || state.isbn != command.data.isbn) {
    return [];
  }
  return [
    {
      type: "BookRated",
      data: {
        isbn: command.data.isbn,
        rating: command.data.rating,
        reason: command.data.reason,
        userId: command.data.userId,
      },
    },
  ];
}
