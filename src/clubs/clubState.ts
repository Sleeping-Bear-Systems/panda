import { CommandHandler } from "@event-driven-io/emmett";
import { ClubEvent } from "./clubEvent";
import { MemberState } from "./memberState";

/** Club state. */
export type ClubState =
  | {
      status: "Unknown";
    }
  | {
      status: "Started";
      id: string;
      name: string;
      description: string;
      isPublic: boolean;
      members: Map<string, MemberState>;
    }
  | {
      status: "Ended";
      id: string;
      name: string;
      description: string;
      isPublic: boolean;
      members: Map<string, MemberState>;
    };

/** Initial state function. */
export function initialState(): ClubState {
  return { status: "Unknown" };
}

/** Evolve function. */
export function evolve(state: ClubState, event: ClubEvent): ClubState {
  if (state.status == "Unknown" && event.type == "ClubStarted") {
    return {
      status: "Started",
      id: event.data.id,
      name: event.data.name,
      description: event.data.description,
      isPublic: event.data.isPublic,
      members: new Map<string, MemberState>(),
    };
  } else if (state.status == "Started") {
    if (event.type == "ClubEnded" && event.data.id == state.id) {
      return {
        status: "Ended",
        id: state.id,
        name: state.name,
        description: state.description,
        isPublic: state.isPublic,
        members: new Map<string, MemberState>(state.members),
      };
    } else if (event.type == "ClubJoined" && event.data.id == state.id) {
      const members = new Map<string, MemberState>(state.members);
      members.set(event.metadata.userId, {
        role: event.data.role,
        status: event.data.status,
      });
      return {
        ...state,
        members,
      };
    } else if (event.type == "ClubLeft" && event.data.id == state.id) {
      const members = new Map<string, MemberState>(state.members);
      members.delete(event.metadata.userId);
      return {
        ...state,
        members,
      };
    }
  }
  return state;
}

/** Club command handler. */
export const handle = CommandHandler({ evolve, initialState });

/** Map to stream ID function */
export function mapToStreamId(id: string): string {
  return `club-${id}`;
}
