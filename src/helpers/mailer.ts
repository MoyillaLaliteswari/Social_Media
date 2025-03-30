import nodemailer from "nodemailer";
import User from "@/src/models/userModel";
import bcryptjs from "bcryptjs";

export default async function sendEmail({ email, emailType, userId }: { email: string; emailType: string; userId: string }) {
  try {
    let hashedToken = await bcryptjs.hash(userId.toString(), 10);
    let hashedEmail = await bcryptjs.hash(email, 10);

    hashedToken = hashedToken.replace(/[^a-zA-Z0-9]/g, "");
    hashedEmail = hashedEmail.replace(/[^a-zA-Z0-9]/g, "");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
        hashedEmail: hashedEmail,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
        hashedEmail: hashedEmail,
      });
    }

    const transport = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
    });

    const verificationLink = `${process.env.DOMAIN}/${
      emailType === "VERIFY" ? "verifyemail" : "resetPassword"
    }/?token=${encodeURIComponent(hashedToken)}&id=${encodeURIComponent(
      hashedEmail
    )}`;

    const mailOptions = {
      from: "lallimoyilla@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailType === "VERIFY" ? "Email Verification" : "Password Reset"}</title>
          <style>
            body {
              font-family: 'Roboto', Arial, sans-serif;
              background-color: #f3f8fc;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .email-container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #64b5f6, #1e88e5);
              color: #ffffff;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 26px;
              font-weight: bold;
            }
            .content {
              padding: 20px 30px;
              text-align: center;
              color: #444;
            }
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin: 15px 0;
              color: #555;
            }
            .button-container {
              margin: 20px 0;
            }
            .button {
              background: linear-gradient(135deg, #1e88e5, #42a5f5);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              display: inline-block;
              transition: background 0.3s;
            }
            .button:hover {
              background: linear-gradient(135deg, #42a5f5, #1e88e5);
            }
            .link {
              color: #1e88e5;
              text-decoration: none;
              font-weight: bold;
            }
            .footer {
              background-color: #e3f2fd;
              color: #555;
              text-align: center;
              padding: 15px;
              font-size: 14px;
            }
            .footer a {
              color: #1e88e5;
              text-decoration: none;
              font-weight: bold;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>${
                emailType === "VERIFY"
                  ? "Welcome to Watashino Bloggy"
                  : "Reset Your Password"
              }</h1>
            </div>
            <div class="content">
              <p>Dear User,</p>
              <p>${
                emailType === "VERIFY"
                  ? "Thank you for joining Watashino Bloggy! Please verify your email to continue."
                  : "We received a request to reset your password."
              }</p>
              <p>Click the button below to ${
                emailType === "VERIFY" ? "verify your email" : "reset your password"
              }:</p>
              <div class="button-container">
                <a href="${verificationLink}" class="button" target="_blank">${
                  emailType === "VERIFY" ? "Verify Email" : "Reset Password"
                }</a>
              </div>
              <p>If you cannot access the button, copy and paste this link into your browser:</p>
              <p><a href="${verificationLink}" target="_blank" class="link">${verificationLink}</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}