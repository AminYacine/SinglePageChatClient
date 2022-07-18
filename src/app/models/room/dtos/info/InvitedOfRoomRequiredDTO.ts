export class InvitedOfRoomRequiredDTO {
  roomName: string;
  invitedRequired: boolean;

  constructor(roomName: string, invitedRequired: boolean) {
    this.roomName = roomName;
    this.invitedRequired = invitedRequired;
  }

}
