import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthData from "../../context/useAuthData";
import CardStore from "../Store/components/CardStore";
import ModalAddStoreGroup from "./ModalAddStoreGroup";

export function EditUser() {
  const [tab, setTab] = useState("user");
  const [data, setData] = useState({
    status: true,
    division: 5999,
  });
  const [isModalAddStoreGroup, setIsModalAddStoreGroup] = useState(false);
  const [storeDetail, setStoreDetail] = useState([
    {
      name: "Group for FM manager of North area - 018",
      numberOfStore: 12,
      id: "12",
    },
    {
      name: "Group for FM manager of North area - 017",
      numberOfStore: 13,
      id: "13",
    },
    {
      name: "Group for FM manager of North area - 016",
      numberOfStore: 13,
      id: "14",
    },
    {
      name: "Group for FM manager of North area - 015",
      numberOfStore: 13,
      id: "15",
    },
    {
      name: "Group for FM manager of North area - 014",
      numberOfStore: 13,
      id: "16",
    },
  ]);

  const { userId } = useAuthData();
  async function submit() {
    try {
      const body = {
        status: data.status,
        detail: storeDetail,
      };
      console.log(body, userId);

      //   await UserService.editUser(id, body)
    } catch (error) {
      throw new Error(error);
    }
  }

  function deleteItem(index) {
    const groups = [...storeDetail];
    groups.splice(index, 1);
    setStoreDetail(groups);
  }

  return (
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
                    <label className="relative inline-flex items-center cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={data.status}
                        className="sr-only peer"
                        name="night"
                        onChange={() =>
                          setData({ ...data, status: !data.status })
                        }
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

            <div>
              <div className="text-dark">
                {data?.division == "5999" ? "Store group" : "Store Number"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4 mt-4 items-center">
                {storeDetail.map((_, index) => {
                  return (
                    <div key={index}>
                      <CardStore
                        data={data}
                        isDelete
                        onDelete={() => deleteItem(index)}
                      />
                    </div>
                  );
                })}
                {data?.division == 5999 && (
                  <button
                    type="button"
                    className="text-md border p-2  h-[100px] mt-1.5 rounded-md bg-secondary max-w-[110px] text-white   justify-center flex items-center px-5 gap-2 font-bold pr-6 cursor-pointer"
                    onClick={() => setIsModalAddStoreGroup(true)}
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 19V13H5V11H11V5H13V11H19V13H13V19H11Z"
                        fill="white"
                      />
                    </svg>
                    เพิ่ม
                  </button>
                )}
              </div>
            </div>

            {isModalAddStoreGroup && (
              <ModalAddStoreGroup
                isOpen={isModalAddStoreGroup}
                setIsModalAddStoreGroup={setIsModalAddStoreGroup}
                setStoreDetail={setStoreDetail}
                storeDetail={storeDetail}
                onClose={() => setIsModalAddStoreGroup(false)}
              />
            )}
          </div>
        </div>
      </div>

      <ButtonBar submit={submit} />
    </div>
  );
}

function ButtonBar({ submit }) {
  return (
    <div className="bg-white border mt-3 mx-2 rounded-xl p-7 flex justify-end gap-3 text-sm">
      <Link
        className="rounded-md border text-dark hover:bg-[#CFD4D9] p-2 min-w-[8rem] font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
        to="/manage_user"
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
        onClick={() => submit()}
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
  );
}
