import {EventDTO} from "../models/EventDTO";

export interface ChatHandler {
  handleJoinedRoomEvent(event: EventDTO): void;

  handleMessageSendToRoom(event: EventDTO): void;
}
