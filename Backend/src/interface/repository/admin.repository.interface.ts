import { IAdmin } from "../../model/admin.model";
import { IBaseRepository } from "./base.repository.interface";
export interface IAdminRepository  extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}
 