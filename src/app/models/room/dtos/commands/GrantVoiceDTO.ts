export class GrantVoiceDTO {
  roomName: string;
  email: string;
  voice: boolean;

  constructor(roomName: string, email: string, voice: boolean) {
    this.roomName = roomName;
    this.email = email;
    this.voice = voice;
  }

}
