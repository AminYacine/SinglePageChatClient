export class User {

  email: string;
  userName: string;
  oldUserName: string;

  constructor(email: string, userName: string) {
    this.email = email;
    this.userName = userName;
    this.oldUserName = "";
  }

}
