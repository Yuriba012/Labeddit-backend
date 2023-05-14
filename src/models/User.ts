import { USER_ROLE } from "../types/USER_ROLE";

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLE,
    private createdAt: string
  ) {}
  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }
  public getRole(): USER_ROLE {
    return this.role;
  }
  public getCreatedAt():string{
    return this.createdAt;
  }
  public setId(newId: string): void {
    this.id = newId;
  }
  public setName(newName: string): void {
    this.name = newName;
  }
  public setEmail(newEmail: string): void {
    this.email = newEmail;
  }
  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }
  public setRole(newRole: USER_ROLE): void {
    this.role = newRole;
  }
}
