import resend from "../config/resend";
import { EmailParams } from "../types/email.types";

export const sendEmail = async ({ to, subject, text, html }: EmailParams) =>
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "delivered@resend.dev",
    subject,
    text,
    html,
  });
