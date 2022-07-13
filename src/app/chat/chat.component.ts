import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {WebSocketService} from "../services/web-socket.service";
import {ChatHandler} from "../services/ChatHandler";
import {EventHandlerService} from "../services/event-handler.service";
import {EventDTO} from "../models/EventDTO";
import {RoomJoinedDTO} from "../models/room/RoomJoinedDTO";
import {Session} from "../models/Session";
import {ChatRoom} from "../models/room/ChatRoom";
import {SendChatMessageDTO} from "../models/SendChatMessageDTO";
import {ReceivedMessageDTO} from "../models/room/ReceivedMessageDTO";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy, ChatHandler {
  private webSocketService: WebSocketService;
  rooms: ChatRoom[] = [];
  currentView: string = "User Profile";
  inChatView: boolean = false;
  currentChatroom: ChatRoom = new ChatRoom("placeholder");

  joinRoomForm: FormGroup;
  roomName: FormControl;

  sendMessageForm: FormGroup;
  message: FormControl;

  constructor() {
    const eventHandler = EventHandlerService.getInstance();
    eventHandler.addChatHandler(this);
    this.webSocketService = new WebSocketService();

    this.roomName = new FormControl("", Validators.required);
    this.joinRoomForm = new FormGroup({
      roomName: this.roomName
    })

    this.message = new FormControl("", Validators.required);
    this.sendMessageForm = new FormGroup({
      message: this.message
    })
  }

  openUserSettings() {
    this.inChatView = false;
    this.currentView = "User Settings";
  }

  sendMessage() {
    if (this.sendMessageForm.valid) {
      this.webSocketService.sendMessage(new SendChatMessageDTO(this.currentChatroom.name, this.message.value));
      this.message.reset();
    }
  }

  joinRoom() {
    if (this.joinRoomForm.valid) {
      this.webSocketService.joinRoom(this.roomName.value);
      this.roomName.reset();
    }
  }

  switchRoom(chatRoom: ChatRoom) {
    this.currentChatroom = chatRoom;
    this.currentView = "Current Room: " + chatRoom.name;
    this.inChatView = true;
  }

  handleJoinedRoomEvent(event: EventDTO): void {
    const joinedRoomInfo: RoomJoinedDTO = event.value;
    if (joinedRoomInfo.email == Session.email) {

      this.currentChatroom = new ChatRoom(joinedRoomInfo.roomName);
      this.rooms.push(this.currentChatroom);

      this.currentView = "Current Room: " + joinedRoomInfo.roomName;
      this.inChatView = true;
    } else {
      //todo display wich user has joined the room, add user to list in room
    }
    console.log();
  }

  handleMessageSendToRoom(event: EventDTO): void {
    const receivedMessage: ReceivedMessageDTO = event.value;
    const chatRoom = this.rooms.find(room => room.name == receivedMessage.roomName)
    if (chatRoom != undefined) {
      chatRoom.messages.push(receivedMessage);
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }


}
