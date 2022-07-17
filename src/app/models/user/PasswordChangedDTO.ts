export class PasswordChangedDTO {
  email: string;
  id: number;
  newSha1PWHash: {
    hash: string;
  };

  constructor(email: string, id: number, newSha1PWHash: { hash: string }) {
    this.email = email;
    this.id = id;
    this.newSha1PWHash = newSha1PWHash;
  }

}
