import React, { useState, useEffect } from "react";
import ClientTable from "../components/ClientTable";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../AuthContext";
import { db } from "../../../Firebase";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
	const { currentUser } = useAuth();
	const userID = currentUser?.uid;
	const [userData, setUserData] = useState(null);
	const [leadsData, setleadsData] = useState([]);

	const fetchUserData = async () => {
		if (!userID) return;
		try {
			const userRef = doc(db, "users", userID);
			const dataDoc = await getDoc(userRef);
			if (dataDoc.exists()) {
				setUserData(dataDoc.data());
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.error("Error fetching user data: ", error);
		}
	};
	const getLeadsData = async () => {
		try {
			const userRef = doc(db, "users", userID);
			const dataDoc = await getDoc(userRef);

			if (dataDoc.exists()) {
				const userDataDB = dataDoc.data();

				try {
					const response = await axios.post(
						"https://kevin-project-zfc8.onrender.com/api/zoho",
						{ email: userDataDB.email },
					);

					const userTypeDataList = response.data.data.data;

					const matchedData = userTypeDataList.find(
						(item) => item.Company_RF_LINK || item.RF_CAMPAIGN_NAME,
					);

					if (matchedData) {
						setleadsData(matchedData);
					} else {
						toast.warning("No matching data found.");
					}
				} catch (zohoError) {
					console.error("Error fetching data from Zoho: ", zohoError);
					if (zohoError.response && zohoError.response.status === 401) {
						toast.error(
							"Unauthorized access to Zoho API. Please check credentials.",
						);
					} else if (zohoError.response && zohoError.response.status === 500) {
						toast.error("Zoho API server error. Please try again later.");
					} else {
						toast.error("Error fetching data from Zoho. Please try again.");
					}
				}
			} else {
				console.log("No such document in Firestore!");
				toast.error("User data not found.");
			}
		} catch (firestoreError) {
			console.error(
				"Error fetching user data from Firestore: ",
				firestoreError,
			);
			toast.error("Failed to retrieve user data. Please try again.");
		}
	};

	useEffect(() => {
		if (userID) {
			fetchUserData();
			getLeadsData();
		}
	}, [userID]);

	return (
		<>
			<ToastContainer />
			<div className="w-full h-auto flex flex-col">
				<div className=" w-full flex flex-col justify-center items-center">
					<div className="w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]">
						{" "}
						Description Information{" "}
					</div>
					<div className="w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3">
						<div className="w-full py-4 px-6 bg-gray-200  flex flex-col gap-2">
							<h1 className="font-semibold text-lg text-[#6DB23A]">
								{" "}
								Full Name{" "}
							</h1>
							<h2 className="font-normal text-sm text-black">
								{" "}
								{userData ? userData.name : "-"}{" "}
							</h2>
						</div>

						<div className="w-full py-4 px-6 bg-gray-200  flex flex-col gap-2">
							<h1 className="font-semibold text-lg text-[#6DB23A]">
								{" "}
								Agent Company{" "}
							</h1>
							<h2 className="font-normal text-sm text-black">
								{" "}
								{leadsData ? leadsData?.RF_CAMPAIGN_NAME : "-"}{" "}
							</h2>
						</div>
						<div className="w-full py-4 px-6 bg-gray-200  flex flex-col gap-2">
							<h1 className="font-semibold text-lg text-[#6DB23A]">
								{" "}
								Phone Number{" "}
							</h1>
							<h2 className="font-normal text-sm text-black">
								{" "}
								{userData ? userData.phoneNumber : "-"}{" "}
							</h2>
						</div>
						<div className="w-full py-4 px-6 bg-gray-200  flex flex-col gap-2">
							<h1 className="font-semibold text-lg text-[#6DB23A]"> Email </h1>
							<h2 className="font-normal text-sm text-black">
								{" "}
								{userData ? userData.email : "-"}{" "}
							</h2>
						</div>
						<div className="w-full py-4 px-6 bg-gray-200  flex flex-col gap-2">
							<h1 className="font-semibold text-lg text-[#6DB23A]">
								{" "}
								Agent Referral Link{" "}
							</h1>
							<a href={leadsData ? leadsData?.Company_RF_LINK : ""}>
								<h2 className="font-normal text-sm text-black break-words">
									{" "}
									{leadsData ? leadsData?.Company_RF_LINK : "-"}{" "}
								</h2>
							</a>
						</div>
					</div>
				</div>

				<div className="w-full h-auto mt-20">
					<ClientTable />
				</div>
			</div>
		</>
	);
};

export default Profile;
