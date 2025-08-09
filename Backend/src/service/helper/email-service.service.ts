import nodemailer from "nodemailer";
import chalk from "chalk";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";

import { injectable } from "tsyringe";

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
  async sendResetEmail(
		to: string,
		subject: string,
		resetLink: string
	): Promise<void> {
		const mailOptions = {
			from: `"bookMyService" <${ENV.EMAIL_USER}>`,
			to,
			subject,
			html: PASSWORD_RESET_MAIL_CONTENT(resetLink),
		};
		await this.sendEmail(mailOptions.to,mailOptions.subject,mailOptions.html);
		console.log(
			chalk.bgYellowBright.bold(
				`🔁 Reset Password Link:`
			),
				chalk.cyanBright.bold(resetLink)
		);
	}

}
export const PASSWORD_RESET_MAIL_CONTENT = (
  resetLink: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #fff;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
          <span style="color: #FEBA43;">BookMyService</span>
      </h1>
   </div>

   <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FEBA43; font-size: 28px; margin: 0;">
         Password Reset Request 🔐
      </h2>
      <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">
         Don't worry, we'll help you get back in style! ✨
      </p>
   </div>

   <div style="border-radius: 15px; padding: 25px; margin-bottom: 25px; background: linear-gradient(to bottom, #fff, #fcfcfc);">
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
         We received a request to reset your password for your BookMyService account. 
         Your security is our top priority! 🛡️
      </p>
      
      <!-- Action Button Section -->
      <div style="border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
         <p style="margin-bottom: 20px; font-size: 16px; color: #444;">
            Click the button below to securely reset your password:
         </p>
         
         <a href="${resetLink}" 
            style="background-color: #FEBA43; color: white; padding: 16px 40px; 
                   text-decoration: none; border-radius: 8px; font-weight: 500; 
                   display: inline-block; margin: 10px 0; font-size: 16px; 
                   box-shadow: 0 2px 4px rgba(254, 186, 67, 0.2); transition: all 0.3s ease;
                   max-width: 100%;"
            onmouseover="this.style.backgroundColor='#E6A936'"
            onmouseout="this.style.backgroundColor='#FEBA43'"
            rel="noopener noreferrer"
         >
            Reset Password 🔐
         </a>

         <p style="color: #666; font-size: 14px; margin-top: 20px;">
            ⏰ For security, this link expires in 10 minutes
         </p>
      </div>
   </div>

   <div style="border-radius: 8px; padding: 20px; margin: 25px 0; background-color: #FFF8E1; box-shadow: 0 2px 8px rgba(254, 186, 67, 0.15);">
      <div style="text-align: left; margin-bottom: 15px; display: flex; align-items: center;">
         <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
         <h3 style="color: #B76E00; margin: 0; font-size: 18px;">Security Reminders</h3>
      </div>
      <ul style="list-style: none; padding: 0; margin: 0;">
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Never share this link with anyone
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> BookMyService will never ask for your password
         </li>
         <li style="font-size: 14px; color: #8B5800; margin: 8px 0; display: flex; align-items: center;">
            <span style="color: #FEBA43; margin-right: 8px;">•</span> Ensure you're on our official website before logging in
         </li>
      </ul>
   </div>

   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@bookMyService.in" style="color: #FEBA43; text-decoration: none;">support@bookMyService.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} BookMyService. All rights reserved.<br>
      <span style="color: #FEBA43;">✦</span> Your Style, Our Priority <span style="color: #FEBA43;">✦</span>
   </div>
</div>`;

export const SHOP_APPROVED_MAIL_CONTENT = (
  shopName: string
) => `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
   <!-- Logo Text Section -->
   <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 48px; font-weight: bold; margin: 0;">
         ✂️ <span style="color: #FEBA43;">BookMyService</span>
      </h1>
   </div>
   
   <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
      Your barbershop <strong>${shopName}</strong> has been successfully approved and is now live on the BookMyService platform! ✂️  
      You can start managing your appointments, attracting clients, and growing your business.
   </p>
   
   <div style="text-align: center; margin: 30px 0;">
      <a href="${ENV.FRONTEND_URI}/worker/dashboard" 
         style="background-color: #FEBA43; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
         Go to Dashboard
      </a>
   </div>
   
   <p style="font-size: 14px; color: #666;">
      📅 Keep your profile updated, add your available slots, and start receiving bookings today!
   </p>
   
   <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
      <p style="font-size: 14px; color: #888;">
         Need help? We're here for you! 💡<br>
         Contact us at <a href="mailto:support@bookMyService.in" style="color: #FEBA43; text-decoration: none;">support@bookMyService.in</a>
      </p>
   </div>

   <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} BookMyService. All rights reserved.
   </div>
</div>`;