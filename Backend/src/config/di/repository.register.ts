import { container } from 'tsyringe';

import { IUserRepository } from '../../interface/repository/user.repository.interface';
import { UserRepository } from '../../repository/user/user.repository';
import { TYPES } from '../../config/constants/types';
import { OtpRepository } from '../../repository/shared/otp-repository.reposiory';
import { IOtpRepository } from '../../interface/repository/otp.repository.interface';
import { IAdminRepository } from '../../interface/repository/admin.repository.interface';
import { AdminRepository } from '../../repository/admin/admin.repository';
import { IRedisTokenRepository } from '../../interface/repository/redis/redis.repository.interface';
import { RedisTokenRepository } from '../../repository/shared/redis.repository';
import { RefreshTokenRepository } from '../../repository/shared/refresh-token.repository';
import { IRefreshTokenRepository } from '../../interface/repository/refresh-token.repository.interface';
import { IWorkerRepository } from '../../interface/repository/worker.repository.interface';
import { WorkerRepository } from '../../repository/worker/worker.repository';
import { IServiceRepository } from '../../interface/repository/service.repository.interface';
import { ServiceRepository } from '../../repository/helper/service.repository';
import { IWorkingDetailsRepository } from '../../interface/repository/working-details.interface';
import { WorkingDetailsRepository } from '../../repository/shared/working-details.repository';
import { IWorkerAggregation } from '../../interface/repository/workerAggregation.repository.interface';
import { WorkerAggregation } from '../../repository/worker/workerAggregation.repository';
import { IBookingRepository } from '../../interface/repository/booking.repository.interface';
import { BookingRepository } from '../../repository/shared/booking-details.repository';
import { IPaymentRepository } from '../../interface/repository/payment.repository.interface';
import { PaymentRepository } from '../../repository/shared/payment.repository';

export class RepositoryRegistery {
  static registerRepository():void {
    container.register<IUserRepository>(TYPES.AuthUserRepository, { useClass: UserRepository });
    container.register<IOtpRepository>(TYPES.OtpRepository, { useClass: OtpRepository });
    container.register<IAdminRepository>(TYPES.AdminRepository, { useClass: AdminRepository });
    container.register<IWorkerRepository>(TYPES.WorkerRepository, { useClass: WorkerRepository });
    container.register<IRedisTokenRepository>(TYPES.RedisTokenRepository, { useClass: RedisTokenRepository });
    container.register<IRefreshTokenRepository>(TYPES.RefreshTokenRepository, { useClass: RefreshTokenRepository });
    container.register<IServiceRepository>(TYPES.ServiceRepository, { useClass: ServiceRepository });
    container.register<IWorkingDetailsRepository>(TYPES.WorkingDetailsRepository, { useClass: WorkingDetailsRepository });
    container.register<IWorkerAggregation>(TYPES.WorkerAggregation, { useClass: WorkerAggregation });
    container.register<IBookingRepository>(TYPES.BookingRepository, { useClass: BookingRepository });
    container.register<IPaymentRepository>(TYPES.PaymentRepository, { useClass: PaymentRepository });
  }
}
