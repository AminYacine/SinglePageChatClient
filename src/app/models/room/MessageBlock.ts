import {ReceivedMessageDTO} from "./dtos/info/ReceivedMessageDTO";

export class MessageBlock {
  messages: ReceivedMessageDTO[] = [];
  email: string;
  timeStamp: string;

  constructor(message: ReceivedMessageDTO) {
    this.addMessage(message);
    this.email = message.email;
    this.timeStamp = message.sentAt;
  }

  addMessage(message: ReceivedMessageDTO) {
    this.messages.push(message);
  }

  getLastMessage(): ReceivedMessageDTO {
    return this.messages[this.messages.length-1];
  }
}
