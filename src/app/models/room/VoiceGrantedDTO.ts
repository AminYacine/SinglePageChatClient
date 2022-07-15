export class VoiceGrantedDTO {
  email: string;
  roomName: string;
  voice: boolean;

  constructor(email: string, roomName: string, voice: boolean) {
    this.email = email;
    this.roomName = roomName;
    this.voice = voice;
  }
}
