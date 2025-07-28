import { Command } from "@event-driven-io/emmett";
import { ClubState, isOwner, MemberRole } from "./clubState";
import { ClubEvent } from "./clubEvent";

/** Add member command. */
export type AddMember = Command<
  "AddMember",
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

/** Add member function. */
export function addMember(command: AddMember, state: ClubState): ClubEvent[] {
  if (
    state.status != "Started" ||
    state.id == command.data.id ||
    state.members.has(command.data.userId)
  ) {
    return [];
  }
  if (!isOwner(state, command.metadata.userId)) {
    return [];
  }
  return [
    {
      type: "MemberAdded",
      data: {
        id: command.data.id,
        userId: command.data.userId,
        role: command.data.role,
      },
      metadata: {
        userId: command.metadata.userId,
        timestamp: command.metadata.timestamp,
      },
    },
  ];
}
