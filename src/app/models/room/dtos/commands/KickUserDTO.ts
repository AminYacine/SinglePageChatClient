export class KickUserDTO {
  roomName: string;
  email: string;

  constructor(roomName: string, email: string) {
    this.roomName = roomName;
    this.email = email;
  }
}
