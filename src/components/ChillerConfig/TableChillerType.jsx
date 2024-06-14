import { useState } from "react";
import Spinner from "../spinner";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../helper/cn";
import { FaCheckCircle } from "react-icons/fa";
import ModalSuccess, { ItemSuccess } from "../RefrigConfig/ModalSuccess";

export default function TableChillerType() {
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

  const [isModalSuccess, setIsModalSuccess] = useState(false);

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
      <div id="tableChillerType" className="p-3 px-4">
        <div className="text-xs py-3 mx- 1 grid">
          <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
            <table
              width="100%"
              className="max-[1250px]:min-w-max table-fixed max-lg:min-w-[1000px] w-full text-dark text-[13px]"
            >
              <thead className="bg-table-head rounded-md">
                <tr>
                  <th className="rounded-l-md w-32">ลำดับ</th>
                  <th>Type</th>
                  <th className="rounded-r-md py-4 w-64">จัดการ</th>
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
                          <td className="py-4">1</td>

                          <td className="py-4">
                            <div>
                              <select className={cn(classesInput.base)}>
                                <option value="">Normal</option>
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

      {isModalSuccess && (
        <ModalSuccess onClose={() => handleCloseModal()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ItemSuccess title="Chiller Type" text="Normal" />
          </div>
        </ModalSuccess>
      )}
    </div>
  );
}
