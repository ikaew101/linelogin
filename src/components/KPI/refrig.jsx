import React, { useState, useEffect } from "react";
import AuthService from "../../service/authen";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import RefrigService from "../../service/refrigerator";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Pagination from "../Pagination";
import { useUpdateEffect } from "ahooks";

function RefrigKPI({
  userId,
  selectedStore,
  setSelectedStore,
  stores,
  onRowClick,
  formatKpi,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  const [search, setSearch] = useState("");

  const [storeData, setStoreData] = useState(selectedStore);
  const [type, setType] = useState("costCenter");
  const [format, setFormat] = useState(selectedStore.format || "mini");
  const [isMini, setIsMini] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const lastPage = Math.ceil(data?.total / perPage) || 1;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedStore(storeData);
  }, [storeData]);

  useEffect(() => {
    getData();
  }, [perPage, page]);

  const getData = async (options) => {
    try {
      setIsLoading(true);
      const offset = perPage * page - perPage;
      if (offset > data?.total) {
        setPage(1);
        return;
      }
      await AuthService.refreshTokenPage(userId);
      const response = await RefrigService.getKPI(userId, {
        OffsetNo: perPage * page - perPage,
        LimitNo: perPage,
        Order: order,
        Sort: sort,
        storeFormatId: formatKpi,
        ...options,
      });
      setData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setData();
      setIsLoading(false);
    }
  };

  const [sort, setSort] = useState("alarm_work_order_count");
  const [order, setOrder] = useState("desc");

  function sortData(e) {
    e.preventDefault();

    const label = e.target.id;

    setSort(label);
    if (sort && order == "asc") {
      setOrder("desc");
      getData({ Sort: label, Order: "desc" });
    } else {
      setOrder("asc");
      getData({ Sort: label, Order: "asc" });
    }
  }

  function handleGoTab(item, isToggleWork, tab) {
    onRowClick(item, isToggleWork, tab);
  }

  useUpdateEffect(() => {
    setPage(1);
    getData({ OffsetNo: "" });
  }, [formatKpi]);

  return (
    <>
      <div className={`bg-white border -mt-10 mx-2 rounded-xl py-3`}>
        <div
          className="grid grid-cols-3 items-end max-md:grid-cols-1 max-md:gap-2 gap-x-3 max-sm:gap-2 justify-items-center mx-auto pt-8 p-3"
          id="card_overall"
        >
          <div className={`grid-rows-2 w-full border rounded-lg`}>
            <div className="bg-primary flex items-center h-full p-2 font-medium text-white rounded-t-lg justify-between">
              <b>จำนวนตู้/Address ที่ต่อ monitoring</b>
              <svg
                width="28"
                height="28"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="33" height="33" rx="16.5" fill="#008A82" />
                <path
                  d="M10.4011 22.599C9.6002 21.7981 8.96488 20.8473 8.53143 19.8009C8.09797 18.7544 7.87488 17.6329 7.87488 16.5002C7.87488 15.3675 8.09797 14.246 8.53143 13.1995C8.96488 12.1531 9.6002 11.2023 10.4011 10.4014M22.5988 10.4014C23.3997 11.2023 24.035 12.1531 24.4685 13.1995C24.9019 14.246 25.125 15.3675 25.125 16.5002C25.125 17.6329 24.9019 18.7544 24.4685 19.8009C24.035 20.8473 23.3997 21.7981 22.5988 22.599M13.1113 19.8879C12.213 18.9893 11.7084 17.7708 11.7084 16.5002C11.7084 15.2296 12.213 14.0111 13.1113 13.1125M19.8886 13.1125C20.7869 14.0111 21.2916 15.2296 21.2916 16.5002C21.2916 17.7708 20.7869 18.9893 19.8886 19.8879M17.4583 16.5002C17.4583 16.7544 17.3573 16.9981 17.1776 17.1778C16.9979 17.3576 16.7541 17.4585 16.5 17.4585C16.2458 17.4585 16.002 17.3576 15.8223 17.1778C15.6426 16.9981 15.5416 16.7544 15.5416 16.5002C15.5416 16.246 15.6426 16.0023 15.8223 15.8226C16.002 15.6428 16.2458 15.5419 16.5 15.5419C16.7541 15.5419 16.9979 15.6428 17.1776 15.8226C17.3573 16.0023 17.4583 16.246 17.4583 16.5002Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div
              id="card2"
              className="py-7 absolute w-[30%] max-md:w-[85%] flex justify-center items-center text-primary text-5xl font-bold rounded-b-lg  overflow-hidden
           bg-right-bottom bg-no-repeat"
            >
              {!data ? <br /> : data.totalAvailable?.toLocaleString([])}
            </div>
            <img
              className="relative object-center rounded-b-lg"
              style={{
                objectFit: "cover",
                height: "8rem",
                width: "100%",
              }}
              src="img/card_main.png"
            />
          </div>
          <div className={`grid-rows-2 w-full border rounded-lg`}>
            <div className="bg-danger flex items-center p-2 font-medium text-white rounded-t-lg justify-between">
              <b>จำนวนตู้/Address ที่มีการแจ้งเปิดใบงาน</b>
              <svg
                width="28"
                height="28"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="33" height="33" rx="16.5" fill="#A50000" />
                <g clipPath="url(#clip0_44_6212)">
                  <path
                    d="M26.1857 12.1286C26.1581 11.9789 26.0993 11.8366 26.0132 11.7111C25.927 11.5856 25.8155 11.4796 25.6857 11.4L22.8286 14.2572C22.6953 14.3954 22.5355 14.5054 22.3588 14.5805C22.1821 14.6556 21.992 14.6943 21.8 14.6943C21.608 14.6943 21.4179 14.6556 21.2412 14.5805C21.0644 14.5054 20.9047 14.3954 20.7714 14.2572L19.6857 13.2857C19.4239 13.0187 19.2773 12.6597 19.2773 12.2857C19.2773 11.9118 19.4239 11.5528 19.6857 11.2857L22.5428 8.42859C22.4805 8.28221 22.3868 8.15132 22.2683 8.04516C22.1498 7.93901 22.0094 7.8602 21.8571 7.8143C20.8602 7.6155 19.8275 7.7006 18.8766 8.0599C17.9257 8.41921 17.0948 9.03829 16.4785 9.84666C15.8622 10.655 15.4852 11.6202 15.3905 12.6323C15.2958 13.6444 15.4872 14.6628 15.9428 15.5714L8.14283 23.3C8.00677 23.4331 7.89866 23.592 7.82485 23.7674C7.75103 23.9428 7.71301 24.1311 7.71301 24.3214C7.71301 24.5117 7.75103 24.7001 7.82485 24.8755C7.89866 25.0509 8.00677 25.2098 8.14283 25.3429L8.65712 25.8572C8.79017 25.9932 8.94905 26.1013 9.12446 26.1751C9.29986 26.249 9.48825 26.287 9.67855 26.287C9.86885 26.287 10.0572 26.249 10.2326 26.1751C10.408 26.1013 10.5669 25.9932 10.7 25.8572L18.5 18.0714C19.4089 18.5045 20.4201 18.6769 21.4212 18.5696C22.4223 18.4623 23.3739 18.0794 24.1704 17.4636C24.9669 16.8477 25.5769 16.023 25.9327 15.0811C26.2885 14.1393 26.3761 13.1172 26.1857 12.1286Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_44_6212">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(7 7)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="absolute w-[30%] max-md:w-[85%] py-7 flex justify-center items-center text-danger text-5xl font-bold rounded-b-lg bg-local bg-cover bg-center-bottom">
              {!data ? <br /> : data.totalAbnormal?.toLocaleString([])}
            </div>
            <img
              className="relative object-center rounded-b-lg"
              style={{
                objectFit: "cover",
                height: "8rem",
                width: "100%",
              }}
              src="img/card_mainAb.png"
            />
          </div>
          <div
            className={`grid-rows-2 w-full ${
              !saving && "shadow"
            } border rounded-lg`}
          >
            <div className="bg-warning flex items-center p-2 font-medium text-white rounded-t-lg justify-between">
              <b>จำนวนตู้/Address ที่มีการแจ้งเตือน No Link</b>
              <svg
                width="28"
                height="28"
                viewBox="0 0 33 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0.5" width="33" height="33" rx="16.5" fill="#BE9307" />
                <rect x="15" y="7" width="4" height="12" fill="white" />
                <rect x="15" y="22" width="4" height="4" fill="white" />
              </svg>
            </div>
            <div className="absolute w-[30%] max-md:w-[85%] py-7 flex justify-center items-center text-warning text-5xl font-bold rounded-b-lg bg-local bg-cover bg-center-bottom">
              {!data ? <br /> : data.totalNoLink?.toLocaleString([])}
            </div>
            <img
              className="relative object-center rounded-b-lg"
              style={{
                objectFit: "cover",
                height: "8rem",
                width: "100%",
              }}
              src="img/bg_noLink.png"
            />
          </div>
        </div>
      </div>

      <div className={`bg-white border mx-2 rounded-xl mt-4 pb-2`}>
        <div id="KPI" className="p-3 px-4">
          <div className="text-sm py-3 mx- 1 grid">
            <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
              <table
                width="100%"
                className="max-[1000px]:min-w-max table-fixed max-lg:min-w-[909px] w-full text-dark"
              >
                <col style={{ width: "5%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <thead className="bg-table-head rounded-md">
                  <tr className=" ">
                    <th
                      rowSpan="1"
                      className="rounded-l-md "
                      onClick={sortData}
                    >
                      <div
                        id="store_number"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        รหัสสาขา
                        <div
                          id="store_number"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="store_number"
                            className={`self-end w-[4px] ${
                              sort?.store_number == "desc" && "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="store_number"
                            className={`self-end w-[4px] ${
                              sort?.store_number == "asc" && "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                    <th rowSpan="2" className=" " onClick={sortData}>
                      <div
                        id="store_name"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        ชื่อสาขา
                        <div
                          id="store_name"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="store_name"
                            className={`self-end w-[4px] ${
                              sort?.name == "desc" && "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="store_name"
                            className={`self-end w-[4px] ${
                              sort?.name == "asc" && "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                    <th onClick={sortData}>
                      <div
                        id="parent"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        สังกัด
                        <div
                          id="parent"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="parent"
                            className={`self-end w-[4px] ${
                              sort?.parent == "desc" && "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="parent"
                            className={`self-end w-[4px] ${
                              sort?.parent == "asc" && "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                    <th onClick={sortData}>
                      <div
                        id="total_device"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        จำนวนตู้ทั้งหมด
                        <div
                          id="total_device"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="total_device"
                            className={`self-end w-[4px] ${
                              sort?.total_device == "desc" && "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="total_device"
                            className={`self-end w-[4px] ${
                              sort?.total_device == "asc" && "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                    <th rowSpan="2" className="py-4" onClick={sortData}>
                      <div
                        id="alarm_work_order_count"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        จำนวนตู้ที่แจ้งเปิดงาน
                        <div
                          id="alarm_work_order_count"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="alarm_work_order_count"
                            className={`self-end w-[4px] ${
                              sort?.alarm_work_order_count == "desc" &&
                              "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="alarm_work_order_count"
                            className={`self-end w-[4px] ${
                              sort?.alarm_work_order_count == "asc" &&
                              "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      rowSpan="2"
                      className="rounded-r-md py-4"
                      onClick={sortData}
                    >
                      <div
                        id="alarm_nolink_count"
                        className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        No Link
                        <div
                          id="alarm_nolink_count"
                          className="inline-flex items-center justify-center"
                        >
                          <img
                            id="alarm_nolink_count"
                            className={`self-end w-[4px] ${
                              sort?.alarm_nolink_count == "desc" && "h-[14px]"
                            }`}
                            src="img/sortUp.svg"
                          />
                          <img
                            id="alarm_nolink_count"
                            className={`self-end w-[4px] ${
                              sort?.alarm_nolink_count == "asc" && "h-[14px]"
                            } `}
                            src="img/sortDown.svg"
                          />
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {!isLoading &&
                    data?.table?.map((ele, index) => {
                      return (
                        <tr
                          key={index}
                          className={`odd:bg-white even:bg-table text-center rounded-md`}
                        >
                          <td
                            className="rounded-l-md cursor-pointer"
                            onClick={() => handleGoTab(ele, false, "overall")}
                          >
                            {ele.storeNumber}
                          </td>
                          <td
                            className="py-4 text-left cursor-pointer"
                            onClick={() => handleGoTab(ele, false, "overall")}
                          >
                            {" "}
                            {ele.storeName}
                          </td>
                          <td className="py-2 text-left">{ele.area}</td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              handleGoTab(ele, false, "notification")
                            }
                          >
                            {ele.total}
                          </td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              handleGoTab(ele, true, "notification")
                            }
                          >
                            {ele.abnormal}
                          </td>
                          <td
                            className="rounded-r-md cursor-pointer"
                            onClick={() =>
                              handleGoTab(ele, false, "notification")
                            }
                          >
                            {ele.noLink}
                          </td>
                        </tr>
                      );
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
          !data?.table?.length && (
            <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
              ไม่พบข้อมูล
            </div>
          )
        )}
        {!isLoading && !!data?.table?.length && (
          <>
            {/* <div className="flex flex-col text-xs justify-between">
                        <div className="self-end grid grid-cols-2">
                            <div>
                                จำนวนแถว ต่อ หน้า:
                                <select
                                    value={perPage}
                                    onChange={e => {
                                        setPerPage(e.target.value)
                                        getData({ LimitNo: e.target.value })
                                    }}
                                    className="p-2 mr-1 border text-sm border-0 text-[#000] rounded-lg cursor-pointer outline-0"
                                >
                                    <option value='10'>10</option>
                                    <option value='20'>20</option>
                                    <option value='30'>30</option>
                                    <option value='50'>50</option>
                                    <option value='100'>100</option>
                                </select>
                            </div>
                            <div className="ml-auto flex items-center">
                                หน้า {page} จาก {lastPage}
                                <div className="ml-3 mr-1 flex gap-2">
                                    <button className={`p-2.5 hover:bg-light rounded-full ${!(page > 1) && 'cursor-default'}`}
                                        onClick={() => page > 1 && setPage(page - 1)}
                                    >
                                        <FiChevronLeft className="font-semibold" />
                                    </button>
                                    <button className={`p-2.5 hover:bg-light rounded-full ${!(page < lastPage) && 'cursor-default'}`}
                                        onClick={() => page < lastPage && setPage(page + 1)}
                                    >
                                        <FiChevronRight className="font-semibold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
            <Pagination
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
              total={data?.total}
            />
          </>
        )}
        <div className="sm:absolute sm:-mt-8" hidden={isLoading}>
          <ExportPages
            name="refrigKPI"
            onSaving={setSaving}
            csvData
            getAllData={async () => {
              const res = await RefrigService.getKPI(userId);
              const all = res.data?.table?.map((ele, i) => {
                const objThai = {
                  รหัสสาขา: ele.storeNumber,
                  ชื่อสาขา: ele.storeName.split(",").join(""),
                  สังกัด: ele.area.split(",").join(""),
                  จำนวนตู้ทั้งหมด: ele.total,
                  จำนวนตู้ที่แจ้งเปิดงาน: ele.abnormal,
                  "No Link": ele.noLink,
                };
                return objThai;
              });
              return all;
            }}
          />
        </div>
      </div>
    </>
  );
}

export default RefrigKPI;
