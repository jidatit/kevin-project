import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import bcrypt from "bcryptjs";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSignup = () => {
	const navigate = useNavigate();
	const [passwordError, setPasswordError] = useState("");
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
		userType: "user",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			const { confirmPassword, password, ...userDataWithoutPasswords } =
				userData;
			if (confirmPassword !== password) {
				toast.error("Password Don't Matched");
				return;
			}

			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(password, salt);

			const { user } = await createUserWithEmailAndPassword(
				auth,
				userData.email,
				userData.password,
			);

			await setDoc(doc(db, "users", user.uid), {
				...userDataWithoutPasswords,
				hashedPassword,
			});

			toast.success("User Registered");

			setUserData({
				name: "",
				email: "",
				phoneNumber: "",
				password: "",
				confirmPassword: "",
			});

			navigate("/user_portal");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const routeToLogin = () => {
		navigate("/");
	};

	return (
		<>
			<div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
				<ToastContainer />

				<div className="w-[90%] relative md:w-[70%] bg-[#F1F1F1] pt-[30px] pb-[30px] rounded-[10px] flex flex-col justify-center items-center gap-5">
					<h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">
						Sign up
					</h2>
					<form
						onSubmit={handleSignup}
						className="w-[90%] md:w-[60%] flex gap-2 flex-col justify-center items-center"
					>
						<TextField
							name="name"
							onChange={handleInputChange}
							value={userData.name}
							placeholder="Name"
							className="w-full outline-none"
							type="text"
							required
						/>
						<TextField
							name="email"
							onChange={handleInputChange}
							value={userData.email}
							placeholder="Email"
							className="w-full outline-none"
							type="email"
							required
						/>
						<TextField
							name="phoneNumber"
							onChange={handleInputChange}
							value={userData.phoneNumber}
							placeholder="Phone Number"
							className="w-full outline-none"
							type="number"
							required
						/>
						<TextField
							name="password"
							onChange={handleInputChange}
							value={userData.password}
							placeholder="Password"
							className="w-full outline-none"
							type="password"
							required
						/>
						<TextField
							name="confirmPassword"
							onChange={handleInputChange}
							value={userData.confirmPassword}
							placeholder="Confirm Password"
							className="w-full outline-none"
							type="password"
							required
						/>
						<button
							type="submit"
							className="bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-[white] text-lg font-semibold my-4 py-2 px-4 w-[100%] border-2 border-[#6DB23A] rounded shadow"
						>
							Register
						</button>
					</form>

					<h3>Already Member?</h3>
					<button
						onClick={routeToLogin}
						className="bg-white hover:bg-[#F2B145] text-[#F2B145] hover:text-[white] text-lg font-semibold py-2 px-4 w-[90%] md:w-[60%] border-2 border-[#F2B145] rounded shadow"
					>
						Login
					</button>
				</div>
			</div>
		</>
	);
};

export default UserSignup;
