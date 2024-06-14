import { useState } from "react";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import { Link } from "react-router-dom";
import Pagination2 from "../Pagination2";

export function TableStoreGroup({
  items = [],
  setGroupList,
  isLoading,
  onDelete,
}) {
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
    setGroupList(
      items.sort((a, b) => {
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
      <div id="tableStoreGroup" className="p-3 px-4">
        <div className="text-xs py-3 mx- 1 grid">
          <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
            <table
              width="100%"
              className="max-[1250px]:min-w-max table-fixed max-lg:min-w-[1000px] w-full text-dark text-[13px]"
            >
              <thead className="bg-table-head rounded-md">
                <tr>
                  <th className="w-[100px] rounded-l-md " onClick={sortData}>
                    <div
                      id="index"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
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
                  <th rowSpan="2" onClick={sortData}>
                    <div
                      id="name"
                      className="rounded-l-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      ชื่อกลุ่ม
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
                  <th>
                    <div className="rounded-l-md flex items-center justify-center gap-0.5">
                      รหัสสาขา
                    </div>
                  </th>
                  <th>
                    <div className="rounded-l-md flex items-center justify-center gap-0.5">
                      จำนวนสาขา
                    </div>
                  </th>
                  <th rowSpan="2" className="rounded-r-md py-4">
                    <div className="rounded-l-md flex items-center justify-center gap-0.5">
                      จัดการ
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {!isLoading &&
                  items?.map((item, index) => {
                    if (
                      index < perPage * page &&
                      index + 1 > perPage * page - perPage
                    ) {
                      return (
                        <tr
                          key={index}
                          className={`odd:bg-white even:bg-table text-center rounded-md`}
                        >
                          <td>{item?.index}</td>
                          <td className="text-left">{item?.name}</td>
                          <td>
                            04606 , 11017 , 09043 , 17131 , 10050 , 07891 ,
                            58589 , 14213 , 60730 ...
                          </td>
                          <td>17</td>
                          <td>
                            <div className="flex gap-2 justify-center text-sm items-center">
                              <Link
                                className="text-white p-2 px-5 bg-secondary font-bold rounded-md my-2"
                                to={`view?id=${item?.id}`}
                              >
                                View
                              </Link>
                              <Link
                                className="text-white p-2 px-5 bg-warning font-bold rounded-md my-2 flex items-center gap-2"
                                to={`edit?id=${item?.id}`}
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
                              <button
                                type="button"
                                className="flex items-center hover:bg-light h-fit my-auto py-1.5 cursor-pointer rounded"
                                onClick={() => onDelete(item)}
                              >
                                <svg
                                  className="w-6 h-6"
                                  viewBox="0 0 25 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.9 17L12.5 14.4L15.1 17L16.5 15.6L13.9 13L16.5 10.4L15.1 9L12.5 11.6L9.9 9L8.5 10.4L11.1 13L8.5 15.6L9.9 17ZM7.5 21.5C6.95 21.5 6.479 21.304 6.087 20.912C5.695 20.52 5.49933 20.0493 5.5 19.5V6.5H4.5V4.5H9.5V3.5H15.5V4.5H20.5V6.5H19.5V19.5C19.5 20.05 19.304 20.521 18.912 20.913C18.52 21.305 18.0493 21.5007 17.5 21.5H7.5Z"
                                    fill="#E1221C"
                                  />
                                </svg>
                              </button>
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
        !items?.length && (
          <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
            ไม่พบข้อมูล
          </div>
        )
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
      <div className="sm:absolute sm:-mt-8">
        <ExportPages
          name="storeGroup"
          onSaving={setSaving}
          csvData={true}
          getAllData={async () => {
            const all = items?.map((ele) => {
              const objThai = {
                ลำดับ: ele?.index || "-",
                ชื่อกลุ่ม: ele?.name || "-",
                รหัสสาขา: ele?.name || "-",
                จำนวนสาขา: ele?.name || "-",
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
