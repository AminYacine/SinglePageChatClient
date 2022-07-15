import {ReceivedMessageDTO} from "./ReceivedMessageDTO";

export class ServerInfo extends ReceivedMessageDTO {
  constructor(message: string, roomName: string) {
    super("", message, roomName, "Info");
  }

}
