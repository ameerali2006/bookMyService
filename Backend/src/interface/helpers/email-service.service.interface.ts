import { IUser } from "../../interface/model/user.model.interface";

export interface IEmailService {
  sendEmail(toEmail: string, subject: string, content: string): Promise<void>;
  generateOtpEmailContent(otp: string): string;
  generateResetPasswordEmailContent(resetLink: string): string;
  
}
