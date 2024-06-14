import React, { useState, useEffect } from "react";
import AuthService from "../../service/authen";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import AirService from "../../service/air";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ExportTypes from "../exportTypes";
import Pagination from "../Pagination";
import JSZip from "jszip";
import dayTh from "../../const/day";
import html2pdf from "html2pdf.js";
import { delayPromise, hiddenSome } from "../../helper/utils";
import { useUpdateEffect } from "ahooks";

function AirKPI({
  userId,
  selectedStore,
  setSelectedStore,
  stores,
  onRowClick,
  formatKpi,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataChiller, setDataChiller] = useState();
  const [dataAir, setDataAir] = useState();
  const [selectType, setSelectType] = useState("chiller");
  const [search, setSearch] = useState("");

  const [storeData, setStoreData] = useState(selectedStore);
  const [type, setType] = useState("costCenter");
  const [format, setFormat] = useState(selectedStore.format || "mini");
  const [isMini, setIsMini] = useState(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);

  useEffect(() => {
    setSelectedStore(storeData);
  }, [storeData]);

  useEffect(() => {
    if (selectType == "chiller") {
      setPage(1);
      setPerPage(100);
      getData({ LimitNo: 100, Order: "", Sort: "", OffsetNo: "" });
    } else {
      // init sort
      const initSort = {
        order: "asc",
        sort: "store_number",
      };
      setSort(initSort.sort);
      setOrder(initSort.order);

      setPage(1);
      setPerPage(100);
      getData({
        LimitNo: 100,
        Order: initSort.order,
        Sort: initSort.sort,
        OffsetNo: "",
      });
    }
  }, [selectType]);

  const getData = async (options) => {
    try {
      setIsLoading(true);
      await AuthService.refreshTokenPage(userId);
      const resData = await AirService.getKPI(userId, {
        OffsetNo: perPage * page - perPage,
        mode: selectType,
        LimitNo: perPage,
        Order: order,
        Sort: sort,
        storeFormatId: formatKpi,
        ...options,
      });

      if (selectType == "chiller") setDataChiller(resData.data);
      if (selectType == "airCon") setDataAir(resData.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      // setData()
      setIsLoading(false);
    }
  };

  const [sort, setSort] = useState();
  const [order, setOrder] = useState();
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
  const lastPage = Math.ceil(dataChiller?.total / perPage) || 1;

  const PER_PAGE_FOR_EXPORT = 250;
  const totalPageAir = Math.ceil(dataAir?.total / PER_PAGE_FOR_EXPORT);

  async function getItemsKPIWithMap(page) {
    const res = await AirService.getKPI(userId, {
      mode: "airCon",
      LimitNo: PER_PAGE_FOR_EXPORT,
      OffsetNo: PER_PAGE_FOR_EXPORT * page - PER_PAGE_FOR_EXPORT,
      Order: order,
      Sort: sort,
    });

    const all = res.data?.table?.map((ele) => {
      const is24h = ele.openTime.startsWith("24");

      const objThai = {
        รหัสสาขา: ele.storeNumber,
        ชื่อสาขา: ele.storeName.split(",").join(""),
        สังกัด: ele.area,
        เวลาเปิดสาขา: is24h
          ? "00:00"
          : ele.openTime &&
            (ele.openTime == 0 ? "00:00" : "0" + ele.openTime).slice(-5),
        เวลาปิดสาขา: is24h
          ? "00:00"
          : ele.closeTime &&
            (ele.closeTime == 0 ? "00:00" : "0" + ele.closeTime).slice(-5),
        จำนวนชั่วโมงที่เปิด: ele.totalHour,
        ["อุณหภูมิ Sale floor area avg. (°C) (ช่วงเวลา 12.00-16.00)"]:
          ele.tempSaleAvg == "-999" ? "" : ele.tempSaleAvg,
        "เวลาการทำงานของ Air ทั้งหมด (Hrs.) (00.00-23.59)":
          ele.totalAirWorkingHour == "-999" ? "" : ele.totalAirWorkingHour,
      };
      return objThai;
    });
    return all;
  }

  function lastDateTimeTH(val) {
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
    return `วัน${day}, ${date}, ${time} น.`;
  }

  useUpdateEffect(() => {
    setPage(1);
    getData({ OffsetNo: "" });
  }, [formatKpi]);

  return (
    <>
      <div className={`bg-white border -mt-10 mx-2 rounded-xl p-3`}>
        <div id="storeData" className="rounded-md p-2.5 py-6 mt-5">
          <div className="flex justify-center items-center gap-2 text-center max-w-[800px] mx-auto">
            <div
              className={`${
                selectType == "chiller" ? "btn-kpi-active" : "btn-kpi"
              } w-full hover:font-bold`}
              onClick={(e) => setSelectType("chiller")}
            >
              Chiller Type
            </div>
            <div
              className={`${
                selectType == "airCon" ? "btn-kpi-active" : "btn-kpi"
              } hover:font-bold w-full`}
              onClick={(e) => setSelectType("airCon")}
            >
              Split type <span className="whitespace-nowrap">(Air con)</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-white border mx-2 rounded-xl mt-4 pb-2 p-3 px-4`}>
        {selectType === "airCon" && (
          <div className="text-right  text-secondary py-2 text-xs">
            <span>อัพเดทล่าสุด : </span>
            {dataAir?.lastUpdate ? lastDateTimeTH(dataAir?.lastUpdate) : "-"}
          </div>
        )}
        {selectType == "chiller" ? (
          <>
            {!isLoading &&
              dataChiller?.storeData?.map((ele, i) => {
                if (i < perPage * page && i + 1 > perPage * page - perPage) {
                  return (
                    <div key={i}>
                      <CardChiller
                        data={ele}
                        configChiller={ele?.configChiller}
                        isLoading={isLoading}
                        key={i}
                        onClickCard={(item) => onRowClick(item)}
                      />
                    </div>
                  );
                }
              })}

            {isLoading ? (
              <div className="flex justify-center items-center h-10 my-4 pb-3">
                <Spinner />
              </div>
            ) : !dataChiller?.storeData?.length ? (
              <div className="flex justify-center h-10 rounded items-center my-6 text-dark pb-">
                ไม่พบข้อมูล
              </div>
            ) : (
              <Pagination
                page={page}
                setPage={(num) => {
                  setPage(num);
                  getData({ OffsetNo: perPage * num - perPage });
                }}
                perPage={perPage}
                setPerPage={(num) => {
                  setPerPage(num);
                  const offset = num * page - num;
                  if (offset > dataChiller?.total) {
                    setPage(1);
                    getData({ LimitNo: num, OffsetNo: 0 });
                  } else {
                    getData({ LimitNo: num });
                  }
                }}
                total={dataChiller?.total}
              />
            )}
          </>
        ) : (
          <TableAir
            page={page}
            perPage={perPage}
            setPerPage={setPerPage}
            isLoading={isLoading}
            sort={sort}
            data={dataAir}
            sortData={sortData}
            getData={getData}
            setPage={setPage}
            onRowClick={(row) => onRowClick(row)}
          />
        )}
        <div className="sm:absolute sm:-mt-8" hidden={isLoading}>
          {/* <div className="-ml-4 pt-2"> */}

          <ExportPages
            name="airKPI"
            csvData={selectType == "airCon" && dataAir}
            onDowloadCSVCustom={async () => {
              const zip = new JSZip();

              const last = totalPageAir;
              let promiseArray = [];
              for (let page = 1; page <= totalPageAir; page++) {
                promiseArray.push(getItemsKPIWithMap(page));
              }

              const itemsKpiAir = await Promise.all(promiseArray);

              const waitProcress = async () => {
                for (const i in itemsKpiAir) {
                  const datas = csvmaker(itemsKpiAir[i]);
                  let BOM = "\uFEFF";
                  let csvData = BOM + datas;
                  const blob = new Blob([csvData], {
                    type: "text/csv;charset=utf-8",
                  });
                  zip.file(`airKpi_${Number(i) + 1}.csv`, blob);
                  if (i == last) {
                    return Promise.resolve("done");
                  }
                }
              };
              await waitProcress();

              const zipData = await zip.generateAsync({
                type: "blob",
                streamFiles: true,
              });
              const a = document.createElement("a");
              a.href = window.URL.createObjectURL(zipData);
              a.download = "airKpi.zip";
              a.click();

              return "done";
            }}
            isPdfCustom={selectType === "chiller"}
            onPdfCustom={async () => {
              const zip = new JSZip();
              var options = {
                jsPDF: { format: [354, 500] },
                margin: [7, 0, 8, 0], // t l b r
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2 }, // 2 เพื่อไม่ให้ export ออกมาแล้วติดดำ
              };

              const totalPage = Math.ceil(dataChiller?.total / perPage) || 1;
              setPerPage(100);
              const createArray = (n) => [...Array(n)].map((_, i) => i + 1); // eg [1,2,3,4,5]

              hiddenSome("none", "hideText");

              const waitProcress = async () => {
                for (const index of createArray(totalPage)) {
                  setPage(index);
                  await delayPromise(200);
                  const content = document.getElementById("All");
                  const page = await html2pdf()
                    .set(options)
                    .from(content)
                    .toPdf()
                    .output("blob");
                  zip.file(`airKpi_${index}.pdf`, page);
                  if (index === totalPage) {
                    setPage(1);
                    hiddenSome("", "hideText");
                  }
                }
              };

              await waitProcress();

              const zipData = await zip.generateAsync({
                type: "blob",
                streamFiles: true,
              });
              const a = document.createElement("a");
              a.href = window.URL.createObjectURL(zipData);
              a.download = "airKpi_pdf.zip";
              a.click();
              return "done";
            }}
            isJpgCustom={selectType === "chiller"}
            onJpgCustom={async () => {
              const zip = new JSZip();
              var options = {
                jsPDF: { format: [354, 500] },
                margin: [7, 0, 8, 0], // t l b r
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 }, // 2 เพื่อไม่ให้ export ออกมาแล้วติดดำ
              };

              const totalPage = Math.ceil(dataChiller?.total / perPage) || 1;
              setPerPage(100);
              const createArray = (n) => [...Array(n)].map((_, i) => i + 1); // eg [1,2,3,4,5]

              hiddenSome("none", "hideText");

              const waitProcress = async () => {
                for (const index of createArray(totalPage)) {
                  setPage(index);
                  await delayPromise(500);
                  const content = document.getElementById("All");
                  const image = await html2pdf()
                    .set(options)
                    .from(content)
                    .outputImg();
                  const response = await fetch(image.src);
                  const blob = await response.blob();
                  zip.file(`airKpi_${index}.jpeg`, blob);
                  if (index === totalPage) {
                    setPage(1);
                    hiddenSome("", "hideText");
                  }
                }
              };

              await waitProcress();

              const zipData = await zip.generateAsync({
                type: "blob",
                streamFiles: true,
              });
              const a = document.createElement("a");
              a.href = window.URL.createObjectURL(zipData);
              a.download = "airKpi_jpg.zip";
              a.click();
              return "done";
            }}
          />
        </div>
      </div>
    </>
  );
}

const csvmaker = function (data) {
  const csvRows = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  data.map((value) => {
    const values = Object.values(value).join(",");
    csvRows.push(values);
  });

  return csvRows.join("\n");
};

function TableAir({
  sort,
  sortData,
  data,
  page,
  perPage,
  setPerPage,
  isLoading,
  getData,
  setPage,
  onRowClick,
}) {
  const lastPage = Math.ceil(data?.total / perPage) || 1;

  return (
    <>
      <div id="" className="">
        <div className="text-sm py-3 mx- 1 grid">
          <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
            <table
              width="100%"
              className="[1000px]:min-w-max w-full table-fixed max-lg:min-w-[1020px]  text-dark"
            >
              {/* <col style={{ width: "7%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "14%" }} />
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "21%" }} />
                        <col style={{ width: "22%" }} /> */}
              <col style={{ width: "6%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "7.5%" }} />
              <col style={{ width: "7.5%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "17%" }} />
              <thead className="bg-table-head rounded-md">
                <tr className="">
                  <th className="rounded-l-md " onClick={sortData}>
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
                      id="name"
                      className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      ชื่อสาขา
                      <div
                        id="name"
                        className="inline-flex items-center justify-center"
                      >
                        <img
                          id="name"
                          className={`self-end w-[4px] ${
                            sort?.name == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="name"
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
                  <th>
                    <div
                      id="openTime"
                      className="rounded-l-md flex items-center justify-center gap-0.5 "
                    >
                      เวลาเปิดสาขา
                      {/* <div id="openTime" className="inline-flex items-center justify-center">
                                            <img id="openTime" className={`self-end w-[4px] ${sort?.openTime == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                            <img id="openTime" className={`self-end w-[4px] ${sort?.openTime == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                        </div> */}
                    </div>
                  </th>
                  <th>
                    <div
                      id="closeTime"
                      className="rounded-l-md flex items-center justify-center gap-0.5 "
                    >
                      เวลาปิดสาขา
                      {/* <div id="closeTime" className="inline-flex items-center justify-center">
                                            <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                            <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                        </div> */}
                    </div>
                  </th>
                  <th>
                    <div
                      id="closeTime"
                      className="rounded-l-md flex items-center justify-center gap-0.5 "
                    >
                      จำนวนชั่วโมงที่เปิด
                      {/* <div id="closeTime" className="inline-flex items-center justify-center">
                                            <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                            <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                        </div> */}
                    </div>
                  </th>
                  <th rowSpan="2">
                    อุณหภูมิ Sale floor area avg. (°C)
                    <p className="flex items-center justify-center gap-0.5 ">
                      (ช่วงเวลา 12.00-16.00)
                      {/* <div id="area" className="inline-flex items-center justify-center">
                                            <img id="area" className={`self-end w-[4px] ${sort?.area == 'desc' && "h-[14px]"} mt-1`} src='img/sortUp.svg' />
                                            <img id="area" className={`self-end w-[4px] ${sort?.area == 'asc' && "h-[14px]"} mt-1`} src='img/sortDown.svg' />
                                        </div> */}
                    </p>
                  </th>
                  <th rowSpan="2" className="rounded-r-md py-4">
                    เวลาการทำงานของ Air ทั้งหมด (Hrs.)
                    <p className="flex items-center justify-center gap-0.5 ">
                      (00:00-23:59)
                      {/* <div id="area" className="inline-flex items-center justify-center">
                                        <img id="area" className={`self-end w-[4px] ${sort?.area == 'desc' && "h-[14px]"} mt-1`} src='img/sortUp.svg' />
                                        <img id="area" className={`self-end w-[4px] ${sort?.area == 'asc' && "h-[14px]"} mt-1 `} src='img/sortDown.svg' />
                                    </div> */}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {!isLoading &&
                  data?.table?.map((ele, index) => {
                    // if (index < perPage * page && index + 1 > perPage * page - perPage) {
                    const is24h = ele.openTime.startsWith("24");
                    return (
                      <tr
                        key={index}
                        className={`odd:bg-white even:bg-table text-center ${
                          isLoading && "animate-pulse bg-current/[.2]"
                        } rounded-md`}
                      >
                        <td
                          className="rounded-l-md cursor-pointer"
                          onClick={() => onRowClick(ele)}
                        >
                          {ele.storeNumber}
                        </td>
                        <td
                          className="py-2 text-left cursor-pointer"
                          onClick={() => onRowClick(ele)}
                        >
                          {ele.storeName}
                        </td>
                        <td className="py-2 text-left">{ele.area}</td>
                        {/* <td>{is24h ? "00:00" : ele.openTime && ('0' + ele.openTime).slice(-5)}</td>
                                            <td>{is24h ? "00:00" : ele.closeTime && ('0' + ele.closeTime).slice(-5)}</td> */}
                        <td>
                          {is24h
                            ? "00:00"
                            : ele.openTime &&
                              (ele.openTime == 0
                                ? "00:00"
                                : "0" + ele.openTime
                              ).slice(-5)}
                        </td>
                        <td>
                          {is24h
                            ? "00:00"
                            : ele.closeTime &&
                              (ele.closeTime == 0
                                ? "00:00"
                                : "0" + ele.closeTime
                              ).slice(-5)}
                        </td>
                        <td>{ele.totalHour}</td>
                        <td className="py-2">
                          <div
                            className={`w-fit mx-auto div-round px-1.5 min-w-[3rem] ${
                              ele.tempSaleAvg == -999
                                ? "-"
                                : ele.tempSaleAvg <= 25 // ele.config.maxTemp
                                ? "card-blue"
                                : ele.tempSaleAvg >= 27 && //ele.config.minTemp
                                  "card-red"
                            }`}
                          >
                            {ele.tempSaleAvg === -999
                              ? "-"
                              : ele.tempSaleAvg.toLocaleString([], {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                })}
                          </div>
                        </td>
                        <td className="rounded-r-md">
                          {ele.totalAirWorkingHour == -999
                            ? "-"
                            : ele.totalAirWorkingHour}
                        </td>
                      </tr>
                    );
                    // }
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
          <Pagination
            page={page}
            setPage={(num) => {
              setPage(num);
              getData({ OffsetNo: perPage * num - perPage });
            }}
            perPage={perPage}
            setPerPage={(num) => {
              setPerPage(num);
              const offset = num * page - num;
              if (offset > data?.total) {
                setPage(1);
                getData({ LimitNo: num, OffsetNo: 0 });
              } else {
                getData({ LimitNo: num });
              }
            }}
            total={data?.total}
          />
        </>
      )}
    </>
  );
}

function CardChiller({ data, configChiller, onClickCard }) {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [showTable, setShowTable] = useState(true);
  const is24h = data.storeInfo.openTime?.startsWith("24 H");
  return (
    <>
      <div
        className="p-2 shadow-md mb-4 rounded-md border"
        id={`chiller_${data.storeInfo.storeNumber}`}
      >
        <div className="flex justify-between text-secondary py-2">
          <div className="cursor-pointer" onClick={() => onClickCard(data)}>
            <p className="font-bold text-base text-sm">
              {data.storeInfo.storeNumber} - {data.storeInfo.storeName}
            </p>
            <div className="text-sm text-[#B1B1B1]">
              {data.storeInfo.storeArea || <br />}
              <p>
                เวลาเปิด-ปิด{" "}
                {is24h
                  ? "00:00"
                  : data.storeInfo.openTime &&
                    ("0" + data.storeInfo.openTime).slice(-5)}
                -
                {is24h
                  ? "00:00"
                  : data.storeInfo.closeTime &&
                    ("0" + data.storeInfo.closeTime).slice(-5)}
              </p>
            </div>
          </div>
          <div className="flex gap-1 items-start">
            <div className="mr-1 text-xs">
              อุณหภูมิ Sale floor area avg. (ช่วงเวลา 12:00-16:00)
              <div
                className={`div-round mt-1.5 text-sm font-semibold ${
                  data.tempSaleAvg == "-999"
                    ? ""
                    : data.tempSaleAvg >= 27 // data.tempSaleConfig?.maxTemp
                    ? "card-red"
                    : data.tempSaleAvg <= 25 && // data.tempSaleConfig?.minTemp &&
                      "card-blue"
                }`}
              >
                {data.tempSaleAvg == "-999"
                  ? "-"
                  : data.tempSaleAvg?.toFixed(2)}
              </div>
            </div>
            <button
              id="button"
              className="rounded-full bg-table-head p-1.5 transition duration-300"
              onClick={() => setShowTable(!showTable)}
            >
              {!showTable ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="14"
                  viewBox="0 0 448 512"
                >
                  <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="14"
                  viewBox="0 0 448 512"
                >
                  <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`-mx-2 duration-500 transition-all overflow-hidden ${
            !showTable ? "max-h-0 ease-out" : "max-h-screen ease-in"
          }`}
        >
          <div className="grid mt-2 pb-8">
            <div className="scrollbar overflow-auto">
              <table className="min-w-[1000px] text-sm w-full table-fixed">
                <thead className="text-dark bg-table-head rounded-md">
                  <tr>
                    <th className="rounded-l-md py-2">ลำดับ</th>
                    <th colSpan={2}>ยี่ห้อ</th>
                    <th colSpan={2}>ประเภท</th>
                    <th colSpan={2}>
                      <p>Active time</p> (h:mm)
                    </th>
                    <th colSpan={2}>เวลาเปิด Chiller โดยเฉลี่ย</th>
                    <th colSpan={2}>เวลาปิด Chiller โดยเฉลี่ย</th>
                    <th colSpan={2}>
                      <p>Setpoint</p> (°F)
                    </th>
                    {/* <th colSpan={3} className="">
                                        <p>AVG Approach Evap Cooler</p>
                                        (°F)</th> */}
                    <th colSpan={3} className="">
                      <p>AVG Leaving Water temp Cooler</p>
                      (°F)
                    </th>
                    <th colSpan={3} className="">
                      <p>AVG Entering Water temp Cooler</p>
                      (°F)
                    </th>
                    {/* <th colSpan={3} className="">
                                        <p>Delta Cooler</p>
                                        (°F)</th> */}
                    <th colSpan={3} className="">
                      <p>AVG Approach Condenser</p>
                      (°F)
                    </th>
                    <th colSpan={3} className="">
                      <p>AVG Leaving Water temp Condenser</p>
                      (°F)
                    </th>
                    <th colSpan={3} className=" py-2">
                      <p>AVG Entering Water temp Condenser</p>
                      (°F)
                    </th>
                    {/* <th colSpan={3} className="rounded-r-md ">
                                        <p>Delta Condenser</p>
                                        (°F)</th> */}
                  </tr>
                </thead>
                <tbody>
                  {data?.chillerData7days
                    ?.sort((a, b) => a.seq - b.seq)
                    ?.map(
                      (ele, ind) =>
                        ind < perPage * page &&
                        ind + 1 > perPage * page - perPage && (
                          <tr
                            className="odd:bg-white even:bg-table text-center text-dark rounded-md"
                            key={ind}
                          >
                            <td className="rounded-l-md py-3">{ele.seq}</td>
                            <td colSpan={2} className="px-2">
                              {ele.chillerBandName}
                            </td>
                            <td colSpan={2}>{ele.type}</td>
                            <td colSpan={2} className="p-2">
                              {Math.floor(ele.activeTime / 60)
                                .toString()
                                .padStart(2, "0")}
                              :
                              {(ele.activeTime % 60)
                                .toString()
                                .padStart(2, "0")}
                              {/* {new Date(ele.activeTime * 60 * 1000).toISOString().substring(11, 5)} */}
                            </td>
                            <td colSpan={2}>{ele.openTime || "-"}</td>
                            <td colSpan={2}>{ele.closeTime || "-"}</td>
                            <td colSpan={2}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.setpoint <
                                        configChiller.normal.setpoint &&
                                      "card-red"
                                    : ele.setpoint <
                                        configChiller.LFLT.setpoint &&
                                      "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.setpoint.toFixed(2)}
                              </div>
                            </td>
                            {/* <td colSpan={3}>
                                            <div className={`${ele.type == 'Normal' ? (ele.Approach_Evap_Cooler < configChiller.normal.condApproach.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Approach_Evap_Cooler > configChiller.normal.condApproach.max && "card-red")
                                                : (ele.Approach_Evap_Cooler < configChiller.LFLT.condApproach.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Approach_Evap_Cooler > configChiller.LFLT.condApproach.max && "card-red")} p-1.5 my-2 w-[4rem] mx-auto rounded`}>
                                                {ele.Approach_Evap_Cooler == '999' ? '-'
                                                    : ele.Approach_Evap_Cooler.toFixed(2)}
                                            </div>
                                        </td> */}
                            <td colSpan={3}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.Leaving_Water_Temp_Cooler <
                                      configChiller.normal.leavingChilledWater
                                        .min
                                      ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                      : ele.Leaving_Water_Temp_Cooler >
                                          configChiller.normal
                                            .leavingChilledWater.max &&
                                        "card-red"
                                    : ele.Leaving_Water_Temp_Cooler <
                                      configChiller.LFLT.leavingChilledWater.min
                                    ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                    : ele.Leaving_Water_Temp_Cooler >
                                        configChiller.LFLT.leavingChilledWater
                                          .max && "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.Leaving_Water_Temp_Cooler == "999"
                                  ? "-"
                                  : ele.Leaving_Water_Temp_Cooler.toFixed(2)}
                              </div>
                            </td>
                            <td colSpan={3}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.Entering_Water_Temp_Cooler <
                                      configChiller.normal.enteringChilledWater
                                        .min
                                      ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                      : ele.Entering_Water_Temp_Cooler >
                                          configChiller.normal
                                            .enteringChilledWater.max &&
                                        "card-red"
                                    : ele.Entering_Water_Temp_Cooler <
                                      configChiller.LFLT.enteringChilledWater
                                        .min
                                    ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                    : ele.Entering_Water_Temp_Cooler >
                                        configChiller.LFLT.enteringChilledWater
                                          .max && "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.Entering_Water_Temp_Cooler == "999"
                                  ? "-"
                                  : ele.Entering_Water_Temp_Cooler.toFixed(2)}
                              </div>
                            </td>
                            {/* <td colSpan={3}>
                                            <div className={`${ele.type == 'Normal' ? (ele.Delta_Cooler < configChiller.normal.averageCoolerTemp.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Delta_Cooler > configChiller.normal.averageCoolerTemp.max && "card-red")
                                                : (ele.Delta_Cooler < configChiller.LFLT.averageCoolerTemp.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Delta_Cooler > configChiller.LFLT.averageCoolerTemp.max && "card-red")} p-1.5 my-2 w-[4rem] mx-auto rounded`}>
                                                {ele.Delta_Cooler == '999' ? '-'
                                                    : ele.Delta_Cooler.toFixed(2)}
                                            </div>
                                        </td> */}

                            <td colSpan={3}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.Approach_Conderser <
                                      configChiller.normal.condApproach.min
                                      ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                      : ele.Approach_Conderser >
                                          configChiller.normal.condApproach
                                            .max && "card-red"
                                    : ele.Approach_Conderser <
                                      configChiller.LFLT.condApproach.min
                                    ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                    : ele.Approach_Conderser >
                                        configChiller.LFLT.condApproach.max &&
                                      "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.Approach_Conderser == "999"
                                  ? "-"
                                  : ele.Approach_Conderser.toFixed(2)}
                              </div>
                            </td>
                            <td colSpan={3}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.Leaving_Water_Temp_Conderser <
                                      configChiller.normal.leavingCondWater.min
                                      ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                      : ele.Leaving_Water_Temp_Conderser >
                                          configChiller.normal.leavingCondWater
                                            .max && "card-red"
                                    : ele.Leaving_Water_Temp_Conderser <
                                      configChiller.LFLT.leavingCondWater.min
                                    ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                    : ele.Leaving_Water_Temp_Conderser >
                                        configChiller.LFLT.leavingCondWater
                                          .max && "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.Leaving_Water_Temp_Conderser == "999"
                                  ? "-"
                                  : ele.Leaving_Water_Temp_Conderser.toFixed(2)}
                              </div>
                            </td>
                            <td colSpan={3}>
                              <div
                                className={`${
                                  ele.type == "Normal"
                                    ? ele.Entering_Water_Temp_Conderser <
                                      configChiller.normal.enteringCondWater.min
                                      ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                      : ele.Entering_Water_Temp_Conderser <
                                          configChiller.normal.enteringCondWater
                                            .max && "card-red"
                                    : ele.Entering_Water_Temp_Conderser <
                                      configChiller.LFLT.enteringCondWater.min
                                    ? "text-[#32AA23] bg-[#DDF0E3] font-bold"
                                    : ele.Entering_Water_Temp_Conderser >
                                        configChiller.LFLT.enteringCondWater
                                          .max && "card-red"
                                } p-1.5 my-2 w-[4rem] mx-auto rounded`}
                              >
                                {ele.Entering_Water_Temp_Conderser == "999"
                                  ? "-"
                                  : ele.Entering_Water_Temp_Conderser.toFixed(
                                      2
                                    )}
                              </div>
                            </td>
                            {/* <td colSpan={3} className="rounded-r-md">
                                            <div className={`${ele.type == 'Normal' ? ele.Delta_Conderser < configChiller.normal.averageCondTemp.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Delta_Conderser < configChiller.normal.averageCondTemp.max && "card-red"
                                                : ele.Delta_Conderser < configChiller.LFLT.averageCondTemp.min ? "text-[#32AA23] bg-[#DDF0E3] font-bold" : ele.Delta_Conderser > configChiller.LFLT.averageCondTemp.max && "card-red"} p-1.5 my-2 w-[4rem] mx-auto rounded`}>
                                                {ele.Delta_Conderser == '999' ? '-'
                                                    : ele.Delta_Conderser.toFixed(2)}
                                            </div>
                                        </td> */}
                          </tr>
                        )
                    )}
                </tbody>
              </table>
              {!data?.chillerData7days?.length && (
                <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
                  ไม่พบข้อมูล
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showTable && (
        <div className="-mt-12 pb-3">
          <ExportTypes
            id={`chiller_${data.storeInfo.storeNumber}`}
            csvData={data?.chillerData7days?.map((ele, i) => {
              const objThai = {
                ลำดับ: ele.seq,
                ยี่ห้อ: ele.chillerBandName,
                ประเภท: ele.type,
                "Active time (h:mm)":
                  Math.floor(ele.activeTime / 60)
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  (ele.activeTime % 60).toString().padStart(2, "0"),
                "เวลาเปิด Chiller โดยเฉลี่ย": ele.openTime || "-",
                "เวลาปิด Chiller โดยเฉลี่ย": ele.closeTime || "-",
                "Setpoint (°F)": ele.setpoint.toFixed(2),
                // 'AVG Approach Evap Cooler (°F)': ele.Approach_Evap_Cooler.toFixed(2),
                "AVG Leaving Water temp Cooler (°F)":
                  ele.Leaving_Water_Temp_Cooler.toFixed(2),
                "AVG Entering Water temp Cooler (°F)":
                  ele.Entering_Water_Temp_Cooler.toFixed(2),
                // 'Delta Cooler (°F)': ele.Delta_Cooler.toFixed(2),
                "AVG Approach Condenser (°F)":
                  ele.Approach_Conderser.toFixed(2),
                "AVG Leaving Water temp Condenser (°F)":
                  ele.Leaving_Water_Temp_Conderser.toFixed(2),
                "AVG Entering Water temp Condenser (°F)":
                  ele.Entering_Water_Temp_Conderser.toFixed(2),
                // 'Delta Condenser (°F)': ele.Delta_Conderser.toFixed(2),
              };
              return objThai;
            })}
          />
        </div>
      )}
    </>
  );
}
export default AirKPI;
