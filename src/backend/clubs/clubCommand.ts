import type { ClubEvent } from "./clubEvent";
import type { ClubState } from "./clubState";
import type { EndClub} from "./endClub";
import { endClub } from "./endClub";
import type { JoinClub} from "./joinClub";
import { joinClub } from "./joinClub";
import type { LeaveClub} from "./leaveClub";
import { leaveClub } from "./leaveClub";
import type { StartClub} from "./startClub";
import { startClub } from "./startClub";

/** Club command. */
export type ClubCommand = StartClub | EndClub | JoinClub | LeaveClub;

/** Decide function. */
export function decide(command: ClubCommand, state: ClubState): ClubEvent[] {
  switch (command.type) {
    case "StartClub":
      return startClub(command, state);
    case "EndClub":
      return endClub(command, state);
    case "JoinClub":
      return joinClub(command, state);
    case "LeaveClub":
      return leaveClub(command, state);
  }
}
