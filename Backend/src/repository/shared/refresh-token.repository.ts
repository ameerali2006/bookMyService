import {injectable} from 'tsyringe';
import {BaseRepository} from "./base.repository"
import {
	IRefreshTokenModel,
	RefreshTokenModel,
} from "../../model/refresh-token.model";

import { IRefreshTokenRepository } from '../../interface/repository/refresh-token.repository.interface';

@injectable() 
export class RefreshTokenRepository extends BaseRepository<IRefreshTokenModel> implements IRefreshTokenRepository{
    constructor(){
        super(RefreshTokenModel)
    }
    async revokeRefreshToken(token: string): Promise<void> {
        await RefreshTokenModel.deleteOne({token})
    }
}