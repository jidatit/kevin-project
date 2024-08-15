import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
	collection,
	doc,
	getDocs,
	getDoc,
	query,
	orderBy,
	where,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddReferral from "./AddReferral";
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

const styleReferral = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "1px solid #000",
	borderRadius: "8px",
	boxShadow: 24,
	overflow: "auto",
	maxHeight: "90vh",
};

const UsersTable = () => {
	const [productList, setProductList] = useState([]);
	const [rowsLimit] = useState(5);
	const [rowsToShow, setRowsToShow] = useState([]);
	const [customPagination, setCustomPagination] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [selectedFilter, setSelectedFilter] = useState("");

	const [userID, SetUserID] = useState("");

	const handleClose = () => setOpen(false);
	const handleCloseChild = () => setOpenChild(false);

	const handleOpenReferral = async (id) => {
		setOpenReferral(true);
		try {
			const userRef = doc(db, "users", id);
			const updatedDoc = await getDoc(userRef);
			const data = updatedDoc.data();
			setFetchReferral(data.referralLink);
		} catch (error) {
			console.log("Error : ", error);
		}
	};

	const fetchUsersData = async (filter) => {
		try {
			const usersRef = collection(db, "users");

			let q;

			// Default order by "Newest" (createdAt in descending order)
			if (filter === "newest") {
				q = query(usersRef, orderBy("createdAt", "desc"));
			} else if (filter === "oldest") {
				// Order by "Oldest" (createdAt in ascending order)
				q = query(usersRef, orderBy("createdAt", "asc"));
			} else if (filter === "1") {
				// Filter by Today
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				q = query(
					usersRef,
					where("createdAt", ">=", today),
					orderBy("createdAt", "desc"),
				);
			} else if (filter === "7") {
				// Filter by Last Week
				const lastWeek = new Date();
				lastWeek.setDate(lastWeek.getDate() - 7);
				q = query(
					usersRef,
					where("createdAt", ">=", lastWeek),
					orderBy("createdAt", "desc"),
				);
			} else if (filter === "30") {
				// Filter by Last Month
				const lastMonth = new Date();
				lastMonth.setDate(lastMonth.getDate() - 30);
				q = query(
					usersRef,
					where("createdAt", ">=", lastMonth),
					orderBy("createdAt", "desc"),
				);
			} else {
				// Default to Newest if no filter is applied
				q = query(usersRef, orderBy("createdAt", "desc"));
			}

			const querySnapshot = await getDocs(q);
			const usersData = [];
			querySnapshot.forEach((doc) => {
				usersData.push({ id: doc.id, ...doc.data() });
			});
			setProductList(usersData);
		} catch (error) {
			console.error("Error fetching users data: ", error);
		}
	};

	useEffect(() => {
		fetchUsersData(selectedFilter);
	}, [selectedFilter]);

	const nextPage = () => {
		const startIndex = rowsLimit * (currentPage + 1);
		const endIndex = startIndex + rowsLimit;
		const newArray = productList.slice(startIndex, endIndex);
		setRowsToShow(newArray);
		setCurrentPage(currentPage + 1);
	};

	const changePage = (value) => {
		const startIndex = value * rowsLimit;
		const endIndex = startIndex + rowsLimit;
		const newArray = productList.slice(startIndex, endIndex);
		setRowsToShow(newArray);
		setCurrentPage(value);
	};

	const previousPage = () => {
		const startIndex = (currentPage - 1) * rowsLimit;
		const endIndex = startIndex + rowsLimit;
		const newArray = productList.slice(startIndex, endIndex);
		setRowsToShow(newArray);

		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		} else {
			setCurrentPage(0);
		}
	};

	useMemo(() => {
		setCustomPagination(
			Array(Math.ceil(productList?.length / rowsLimit)).fill(null),
		);
	}, []);

	useEffect(() => {
		fetchUsersData(selectedFilter);
	}, []);

	useEffect(() => {
		setRowsToShow(productList.slice(0, rowsLimit));
		setCustomPagination([...Array(totalPage).keys()]);
	}, [productList]);

	const totalPage = useMemo(
		() => Math.ceil(productList.length / rowsLimit),
		[productList.length, rowsLimit],
	);

	const handleFilterChange = (e) => {
		setSelectedFilter(e.target.value); // Update selected filter
	};

	return (
		<>
			<div className=" w-full flex flex-col justify-center items-center">
				<ToastContainer />
				<div className="w-full h-16 flex flex-row justify-end items-center rounded-t-lg text-white font-semibold text-base gap-4 pt-3 pl-10 pr-10 bg-[#6DB23A]">
					<form className="h-auto mt-[-12px] cursor-pointer">
						<select
							id="filter"
							className="bg-gray-50 text-gray-900 text-sm rounded-lg w-full py-2 px-4"
							defaultValue=""
							onChange={handleFilterChange} // Handle filter change
						>
							<option value="" disabled>
								Filter by Time
							</option>
							<option value="newest">Newest</option>
							<option value="oldest">Oldest</option>
							<option value="1">Today</option>
							<option value="7">Last Week</option>
							<option value="30">Last Month</option>
						</select>
					</form>
				</div>
			</div>

			<div className="h-full bg-white flex items-center justify-center py-4">
				<div className="w-full px-2">
					<div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none mt-2">
						<table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
							<thead className="rounded-lg text-base text-white font-semibold w-full border-t-2 border-gray-300 pt-6 pb-6">
								<tr>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										First Name
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Last Name
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Email
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Phone No.
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Status
									</th>
									{/* <th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										User Type
									</th> */}
								</tr>
							</thead>
							<tbody>
								{rowsToShow &&
									rowsToShow?.map((data, index) => (
										<tr
											className={`${
												index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
											}`}
											key={index}
										>
											<td
												className={`py-2 px-3 font-normal text-base ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{data?.name.split(" ")[0]}
											</td>
											<td
												className={`py-2 px-3 font-normal text-base ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{data?.name.split(" ")[1]}
											</td>
											<td
												className={`py-2 px-3 font-normal text-base ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{data?.email}
											</td>
											<td
												className={`py-2 px-3 text-base  font-normal ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{data?.phoneNumber}
											</td>
											<td
												className={`py-2 px-3 text-base  font-normal ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{"Active"}
											</td>
											{/* <td
												className={`py-2 px-3 text-base  font-normal ${
													index == 0
														? "border-t-2 border-gray-300"
														: index == rowsToShow?.length
															? "border-y"
															: "border-t"
												} whitespace-nowrap`}
											>
												{data?.userType}
											</td> */}
										</tr>
									))}
							</tbody>
						</table>
					</div>

					<div className="w-full flex justify-center sm:justify-between xl:flex-row flex-col gap-10 mt-12 lg:mt-8 px-0 lg:px-4 xl:px-4 items-center">
						<div className="text-base text-center">
							Showing
							<span className="font-bold bg-[#6DB23A] text-white mx-2 p-2 text-center rounded-lg">
								{" "}
								{currentPage == 0 ? 1 : currentPage * rowsLimit + 1}{" "}
							</span>
							to{" "}
							<span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
								{currentPage == totalPage - 1
									? productList?.length
									: (currentPage + 1) * rowsLimit}
							</span>{" "}
							of{" "}
							<span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
								{productList?.length}
							</span>
							entries
						</div>
						<div className="flex">
							<ul
								className="flex justify-center items-center gap-x-[10px] z-30"
								role="navigation"
								aria-label="Pagination"
							>
								<li
									className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
										currentPage == 0
											? "bg-[#cccccc] pointer-events-none"
											: " cursor-pointer"
									}`}
									onClick={previousPage}
								>
									<img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
								</li>
								{customPagination?.map((data, index) => (
									<li
										className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-solid border-[2px] cursor-pointer ${
											currentPage == index
												? "text-white bg-[#6DB23A]"
												: "border-[#E4E4EB]"
										}`}
										onClick={() => changePage(index)}
										key={index}
									>
										{index + 1}
									</li>
								))}
								<li
									className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
										currentPage == totalPage - 1
											? "bg-[#cccccc] pointer-events-none"
											: " cursor-pointer"
									}`}
									onClick={nextPage}
								>
									<img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default UsersTable;
