import React from "react";
import InputSearch from "../inputSearch";

export default function SearchContractor({
  storeData,
  saving,
  format,
  setFormat,
  type,
  setType,
}) {
  return (
    <div>
      <div id="storeData" className="p-3">
        <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
          <div className="rounded-full bg-gray-100 px-8 py-3 h-fit mx-auto w-full ">
            <div className="grid grid-cols-4 gap-x-4">
              <div className="grid-rows-2 xs:w-max">
                <div className="text-sm h-fit">Cost Center</div>
                <b>{storeData?.costCenter} 20051</b>
                <br />
                <br />
              </div>
              <div className="grid-rows-2">
                <div className="text-sm h-fit xs:w-max">รหัสสาขา</div>
                <b>{storeData?.storeNumber} 4005</b>
              </div>
              <div className="grid-rows-2 col-span-2 max-sm:ml-2">
                <div className="text-sm h-fit">ชื่อสาขา</div>
                <b className="line-clamp-2">
                  {storeData?.storeName} CPFM Sukhumvit 93 (GO.01-Oct-21)
                </b>
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-4 text-sm mt-3 px-2 h-fit lg:grid-cols-2 xl:grid-cols-4 min-w-[50vw]"> */}
          <div className="grid grid-cols-4 max-lg:grid-cols-2 text-sm px-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-start">
            <div className="grid grid-rows-2 grid-flow-col gap-x-3">
              <div className="self-center">ประเภทสาขา</div>
              <div>
                <select
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="mini">Mini-supermarket</option>
                  <option value="super">Supermarket</option>
                  <option value="hyper">Hypermarket</option>
                </select>
              </div>
            </div>
            <div className="grid grid-rows-2 grid-flow-col gap-x-3">
              <div className="self-center">เลือกประเภท</div>
              <div>
                <select
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer w-full outline-none h-[2.5em] bg-white"
                  name="status"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="costCenter">Cost Center</option>
                  <option value="storeNumber">รหัสสาขา</option>
                  <option value="storeName">ชื่อสาขา</option>
                </select>
              </div>
            </div>
            <InputSearch />
            <button
              className={`text-white bg-primary px-8 rounded-md  self-end ${
                !saving && "shadow"
              } hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
            >
              ค้นหา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
