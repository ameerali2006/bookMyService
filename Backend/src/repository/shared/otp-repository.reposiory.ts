import { injectable } from "inversify";
import { IOtpRepository } from "../../interface/repository/otp.repository.interface";
import OtpModel, { IOtp } from "../../model/otp.model";
import { BaseRepository } from "./base.repository";
@injectable()
export class OtpRepository  extends BaseRepository<IOtp> implements IOtpRepository {
    constructor() {
      super(OtpModel);
    }
  async findOtp(email:string):Promise<IOtp | null>{
    return await OtpModel.findOne({email}).sort({createdAt:-1}).exec()
  }
}