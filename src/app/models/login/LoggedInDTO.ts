export class LoggedInDTO {
  email: string;
  id: number;
  name: string;
  token: string;

  constructor(email: string, id: number, name: string, token: string) {
    this.id = id;
    this.email = email;
    this.token = token;
    this.name = name;
  }
}
