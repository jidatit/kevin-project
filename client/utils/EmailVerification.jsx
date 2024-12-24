import axios from "axios";
import { toast } from "react-toastify";
const url = "https://kevin-project-zfc8.onrender.com";

export const EmailVerificationHelper = async (user) => {
  const apiUrl = `${url}/auth/sendVerifyEmail`;

  try {
    const response = await axios.post(apiUrl, {
      email: user.email,
      uid: user.uid,
    });
    console.log("response", response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error sending verification email:", error);

    const errorMessage =
      error.response?.data?.error || "An unknown error occurred";

    return { success: false, error: errorMessage };
  }
};
