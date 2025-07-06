import { IUser } from "../../model/user.model";
import { UserRegisterDTO } from "../../dto/user/auth/user-register.dto";


export class UserMapper {

  static toRegistrationModel(userDto: UserRegisterDTO): Partial<IUser> {
    return {
      googleId: userDto.googleId,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
    };
  }
}