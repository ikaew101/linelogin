import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthService from "../../service/authen";
import CardStore from "./components/CardStore";
import useAuthData from "../../context/useAuthData";

export function ViewStore() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    groupName: "Group for FM Manager of North area-046",
    countStore: 17,
  });
  const [tab, setTab] = useState("group");

  const queryParams = new URLSearchParams(useLocation().search);
  const id = queryParams.get("id");
  const { userId } = useAuthData();

  useEffect(() => {
    initData();
  }, []);

  async function initData() {
    try {
      await AuthService.refreshTokenPage(userId);
    } catch (err) {
      throw new Error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="p-3 mt-5 mb-3">
        <div className="text-2xl pl-4 font-semibold md:pl-6 flex items-center gap-2 cursor-default">
          <Link to="/manage_store" className="">
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
          <span className="text-[#B1B1B1]">การจัดการ Store /</span>
          รายละเอียด Store group
        </div>
        <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex sm:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
          <button
            name="group"
            className={`${
              tab == "group" && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
            onClick={(e) => setTab(e.target.name)}
          >
            Store group
          </button>
          <button
            name="setting"
            className={`${
              tab == "setting" && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
            onClick={(e) => {
              localStorage.setItem(
                "tab",
                JSON.stringify(["manageStore", e.target.name])
              );
              window.location.assign("/manage_store");
            }}
          >
            Store setting
          </button>
        </div>

        <div className={`bg-white border -mt-10 mx-2 rounded-xl p-3`}>
          <div className="flex flex-wrap p-2 mb-3 mt-8 gap-3">
            <div className="grid md:grid-rows-2 items-center flex-1">
              <div className="self-center">ชื่อกลุ่ม</div>
              <h6 className="text-dark font-bold">{data?.groupName}</h6>
            </div>

            <div className="grid md:grid-rows-2 items-center flex-1 ">
              <div className="self-center">จำนวน store</div>
              <h6 className="text-dark font-bold">{data?.countStore}</h6>
            </div>
            <div className="flex md:justify-end">
              <Link
                className="text-white p-2 px-5 bg-warning font-bold rounded-md my-2 flex items-center gap-3"
                to={`/manage_store/edit?id=${id}`}
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
            </div>
          </div>
        </div>

        <div className={`bg-white border my-5 mx-2 rounded-xl p-5`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4">
            {Array.from({ length: 100 }, (_, index) => {
              return (
                <div key={index}>
                  <CardStore data={data} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
