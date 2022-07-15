import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerService} from "../services/eventHandlerService/event-handler.service";
import {EventDTO} from "../models/EventDTO";
import {RoomJoinedDTO} from "../models/room/RoomJoinedDTO";
import {ChatRoom} from "../models/room/ChatRoom";
import {ReceivedMessageDTO} from "../models/room/ReceivedMessageDTO";
import {EventTypes} from "../models/EventTypes";
import {LoggedOutDTO} from "../models/login/LoogedOutDTO";
import {ChatService} from "../services/chatService/chat.service";
import {RoomLeftDTO} from "../models/room/RoomLeftDTO";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy, OnInit, OnDestroy {
  rooms: ChatRoom[] = [];
  currentView: string = "User Profile";
  inChatView: boolean = false;
  currentChatroom: ChatRoom = new ChatRoom("placeHolder");

  joinRoomForm: FormGroup;
  roomName: FormControl;

  sendMessageForm: FormGroup;
  message: FormControl;


  ngOnInit(): void {
    this.evtHandlerService.message.subscribe(eventDTO => {
      this.handleEvent(eventDTO);
    });
  }

  ngOnDestroy(): void {
    this.evtHandlerService.message.unsubscribe();
  }

  constructor(
    private evtHandlerService: EventHandlerService,
    private chatService: ChatService,
    private authService: AuthenticationService,
    private router: Router
  ) {

    this.roomName = new FormControl("", Validators.required);
    this.joinRoomForm = new FormGroup({
      roomName: this.roomName
    })

    this.message = new FormControl("", Validators.required);
    this.sendMessageForm = new FormGroup({
      message: this.message
    })
  }

  private handleEvent(eventDTO: EventDTO) {
    switch (eventDTO.type) {
      case EventTypes.RoomJoined: {
        this.handleJoinedRoomEvent(eventDTO);
        break;
      }
      case EventTypes.MessageSendToRoom: {
        this.handleMessageSendToRoom(eventDTO);
        break;
      }
      case EventTypes.LoggedOut: {
        this.handleLoggedOutEvent(eventDTO);
        break;
      }
      case EventTypes.RoomLeft: {
        this.handleRoomLeft(eventDTO);
        break;
      }
      default: {
        console.log("Server: ", eventDTO);
      }
    }
  }

  handleJoinedRoomEvent(event: EventDTO): void {
    const joinedRoomInfo: RoomJoinedDTO = event.value;
    if (joinedRoomInfo.email == localStorage.getItem("email")) {

      this.currentChatroom = new ChatRoom(joinedRoomInfo.roomName);
      this.rooms.push(this.currentChatroom);

      this.currentView = "Current Room: " + joinedRoomInfo.roomName;
      this.inChatView = true;
    } else {
      //todo display which user has joined the room, add user to list in room
    }
    console.log("Joined Room");
  }

  handleMessageSendToRoom(event: EventDTO): void {
    const receivedMessage: ReceivedMessageDTO = event.value;
    const chatRoom = this.rooms.find(room => room.name == receivedMessage.roomName)
    if (chatRoom != undefined) {
      chatRoom.messages.push(receivedMessage);
    }
  }

  handleLoggedOutEvent(event: EventDTO) {
    const message: LoggedOutDTO = event.value;
    console.log("LoggedOut ", message.email);
    this.authService.loggedOut();
    this.router.navigateByUrl("/login");
  }


  handleRoomLeft(event: EventDTO) {
    const message: RoomLeftDTO = event.value;
    console.log(message.email, "left room ", message.roomName);

    //if the user is the current user, the room will be removed
    if (message.email === localStorage.getItem("email")) {
      this.rooms = this.rooms.filter(room => {
        return room.name !== message.roomName;
      });
      if (this.currentChatroom.name === message.roomName) {
        //if no rooms are joined the user profile will be displayed
        if (this.rooms.length == 0) {
          this.currentChatroom = new ChatRoom("placeHolder");
          this.openUserSettings();
        } else {
          this.switchRoom(this.rooms[0]);
        }
      }
    } else {
      //todo show user left room and remove from active users
    }

  }


  sendMessage() {
    this.chatService.sendMessage(this.sendMessageForm, this.currentChatroom.name, this.message);
  }

  joinRoom() {
    this.chatService.joinRoom(this.joinRoomForm, this.roomName);
  }

  logout() {
    this.chatService.logout();
    this.authService.loggedOut();
    this.router.navigateByUrl("/login");
  }

  leaveRoom(roomName: string) {
    this.chatService.leaveRoom(roomName);
  }

  /**
   * Method to change the chat room to the selected one
   * @param chatRoom the chat room that was clicked
   */
  switchRoom(chatRoom: ChatRoom) {
    console.log("clicked switch room")
    this.currentChatroom = chatRoom;
    this.currentView = "Current Room: " + chatRoom.name;
    this.inChatView = true;
  }

  /**
   * Open User setting page
   */
  openUserSettings() {
    this.inChatView = false;
    this.currentView = "User Settings";
  }

}
