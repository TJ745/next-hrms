"use server";

import transporter from "@/lib/nodemailer";

const styles = {
  container:
    "max-width:500px;margin:20px auto;padding:20px;border:1px solid #000;border-radius:6px;",
  header: "font-size:20px;font-weight:600;margin-bottom:10px;",
  paragraph: "font-size:16px;margin-bottom:10px;",
  link: "color:#000;text-decoration:none;",
};

export async function sendEmailAction({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link: string;
  };
}) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to,
    subject: `BetterAuth - ${subject}`,
    html: `
        <div style="${styles.container}">
        <h1 style="${styles.header}">${subject}</h1>
        <p style="${styles.paragraph}">${meta.description}</p>
        <a href="${meta.link}" style="${styles.link}">Click Here</a>
        </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("sendEmailAction", err);
    return { success: false };
  }
}
