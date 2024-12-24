import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { EmailVerificationHelper } from "../../utils/EmailVerification";
import { toast, ToastContainer } from "react-toastify";

const EmailVerify = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(60); // Initial countdown time in seconds

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }

    return () => clearInterval(timer); // Cleanup the interval on unmount
  }, [isCountdownActive, countdown]);

  const handleResendVerification = async () => {
    const result = await EmailVerificationHelper(user);

    if (result.success) {
      toast.success("Verification email sent successfully!");
    } else {
      // Check if the error contains TOO_MANY_ATTEMPTS_TRY_LATER
      const errorMessage = result.error;

      if (errorMessage.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        toast.error("Too many attempts. Please try again later.");
        setIsCountdownActive(true); // Start countdown
        setCountdown(60); // Reset countdown timer to 60 seconds
      } else {
        toast.error(`Failed to send verification email: ${errorMessage}`);
      }
    }
  };

  const refreshPage = () => {
    navigate(0);
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
        <div className="w-[70%] relative md:w-[50%] bg-[#FFFFFF] pt-[60px] pb-[60px] rounded-[10px] flex flex-col justify-center items-center gap-5">
          <h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">
            Verify Your Email
          </h2>
          <p className="text-center mb-4">
            Please verify your email to continue. We have sent a verification
            link to your email address.
          </p>
          <p className="text-center mb-2">
            After verifying your email, please refresh the page to continue.
          </p>
          <div className="w-[90%] md:w-[60%] flex gap-2 flex-col justify-center items-center">
            <button
              onClick={refreshPage}
              type="button"
              className="bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-[white] text-lg font-semibold py-2 px-4 w-[90%]  border-2 border-[#6DB23A] rounded shadow"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleResendVerification}
              className={`${
                isCountdownActive
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-white hover:bg-[#F2B145] text-[#F2B145] hover:text-[white] border-2 border-[#F2B145]"
              } text-lg font-semibold py-2 px-4 w-[90%] rounded shadow`}
              disabled={isCountdownActive}
            >
              {isCountdownActive
                ? `Resend available in ${countdown}s`
                : "Resend Verification Email"}
            </button>
            <button
              onClick={logout}
              type="button"
              className="bg-white hover:bg-[#eb6363] text-[#eb3e38] hover:text-[white] text-lg font-semibold py-2 px-4 w-[90%]  border-2 border-[#f65a3b] rounded shadow"
            >
              <LogoutOutlinedIcon className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;
