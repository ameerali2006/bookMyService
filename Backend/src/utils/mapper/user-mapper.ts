import { Address, ProfileDetails } from '../../dto/user/auth/profile.dto';
import { UserRegisterDTO, userResponse } from '../../dto/user/auth/user-register.dto';
import { IAddress } from '../../interface/model/address.model.interface';
import { IUser } from '../../interface/model/user.model.interface';

export class UserMapper {
  static toRegistrationModel(userDto: UserRegisterDTO): Partial<IUser> {
    return {
      googleId: userDto.googleId,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
    };
  }

  static resposeWorkerDto(user:IUser):userResponse {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user?.image,
    };
  }

  static responseuserProfileDetails(user:IUser):ProfileDetails {
    return {

      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user?.image,
    };
  }

  static toDTOAddress(address: IAddress): Address {
    return {
      _id: address._id?.toString() as string,
      label: address.label,
      street: address.street,
      buildingName: address.buildingName,
      area: address.area,
      city: address.city,
      state: address.state,
      country: address.country,
      pinCode: address.pinCode,
      landmark: address.landmark,
      phone: address.phone,
      isPrimary: address.isPrimary,
    };
  }

  static toDTOAddressList(addresses: IAddress[]): Address[] {
    return addresses.map((addr) => this.toDTOAddress(addr));
  }
}
