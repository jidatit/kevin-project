
import React, { useState, useMemo } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { maxHeight } from "@mui/system";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    overflow: 'auto',
    maxHeight: '90vh',
};

const products = [
    {
        firstName: "Muhammad",
        lastName: "Umar",
        email: "muhammadumar695@gmail.com",
        phoneNumber: "10/06/2024",
        status: "Active",
        referralLink: "View Details",
        userType: "Download CSV",
        action: "Change Details"
    },
    {
        firstName: "Muhammad",
        lastName: "Umar",
        email: "muhammadumar695@gmail.com",
        phoneNumber: "10/06/2024",
        status: "Active",
        referralLink: "View Details",
        userType: "Download CSV",
        action: "Change Details"
    },
    {
        firstName: "Muhammad",
        lastName: "Umar",
        email: "muhammadumar695@gmail.com",
        phoneNumber: "10/06/2024",
        status: "Active",
        referralLink: "View Details",
        userType: "Download CSV",
        action: "Change Details"
    },
];

const UsersTable = () => {

    const [productList] = useState(products);
    const [rowsLimit] = useState(10);
    const [rowsToShow, setRowsToShow] = useState(productList.slice(0, rowsLimit));
    const [customPagination, setCustomPagination] = useState([]);
    const [totalPage] = useState(Math.ceil(productList?.length / rowsLimit));
    const [currentPage, setCurrentPage] = useState(0);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const nextPage = () => {
        const startIndex = rowsLimit * (currentPage + 1);
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(currentPage + 1);
    };

    const changePage = (value) => {
        const startIndex = value * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        setCurrentPage(value);
    };

    const previousPage = () => {
        const startIndex = (currentPage - 1) * rowsLimit;
        const endIndex = startIndex + rowsLimit;
        const newArray = products.slice(startIndex, endIndex);
        setRowsToShow(newArray);
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else {
            setCurrentPage(0);
        }
    };

    useMemo(() => {
        setCustomPagination(
            Array(Math.ceil(productList?.length / rowsLimit)).fill(null)
        );
    }, []);

    return (
        <>
            <div className=' w-full flex flex-col justify-center items-center'>
                <div className='w-full h-16 flex flex-row justify-end items-center rounded-t-lg text-white font-semibold text-base gap-4 pt-3 pl-10 pr-10 bg-[#6DB23A]'>
                    <form className="h-auto mt-[-12px]">
                        <select id="countries" className="bg-gray-50 text-gray-900 text-sm rounded-lg w-full py-2 px-4" defaultValue="">
                            <option value="" disabled>Filter by Time</option>
                            <option value="1"> Today </option>
                            <option value="7">Last Week</option>
                            <option value="30">Last Month</option>
                        </select>
                    </form>
                    <form className="h-auto mt-[-12px]">
                        <select id="countries" className="bg-gray-50 text-gray-900 text-sm rounded-lg w-full py-2 px-4" defaultValue="">
                            <option value="" disabled>Filter by Solid Date</option>
                            <option value="1"> Today </option>
                            <option value="7">Last Week</option>
                            <option value="30">Last Month</option>
                        </select>
                    </form>
                </div>
            </div>

            <div className="h-full bg-white flex items-center justify-center py-4">
                <div className="w-full max-w-5xl px-2">

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
                                    <th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
                                        User Type
                                    </th>
                                    <th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
                                        Referral link
                                    </th>
                                    <th className="flex items-center py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap gap-1">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rowsToShow?.map((data, index) => (
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
                                            {data?.firstName}
                                        </td>
                                        <td
                                            className={`py-2 px-3 font-normal text-base ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.lastName}
                                        </td>
                                        <td
                                            className={`py-2 px-3 font-normal text-base ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.email}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.phoneNumber}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.status}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.referralLink}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base  font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } whitespace-nowrap`}
                                        >
                                            {data?.userType}
                                        </td>
                                        <td
                                            className={`py-2 px-3 text-base font-normal ${index == 0
                                                ? "border-t-2 border-gray-300"
                                                : index == rowsToShow?.length
                                                    ? "border-y"
                                                    : "border-t"
                                                } min-w-[170px]`}
                                        >
                                            <button onClick={handleOpen} className="bg-[#6DB23A] rounded-3xl text-white py-1 px-4">{data?.action}</button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full flex justify-center sm:justify-between xl:flex-row flex-col gap-10 mt-12 lg:mt-8 px-0 lg:px-4 xl:px-4 items-center">
                        <div className="text-base text-center">
                            Showing
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 p-2 text-center rounded-lg" > {currentPage == 0 ? 1 : currentPage * rowsLimit + 1} </span>
                            to {" "}
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg" >
                                {currentPage == totalPage - 1
                                    ? productList?.length
                                    : (currentPage + 1) * rowsLimit}
                            </span>
                            {" "} of {" "}
                            <span className="font-bold bg-[#6DB23A] text-white mx-2 py-2 px-3 text-center rounded-lg" >{productList?.length}</span>
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
                                {customPagination?.map((data, index) => (
                                    <li
                                        className={`flex items-center justify-center w-[36px] rounded-[6px] h-[34px] border-solid border-[2px] cursor-pointer ${currentPage == index
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
                        open={open}
                        onClose={handleClose}
                        aria-describedby="modal-data"
                    >
                        <Box sx={style} noValidate>

                            <div id="modal-data" className="w-full h-full flex flex-col justify-start items-center gap-3" >

                                <div className="w-full h-auto flex flex-col justify-end items-end px-6 pt-6 py-3" >
                                    <div onClick={handleClose} className="cursor-pointer">
                                        <CloseOutlinedIcon style={{ fontSize: '40px' }} className='text-black hover:text-[#6c6969]' />
                                    </div>
                                </div>

                                {/* Current Working Area */}
                                <div className="w-[90vw] h-full flex flex-col lg:flex-row xl:flex-row justify-center items-center px-4 lg:px-12 gap-5" >

                                    <div className='w-full h-auto flex flex-col' >

                                        <div className=' w-full flex flex-col justify-center items-center'>
                                            <div className='w-full h-12 rounded-t-lg bg-[#6DB23A]'></div>
                                            <div className="w-full h-auto flex flex-col lg:flex-row justify-center items-center gap-5 my-5" >

                                                <div className='w-full lg:w-[65%] h-60 flex flex-row justify-start items-start' >
                                                    <div className='w-[85%] h-64 rounded-xl bg-gray-200 flex justify-center items-center' >
                                                        <div className='font-semibold text-3xl' > Video will Display Here </div>
                                                    </div>
                                                    <div className='w-auto h-auto flex justify-start items-start p-4' >
                                                        <EditOutlinedIcon style={{ fontSize: '40px' }} className='text-[#6DB23A] hover:text-[#96d36b] cursor-pointer' />
                                                    </div>
                                                </div>

                                                <div className='w-auto lg:w-[35%] mt-5 flex justify-center items-center' >
                                                    <button className='font-semibold text-xl rounded-full py-3 px-6 text-white bg-[#6DB23A]' > Add Discount Post </button>
                                                </div>

                                            </div>
                                        </div>

                                        <div className=' w-full flex flex-col justify-center items-center mt-10'>
                                            <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Quick Links </div>

                                            <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-around items-start gap-3 lg:gap-0' >
                                                <div className="w-full flex flex-row justify-center items-center" >
                                                    <div className='w-[90%] font-semibold text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>
                                                        Click Here to Schedule a Call
                                                    </div>
                                                    <div className='w-auto h-auto flex justify-start items-start p-4' >
                                                        <EditOutlinedIcon style={{ fontSize: '40px' }} className='text-[#6DB23A] hover:text-[#96d36b] cursor-pointer' />
                                                    </div>
                                                </div>
                                                <div className="w-full flex flex-row justify-center items-center" >
                                                    <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>
                                                        Go to Settings in Concierge
                                                    </div>
                                                    <div className='w-auto h-auto flex justify-start items-start p-4' >
                                                        <EditOutlinedIcon style={{ fontSize: '40px' }} className='text-[#6DB23A] hover:text-[#96d36b] cursor-pointer' />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-center items-start mt-[-6px] lg:mt-0 gap-3 lg:gap-0' >
                                                <div className="w-full lg:w-[50%] flex flex-row justify-center items-center" >
                                                    <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>
                                                        Email Support Team
                                                    </div>
                                                    <div className='w-auto h-auto flex justify-start items-start p-4' >
                                                        <EditOutlinedIcon style={{ fontSize: '40px' }} className='text-[#6DB23A] hover:text-[#96d36b] cursor-pointer' />
                                                    </div>
                                                </div>
                                                <div className="w-full lg:w-[50%] py-3 flex flex-row justify-center items-center">
                                                    <button className='font-semibold w-auto text-xl rounded-full py-3 px-6 text-white bg-[#6DB23A]' >
                                                        Add Referral Link
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=' w-full flex flex-col justify-center items-center mt-10'>
                                            <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Contact My Account Executive </div>
                                            <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-start items-start mt-[-6px] lg:mt-0 gap-3 lg:gap-0' >
                                                <div className="w-full lg:w-[50%] flex flex-row justify-center items-center" >
                                                    <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>
                                                        1-877-4677 ext. 988
                                                    </div>
                                                    <div className='w-auto h-auto flex justify-start items-start p-4' >
                                                        <EditOutlinedIcon style={{ fontSize: '40px' }} className='text-[#6DB23A] hover:text-[#96d36b] cursor-pointer' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                {/* Current Working Area */}

                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        </>

    );
};

export default UsersTable;