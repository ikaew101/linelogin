import { useEffect, useState } from "react";
import SearchDevice from "../../components/Device/SearchDevice";
import { TableDevice } from "../../components/Device/TableDevice";
import DeviceService from "../../service/device";
import AuthService from "../../service/authen";
export default function DeviceInex() {
  const stateTab = JSON.parse(localStorage.getItem("device"));
  const [tab, setTab] = useState(
    (stateTab && stateTab == stateTab) || "device"
  );
  const [isLoading, setIsLoading] = useState();
  const [deviceList, setDeviceList] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    stores: [
      {
        label: "ชื่อสาขา",
        value: "storeName",
      },
      {
        label: "รหัสสาขา",
        value: "storeNumber",
      },
    ],
    types: [],
    lists: [],
  });

  const [search, setSearch] = useState({
    groupName: dropdownData.stores[0].value,
    typeId: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [stores, setStores] = useState([]);
  const [storeData, setStoreData] = useState();

  async function initData() {
    try {
      setIsLoading(true);
      await AuthService.refreshTokenPage(userId);

      const resAll = await DeviceService.getAll({
        storeId: storeData?.id,
        typeId: search.typeId,
      });
      const newMap = resAll?.data.map((v, i) => {
        return {
          ...v,
          index: i + 1,
        };
      });
      setDeviceList(newMap);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function initDropdown() {
    try {
      const resType = await DeviceService.getDeviceType();
      setDropdownData((prev) => ({
        ...prev,
        types: resType?.data.map((v, i) => {
          return {
            label: v.name,
            value: v.id,
          };
        }),
      }));
    } catch (error) {}
  }

  function initUser() {
    const authState = localStorage.getItem("_auth_state");
    setUserId(JSON.parse(authState)[0].id);
    const jsonStores = JSON.parse(authState)[0].availableStore;
    jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter);
    jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter);
    jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter);
    setStores(jsonStores);
  }

  useEffect(() => {
    initUser();
    initData();
    initDropdown();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const AllStore = [];
      stores.mini?.map((ele) => {
        AllStore.push(ele);
      });
      stores.hyper?.map((ele) => {
        AllStore.push(ele);
      });
      stores.super?.map((ele) => {
        AllStore.push(ele);
      });

      const found = AllStore.find((v) => v[search.groupName] === searchQuery);
      if (found) {
        setStoreData(found);
      }
    } else {
      setStoreData(null);
    }
  }, [searchQuery]);

  function handleSearch() {
    console.log(search);
    initData();
  }

  return (
    <div>
      <div className="p-3 mt-5 mb-3">
        <div className="text-2xl pl-4 font-semibold md:pl-6">
          การจัดการ Device
        </div>
        <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex lg:gap-4 relative z-30 gap-1  font-medium">
          <button
            name="device"
            className={`${
              tab == "device" && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
            onClick={(e) => setTab(e.target.name)}
          >
            Device setting
          </button>
        </div>

        {tab == "device" && (
          <>
            <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
              <SearchDevice
                search={search}
                setSearch={setSearch}
                isLoading={isLoading}
                dropdownData={dropdownData}
                onSearch={handleSearch}
                stores={stores}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <TableDevice
              items={deviceList}
              setDeviceList={setDeviceList}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
