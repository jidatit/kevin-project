import { CSVLink } from "react-csv";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const DownloadCsv = ({ rowsToShow }) => {
	const headers = [
		{ label: "Record ID", key: "id" },
		{ label: "Full Name", key: "Full_Name" },
		{ label: "Est Move Date", key: "Est_Move_Date" },
		{ label: "Created Time", key: "Created_Time" },
		{ label: "Sold Date", key: "Sold_Date" },
		{ label: "First Name", key: "First_Name" },
		{ label: "Last Name", key: "Last_Name" },
		{ label: "Lead Status", key: "Lead_Status" },
		{ label: "Provider", key: "Provider" },
		{ label: "Internet Sold", key: "Internet_Sold" },
		{ label: "TV Sold", key: "T_V_Sold" },
		{ label: "Phone Sold", key: "Phone_Sold" },
		{ label: "Move Quote Request", key: "Move_Ref_Sold" },
		{ label: "Home Monitoring", key: "Home_Monitoring" },
		{ label: "Utilities Set up", key: "Utilities_set_up" },
		{ label: "COA / DMV / Voter Update", key: "Change_of_Address" },
		{ label: "New State", key: "New_State" },
		{ label: "New City", key: "New_City" },
		{ label: "Call status notes", key: "Call_DispositionX" },
		{ label: "Electric ACCT", key: "Electric_AccT" },
		{ label: "Gas ACCT", key: "Gas_AccT" },
		{ label: "Renters Insurance Policy", key: "Renters_Insurance_Policy" },
		{ label: "Agent APP Credentials", key: "Agent_APP_Credentials" },
		{
			label: "Agent Pay Preference",
			key: "Agent_Preferred_Method_of_Reward_Fulfillment",
		},
		{ label: "Discount Portal", key: "-" },
		{ label: "Agent Reimbursement", key: "Agent_Reimbursement" },
	];

	return (
		<div className="flex flex-row">
			<CSVLink data={rowsToShow} headers={headers} filename="all_data.csv">
				<button
					type="button"
					className=" flex flex-row justify-around items-center  m-2 cursor-pointer bg-[#6DB23A] rounded-3xl text-white py-1 px-3"
				>
					<p>
						<ArrowCircleDownIcon />
					</p>
					Download All CSV
				</button>
			</CSVLink>
		</div>
	);
};

export default DownloadCsv;
