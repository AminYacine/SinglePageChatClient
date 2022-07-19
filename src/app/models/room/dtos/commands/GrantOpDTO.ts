export class GrantOpDTO {
  roomName: string;
  email: string;
  op: boolean;

  constructor(roomName: string, email: string, op: boolean) {
    this.roomName = roomName;
    this.email = email;
    this.op = op;
  }
}
