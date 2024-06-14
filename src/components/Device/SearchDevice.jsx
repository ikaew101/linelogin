import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import InputSearch from "../inputSearch";

export default function SearchDevice({
  search,
  setSearch,
  isLoading,
  dropdownData,
  onSearch,
  stores,
  searchQuery,
  setSearchQuery,
}) {
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    if (stores) {
      const list = [];
      stores.mini?.map((ele) => {
        list.push(ele[search.groupName]);
      });
      stores.hyper?.map((ele) => {
        list.push(ele[search.groupName]);
      });
      stores.super?.map((ele) => {
        list.push(ele[search.groupName]);
      });
      setStoreList([...new Set(list)]);
    }
  }, [stores, search.groupName]);

  return (
    <div className="p-3">
      <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
        <div className="grid sm:grid-cols-8 text-sm pl-3 pr-2 h-fit grid-flow-row  w-full gap-2 self-start ">
          <div className="col-span-4 md:col-span-1">
            <div className="grid md:grid-rows-2 w-full">
              <div className="self-center">ค้นหาจาก</div>
              <div>
                <select
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                  value={search?.groupName}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      groupName: e.target.value,
                    })
                  }
                >
                  {dropdownData.stores.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-4">
            <div className="grid md:grid-rows-2  items-center ">
              <div className="self-center">ค้นหา</div>
              <div className="relative">
                <AiOutlineSearch className="text-xl text-gray-500 absolute m-2" />

                <InputSearch
                  setValue={setSearchQuery}
                  placeholder="ค้นหา"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  list={storeList}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-2">
            <div className="flex gap-x-3 w-full ">
              <div className="grid md:grid-rows-2  w-full ">
                <div className="self-center">ประเภทอุปกรณ์</div>
                <div>
                  <select
                    className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                    value={search?.typeId}
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        typeId: e.target.value,
                      })
                    }
                  >
                    <option value="all">ทั้งหมด</option>
                    {dropdownData.types.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-1 col-span-4 flex items-end gap-1.5 justify-end sm:justify-start">
            <button
              className={`text-primary border-primary border font-bold py-2 px-7 rounded-md shadow hover:shadow-md disabled:opacity-50 h-[2.5em] z-30`}
              disabled={isLoading}
              onClick={onSearch}
            >
              ค้นหา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
