import { BookEvent } from "./bookEvent";
import { BookState } from "./bookState";
import { RemoveRating } from "./bookCommand";

/** Remove rating function. */
export function removeRating(
  command: RemoveRating,
  state: BookState,
): BookEvent[] {
  if (state.status != "Recommended" || state.isbn != command.data.isbn) {
    return [];
  }
  return [
    {
      type: "RatingRemoved",
      data: {
        isbn: command.data.isbn,
        reason: command.data.reason,
        userId: command.data.userId,
      },
    },
  ];
}
