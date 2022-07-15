import {Injectable} from '@angular/core';
import {EventDTO} from "../../models/EventDTO";
import {EventTypes} from "../../models/EventTypes";
import {EventHandlerService} from "../eventHandlerService/event-handler.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SendChatMessageDTO} from "../../models/SendChatMessageDTO";
import {ChatRoom} from "../../models/room/ChatRoom";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private evtHandlerService: EventHandlerService) {
  }

  /**
   * Method to send JoinRoom Event to websocket
   */
  joinRoom(joinForm: FormGroup, roomName: FormControl) {
    if (joinForm.valid) {
      this.evtHandlerService.message.next(
        new EventDTO(
          EventTypes.JoinRoom, {"roomName": roomName.value}
        ));
      roomName.reset();
    }
  }


  /**
   * Method to send message from input field to websocket
   */
  sendMessage(sendMessageForm: FormGroup, currentChatroom: string, message: FormControl) {
    if (sendMessageForm.valid) {
      this.evtHandlerService.message.next(
        new EventDTO(
          "SendMessageToRoom",
          new SendChatMessageDTO(currentChatroom, message.value)
        ));
      message.reset();
    }
  }


  /**
   * Method to send Logout event to websocket
   */
  logout() {
    console.log("Clicked Logout");
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.Logout, {}
      ));
  }

  leaveRoom(roomName: string) {
    console.log("clicked leave")
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.LeaveRoom, {"roomName": roomName}
      ));
  }
}
