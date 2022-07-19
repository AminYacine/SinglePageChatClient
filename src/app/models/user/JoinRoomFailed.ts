export class JoinRoomFailed {
  id: number;
  email: string;
  roomName: string;

  constructor(id: number, email: string, roomName: string) {
    this.id = id;
    this.email = email;
    this.roomName = roomName;
  }
}
