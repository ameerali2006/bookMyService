


import { IRefreshTokenEntity } from "../../model/refresh-token.model";
import { IBaseRepository } from "./base.repository.interface";

export interface IRefreshTokenRepository
	extends IBaseRepository<IRefreshTokenEntity> {
	revokeRefreshToken(token: string): Promise<void>;
}
 