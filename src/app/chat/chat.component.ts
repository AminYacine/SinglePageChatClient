import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerService} from "../services/eventHandlerService/event-handler.service";
import {EventDTO} from "../models/EventDTO";
import {RoomJoinedDTO} from "../models/room/dtos/RoomJoinedDTO";
import {ChatRoom} from "../models/room/ChatRoom";
import {ReceivedMessageDTO} from "../models/room/dtos/ReceivedMessageDTO";
import {EventTypes} from "../models/EventTypes";
import {LoggedOutDTO} from "../models/login/LoogedOutDTO";
import {ChatService} from "../services/chatService/chat.service";
import {RoomLeftDTO} from "../models/room/dtos/RoomLeftDTO";
import {AuthenticationService} from "../services/authService/authentication.service";
import {JWTAuthDTO} from "../models/login/JWTAuthDTO";
import {Subscription} from "rxjs";
import {User} from "../models/User";
import {ServerInfo} from "../models/room/ServerInfo";
import {UserRenamedDTO} from "../models/user/UserRenamedDTO";
import {PasswordChangedDTO} from "../models/user/PasswordChangedDTO";

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
  username: string;
  joinRoomForm: FormGroup;
  roomName: FormControl;

  sendMessageForm: FormGroup;
  message: FormControl;
  private socketStatusSubscription!: Subscription;

  constructor(
    private evtHandlerService: EventHandlerService,
    private chatService: ChatService,
    private authService: AuthenticationService,
  ) {
    this.username = this.authService.getUserName()!;
    this.roomName = new FormControl("", Validators.required);
    this.joinRoomForm = new FormGroup({
      roomName: this.roomName
    })

    this.message = new FormControl("", Validators.required);
    this.sendMessageForm = new FormGroup({
      message: this.message
    })
  }

  ngOnInit(): void {
    console.log("chat init")
    this.evtHandlerService.message.subscribe({
      next: eventDTO => {
        this.handleEvent(eventDTO);
      },
      error: err => {
        //todo display error message
        console.log("error", err);
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

  async ngOnDestroy(): Promise<void> {
    console.log("chat unsubscribed");
    this.evtHandlerService.message.unsubscribe();
    this.socketStatusSubscription.unsubscribe();
    await this.chatService.logout();
    this.authService.loggedOut();
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
      case EventTypes.UserRenamed: {
        this.handleRenamedUser(eventDTO.value);
        break;
      }
      case EventTypes.ChangedUserPassword: {
        this.handlePasswordChangedEvent(eventDTO.value);
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
        new JWTAuthDTO(this.authService.getToken()!, this.authService.getEmail()!)
      ));
  }

  private handleRenamedUser(renamedEvent: UserRenamedDTO) {
    const newName = renamedEvent.name;
    if (renamedEvent.email === this.authService.getEmail()) {
      this.authService.changeUserName(newName);
      this.username = newName;
      //todo display successfully renamed
    }
    this.rooms.forEach(room => {
      console.log("inFOREACH")
      const oldName = room.changeUsername(renamedEvent.email, newName);
      this.handleMessageSendToRoom(new ServerInfo(
        "User \"" + oldName + "\" changed name to  \"" + newName+"\"",
        room.name));
    });
  }

  private handlePasswordChangedEvent(pwChangedDto: PasswordChangedDTO) {
    console.log("Password Successfully changed", pwChangedDto)
    //todo display successfully password changed
  }

  private handleJoinedRoomEvent(event: EventDTO): void {
    console.log("injoinedRoom");
    const roomJoinedDTO: RoomJoinedDTO = event.value;
    if (roomJoinedDTO.email == this.authService.getEmail()) {

      const newChatRoom = new ChatRoom(roomJoinedDTO.roomName);
      this.rooms.push(newChatRoom);
      this.switchRoom(newChatRoom);
      this.currentChatroom.addUser(new User(roomJoinedDTO.email, roomJoinedDTO.name));

    } else {
      const joinedRoom = this.chatService.getRoomByName(roomJoinedDTO.roomName, this.rooms);
      if (joinedRoom !== undefined) {
        joinedRoom.addUser(new User(roomJoinedDTO.email, roomJoinedDTO.name));
        this.handleMessageSendToRoom(new ServerInfo("User \"" + roomJoinedDTO.name + "\" joined the chat", joinedRoom.name));
      }
    }
    console.log("User ", roomJoinedDTO.name, "joined the Chat");
  }

  private handleMessageSendToRoom(receivedMessage: ReceivedMessageDTO): void {
    console.log(receivedMessage.roomName)
    const chatRoom = this.chatService.getRoomByName(receivedMessage.roomName, this.rooms);
    if (chatRoom != undefined) {
      chatRoom.addMessage(receivedMessage);
      console.log(chatRoom.name !== this.currentChatroom.name)
      console.log(!this.inChatView)
      if (!this.inChatView || chatRoom.name !== this.currentChatroom.name) {
        chatRoom.incrementUnreadMessages();
        console.log("newMessages:",chatRoom?.unreadMessages)
      }
    }

  }

  private handleLoggedOutEvent(event: EventDTO) {
    const message: LoggedOutDTO = event.value;
    console.log("LoggedOut ", message.email);
    this.authService.loggedOut();
  }

  private handleLoggInFailed() {
    //todo display message: login gain, the session is expired
    console.log("login failed")
    this.logout();
  }

  private handleRoomLeft(event: EventDTO) {
    const roomLeftDTO: RoomLeftDTO = event.value;
    console.log(roomLeftDTO.email, "left room ", roomLeftDTO.roomName);
    const affectedRoom = this.chatService.getRoomByName(roomLeftDTO.roomName, this.rooms);

    if (affectedRoom !== undefined) {
      //if the user is the current user, the room will be removed
      if (roomLeftDTO.email === this.authService.getEmail()) {
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
          this.handleMessageSendToRoom(new ServerInfo("User \"" + leftUser.userName + "\" left the chat", roomLeftDTO.roomName));
        }
      }
    }
  }

  receiveRenameUserEvent($event: EventDTO) {
    console.log("inchat rename")
    this.chatService.renameUser($event);
  }

  receiveChangePasswordEvent($event: EventDTO) {
    console.log("in chat")
    this.chatService.changePassword($event);
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
    chatRoom.clearUnreadMessages();
  }

  /**
   * Open User setting page
   */
  openUserSettings() {
    this.inChatView = false;
    this.currentView = "User Settings";
  }

}
