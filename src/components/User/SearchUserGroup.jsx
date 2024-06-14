import DatePickerThai from "../DatePickerThai";
import { AiOutlineSearch } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function SearchUserGroup({
  searchGroup,
  setSearchGroup,
  isLoading,
}) {
  const lastDate = new Date().setDate(new Date().getDate() - 1);

  return (
    <div>
      <div className={`bg-white border -mt-10 mx-2 rounded-xl shadow`}>
        <div className="p-3">
          <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
            <div className="sm:flex text-sm pl-3 pr-2 h-fit grid-flow-row w-full gap-2 self-start grid">
              <div className="min-w-3/6 w-full ">
                <div className="self-center">ค้นหา</div>
                <div className="relative">
                  <AiOutlineSearch className="text-xl text-gray-500 absolute m-2" />
                  <input
                    className=" border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 pl-8 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                    placeholder="ชื่อกลุ่ม"
                    value={searchGroup?.groupName}
                    onChange={(e) => {
                      setSearchGroup({
                        ...searchGroup,
                        groupName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="sm:w-2/6 min-w-fit">
                <div className="items-center justify-items-center max-md:justify-items-start relative">
                  <div className="self-center ">วันที่สร้าง</div>
                  <>
                    <DatePickerThai
                      selected={searchGroup?.createDate}
                      maxDate={lastDate}
                      onChange={(date) => {
                        setSearchGroup({
                          ...searchGroup,
                          createDate: date,
                        });
                      }}
                    />
                  </>
                  <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
                </div>
              </div>

              {/* <div className='flex items-end max-md:justify-end  max-md:col-span-9'> */}
              <div className="sm:w-1/6 w-full self-end max-sm:justify-end flex">
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
