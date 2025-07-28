import { type Event } from "@event-driven-io/emmett";

/** Club started event. */
export type ClubStarted = Event<
  "ClubStarted",
  {
    id: string;
    name: string;
    description: string;
  },
  {
    userId: string;
    timestamp: Date;
  }
>;

/** Club ended event. */
export type ClubEnded = Event<
  "ClubEnded",
  {
    id: string;
  },
  { userId: string; timestamp: Date }
>;

/** Club event. */
export type ClubEvent = ClubStarted | ClubEnded;
