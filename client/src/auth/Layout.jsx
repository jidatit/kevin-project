import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import EmailVerify from "./EmailVerify";

const Loader = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
		</div>
	);
};

const Layout = () => {
	const {
		currentUser,
		loading,
		userType,
		isEmailVerified,
		setIsEmailVerified,
	} = useAuth();

	useEffect(() => {
		let intervalId;
		if (currentUser && !isEmailVerified) {
			intervalId = setInterval(async () => {
				await currentUser.reloadUserInfo();
				if (currentUser.emailVerified) {
					setIsEmailVerified(true);
				}
			}, 30000);

			return () => clearInterval(intervalId);
		}
	}, [currentUser, isEmailVerified, setIsEmailVerified]);

	if (loading) {
		return <Loader />;
	}

	if (currentUser && userType === "user" && !isEmailVerified) {
		return <EmailVerify />;
	}

	return (
		<>
			{!currentUser && (
				<>
					<Outlet />
				</>
			)}
			{currentUser && isEmailVerified && userType === "user" && (
				<>
					<Navigate to="user_portal" />
				</>
			)}
			{currentUser && userType === "admin" && (
				<>
					<Navigate to="admin_portal" />
				</>
			)}
		</>
	);
};

export default Layout;
