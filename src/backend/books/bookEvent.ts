import type { Event } from "@event-driven-io/emmett";

/** Book recommended event. */
export type BookRecommended = Event<
  "BookRecommended",
  { isbn: string; title: string; year: number }
>;

/** Rating added event. */
export type RatingAdded = Event<
  "RatingAdded",
  { isbn: string; rating: number; reason: string; userId: string }
>;

/** Rating removed event. */
export type RatingRemoved = Event<
  "RatingRemoved",
  { isbn: string; reason: string; userId: string }
>;

/** Book event. */
export type BookEvent = BookRecommended | RatingAdded | RatingRemoved;
