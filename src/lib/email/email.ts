import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER!;
const pass = process.env.GMAIL_APP_PASS!;

export const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // ou 587 + secure: false (STARTTLS)
  secure: true, // 465 = SSL direct
  auth: { user, pass },
});

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  fromName?: string;
}) {
  const from = opts.fromName ? `"${opts.fromName}" <${user}>` : user;

  const info = await mailer.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  return info;
}
