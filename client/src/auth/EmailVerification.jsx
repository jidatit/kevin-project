import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, applyActionCode } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../AuthContext";

const EmailVerification = () => {
	const [isVerifying, setIsVerifying] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const auth = getAuth();
	const { isEmailVerified } = useAuth();

	useEffect(() => {
		const verifyEmail = async () => {
			const actionCode = searchParams.get("oobCode");
			console.log("oobCode", actionCode);

			if (!actionCode) {
				setError("Invalid verification link.");
				setIsVerifying(false);
				return;
			}

			try {
				await applyActionCode(auth, actionCode);
				setSuccess("Email verified successfully!");
				toast.success("Email verified successfully!");
				setTimeout(() => {
					navigate("/user_portal"); // Redirect to home page after verification
				}, 2000);
			} catch (error) {
				console.log("err", error);
				console.error("Error verifying email:", error);
				setError("Failed to verify email. Please try again.");
			} finally {
				setIsVerifying(false);
			}
		};

		verifyEmail();
	}, [searchParams, auth, navigate]);

	return (
		<div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
			<ToastContainer />
			<div className="w-[90%] md:w-[70%] bg-white pt-10 pb-10 rounded-[10px] shadow-md flex flex-col items-center gap-5">
				<h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">
					Email Verification
				</h2>
				{!isEmailVerified ? (
					<p className="text-gray-700">Verifying your email...</p>
				) : (
					<>
						{error && <p className="text-red-500">{error}</p>}
						{success && <p className="text-green-600">{success}</p>}
					</>
				)}
			</div>
		</div>
	);
};

export default EmailVerification;
