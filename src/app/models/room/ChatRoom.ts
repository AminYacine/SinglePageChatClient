import {ReceivedMessageDTO} from "./ReceivedMessageDTO";

export class ChatRoom {
  name:string = ""
  messages: ReceivedMessageDTO[] = [];
  users: string[] = [];

  constructor(name:string) {
    this.name = name;
  }

  addMessage(chatMessage: ReceivedMessageDTO) {
    this.messages.push(chatMessage);
  }

  addUser(user:string) {
    this.users.push(user);
  }
}
