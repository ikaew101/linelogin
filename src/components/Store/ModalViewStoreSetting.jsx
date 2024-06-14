import { useEffect, useState } from "react";
import ModalWrapper from "../base/modal/ModalWrapper";
import { Link } from "react-router-dom";
import { toLastDateTimeTH } from "../../helper/utils";
import DeviceService from "../../service/device";
import Spinner from "../spinner";

export default function ModalViewStoreSetting({ isOpen, onClose, storeData }) {
  const [sort, setSort] = useState();
  const [isLoading, setIsLoading] = useState();
  const [deviceList, setDeviceList] = useState([]);

  async function initData() {
    try {
      setIsLoading(true);

      const resAll = await DeviceService.getAll({
        storeId: String(storeData?.id),
      });
      const newMap = resAll?.data.map((v, i) => {
        return {
          ...v,
          index: i + 1,
        };
      });
      setDeviceList(newMap);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }

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
    setDeviceList(
      deviceList.sort((a, b) => {
        const A = a[label];
        const B = b[label];

        if (label == "name") {
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

  useEffect(() => {
    initData();
  }, []);
  return (
    <ModalWrapper
      isOpen={isOpen}
      className="mx-auto w-full !max-w-[940px] bg-white rounded-xl p-5 text-lg"
      onClose={onClose}
    >
      <div>
        {/* header */}
        <div className="flex justify-between items-center">
          <b className="text-dark">ข้อมูล Store</b>
          <div className="flex gap-4 items-center">
            <Link
              className="text-white text-base p-1.5 px-5 bg-warning font-bold rounded-md  flex items-center gap-2"
              to={`edit?id=${storeData?.id}`}
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
              แก้ไข
            </Link>
            <div className="cursor-pointer" onClick={() => onClose()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill="#B1B1B1"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* body */}
        <div className="mt-10 ">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">ชื่อสาขา</div>
              <div className="flex-1 text-sm text-dark ">{storeData?.name}</div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">รหัสสาขา</div>
              <div className="flex-1 text-sm text-dark ">
                {storeData?.store_number}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">
                Cost Center
              </div>
              <div className="flex-1 text-sm text-dark ">
                {storeData?.cost_center}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">ประเภทสาขา</div>
              <div className="flex-1 text-sm text-dark ">
                {storeData?.formatName}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">Parent</div>
              <div className="flex-1 text-sm text-dark ">
                {storeData?.parent}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">
                เวลาเปิด/ปิดสาขา
              </div>
              <div className="flex-1 text-sm text-dark ">
                {!storeData?.closeTime ? (
                  <div>{storeData?.openTime}</div>
                ) : (
                  <div>
                    {storeData?.openTime}-{storeData?.closeTime}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">สถานะ</div>
              <div className="flex-1 text-sm text-dark ">
                {storeData?.active == 1 ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row ">
              <div className="text-sm font-bold text-dark w-32">
                Last update
              </div>
              <div className="flex-1 text-sm text-dark ">
                {toLastDateTimeTH(storeData?.updated_at)}
              </div>
            </div>
          </div>
        </div>
        {/* table */}
        <div className="text-dark text-sm font-bold mt-4">
          อุปกรณ์ในสาขา ({deviceList.length} รายการ)
        </div>
        <div className="overflow-y-auto max-h-[25vh] scrollbar mt-2">
          <table className="max-[1250px]:min-w-max  max-lg:min-w-[1000px] w-full text-dark text-[13px] table-fixed ">
            <thead className="sticky top-0  bg-table-head rounded-md">
              <tr>
                <th className="rounded-l-md w-[100px] " onClick={sortData}>
                  <div
                    id="index"
                    className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer py-2"
                  >
                    ลำดับ
                    <div
                      id="index"
                      className="inline-flex items-center justify-center"
                    >
                      <img
                        id="index"
                        className={`self-end w-[4px] ${
                          sort?.index == "desc" && "h-[14px]"
                        }`}
                        src="img/sortUp.svg"
                      />
                      <img
                        id="index"
                        className={`self-end w-[4px] ${
                          sort?.index == "asc" && "h-[14px]"
                        } `}
                        src="img/sortDown.svg"
                      />
                    </div>
                  </div>
                </th>
                <th onClick={sortData}>
                  <div
                    id="name"
                    className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    ชื่อุปกรณ์
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
                <th className="w-[100px]">
                  <div className="rounded-l-md flex items-center justify-center gap-1">
                    Address
                  </div>
                </th>

                <th>
                  <div className=" flex items-center justify-center gap-1">
                    ประเภทอุปกรณ์
                  </div>
                </th>

                <th className="rounded-r-md ">
                  <div className="rounded-l-md flex items-center justify-center gap-1">
                    Last update
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && deviceList.length
                ? deviceList.map((item, i) => (
                    <tr key={i}>
                      <td className="text-center py-2">{item?.index}</td>
                      <td className="text-left">{item?.name || "-"}</td>{" "}
                      <td className="text-center">{item?.address || "-"}</td>
                      <td className="text-center">{item?.code || "-"}</td>
                      <td className="text-center">
                        {toLastDateTimeTH(item?.updatedAt) || "-"}
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-10 my-4 pb-3">
            <Spinner />
          </div>
        )}

        {!isLoading && !deviceList.length && (
          <div className="text-center text-dark text-sm mt-3">ไม่พบข้อมูล</div>
        )}

        {/* footer */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="rounded-md border text-dark w-full max-w-[248px] hover:bg-[#CFD4D9] py-1.5 px-4 text-sm font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
            onClick={() => onClose()}
          >
            ปิด
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
