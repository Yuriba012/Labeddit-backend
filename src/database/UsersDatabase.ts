import { UserDB } from "../types/UserDB";
import { BaseDatabase } from "./BaseDatabase";

export class UsersDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async getUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined = await BaseDatabase.connection(
      UsersDatabase.TABLE_USERS
    ).where({ id });
    return userDB;
  }

  public createUser = async (userDB: UserDB) => {
    await BaseDatabase.connection(UsersDatabase.TABLE_USERS).insert(userDB);
  };

  public getUserByEmail = async (email: string): Promise<UserDB|undefined> =>{
    const [userDB]: UserDB[]|undefined = await BaseDatabase.connection(UsersDatabase.TABLE_USERS).where({email});
    return userDB;
  }
}
