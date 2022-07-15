export class JWTAuthDTO {
  constructor(token: string, email: string) {
    this.token = token;
    this.email = email;
  }
  token: string;
  email: string;
}
