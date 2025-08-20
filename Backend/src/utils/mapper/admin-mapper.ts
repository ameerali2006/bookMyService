import { serviceManageDto, userManageDto, workerManageDto } from "../../dto/admin/management.dto";
import { IService } from "../../interface/model/service.model.interface";
import { IUser } from "../../interface/model/user.model.interface";
import { IWorker } from "../../interface/model/worker.model.interface";

export class AdminMapper {
  static resUserDetails(users: IUser[]): userManageDto[] {
    return users.map((user) => ({
        _id:user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
    }));
  }
    static resWorkersDetails(workers: IWorker[]): workerManageDto[] {
        return workers.map((w) => ({
            _id: w._id.toString(),
            name: w.name,
            email: w.email,
            phone: w.phone,
            isBlocked: w.isBlocked,
            isVerified: w.isVerified,
            category: w.category.toString(),
            experience: w.experience,
            profileImage: w?.profileImage||undefined,
            createdAt: w.createdAt
        }));
    }
    static resServiceDetails(services: IService[]): serviceManageDto[] {
        return services.map((w) => ({
            _id:String(w._id),
            category:w.category,
            description: w.description,
            price: w.price,
            priceUnit: w.priceUnit,
            duration: w.duration,
            image: w.image,
            
            status:w.status,
            createdAt: w.createdAt
        }));
    }
    
}