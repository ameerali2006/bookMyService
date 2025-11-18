// src/repository/implementation/payment.repository.ts
import { injectable } from 'inversify';

import { BaseRepository } from './base.repository';
import { IPayment, PaymentStatus } from '../../interface/model/payement.model.interface';
import { Payment } from '../../model/payement.model';
import { IPaymentRepository } from '../../interface/repository/payment.repository.interface';

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }

  async createPayment(data: Partial<IPayment>): Promise<IPayment> {
    return await Payment.create(data);
  }

  async findById(id: string): Promise<IPayment | null> {
    return await Payment.findById(id)
      .populate('userId', 'name email phone')
      .populate('workerId', 'name email phone category')
      .populate('bookingId')
      .exec();
  }

  async findByUserId(userId: string): Promise<IPayment[]> {
    return await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .populate('workerId', 'name email category')
      .populate('bookingId')
      .exec();
  }

  async findByWorkerId(workerId: string): Promise<IPayment[]> {
    return await Payment.find({ workerId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
      .populate('bookingId')
      .exec();
  }

  async findByBookingId(bookingId: string): Promise<IPayment[]> {
    return await Payment.find({ bookingId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone')
      .populate('workerId', 'name email category')
      .exec();
  }

  async updateStatus(id: string, status: PaymentStatus, paymentIntentId?: string): Promise<IPayment | null> {
    return await Payment.findByIdAndUpdate(
      id,
      { status, paymentIntentId },
      { new: true },
    );
  }

  async findLatestPayment(userId: string, bookingId?: string): Promise<IPayment | null> {
    const query: any = { userId };
    if (bookingId) query.bookingId = bookingId;

    return await Payment.findOne(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async deletePayment(id: string): Promise<IPayment | null> {
    return await Payment.findByIdAndDelete(id);
  }

  async findByIntentIdAndUpdateStatus(paymentIntentId: string, status: PaymentStatus): Promise<IPayment | null> {
    return await Payment.findOneAndUpdate(
      { paymentIntentId },
      { status },
      { new: true },
    );
  }
}
