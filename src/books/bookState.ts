import { BookEvent } from "./bookEvent";

/** Book rating. */
export type BookRating = {
  rating: number;
  reason: string;
};
/** Book state. */
export type BookState =
  | { status: "Unknown" }
  | {
      status: "Recommended";
      isbn: string;
      title: string;
      year: number;
      ratings: Map<string, BookRating>;
    };

/** Initial state function. */
export function initialState(): BookState {
  return { status: "Unknown" };
}

/** Evolve function. */
export function evolve(state: BookState, event: BookEvent): BookState {
  if (state.status == "Unknown") {
    switch (event.type) {
      case "BookRecommended":
        return {
          status: "Recommended",
          isbn: event.data.isbn,
          title: event.data.title,
          year: event.data.year,
          ratings: new Map<string, BookRating>(),
        };
    }
  } else if (state.status == "Recommended" && state.isbn == event.data.isbn) {
    switch (event.type) {
      case "RatingAdded": {
        const ratings = new Map<string, BookRating>(state.ratings);
        ratings.set(event.data.userId, {
          rating: event.data.rating,
          reason: event.data.reason,
        });
        return {
          ...state,
          ratings,
        };
      }
      case "RatingRemoved": {
        const ratings = new Map<string, BookRating>(state.ratings);
        ratings.delete(event.data.userId);
        return {
          ...state,
          ratings,
        };
      }
    }
  }
  return state;
}
