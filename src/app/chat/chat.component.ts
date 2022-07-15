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
import {JWTAuthDTO} from "../models/login/JWTAuthDTO";
import {Subscription} from "rxjs";
import {User} from "../models/User";
import {ServerInfo} from "../models/room/ServerInfo";

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
  private socketStatusSubscription!: Subscription;


  ngOnInit(): void {
    this.evtHandlerService.message.subscribe({
      next: eventDTO => {
        this.handleEvent(eventDTO);
      },
      error: err => {
        //todo display error message
        console.log(err);
      },
    });

    this.socketStatusSubscription = this.evtHandlerService.socketStatus.subscribe({
      next: value => {
        const ev: Event = value;
        //todo message in ui
        console.log("Connection to server successful", ev.type);
      },
      complete: () => {
        //todo server offline, try again later by reloading the page
        console.log("Connection closed");
      }
    })

  }

  ngOnDestroy(): void {
    this.evtHandlerService.message.unsubscribe();
    this.authService.loggedOut();
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
        this.handleMessageSendToRoom(eventDTO.value);
        break;
      }
      case EventTypes.LogginFailed: {
        this.handleLoggInFailed();
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
      case EventTypes.SocketIdEvent: {
        this.handleSocketIDEvent(eventDTO);
        break;
      }
      default: {
        console.log("Server: ", eventDTO);
      }
    }
  }

  private handleSocketIDEvent(eventDTO: EventDTO) {
    console.log("New socket connection", eventDTO.value)
    this.evtHandlerService.message.next(
      new EventDTO(EventTypes.AuthWithJWTToken,
        new JWTAuthDTO(localStorage.getItem("token")!, localStorage.getItem("email")!)
      ));
  }

  handleJoinedRoomEvent(event: EventDTO): void {
    const joinedRoomInfo: RoomJoinedDTO = event.value;
    if (joinedRoomInfo.email == localStorage.getItem("email")) {

      this.currentChatroom = new ChatRoom(joinedRoomInfo.roomName);
      this.currentChatroom.addUser(new User(joinedRoomInfo.email, joinedRoomInfo.name));
      this.rooms.push(this.currentChatroom);

      this.currentView = "Current Room: " + joinedRoomInfo.roomName;
      this.inChatView = true;

    } else {
      const joinedRoom = this.chatService.getRoomByName(joinedRoomInfo.roomName, this.rooms);
      if (joinedRoom !== undefined) {
        joinedRoom.addUser(new User(joinedRoomInfo.email, joinedRoomInfo.name));
      }
      //todo display which user has joined the room, add user to list in room
    }
    console.log("User ", joinedRoomInfo.name, "joined the Chat");
  }

  handleMessageSendToRoom(receivedMessage: ReceivedMessageDTO): void {
    const chatRoom = this.chatService.getRoomByName(receivedMessage.roomName, this.rooms);
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

  handleLoggInFailed() {
    //todo display message: login gain, the session is expired
    console.log("login failed")
    this.logout();
  }

  handleRoomLeft(event: EventDTO) {
    const roomLeftDTO: RoomLeftDTO = event.value;
    console.log(roomLeftDTO.email, "left room ", roomLeftDTO.roomName);
    const affectedRoom = this.chatService.getRoomByName(roomLeftDTO.roomName, this.rooms);

    if (affectedRoom !== undefined) {
      //if the user is the current user, the room will be removed
      if (roomLeftDTO.email === localStorage.getItem("email")) {
        this.rooms = this.chatService.removeRoom(affectedRoom, this.rooms);
        if (this.currentChatroom.name === roomLeftDTO.roomName) {
          //if no rooms are joined the user profile will be displayed
          if (this.rooms.length == 0) {
            this.currentChatroom = new ChatRoom("placeHolder");
            this.openUserSettings();
          } else {
            this.switchRoom(this.rooms[0]);
          }
        }
      } else {
        const leftUser = affectedRoom.getUser(roomLeftDTO.email);
        if (leftUser !== undefined) {
          affectedRoom.removeUser(leftUser);
          this.handleMessageSendToRoom(new ServerInfo("User \"" + leftUser.userName+ "\" left the chat", roomLeftDTO.roomName));
        }
      }
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
