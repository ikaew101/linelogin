import { useState } from "react";
import Spinner from "../spinner";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../helper/cn";
import { FaCheckCircle } from "react-icons/fa";
import ModalSuccess, { ItemSuccess } from "../RefrigConfig/ModalSuccess";

export default function TableChillerPerformance() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      type: "LFLT",
      costCenter: "test",
    },
    {
      type: "Normal",
      costCenter: "test",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const lastPage = Math.ceil(data?.length / perPage) || 1;
  const [isModalSuccess, setIsModalSuccess] = useState(false);

  const classesTableHeader = {
    group1: "bg-[#809DED26]",
    group2: "bg-[#F9BE001F]",
  };

  const classesInput = {
    base: "w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg   outline-0 h-[2.5em] bg-white ",
  };

  function handleUpdate() {
    setIsModalSuccess(true);
  }

  function handleCloseModal() {
    setIsModalSuccess(false);
  }

  return (
    <div className={cn("bg-white border mx-2 rounded-xl mt-4 pb-2 shadow")}>
      <div id="tableChillerPerformance" className="p-3 px-4 mt-10">
        <div className="text-xs py-3 mx- 1 grid">
          <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
            <table
              width="100%"
              className="table-fixed min-w-[1850px] w-full text-dark text-[13px]"
            >
              <thead className="bg-table-head rounded-md">
                <tr>
                  <th className="rounded-l-md">Type</th>
                  <th>Setpoint</th>
                  {/* group 1 */}
                  <th className={cn(classesTableHeader.group1, "py-4")}>
                    Leaving Water Temp (Lower) Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Leaving Water Temp (Upper) Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Entering Water Temp (Lower) Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Entering Water Temp (Upper) Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Approach Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Delta (Lower) Cooler
                  </th>
                  <th className={cn(classesTableHeader.group1)}>
                    Delta (Upper) Cooler
                  </th>
                  {/* group 2 */}
                  <th className={cn(classesTableHeader.group2)}>
                    Leaving Water Temp (Lower) Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Leaving Water Temp (Upper) Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Entering Water Temp (Lower) Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Entering Water Temp (Upper) Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Approach Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Delta (Lower) Condensor
                  </th>
                  <th className={cn(classesTableHeader.group2)}>
                    Delta (Upper) Condensor
                  </th>
                  <th className="rounded-r-md py-4">จัดการ</th>
                </tr>
              </thead>
              <tbody className="text-center">
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
                          <td className="py-4">{item.type}</td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className={cn(classesInput.base, "max-w-[65px]")}
                            />
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

      {isModalSuccess && (
        <ModalSuccess
          onClose={() => handleCloseModal()}
          className="!max-w-[700px]"
        >
          <ItemSuccess title="Chiller Type" text="Normal" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* group 1 */}
            <div className="flex flex-col gap-y-4">
              <ItemSuccess
                title="Leaving Water Temp (Lower) Cooler"
                text="10"
              />
              <ItemSuccess
                title="Leaving Water Temp (Upper) Cooler"
                text="10"
              />
              <ItemSuccess
                title="Entering Water Temp (Lower) Cooler"
                text="10"
              />
              <ItemSuccess
                title="Entering Water Temp (Upper) Cooler"
                text="10"
              />
              <ItemSuccess title="Approach Cooler" text="10" />
              <ItemSuccess title="Delta (Lowe) Cooler" text="10" />
              <ItemSuccess title="Delta (Upper) Cooler" text="10" />
            </div>

            {/* group 2 */}
            <div className="flex flex-col gap-y-4">
              <ItemSuccess
                title="Leaving Water Temp (Lower) Condensor"
                text="10"
              />
              <ItemSuccess
                title="Leaving Water Temp (Upper) Condensor"
                text="10"
              />
              <ItemSuccess
                title="Entering Water Temp (Lower) Condensor"
                text="10"
              />
              <ItemSuccess
                title="Entering Water Temp (Upper) Condensor"
                text="10"
              />
              <ItemSuccess title="Approach Condensor" text="10" />
              <ItemSuccess title="Delta (Lowe) Condensor" text="10" />
              <ItemSuccess title="Delta (Upper) Condensor" text="10" />
            </div>
          </div>
        </ModalSuccess>
      )}
    </div>
  );
}
