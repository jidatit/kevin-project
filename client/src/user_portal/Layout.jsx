import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../AuthContext";
import { db } from "../../Firebase";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import UserAvatar from "../assets/Avatar.png";
import Logo from "../assets/Logo.png";
import UploadIcon from "./components/Upload";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const Loader = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
		</div>
	);
};

const Layout = () => {
	const { logout, currentUser, loading, userType, isEmailVerified } = useAuth();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [displayName, setDisplayName] = useState(false);
	const [showNameInMenu, setShowNameInMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const [loader, setLoader] = useState(false);

	const userID = currentUser?.uid;
	const [userData, setUserData] = useState(null);
	const [logoUrl, setLogoUrl] = useState(null);

	const fetchUserData = async () => {
		if (!userID) return;
		try {
			const userRef = doc(db, "users", userID);
			const dataDoc = await getDoc(userRef);
			if (dataDoc.exists()) {
				setUserData(dataDoc.data());
				setLogoUrl(dataDoc.data().logoUrl || null);
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error fetching user data: ", error);
		}
	};

	const handleResize = useCallback(() => {
		const isDesktop = window.innerWidth > 768;
		setDisplayName(isDesktop);
		setShowNameInMenu(!isDesktop);
	}, []);

	useEffect(() => {
		if (userID) {
			fetchUserData();
		}
	}, [userID]);

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [handleResize]);

	if (loading) {
		return <Loader />;
	}

	const toggleOpenSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const toggleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const NavToChangePass = () => {
		navigate("/user_portal/changePassword");
		handleClose();
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const storage = getStorage();
		const storageRef = ref(storage, `logos/${userID}/${file.name}`);

		try {
			setLoader(true);
			await uploadBytes(storageRef, file);
			const downloadURL = await getDownloadURL(storageRef);
			setLogoUrl(downloadURL);
			setLoader(false);
			const userRef = doc(db, "users", userID);
			await setDoc(userRef, { logoUrl: downloadURL }, { merge: true });
		} catch (error) {
			console.error("Error uploading file: ", error);
		}
	};

	return currentUser && isEmailVerified && userType === "user" ? (
		<>
			<div className="w-full flex flex-cols relative">
				{/* Right Navbar */}
				<div
					id="logo-sidebar"
					className={`w-64 min-h-screen absolute flex flex-col left-0 top-0 border-r-2 border-gray-300 transition-transform ${
						isSidebarOpen ? "translate-x-0" : "-translate-x-full"
					} bg-white sm:translate-x-0 z-50`}
					aria-label="Sidebar"
				>
					<div className="relative flex flex-col items-center w-full h-40 justify-center">
						<div className="relative w-3/4 h-full">
							<img
								src={logoUrl || Logo}
								alt="Logo"
								className="w-full h-full object-contain"
							/>
						</div>
						<label
							htmlFor="filein"
							className="absolute bottom-2 right-4 cursor-pointer text-gray-800"
						>
							<ChangeCircleIcon />
						</label>
						<input
							type="file"
							accept="image/*"
							id="filein"
							onChange={handleFileUpload}
							className="hidden"
						/>
					</div>
					<div className="flex flex-col justify-center items-center gap-4 mt-8">
						<div
							onClick={() => navigate("/user_portal/")}
							className="flex justify-start items-center w-[80%] bg-gray-200 py-2 px-4 rounded text-base gap-2 cursor-pointer"
						>
							<DashboardOutlinedIcon />
							Dashboard
						</div>
						<div
							onClick={() => navigate("/user_portal/profile")}
							className="flex justify-start items-center w-[80%] bg-gray-200 py-2 px-4 rounded text-base gap-2 cursor-pointer"
						>
							<AccountBoxOutlinedIcon />
							Profile
						</div>
						<div
							onClick={() => navigate("/user_portal/clients")}
							className="flex justify-start items-center w-[80%] bg-gray-200 py-2 px-4 rounded text-base gap-2 cursor-pointer"
						>
							<PeopleOutlineOutlinedIcon />
							Clients
						</div>
					</div>
				</div>

				{/* Left Main Area */}
				<div className="absolute flex flex-col left-0 right-0 sm:ml-64 transition-all duration-300">
					<div className="w-full flex flex-cols justify-between items-center border-r-2 border-gray-300 py-4 px-4 sm:px-10 md:px-10 lg:px-10 xl:px-10">
						<div className="flex items-center justify-start gap-4 rtl:justify-end">
							<button
								onClick={toggleOpenSidebar}
								aria-controls="logo-sidebar"
								type="button"
								className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
							>
								<span className="sr-only">Open sidebar</span>
								<svg
									className="w-6 h-6"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										clipRule="evenodd"
										fillRule="evenodd"
										d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
									></path>
								</svg>
							</button>
							<div className="font-bold text-2xl">Dashboard</div>
						</div>
						<div className="flex flex-cols justify-center items-center gap-0 lg:gap-2">
							<Avatar src={UserAvatar} alt="Remy Sharp" />
							{displayName && (
								<h1 className="text-base font-semibold pl-4">
									{" "}
									{userData ? userData.name : ""}{" "}
								</h1>
							)}
							<Button
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={handleClick}
							>
								<KeyboardArrowDownIcon className="text-4xl text-black" />
							</Button>
							<Menu
								id="basic-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
							>
								{showNameInMenu && (
									<MenuItem className="gap-2">
										{" "}
										<AccountBoxOutlinedIcon /> {userData ? userData.name : ""}
									</MenuItem>
								)}
								<MenuItem onClick={NavToChangePass} className="gap-2">
									{" "}
									<LockResetOutlinedIcon /> Change Password
								</MenuItem>
								<MenuItem onClick={logout} className="gap-2">
									{" "}
									<LogoutOutlinedIcon /> Logout
								</MenuItem>
							</Menu>
						</div>
					</div>
					<div className="w-full py-4 px-4 lg:px-10 bg-[#F9FFFC]">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	) : (
		<Navigate to="/" />
	);
};

export default Layout;
