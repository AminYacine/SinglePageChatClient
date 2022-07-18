export class SetVoiceRoomDTO {

  roomName: string;
  voice: boolean;

  constructor(roomName: string, voice: boolean) {
    this.roomName = roomName;
    this.voice = voice;
  }
}
