import { EMAIL_SENDER, NODE_ENV } from "../config/envConfig";
import resend from "../config/resend";
import { EmailParams } from "../types/email.types";

const senderEmail =
  NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const toEmail = (to: string) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : to;

export const sendEmail = async ({ to, subject, text, html }: EmailParams) =>
  await resend.emails.send({
    from: senderEmail,
    to: toEmail(to),
    subject,
    text,
    html,
  });
