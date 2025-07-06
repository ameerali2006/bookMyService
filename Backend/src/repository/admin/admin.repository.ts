
import { injectable } from "tsyringe";
import { IAdminRepository } from "../../interface/repository/admin.repository.interface";
import AdminModel, { IAdmin } from "../../model/admin.model";
import { BaseRepository } from "../shared/base.repository";

@injectable()
export class AdminRepository  extends BaseRepository<IAdmin> implements IAdminRepository {
   constructor() {
      super(AdminModel);
    }
  async findByEmail(email: string): Promise<IAdmin | null> {
    return await AdminModel.findOne({ email });
  }
 
}
