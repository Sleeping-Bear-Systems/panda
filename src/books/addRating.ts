import { BookState } from "./bookState";
import { BookEvent } from "./bookEvent";
import { AddRating } from "./bookCommand";

/** Add rating function. */
export function addRating(command: AddRating, state: BookState): BookEvent[] {
  if (state.status != "Recommended" || state.isbn != command.data.isbn) {
    return [];
  }
  return [
    {
      type: "RatingAdded",
      data: {
        isbn: command.data.isbn,
        rating: command.data.rating,
        reason: command.data.reason,
        userId: command.data.userId,
      },
    },
  ];
}
