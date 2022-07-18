export class InviteToRoomDTO {
  roomName: string;
  email: string;
  invite: boolean;

  constructor(roomName: string, email: string, invite: boolean) {
    this.roomName = roomName;
    this.email = email;
    this.invite = invite;
  }

}
