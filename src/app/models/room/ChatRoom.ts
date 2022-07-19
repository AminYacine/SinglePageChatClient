import {ReceivedMessageDTO} from "./dtos/info/ReceivedMessageDTO";
import {User} from "../User";
import {MessageBlock} from "./MessageBlock";

export class ChatRoom {
  private _name: string = "";
  messages: MessageBlock[] = [];
  users: User[] = [];
  unreadMessages: number;
  isVoiceReq: boolean;
  isInviteReq: boolean;
  /*
  Max time difference between the messages to be grouped in one block.
  Since the timestamp is given in min and the delta in sec, the number must be a factor of 60(= one minute)
   */
  private static MAX_TIME_DELTA: number = 120;

  constructor(name: string) {
    this._name = name;
    this.unreadMessages = 0;
    this.isVoiceReq = false;
    this.isInviteReq = false;
  }

  addMessage(chatMessage: ReceivedMessageDTO) {
    const lastMessageBlock = this.getLastMessageBlock();

    if (ChatRoom.checkMessageAndBlockTimeDelta(chatMessage, lastMessageBlock)) {
      lastMessageBlock.addMessage(chatMessage);
    } else {
      this.messages.push(new MessageBlock(chatMessage));
    }
    console.log(this.messages)
  }

  addUser(user: User) {
    this.users.push(user);
  }

  /**
   * marks the user as left and won't be displayed anymore
   * @param userToRemove
   */
  removeUser(userToRemove: User) {
   this.getUser(userToRemove.email).setHasLeft(true);
  }

  getUser(email: string): User {
    if (email === "Server") {
      const server = new User("Server", "Server");
      server.isOp = true;
      server.hasVoice = true;
      return server;
    }
    const user = this.users.find(user => {
      return user.email === email;
    });
    if (user === undefined){
      return new User(email,"notFound")
    }
    return user;
  }

  changeUsername(email: string, newName: string): string {
    const user = this.getUser(email);
    if (user !== undefined) {
      user.changeName(newName);
      return user.oldUserName;
    }
    return newName;
  }

  toggleIsVoiceReq(){
    this.isVoiceReq = !this.isVoiceReq;
  }

  toggleIsInviteReq() {
    console.log("invite bool geändert")
    this.isInviteReq = !this.isInviteReq;
  }

  isLoggedInUserOp() {
    return this.getUser(localStorage.getItem("email")!)?.isOp;
  }

  hasLoggedInUserVoice() {
    return this.getUser(localStorage.getItem("email")!)?.hasVoice;
  }

  isUserOp(email: string) {
    return this.getUser(email)?.isOp;
  }

  hasUserVoice(email: string) {
    return this.getUser(email)?.hasVoice;
  }

  setOpForUser(email: string, op: boolean) {
   this.getUser(email)?.setIsOp(op);
  }

  setVoiceForUser(email: string, voice: boolean) {
    this.getUser(email)?.setHasVoice(voice);
  }

  incrementUnreadMessages() {
    this.unreadMessages++;
  }

  clearUnreadMessages() {
    this.unreadMessages = 0;
  }

  private getLastMessageBlock(): MessageBlock {
    return this.messages[this.messages.length - 1];
  }

  /**
   * checks if the difference between the timestamp of the new message and the last message block is less than the defined maximum
   * @param chatMessage new chatMessage
   * @param messageBlock last messageBlock
   * @private
   */
  private static checkMessageAndBlockTimeDelta(chatMessage: ReceivedMessageDTO, messageBlock: MessageBlock): boolean {
    if (messageBlock !== undefined) {
      if (chatMessage.email === messageBlock.email) {
        const newMessageTimeStamp = Date.parse(chatMessage.sentAt);
        const blockTimeStamp = Date.parse(messageBlock.timeStamp);
        // time delta in sec
        const timeDelta = (newMessageTimeStamp - blockTimeStamp) / 1000;
        if (timeDelta < ChatRoom.MAX_TIME_DELTA) {
          return true;
        }
      }
    }
    return false;
  }

  getName(): string {
    return this._name;
  }

  setName(value: string) {
    this._name = value;
  }
}
