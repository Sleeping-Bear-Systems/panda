import type { Command } from "@event-driven-io/emmett";

import type { ClubEvent } from "./clubEvent";
import type { ClubMetadata } from "./clubMetadata";
import type { ClubState } from "./clubState";
import type { MemberRole, MemberStatus } from "./memberState";

/** Join club command. */
export type JoinClub = Command<
  "JoinClub",
  {
    id: string;
    role: MemberRole;
    status: MemberStatus;
  },
  ClubMetadata
>;

/** Join club function. */
export function joinClub(command: JoinClub, state: ClubState): ClubEvent[] {
  if (
    state.status != "Started" ||
    state.id != command.data.id ||
    state.members.has(command.metadata.accountId)
  ) {
    return [];
  }
  return [
    {
      type: "ClubJoined",
      data: {
        id: command.data.id,
        role: command.data.role,
        status: state.isPublic ? "Active" : "Pending",
      },
      metadata: command.metadata,
    },
  ];
}
