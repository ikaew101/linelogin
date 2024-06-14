import { useState } from "react";
import Spinner from "../spinner";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ModalSuccess, { ItemSuccess } from "../RefrigConfig/ModalSuccess";
import { FaCheckCircle } from "react-icons/fa";

export default function TableContractor() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      index: "1",
      costCenter: "test",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const lastPage = Math.ceil(data?.length / perPage) || 1;
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState();

  const [isModalSuccess, setIsModalSuccess] = useState(false);

  function handleUpdate() {
    setIsModalSuccess(true);
  }

  function handleCloseModal() {
    setIsModalSuccess(false);
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
  }

  return (
    <div
      className={`bg-white ${
        saving != "JPEG" ? "shadow" : ""
      } border mx-2 rounded-xl mt-4 pb-2`}
    >
      <div id="tableAirContractor" className="p-3 px-4">
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
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer "
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
                  <th>
                    <div>Cost Center</div>
                  </th>

                  <th>
                    <div>Category</div>
                  </th>
                  <th>
                    <div>wo_type</div>
                  </th>
                  <th>
                    <div>Contractor Name</div>
                  </th>
                  <th className="rounded-r-md py-4">
                    <div>จัดการ</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {!isLoading &&
                  data?.map((rank, index) => {
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
                          <td className="py-6 ">1</td>
                          <td>10058</td>
                          <td>A/C Alarm</td>
                          <td>P1 Urgent fix SLA</td>
                          <td>
                            <div>
                              <select className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white">
                                <option value="">DISPATCHED</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-[#00BCB4] p-2 px-5 bg-white  border border-[#00BCB4] font-bold rounded-md my-2 hover:bg-[#00BCB4]/10"
                              onClick={() => handleUpdate()}
                            >
                              <div className="flex items-center gap-2">
                                <FaCheckCircle size={20} />
                                <div>Update</div>
                              </div>
                            </button>
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
      {/* <div className="sm:absolute sm:-mt-8">
        <ExportPages
          name="refrigKPI"
          onSaving={setSaving}
          csvData={data.map((ele, i) => {
            const objThai = {
              รหัสสาขา: ele.storeNumber,
              ชื่อสาขา: ele.storeName,
              สังกัด: ele.storeName,
              จำนวนตู้ทั้งหมด: ele.storeName,
              จำนวนตู้ที่แจ้งเปิดงาน: ele.storeName,
            };

            return objThai;
          })}
          dataLength={+perPage + 1}
          img=""
          dataStart={perPage * (page - 1)}
        />
      </div> */}

      {isModalSuccess && (
        <ModalSuccess onClose={() => handleCloseModal()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <ItemSuccess title="wo_type" text="P1 Urgent Fix SLA" />
            <ItemSuccess title="Contractor Name" text="Internal Contractor" />
          </div>
        </ModalSuccess>
      )}
    </div>
  );
}
