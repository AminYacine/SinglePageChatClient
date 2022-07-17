export class UserRenamedInRoomDTO {
  email: string;
  roomName: string;
  name:string;

  constructor(email: string, roomName: string, name: string) {
    this.email = email;
    this.roomName = roomName;
    this.name = name;
  }

}
