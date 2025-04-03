import nodemailer from "nodemailer";
import pug from "pug";
import { IUser } from "../types";
import path from 'path';

class Email {
  private to: string;
  private name: string;
  private from: string;

  constructor(
    user: IUser,
    // eslint-disable-next-line no-unused-vars
    private url?: string,
  ) {
    this.to = user.email;
    this.name = user.name;
    this.from = `Your App <${process.env.EMAIL_FROM}>`;
  }

  // 1. Create transport
  private newTransport() {
    if (process.env.NODE_ENV === "production") {
      // For production (e.g., SendGrid)
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // For development (Mailtrap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // 2. Send the actual email
  private async send(template: string, subject: string, templateVars?: Record<string, any>) {
    // Render HTML from Pug template
    const html = pug.renderFile(
      path.join(__dirname, `../views/email/${template}.pug`),
      {
        name: this.name,
        url: this.url,
        appName: "Furniture Picker", // Default app name
        expiresIn: 10, // Default expiration in minutes
        ...templateVars // Allow custom variables to override defaults
      }
    );

    // Mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, ""), // Fallback text version
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // 3. Welcome email method
  async sendWelcome() {
    await this.send("welcome", "Welcome to Our App!");
  }

  async sendPasswordReset() {
    await this.send("resetPassword",
      "Your password reset token (valid for 10 minutes)",
      {
        resetURL: this.url,
        // You can add additional template variables here
        // logo: "https://yourdomain.com/logo.png"
      });
  }
}

export default Email;
