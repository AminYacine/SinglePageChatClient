export class User {

  email: string;
  userName: string;
  oldUserName: string;

  constructor(email: string, userName: string) {
    this.email = email;
    this.userName = userName;
    this.oldUserName = "";
  }

  changeName(newName: string) {
    this.oldUserName = this.userName;
    this.userName = newName;
  }

}
