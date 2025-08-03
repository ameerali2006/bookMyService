
import { UserRegisterDTO, userResponse } from "../../dto/user/auth/user-register.dto";
import { IUser } from "../../interface/model/user.model.interface";


export class UserMapper {

  static toRegistrationModel(userDto: UserRegisterDTO): Partial<IUser> {
    return {
      googleId: userDto.googleId,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
    };
  }
  static resposeWorkerDto(user:IUser):userResponse{
    return {
      name:user.name,
      email:user.email,
      image:user?.image
    }
  }
}