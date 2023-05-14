import { UsersDatabase } from "../database/UsersDatabase";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dto/createUser.dto";
import { SignInInputDTO, SignInOutputDTO } from "../dto/signIn.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload } from "../types/TokenPayLoad";
import { USER_ROLE } from "../types/USER_ROLE";
import { UserDB } from "../types/UserDB";

export class UsersBusiness {
  constructor(
    private usersDatabase: UsersDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public createUser = async (
    input: CreateUserInputDTO
  ): Promise<CreateUserOutputDTO> => {
    const { name, email, password } = input;

    const id: string = this.idGenerator.generate();

    const role = USER_ROLE.NORMAL;

    const userExists = await this.usersDatabase.getUserById(id);

    if (userExists) {
      throw new BadRequestError("Usuário já cadastrado.");
    }

    const hashedPassword = await this.hashManager.hash(password)

    const user = new User(
      id,
      name,
      email,
      hashedPassword,
      role,
      new Date().toISOString()
    );

    const userDB: UserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
      created_at: user.getCreatedAt(),
    };

    await this.usersDatabase.createUser(userDB);

    const payload: TokenPayload = {
      id: userDB.id as string,
      name: userDB.name as string,
      role: userDB.role as USER_ROLE,
    };

    const token = this.tokenManager.createToken(payload);

    const output: CreateUserOutputDTO = {
      message: "Usuário cadastrado com sucesso.",
      token,
      user: {
        id: user.getId(),
        name: user.getName(),
        createdAt: user.getCreatedAt(),
      },
    };
    return output;
  };

  public signIn = async (input: SignInInputDTO): Promise<SignInOutputDTO> => {
    const { email, password } = input;
    const userExists: UserDB | undefined =
      await this.usersDatabase.getUserByEmail(email);


      console.log(password)
    if (!userExists) {
      throw new NotFoundError("Email não encontrado");
    }
    const isPasswordValid = await this.hashManager.compare(
      password,
      userExists.password
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Email ou senha incorreto(s)");
    }

    const payload: TokenPayload = {
      id: userExists.id as string,
      name: userExists.name as string,
      role: userExists.role as USER_ROLE,
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignInOutputDTO = {
      message: "Usuário efetuou o login com sucesso.",
      userName: payload.name,
      token,
    };
    return output;
  };
}
