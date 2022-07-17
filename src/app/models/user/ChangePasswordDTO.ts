export class ChangePasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;

  constructor(email: string, oldPassword: string, newPassword: string) {
    this.email = email;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
