import { useState } from "react";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import { Link } from "react-router-dom";
import dayTh from "../../const/day";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../helper/cn";

export function TableGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      id: 1,
      title: "test",
      status: "active",
    },
    {
      id: 2,
      title: "test",
      status: "inactive",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const lastPage = Math.ceil(data?.length / perPage) || 1;
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState();
  function sortData(e) {
    e.preventDefault();

    const label = e.target.id;
    let sortVal;
    if (sort && sort[label] == "asc") {
      sortVal = "desc";
    } else {
      sortVal = "asc";
    }

    setSort({ [label]: sortVal });

    setData(
      data.sort((a, b) => {
        const A = a[label];
        const B = b[label];

        if (label == "storeName") {
          if (sortVal == "asc") {
            return A?.localeCompare(B);
          } else {
            return B?.localeCompare(A);
          }
        } else {
          if (sortVal == "asc") {
            return A - B;
          } else {
            return B - A;
          }
        }
      })
    );
  }

  function formatDateTime(val) {
    const value =
      new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000;

    const day = dayTh[new Date(value).getDay()];
    const date = new Date(new Date(value)).toLocaleString("th-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const time = new Date(value).toLocaleTimeString("th-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${day}, ${date}, ${time} น.`;
  }

  return (
    <div
      className={`bg-white ${
        saving != "JPEG" ? "shadow" : ""
      } border mx-2 rounded-xl mt-4 pb-2`}
    >
      <div id="tableUserGroup" className="p-3 px-4">
        <div className="text-xs py-3 mx- 1 grid">
          <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
            <table
              width="100%"
              className="max-[1250px]:min-w-max table-fixed max-lg:min-w-[1000px] w-full text-dark text-[13px]"
            >
              <thead className="bg-table-head rounded-md">
                <tr>
                  <th rowSpan="1" className="rounded-l-md " onClick={sortData}>
                    <div
                      id="storeNumber"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ลำดับ
                      <div
                        id="storeNumber"
                        className="inline-flex items-center justify-center"
                      >
                        <img
                          id="storeNumber"
                          className={`self-end w-[4px] ${
                            sort?.storeNumber == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="storeNumber"
                          className={`self-end w-[4px] ${
                            sort?.storeNumber == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th onClick={sortData}>
                    <div
                      id="area"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ชื่อกลุ่ม
                      <div
                        id="area"
                        className="inline-flex items-center justify-center"
                      >
                        <img
                          id="area"
                          className={`self-end w-[4px] ${
                            sort?.area == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="area"
                          className={`self-end w-[4px] ${
                            sort?.area == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th onClick={sortData}>
                    <div id="note">หมายเหตุ</div>
                  </th>
                  <th onClick={sortData}>
                    <div id="normal">สร้างโดย</div>
                  </th>
                  <th rowSpan="2" className="py-4" onClick={sortData}>
                    <div
                      id="abnormal"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      วันที่สร้าง
                      <div
                        id="abnormal"
                        className="inline-flex items-center justify-center"
                      >
                        <img
                          id="abnormal"
                          className={`self-end w-[4px] ${
                            sort?.abnormal == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="abnormal"
                          className={`self-end w-[4px] ${
                            sort?.abnormal == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th rowSpan="2" className="" onClick={sortData}>
                    <div
                      id="status"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      สถานะ
                      <div
                        id="status"
                        className="inline-flex items-center justify-center"
                      >
                        <img
                          id="status"
                          className={`self-end w-[4px] ${
                            sort?.status == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="status"
                          className={`self-end w-[4px] ${
                            sort?.status == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th rowSpan="2" className="rounded-r-md" onClick={sortData}>
                    <div id="abnormal">จัดการ</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr></tr>
                {!isLoading &&
                  data?.map((item, index) => {
                    if (
                      index < perPage * page &&
                      index + 1 > perPage * page - perPage
                    ) {
                      return (
                        <tr
                          key={index}
                          className={`odd:bg-white even:bg-table text-center ${
                            loading && "animate-pulse bg-current/[.2]"
                          } rounded-md`}
                        >
                          <td>{index + 1} </td>
                          <td className="text-left">GG-TH-PSE-Admin</td>
                          <td className="text-left">Can view all store</td>
                          <td>Momotarow Example</td>
                          <td>
                            {/* {formatDateTime()} */}
                            14 มกราคม 2564 , 13:00 น.
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-2 capitalize">
                              <div className="flex gap-2 justify-center items-center">
                                <div
                                  className={cn("w-4 h-4 rounded-full", {
                                    "bg-[#B1B1B1]": item?.status == "inactive",
                                    "bg-[#006451]": item?.status == "active",
                                  })}
                                />
                                <div className="mt-1">{item.status}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2 justify-center text-sm items-center">
                              <Link
                                className="text-white p-2 px-5 bg-warning font-bold rounded-md my-2 flex items-center gap-2"
                                to={`group/${item?.id}`}
                              >
                                <svg
                                  className="w-5 h-5"
                                  viewBox="0 0 24 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M20.625 20.0938H3.375C2.96016 20.0938 2.625 20.4289 2.625 20.8438V21.6875C2.625 21.7906 2.70937 21.875 2.8125 21.875H21.1875C21.2906 21.875 21.375 21.7906 21.375 21.6875V20.8438C21.375 20.4289 21.0398 20.0938 20.625 20.0938ZM6.03984 18.125C6.08672 18.125 6.13359 18.1203 6.18047 18.1133L10.1227 17.4219C10.1695 17.4125 10.2141 17.3914 10.2469 17.3563L20.182 7.42109C20.2038 7.39941 20.221 7.37366 20.2328 7.3453C20.2445 7.31695 20.2506 7.28656 20.2506 7.25586C20.2506 7.22516 20.2445 7.19477 20.2328 7.16642C20.221 7.13806 20.2038 7.11231 20.182 7.09063L16.2867 3.19297C16.2422 3.14844 16.1836 3.125 16.1203 3.125C16.057 3.125 15.9984 3.14844 15.9539 3.19297L6.01875 13.1281C5.98359 13.1633 5.9625 13.2055 5.95312 13.2523L5.26172 17.1945C5.23892 17.3201 5.24707 17.4493 5.28545 17.571C5.32384 17.6927 5.39132 17.8032 5.48203 17.893C5.63672 18.043 5.83125 18.125 6.03984 18.125Z"
                                    fill="white"
                                  />
                                </svg>
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-10 my-4 pb-3">
          <Spinner />
        </div>
      ) : (
        !data?.length && (
          <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
            ไม่พบข้อมูล
          </div>
        )
      )}
      {!isLoading && !!data?.length && (
        <>
          <div className="flex flex-col text-xs justify-between">
            <div className="self-end grid grid-cols-2">
              <div>
                จำนวนแถว ต่อ หน้า:
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  className="p-2 mr-1 border text-sm border-0 text-[#000] rounded-lg cursor-pointer outline-0"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="ml-auto flex items-center">
                หน้า {page} จาก {lastPage}
                <div className="ml-3 mr-1 flex gap-2">
                  <button
                    className={`p-2.5 hover:bg-light rounded-full ${
                      !(page > 1) && "cursor-default"
                    }`}
                    onClick={() => page > 1 && setPage(page - 1)}
                  >
                    <FiChevronLeft className="font-semibold" />
                  </button>
                  <button
                    className={`p-2.5 hover:bg-light rounded-full ${
                      !(page < lastPage) && "cursor-default"
                    }`}
                    onClick={() => page < lastPage && setPage(page + 1)}
                  >
                    <FiChevronRight className="font-semibold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="sm:absolute sm:-mt-8">
        <ExportPages
          name="tableUserGroup"
          onSaving={setSaving}
          csvData={true}
          getAllData={async () => {
            return data.map((ele, i) => {
              const objThai = {
                รหัสสาขา: ele.id,
                ชื่อสาขา: ele.title,
                สังกัด: ele.status,
              };
              return objThai;
            });
          }}
          dataLength={+perPage + 1}
          img=""
          dataStart={perPage * (page - 1)}
        />
      </div>
    </div>
  );
}
