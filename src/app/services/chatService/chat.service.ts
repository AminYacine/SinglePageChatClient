import {Injectable} from '@angular/core';
import {EventDTO} from "../../models/EventDTO";
import {EventTypes} from "../../models/EventTypes";
import {EventHandlerService} from "../eventHandlerService/event-handler.service";
import {FormControl, FormGroup} from "@angular/forms";
import {SendChatMessageDTO} from "../../models/room/dtos/commands/SendChatMessageDTO";
import {ChatRoom} from "../../models/room/ChatRoom";
import {RenameUserDTO} from "../../models/user/RenameUserDTO";
import {SetVoiceRoomDTO} from "../../models/room/dtos/commands/SetVoiceRoomDTO";
import {SetInviteRoomDTO} from "../../models/room/dtos/commands/SetInviteRoomDTO";
import {InviteToRoomDTO} from "../../models/room/dtos/commands/InviteToRoomDTO";
import {GrantVoiceDTO} from "../../models/room/dtos/commands/GrantVoiceDTO";
import {GrantOpDTO} from "../../models/room/dtos/commands/GrantOpDTO";
import {KickUserDTO} from "../../models/room/dtos/commands/KickUserDTO";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private evtHandlerService: EventHandlerService) {
  }

  /**
   * Method to send JoinRoom Event to websocket
   */
  joinRoom(roomName: string) {
      this.evtHandlerService.message.next(
        new EventDTO(
          EventTypes.JoinRoom, {"roomName": roomName}
        ));
  }

  /**
   * Method to send message from input field to websocket
   */
  sendMessage(sendMessageForm: FormGroup, currentChatroom: string, message: FormControl) {
    if (sendMessageForm.valid) {
      this.evtHandlerService.message.next(
        new EventDTO(
          EventTypes.SendMessage,
          new SendChatMessageDTO(currentChatroom, message.value)
        ));
      message.reset();
    }
  }

  renameUser($event: EventDTO) {
    this.evtHandlerService.message.next($event);
  }

  changePassword($event: EventDTO) {
    this.evtHandlerService.message.next($event);
    console.log("change password sent")
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

  getRoomByName(roomName: string, rooms: ChatRoom[]): ChatRoom | undefined {
    return rooms.find(room => roomName === room.getName());
  }

  removeRoom(affectedRoom: ChatRoom, rooms: ChatRoom[]): ChatRoom[] {
    return rooms.filter(room => {
      return room.getName() !== affectedRoom.getName();
    });
  }

  setVoiceRoom(roomName: string, isVoiceReq: boolean) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.SetVoiceRoom, new SetVoiceRoomDTO(roomName, isVoiceReq)
      ));
    console.log("setVoiceRoom sent")
  }

  setInviteRoom(roomName: string, isInviteReq: boolean) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.SetInviteRoom, new SetInviteRoomDTO(roomName, isInviteReq)
      ));
    console.log("setInviteRoom sent")
  }

  sendInvitationToRoom(room: string, userEmail: string) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.InviteToRoom, new InviteToRoomDTO(room, userEmail, true)
      ));
    //todo if sent a second time set boolean to false to trigger message
  }

  sendGrantVoice(currentChatroom: ChatRoom, userEmail: string, voice: boolean) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.GrantVoice, new GrantVoiceDTO(currentChatroom.getName(), userEmail, voice)
      ));
  }

  sendGrantOp(currentChatroom: ChatRoom, userEmail: string, op: boolean) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.GrantOp, new GrantOpDTO(currentChatroom.getName(), userEmail, op)
      ));
  }

  sendKickUser(userToKick: string, currentChatroom: ChatRoom) {
    this.evtHandlerService.message.next(
      new EventDTO(
        EventTypes.KickUser, new KickUserDTO(currentChatroom.getName(), userToKick)
      ));
  }
}
