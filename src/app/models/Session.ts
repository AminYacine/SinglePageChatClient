export class Session {
  public static id: number = -1;
  public static token: string = "";
  public static email: string = "";
  public static username:string = "";

  static resetSession() {
    this.id = -1;
    this.token = "";
    this.email = "";
    this.username = "";
  }
}
