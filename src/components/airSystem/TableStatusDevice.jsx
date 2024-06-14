import { useState } from "react"
import Spinner from "../spinner"

export default function TableStatusDevice({ data, isLoading }) {
  return (
    <div className="grid">
      <div className="scrollbar overflow-x-auto">
        <table className="min-w-[500px] text-sm w-full">
          <col style={{ width: "40%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <thead className="text-dark bg-table-head">
            <tr>
              <th className="rounded-l-md py-2">หมายเลขอุปกรณ์</th>
              <th className="h-[3rem]">โหมดทำความเย็น</th>
              <th>โหมดพัดลม</th>
              <th className="rounded-r-md">การสื่อสาร</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((ele, ind) =>
              <tr key={ind} className="odd:bg-white even:bg-table text-center">
                <td className="rounded-l-md">
                  {ele.deviceNumber}
                </td>
                <td className="rounded-r-md py-2">
                  {ele.cooling == '-999' ? '-'
                    :
                    <label className='flex select-none items-center mx-auto w-max'>
                      <div className='relative'>
                        <input type='checkbox' className='sr-only'
                          checked={ele.cooling}
                        />
                        <div className={`box block h-6 w-[50px] rounded-full ${ele.cooling ? "bg-primary" : "bg-[#BDBDBD]"}`} />
                        <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${ele.cooling ? "translate-x-full left-[15px]" : "left-[3px]"}`}
                        />
                      </div>
                      <div className={`absolute text-[13px] font-semibold text-white ${ele.cooling ? "ml-2" : "ml-[21px]"} `}>
                        {ele.cooling ? "ON" : "OFF"}
                      </div>
                    </label>
                  }
                </td>

                <td className="rounded-r-md py-2">
                  {ele.airFanMode == '-999' ? '-'
                    : <label className='flex select-none items-center mx-auto w-max'>
                      <div className='relative'>
                        <input type='checkbox' className='sr-only'
                          checked={ele.airFanMode}
                        />
                        <div className={`box block h-6 w-[50px] rounded-full ${ele.airFanMode ? "bg-primary" : "bg-[#BDBDBD]"}`} />
                        <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${ele.airFanMode ? "translate-x-full left-[15px]" : "left-[3px]"}`}
                        />
                      </div>
                      <div className={`absolute text-[13px] font-semibold text-white ${ele.airFanMode ? "ml-2" : "ml-[21px]"} `}>
                        {ele.airFanMode ? "ON" : "OFF"}
                      </div>
                    </label>
                  }
                </td>

                <td className="rounded-r-md py-2">
                  {ele.communication == '-999' ? '-'
                    : <label className='flex select-none items-center mx-auto w-max'>
                      <div className='relative'>
                        <input type='checkbox' className='sr-only'
                          checked={ele.communication}
                        />
                        <div className={`box block h-6 w-[50px] rounded-full ${ele.communication ? "bg-primary" : "bg-[#BDBDBD]"}`} />
                        <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${ele.communication ? "translate-x-full left-[15px]" : "left-[3px]"}`}
                        />
                      </div>
                      <div className={`absolute text-[13px] font-semibold text-white ${ele.communication ? "ml-2" : "ml-[21px]"} `}>
                        {ele.communication ? "ON" : "OFF"}
                      </div>
                    </label>
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {
          isLoading
            ? <div className="flex justify-center items-center h-10 my-4"><Spinner /></div>
            : !data?.length &&
            <div className="flex justify-center h-10 rounded items-center my-4 text-dark">
              ไม่พบข้อมูล
            </div>
        }
      </div>
    </div>
  )
}