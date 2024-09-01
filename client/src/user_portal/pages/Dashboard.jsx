import { useEffect, useState } from "react";
import {
	doc,
	query,
	collection,
	where,
	getDoc,
	getDocs,
} from "firebase/firestore";
import { useAuth } from "../../../AuthContext";
import { db } from "../../../Firebase";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const Loader = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  opacity-75 z-50">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
		</div>
	);
};
const Dashboard = () => {
	const { currentUser } = useAuth();
	const userID = currentUser?.uid;
	const [userData, setUserData] = useState(null);
	const [leadsData, setleadsData] = useState(null);
	const [partnerData, setpartnerData] = useState([]);
	const [loading, setLoading] = useState(false);

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
			setLoading(true);
			const userRef = doc(db, "users", userID);
			const dataDoc = await getDoc(userRef);
			if (dataDoc.exists()) {
				const userDataDB = dataDoc.data();
				console.log("UserData: ", userDataDB);

				const response = await axios.post(
					"https://kevin-project-zfc8.onrender.com/api/zoho",
					{
						email: userDataDB.email,
					},
				);
				const userTypeDataList = response.data.data;

				const matchedData = userTypeDataList.find((item) => item.PARTNER_TYPE);

				if (matchedData) {
					setleadsData(matchedData);

					// Retrieve the PARTNER_TYPE from the matchedData
					const partnerType = matchedData.PARTNER_TYPE;

					// Query the 'partner' collection based on the PARTNER_TYPE
					const partnerQuery = query(
						collection(db, "partner"),
						where("PARTNER_TYPE", "==", partnerType),
					);
					const partnerSnapshot = await getDocs(partnerQuery);

					if (!partnerSnapshot.empty) {
						// Assuming you want to use only the first matching document
						const partnerDocData = partnerSnapshot.docs[0].data();

						setpartnerData(partnerDocData);
					} else {
						console.log("No partner data found for this PARTNER_TYPE.");
					}
				} else {
					console.log("No matching data found.");
				}
			} else {
				console.log("No such document!");
			}
			setLoading(false);
		} catch (error) {
			console.error("Error fetching user data: ", error);
			toast.error("Unable to get Zoho Data");
			setLoading(false);
		}
	};

	const getEmbedURL = (url) => {
		const regExp =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regExp);
		return match ? `https://www.youtube.com/embed/${match[1]}` : url;
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
			<div
				className={`w-full h-auto flex flex-col mb-6 ${loading ? "opacity-50" : "opacity-100"}`}
			>
				<div className="w-full lg:w-[60%] flex flex-col justify-center items-center ">
					<div className="w-full h-12 rounded-t-lg bg-[#6DB23A]"></div>
					<div className="w-[95%] max-w-full h-96 max-h-[75vh] my-5 rounded-xl bg-gray-200 flex justify-center items-center">
						{console.log("partner comp", partnerData)}

						{partnerData?.quickLinkVideo && (
							<iframe
								className="rounded-xl w-full h-full"
								src={getEmbedURL(partnerData.quickLinkVideo)}
								title="Embedded Video"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						)}

						{partnerData?.videoFileLink && (
							<video className="w-full h-full" controls>
								<source src={partnerData.videoFileLink} type="video/mp4" />
							</video>
						)}
					</div>
				</div>

				<div className=" w-full flex flex-col justify-center items-center mt-2">
					<div className="w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]">
						{" "}
						Quick Links{" "}
					</div>

					<div className="w-full h-auto flex flex-col lg:flex-row justify-around items-start gap-3 mt-5 mb-3 px-4">
						<div className="w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl">
							<div className="text-lg text-[#6DB23A] font-bold">
								Click Here to Schedule a Call
							</div>
							<div className="flex flex-col  text-[#619f34] text-sm font-semibold cursor-pointer">
								{console.log("link", partnerData?.quickLinkFirst)}
								{partnerData?.quickLinkFirst ? (
									<a
										href={
											partnerData.quickLinkFirst.startsWith("http://") ||
											partnerData.quickLinkFirst.startsWith("https://")
												? partnerData.quickLinkFirst
												: `https://${partnerData.quickLinkFirst}`
										}
										className="underline break-words"
										target="_blank"
										rel="noopener noreferrer"
									>
										{partnerData.quickLinkFirst}
									</a>
								) : (
									<span>No Link Available</span>
								)}
							</div>
						</div>
						<div className="w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl">
							<div className="text-lg text-[#6DB23A] font-bold">
								Go to Settings in Concierge
							</div>
							<div className="text-sm flex flex-col  text-[#619f34] font-semibold cursor-pointer">
								{partnerData?.quickLinkSecond ? (
									<a
										href={
											partnerData.quickLinkSecond.startsWith("http://") ||
											partnerData.quickLinkSecond.startsWith("https://")
												? partnerData.quickLinkSecond
												: `https://${partnerData.quickLinkSecond}`
										}
										className="underline break-words"
										target="_blank"
										rel="noopener noreferrer"
									>
										{" "}
										{partnerData.quickLinkSecond}{" "}
									</a>
								) : (
									<span> No Link Available </span>
								)}
							</div>
						</div>
					</div>

					<div className="w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-3 px-4">
						<div className="w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl">
							<div className="text-lg text-[#6DB23A] font-bold">
								Email Support Team
							</div>
							<div className="text-sm flex flex-col text-[#619f34] font-semibold cursor-pointer">
								{partnerData?.quickLinkThird ? (
									<a
										href={`mailto:${partnerData.quickLinkThird}`}
										className="underline break-words"
									>
										{partnerData.quickLinkThird}
									</a>
								) : (
									<span>No Link Available</span>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className=" w-full flex flex-col justify-start items-start mt-7">
					<div className="w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]">
						{" "}
						Contact My Account Executive{" "}
					</div>

					<div className="w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-3 px-4">
						<div className="w-full lg:max-w-[50%] py-3 px-5 lg:px-8 mt-3 bg-gray-200 rounded-xl">
							<div className="text-lg text-[#6DB23A] font-bold">
								Contact Number
							</div>
							<div className="text-sm flex flex-col  text-[#619f34] font-semibold cursor-pointer">
								{partnerData?.quickLinkContact ? (
									<Link
										href={partnerData.quickLinkContact}
										className="break-words"
									>
										{" "}
										{partnerData.quickLinkContact}{" "}
									</Link>
								) : (
									<span> No Number Available </span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			{loading && <Loader />}
		</>
	);
};

export default Dashboard;
