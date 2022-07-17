export class RenameUserDTO {
  email: string;
  userName: string;
  roomName: string;

  constructor(email: string, userName: string, roomName: string) {
    this.email = email;
    this.userName = userName;
    this.roomName = roomName;
  }

}
