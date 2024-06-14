import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination2({
  perPage,
  setPerPage,
  page,
  lastPage,
  setPage,
}) {
  return (
    <div>
      <div className="flex flex-col text-xs justify-between px-3">
        <div className="self-end grid grid-cols-2">
          <div>
            <div id="export">
              จำนวนแถว ต่อ หน้า:
              <select
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
                className="p-2 mx-1 border-0 text-sm  text-[#000] rounded-lg cursor-pointer outline-0"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="ml-auto flex items-center">
            หน้า {page} จาก {lastPage}
            <div className="ml-3 mr-1 flex gap-2" id="hideText">
              <button
                className={`p-2.5 hover:bg-light rounded-full ${
                  !(page > 1) && "cursor-default"
                }`}
                onClick={() => page > 1 && setPage(page - 1)}
              >
                <FiChevronLeft className="font-semibold" />
              </button>
              <button
                className={`p-2.5 hover:bg-light rounded-full ${
                  !(page < lastPage) && "cursor-default"
                }`}
                onClick={() => page < lastPage && setPage(page + 1)}
              >
                <FiChevronRight className="font-semibold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
