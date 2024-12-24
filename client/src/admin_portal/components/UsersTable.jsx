import React, { useState, useMemo, useEffect } from "react";

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

import axios from "axios";

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
  const [productList, setProductList] = useState([]); // Data to display based on filters
  const [allUsersData, setAllUsersData] = useState([]); // Store all fetched data here
  const [rowsLimit] = useState(5);
  const [rowsToShow, setRowsToShow] = useState([]);
  const [customPagination, setCustomPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users data initially (unfiltered)
  const fetchAllUsersData = async () => {
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const usersData = [];
      for (const doc of querySnapshot.docs) {
        const userData = { id: doc.id, ...doc.data() };
        const email = userData?.email;

        userData.partnerType = "--";
        userData.role = "--";

        if (email) {
          const response = await axios.post(
            "https://kevin-project-zfc8.onrender.com/api/zoho",
            { email }
          );
          const userTypeDataList = response?.data?.data?.data;
          const matchedData = userTypeDataList?.find(
            (item) => item.PARTNER_TYPE
          );

          if (matchedData) {
            userData.partnerType = matchedData.PARTNER_TYPE;

            for (let userTypeData of userTypeDataList) {
              const leadSource1 = userTypeData.LEAD_Source1;
              const agentRFCode = userTypeData.AGENT_RF_CODE;

              if (leadSource1) {
                userData.role = "Manager";
                break;
              } else if (agentRFCode) {
                userData.role = "Agent";
                break;
              }
            }
          }
        }
        usersData.push(userData);
      }

      setLoading(false);

      setAllUsersData(usersData); // Store the unfiltered data
      setProductList(usersData); // Set initial data for display
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users data: ", error);
    }
  };

  // Apply filters to the already fetched data
  const applyFilter = (filter) => {
    let filteredData = [...allUsersData]; // Start with all data

    if (filter === "newest") {
      filteredData = filteredData.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filter === "oldest") {
      filteredData = filteredData.sort((a, b) => a.createdAt - b.createdAt);
    } else if (filter === "1") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filteredData = filteredData.filter(
        (user) => user.createdAt.toDate() >= today
      );
    } else if (filter === "7") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filteredData = filteredData.filter(
        (user) => user.createdAt.toDate() >= lastWeek
      );
    } else if (filter === "30") {
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      filteredData = filteredData.filter(
        (user) => user.createdAt.toDate() >= lastMonth
      );
    }

    setProductList(filteredData);
    setCurrentPage(0); // Reset to the first page
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllUsersData();
  }, []);

  // Apply filter when selectedFilter changes
  useEffect(() => {
    applyFilter(selectedFilter);
  }, [selectedFilter]);

  // Pagination logic
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

  // Set pagination based on filtered data
  useEffect(() => {
    setRowsToShow(productList.slice(0, rowsLimit));
    setCustomPagination([...Array(totalPage).keys()]);
  }, [productList]);

  const totalPage = useMemo(
    () => Math.ceil(productList.length / rowsLimit),
    [productList.length, rowsLimit]
  );

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value); // Update selected filter
  };

  return (
    <>
      <div className=" w-full flex flex-col justify-center items-center">
        <ToastContainer />
        <div className="w-full h-16 flex flex-row justify-end items-center rounded-t-lg text-white font-semibold text-base gap-4 pt-3 pl-10 pr-10 bg-[#6DB23A]">
          <form className="h-auto mt-[-12px] cursor-pointer relative">
            <select
              id="filter"
              className="bg-gray-50 text-gray-900 text-sm rounded-lg w-full py-2 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out shadow-sm hover:bg-gray-100"
              defaultValue=""
              onChange={handleFilterChange}
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
                  <th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
                    Partner Type
                  </th>
                  <th className="py-3 px-3 text-[#6DB23A] sm:text-base font-bold whitespace-nowrap">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                      } animate-pulse`}
                      key={index}
                    >
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  rowsToShow?.map((data, index) => (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#222E3A]/[6%]"
                      }`}
                      key={index}
                    >
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.name.split(" ")[0]}
                      </td>
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.name.split(" ")[1]}
                      </td>
                      <td
                        className={`py-2 px-3 font-normal text-base ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.email}
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.phoneNumber}
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {"Active"}
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.partnerType || "N/A"}
                      </td>
                      <td
                        className={`py-2 px-3 text-base font-normal ${
                          index === 0
                            ? "border-t-2 border-gray-300"
                            : "border-t"
                        } whitespace-nowrap`}
                      >
                        {data?.role || "N/A"}
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
