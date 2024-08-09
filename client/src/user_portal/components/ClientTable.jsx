import { useState, useMemo, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import TuneIcon from "@mui/icons-material/Tune";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../AuthContext";
import { db } from "../../../Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownloadCsv from "./DownloadCsv";

const Loader = () => {
	return (
		<div className="mt-44 text-center flex justify-center flex-col ">
			<div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#6DB23A] mx-auto"></div>
			<h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
			<p className="text-zinc-600 dark:text-gray-600">Waiting for data</p>
		</div>
	);
};

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	overflow: "auto",
	maxHeight: "80vh",
};

const ClientTable = () => {
	const [leadsData, setLeadsData] = useState([]);
	const [dataWithLeadId, setDataWithLeadId] = useState([]);
	const [filteredLeadsData, setFilteredLeadsData] = useState([]);
	const [showOrHideFilters, setShowOrHideFilters] = useState(false);
	const [rowPerPage, setRowPerPage] = useState(10);
	const [rowsToShow, setRowsToShow] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [loading, setLoading] = useState(false);

	const { currentUser } = useAuth();
	const userID = currentUser?.uid;

	const showFilters = () => {
		setShowOrHideFilters((prev) => !prev);
	};

	const handleRowPerPageChange = (event) => {
		setRowPerPage(event.target.value);
	};

	const [openFirst, setOpenFirst] = useState(false);
	const handleOpenFirst = (leadData) => () => {
		setOpenFirst(true);
		setDataWithLeadId(leadData);
	};
	const handleCloseFirst = () => setOpenFirst(false);

	useEffect(() => {
		getLeadsData();
	}, []);

	useEffect(() => {
		setRowsToShow(filteredLeadsData.slice(0, rowPerPage));
	}, [filteredLeadsData, rowPerPage]);

	const totalPage = useMemo(
		() => Math.ceil(filteredLeadsData.length / rowPerPage),
		[filteredLeadsData.length, rowPerPage],
	);

	const generatePaginationLinks = () => {
		const paginationLinks = [];
		const ellipsis = "...";

		if (totalPage <= 7) {
			for (let i = 1; i <= totalPage; i++) {
				paginationLinks.push(i);
			}
		} else {
			if (currentPage <= 4) {
				for (let i = 1; i <= 5; i++) {
					paginationLinks.push(i);
				}
				paginationLinks.push(ellipsis);
				paginationLinks.push(totalPage);
			} else if (currentPage >= totalPage - 3) {
				paginationLinks.push(1);
				paginationLinks.push(ellipsis);
				for (let i = totalPage - 4; i <= totalPage; i++) {
					paginationLinks.push(i);
				}
			} else {
				paginationLinks.push(1);
				paginationLinks.push(ellipsis);

				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					paginationLinks.push(i);
				}

				paginationLinks.push(ellipsis);
				paginationLinks.push(totalPage);
			}
		}
		return paginationLinks;
	};

	const getLeadsData = async () => {
		setLoading(true);
		if (!userID) return;

		try {
			const userRef = doc(db, "users", userID);
			const dataDoc = await getDoc(userRef);
			if (dataDoc) {
				const userDataDB = dataDoc.data();
				console.log("UserData: ", userDataDB);

				const response = await axios.post(
					"https://kevin-project.onrender.com/api/zoho",
					{ email: userDataDB.email },
				);

				const userTypeDataList = response.data.data;

				let leadsData = null;
				for (let userTypeData of userTypeDataList) {
					console.log("Zoho CRM Data: ", userTypeData);

					if (userTypeData.LEAD_Source1) {
						console.log("Lead Source: ", userTypeData.LEAD_Source1);
						const pmResponse = await axios.post(
							"https://kevin-project.onrender.com/api/pmData",
							{ LEAD_Source1: userTypeData.LEAD_Source1 },
						);
						const responsePMData = pmResponse.data.data;
						console.log("PM Data: ", responsePMData);
						leadsData = responsePMData;
						break;
					}

					if (userTypeData.AGENT_RF_CODE) {
						console.log("Agent Reference Code: ", userTypeData.AGENT_RF_CODE);
						const agentResponse = await axios.post(
							"https://kevin-project.onrender.com/api/agentData",
							{ AGENT_RF_CODE: userTypeData.AGENT_RF_CODE },
						);
						const responseAgentsData = agentResponse.data.data;
						console.log("Agent Data: ", responseAgentsData);
						leadsData = responseAgentsData;
						break;
					}
				}

				if (leadsData) {
					setLeadsData(leadsData);
				} else {
					console.log("No matching leads data found.");
				}

				setLoading(false);
			} else {
				console.log("No such document!");
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.error("Error fetching user data: ", error);
			toast.error("No authorized Token");
		}
	};

	const nextPage = () => {
		const startIndex = rowPerPage * (currentPage + 1);
		const endIndex = startIndex + rowPerPage;
		const newArray = filteredLeadsData.slice(startIndex, endIndex);
		setRowsToShow(newArray);
		setCurrentPage(currentPage + 1);
	};

	const changePage = (value) => {
		const startIndex = value * rowPerPage;
		const endIndex = startIndex + rowPerPage;
		const newArray = filteredLeadsData.slice(startIndex, endIndex);
		setRowsToShow(newArray);
		setCurrentPage(value);
	};

	const previousPage = () => {
		const startIndex = (currentPage - 1) * rowPerPage;
		const endIndex = startIndex + rowPerPage;
		const newArray = filteredLeadsData.slice(startIndex, endIndex);
		setRowsToShow(newArray);
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		} else {
			setCurrentPage(0);
		}
	};

	const [filters, setFilters] = useState({
		fullName: "",
		createdTimeFrom: null,
		createdTimeTo: null,
		sortOrder: "asc",
		leadStatus: "",
	});

	const resetFilterData = () => {
		setFilters({
			fullName: "",
			createdTimeFrom: null,
			createdTimeTo: null,
			sortOrder: "asc",
			leadStatus: "",
		});
	};

	const applyFilters = () => {
		let filtered = leadsData;
		if (leadsData) {
			if (filters.fullName) {
				filtered = filtered.filter((item) =>
					item.Full_Name.toLowerCase().includes(filters.fullName.toLowerCase()),
				);
			}

			if (filters.createdTimeFrom) {
				filtered = filtered.filter(
					(item) =>
						new Date(item.Created_Time) >= new Date(filters.createdTimeFrom),
				);
			}

			if (filters.createdTimeTo) {
				filtered = filtered.filter(
					(item) =>
						new Date(item.Created_Time) <= new Date(filters.createdTimeTo),
				);
			}

			if (filters.sortOrder) {
				filtered = filtered.sort((a, b) => {
					const dateA = new Date(a.Created_Time);
					const dateB = new Date(b.Created_Time);
					return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
				});
			}

			if (filters.leadStatus) {
				filtered = filtered.filter(
					(item) =>
						item.Lead_Status &&
						item.Lead_Status.toLowerCase() === filters.leadStatus.toLowerCase(),
				);
			}

			setFilteredLeadsData(filtered);
			console.log("filtereddata", filteredLeadsData);
		}
	};

	useEffect(() => {
		applyFilters();
	}, [filters, leadsData]);

	const handleFilterChange = (event) => {
		const { name, value } = event.target;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}));
	};

	const handleDateChange = (name, date) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: date,
		}));
	};

	const handleSortOrderChange = (event) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			sortOrder: event.target.value,
		}));
	};

	// Extract unique lead statuses from leadsData
	const uniqueLeadStatuses = useMemo(() => {
		const statuses = leadsData.map((lead) => lead.Lead_Status);
		return [...new Set(statuses)];
	}, [leadsData]);
	return (
		<>
			<div className=" flex flex-row-reverse items-end">
				<DownloadCsv rowsToShow={filteredLeadsData} />
			</div>
			<ToastContainer />
			<div className="w-full flex flex-col justify-center items-center">
				<div className="w-full h-16 flex flex-row justify-end items-center rounded-t-lg pr-10 bg-[#6DB23A]">
					<div
						onClick={showFilters}
						className="flex flex-row justify-end items-center gap-3 font-semibold text-base text-white cursor-pointer"
					>
						<button> Filter </button>
						<TuneIcon />
					</div>
				</div>
			</div>

			{showOrHideFilters === true ? (
				<>
					<div className="w-full flex flex-col lg:flex-row justify-evenly items-center px-4 pt-4 gap-4">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
								<TextField
									label="Full Name"
									variant="outlined"
									size="large"
									name="fullName"
									value={filters.fullName}
									onChange={handleFilterChange}
									className="w-full"
								/>
								<DatePicker
									label="Created Time From"
									value={filters.createdTimeFrom}
									onChange={(date) => handleDateChange("createdTimeFrom", date)}
									renderInput={(params) => (
										<TextField {...params} size="small" />
									)}
									className="w-full"
								/>
								<DatePicker
									label="Created Time To"
									value={filters.createdTimeTo}
									onChange={(date) => handleDateChange("createdTimeTo", date)}
									renderInput={(params) => (
										<TextField {...params} size="small" />
									)}
									className="w-full"
								/>
								<FormControl size="small" variant="outlined" className="w-full">
									<InputLabel>Sort Order</InputLabel>
									<Select
										value={filters.sortOrder}
										size="small"
										name="sortOrder"
										onChange={handleSortOrderChange}
										label="Sort Order"
									>
										<MenuItem value="asc">Ascending</MenuItem>
										<MenuItem value="desc">Descending</MenuItem>
									</Select>
								</FormControl>
								<FormControl size="small" variant="outlined" className="w-full">
									<InputLabel>Lead Status</InputLabel>
									<Select
										value={filters.leadStatus}
										size="small"
										name="leadStatus"
										onChange={handleFilterChange}
										label="Lead Status"
									>
										<MenuItem value="">All</MenuItem>
										{uniqueLeadStatuses.map((status, index) => (
											<MenuItem key={index} value={status}>
												{status}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<div
									onClick={resetFilterData}
									className="flex flex-row justify-center items-center gap-3 text-base text-gray-900 cursor-pointer border border-gray-300 rounded-lg py-2 px-4 w-full"
								>
									<button>Reset</button>
									<TuneIcon />
								</div>
							</div>
						</LocalizationProvider>
					</div>
				</>
			) : (
				<></>
			)}

			<div className="h-full bg-white flex items-center justify-center py-4">
				<div className="w-full px-2">
					<div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2 ">
						<table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
							<thead className="rounded-lg text-base text-white font-semibold w-full border-t-2 border-gray-300 pt-6 pb-6">
								<tr>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Full Name
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Created Time
									</th>
									<th className="py-3 px-3 justify-center gap-1 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Sold Date
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Lead Status
									</th>
									<th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
										Details
									</th>
									<th className="flex items-center py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap gap-1">
										CSV
									</th>
								</tr>
							</thead>
							{console.log("rows ", rowsToShow)}
							{rowsToShow ? (
								<tbody>
									{rowsToShow?.map((data, index) => (
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
												{!data?.Full_Name ? (
													<div> - </div>
												) : (
													<div>{data.Full_Name}</div>
												)}
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
												{!data?.Created_Time ? (
													<div> - </div>
												) : (
													<div>{data.Created_Time}</div>
												)}
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
												{!data?.Sold_Date ? (
													<div> - </div>
												) : (
													<div>{data.Sold_Date}</div>
												)}
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
												{!data?.Lead_Status ? (
													<div> - </div>
												) : (
													<div>{data.Lead_Status}</div>
												)}
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
												<button
													onClick={handleOpenFirst(data)}
													className="bg-[#6DB23A] rounded-3xl text-white py-1 px-4"
												>
													View Details
												</button>
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
												<CSVLink
													data={[
														[
															"Record ID",
															"Full Name",
															"Est Move Date",
															"Created Time",
															"Sold Date",
															"First Name",
															"Last Name",
															"Lead Status",
															"Provider",
															"Internet Sold",
															"TV Sold",
															"Phone Sold",
															"Move Quote Request",
															"Home Monitoring",
															"Utilities Set up",
															"COA / DMV / Voter Update",
															"New State",
															"New City",
															"Call status notes",
															"Electric ACCT",
															"Gas ACCT",
															"Renters Insurance Policy",
															"Agent APP Credentials",
															"Agent Pay Preference",
															"Discount Portal",
															"Agent Reimbursement",
														],
														[
															data?.id,
															data?.Full_Name,
															data?.Est_Move_Date,
															data?.Created_Time,
															data?.Sold_Date,
															data?.First_Name,
															data?.Last_Name,
															data?.Lead_Status,
															data?.Provider,
															data?.Internet_Sold,
															data?.T_V_Sold,
															data?.Phone_Sold,
															data?.Move_Ref_Sold,
															data?.Home_Monitoring,
															data?.Utilities_set_up,
															data?.Change_of_Address,
															data?.New_State,
															data?.New_City,
															data?.Call_DispositionX,
															data?.Electric_AccT,
															data?.Gas_AccT,
															data?.Renters_Insurance_Policy,
															data?.Agent_APP_Credentials,
															data?.Agent_Preferred_Method_of_Reward_Fulfillment,
															"-",
															data?.Agent_Reimbursement,
														],
													]}
													filename={`lead_${data.id}.csv`}
													className="bg-[#F2B145] rounded-3xl text-white py-1 px-4"
												>
													Download CSV
												</CSVLink>
											</td>
										</tr>
									))}
								</tbody>
							) : (
								"No data found"
							)}
						</table>
					</div>

					<div className="w-full flex flex-col lg:flex-row justify-center sm:justify-between gap-4 sm:gap-10 mt-8 px-0 lg:px-4 xl:px-4 items-center">
						{/* Showing entries information */}
						<div className="text-base text-center">
							Showing
							<span className="font-bold bg-[#6DB23A] text-white mx-2 p-2 text-center rounded-lg">
								{currentPage === 0 ? 1 : currentPage * rowPerPage + 1}
							</span>
							to
							<span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
								{currentPage === totalPage - 1
									? leadsData?.length
									: (currentPage + 1) * rowPerPage}
							</span>
							of
							<span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
								{leadsData?.length}
							</span>
							entries
						</div>

						{/* Rows per page selection */}
						<div className="flex flex-col sm:flex-row justify-center items-center gap-4">
							<div> Rows Per Page </div>
							<Box sx={{ width: 200 }}>
								<FormControl fullWidth>
									<Select
										id="rows-per-page"
										value={rowPerPage}
										onChange={handleRowPerPageChange}
										sx={{
											height: 40,
											backgroundColor: "#6DB23A",
											color: "white",
											borderRadius: "8px",
											".MuiOutlinedInput-notchedOutline": {
												borderColor: "transparent",
											},
											"&:hover .MuiOutlinedInput-notchedOutline": {
												borderColor: "transparent",
											},
											"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
												borderColor: "transparent",
											},
											".MuiSelect-icon": {
												color: "white",
											},
											"& .MuiSelect-select": {
												borderRadius: "8px",
											},
											"& .MuiListItem-root": {
												"&:hover": {
													backgroundColor: "white",
													color: "black",
												},
											},
											"& .Mui-selected": {
												backgroundColor: "white",
												color: "black",
											},
										}}
									>
										<MenuItem value={5}>5</MenuItem>
										<MenuItem value={10}>10</MenuItem>
										<MenuItem value={15}>15</MenuItem>
										<MenuItem value={20}>20</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</div>

						{/* Pagination controls */}
						<div className="flex justify-center">
							<ul
								className="flex justify-center items-center gap-x-2 z-30"
								role="navigation"
								aria-label="Pagination"
							>
								<li
									className={`prev-btn flex items-center justify-center w-9 h-9 rounded-md border ${
										currentPage == 0
											? "bg-[#cccccc] pointer-events-none"
											: " cursor-pointer border-[#E4E4EB]"
									}`}
									onClick={previousPage}
								>
									<img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
								</li>

								{generatePaginationLinks().map((item, index) => (
									<li
										key={index}
										onClick={() => changePage(item - 1)}
										className={`flex items-center justify-center w-9 h-9 rounded-md border ${
											currentPage === item - 1
												? "text-white bg-[#6DB23A] border-[#6DB23A]"
												: "border-[#E4E4EB]"
										}`}
									>
										<span aria-hidden="true">{item}</span>
									</li>
								))}

								<li
									className={`flex items-center justify-center w-9 h-9 rounded-md border ${
										currentPage == totalPage - 1
											? "bg-[#cccccc] pointer-events-none"
											: " cursor-pointer border-[#E4E4EB]"
									}`}
									onClick={nextPage}
								>
									<img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
								</li>
							</ul>
						</div>
					</div>

					<Modal
						open={openFirst}
						onClose={handleCloseFirst}
						aria-describedby="modal-data"
					>
						<Box sx={style} noValidate>
							<div
								id="modal-data"
								className="w-full h-full flex flex-col justify-start items-center gap-3"
							>
								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<h2 className="text-xl font-bold">Lead Details</h2>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Record ID </label>
										<TextField
											sx={{ width: "100%" }}
											id="recordID"
											value={!dataWithLeadId.id ? "---" : dataWithLeadId.id}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Full Name </label>
										<TextField
											sx={{ width: "100%" }}
											id="fullNameID"
											value={
												!dataWithLeadId.Full_Name
													? "---"
													: dataWithLeadId.Full_Name
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Est Move Date{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="moveDataID"
											value={
												!dataWithLeadId.Est_Move_Date
													? "---"
													: dataWithLeadId.Est_Move_Date
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Created Time{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="createdTimeID"
											value={
												!dataWithLeadId.Created_Time
													? "---"
													: dataWithLeadId.Created_Time
											}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Sold Date </label>
										<TextField
											sx={{ width: "100%" }}
											id="solidDateID"
											value={
												!dataWithLeadId.Sold_Date
													? "---"
													: dataWithLeadId.Sold_Date
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											First Name{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="firstNameID"
											value={
												!dataWithLeadId.First_Name
													? "---"
													: dataWithLeadId.First_Name
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Last Name </label>
										<TextField
											sx={{ width: "100%" }}
											id="lastNameID"
											value={
												!dataWithLeadId.Last_Name
													? "---"
													: dataWithLeadId.Last_Name
											}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Lead Status{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="leadStatusID"
											value={
												!dataWithLeadId.Lead_Status
													? "---"
													: dataWithLeadId.Lead_Status
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Provider </label>
										<TextField
											sx={{ width: "100%" }}
											id="providerID"
											value={
												!dataWithLeadId.Provider
													? "---"
													: dataWithLeadId.Provider
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Internet Sold{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="internetSolidID"
											value={!dataWithLeadId.Internet_Sold ? "false" : "true"}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> TV Sold </label>
										<TextField
											sx={{ width: "100%" }}
											id="tvSolidID"
											value={!dataWithLeadId.T_V_Sold ? "false" : "true"}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Phone Sold{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="phoneSolidID"
											value={!dataWithLeadId.Phone_Sold ? "false" : "true"}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Move Quote Request{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="moveQuoteRequestID"
											value={!dataWithLeadId.Move_Ref_Sold ? "false" : "true"}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Home Monitoring{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="homeMonitoringID"
											value={
												!dataWithLeadId.Home_Monitoring
													? "---"
													: dataWithLeadId.Home_Monitoring
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Utilities Set up{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="utilitiesSetUpID"
											value={
												!dataWithLeadId.Utilities_set_up
													? "---"
													: dataWithLeadId.Utilities_set_up
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											COA / DMV / Voter Update{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="voterUpdateID"
											value={
												!dataWithLeadId.Change_of_Address ? "false" : "true"
											}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> New State </label>
										<TextField
											sx={{ width: "100%" }}
											id="newStateID"
											value={
												!dataWithLeadId.New_State
													? "---"
													: dataWithLeadId.New_State
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> New City </label>
										<TextField
											sx={{ width: "100%" }}
											id="newCityID"
											value={
												!dataWithLeadId.New_City
													? "---"
													: dataWithLeadId.New_City
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Call status notes{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="cellStatusNotesID"
											value={
												!dataWithLeadId.Call_DispositionX
													? "---"
													: dataWithLeadId.Call_DispositionX
											}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Electric ACCT{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="electricACCTID"
											value={
												!dataWithLeadId.Electric_AccT
													? "---"
													: dataWithLeadId.Electric_AccT
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold"> Gas ACCT </label>
										<TextField
											sx={{ width: "100%" }}
											id="gasACCTID"
											value={
												!dataWithLeadId.Gas_AccT
													? "---"
													: dataWithLeadId.Gas_AccT
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Renters Insurance Policy{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="rentersInsurenceID"
											value={
												!dataWithLeadId.Renters_Insurance_Policy
													? "---"
													: dataWithLeadId.Renters_Insurance_Policy
											}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Agent APP Credentials{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="agentappcredentials"
											value={
												!dataWithLeadId.Agent_APP_Credentials
													? "---"
													: dataWithLeadId.Agent_APP_Credentials
											}
										/>
									</div>
									<div className=" w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Agent Pay Preference{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="agentpaypreference"
											value={
												!dataWithLeadId.Agent_Preferred_Method_of_Reward_Fulfillment
													? "---"
													: dataWithLeadId.Agent_Preferred_Method_of_Reward_Fulfillment
											}
										/>
									</div>
								</div>

								<div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5">
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										{/* Didn't find this field */}
										<label className="text-sm font-semibold">
											{" "}
											Discount Portal{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="discountportal"
											value={"-"}
										/>
									</div>
									<div className="w-72 flex flex-col justify-start items-start gap-2">
										<label className="text-sm font-semibold">
											{" "}
											Agent Reimbursement{" "}
										</label>
										<TextField
											sx={{ width: "100%" }}
											id="agentreimbursement"
											value={
												!dataWithLeadId.Agent_Reimbursement
													? "---"
													: dataWithLeadId.Agent_Reimbursement
											}
										/>
									</div>
								</div>
							</div>
						</Box>
					</Modal>
				</div>
			</div>
		</>
	);
};

export default ClientTable;
