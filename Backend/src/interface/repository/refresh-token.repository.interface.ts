


import { IRefreshTokenEntity } from "../../interface/model/refresh-token.model.interface";
import { IBaseRepository } from "./base.repository.interface";

export interface IRefreshTokenRepository
	extends IBaseRepository<IRefreshTokenEntity> {
	revokeRefreshToken(token: string): Promise<void>;
}
 