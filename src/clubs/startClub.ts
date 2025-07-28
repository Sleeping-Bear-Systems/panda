import { Command } from "@event-driven-io/emmett/.";
import { ClubState } from "./clubState";
import { ClubEvent } from "./clubEvent";

export type StartClub = Command<
  "StartClub",
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
      },
      metadata: {
        userId: command.metadata.userId,
        timestamp: command.metadata.timestamp,
      },
    },
  ];
}
