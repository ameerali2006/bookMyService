import { AddAddressDto, Address, ProfileDetails } from '../../../dto/user/auth/profile.dto';
import { IAddress } from '../../model/address.model.interface';

export interface IProfileManagement{
    updateUserProfileDetails(user:Partial<ProfileDetails>, userId:string):Promise<{success:boolean, message:string, user:ProfileDetails|null}>
    getUserProfileDetails(userId:string):Promise<{success:boolean, message:string, user:ProfileDetails|null}>
    getUserAddress(userId:string):Promise<{success:boolean, message:string, addresses:Address[]|null}>
    addUserAddress(userId:string, data:AddAddressDto):Promise<{success:boolean, message:string, address:Address|null}>
    setPrimaryAddress(userId:string, setId:string):Promise<{success:boolean, message:string}>
}
