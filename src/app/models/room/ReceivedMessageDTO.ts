export class ReceivedMessageDTO {
  email : string;
  message : string;
  roomName : string;
  userName : string;

  constructor(email: string, message: string, roomName: string, userName: string) {
    this.email = email;
    this.message = message;
    this.roomName = roomName;
    this.userName = userName;
  }
}
