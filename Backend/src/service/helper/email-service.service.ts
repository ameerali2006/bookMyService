import nodemailer, { Transporter } from "nodemailer";
import chalk from "chalk";
import { IEmailService } from "../../interface/helpers/email-service.service.interface";

import { injectable } from "tsyringe";
import { VERIFICATION_MAIL_CONTENT, PASSWORD_RESET_MAIL_CONTENT, SENT_REJECTION_EMAIL, GOOGLE_REGISTRATION_MAIL_CONTENT } from "../../config/constants/email";
import {ENV} from '../../config/env/env'


@injectable()
export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    // verify transporter at startup
    this.transporter.verify((error) => {
      if (error) {
        console.error(
          chalk.redBright("❌ Email transporter verification failed:"),
          error
        );
      } else {
        console.log(chalk.greenBright("✅ Email transporter ready to send emails."));
      }
    });
  }

  /** Generic email sender (interface-required) */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `"bookMyService" <${ENV.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    await this._sendMail(mailOptions);
  }

  /** OTP email generator (interface-required) */
  generateOtpEmailContent(otp: string): string {
    return VERIFICATION_MAIL_CONTENT(otp);
  }

  async sendOtpEmail(to: string, subject: string, otp: string): Promise<void> {
    const html = this.generateOtpEmailContent(otp);
    await this.sendEmail(to, subject, html);
  }

  async sendResetEmail(
    to: string,
    subject: string,
    resetLink: string
  ): Promise<void> {
    const html = PASSWORD_RESET_MAIL_CONTENT(resetLink);
    await this.sendEmail(to, subject, html);
    console.log(
      chalk.bgYellowBright.bold(`🔁 Reset Password Link:`),
      chalk.cyanBright.bold(resetLink)
    );
  }

  async sendRejectionEmail(
    to: string,
    reason: string,
    retryUrl: string,
    entityLabel: string
  ): Promise<void> {
    const subject = `${entityLabel} Application Rejected - bookMyService`;
    const html = SENT_REJECTION_EMAIL(entityLabel, reason, retryUrl);
    await this.sendEmail(to, subject, html);
    console.log(
      chalk.bgRedBright.bold(`❌ Rejection Email Sent:`),
      chalk.yellowBright(`${entityLabel} - ${to}`)
    );
  }

  async sendGoogleRegistrationEmail(
    to: string,
    fullName: string,
    tempPassword: string
  ): Promise<void> {
    const subject = `Welcome to bookMyService 🎉`;
    const html = GOOGLE_REGISTRATION_MAIL_CONTENT(fullName, tempPassword);
    await this.sendEmail(to, subject, html);
  }

  /** private helper */
  private async _sendMail(mailOptions: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    const info = await this.transporter.sendMail(mailOptions);
    console.log(chalk.bgGreenBright.bold(`📧 Email sent:`), info.response);
  }
}
