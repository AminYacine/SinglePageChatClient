export class User {

  email: string;
  userName: string;
  oldUserName: string;
  isOp: boolean;
  hasVoice: boolean;

  constructor(email: string, userName: string) {
    this.email = email;
    this.userName = userName;
    this.oldUserName = "";
    this.isOp = false;
    this.hasVoice = false;
  }

  changeName(newName: string) {
    this.oldUserName = this.userName;
    this.userName = newName;
  }

  setIsOp(op: boolean) {
    this.isOp = op;
  }

  setHasVoice(voice: boolean) {
    this.hasVoice = voice;
  }
}
