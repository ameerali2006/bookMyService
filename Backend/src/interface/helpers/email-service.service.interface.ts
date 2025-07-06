import { IUser } from "../../model/user.model";

export interface IEmailService {
  sendEmail(toEmail: string, subject: string, content: string): Promise<void>;
  generateOtpEmailContent(otp: number): string;
  generateResetPasswordEmailContent(resetLink: string): string;
  
}
