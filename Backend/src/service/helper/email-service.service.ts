import nodemailer from "nodemailer";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";

import { injectable } from "tsyringe";
import { IUser } from "../../model/user.model";
import {ENV} from '../../config/env/env'


@injectable()
export class EmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: ENV.EMAIL_USER as string,
      pass: ENV.EMAIL_PASS as string,
    },
  });
  async sendEmail(toEmail: string, subject: string, content: string): Promise<void> {
     try {
       const mailOptions = {
          from: ENV.EMAIL_USER as string,
          to: toEmail,
          subject,
          html: content,
        };

        await this.transporter.sendMail(mailOptions);
     } catch (error) {
      console.error(error)
      
     }
  }
  generateOtpEmailContent(otp: string): string {
    return `
            <body style="margin: 0; padding: 0; background-color: #fff; font-family: 'Arial', sans-serif; color: #000;">
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #fff; padding: 20px 0;">
            <tr>
            <td align="center">
                <table width="600" cellspacing="0" cellpadding="0" style="background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1); border: 1px solid #000;">
                <!-- Title -->
                <tr>
                    <td align="center" style="font-size: 22px; font-weight: bold; padding-bottom: 10px; color: #000;">
                    Verify Your Email
                    </td>
                </tr>
                <!-- Message -->
                <tr>
                    <td align="center" style="font-size: 16px; line-height: 1.5; padding-bottom: 20px; color: #333;">
                    Welcome to <strong style="color: #000;">bookMyService</strong>! To complete your registration, use the OTP below:
                    </td>
                </tr>
                <!-- OTP Code -->
                <tr>
                    <td align="center">
                    <div style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; 
                                color: #fff; background-color: #000; border-radius: 8px; letter-spacing: 3px;">
                        ${otp}
                    </div>
                    </td>
                </tr>

                <!-- Expiration & Warning -->
                <tr>
                    <td align="center" style="font-size: 14px; padding-top: 20px; color: #333;">
                    This OTP is valid for <strong style="color: #000;">2 minutes</strong>. Please do not share it with anyone.
                    </td>
                </tr>
                <!-- Support -->
                <tr>
                    <td align="center" style="font-size: 14px; padding-top: 20px; color: #555;">
                    If you did not request this, ignore this email. <br>For assistance, contact 
                    <a href="mailto:support@quicfin.com" style="color: #000; text-decoration: none; border-bottom: 1px solid #000;">support@bookmyservice.com</a>.
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
            `;      
  }
  generateResetPasswordEmailContent(resetLink: string): string {
    return ''
      
  }

}