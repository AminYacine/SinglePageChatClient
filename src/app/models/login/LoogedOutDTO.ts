export class LoggedOutDTO {
  email: string;
  id: number;

  constructor(email: string, id: number) {
    this.email = email;
    this.id = id;
  }

}
