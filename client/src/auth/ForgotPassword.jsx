import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../../Firebase";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const queryAllCollections = async () => {
		const collections = ["admins", "users"];
		for (let col of collections) {
			const q = query(collection(db, col), where("email", "==", email));
			const querySnapshot = await getDocs(q);
			if (!querySnapshot.empty) {
				// Get the first document (should only be one if emails are unique)
				const userDoc = querySnapshot.docs[0];
				const uid = userDoc.id;
				// Now fetch the user's details using the UID
				const userRef = doc(db, col, uid);
				const userSnapshot = await getDoc(userRef);

				if (userSnapshot.exists()) {
					return { ...userSnapshot.data(), id: uid, collection: col };
				}
			}
		}
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Prevent multiple submissions
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			let userData = await queryAllCollections();

			if (!userData) {
				toast.error("This email is not registered.");
				return;
			}
			await sendPasswordResetEmail(auth, email);
			toast.success("Check your email account for reset instructions.");
			setTimeout(() => {
				navigate("/");
			}, 5000);
		} catch (err) {
			console.error("Error resetting password:", err);
			if (err.code === "auth/too-many-requests") {
				toast.error("Too many requests. Please try again later.");
			} else if (err.code === "auth/invalid-email") {
				toast.error("Invalid email address.");
			} else {
				toast.error("Error sending reset email. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<main
				id="content"
				role="main"
				className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]"
			>
				<div className="w-[90%] relative md:w-[70%] bg-[#FFFFFF] pt-[60px] pb-[60px] rounded-[10px] flex flex-col justify-center items-center gap-5 shadow-lg">
					<div className="text-center">
						<h1 className="font-bold lg:text-[30px] md:text-[25px] text-[20px] text-gray-800">
							Forgot password?
						</h1>
						<p className="mt-2 text-sm text-gray-600">
							Remember your password?
							<Link
								className="font-medium text-[#6DB23A] hover:underline ml-1"
								to={"/"}
							>
								Login here
							</Link>
						</p>
					</div>
					<form
						className="w-[90%] md:w-[60%] flex flex-col gap-4 justify-center items-center"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="w-full">
							<label
								htmlFor="email"
								className="block mb-2 ml-1 text-sm font-bold text-gray-800"
							>
								Email address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-[#6DB23A] focus:ring-[#6DB23A]"
								required
								aria-describedby="email-error"
							/>
						</div>
						<button
							type="submit"
							className="bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-white text-lg font-semibold py-2 px-4 w-full border-2 border-[#6DB23A] rounded shadow"
						>
							Reset password
						</button>
					</form>
				</div>
				<ToastContainer />
			</main>
		</>
	);
};

export default ForgotPassword;
