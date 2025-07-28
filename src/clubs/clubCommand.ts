import { addMember, AddMember } from "./addMember";
import { ClubEvent } from "./clubEvent";
import { ClubState } from "./clubState";
import { endClub, EndClub } from "./endClub";
import { startClub, StartClub } from "./startClub";

/** Book command. */
export type ClubCommand = StartClub | EndClub | AddMember;

/** Decide function. */
export function decide(command: ClubCommand, state: ClubState): ClubEvent[] {
  switch (command.type) {
    case "StartClub":
      return startClub(command, state);
    case "EndClub":
      return endClub(command, state);
    case "AddMember":
      return addMember(command, state);
  }
}
