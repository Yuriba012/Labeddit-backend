import { USER_ROLE } from "./USER_ROLE";

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLE;
}
