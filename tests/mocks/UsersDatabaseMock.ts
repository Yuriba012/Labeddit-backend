import { UserDB } from "../../src/types/UserDB";
import { USER_ROLE } from "../../src/types/USER_ROLE";
import { BaseDatabase } from "../../src/database/BaseDatabase";

export const usersMock = [
  {
    id: "u001",
    name: "user1",
    email: "user1@email.com",
    password: "hash-mock-user1", // senha = "user1password"
    role: USER_ROLE.NORMAL,
    created_at: new Date().toISOString()
  },
  {
    id: "u002",
    name: "user2",
    email: "user2@email.com",
    password: "hash-mock-user2", // senha = "user2password"
    role: USER_ROLE.ADMIN,
    created_at: new Date().toISOString()
  },
  {
    id: "u003",
    name: "user3",
    email: "user3@email.com",
    password: "hash-mock-user3", // senha = "user3password"
    role: USER_ROLE.NORMAL,
    created_at: new Date().toISOString()
  }
]


export class UsersDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async getUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined = usersMock.filter((user)=>user.id === id)
    return userDB;
  }

  public createUser = async (userDB: UserDB): Promise<void> => {
    
  };

  public getUserByEmail = async (email: string): Promise<UserDB|undefined> =>{
    const [userDB]: UserDB[] | undefined = usersMock.filter((user)=>user.email === email)
    return userDB;
  }
}
