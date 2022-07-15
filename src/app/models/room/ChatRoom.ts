import {ReceivedMessageDTO} from "./ReceivedMessageDTO";
import {User} from "../User";

export class ChatRoom {
  name: string = ""
  messages: ReceivedMessageDTO[] = [];
  users: User[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addMessage(chatMessage: ReceivedMessageDTO) {
    this.messages.push(chatMessage);
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
    return this.users.find(user => {
      return user.email === email;
    });
  }
}
