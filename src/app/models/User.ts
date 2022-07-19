export class User {

  email: string;
  userName: string;
  oldUserName: string;
  isOp: boolean;
  hasVoice: boolean;
  private _hasLeft: boolean;

  constructor(email: string, userName: string) {
    this.email = email;
    this.userName = userName;
    this.oldUserName = "";
    this.isOp = false;
    this.hasVoice = false;
    this._hasLeft = false;
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

  get hasLeft(): boolean {
    return this._hasLeft;
  }

  setHasLeft(value: boolean) {
    this._hasLeft = value;
  }
}
