import { decodeToken, JwtPayload } from "../Users/users.services.js";


export async function tryAuthorizeWithJwtBearer(token: string): Promise<JwtPayload | undefined> {
	return decodeToken(token);
}