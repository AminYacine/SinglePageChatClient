import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerService} from "../services/eventHandlerService/event-handler.service";
import {EventDTO} from "../models/EventDTO";
import {RoomJoinedDTO} from "../models/room/dtos/info/RoomJoinedDTO";
import {ChatRoom} from "../models/room/ChatRoom";
import {ReceivedMessageDTO} from "../models/room/dtos/info/ReceivedMessageDTO";
import {EventTypes} from "../models/EventTypes";
import {LoggedOutDTO} from "../models/login/LoogedOutDTO";
import {ChatService} from "../services/chatService/chat.service";
import {RoomLeftDTO} from "../models/room/dtos/info/RoomLeftDTO";
import {AuthenticationService} from "../services/authService/authentication.service";
import {JWTAuthDTO} from "../models/login/JWTAuthDTO";
import {Subscription} from "rxjs";
import {User} from "../models/User";
import {ServerInfo} from "../models/room/ServerInfo";
import {UserRenamedInRoomDTO} from "../models/user/UserRenamedInRoomDTO";
import {PasswordChangedDTO} from "../models/user/PasswordChangedDTO";
import {RenameUserDTO} from "../models/user/RenameUserDTO";
import {UserRenamedSingleDTO} from "../models/user/UserRenamedSingleDTO";
import {OpGrantedDTO} from "../models/room/dtos/info/OpGrantedDTO";
import {VoiceGrantedDTO} from "../models/room/dtos/info/VoiceGrantedDTO";
import {VoiceInRoomRequiredDTO} from "../models/room/dtos/info/VoiceInRoomRequiredDTO";
import {InvitedOfRoomRequiredDTO} from "../models/room/dtos/info/InvitedOfRoomRequiredDTO";
import {InvitedToRoomDTO} from "../models/room/dtos/info/InvitedToRoomDTO";
import {JoinRoomFailed} from "../models/user/JoinRoomFailed";

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
  roomCommandShown: boolean = false;
  userCommandShown: boolean = false;
  joinRoomForm!: FormGroup;
  roomName!: FormControl;

  sendMessageForm!: FormGroup;
  message!: FormControl;

  inviteUserForm!: FormGroup;
  userToInvite!: FormControl;
  private socketStatusSubscription!: Subscription;
  userForCommands: User = new User("", "");

  constructor(
    private evtHandlerService: EventHandlerService,
    private chatService: ChatService,
    private authService: AuthenticationService,
  ) {
    this.username = this.authService.getUserName()!;
    this.initForms();
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
    });
  }


  initForms() {
    this.roomName = new FormControl("", Validators.required);
    this.joinRoomForm = new FormGroup({
      roomName: this.roomName
    });

    this.message = new FormControl("", Validators.required);
    this.sendMessageForm = new FormGroup({
      message: this.message
    });

    this.userToInvite = new FormControl("", Validators.required);
    this.inviteUserForm = new FormGroup({
      userToInvite: this.userToInvite
    });
  }

  async ngOnDestroy(): Promise<void> {
    console.log("chat unsubscribed");
    this.evtHandlerService.message.unsubscribe();
    this.socketStatusSubscription.unsubscribe();
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
        this.handleRoomLeft(eventDTO.value, false);
        break;
      }
      case EventTypes.SocketIdEvent: {
        this.handleSocketIDEvent(eventDTO);
        break;
      }
      case EventTypes.RenamedUserInRoom: {
        this.handleRenamedUserInRoom(eventDTO.value);
        break;
      }
      case EventTypes.RenamedUser: {
        this.handleRenamedUserSingle(eventDTO.value);
        break;
      }
      case EventTypes.ChangedUserPassword: {
        this.handlePasswordChangedEvent(eventDTO.value);
        break;
      }
      case EventTypes.OpGranted: {
        this.handleOpGranted(eventDTO.value);
        break;
      }
      case EventTypes.VoiceGranted: {
        this.handleVoiceGranted(eventDTO.value);
        break;
      }
      case EventTypes.VoiceInRoomRequired: {
        this.handleVoiceInRoomReq(eventDTO.value);
        break;
      }
      case EventTypes.InvitedOfRoomRequired: {
        this.handleInvitedOfRoomReq(eventDTO.value);
        break;
      }
      case EventTypes.InvitedToRoom: {
        this.handleInvitedToRoom(eventDTO.value);
        break;
      }
      case EventTypes.JoinRoomFailed: {
        this.handleJoinRoomFailed(eventDTO.value);
        break;
      }
      case EventTypes.UserKicked: {
        this.handleUserKicked(eventDTO.value);
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

  private handleRenamedUserInRoom(renamedEvent: UserRenamedInRoomDTO) {
    const newName = renamedEvent.name;
    const email = renamedEvent.email;
    if (email === this.authService.getEmail()) {
      this.handleRenameSubmitter(newName, email)
    } else {
      this.rooms.forEach(room => {
        const oldName = room.changeUsername(email, newName);
        this.handleMessageSendToRoom(new ServerInfo(
          "User \"" + oldName + "\" changed name to  \"" + newName + "\"",
          room.getName()));
      });
    }
  }

  private handleRenamedUserSingle(renamedEvent: UserRenamedSingleDTO) {
    this.handleRenameSubmitter(renamedEvent.name, renamedEvent.email);
  }

  private handleRenameSubmitter(newName: string, email: string) {
    this.authService.changeUserName(newName);
    this.username = newName;
    this.rooms.forEach(room => {
      room.changeUsername(email, newName);
    });
    //todo display successfully renamed
  }

  private handlePasswordChangedEvent(pwChangedDto: PasswordChangedDTO) {
    console.log("Password Successfully changed", pwChangedDto)
    //todo display successfully password changed
  }

  private handleJoinedRoomEvent(event: EventDTO): void {
    const roomJoinedDTO: RoomJoinedDTO = event.value;
    if (roomJoinedDTO.email === this.authService.getEmail()) {

      const newChatRoom = new ChatRoom(roomJoinedDTO.roomName);
      this.rooms.push(newChatRoom);
      this.switchRoom(newChatRoom);
      this.currentChatroom.addUser(new User(roomJoinedDTO.email, roomJoinedDTO.name));
    } else {
      const joinedRoom = this.chatService.getRoomByName(roomJoinedDTO.roomName, this.rooms);
      if (joinedRoom !== undefined) {
        joinedRoom.addUser(new User(roomJoinedDTO.email, roomJoinedDTO.name));
        this.handleMessageSendToRoom(new ServerInfo("User \"" + roomJoinedDTO.name + "\" joined the chat", joinedRoom.getName()));
      }
      console.log(joinedRoom?.users)
    }
  }

  private handleMessageSendToRoom(receivedMessage: ReceivedMessageDTO): void {
    const chatRoom = this.chatService.getRoomByName(receivedMessage.roomName, this.rooms);
    if (chatRoom != undefined) {
      chatRoom.addMessage(receivedMessage);
      //if the user profile is open or the current chat room does not receive the message
      //the unread message counter is incremented for that room
      if (!this.inChatView || chatRoom.getName() !== this.currentChatroom.getName()) {
        chatRoom.incrementUnreadMessages();
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
    this.sendLogout();
  }

  private handleRoomLeft(roomLeftDTO: RoomLeftDTO, byKick: boolean) {
    const affectedRoom = this.chatService.getRoomByName(roomLeftDTO.roomName, this.rooms);

    if (affectedRoom !== undefined) {
      //if the user is the current user, the room will be removed
      if (roomLeftDTO.email === this.authService.getEmail()) {
        this.removeRoomCurrentUser(affectedRoom, byKick);
      } else {
        //if the left user is not the current one, the user will be removed
        this.removeUserFromRoom(affectedRoom, roomLeftDTO.email, byKick);
      }
    }
  }


  private removeRoomCurrentUser(affectedRoom: ChatRoom, byKick: boolean) {
    this.rooms = this.chatService.removeRoom(affectedRoom, this.rooms);
    //if the removed room was the current one
    if (this.currentChatroom.getName() === affectedRoom.getName()) {
      //if no rooms are joined the user profile will be displayed
      // otherwise the room is switch to the first one in the list
      if (this.rooms.length == 0) {
        this.currentChatroom = new ChatRoom("placeHolder");
        this.openUserSettings();
      } else {
        this.switchRoom(this.rooms[0]);
      }
      //when user was kicked message is displayed
      if (byKick) {
        //todo show message u were kicked from room ... by an op
        console.log("you were kicked by an from room", affectedRoom.getName())
      }
    }
  }

  private removeUserFromRoom(affectedRoom: ChatRoom, leftUserMail: string, byKick: boolean) {
    const leftUser = affectedRoom.getUser(leftUserMail);
    console.log("left user", leftUserMail)
    console.log("found left user", leftUser)
    const message = byKick ? "was kicked from chat" : "left the chat";
    console.log("leave message", message)
    if (leftUser !== undefined) {
      affectedRoom.removeUser(leftUser);
      this.handleMessageSendToRoom(new ServerInfo("User \"" + leftUser.userName + "\" " + message, affectedRoom.getName()));
      //hide User
      if (byKick && this.userForCommands.email === leftUserMail) {
        this.toggleShowUserCommands(new User("", ""))
      }
    }
  }

  receiveRenameUserEvent($newName: string) {
    let roomName = "";
    if (this.rooms.length > 0) {
      roomName = this.rooms[0].getName();
    }
    this.chatService.renameUser(new EventDTO(
      EventTypes.UserRename, new RenameUserDTO(this.authService.getEmail()!, $newName, roomName)
    ));
  }

  receiveChangePasswordEvent($event: EventDTO) {
    this.chatService.changePassword($event);
  }

  sendMessage() {
    this.chatService.sendMessage(this.sendMessageForm, this.currentChatroom.getName(), this.message);
  }

  sendJoinRoom() {
    this.chatService.joinRoom(this.joinRoomForm, this.roomName);
  }

  sendLogout() {
    this.chatService.logout();
    this.authService.loggedOut();
  }

  sendLeaveRoom(roomName: string) {
    this.chatService.leaveRoom(roomName);
  }

  /**
   * Method to change the chat room to the selected one
   * @param chatRoom the chat room that was clicked
   */
  switchRoom(chatRoom: ChatRoom) {
    console.log("switch room")
    this.currentChatroom = chatRoom;
    this.currentView = "Current Room: " + chatRoom.getName();
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

  private handleOpGranted(opGranted: OpGrantedDTO) {
    const room = this.rooms.find(room => room.getName() == opGranted.roomName);
    if (room !== undefined) {
      room.setOpForUser(opGranted.email, opGranted.op);
      //to hide user commands when op role lost
      if (opGranted.email === this.authService.getEmail()) {
        if (this.userCommandShown && !opGranted.op) {
          this.toggleShowUserCommands(new User("", ""))
        }
      }
    }
    console.log("Server: Op granted", opGranted.email, opGranted.op);
  }

  private handleVoiceGranted(voiceGranted: VoiceGrantedDTO) {
    const room = this.rooms.find(room => room.getName() == voiceGranted.roomName);
    if (room !== undefined) {
      room.setVoiceForUser(voiceGranted.email, voiceGranted.voice);
      //todo display new role dependant on boolean
    }
    console.log("Server: voice granted", voiceGranted.email, voiceGranted.voice);
    console.log("current user has voice: ", this.currentChatroom.hasLoggedInUserVoice())
  }

  private handleInvitedToRoom(invitedToRoom: InvitedToRoomDTO) {
    if (invitedToRoom.email === this.authService.getEmail()) {
      if (invitedToRoom.invite) {
        //todo show message if user wants to join room
      } else {
        //todo show message that invite was revoked
      }

    }
    console.log("Server: Invited To Room", invitedToRoom);
  }

  //todo display info message
  private handleVoiceInRoomReq(voiceInRoomReq: VoiceInRoomRequiredDTO) {
    const affectedRoom = this.rooms.find(room => {
      return room.getName() === voiceInRoomReq.roomName
    });
    if (affectedRoom !== undefined) {
      affectedRoom.isVoiceReq = voiceInRoomReq.voice;
    }
    const message = voiceInRoomReq.voice ? "Switched to Voice-Only mode" : "Voice-Only mode turned off";
    this.handleMessageSendToRoom(new ServerInfo(message, voiceInRoomReq.roomName));
  }

  private handleInvitedOfRoomReq(invitedOfRoomReq: InvitedOfRoomRequiredDTO) {
    console.log("Server: Invite of Room required", invitedOfRoomReq);
  }


  sendSetVoiceRoom(room: ChatRoom) {
    room.toggleIsVoiceReq()
    this.chatService.setVoiceRoom(room.getName(), room.isVoiceReq);
  }

  sendSetInviteRoom(room: ChatRoom) {
    room.toggleIsInviteReq()
    this.chatService.setInviteRoom(room.getName(), room.isInviteReq);
  }

  sendInviteUser(roomName: string) {
    if (this.inviteUserForm.valid) {
      this.chatService.sendInvitationToRoom(roomName, this.userToInvite.value);
      //todo message invite was sent
    }
    this.inviteUserForm.reset();
  }

  sendGrantVoice(user: User) {
    this.chatService.sendGrantVoice(this.currentChatroom, user.email, !user.hasVoice);
  }

  sendGrantOp(user: User) {
    this.chatService.sendGrantOp(this.currentChatroom, user.email, !user.isOp);
  }

  sendKickUser(userToKick: User) {
      this.chatService.sendKickUser(userToKick.email, this.currentChatroom);
  }

  toggleShowRoomCommands() {
    this.roomCommandShown = !this.roomCommandShown;
  }

  toggleShowUserCommands(user: User) {
    this.userCommandShown = !this.userCommandShown;
    this.userForCommands = user;
    console.log("toggled usercommand")
    console.log("commandUser", user)
  }

  private handleJoinRoomFailed(joineFailed: JoinRoomFailed) {
    //todo display message Join failed, Invitation needed
    console.log("You cant join this room without invitation")
  }

  getAuthService() {
    return this.authService;
  }

  private handleUserKicked(userKicked: RoomLeftDTO) {
    this.handleRoomLeft(userKicked, true);
  }


}
