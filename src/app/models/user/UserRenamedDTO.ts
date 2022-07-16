export class UserRenamedDTO {
  email: string;
  id: number;
  name:string;

  constructor(email: string, id: number, name: string) {
    this.email = email;
    this.id = id;
    this.name = name;
  }

}
