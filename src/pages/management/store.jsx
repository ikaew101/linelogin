import { useEffect, useMemo, useRef, useState } from "react";
import AuthService from "../../service/authen";
import useAuthData from "../../context/useAuthData";
import { TableStoreGroup } from "../../components/Store/tableStoreGroup";
import TabHeader from "../../components/Store/components/TabHeader";
import SearchStoreGroup from "../../components/Store/SearchStoreGroup";
import { TableStoreSetting } from "../../components/Store/TableStoreSetting";
import SearchStoreSetting from "../../components/Store/SearchStoreSetting";
import CardOfflineOnline from "../../components/Store/components/CardOfflineOnline";
import ModalAddEditStoreSetting from "../../components/Store/ModalAddEditStoreSetting";
import ModalViewStoreSetting from "../../components/Store/ModalViewStoreSetting";
import { ModanConfirmDeleteStoreSetting } from "../../components/Store/ModanConfirmDeleteStoreSetting";
import StoreService from "../../service/store";
import { useUpdateEffect } from "ahooks";

function StoreIndex() {
  const stateTab = JSON.parse(localStorage.getItem("tab"));
  const currentIndex = "manageStore";
  const [tab, setTab] = useState(
    (stateTab && stateTab[0] == currentIndex && stateTab[1]) || "group"
  );

  // STORE GROUP
  const [groupList, setGroupList] = useState([]);

  // STORE SETTING
  const [settingList, setSettingList] = useState([]);

  const [isModalAddStoreSettings, setIsModalAddStoreSettings] = useState(false);
  const [isModalViewStoreSettings, setisModalViewStoreSettings] =
    useState(false);
  const [isModalConfirmSettings, setIsModalConfirmSettings] = useState(false);

  // SHARE
  const [isLoading, setIsLoading] = useState();
  const [search, setSearch] = useState({
    storeFormatId: "",
    status: "active",
  });
  const [selectedData, setSelectedData] = useState(null);
  const [storeFormatList, setStoreFormatList] = useState([]);
  const [optionStoreList, setOptionStoreList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { storeList, userId } = useAuthData();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);

  async function initStoreFormat() {
    try {
      // dropdown ประเภทสาขา
      const res = await StoreService.getStoreFormat();
      setStoreFormatList(
        res?.data.map((v) => {
          return {
            label: v.name,
            value: v.id,
            ele: v,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function initData() {
    if (tab === "group") {
      try {
        setIsLoading(true);
        await AuthService.refreshTokenPage(userId);

        const resAll = await StoreService.getAll({
          // ขาด Filed ค้นหา
          storeFormatId: String(search.storeFormatId), // ประเภทสาขา
        });

        const newMap = resAll?.data?.list.map((v, i) => {
          return {
            ...v,
            index: i + 1,
          };
        });

        setGroupList(newMap);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else if (tab === "setting") {
      try {
        setIsLoading(true);
        await AuthService.refreshTokenPage(userId);

        const resAll = await StoreService.getAll({
          // ขาด Filed ค้นหา
          storeFormatId: String(search.storeFormatId), // ประเภทสาขา
          status: search.status, // สถานะ
          page: page,
          limit: perPage,
        });

        const newMap = resAll?.data?.list.map((v, i) => {
          return {
            ...v,
            id: toBigInt(v?.id),
            format_id: toBigInt(v?.format_id),
            index: resAll?.data?.start + i + 1,
          };
        });
        setSettingList(newMap);
        setLastPage(resAll?.data?.count);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify([currentIndex, tab]));
    initData();
  }, [tab]);

  useEffect(() => {
    initStoreFormat();
  }, []);

  // skip first render
  useUpdateEffect(() => {
    initData();
  }, [page, perPage]);

  useEffect(() => {
    // สำหรับ Filter list บน field ค้นหา
    const formatLabel = storeFormatList
      .find((v) => v.value == search.storeFormatId)
      ?.label.toLowerCase();

    setOptionStoreList(
      listStoreNumber[
        formatLabel?.split(" ")[0]?.toLowerCase() === "mini"
          ? "mini"
          : formatLabel?.split(" ")[0]?.toLowerCase() === "supermarket"
          ? "super"
          : formatLabel?.split(" ")[0]?.toLowerCase() === "hypermarket"
          ? "hyper"
          : "all"
      ]
    );
  }, [search.storeFormatId, listStoreNumber]);

  const countStoreOnline = useMemo(() => {
    return settingList.reduce((count, store) => {
      return store.active === 1 ? count + 1 : count;
    }, 0);
  }, [settingList]);

  const countStoreOffline = useMemo(() => {
    return settingList.reduce((count, store) => {
      return store.active == -1 ? count + 1 : count;
    }, 0);
  }, [settingList]);

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">การจัดการ Store</div>
      <TabHeader tab={tab} setTab={setTab} />

      {tab == "group" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchStoreGroup
              search={search}
              setSearch={setSearch}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stores={optionStoreList}
              storeFormatList={storeFormatList}
              onSearch={() => {
                initData();
              }}
            />
          </div>

          <TableStoreGroup
            items={groupList}
            isLoading={isLoading}
            setGroupList={setGroupList}
            onSearch={() => {
              initData();
            }}
            onDelete={(item) => {
              setIsModalConfirmSettings(true);
              setSelectedData(item);
            }}
          />

          {isModalConfirmSettings && (
            <ModanConfirmDeleteStoreSetting
              onClose={() => setIsModalConfirmSettings(false)}
              storeData={selectedData}
            />
          )}
        </>
      )}

      {tab === "setting" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchStoreSetting
              search={search}
              setSearch={setSearch}
              isLoading={isLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stores={optionStoreList}
              storeFormatList={storeFormatList}
              onCreate={() => {
                setSelectedData(null);
                setIsModalAddStoreSettings(true);
              }}
              onSearch={() => {
                initData();
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 ">
            <CardOfflineOnline
              title="สาขาที่ Online"
              type="online"
              value={String(countStoreOnline)}
            />
            <CardOfflineOnline
              title="สาขาที่ Offline"
              type="offline"
              value={String(countStoreOffline)}
            />
          </div>
          <TableStoreSetting
            isLoading={isLoading}
            items={settingList}
            setSettingList={setSettingList}
            onView={(item) => {
              setisModalViewStoreSettings(true);
              setSelectedData(item);
            }}
            onEdit={(item) => {
              setIsModalAddStoreSettings(true);
              setSelectedData(item);
            }}
            onDelete={(item) => {
              setIsModalConfirmSettings(true);
              setSelectedData(item);
            }}
            page={page}
            perPage={perPage}
            setPerPage={setPerPage}
            lastPage={lastPage}
            setPage={setPage}
          />

          {/* {isModalAddStoreSettings && (
            <ModalAddEditStoreSetting
              isOpen={isModalAddStoreSettings}
              onClose={() => {
                setIsModalAddStoreSettings(false);
              }}
              storeData={selectedData}
              onSuccess={() => {
                initData();
                setIsModalAddStoreSettings(false);
              }}
              storeFormatList={storeFormatList}
            />
          )} */}

          {isModalViewStoreSettings && (
            <ModalViewStoreSetting
              isOpen={isModalViewStoreSettings}
              onClose={() => setisModalViewStoreSettings(false)}
              storeData={selectedData}
            />
          )}

          {isModalConfirmSettings && (
            <ModanConfirmDeleteStoreSetting
              isOpen={isModalConfirmSettings}
              onClose={() => setIsModalConfirmSettings(false)}
              storeData={selectedData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default StoreIndex;
