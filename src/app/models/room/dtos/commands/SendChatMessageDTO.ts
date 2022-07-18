export class SendChatMessageDTO {
  roomName: string;
  message: string

  constructor(roomName: string, message: string) {
    this.roomName = roomName;
    this.message = message;
  }
}
