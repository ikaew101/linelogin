import { useEffect, useState } from "react";
import { TableUser } from "../../components/User/tableUser";
import { TableGroup } from "../../components/User/tableGroup";
import AuthService from "../../service/authen";
import useAuthData from "../../context/useAuthData";
import SearchUser from "../../components/User/SearchUser";
import ModalViewUser from "../../components/User/ModalViewUser";
import SearchUserGroup from "../../components/User/SearchUserGroup";

function UserIndex({ userId }) {
  const stateTab = JSON.parse(localStorage.getItem("tab"));
  const currentIndex = "manageUser";
  // console.log(stateTab, userId)
  const [tab, setTab] = useState(
    (stateTab && stateTab[0] == currentIndex && stateTab[1]) || "user"
  );
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({
    username: "",
    groupName: "",
    storeFormat: "",
  });

  const { listStoreNumber } = useAuthData();
  const [optionStoreList, setOptionStoreList] = useState([]);

  const [storeData, setStoreData] = useState();
  const [format, setFormat] = useState("");
  const [searchGroup, setSearchGroup] = useState({
    groupName: "",
    createDate: new Date().setDate(new Date().getDate() - 1),
  });

  const [isModalViewUser, setIsModalViewUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  async function initData() {
    try {
      setData();
      setIsLoading(true);
      await AuthService.refreshTokenPage(userId);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify([currentIndex, tab]));
    initData();
  }, [tab]);

  useEffect(() => {
    // console.log(listStoreNumber, format)
    setOptionStoreList(listStoreNumber[format || "all"]);
  }, [format, listStoreNumber]);

  // console.log(optionStoreList)

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">
        การจัดการผู้ใช้งาน
      </div>
      <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
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
          onClick={(e) => setTab(e.target.name)}
        >
          กลุ่ม
        </button>
      </div>

      {tab == "user" ? (
        <>
          <SearchUser
            format={format}
            setFormat={setFormat}
            search={search}
            setSearch={setSearch}
            isLoading={isLoading}
            optionStoreList={optionStoreList}
          />
          <TableUser
            onView={(item) => {
              setSelectedUser(item);
              setIsModalViewUser(true);
            }}
          />
          {isModalViewUser && (
            <ModalViewUser
              isOpen={isModalViewUser}
              selectedUser={selectedUser}
              onClose={() => setIsModalViewUser(false)}
            />
          )}
        </>
      ) : (
        <>
          <SearchUserGroup
            searchGroup={searchGroup}
            setSearchGroup={setSearchGroup}
            isLoading={isLoading}
          />

          <TableGroup />
        </>
      )}
    </div>
  );
}

export default UserIndex;
