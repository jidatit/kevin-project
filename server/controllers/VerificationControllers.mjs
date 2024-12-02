import admin from "firebase-admin";
import { serviceAccount } from "../config/ServiceAcc.mjs";
import nodemailer from "nodemailer";
// Adjust the path accordingly
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://acta-2022-default-rtdb.firebaseio.com/",
});

const auth = admin.auth();
const db = admin.firestore();
import dotenv from "dotenv";
dotenv.config();
export const sendVerificationEmail = async (req, res, next) => {
  const { email, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ message: "Email and UID are required." });
  }

  try {
    // Generate email verification link using Firebase Admin SDK
    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email, {
        url: `${process.env.FRONTEND_URL}/email-verification`, // Replace with your frontend URL
        handleCodeInApp: true,
      });
    console.log("Verification link generated", verificationLink);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any email service
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL, // Sender email (configured in environment variables)
        pass: process.env.PASSWORD, // Sender email password
      },
    });

    // Email template with Firebase verification link
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email Address",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #6DB23A; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Settling In Concierge Partner Services</h1>
          </div>
          <div style="padding: 20px; color: #333;">
            <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">Verify Your Email</h2>
            <p style="margin-bottom: 20px;">Hi,</p>
            <p style="margin-bottom: 20px;">Please follow this link to verify your email address and register for access to the Partner Portal:</p>
            <p style="text-align: center; margin-bottom: 20px;">
              <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #6DB23A; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
            </p>
            <p style="margin-bottom: 20px;">If you didn’t request to register, please ignore this email.</p>
            <p style="margin-bottom: 0;">Thanks,</p>
            <p><strong>Settling In Concierge Partner Services Team</strong></p>
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #555;">
            <p style="margin: 0;">&copy; 2023 Settling In Concierge Partner Services. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({
      message: "Verification email sent successfully.",
      link: verificationLink, // Optional: You can send the link back for debugging purposes
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({
      message: "Failed to send verification email.",
      error: error.message,
    });
  }
};

// export const UnblockUser = async (req, res, next) => {
//   const { email } = req.body; // Assuming email is passed in the request body

//   try {
//     // Retrieve the user by email to get the UID
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // Enable the user in Firebase Authentication using the UID
//     await admin.auth().updateUser(userRecord.uid, {
//       disabled: false,
//     });

//     // Update the user's active status in Firestore (or Realtime Database)
//     const userRef = admin.firestore().collection("users").doc(userRecord.uid);
//     await userRef.update({
//       activeStatus: "Active",
//     });

//     return res.status(200).json({
//       success: true,
//       message: `User with email ${email} has been unblocked successfully`,
//       user: { uid: userRecord.uid, email: userRecord.email },
//     });
//   } catch (error) {
//     console.error("Error unblocking user:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to unblock the user",
//       error: error.message,
//     });
//   }
// };
