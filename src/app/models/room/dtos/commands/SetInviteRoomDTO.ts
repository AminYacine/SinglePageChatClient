export class SetInviteRoomDTO {
  roomName:string;
  inviteRequired: boolean;

  constructor(roomName: string, inviteRequired: boolean) {
    this.roomName = roomName;
    this.inviteRequired = inviteRequired;
  }

}
