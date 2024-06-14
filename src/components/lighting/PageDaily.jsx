import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import Swal from "sweetalert2";
import DatePickerThai from "../DatePickerThai";
import { FaRegCalendarAlt } from "react-icons/fa";
import BarChartThisWeek from "./barChart";
import ExportTypes from "../exportTypes";
import GraphLine from "./GraphLine";
import LightingService from "../../service/lighting";
import AuthService from "../../service/authen";
import PieChartThisWeek from "./pieChart";
import ExportPage from "../exportPage";
import dayTh from "../../const/day";
import MonthName from "../../const/month";

function LightingDaily({ selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)
  const [format, setFormat] = useState(selectedStore.format || 'mini')
  const lastDay = new Date().setDate(new Date().getDate() - 1)
  const [dateStart, setDateStart] = useState(lastDay)
  const [dateEnd, setDateEnd] = useState(lastDay)

  useEffect(() => {
    setSelectedStore(storeData)
  }, [storeData])

  useEffect(() => {
    setType('costCenter')
    getData()
  }, [])

  useEffect(() => {
    const list = []
    switch (format) {
      case "mini":
        stores?.mini?.map(ele => {
          list.push(ele[type])
        })
        break;
      case "hyper":
        stores?.hyper?.map(ele => {
          list.push(ele[type])
        })
        break;
      case "super":
        stores?.super?.map(ele => {
          list.push(ele[type])
        })
        break;
      default:
        break;
    }
    setStoreList([...new Set(list)])
  }, [type, format])

  const [data, setData] = useState()
  const getData = async () => {
    if (dateStart > dateEnd) {
      Swal.fire({
        text: 'กรุณาเลือกช่วงวันที่ให้ถูกต้อง (วันที่สิ้นสุดมากกว่าวันที่เริ่มต้น)',
        icon: 'warning',
        confirmButtonColor: '#809DED',
        confirmButtonText: 'OK',
        iconColor: '#FFBC29',
        showCloseButton: true

      })
      return
    }
    const typeFormat = type || 'costCenter'
    const searchValue = search || storeData[typeFormat]
    let resStore, findFormat, num5digit
    if (type != "storeName") num5digit = (('00000' + searchValue).slice(-5))
    resStore = stores[format]?.find(store => store[typeFormat] == (num5digit || searchValue))
    if (resStore) {
      setStoreData({
        costCenter: resStore.costCenter,
        storeNumber: resStore.storeNumber,
        storeName: resStore.storeName,
        format: format
      })
    } else if (search) {
      Swal.fire({
        text: 'ไม่พบข้อมูลสาขาที่เลือก',
        icon: 'error',
        confirmButtonColor: '#809DED',
        confirmButtonText: 'OK',
        iconColor: '#E1221C',
        showCloseButton: true,
      })
      // setData([])
      setSearch('')
      return
    } else if (!resStore) {
      if (stores.hyper?.find(store => store[typeFormat] == searchValue)) findFormat = ('hyper')
      if (stores.super?.find(store => store[typeFormat] == searchValue)) findFormat = ('super')
      resStore = stores[findFormat]?.find(store => store[typeFormat] == searchValue)
      setStoreData({ ...storeData, format: findFormat })
    }
    try {
      setIsLoading(true)
      await AuthService.refreshTokenPage(userId)
      const res = await LightingService.getDaily(resStore.id, {
        startDate: new Date(dateStart).toISOString().split('T')[0],
        endDate: new Date(dateEnd).toISOString().split('T')[0],
      })
      res.data.LuxGraph?.map(ele => {
        ele.value = ele.value == '-999' ? null : ele.value
      })
      setData(res.data)
      localStorage.setItem("_id", resStore.id)
      // setRefDay(new Date(new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() - 1))))
      setRefDay(new Date(dateEnd))
      setSearch('')
      setIsLoading(false)
    } catch (err) {
      console.log('err', err)
      // setData()
      // setIsLoading(false)
    }
  };

  useEffect(() => {
    if (data) setIsLoading(false)
  }, [data])

  const [toggle, setToggle] = useState({
    close0: true,
    close: true,
    openB: true,
    open: true,
  })

  const color = {
    close0: "#F9BE00",
    close: "#00BCB4",
    openB: "#3CD856",
    open: "#4B9EF6"
  }

  const [saving, setSaving] = useState(false)

  const datetime = () => {
    const dayThai = dayTh[(new Date(dateStart).getDay())]
    const start = new Date(dateStart).toLocaleDateString()
    const end = new Date(dateEnd).toLocaleDateString()

    const startTh = new Date(dateStart).getDate() + " " + MonthName[new Date(dateStart).getMonth()] + " " + (new Date(dateStart).getFullYear() + 543).toLocaleString().slice(-2)
    const endTh = new Date(dateEnd).getDate() + " " + MonthName[new Date(dateEnd).getMonth()] + " " + (new Date(dateEnd).getFullYear() + 543).toLocaleString().slice(-2)
    if (start == end) {
      return `${dayThai}, ${startTh}`
    } else {
      return `${startTh} - ${endTh}`
    }
  }
  // const day =  data?.BarCharts7Days[6]?.length ? data?.BarCharts7Days[6]?.xAxis : dateStart
  // const day0 = new Date(new Date(day).setDate(new Date(day).getDate() - 6))
  // const day1 = new Date(day0).toLocaleString('th-GB', { day: 'numeric', month: 'short' })
  // const day2 = new Date(day).toLocaleString('th-GB', { day: 'numeric', month: 'short', year: "numeric" })
  // const rangeDay = `${day1} ${(day0).getFullYear() != new Date().getFullYear() ? day0.toLocaleString('th-GB', { year: "numeric" }) : ""} - ${day2}`

  const [refDay, setRefDay] = useState(new Date(dateEnd))
  // const day0 = data?.BarCharts7Days[6]?.length ? new Date(data?.BarCharts7Days[0]?.xAxis) : new Date(dateStart)
  const day7start = new Date(new Date(refDay).setDate(new Date(refDay).getDate() - 6))
  // const day7end = new Date(new Date(day0).setDate(new Date(day0).getDate() - 6))
  const rangeDay = `${day7start.toLocaleString('th-GB', { day: 'numeric', month: 'short' })} ${(day7start)?.getFullYear() != (refDay)?.getFullYear() ? day7start?.getFullYear()+543 : ""} 
  - ${refDay.toLocaleString('th-GB', { day: 'numeric', month: 'short', year: "numeric" })}`

  return (
    <>
      <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border -mt-10 mx-2 rounded-xl`}>
        <div className="p-3" id="storeData">
          <div className="md:flex justify-around items-center rounded-md p-2 mt-5">
            <div className='rounded-full bg-gray-100 px-8 py-3 h-fit mx-auto w-full '>
              <div className="grid grid-cols-4 gap-x-4">
                <div className="grid-rows-2 xs:w-max">
                  <div className="text-sm h-fit">Cost Center</div>
                  <b>{storeData?.costCenter}</b>
                  <br /><br />
                </div>
                <div className="grid-rows-2">
                  <div className="text-sm h-fit xs:w-max">รหัสสาขา</div>
                  <b>{storeData?.storeNumber}</b>
                </div>
                <div className="grid-rows-2 col-span-2 max-sm:ml-2">
                  <div className="text-sm h-fit">ชื่อสาขา</div>
                  <b className="line-clamp-2">{storeData?.storeName}</b>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 max-lg:grid-cols-2 text-sm px-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-start">
              <div className="grid grid-rows-2 grid-flow-col gap-x-3">
                <div className="self-center">ประเภทสาขา</div>
                <div>
                  <select
                    className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                    value={format}
                    onChange={e => setFormat(e.target.value)}
                  >
                    <option value="mini" >Mini-supermarket</option>
                    <option value="super" >Supermarket</option>
                    <option value="hyper" >Hypermarket</option>
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
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="costCenter" >Cost Center</option>
                    <option value="storeNumber" >รหัสสาขา</option>
                    <option value="storeName" >ชื่อสาขา</option>
                  </select>
                </div>
              </div>
              <InputSearch
                value={search}
                setValue={setSearch}
                list={storeList}
                onEnter={() => getData()}
              />
              <button className="text-white bg-primary px-8 rounded-md self-end shadow hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30"
                onClick={getData}
                disabled={isLoading}
              >
                ค้นหา
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 text-sm gap-2 mt-2  mx-2 md:flex md:justify-end">
            <div className="items-center justify-items-center max-md:justify-items-start relative">
              วันที่เริ่มต้น
              <>
                <DatePickerThai
                  onChange={setDateStart}
                  selected={dateStart}
                  maxDate={lastDay}
                />
              </>
              <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
            </div>
            <div className="items-center justify-items-center max-md:justify-items-start relative">
              วันที่สิ้นสุด
              <>
                <DatePickerThai
                  onChange={setDateEnd}
                  selected={dateEnd}
                  maxDate={lastDay}
                />
              </>
              <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
            </div>
          </div>
        </div>


        <div className="md:absolute md:-mt-10 ">
          <ExportPage onSaving={setSaving} name="Lighting Daily"
            format={[467, 657]} />
        </div>
      </div>

      {isLoading
        ? <div className="bg-white shadow-md mt-5 mx-2 rounded-xl p-3 ">
          <div className="flex justify-center py-3 my-10 items-center"><Spinner size="lg" /></div>
        </div>
        : !data
          ? <div className="bg-white shadow-md mt-5 mx-2 rounded-xl p-3 ">
            <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark">
              ไม่พบข้อมูล
            </div>
          </div>
          : <>
            <div className={`${data.BarCharts7Days?.length > 7 && '!grid-cols-1'} lg:grid lg:grid-cols-2 grid-cols-1`}
              id="charts">
              <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4`}
              >
                <div id={`PieChart `} className="p-3 h-full">
                  <div className='flex md:items-center pb-3'>
                    <img src="icon/calendar.png" className="w-10 h-10" />

                    <div className='font-bold text-[#828282] ml-1 md:flex gap-2 grid max-md:grid-row-2'>
                      ระบบแสงสว่าง 7 วันย้อนหลัง ({rangeDay})
                    </div>
                  </div>

                  <PieChartThisWeek storeInfo={data.storeInfo} config={data.lightingConfig} data={data.DonutCharts7Days} />
                </div>

                <div className="place-self-end -mt-8">
                  <ExportTypes id={`PieChart `} optionPDF={{ height: .5 }}
                    format={[467, 657]} />
                </div>
              </div>
              <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 grid`}>
                <div id={`BarChart `} className="p-3 h-full">
                  <div className='flex md:items-center pb-3'>
                    <img src="icon/calendar.png" className="w-10 h-10" />

                    <div className='font-bold text-[#828282] ml-1 md:flex gap-2 grid max-md:grid-row-2'>
                      การใช้ไฟฟ้าจากระบบแสงสว่าง 7 วันย้อนหลัง (kWh)
                    </div>
                  </div>
                  <BarChartThisWeek data={data.BarCharts7Days} />
                </div>

                <div className="">
                  <ExportTypes id={`BarChart `} optionPDF={{ height: .5 }}
                    format={[467, 657]} />
                </div>
              </div>
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mt-5 mx-2 rounded-xl `}>
              <div className="p-3" id="LuxGraph ">
                <div className='flex items-center gap-2 text-[#828282] font-bold'>
                  <img src="icon/lighting.png" className="w-10 h-10" />
                  ความสว่างในพื้นที่ขาย
                </div>

                <GraphLine color="#809DED" dot={true} data={data.LuxGraph} thaiKey="ความสว่าง" config={data.storeInfo}
                  datetime={datetime()} />
              </div>

              <ExportTypes id={`LuxGraph `} optionPDF={{ height: .5 }}
                format={[467, 657]} />
            </div>
          </>
      }

    </>
  );
}

export default LightingDaily;
