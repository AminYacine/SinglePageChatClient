import {Injectable} from '@angular/core';
import {EventDTO} from "../models/EventDTO";
import {LogInHandler} from "./LogInHandler";
import {EventTypes} from "../models/EventTypes";
import {ChatHandler} from "./ChatHandler";

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  private static logInHandler: LogInHandler;
  private static chatHandler: ChatHandler;
  private static instance: EventHandlerService;

  private constructor() {

  }

  public handleMessageEvent(messageEvent: MessageEvent) {
    const event: EventDTO = JSON.parse(messageEvent.data);

    if (event.type.length > 0) {
      //todo handle different types of events
      switch (event.type) {
        case EventTypes.LoggedIn: {
          EventHandlerService.logInHandler.handleLoggedInEvent(event);
          break;
        }
        case EventTypes.LogginFailed: {
          EventHandlerService.logInHandler.handleLoggInFailed(event);
          break;
        }
        case EventTypes.RoomJoined: {
          EventHandlerService.chatHandler.handleJoinedRoomEvent(event);
          break;
        }
        case EventTypes.MessageSendToRoom: {
          EventHandlerService.chatHandler.handleMessageSendToRoom(event);
          break;
        }
        default: {
          console.log("Unknown MessageEvent: ", event.type);
        }
      }
    }
    console.log("Server: ", event);
  }

  public static getInstance(): EventHandlerService {
    if (EventHandlerService.instance == undefined) {
      return new EventHandlerService();
    }
    return EventHandlerService.instance;
  }

  addLogInHandler(handler: LogInHandler) {
    EventHandlerService.logInHandler = handler;
  }

  addChatHandler(handler: ChatHandler) {
    EventHandlerService.chatHandler = handler;
  }
}
