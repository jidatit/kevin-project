import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userType, setUserType] = useState("");
	const [isEmailVerified, setIsEmailVerified] = useState(false);

	const getUserDetails = async (userId) => {
		try {
			const userDocRef = doc(db, "users", userId);
			const userDocSnapshot = await getDoc(userDocRef);
			if (userDocSnapshot.exists()) {
				const userData = userDocSnapshot.data();
				return userData;
			} else {
				const adminDocRef = doc(db, "admins", userId);
				const adminDocSnapshot = await getDoc(adminDocRef);
				if (adminDocSnapshot.exists()) {
					const adminData = adminDocSnapshot.data();
					return adminData;
				} else {
					console.log("No user or admin exists.");
				}
			}
		} catch (error) {
			console.error("Error fetching user or admin details: ", error);
			throw error;
		}
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setLoading(true);
			if (user) {
				const data = await getUserDetails(user.uid);
				setUserType(data.userType);
				setIsEmailVerified(true);

				const allDetails = {
					...user,
					data,
					isEmailVerified: user.emailVerified,
				};
				setCurrentUser(allDetails);
				localStorage.setItem("currentUser", JSON.stringify(allDetails));
				localStorage.setItem("userType", JSON.stringify(data.userType));
				localStorage.setItem(
					"isEmailVerified",
					JSON.stringify(user.emailVerified),
				);
			} else {
				setCurrentUser(null);
				setIsEmailVerified(true);

				localStorage.removeItem("currentUser");
				localStorage.removeItem("userType");
				localStorage.removeItem("isEmailVerified");
			}
			setLoading(false);
		});

		const storedUser = localStorage.getItem("currentUser");
		const storedUserType = localStorage.getItem("userType");
		const storedEmailVerified = localStorage.getItem("isEmailVerified");

		if (storedUser) {
			setCurrentUser(JSON.parse(storedUser));
			setUserType(JSON.parse(storedUserType));
			setIsEmailVerified(true);
		}
		setLoading(false);

		return () => unsubscribe();
	}, []);

	const logout = async () => {
		try {
			await auth.signOut();
			setCurrentUser(null);
			setUserType(null);
			setIsEmailVerified(null);

			localStorage.removeItem("currentUser");
			localStorage.removeItem("userType");
			localStorage.removeItem("isEmailVerified");
		} catch (error) {
			console.error("Error logging out: ", error.message);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				loading,
				logout,
				userType,
				isEmailVerified,
				setIsEmailVerified,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
