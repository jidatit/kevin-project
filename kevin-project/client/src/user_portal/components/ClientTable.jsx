
import React, { useState, useMemo, useEffect } from "react";
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
    maxHeight: '80vh'
};

const TableReact = () => {
    const [productList, setProductList] = useState([]);
    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [leadId, setLeadId] = useState('');

    const [openFirst, setOpenFirst] = useState(false);
    const handleOpenFirst = (id) => () => {
        setOpenFirst(true);
        setLeadId(id);
    };
    const handleCloseFirst = () => setOpenFirst(false);

    useEffect(() => {
        getLeadsData();
    }, []);

    useEffect(() => {
        setRowsToShow(productList.slice(0, rowsLimit));
    }, [productList]);

    const totalPage = useMemo(() => Math.ceil(productList.length / rowsLimit), [productList.length, rowsLimit]);

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
        try {
            const response = await axios.get('http://localhost:5000/api/leads');
            const leadsData = response.data;
            console.log('Modules:', leadsData.data);
            setProductList(leadsData.data);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

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

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-full h-16 flex flex-row justify-end items-center rounded-t-lg text-white font-semibold text-base gap-4 pt-3 pl-10 pr-10 bg-[#6DB23A]'>
                    {/* Filter forms can be added here */}
                </div>
            </div>

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

                            <tbody>
                                {rowsToShow && rowsToShow?.map((data, index) => (
                                    <tr
                                        className={`${index % 2 == 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                                            }`}
                                        key={index}
                                    >
                                        <td
                                            className={`py-2 px-3 font-normal text-base ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.Full_Name === null ? <div> - </div> : <div>{data.Full_Name}</div>}

                                        </td>
                                        <td
                                            className={`py-2 px-3 font-normal text-base ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.Created_Time === null ? <div> - </div> : <div>{data.Created_Time}</div>}
                                        </td>
                                        <td
                                            className={`py-2 px-3 font-normal text-base ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.Sold_Date === null ? <div> - </div> : <div>{data.Sold_Date}</div>}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.Lead_Status === null ? <div> - </div> : <div>{data.Lead_Status}</div>}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            <button onClick={handleOpenFirst(data.id)} className="bg-[#6DB23A] rounded-3xl text-white py-1 px-4">View Details</button>
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            <button className="bg-[#F2B145] rounded-3xl text-white py-1 px-4">Download CSV</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full flex justify-center sm:justify-between xl:flex-row flex-col gap-10 mt-12 lg:mt-8 px-0 lg:px-4 xl:px-4 items-center">
                        <div className="text-base text-center">
                            Showing
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 p-2 text-center rounded-lg">
                                {currentPage === 0 ? 1 : currentPage * rowsLimit + 1}
                            </span>
                            to{" "}
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
                                {currentPage === totalPage - 1
                                    ? productList?.length
                                    : (currentPage + 1) * rowsLimit}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg">
                                {productList?.length}
                            </span>{" "}
                            entries
                        </div>

                        <div className="flex">
                            <ul
                                className="flex justify-center items-center gap-x-[10px] z-30"
                                role="navigation"
                                aria-label="Pagination"
                            >
                                <li
                                    className={` prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${currentPage == 0
                                        ? "bg-[#cccccc] pointer-events-none"
                                        : " cursor-pointer"
                                        }`}
                                    onClick={previousPage}
                                >
                                    <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                                </li>

                                {generatePaginationLinks().map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => changePage(item - 1)}
                                        className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-solid border-[2px] cursor-pointer ${currentPage === item - 1
                                            ? "text-white bg-[#6DB23A]"
                                            : "border-[#E4E4EB]"
                                            }`}
                                    >
                                        <span aria-hidden="true">{item}</span>
                                    </li>
                                ))}

                                <li
                                    className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${currentPage == totalPage - 1
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

                    <Modal
                        open={openFirst}
                        onClose={handleCloseFirst}
                        aria-describedby="modal-data"
                    >
                        <Box sx={style} noValidate>

                            <div id="modal-data" className="w-full h-full flex flex-col justify-start items-center gap-3" >
                                
                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <h2 className="text-xl font-bold" >Lead Details</h2>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Record ID </label>
                                        <TextField sx={{ width: "100%" }} id="recordID" value={leadId} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Full Name </label>
                                        <TextField sx={{ width: "100%" }} id="fullNameID" value={productList.First_Name} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Est Move Date </label>
                                        <TextField sx={{ width: "100%" }} id="moveDataID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Created Time </label>
                                        <TextField sx={{ width: "100%" }} id="createdTimeID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Solid Date </label>
                                        <TextField sx={{ width: "100%" }} id="solidDateID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > First Name </label>
                                        <TextField sx={{ width: "100%" }} id="firstNameID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Last Name </label>
                                        <TextField sx={{ width: "100%" }} id="lastNameID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Lead Status </label>
                                        <TextField sx={{ width: "100%" }} id="leadStatusID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Provider </label>
                                        <TextField sx={{ width: "100%" }} id="providerID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Internet Solid </label>
                                        <TextField sx={{ width: "100%" }} id="internetSolidID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > TV Solid </label>
                                        <TextField sx={{ width: "100%" }} id="tvSolidID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Phone Solid </label>
                                        <TextField sx={{ width: "100%" }} id="phoneSolidID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Move Quote Request </label>
                                        <TextField sx={{ width: "100%" }} id="moveQuoteRequestID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Home Monitoring </label>
                                        <TextField sx={{ width: "100%" }} id="homeMonitoringID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Utilities Set up </label>
                                        <TextField sx={{ width: "100%" }} id="utilitiesSetUpID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > COA / DMV / Voter Update </label>
                                        <TextField sx={{ width: "100%" }} id="voterUpdateID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > New State </label>
                                        <TextField sx={{ width: "100%" }} id="newStateID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > New City </label>
                                        <TextField sx={{ width: "100%" }} id="newCityID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Call status notes </label>
                                        <TextField sx={{ width: "100%" }} id="cellStatusNotesID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Electric ACCT </label>
                                        <TextField sx={{ width: "100%" }} id="electricACCTID" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Gas ACCT </label>
                                        <TextField sx={{ width: "100%" }} id="gasACCTID" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Renters Insurance Policy </label>
                                        <TextField sx={{ width: "100%" }} id="rentersInsurenceID" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Agent APP Credentials </label>
                                        <TextField sx={{ width: "100%" }} id="agentappcredentials" value={"Muhammad Umar"} />
                                    </div>
                                    <div className=" w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Agent Pay Preference </label>
                                        <TextField sx={{ width: "100%" }} id="agentpaypreference" value={"10/10/2004"} />
                                    </div>
                                </div>

                                <div className="w-full h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center gap-5" >
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Discount Portal </label>
                                        <TextField sx={{ width: "100%" }} id="discountportal" value={"MefBer345"} />
                                    </div>
                                    <div className="w-72 flex flex-col justify-start items-start gap-2">
                                        <label className="text-sm font-semibold" > Agent Reimbursement </label>
                                        <TextField sx={{ width: "100%" }} id="agentreimbursement" value={"MefBer345"} />
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

export default TableReact;
