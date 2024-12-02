import axios from "axios";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_BACKEND_URL;

export const EmailVerificationHelper = async (user) => {
  const apiUrl = `${url}/auth/sendVerifyEmail`;

  try {
    const response = await axios.post(apiUrl, {
      email: user.email,
      uid: user.uid,
    });

    // Check if the response indicates success.
    if (response.status === 200 || response.data.success) {
      toast.success("Verification email sent successfully!");
    } else {
      toast.error("Failed to send verification email. Please try again.");
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    toast.error("An error occurred while sending the email.");
  }
};
