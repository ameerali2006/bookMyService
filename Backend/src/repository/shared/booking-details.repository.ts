// src/repository/implementation/booking.repository.ts
import { injectable } from 'inversify';
import { IBookingRepository } from '../../interface/repository/booking.repository.interface';
import { IBooking, IBookingPopulated } from '../../interface/model/booking.model.interface';
import { BaseRepository } from './base.repository';
import { Booking } from '../../model/booking.model';
import { PaymentStatus } from '../../interface/model/payement.model.interface';
import { IRequestFilters } from '../../interface/service/worker/worker-booking.service.interface';

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    return await Booking.create(data);
  }

  async findByIdPopulated(id: string): Promise<IBookingPopulated | null> {
    const result = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('workerId', 'name email phone category')
      .populate('serviceId', 'category price')
      .populate('address')
      .exec();

    return result as unknown as IBookingPopulated | null;
  }


  async findByUserId(userId: string): Promise<IBookingPopulated[]> {
    const result = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate('workerId', 'name category')
      .populate('serviceId', 'category price')
      .populate('address')
      .exec();

    return result as unknown as IBookingPopulated[];
  }


  async findByWorkerId(workerId: string): Promise<IBookingPopulated[]> {
    const result = await Booking.find({ workerId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
      .populate('serviceId', 'category price')
      .populate('address')
      .exec();

    return result as unknown as IBookingPopulated[];
  }


  async updateStatus(id: string, status: string): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateWorkerResponse(
    id: string,
    response: string,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      id,
      { workerResponse: response },
      { new: true },
    );
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
    paymentId?: string,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      id,
      { paymentStatus, paymentId },
      { new: true },
    );
  }

  async addRating(
    id: string,
    score: number,
    review?: string,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      id,
      { rating: { score, review }, status: 'completed' },
      { new: true },
    );
  }

  async cancelBooking(id: string): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true },
    );
  }

  async findByWorkerAndDate(workerId: string, date: Date): Promise<IBooking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Booking.find({
      workerId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    })
      .select('startTime endTime date status')
      .lean();
  }

  async findBookingWithinTimeRange(
    workerId: string,
    date: Date,
    startTime: Date,
    endTime: Date,
  ): Promise<IBooking | null> {
    return await Booking.findOne({
      workerId,
      date: {
        $eq: new Date(new Date(date).toDateString()),
      },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $nin: ['cancelled', 'completed'] },
    });
  }

  async findByIdWithDetails(id: string): Promise<IBooking | null> {
    return await Booking.findById(id)
      .populate('workerId', 'name')
      .populate('serviceId', 'category')
      .populate('userId', 'name');
  }

  async findByWorkerAndRange(
    workerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      date: Date;
      startTime: string;
      endTime?: string | null;
      advancePaymentStatus?: 'unpaid' | 'paid' | 'failed' | 'refunded';
    }>
  > {
    return Booking.find(
      {
        workerId,
        date: { $gte: startDate, $lt: endDate },
        status: { $ne: 'cancelled' },
      },
      {
        date: 1,
        startTime: 1,
        endTime: 1,
        advancePaymentStatus: 1,
        _id: 0,
      },
    )
      .sort({ date: 1, startTime: 1 })
      .lean();
  }

  async updateAdvancePaymentStatus(
    bookingId: string,
    paymentIntentId: string,
    status: PaymentStatus,
    addressId:string,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(bookingId, {
      advancePaymentId: paymentIntentId,
      advancePaymentStatus: status === 'succeeded' ? 'paid' : status,
      status: status === 'succeeded' ? 'awaiting-final-payment' : 'pending',
      address:addressId
    });
  }

  async updateFinalPaymentStatus(
    bookingId: string,
    paymentIntentId: string,
    status: PaymentStatus,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(bookingId, {
      finalPaymentId: paymentIntentId,
      finalPaymentStatus: status === 'succeeded' ? 'paid' : status,
      status: status === 'succeeded' ? 'completed' : 'awaiting-final-payment',
    });
  }

  async findPendingAdvanceBookings(workerId: string): Promise<IBooking[]> {
    return await Booking.find({
      workerId,
      advancePaymentStatus: 'succeeded',
      workerResponse: 'pending',
    }).populate('userId serviceId workerId');
  }
  async findServiceRequests(
    filters: IRequestFilters
  ): Promise<{ data: IBookingPopulated[], total: number }> {
    const { workerId, search, status, date, page, limit } = filters;

    const query: Record<string, unknown> = { workerId };

    if (status) query.workerResponse = status;
    if (date) query.date = date;

    if (search) {
      query.$or = [
        
        { "userId.name": { $regex: search, $options: "i" } },
        
      ];
    }

    const skip = (page - 1) * limit;

    const booking = await Booking.find(query)
      .populate("userId", "name phone location")
      .populate("serviceId", "name")
      .populate("workerId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IBookingPopulated[]>() 
      .exec();

    const total = await Booking.countDocuments(query);

    return { data:booking, total };
  }
  
  
}
