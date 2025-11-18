import { IPayment, PaymentStatus } from '../model/payement.model.interface';
import { IBaseRepository } from './base.repository.interface';

export interface IPaymentRepository extends IBaseRepository<IPayment> {
    createPayment(data: Partial<IPayment>): Promise<IPayment>;
    findById(id: string): Promise<IPayment | null>;
    findByUserId(userId: string): Promise<IPayment[]>;
    findByWorkerId(workerId: string): Promise<IPayment[]>;
    findByBookingId(bookingId: string): Promise<IPayment[]>;
    updateStatus(id: string, status: PaymentStatus, paymentIntentId?: string): Promise<IPayment | null>;
    findLatestPayment(userId: string, bookingId?: string): Promise<IPayment | null>;
    deletePayment(id: string): Promise<IPayment | null>;
    findByIntentIdAndUpdateStatus(paymentIntentId: string, status: PaymentStatus): Promise<IPayment | null>;
}
