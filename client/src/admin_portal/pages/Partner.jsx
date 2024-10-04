import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import LinkIcon from "@mui/icons-material/Link";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Firebase";
import LinearProgress from "@mui/material/LinearProgress";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	overflow: "auto",
	maxHeight: "90vh",
};

const PartnerType = () => {
	const [partnerType, setPartnerType] = useState("");

	const [open, setOpen] = useState(false);

	const handleOpen = (type) => {
		setOpen(true);
		setPartnerType(type);
		console.log("partner type", type);
	};

	const handleClose = () => setOpen(false);

	const [isEditingVideo, setIsEditingVideo] = useState(false);
	const [videoInputValue, setVideoInputValue] = useState("");
	const [videoFetchedLink, setVideoFetchedLink] = useState("");

	const handleVideoIconClick = () => {
		setIsEditingVideo(!isEditingVideo);
	};

	const handleVideoLink = async () => {
		try {
			const partnerRef = doc(db, "partner", partnerType);

			await setDoc(
				partnerRef,
				{
					quickLinkVideo: videoInputValue,
					videoFileLink: null,
					PARTNER_TYPE: partnerType,
				},
				{ merge: true },
			);

			toast.success("Link Added Successfully");
			individualPartnerData();
		} catch (error) {
			toast.error("Error Adding Link");
		} finally {
			setVideoInputValue("");
			setIsEditingVideo(false);
		}
	};

	const getEmbedURL = (url) => {
		const regExp =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regExp);
		return match ? `https://www.youtube.com/embed/${match[1]}` : url;
	};

	const [isEditingFirst, setIsEditingFirst] = useState(false);
	const [isEditingSecond, setIsEditingSecond] = useState(false);
	const [isEditingThird, setIsEditingThird] = useState(false);
	const [isEditingContact, setIsEditingContact] = useState(false);

	const [FetchedVideoFileLink, setFetchedVideoFileLink] = useState("");

	const [firstInputValue, setFirstInputValue] = useState("");
	const [firstFetchedLink, setFirstFetchedLink] = useState("");

	const [secondInputValue, setSecondInputValue] = useState("");
	const [secondFetchedLink, setSecondFetchedLink] = useState("");

	const [thirdInputValue, setThirdInputValue] = useState("");
	const [thirdFetchedLink, setThirdFetchedLink] = useState("");

	const [contactInputValue, setContactInputValue] = useState("");
	const [contactFetchedLink, setContactFetchedLink] = useState("");

	const handleFirstIconClick = () => {
		setIsEditingFirst(!isEditingFirst);
	};

	const handleSecondIconClick = () => {
		setIsEditingSecond(!isEditingSecond);
	};

	const handleThirdIconClick = () => {
		setIsEditingThird(!isEditingThird);
	};

	const handleContactIconClick = () => {
		setIsEditingContact(!isEditingContact);
	};

	const handleFirstLink = async () => {
		try {
			const partnerRef = doc(db, "partner", partnerType);

			await setDoc(
				partnerRef,
				{
					quickLinkFirst: firstInputValue,
				},
				{ merge: true },
			);

			toast.success("Link Added Successfully");
			individualPartnerData();
		} catch (error) {
			toast.error("Error Adding Link");
		} finally {
			setFirstInputValue("");
			setIsEditingFirst(false);
		}
	};

	const handleSecondLink = async () => {
		try {
			const partnerRef = doc(db, "partner", partnerType);

			await setDoc(
				partnerRef,
				{
					quickLinkSecond: secondInputValue,
				},
				{ merge: true },
			);

			toast.success("Link Added Successfully");
			individualPartnerData();
		} catch (error) {
			toast.error("Error Adding Link");
		} finally {
			setSecondInputValue("");
			setIsEditingSecond(false);
		}
	};

	const handleThirdLink = async () => {
		try {
			const partnerRef = doc(db, "partner", partnerType);

			await setDoc(
				partnerRef,
				{
					quickLinkThird: thirdInputValue,
				},
				{ merge: true },
			);

			toast.success("Link Added Successfully");
			individualPartnerData();
		} catch (error) {
			toast.error("Error Adding Link");
		} finally {
			setThirdInputValue("");
			setIsEditingThird(false);
		}
	};

	const handleContactLink = async () => {
		try {
			const partnerRef = doc(db, "partner", partnerType);

			await setDoc(
				partnerRef,
				{
					quickLinkContact: contactInputValue,
				},
				{ merge: true },
			);

			toast.success("Link Added Successfully");
			individualPartnerData();
		} catch (error) {
			toast.error("Error Adding Link");
		} finally {
			setContactInputValue("");
			setIsEditingContact(false);
		}
	};

	const [isUploading, setisUploading] = useState(false);

	const handleVideoFileSelection = async (e) => {
		const file = e.target.files[0];
		setSelectedVideoFile(file);
		setisUploading(true);

		if (partnerType) {
			try {
				const partnerRef = doc(db, "partner", partnerType);

				const partnerDoc = await getDoc(partnerRef);
				const partnerData = partnerDoc.data();

				if (partnerData?.quickLinkVideo) {
					await updateDoc(partnerRef, { quickLinkVideo: null });
				}

				await handleVideoFileLink(file, partnerType);

				setisUploading(false);
			} catch (error) {
				console.error("Error handling video file selection:", error);
				toast.error("Error handling video file");
				setisUploading(false);
			}
		}
	};

	const individualPartnerData = async () => {
		if (!partnerType) return;

		try {
			const partnerRef = doc(db, "partner", partnerType);
			const updatedDoc = await getDoc(partnerRef);
			const data = updatedDoc.data();

			setFetchedVideoFileLink(data?.videoFileLink || "");
			setVideoFetchedLink(data?.quickLinkVideo || "");
			setFirstFetchedLink(data?.quickLinkFirst || "");
			setSecondFetchedLink(data?.quickLinkSecond || "");
			setThirdFetchedLink(data?.quickLinkThird || "");
			setContactFetchedLink(data?.quickLinkContact || "");
		} catch (error) {
			console.error("Error fetching partner data:", error);
			toast.error("Error fetching partner data");
		}
	};

	useEffect(() => {
		if (partnerType) {
			individualPartnerData();
		}
	});

	const [videoType, setvideoType] = useState("");

	const handleVideoTypeRender = (videoType) => {
		setvideoType(videoType);
	};

	const [selectedVideoFile, setSelectedVideoFile] = useState(null);

	const handleVideoFileLink = async (file, partnerType) => {
		const storageRef = ref(storage, `${partnerType}/${file.name}`);
		try {
			await uploadBytes(storageRef, file);

			const link = await getDownloadURL(storageRef);

			const partnerRef = doc(db, "partner", partnerType);
			await updateDoc(partnerRef, {
				videoFileLink: link,
				quickLinkVideo: null,
			});

			individualPartnerData();
			toast.success("Video Added Successfully");
			handleClose();
		} catch (error) {
			console.error("Error adding video:", error);
			toast.error("Error Adding Video");
		} finally {
			setSelectedVideoFile(null);
			setVideoInputValue("");
			setIsEditingVideo(false);
		}
	};

	const types = [
		"Property Manager",
		"Real Estate Agent",
		"Transaction Coordinator",
		"Home Inspection Company",
		"Mortgage Originator",
		"Moving Company",
	];

	return (
		<div className="max-w-3xl h-auto py-6 bg-white  rounded-lg">
			<ToastContainer />
			<div className="container px-4">
				<div className="mx-auto p-6 pb-1 border bg-white rounded-md shadow-dashboard">
					<div className="flex flex-wrap items-center justify-between mb-1 -m-2">
						<div className="w-auto p-2">
							<h2 className="text-xl font-semibold text-coolGray-900">
								Partner Types
							</h2>
							<p className="text-xs text-coolGray-500 font-medium">
								Manage details for your partner types
							</p>
						</div>
					</div>
					<div className="flex flex-wrap">
						{types.map((type, index) => (
							<div key={index} className="w-full border-b border-gray-300">
								<div className="flex flex-wrap items-center justify-between py-4 -m-2">
									<div className="w-auto p-2">
										<div className="flex flex-wrap items-center -m-2">
											{/* <div className="w-auto p-2">
												<div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-md">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														height="24"
														width="24"
													>
														<path
															fill="#F59E0B"
															d="M19 4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM5 18C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17V14.58L7.3 11.29C7.48693 11.1068 7.73825 11.0041 8 11.0041C8.26175 11.0041 8.51307 11.1068 8.7 11.29L15.41 18H5ZM20 17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H18.23L14.42 14.17L15.3 13.29C15.4869 13.1068 15.7382 13.0041 16 13.0041C16.2618 13.0041 16.5131 13.1068 16.7 13.29L20 16.58V17ZM20 13.76L18.12 11.89C17.5501 11.3424 16.7904 11.0366 16 11.0366C15.2096 11.0366 14.4499 11.3424 13.88 11.89L13 12.77L10.12 9.89C9.55006 9.34243 8.79036 9.03663 8 9.03663C7.20964 9.03663 6.44994 9.34243 5.88 9.89L4 11.76V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V13.76Z"
														></path>
													</svg>
												</div>
											</div> */}
											<div className="w-auto p-2">
												<h2 className="text-sm font-medium text-coolGray-900">
													{type}
												</h2>
												{/* <h3 className="text-xs font-medium text-coolGray-400">
													Description
												</h3> */}
											</div>
										</div>
									</div>
									<div className="w-auto p-2">
										<button
											className="bg-[#6DB23A] text-white px-2 py-1 md:py-2 md:px-4 rounded-lg hover:bg-[#5aa028]"
											onClick={() => handleOpen(type)}
										>
											Add Details
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
				Partner Type
			</h2>
			<div className="space-y-4">
				{types.map((type, index) => (
					<div
						key={index}
						className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
					>
						<span
							className="text-lg font-medium text-gray-700"
							onClick={() => handleOpen(type)}
						>
							{type}
						</span>
						<button
							className="bg-[#6DB23A] text-white py-2 px-4 rounded-lg hover:bg-[#5aa028]"
							onClick={() => handleOpen(type)}
						>
							Add Details
						</button>
					</div>
				))}
			</div> */}
			<Modal open={open} onClose={handleClose} aria-describedby="modal-data">
				<Box sx={style} noValidate>
					<div
						id="modal-data"
						className="w-full h-full flex flex-col justify-start items-center gap-3"
					>
						<div className="w-full h-auto flex flex-col justify-end items-end px-6 pt-6 py-3">
							<div
								onClick={() => {
									handleClose();
									setvideoType("");
								}}
								className="cursor-pointer"
							>
								<CloseOutlinedIcon
									style={{ fontSize: "40px" }}
									className="text-black hover:text-[#6c6969]"
								/>
							</div>
						</div>

						{/* Current Working Area */}
						<div className="w-[90vw] h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center px-4 lg:px-12 gap-5">
							<div className="w-full h-auto flex flex-col">
								<div className="w-full flex flex-col justify-center items-center">
									<div className="w-full h-12 mb-[30px] rounded-t-lg bg-[#6DB23A]"></div>

									{videoType === "link" && (
										<>
											<div className="w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-5 mt-5 px-2">
												<div className="w-full lg:w-[65%] h-auto flex flex-row justify-between lg:justify-center items-start">
													<div className="w-[85%] h-96 rounded-xl bg-gray-200 flex justify-center items-center">
														{videoFetchedLink ? (
															<iframe
																className="rounded-xl"
																width="100%"
																height="100%"
																src={getEmbedURL(videoFetchedLink)}
																title="Embedded Video"
																frameBorder="0"
																allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
																allowFullScreen
															></iframe>
														) : (
															<div className="font-semibold text-3xl">
																Video
															</div>
														)}
													</div>
													<div className="w-auto h-auto flex justify-start items-start p-4">
														<EditOutlinedIcon
															onClick={handleVideoIconClick}
															style={{ fontSize: "40px" }}
															className="text-[#6DB23A] hover:text-[#96d36b] cursor-pointer"
														/>
													</div>
												</div>
												<div className="w-full lg:w-[35%] h-auto flex flex-col justify-start items-start pl-2 lg:pl-0 mt-2">
													<div className="text-[#599032] text-xl font-bold py-2">
														{partnerType && videoFetchedLink ? (
															<div className="text-xl font-semibold cursor-pointer underline break-words">
																<p className="w-[78%]">{videoFetchedLink}</p>
															</div>
														) : (
															<span className="text-xl font-semibold">
																Currently, no link is set to display the video.
																Please click on edit to add the link
															</span>
														)}
													</div>
													{isEditingVideo && (
														<div className="w-full flex flex-row items-center mt-2">
															<TextField
																minRows={3}
																placeholder="Enter the link"
																value={videoInputValue}
																onChange={(e) =>
																	setVideoInputValue(e.target.value)
																}
																style={{
																	width: "100%",
																	paddingRight: "10px",
																	fontSize: "16px",
																}}
															/>
															<Button
																variant="contained"
																style={{
																	fontSize: "16px",
																	backgroundColor: "#6DB23A",
																	color: "white",
																}}
																onClick={handleVideoLink}
															>
																Submit
															</Button>
														</div>
													)}
												</div>
											</div>
										</>
									)}

									{videoType === "file" && (
										<>
											<div className="w-[80%] flex flex-col justify-center items-center">
												{FetchedVideoFileLink && (
													<video width="60%" height="240" controls>
														<source
															src={FetchedVideoFileLink}
															type="video/mp4"
														/>
													</video>
												)}
												{!FetchedVideoFileLink && (
													<div className="w-[60%] h-[240px] rounded-lg shadow-lg flex flex-col justify-center items-center">
														<p className="text-lg">No Video File Uploaded.</p>
													</div>
												)}
												<label
													className="block mb-2 text-sm font-medium text-white"
													htmlFor="file_input"
												>
													Upload file
												</label>
												<input
													type="file"
													accept="video/*"
													onChange={handleVideoFileSelection}
													className="block w-[60%] text-sm text-gray-900  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
													id="file_input"
												/>
												{isUploading && (
													<>
														<LinearProgress
															color="success"
															sx={{
																width: "50%",
																height: "10px",
																marginTop: "20px",
															}}
														/>
													</>
												)}
											</div>
										</>
									)}

									{videoType === "" && (
										<div className="w-full flex-row flex gap-5 justify-center items-center">
											<div
												onClick={() => handleVideoTypeRender("file")}
												className="w-fit hover:scale-105 transition-all ease-in-out delay-200 cursor-pointer flex flex-col justify-center items-center rounded-lg shadow-lg p-5"
											>
												<p className="font-semibold text-1xl">Add Video File</p>
												<VideoLibraryIcon />
											</div>

											<p className="font-bold text-2xl text-center">Or</p>

											<div
												onClick={() => handleVideoTypeRender("link")}
												className="w-fit hover:scale-105 transition-all ease-in-out delay-200 cursor-pointer flex flex-col justify-center items-center rounded-lg shadow-lg p-5"
											>
												<p className="font-semibold text-1xl">Add Video Link</p>
												<LinkIcon />
											</div>
										</div>
									)}
								</div>

								<div className=" w-full flex flex-col justify-center items-center mt-10 ">
									<div className="w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]">
										Quick Links
									</div>
									<div className="w-full h-auto flex flex-col lg:flex-row justify-around items-start gap-3 lg:gap-1 my-4 px-4">
										{/* Links */}
										<div className="w-full lg:max-w-[50%] flex flex-col justify-center items-center">
											<div className="w-full flex flex-row justify-start items-start">
												<div className="w-full flex flex-col justify-start items-start py-2 px-2 bg-gray-200">
													<div className="text-lg text-[#6DB23A] font-bold break-words">
														Click Here to Schedule a Call
													</div>
													<div className="text-base text-[#599032] font-semibold break-words">
														{partnerType && firstFetchedLink ? (
															<Link
																to={firstFetchedLink}
																className="underline cursor-pointer break-words"
																style={{
																	maxWidth: "100%",
																	wordBreak: "break-word",
																}}
															>
																{firstFetchedLink}
															</Link>
														) : (
															<span>No Link Available</span>
														)}
													</div>
												</div>
												<div className="w-auto flex justify-start items-start p-4">
													<EditOutlinedIcon
														style={{ fontSize: "40px" }}
														className="text-[#6DB23A] hover:text-[#96d36b] cursor-pointer"
														onClick={handleFirstIconClick}
													/>
												</div>
											</div>
											{isEditingFirst && (
												<div className="w-full flex flex-row justify-start items-center mt-2 lg:pr-20">
													<TextField
														minRows={3}
														placeholder="Enter the link"
														value={firstInputValue}
														onChange={(e) => setFirstInputValue(e.target.value)}
														style={{
															width: "100%",
															paddingRight: "10px",
															fontSize: "16px",
														}}
													/>
													<Button
														variant="contained"
														style={{
															fontSize: "16px",
															backgroundColor: "#6DB23A",
															color: "white",
														}}
														onClick={handleFirstLink}
													>
														Submit
													</Button>
												</div>
											)}
										</div>
										{/* Links */}
										{/* Links */}
										<div className="w-full lg:max-w-[50%] flex flex-col justify-center items-center">
											<div className="w-full flex flex-row justify-start items-start">
												<div className="w-full flex flex-col justify-start items-start py-2 px-2 bg-gray-200">
													<div className="text-lg text-[#6DB23A] font-bold break-words">
														Go to Settling in Concierge
													</div>
													<div className="text-base text-[#599032] font-semibold break-words">
														{partnerType && secondFetchedLink ? (
															<Link
																to={secondFetchedLink}
																className="underline cursor-pointer break-words"
																style={{
																	maxWidth: "100%",
																	wordBreak: "break-word",
																}}
															>
																{secondFetchedLink}
															</Link>
														) : (
															<span>No Link Available</span>
														)}
													</div>
												</div>
												<div className="w-auto flex justify-start items-start p-4">
													<EditOutlinedIcon
														style={{ fontSize: "40px" }}
														className="text-[#6DB23A] hover:text-[#96d36b] cursor-pointer"
														onClick={handleSecondIconClick}
													/>
												</div>
											</div>
											{isEditingSecond && (
												<div className="w-full flex flex-row items-center mt-2 lg:pr-20">
													<TextField
														minRows={3}
														placeholder="Enter the link"
														value={secondInputValue}
														onChange={(e) =>
															setSecondInputValue(e.target.value)
														}
														style={{
															width: "100%",
															paddingRight: "10px",
															fontSize: "16px",
														}}
													/>
													<Button
														variant="contained"
														style={{
															fontSize: "16px",
															backgroundColor: "#6DB23A",
															color: "white",
														}}
														onClick={handleSecondLink}
													>
														Submit
													</Button>
												</div>
											)}
										</div>
										{/* Links */}
									</div>
									<div className="w-full h-auto flex flex-col lg:flex-row justify-around items-start gap-3 lg:gap-1 px-4">
										{/* Links */}
										<div className="w-full lg:max-w-[50%] flex flex-col justify-center items-center">
											<div className="w-full flex flex-row justify-start items-start">
												<div className="w-full flex flex-col justify-start items-start py-2 px-2 bg-gray-200">
													<div className="text-lg text-[#6DB23A] font-bold break-words">
														Email Support Team
													</div>
													<div className="text-base text-[#599032] font-semibold break-words">
														{partnerType && thirdFetchedLink ? (
															<Link
																to={thirdFetchedLink}
																className="underline cursor-pointer break-words"
																style={{
																	maxWidth: "100%",
																	wordBreak: "break-word",
																}}
															>
																{thirdFetchedLink}
															</Link>
														) : (
															<span>No Link Available</span>
														)}
													</div>
												</div>
												<div className="w-auto flex justify-start items-start p-4">
													<EditOutlinedIcon
														style={{ fontSize: "40px" }}
														className="text-[#6DB23A] hover:text-[#96d36b] cursor-pointer"
														onClick={handleThirdIconClick}
													/>
												</div>
											</div>
											{isEditingThird && (
												<div className="w-full flex flex-row items-center mt-2 lg:pr-20">
													<TextField
														minRows={3}
														placeholder="Enter the link"
														value={thirdInputValue}
														onChange={(e) => setThirdInputValue(e.target.value)}
														style={{
															width: "100%",
															paddingRight: "10px",
															fontSize: "16px",
														}}
													/>
													<Button
														variant="contained"
														style={{
															fontSize: "16px",
															backgroundColor: "#6DB23A",
															color: "white",
														}}
														onClick={handleThirdLink}
													>
														Submit
													</Button>
												</div>
											)}
										</div>
										{/* Links */}
										{/* Button */}

										{/* Button */}
									</div>
								</div>

								<div className=" w-full flex flex-col justify-center items-center my-10">
									<div className="w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]">
										{" "}
										Contact My Account Executive{" "}
									</div>
									<div className="w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-3 lg:gap-1 my-4 px-4">
										{/* Links */}
										<div className="w-full lg:max-w-[50%] flex flex-col justify-center items-center">
											<div className="w-full flex flex-row justify-start items-start">
												<div className="w-full flex flex-col justify-start items-start py-2 px-2 bg-gray-200">
													<div className="text-lg text-[#6DB23A] font-bold break-words">
														Contact Number
													</div>
													<div className="text-base text-[#599032] font-semibold break-words">
														{partnerType && contactFetchedLink ? (
															<Link
																to={contactFetchedLink}
																className="cursor-pointer break-words"
																style={{
																	maxWidth: "100%",
																	wordBreak: "break-word",
																}}
															>
																{contactFetchedLink}
															</Link>
														) : (
															<span>No Number Available</span>
														)}
													</div>
												</div>
												<div className="w-auto flex justify-start items-start p-4">
													<EditOutlinedIcon
														style={{ fontSize: "40px" }}
														className="text-[#6DB23A] hover:text-[#96d36b] cursor-pointer"
														onClick={handleContactIconClick}
													/>
												</div>
											</div>
											{isEditingContact && (
												<div className="w-full flex flex-row items-center mt-2 lg:pr-20">
													<TextField
														minRows={3}
														placeholder="Enter the Number"
														value={contactInputValue}
														onChange={(e) =>
															setContactInputValue(e.target.value)
														}
														style={{
															width: "100%",
															paddingRight: "10px",
															fontSize: "16px",
														}}
													/>
													<Button
														variant="contained"
														style={{
															fontSize: "16px",
															backgroundColor: "#6DB23A",
															color: "white",
														}}
														onClick={handleContactLink}
													>
														Submit
													</Button>
												</div>
											)}
										</div>
										{/* Links */}
									</div>
								</div>
							</div>
						</div>
						{/* Current Working Area */}
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default PartnerType;
