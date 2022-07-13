import {EventDTO} from "../models/EventDTO";

export interface LogInHandler {
  handleLoggedInEvent(event: EventDTO):void;
  handleLoggInFailed(event: EventDTO):void;
}
