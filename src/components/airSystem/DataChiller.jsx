import { useState } from "react"
import Spinner from "../spinner"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import ExportTypes from "../exportTypes"

export default function DataChillerLast({ format, data, isLoading, configChiller, saving, config }) {
  // const [isLoading, setIsLoading] = useState(false)

  const classRed = "bg-[#FFEBEB] text-danger p-1.5 my-2 w-[4rem] mx-auto font-bold rounded"
  const classBlue = "bg-[#DDF0E3] text-[#32AA23] p-1.5 my-2 w-[4rem] mx-auto font-bold rounded"

  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const is24h = config?.openTime?.startsWith("24 H")

  return (
    <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
      <div id="tableChillerLast" className="p-3">
        <div className='flex justify-between items-center pl-2 pt-2'>
          <div className='flex md:items-center'>
            {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="33" height="33" rx="16.5" fill="#FF6B1E" />
            <path d="M9.79167 26.0827C9.26458 26.0827 8.81321 25.8949 8.43754 25.5192C8.06188 25.1435 7.87436 24.6925 7.875 24.166V10.7494C7.875 10.2223 8.06283 9.77089 8.4385 9.39523C8.81417 9.01956 9.26522 8.83205 9.79167 8.83269H10.75V7.87435C10.75 7.60282 10.842 7.37506 11.026 7.19106C11.21 7.00706 11.4374 6.91538 11.7083 6.91602C11.9799 6.91602 12.2076 7.00802 12.3916 7.19202C12.5756 7.37602 12.6673 7.60346 12.6667 7.87435V8.83269H20.3333V7.87435C20.3333 7.60282 20.4253 7.37506 20.6093 7.19106C20.7933 7.00706 21.0208 6.91538 21.2917 6.91602C21.5632 6.91602 21.791 7.00802 21.975 7.19202C22.159 7.37602 22.2506 7.60346 22.25 7.87435V8.83269H23.2083C23.7354 8.83269 24.1868 9.02052 24.5625 9.39619C24.9381 9.77185 25.1256 10.2229 25.125 10.7494V24.166C25.125 24.6931 24.9372 25.1445 24.5615 25.5201C24.1858 25.8958 23.7348 26.0833 23.2083 26.0827H9.79167ZM9.79167 24.166H23.2083V14.5827H9.79167V24.166ZM16.5 18.416C16.2285 18.416 16.0007 18.324 15.8167 18.14C15.6327 17.956 15.541 17.7286 15.5417 17.4577C15.5417 17.1862 15.6337 16.9584 15.8177 16.7744C16.0017 16.5904 16.2291 16.4987 16.5 16.4994C16.7715 16.4994 16.9993 16.5914 17.1833 16.7754C17.3673 16.9594 17.459 17.1868 17.4583 17.4577C17.4583 17.7292 17.3663 17.957 17.1823 18.141C16.9983 18.325 16.7709 18.4167 16.5 18.416ZM12.6667 18.416C12.3951 18.416 12.1674 18.324 11.9834 18.14C11.7994 17.956 11.7077 17.7286 11.7083 17.4577C11.7083 17.1862 11.8003 16.9584 11.9843 16.7744C12.1683 16.5904 12.3958 16.4987 12.6667 16.4994C12.9382 16.4994 13.166 16.5914 13.35 16.7754C13.534 16.9594 13.6256 17.1868 13.625 17.4577C13.625 17.7292 13.533 17.957 13.349 18.141C13.165 18.325 12.9376 18.4167 12.6667 18.416ZM20.3333 18.416C20.0618 18.416 19.834 18.324 19.65 18.14C19.466 17.956 19.3744 17.7286 19.375 17.4577C19.375 17.1862 19.467 16.9584 19.651 16.7744C19.835 16.5904 20.0624 16.4987 20.3333 16.4994C20.6049 16.4994 20.8326 16.5914 21.0166 16.7754C21.2006 16.9594 21.2923 17.1868 21.2917 17.4577C21.2917 17.7292 21.1997 17.957 21.0157 18.141C20.8317 18.325 20.6042 18.4167 20.3333 18.416ZM16.5 22.2494C16.2285 22.2494 16.0007 22.1574 15.8167 21.9734C15.6327 21.7894 15.541 21.5619 15.5417 21.291C15.5417 21.0195 15.6337 20.7917 15.8177 20.6077C16.0017 20.4237 16.2291 20.332 16.5 20.3327C16.7715 20.3327 16.9993 20.4247 17.1833 20.6087C17.3673 20.7927 17.459 21.0201 17.4583 21.291C17.4583 21.5625 17.3663 21.7903 17.1823 21.9743C16.9983 22.1583 16.7709 22.25 16.5 22.2494ZM12.6667 22.2494C12.3951 22.2494 12.1674 22.1574 11.9834 21.9734C11.7994 21.7894 11.7077 21.5619 11.7083 21.291C11.7083 21.0195 11.8003 20.7917 11.9843 20.6077C12.1683 20.4237 12.3958 20.332 12.6667 20.3327C12.9382 20.3327 13.166 20.4247 13.35 20.6087C13.534 20.7927 13.6256 21.0201 13.625 21.291C13.625 21.5625 13.533 21.7903 13.349 21.9743C13.165 22.1583 12.9376 22.25 12.6667 22.2494ZM20.3333 22.2494C20.0618 22.2494 19.834 22.1574 19.65 21.9734C19.466 21.7894 19.3744 21.5619 19.375 21.291C19.375 21.0195 19.467 20.7917 19.651 20.6077C19.835 20.4237 20.0624 20.332 20.3333 20.3327C20.6049 20.3327 20.8326 20.4247 21.0166 20.6087C21.2006 20.7927 21.2923 21.0201 21.2917 21.291C21.2917 21.5625 21.1997 21.7903 21.0157 21.9743C20.8317 22.1583 20.6042 22.25 20.3333 22.2494Z" fill="white" />
          </svg> */}
            <img src="icon/calendar.png" className="w-10 h-10" />

            <div className='font-bold text-[#828282] ml-1 md:flex gap-2 grid max-md:grid-row-2'>
              ข้อมูล Chiller ล่าสุด
              <div className="flex border-l items-center text-sm">
                <div className="w-4 h-4 rounded-full bg-danger mx-2" /> มากกว่า
                <div className="w-4 h-4 rounded-full bg-[#32AA23] mx-2" /> น้อยกว่า
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end text-xs text-secondary">
            <div className="border grid-rows-2 rounded py-1 text-center px-2.5">
              เวลาเปิดโดยเฉลี่ย
              <p className="text-3xl px-3.5 text-dark font-bold max-sm:text-2xl">
                {config?.avgOpenTime ? ('0' + (config?.avgOpenTime)).slice(-5) : '-'}
              </p>
            </div>
            <div className="border grid-rows-2 rounded py-1 text-center px-2.5">
              เวลาปิดโดยเฉลี่ย
              <p className="text-3xl px-3.5 text-dark font-bold max-sm:text-2xl">
                {config?.avgCloseTime ? ('0' + (config?.avgCloseTime)).slice(-5): '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid mt-2">
          <div className="scrollbar overflow-x-auto">
            <table className="min-w-[1010px] text-sm w-full table-fixed">
              <thead className="text-dark bg-table-head rounded-md">
                <tr>
                  <th className="rounded-l-md py-2">ลำดับ</th>
                  <th colSpan={2}>ยี่ห้อ</th>
                  <th colSpan={2}>ประเภท</th>
                  <th colSpan={3}>เวลาล่าสุด</th>
                  <th colSpan={2}>Setpoint (°F)</th>
                  <th colSpan={2}>เวลาเปิด Chiller</th>
                  <th colSpan={2}>Chiller กำลังทำงาน</th>
                  <th colSpan={3} className="bg-[#ECF0FC]">
                    <p>Approach Evap Cooler</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#ECF0FC]">
                    <p>Leaving Water temp Cooler</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#ECF0FC]">
                    <p>Entering Water temp Cooler</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#ECF0FC]">
                    <p>Delta Cooler</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#F8F1DF]">
                    <p>Approach Condenser</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#F8F1DF]">
                    <p>Leaving Water temp Condenser</p>
                    (°F)</th>
                  <th colSpan={3} className="bg-[#F8F1DF] py-2">
                    <p>Entering Water temp Condenser</p>
                    (°F)</th>
                  <th colSpan={3} className="rounded-r-md bg-[#F8F1DF]">
                    <p>Delta Condenser</p>
                    (°F)</th>
                </tr>
              </thead>
              <tbody>
                {data?.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
                  .sort((a, b) => a.seq - b.seq)?.map((ele, ind) => (
                    (ind < perPage * page && ind + 1 > perPage * page - perPage) &&
                    <tr className="odd:bg-white even:bg-table text-center text-dark rounded-md" key={ind}>
                      <td className="rounded-l-md">{ele.seq}</td>
                      <td colSpan={2} className="px-2">{ele.chillerBandName}</td>
                      <td colSpan={2}>{ele.type}</td>
                      <td colSpan={3} className="m-2">{new Date(new Date(ele.lastUpdate).getTime() + new Date(ele.lastUpdate).getTimezoneOffset() * 60000)
                        .toLocaleString('th-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                      }</td>
                      <td colSpan={2} >
                        <div className={`${ele.type == 'Normal' ? (ele.setpoint < configChiller.normal.setpoint && classRed) : (ele.setpoint < configChiller.LFLT.setpoint && classRed)}`}>
                          {ele.setpoint.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={2}>{ele.openTime || '-'}</td>
                      <td colSpan={2}>{ele.runningStatus == "Y" ? "เปิด" : ele.runningStatus == "N" ? "ปิด" : ele.runningStatus}</td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Approach_Evap_Cooler < configChiller.normal.condApproach.min ? classBlue : ele.Approach_Evap_Cooler > configChiller.normal.condApproach.max && classRed)
                          : (ele.Approach_Evap_Cooler < configChiller.LFLT.condApproach.min ? classBlue : ele.Approach_Evap_Cooler > configChiller.LFLT.condApproach.max && classRed)}`}>
                          {ele.Approach_Evap_Cooler == '999' ? '-'
                            : ele.Approach_Evap_Cooler.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Leaving_Water_Temp_Cooler < configChiller.normal.leavingChilledWater.min ? classBlue : ele.Leaving_Water_Temp_Cooler > configChiller.normal.leavingChilledWater.max && classRed)
                          : (ele.Leaving_Water_Temp_Cooler < configChiller.LFLT.leavingChilledWater.min ? classBlue : ele.Leaving_Water_Temp_Cooler > configChiller.LFLT.leavingChilledWater.max && classRed)}`}>
                          {ele.Leaving_Water_Temp_Cooler == '999' ? '-'
                            : ele.Leaving_Water_Temp_Cooler.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Entering_Water_Temp_Cooler < configChiller.normal.enteringChilledWater.min ? classBlue : ele.Entering_Water_Temp_Cooler > configChiller.normal.enteringChilledWater.max && classRed)
                          : (ele.Entering_Water_Temp_Cooler < configChiller.LFLT.enteringChilledWater.min ? classBlue : ele.Entering_Water_Temp_Cooler > configChiller.LFLT.enteringChilledWater.max && classRed)}`}>
                          {ele.Entering_Water_Temp_Cooler == '999' ? '-'
                            : ele.Entering_Water_Temp_Cooler.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Delta_Cooler < configChiller.normal.averageCoolerTemp.min ? classBlue : ele.Delta_Cooler > configChiller.normal.averageCoolerTemp.max && classRed)
                          : (ele.Delta_Cooler < configChiller.LFLT.averageCoolerTemp.min ? classBlue : ele.Delta_Cooler > configChiller.LFLT.averageCoolerTemp.max && classRed)}`}>
                          {ele.Delta_Cooler == '999' ? '-'
                            : ele.Delta_Cooler.toFixed(2)}
                        </div>
                      </td>

                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Approach_Conderser < configChiller.normal.condApproach.min ? classBlue : ele.Approach_Conderser > configChiller.normal.condApproach.max && classRed)
                          : (ele.Approach_Conderser < configChiller.LFLT.condApproach.min ? classBlue : ele.Approach_Conderser > configChiller.LFLT.condApproach.max && classRed)}`}>
                          {ele.Approach_Conderser == '999' ? '-'
                            : ele.Approach_Conderser.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? (ele.Leaving_Water_Temp_Conderser < configChiller.normal.leavingCondWater.min ? classBlue : ele.Leaving_Water_Temp_Conderser > configChiller.normal.leavingCondWater.max && classRed)
                          : (ele.Leaving_Water_Temp_Conderser < configChiller.LFLT.leavingCondWater.min ? classBlue : ele.Leaving_Water_Temp_Conderser > configChiller.LFLT.leavingCondWater.max && classRed)}`}>
                          {ele.Leaving_Water_Temp_Conderser == '999' ? '-'
                            : ele.Leaving_Water_Temp_Conderser.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3}>
                        <div className={`${ele.type == 'Normal' ? ele.Entering_Water_Temp_Conderser < configChiller.normal.enteringCondWater.min ? classBlue : ele.Entering_Water_Temp_Conderser < configChiller.normal.enteringCondWater.max && classRed
                          : ele.Entering_Water_Temp_Conderser < configChiller.LFLT.enteringCondWater.min ? classBlue : ele.Entering_Water_Temp_Conderser > configChiller.LFLT.enteringCondWater.max && classRed}`}>
                          {ele.Entering_Water_Temp_Conderser == '999' ? '-'
                            : ele.Entering_Water_Temp_Conderser.toFixed(2)}
                        </div>
                      </td>
                      <td colSpan={3} className="rounded-r-md">
                        <div className={`${ele.type == 'Normal' ? ele.Delta_Conderser < configChiller.normal.averageCondTemp.min ? classBlue : ele.Delta_Conderser < configChiller.normal.averageCondTemp.max && classRed
                          : ele.Delta_Conderser < configChiller.LFLT.averageCondTemp.min ? classBlue : ele.Delta_Conderser > configChiller.LFLT.averageCondTemp.max && classRed}`}>
                          {ele.Delta_Conderser == '999' ? '-'
                            : ele.Delta_Conderser.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

          </div>
          {
            isLoading
              ? <div className="flex justify-center items-center h-10 my-4"><Spinner /></div>
              : !data?.length
                ?
                <div className="flex justify-center h-10 rounded items-center my-4 text-dark">
                  ไม่พบข้อมูล
                </div>
                :
                <div className="flex flex-col text-sm pt-2.5">
                  <div className="self-end grid grid-cols-2">
                    <div>
                      จำนวนแถว ต่อ หน้า:
                      <select
                        value={perPage}
                        onChange={e => setPerPage(e.target.value)}
                        className="p-2 border text-sm border-transparent text-gray-500 rounded-lg cursor-pointer mx-3 outline-none"
                      >
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='30'>30</option>
                        <option value='50'>50</option>
                      </select>
                    </div>
                    <div className="ml-auto flex items-center">
                      หน้า {page} จาก {Math.ceil(data?.length / perPage) || 1}
                      <div className="ml-3 mr-1 flex gap-2">
                        <button className={`p-2.5 hover:bg-light rounded-full `}
                          onClick={() => page > 1 && setPage(page - 1)}
                          disabled={page > 1 ? false : true}
                        >
                          <FiChevronLeft className="font-semibold" />
                        </button>
                        <button className={`p-2.5 hover:bg-light rounded-full `}
                          onClick={() => page < Math.ceil(data?.length / perPage) && setPage(page + 1)}
                          disabled={page < Math.ceil(data?.length / perPage) ? false : true}
                        >
                          <FiChevronRight className="font-semibold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
          }
        </div>
      </div>

      <div className={`${data?.length && "sm:absolute sm:-mt-10"}`}>
        <ExportTypes id="tableChillerLast"
          csvData={data?.map((ele, i) => {
            const objThai = {
              ลำดับ: ele.seq,
              ยี่ห้อ: ele.chillerBandName,
              ประเภท: ele.type,
              เวลาล่าสุด: `${new Date(new Date(ele.lastUpdate).getTime() + new Date(ele.lastUpdate).getTimezoneOffset() * 60000)
                .toLocaleString('th-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                }`,
              'Setpoint (°F)': ele.setpoint.toFixed(2),
              'เวลาเปิด Chiller': ele.openTime || '-',
              'Chiller กำลังทำงาน': ele.runningStatus == "Y" ? "เปิด" : ele.runningStatus == "N" ? "ปิด" : ele.runningStatus,
              'Approach Evap Cooler (°F)': ele.Approach_Evap_Cooler.toFixed(2),
              'Leaving Water temp Cooler (°F)': ele.Leaving_Water_Temp_Cooler.toFixed(2),
              'Entering Water temp Cooler (°F)': ele.Entering_Water_Temp_Cooler.toFixed(2),
              'Delta Cooler (°F)': ele.Delta_Cooler.toFixed(2),
              'Approach Condenser (°F)': ele.Approach_Conderser.toFixed(2),
              'Leaving Water temp Condenser (°F)': ele.Leaving_Water_Temp_Conderser.toFixed(2),
              'Entering Water temp Condenser (°F)': ele.Entering_Water_Temp_Conderser.toFixed(2),
              'Delta Condenser (°F)': ele.Delta_Conderser.toFixed(2),
            }
            return objThai
          })}
          dataLength={+perPage + 1}
          dataStart={perPage * (page - 1)}
        />
      </div>
    </div>
  )
}