export class OpGrantedDTO {
  email: string;
  op: boolean;
  roomName: string;

  constructor(email: string, op: boolean, roomName: string) {
    this.email = email;
    this.op = op;
    this.roomName = roomName;
  }
}
