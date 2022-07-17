export class UserRegisteredDTO {
  id: number;
  email: string;
  name: string;
  sha1PWHash: string;

  constructor(id: number, email: string, name: string, sha1PWHash: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.sha1PWHash = sha1PWHash;
  }
}
