import { responseDto } from '../../dto/worker/auth/worker-register.dto';
import { ServiceRequest, WorkerProfileDTO } from '../../dto/worker/workingDetails.dto';
import { IBookingPopulated } from '../../interface/model/booking.model.interface';
import { IWorker } from '../../interface/model/worker.model.interface';
import { WorkerModel } from '../../model/worker.model';

export class WorkerMapper {
  static responseWorkerDto(worker:IWorker):responseDto {
    return {
      _id: worker._id.toString(),
      name: worker.name,
      email: worker.email,
      image: worker?.profileImage,
      location:{
        lat:worker.location.coordinates[1],
        lng:worker.location.coordinates[0],
        address:worker.zone,
      }
    };
  }

  static serviceRequest(booking:IBookingPopulated):ServiceRequest {
    return {
      userName: booking.userId?.name ?? 'Unknown',
      serviceName: booking.serviceId?.category ?? 'Unknown',
      date: booking.date?.toDateString() ?? '',
      id: booking._id?.toString() ?? '',
      location: booking?.address?.city ?? 'Unknown',
      notes: booking?.description ?? '',
      phone: booking.userId?.phone ?? '',
      status: booking.workerResponse ?? 'pending',
      time: booking.startTime ?? '',
      userLocation: {
        lat: booking?.address?.location?.coordinates?.[1] ?? 0,
        lng: booking?.address?.location?.coordinates?.[0] ?? 0,
      },

    };
  }
  static mapServiceRequest(booking:IBookingPopulated[]):ServiceRequest[] {
    return booking.map(b=>this.serviceRequest(b))
  }

  static mapWorkerToProfileDTO = (worker: IWorker): WorkerProfileDTO => ({
    id: worker._id?.toString(),
    name: worker.name,
    email: worker.email,
    phone: worker.phone || '',
    profileImage: worker.profileImage || '',
    experience: worker.experience,
    zone: worker.zone,
    category: typeof worker.category === 'object'
      ? (worker.category as any)?.category || ''
      : worker.category || '',
    fees: worker.fees,
    isActive: worker.isActive,
    isVerified: worker.isVerified,
    location: {
      lat: worker.location?.coordinates[1] || 0,
      lng: worker.location?.coordinates[0] || 0,
    },
    documents: worker.documents || '',
  });
}
