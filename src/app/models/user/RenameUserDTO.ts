export class RenameUserDTO {
  email: string;
  userName: string;

  constructor(email: string, userName: string) {
    this.email = email;
    this.userName = userName;
  }

}
