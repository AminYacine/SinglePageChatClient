export class VoiceInRoomRequiredDTO {
  roomName: string;
  voice: boolean;

  constructor(roomName: string, voice: boolean) {
    this.roomName = roomName;
    this.voice = voice;
  }
}
