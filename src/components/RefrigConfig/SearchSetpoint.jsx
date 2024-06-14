export default function SearchSetpoint() {
  return (
    <div className="p-3 mt-5">
      <div className="p-2 text-sm mt-3">
        <div className="grid gap-4 items-center  grid-cols-2 md:grid-cols-5 px-3">
          {/* 1 */}
          <div>
            <div className="mb-1">Chiller type</div>
            <div>
              <select className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white">
                <option value="">ทั้งหมด</option>
              </select>
            </div>
          </div>
          {/* 2 */}
          <div>
            <div className="mb-1">ประเภทสาขา</div>
            <div>
              <select className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white">
                <option value="">ทั้งหมด</option>
              </select>
            </div>
          </div>
          {/* 3 */}
          <div className="self-end flex justify-end col-span-3   md:justify-end mb-0.5">
            <button
              className={`text-white bg-primary py-1.5 px-7 rounded-md shadow hover:shadow-md font-medium disabled:bg-gray-400`}
            >
              ค้นหา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
