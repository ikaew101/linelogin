import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import Swal from "sweetalert2";
import GraphLine from "./GraphLine";
import ExportTypes from "../exportTypes";
import BarChartThisWeek from "./barChart";
import PieChart from "./pieChart";
import LightingService from "../../service/lighting";
import AuthService from "../../service/authen";
import ExportPage from "../exportPage";

function LightingOverall({ selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)
  const [format, setFormat] = useState(selectedStore.format || 'mini')
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
      const res = await LightingService.getOverview(resStore.id)
      res.data.lightingEnergyGraph?.map(ele => {
        ele.value = ele.value == '-999' ? null : ele.value
      })
      res.data.LuxGraph?.map(ele => {
        ele.value = ele.value == '-999' ? null : ele.value
      })
      setData(res.data)
      localStorage.setItem("_id", resStore.id)
      setSearch('')
      setIsLoading(false)
    } catch (err) {
      console.log('err', err)
    }
  };

  // useEffect(() => {
  //   if (data) setIsLoading(false)
  // }, [data])

  const [saving, setSaving] = useState(false)
  const dayStart = new Date(new Date().setDate(new Date().getDate() - 7))
  const dayEnd = new Date(new Date().setDate(new Date().getDate() - 1))
  const rangeDay = `${dayStart.toLocaleString('th-GB', { day: 'numeric', month: 'short' })} ${(dayStart)?.getFullYear() != (dayEnd)?.getFullYear() ? dayStart?.getFullYear() + 543 : ""} 
  - ${dayEnd.toLocaleString('th-GB', { day: 'numeric', month: 'short', year: "numeric" })}`

  return (
    <>
      <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border -mt-10 mx-2 rounded-xl `}>
        <div className="p-3">
          <div className="md:flex justify-between items-center rounded-md p-2 mt-5">
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
              <button className="text-white bg-primary px-8 rounded-md  self-end shadow hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30"
                onClick={getData}
                disabled={isLoading}
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        <ExportPage onSaving={setSaving} name="Lighting overall"
          format={[467, 657]}
        />
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
            <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border mt-5 mx-2 rounded-xl `}>
              <div className="p-3" id="LightingGraph">
                <div className="flex justify-between">
                  <div className='flex items-center gap-2 text-[#828282] font-bold'>
                    <img src="icon/24h-green.png" className="w-10 h-10" />
                    การใช้ไฟฟ้าจากระบบแสงสว่าง 24 ชม. (kWh)
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'
                    hidden={!data.lightingEnergyGraph?.length}>
                    <span className="text-[16px]">
                      {data.lightingEnergyGraphSummary == '-999' ? '-' : data.lightingEnergyGraphSummary?.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kWh</span>
                  </div>
                </div>

                <GraphLine color="#00BCB4" data={data.lightingEnergyGraph} thaiKey="การใช้ไฟฟ้า" config={data.storeInfo}
                  interval1hr />
              </div>

              <ExportTypes id={`LightingGraph`} optionPDF={{ height: .5 }}
                format={[467, 657]} />
            </div>

            <div className="lg:grid lg:grid-cols-2 grid-cols-1"
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

                  <PieChart storeInfo={data.storeInfo} data={data.DonutCharts7Days} config={data.lightingConfig} />
                </div>

                <div className="place-self-end -mt-8">
                  <ExportTypes id={`PieChart `} optionPDF={{ height: .5 }} />
                </div>
              </div>
              <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 `}>
                <div id={`BarChart `} className="p-3 h-full">
                  <div className='flex md:items-center pb-3'>
                    <img src="icon/calendar.png" className="w-10 h-10" />

                    <div className='font-bold text-[#828282] ml-1 md:flex gap-2 grid max-md:grid-row-2'>
                      การใช้ไฟฟ้าจากระบบแสงสว่าง 7 วันย้อนหลัง (kWh)
                    </div>
                  </div>
                  <BarChartThisWeek data={data.BarCharts7Days} />
                </div>

                <div className="place-self-end -mt-8">
                  <ExportTypes id={`BarChart `} optionPDF={{ height: .5 }} />
                </div>
              </div>
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border mt-5 mx-2 rounded-xl`}>
              <div className="p-3 grid" id="LuxGraph ">
                <div className='flex items-center gap-2 text-[#828282] font-bold'>
                  <img src="icon/lighting.png" className="w-10 h-10" />
                  ความสว่างในพื้นที่ขาย
                </div>

                <div className="overflow-hidden">
                  {data.LuxGraph ?
                    <GraphLine color="#809DED" dot={true} data={data.LuxGraph} thaiKey="ความสว่าง" config={data.storeInfo} />
                    :
                    <div className="flex justify-center h-10 rounded items-center my-4 text-dark">
                      ไม่พบข้อมูล
                    </div>
                  }
                </div>
              </div>

              <ExportTypes id={`LuxGraph `} optionPDF={{ height: .5 }}
                format={[467, 657]} />
            </div>
          </>
      }
    </>
  );
}

export default LightingOverall;
