import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import InputSearch from "../inputSearch";

export default function SearchStoreGroup({
  search,
  setSearch,
  isLoading,
  searchQuery,
  setSearchQuery,
  stores,
  storeFormatList = [],
  onSearch,
}) {
  return (
    <div className="p-3">
      <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
        <div className="grid sm:grid-cols-10  text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] w-full gap-2 self-start">
          <div className="grid md:grid-rows-2 lg:col-span-5 sm:col-span-6 col-span-5 items-center">
            <div className="self-center">ค้นหา</div>
            <div className="relative">
              <AiOutlineSearch className="text-xl text-gray-500 absolute m-2" />
              <InputSearch
                setValue={setSearchQuery}
                placeholder="ค้นหาชื่อกลุ่ม store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                list={stores}
              />
            </div>
          </div>

          <div className="lg:col-span-2 sm:col-span-4 col-span-5 flex gap-x-3 w-full justify-end">
            <div className="grid md:grid-rows-2  w-full ">
              <div className="self-center">ประเภทสาขา</div>
              <div>
                <select
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                  value={search.storeFormatId}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      storeFormatId: e.target.value,
                    })
                  }
                >
                  {storeFormatList?.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end lg:col-span-3 col-span-10 gap-1.5 max-lg:ml-auto">
            <button
              className={`text-primary border-primary border font-bold py-2 px-7 rounded-md shadow hover:shadow-md disabled:opacity-50 h-[2.5em] z-30`}
              disabled={isLoading}
              onClick={onSearch}
            >
              ค้นหา
            </button>

            <Link
              className={`text-white bg-primary p-2 px-10 w-full rounded-md shadow hover:shadow-md font-bold disabled:bg-gray-400 h-[2.5em] z-30 text-center`}
              to="add"
            >
              + สร้าง
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
