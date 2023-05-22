import { USER_ROLE } from "../../src/types/USER_ROLE";
import { TokenPayload } from "../../src/types/TokenPayLoad";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      // signup de nova conta
      return "token-mock";
    } else if (payload.id === "u001") {
      // login de user1 (conta normal)
      return "token-mock-user1";
    } else if (payload.id === "u002") {
      // login de user2 (conta admin)
      return "token-mock-user2";
    } else {
      // login de user3 (conta normal)
      return "token-mock-user3";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-user1") {
      return {
        id: "u001",
        name: "user1",
        role: USER_ROLE.NORMAL,
      };
    } else if (token === "token-mock-user2") {
      return {
        id: "u002",
        name: "user2",
        role: USER_ROLE.ADMIN,
      };
    } else if (token === "token-mock-user3") {
      return {
        id: "u002",
        name: "user2",
        role: USER_ROLE.NORMAL,
      };
    } else {
      return null;
    }
  };
}
