import { useEffect, useState } from "react";
import Spinner from "../spinner";
import { Link, useLocation, useParams } from "react-router-dom";
import AuthService from "../../service/authen";
import DropdownSearch from "../User/dropdownSearch";
import CardStore from "./components/CardStore";
import useAuthData from "../../context/useAuthData";
import StoreService from "../../service/store";

export function AddEditStore() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    groupName: "",
    division: 59990,
  });
  const [tab, setTab] = useState("group");
  const [textDropdown, setTextDropdown] = useState("");
  const [selectStoreNumber, setSelectStoreNumber] = useState([1, 2, 3, 4]);
  const [listStoreNumber, setListStoreNumber] = useState([]);

  const queryParams = new URLSearchParams(useLocation().search);
  const id = queryParams.get("id");
  const { userId } = useAuthData();

  useEffect(() => {
    initData();
  }, []);

  async function initData() {
    try {
      setIsLoading(true);

      await AuthService.refreshTokenPage(userId);
      //const res = await
      // setListStoreNumber(res.)

      if (id) {
        // getById()
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function deleteItem(index) {
    const store = [...selectStoreNumber];
    store.splice(index, 1);
    setSelectStoreNumber(store);
  }

  async function submit() {
    try {
      // const res = await StoreService.create(data);
    } catch (error) {
      console.log(error);
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
          {isLoading ? (
            <div className="flex justify-center items-center h-11 my-5 mt-10">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-2 p-2 mt-5 gap-3">
              <div className="grid md:grid-rows-2 items-center">
                <div className="self-center">ชื่อกลุ่ม</div>
                <div className="relative">
                  <input
                    className=" border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 px-2 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                    value={data.groupName}
                    onChange={(e) =>
                      setData({ ...data, groupName: e.target.value })
                    }
                  />
                </div>
              </div>

              {id && (
                <div className="grid md:grid-rows-2 items-center">
                  <div className="self-center">จำนวน store</div>
                  <b className="text-dark">{selectStoreNumber.length}</b>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLoading && (
          <>
            <div
              className={`bg-white border my-5 mx-2 rounded-xl p-5 min-h-[22em]`}
            >
              <div className="flex gap-3">
                <div className="grid md:grid-rows-2 items-center w-full">
                  <div className="self-center">เลือก Store number</div>
                  <div className="relative">
                    <DropdownSearch
                      name="storeNumber"
                      value={textDropdown}
                      setValue={(value) => setTextDropdown(value)}
                      list={listStoreNumber}
                      showIcon
                    />
                  </div>
                </div>

                <button
                  className={`text-white bg-secondary p-2 w-1/5 min-w-[7rem] self-end rounded-md shadow hover:shadow-md font-bold disabled:bg-gray-400 h-[2.5em] z-30 text-center`}
                >
                  + เพิ่ม
                </button>
              </div>

              <div className="pt-5">
                {/* {data.division == 0
                        ? 'All Store'
                        : data.division == '5999'
                            ? <div className="text-dark">
                                Store group
                                <div className="flex-wrap flex gap-3 mt-2">

                                    <div className="text-sm border p-2 rounded-md w-[20rem] gap-y-2 grid pb-4">
                                        <b className="text-md text-base line-clamp-3 text-ellipsis h-[4.7em]">
                                            { }
                                        </b>
                                        จำนวน : store
                                    </div>
                                </div>
                            </div>
                            : */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 max-h-[800px] overflow-y-auto scrollbar">
                  {selectStoreNumber.map((ele, index) => (
                    <div key={index}>
                      <CardStore isDelete onDelete={() => deleteItem(index)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ButtonBar id={id} onSubmit={submit} />
          </>
        )}
      </div>
    </>
  );
}

function ButtonBar({ id, onSubmit }) {
  return (
    <div className="bg-white border mt-3 mx-2 rounded-xl p-7 flex justify-between gap-3 text-sm">
      <div>
        {id && (
          <button
            className="rounded-md border border-[#F03030] hover:bg-light p-2 min-w-[8rem] pr-2.5 text-danger font-bold hover:shadow-md  flex gap-1 justify-center items-center"
            onClick={() => onSubmit()}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.9 17L12.5 14.4L15.1 17L16.5 15.6L13.9 13L16.5 10.4L15.1 9L12.5 11.6L9.9 9L8.5 10.4L11.1 13L8.5 15.6L9.9 17ZM7.5 21.5C6.95 21.5 6.479 21.304 6.087 20.912C5.695 20.52 5.49933 20.0493 5.5 19.5V6.5H4.5V4.5H9.5V3.5H15.5V4.5H20.5V6.5H19.5V19.5C19.5 20.05 19.304 20.521 18.912 20.913C18.52 21.305 18.0493 21.5007 17.5 21.5H7.5Z"
                fill="#E1221C"
              />
            </svg>
            ลบ Store group
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          className="rounded-md border text-dark hover:bg-[#CFD4D9] p-2 min-w-[8rem] font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          to="/manage_store"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
              fill="#565E6D"
            />
          </svg>
          ยกเลิก
        </Link>
        <button
          className="rounded-md border bg-primary hover:bg-[#00BCB4] p-2 min-w-[8rem] text-white font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          onClick={() => onSubmit()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H16.175C16.4417 3 16.696 3.05 16.938 3.15C17.18 3.25 17.3923 3.39167 17.575 3.575L20.425 6.425C20.6083 6.60834 20.75 6.821 20.85 7.063C20.95 7.305 21 7.559 21 7.825V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM12 18C12.8333 18 13.5417 17.7083 14.125 17.125C14.7083 16.5417 15 15.8333 15 15C15 14.1667 14.7083 13.4583 14.125 12.875C13.5417 12.2917 12.8333 12 12 12C11.1667 12 10.4583 12.2917 9.875 12.875C9.29167 13.4583 9 14.1667 9 15C9 15.8333 9.29167 16.5417 9.875 17.125C10.4583 17.7083 11.1667 18 12 18ZM7 10H14C14.2833 10 14.521 9.904 14.713 9.712C14.905 9.52 15.0007 9.28267 15 9V7C15 6.71667 14.904 6.479 14.712 6.287C14.52 6.095 14.2827 5.99934 14 6H7C6.71667 6 6.479 6.096 6.287 6.288C6.095 6.48 5.99934 6.71734 6 7V9C6 9.28334 6.096 9.521 6.288 9.713C6.48 9.905 6.71734 10.0007 7 10Z"
              fill="white"
            />
          </svg>
          บันทึก
        </button>
      </div>
    </div>
  );
}
