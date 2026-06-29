import * as nodeMailer from "nodemailer";

export const mailSender = async (
  email: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    console.log("Sending email to:", email);

    const transporter = nodeMailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD, // app password
      },
    });

    const mailOptions: nodeMailer.SendMailOptions = {
      from: `"Trialshopy" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: subject,
      html: message, // 
    };

    if (!mailOptions.to) {
      throw new Error("Recipient's email address is missing");
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent ✅:", info.response);
  } catch (error: any) {
    console.error("Error sending email ❌:", error.message);
    throw error;
  }
};