import type { Command } from "@event-driven-io/emmett";

import type { ClubEvent } from "./clubEvent";
import type { ClubMetadata } from "./clubMetadata";
import type { ClubState } from "./clubState";

export type StartClub = Command<
  "StartClub",
  {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
  },
  ClubMetadata
>;

export function startClub(command: StartClub, state: ClubState): ClubEvent[] {
  if (state.status != "Unknown") {
    return [];
  }
  return [
    {
      type: "ClubStarted",
      data: {
        id: command.data.id,
        name: command.data.name,
        description: command.data.description,
        isPublic: command.data.isPublic,
      },
      metadata: command.metadata,
    },
    {
      type: "ClubJoined",
      data: {
        id: command.data.id,
        role: "Owner",
        status: "Active",
      },
      metadata: command.metadata,
    },
  ];
}
