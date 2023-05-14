import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { TokenPayload } from "../types/TokenPayLoad";

dotenv.config();

export class TokenManager{
    public createToken = (payLoad: TokenPayload): string => {
        const token = jwt.sign(payLoad, process.env.JWT_KEY as string, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        return token;
    }

    public getPayload = (token: string): TokenPayload | null => {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_KEY as string
            )

            return payload as TokenPayload
        
				} catch (error) {
            return null
        }
    }
}
