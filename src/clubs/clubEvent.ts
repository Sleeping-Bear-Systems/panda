import { type Event } from "@event-driven-io/emmett";
import { MemberRole } from "./clubState";

/** Club started event. */
export type ClubStarted = Event<
  "ClubStarted",
  {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
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

/** Member added event. */
export type MemberAdded = Event<
  "MemberAdded",
  {
    id: string;
    userId: string;
    role: MemberRole;
  },
  {
    userId: string;
    timestamp: Date;
  }
>;

export type MemberRemoved = Event<
  "MemberRemoved",
  {
    id: string;
    userId: string;
  },
  { userId: string; timestamp: Date }
>;

/** Club event. */
export type ClubEvent = ClubStarted | ClubEnded | MemberAdded | MemberRemoved;
