import { Document, Schema } from "mongoose";

export interface IBreak {
  label: string;
  breakStart: Date;
  breakEnd: Date;
}
export enum WeekDay {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export interface IDaySchedule {
  day: WeekDay;
  enabled: boolean;
  startTime: Date;
  endTime: Date;
  breaks: IBreak[];
}

export interface IHoliday {
  date: Date;
  reason?: string;
}

export interface ICustomSlot {
  date: Date;
  startTime: Date;
  endTime: Date;
}

export interface IWorkingDetails extends Document {
  workerId: Schema.Types.ObjectId;
  status: "active" | "inactive" | "paused";
  maxAppointmentsPerDay?: number;
  breakEnforced: boolean;
  weekStartDay: WeekDay;
  defaultSlotDuration: number;
  autoAcceptBookings: boolean;
  notes?: string;
  days: IDaySchedule[];
  holidays: IHoliday[];
  customSlots: ICustomSlot[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IWorkingDetailsDocument extends IWorkingDetails, Document {}