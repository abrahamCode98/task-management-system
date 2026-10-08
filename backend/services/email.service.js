import { Resend } from "resend";

let resend;

const getResend = () => {
  if (resend) {
    return resend;
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing email configuration: RESEND_API_KEY");
  }

  resend = new Resend(process.env.RESEND_API_KEY);

  return resend;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Email recipient, subject, and body are required");
  }

  const { data, error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }

  return data;
};
