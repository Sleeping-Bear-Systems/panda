import { type Event } from "@event-driven-io/emmett";

import type { ClubMetadata } from "./clubMetadata";
import type { MemberRole, MemberStatus } from "./memberState";

/** Club started event. */
export type ClubStarted = Event<
  "ClubStarted",
  {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
  },
  ClubMetadata
>;

/** Club ended event. */
export type ClubEnded = Event<
  "ClubEnded",
  {
    id: string;
  },
  ClubMetadata
>;

/** Club joined event. */
export type ClubJoined = Event<
  "ClubJoined",
  {
    id: string;
    role: MemberRole;
    status: MemberStatus;
  },
  ClubMetadata
>;

export type ClubLeft = Event<
  "ClubLeft",
  {
    id: string;
  },
  ClubMetadata
>;

/** Club event. */
export type ClubEvent = ClubStarted | ClubEnded | ClubJoined | ClubLeft;
