import { useEffect, useState } from "react";
import Spinner from "../spinner";
import { Link } from "react-router-dom";
import AuthService from "../../service/authen";

export function ViewUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    status: true,
    division: 5999,
  });
  const [tab, setTab] = useState("user");

  useEffect(() => {
    initData();
  }, []);

  async function initData() {
    try {
      await AuthService.refreshTokenPage();
    } catch (err) {}
  }

  return (
    <>
      <div className="p-3 mt-5 mb-3">
        <div className="text-2xl pl-4 font-semibold md:pl-6 flex items-center gap-2 cursor-default">
          <Link to="/manage_user" className="">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825L13.425 18.6L12 20Z"
                fill="#565E6D"
              />
            </svg>
          </Link>
          <span className="text-[#B1B1B1]">การจัดการผู้ใช้งาน /</span>
          รายละเอียดข้อมูลผู้ใช้
        </div>
        <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex sm:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
          <button
            name="user"
            className={`${
              tab == "user" && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
            onClick={(e) => setTab(e.target.name)}
          >
            ผู้ใช้
          </button>
          <button
            name="group"
            className={`${
              tab == "group" && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
            onClick={(e) => {
              localStorage.setItem(
                "tab",
                JSON.stringify(["manageUser", e.target.name])
              );
              window.location.assign("/manage_user");
            }}
          >
            กลุ่ม
          </button>
        </div>

        <div className={`bg-white border -mt-10 mx-2 rounded-xl `}>
          <div className="p-3">
            <div className=" p-2 mt-5">
              <table className="border-separate border-spacing-y-4 text-dark">
                <tbody>
                  <tr>
                    <td className="pr-10">Username</td>
                    <td className="font-bold">th0700171</td>
                  </tr>
                  <tr>
                    <td>Division</td>
                    <td className="font-bold">05018</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td className="font-bold">manusark.exa@lotus.th</td>
                  </tr>
                  <tr>
                    <td>Firstname</td>
                    <td className="font-bold">Manusark</td>
                  </tr>
                  <tr>
                    <td>Lastname</td>
                    <td className="font-bold">Examplename</td>
                  </tr>
                  <tr>
                    <td>Group</td>
                    <td className="font-bold">GG-TH-PSE-FM_Manager</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      <label className="relative inline-flex items-center font-bold">
                        <input
                          type="checkbox"
                          checked={data.status}
                          className="sr-only peer"
                          name="night"
                          disabled
                        />
                        <div
                          className={`${"w-11 h-6 bg-[#B1B1B1] peer-focus:outline-none  peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all mr-1.5"} peer-checked:bg-[#006451]`}
                        />
                        {data.status ? "Active" : "Inactive"}
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>

              {data.division == 0 ? (
                "All Store"
              ) : data.division == "5999" ? (
                <div className="text-dark">
                  Store Number
                  <div className="flex-wrap flex gap-3 mt-2">
                    <div className="text-sm border p-2 rounded-md w-[20rem] gap-y-2 grid pb-4">
                      <b className="text-md text-base line-clamp-3 text-ellipsis h-[4.7em]">
                        {} To address all issues (including breaking changes) To
                        address all issues (including breaking changes) To
                        address all issues (including breaking changes)
                      </b>
                      จำนวน : store
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-dark">
                  Store number
                  <div className="flex-wrap flex gap-3 mt-2">
                    <div className="text-sm border p-2 rounded-md border-primary relative w-[20rem] grid items-center gap-y-2 pb-5">
                      <div className="flex items-center gap-3">
                        <img src="/icon/store.svg" className="mb-1" />
                        <b className="text-base ">{} 44321</b>
                      </div>

                      <div className="h-[4em]">
                        <p className="line-clamp-2 mb-1.5">
                          ชื่อสาขา : To address all issues (including breaking
                          changes) To address all issues (including breaking
                          changes)
                        </p>
                        Cost center :
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
