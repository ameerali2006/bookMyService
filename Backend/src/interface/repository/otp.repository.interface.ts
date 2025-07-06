import { IOtp } from "../../model/otp.model";

import { IBaseRepository } from "./base.repository.interface";
export interface IOtpRepository extends IBaseRepository<IOtp> {
  
  findOtp(email: string): Promise<IOtp |null >;
}
   