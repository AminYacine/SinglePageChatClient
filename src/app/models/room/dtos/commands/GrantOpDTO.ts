export class GrantOpDTO {
  roomName: string;
  email: string;
  op: string;

  constructor(roomName: string, email: string, op: string) {
    this.roomName = roomName;
    this.email = email;
    this.op = op;
  }
}
