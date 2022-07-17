import {ReceivedMessageDTO} from "./dtos/ReceivedMessageDTO";
import {User} from "../User";
import {MessageBlock} from "./MessageBlock";

export class ChatRoom {
  name: string = "";
  messages: MessageBlock[] = [];
  users: User[] = [];
  unreadMessages: number;

  /*
  Max time difference between the messages to be grouped in one block.
  Since the timestamp is given in min and the delta in sec, the number must be a factor of 60(= one minute)
   */
   private static MAX_TIME_DELTA: number = 120;


  constructor(name: string,) {
    this.name = name;
    this.unreadMessages = 0;
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

  removeUser(userToRemove: User) {
    this.users = this.users.filter(user => {
      return user.email !== userToRemove.email;
    });
  }

  getUser(email: string): User | undefined {
    if (email === "Server"){
      return new User("Server","Server");
    }
    return this.users.find(user => {
      return user.email === email;
    });
  }

  changeUsername(email:string, newName: string): string {
    const user = this.getUser(email);
    if (user !== undefined) {
     user.changeName(newName);
     return user.oldUserName;
    }
     return newName;
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
        const blockTimeStamp =  Date.parse(messageBlock.timeStamp);
        // time delta in sec
        const timeDelta = (newMessageTimeStamp-blockTimeStamp)/1000;
        if (timeDelta < ChatRoom.MAX_TIME_DELTA ) {
          return true;
        }
      }
    }
    return false;
  }
}
