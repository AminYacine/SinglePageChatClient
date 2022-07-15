export class Session {
  public id: number = -1;
  public token: string = "";
  public email: string = "";
  public username: string = "";


  resetSession() {
    this.id = -1;
    this.token = "";
    this.email = "";
    this.username = "";
  }

  constructor(id: number, token: string, email: string, username: string) {
    this.id = id;
    this.token = token;
    this.email = email;
    this.username = username;
  }
}
