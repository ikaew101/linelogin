import { useState } from "react";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import { toLastDateTimeTH } from "../../helper/utils";
import Pagination2 from "../Pagination2";

export function TableDevice({ items = [], isLoading, setDeviceList }) {
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const lastPage = Math.ceil(items?.length / perPage) || 1;
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

    setDeviceList(
      items?.sort((a, b) => {
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

  return (
    <div
      className={`bg-white ${
        saving != "JPEG" ? "shadow" : ""
      } border mx-2 rounded-xl mt-4 pb-2`}
    >
      <div id="device" className="p-3 px-4">
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
                      id="index"
                      className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      ลำดับ
                      <div className="inline-flex items-center justify-center">
                        <img
                          id="index"
                          className={`self-end w-[4px] ${
                            sort?.storeNumber == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="index"
                          className={`self-end w-[4px] ${
                            sort?.storeNumber == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th rowSpan="2" className=" " onClick={sortData}>
                    <div
                      id="name"
                      className=" flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      ชื่ออุปกรณ์
                      <div className="inline-flex items-center justify-center">
                        <img
                          id="name"
                          className={`self-end w-[4px] ${
                            sort?.deviceName == "desc" && "h-[14px]"
                          }`}
                          src="img/sortUp.svg"
                        />
                        <img
                          id="name"
                          className={`self-end w-[4px] ${
                            sort?.deviceName == "asc" && "h-[14px]"
                          } `}
                          src="img/sortDown.svg"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className=" flex items-center justify-center gap-0.5">
                      Address
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center justify-center gap-0.5 ">
                      ประเภทอุปกรณ์
                    </div>
                  </th>
                  <th rowSpan="2" className=" py-4">
                    <div className=" flex items-center justify-center gap-0.5 ">
                      ชื่อสาขา
                    </div>
                  </th>
                  <th rowSpan="2" className="rounded-r-md py-4">
                    <div className="rounded-l-md flex items-center justify-center gap-0.5">
                      Last update
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {!isLoading &&
                  items?.map((item, i) => {
                    if (
                      i < perPage * page &&
                      i + 1 > perPage * page - perPage
                    ) {
                      return (
                        <tr
                          key={i}
                          className={`odd:bg-white even:bg-table text-center ${
                            loading && "animate-pulse bg-current/[.2]"
                          } rounded-md`}
                        >
                          <td className="py-4"> {item?.index} </td>
                          <td className="text-left">{item?.name || "-"}</td>
                          <td>{item?.address || "-"}</td>
                          <td>{item?.code || "-"}</td>
                          <td className="py-4">
                            {/* <div className="text-left">
                              <div>H05001:Seacon(GO.28-Oct-94)</div>
                              <div className="text-[#9CA4B3] mt-1.5">05001</div>
                            </div> */}
                          </td>
                          <td>{toLastDateTimeTH(item?.updatedAt) || "-"}</td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-10 my-4 pb-3">
          <Spinner />
        </div>
      )}
      {!isLoading && !items?.length && (
        <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
          ไม่พบข้อมูล
        </div>
      )}
      {!isLoading && !!items?.length && (
        <>
          <Pagination2
            perPage={perPage}
            setPerPage={setPerPage}
            page={page}
            lastPage={lastPage}
            setPage={setPage}
          />
        </>
      )}
      <div className="sm:absolute sm:-mt-8" hidden={isLoading}>
        <ExportPages
          name="device"
          onSaving={setSaving}
          csvData={true}
          getAllData={async () => {
            const all = items?.map((ele) => {
              const objThai = {
                ลำดับ: ele?.index || "-",
                ชื่ออุปกรณ์: ele?.name || "-",
                Address: ele?.address || "-",
                ประเภทอุปกรณ์: ele?.code || "-",
                ชื่อสาขา: ele?.name || "-",
                "Last update": toLastDateTimeTH(ele?.updatedAt) || "-",
              };
              return objThai;
            });

            return all;
          }}
        />
      </div>
    </div>
  );
}
