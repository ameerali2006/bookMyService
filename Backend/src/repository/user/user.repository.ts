import { IUserRepository } from "../../interface/repository/user.repository.interface";
import { UserModel, IUser, } from "../../model/user.model";
import {  injectable } from "inversify";
import { BaseRepository } from "../../repository/shared/base.repository";
@injectable()
export class UserRepository 
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }
  

}