import DropdownSearch from "./dropdownSearch";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchUser({
  format,
  setFormat,
  isLoading,
  search,
  setSearch,
  optionStoreList,
}) {
  return (
    <div>
      <div className={`bg-white border -mt-10 mx-2 rounded-xl shadow`}>
        <div className="p-3">
          <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
            <div className="grid lg:grid-cols-10 md:grid-cols-9 grid-cols-2 text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] w-full gap-2 self-start">
              <div className="grid md:grid-rows-2 md:col-span-3 col-span-1 items-center">
                <div className="self-center">ค้นหา</div>
                <div className="relative">
                  <AiOutlineSearch className="text-xl text-gray-500 absolute m-2" />
                  <input
                    className=" border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 pl-8 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                    placeholder="ค้นหา username"
                    value={search?.username}
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="md:col-span-2 col-span-1 flex gap-x-3 w-full justify-end">
                <div className="grid md:grid-rows-2  w-full ">
                  <div className="self-center">กลุ่ม</div>
                  <div>
                    <select
                      className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                      value={search?.groupName}
                      onChange={(e) => {
                        setSearch({
                          ...search,
                          groupName: e.target.value,
                        });
                      }}
                    >
                      <option value="">ทั้งหมด</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-rows-2 md:col-span-2  col-span-1 items-center">
                <div className="self-center">รหัสสาขา</div>
                <DropdownSearch
                  name="storeNumber"
                  value={search?.storeNumber}
                  setValue={(value) =>
                    setSearch({ ...search, storeNumber: value })
                  }
                  list={optionStoreList}
                />
              </div>

              <div className="md:col-span-2 col-span-1 flex gap-x-3 w-full justify-end">
                <div className="grid md:grid-rows-2  w-full ">
                  <div className="self-center">ประเภทสาขา</div>
                  <div>
                    <select
                      className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="mini">Mini-supermarket</option>
                      <option value="super">Supermarket</option>
                      <option value="hyper">Hypermarket</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-end max-lg:justify-end max-lg:col-span-9 max-md:col-span-2">
                <button
                  className={`text-white bg-primary py-2 px-7 rounded-md shadow hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                  disabled={isLoading}
                  // onClick={getData}
                >
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
