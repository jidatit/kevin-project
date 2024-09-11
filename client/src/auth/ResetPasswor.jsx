import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth, db } from "../../Firebase";
import { toast, ToastContainer } from "react-toastify"; // For showing notifications

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const oobCodeParam = searchParams.get("oobCode");

	// Handle the password reset form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if passwords match
		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		if (!oobCodeParam) {
			toast.error("Invalid or expired reset link.");
			return;
		}

		setIsSubmitting(true);
		try {
			// Reset the password using Firebase's confirmPasswordReset function
			await confirmPasswordReset(auth, oobCodeParam, password);
			toast.success("Password has been reset successfully.");
			setTimeout(() => {
				navigate("/");
			}, 2000);
		} catch (error) {
			console.error("Error resetting password:", error);
			toast.error("Failed to reset password. Try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
			<ToastContainer />
			<div className="w-[90%] md:w-[70%] bg-white pt-10 pb-10 rounded-[10px] shadow-md flex flex-col items-center gap-5">
				<h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">
					Reset Your Password
				</h2>
				<form
					className="w-[90%] md:w-[60%] flex flex-col gap-5 items-center"
					onSubmit={handleSubmit}
				>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter new password"
						className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
						required
					/>
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm new password"
						className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
						required
					/>
					<button
						type="submit"
						className="bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-white text-lg font-semibold py-2 px-4 w-full border-2 border-[#6DB23A] rounded shadow"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Reset Password"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
