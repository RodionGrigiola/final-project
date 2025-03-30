import nodemailer from "nodemailer";
import pug from "pug";
import { IUser } from "../types";

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
  private async send(template: string, subject: string) {
    // Render HTML from Pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      name: this.name,
      url: this.url,
    });

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
}

export default Email;
