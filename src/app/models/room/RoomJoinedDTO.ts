export class RoomJoinedDTO {
  email: string;
  name: string;
  roomName: string;

  constructor(email: string, name: string, roomName: string) {
    this.email = email;
    this.name = name;
    this.roomName = roomName;
  }

}
