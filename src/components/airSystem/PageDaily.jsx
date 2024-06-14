import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import RefrigService from "../../service/refrigerator";
import Swal from "sweetalert2";
import dayTh from "../../const/day";
import MonthName from "../../const/month";
import GraphTemp24hr from "./GraphTemp24hr";
import DatePickerThai from "../DatePickerThai";
import { FaRegCalendarAlt } from "react-icons/fa";
import AuthService from "../../service/authen";
import AirService from "../../service/air";
import GraphLine from "./GraphLine";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";

function AirDailyPage({ selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)
  const [format, setFormat] = useState(selectedStore.format || 'mini')
  const maxDate = new Date().setDate(new Date().getDate() - 1)
  const [dateStart, setDateStart] = useState(new Date().setDate(new Date().getDate() - 1))
  const [dateEnd, setDateEnd] = useState(new Date().setDate(new Date().getDate() - 1))
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
    if (type != "storeName") num5digit = ('00000' + searchValue).slice(-5)
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
      setData()
      setIsLoading(true)
      await AuthService.refreshTokenPage(userId)
      const response = await AirService.getGraph(resStore.id, {
        startDate: new Date(dateStart).toISOString().split('T')[0],
        endDate: new Date(dateEnd).toISOString().split('T')[0],
      })

      response.data.averageAirReturnTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.foodTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.indoorTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.mallTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.outdoorTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.outsideTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      response.data.saleTemp?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })

      // if (response.data.flag.data) 
      setData(response.data)

      localStorage.setItem("_id", resStore.id)
      setSearch('')
      setIsLoading(false)
    } catch (err) {
      console.log('err', err)
    }
  };

  useEffect(() => {
    if (data) setIsLoading(false)
  }, [data])

  const color = {
    airReturn: "#C3D311",
    indoor: "#46B2FF",
    outdoor: "#FA5A7D",
    area: "#809DED",
    storeRent: "#F9BE00",
    food: "#00BCB4",
    outside: "#FF6B1E",
  }

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
  const [saving, setSaving] = useState(false)

  return (
    <>
      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl`}>
        <div id="storeData" className="p-3">
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
              <button className={`text-white bg-primary px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                onClick={getData}
                disabled={isLoading}
              >
                ค้นหา
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 text-sm gap-2 mt-2 mx-2 md:flex md:justify-end p-2">
            <div className="items-center justify-items-center max-md:justify-items-start relative">
              วันที่เริ่มต้น
              <>
                <DatePickerThai
                  onChange={setDateStart}
                  selected={dateStart}
                  maxDate={maxDate}
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
                  maxDate={maxDate}
                />
              </>
              <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
            </div>
          </div>
        </div>

        <div className="md:absolute md:-mt-10 ">
          <ExportPage onSaving={setSaving} name="Air Daily"
            format={[456, 644]} />
        </div>
      </div>

      <>
        <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mt-5 mx-2 rounded-xl p-3`} hidden={data}>
          {isLoading ?
            <div className="flex justify-center py-3 my-10 items-center"><Spinner size="lg" /></div>
            : (!data) &&
            <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark">
              ไม่พบข้อมูล
            </div>
          }
        </div>

        {!isLoading && data && <>
          <GraphTemp24hr format={storeData.format} color={color} data={data} config={data.storeInfo} saving={saving}
            header="กราฟอุณหภูมิรวม 24 ชม."
            datetime={datetime()}
            qMin={60} minInterval={61} />

          {storeData.format !== "hyper" && <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphAir_return`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" rx="16.5" fill="#C3D311" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.91805 16.1889C7.91805 20.8563 11.3021 24.0365 15.1032 24.6943C15.2066 24.7122 15.3055 24.7503 15.3942 24.8064C15.4828 24.8625 15.5596 24.9356 15.62 25.0214C15.6805 25.1071 15.7234 25.204 15.7464 25.3064C15.7694 25.4088 15.7721 25.5147 15.7541 25.6181C15.7362 25.7215 15.6981 25.8203 15.642 25.909C15.5859 25.9977 15.5128 26.0744 15.427 26.1349C15.3412 26.1953 15.2444 26.2383 15.142 26.2613C15.0396 26.2843 14.9337 26.2869 14.8303 26.269C10.3668 25.4962 6.32031 21.7334 6.32031 16.1889C6.32031 13.8321 7.39211 11.9799 8.64331 10.5723C9.54031 9.56332 10.5661 8.74299 11.391 8.11585H8.88251C8.67918 8.11585 8.48417 8.03508 8.3404 7.8913C8.19662 7.74752 8.11585 7.55252 8.11585 7.34919C8.11585 7.14585 8.19662 6.95085 8.3404 6.80707C8.48417 6.66329 8.67918 6.58252 8.88251 6.58252H13.4825C13.6858 6.58252 13.8808 6.66329 14.0246 6.80707C14.1684 6.95085 14.2492 7.14585 14.2492 7.34919V11.9492C14.2492 12.1525 14.1684 12.3475 14.0246 12.4913C13.8808 12.6351 13.6858 12.7159 13.4825 12.7159C13.2792 12.7159 13.0842 12.6351 12.9404 12.4913C12.7966 12.3475 12.7158 12.1525 12.7158 11.9492V9.11865L12.7143 9.12172C11.8372 9.78105 10.767 10.5891 9.83931 11.6333C8.74298 12.8661 7.91805 14.3581 7.91805 16.1889ZM24.9503 16.8114C24.9503 12.193 21.6383 9.03279 17.8862 8.32745C17.7817 8.30971 17.6817 8.27132 17.5921 8.21452C17.5025 8.15772 17.4251 8.08365 17.3645 7.99663C17.3038 7.90961 17.2611 7.81138 17.2388 7.70768C17.2166 7.60398 17.2152 7.49687 17.2347 7.39262C17.2542 7.28837 17.2944 7.18905 17.3527 7.10047C17.411 7.01188 17.4864 6.9358 17.5745 6.87666C17.6625 6.81752 17.7615 6.77651 17.8656 6.75602C17.9696 6.73553 18.0767 6.73597 18.1806 6.75732C22.5874 7.58532 26.548 11.3267 26.548 16.8114C26.548 19.1681 25.4762 21.0189 24.225 22.428C23.328 23.4369 22.3022 24.2573 21.4773 24.8844H23.9858C24.1892 24.8844 24.3842 24.9652 24.528 25.1089C24.6717 25.2527 24.7525 25.4477 24.7525 25.6511C24.7525 25.8544 24.6717 26.0494 24.528 26.1932C24.3842 26.3369 24.1892 26.4177 23.9858 26.4177H19.3858C19.1825 26.4177 18.9875 26.3369 18.8437 26.1932C18.7 26.0494 18.6192 25.8544 18.6192 25.6511V21.0511C18.6192 20.8477 18.7 20.6527 18.8437 20.5089C18.9875 20.3652 19.1825 20.2844 19.3858 20.2844C19.5892 20.2844 19.7842 20.3652 19.928 20.5089C20.0717 20.6527 20.1525 20.8477 20.1525 21.0511V23.8801H20.1556C21.0311 23.2177 22.1029 22.4111 23.029 21.3654C24.1254 20.1341 24.9503 18.6437 24.9503 16.8114Z" fill="white" />
                  </svg> */}
                    <img src="icon/air_return.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิ AVG Air return (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {/* {(data?.card1?.summary?.total)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh */}
                    {data.summary.avgAirReturn == '-999' ? '-' :
                      data.summary.avgAirReturn.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>
                </div>

                <GraphLine color="#C3D311" data={data?.averageAirReturnTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphAir_return" />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphIndoor`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" rx="16.5" fill="#46B2FF" />
                    <path d="M23.2083 7.87516V25.1252H17.4583V21.771H15.5417V25.1252H9.79167V7.87516H23.2083ZM19.375 11.7085H21.2917V9.79183H19.375V11.7085ZM15.5417 11.7085H17.4583V9.79183H15.5417V11.7085ZM11.7083 11.7085H13.625V9.79183H11.7083V11.7085ZM19.375 15.5418H21.2917V13.6252H19.375V15.5418ZM15.5417 15.5418H17.4583V13.6252H15.5417V15.5418ZM11.7083 15.5418H13.625V13.6252H11.7083V15.5418ZM19.375 19.3752H21.2917V17.4585H19.375V19.3752ZM15.5417 19.3752H17.4583V17.4585H15.5417V19.3752ZM11.7083 19.3752H13.625V17.4585H11.7083V19.3752ZM19.375 23.2085H21.2917V21.2918H19.375V23.2085ZM11.7083 23.2085H13.625V21.2918H11.7083V23.2085ZM25.125 5.9585H7.875V27.0418H25.125V5.9585Z" fill="white" />
                  </svg> */}
                    <img src="icon/building.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิภายในสาขา (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgIndoorTemp == '-999' ? '-' :
                      data.summary.avgIndoorTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.indoor} data={data?.indoorTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphIndoor" />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphOutdoor`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <img className='' src='img/icon-outside.png' /> */}
                    <img src="icon/outside.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิภายนอกสาขา (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgOutdoorTemp == '-999' ? '-' :
                      data.summary.avgOutdoorTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.outdoor} data={data?.outdoorTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphOutdoor" />
            </div>
          </>}

          {storeData.format !== "mini" && <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphSaleArea`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" rx="16.5" fill="#809DED" />
                    <path d="M11.7083 22.2497C12.7624 22.2497 13.6249 23.1122 13.6249 24.1663C13.6249 25.2205 12.7624 26.083 11.7083 26.083C10.6541 26.083 9.79159 25.2205 9.79159 24.1663C9.79159 23.1122 10.6541 22.2497 11.7083 22.2497ZM21.2916 22.2497C22.3458 22.2497 23.2083 23.1122 23.2083 24.1663C23.2083 25.2205 22.3458 26.083 21.2916 26.083C20.2374 26.083 19.3749 25.2205 19.3749 24.1663C19.3749 23.1122 20.2374 22.2497 21.2916 22.2497ZM11.8999 19.183C11.8999 19.2788 11.9958 19.3747 12.0916 19.3747H23.2083V21.2913H11.7083C10.6541 21.2913 9.79159 20.4288 9.79159 19.3747C9.79159 18.9913 9.88742 18.7038 9.98325 18.4163L11.2291 16.1163L7.87492 8.83301H5.95825V6.91634H9.12075L13.2416 15.5413H19.9499L23.6874 8.83301L25.3166 9.79134L21.5791 16.4997C21.2916 17.0747 20.6208 17.458 19.9499 17.458H12.7624L11.8999 18.9913V19.183ZM14.0083 5.95801C14.7749 5.95801 15.3499 6.53301 15.3499 7.29967C15.3499 8.06634 14.7749 8.64134 14.0083 8.64134C13.2416 8.64134 12.6666 8.06634 12.6666 7.29967C12.6666 6.53301 13.3374 5.95801 14.0083 5.95801ZM18.9916 13.6247C18.2249 13.6247 17.6499 13.0497 17.6499 12.283C17.6499 11.5163 18.2249 10.9413 18.9916 10.9413C19.7583 10.9413 20.3333 11.5163 20.3333 12.283C20.3333 13.0497 19.6624 13.6247 18.9916 13.6247ZM13.8166 13.6247L12.6666 12.4747L19.1833 5.95801L20.3333 7.10801L13.8166 13.6247Z" fill="white" />
                  </svg> */}
                    <img src="icon/pushcart.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณพื้นที่ขาย (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgSaleTemp == '-999' ? '-' :
                      data.summary.avgSaleTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.area} data={data?.saleTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphSaleArea" />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphTempStore`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" rx="16.5" fill="#F9BE00" />
                    <path d="M9.79165 10.7497C9.52012 10.7497 9.29236 10.6577 9.10836 10.4737C8.92436 10.2897 8.83268 10.0622 8.83332 9.79134C8.83332 9.51982 8.92532 9.29205 9.10932 9.10805C9.29332 8.92405 9.52076 8.83237 9.79165 8.83301H23.2083C23.4798 8.83301 23.7076 8.92501 23.8916 9.10901C24.0756 9.29301 24.1673 9.52046 24.1666 9.79134C24.1666 10.0629 24.0746 10.2906 23.8906 10.4746C23.7066 10.6586 23.4792 10.7503 23.2083 10.7497H9.79165ZM9.79165 24.1663C9.52012 24.1663 9.29236 24.0743 9.10836 23.8903C8.92436 23.7063 8.83268 23.4789 8.83332 23.208V18.4163H8.66561C8.36214 18.4163 8.11457 18.3004 7.9229 18.0685C7.73123 17.8366 7.66734 17.5692 7.73123 17.2663L8.68957 12.4747C8.73748 12.2511 8.84929 12.0674 9.02498 11.9236C9.20068 11.7799 9.40033 11.708 9.62394 11.708H23.376C23.5996 11.708 23.7993 11.7799 23.975 11.9236C24.1507 12.0674 24.2625 12.2511 24.3104 12.4747L25.2687 17.2663C25.3326 17.5698 25.2687 17.8372 25.0771 18.0685C24.8854 18.2997 24.6378 18.4157 24.3344 18.4163H24.1666V23.208C24.1666 23.4795 24.0746 23.7073 23.8906 23.8913C23.7066 24.0753 23.4792 24.167 23.2083 24.1663C22.9368 24.1663 22.709 24.0743 22.525 23.8903C22.341 23.7063 22.2493 23.4789 22.25 23.208V18.4163H18.4167V23.208C18.4167 23.4795 18.3246 23.7073 18.1406 23.8913C17.9566 24.0753 17.7292 24.167 17.4583 24.1663H9.79165ZM10.75 22.2497H16.5V18.4163H10.75V22.2497Z" fill="white" />
                  </svg> */}
                    <img src="icon/store_rent.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณร้านค้าเช่า (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgMallTemp == '-999' ? '-' :
                      data.summary.avgMallTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.storeRent} data={data?.mallTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphTempStore" />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphFoodCourt`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="33" height="33" rx="16.5" fill="#00BCB4" />
                    <path d="M22.2501 7.875C22.4848 7.87503 22.7114 7.96121 22.8868 8.11719C23.0622 8.27316 23.1742 8.48809 23.2017 8.72121L23.2084 8.83333V24.1667C23.2081 24.4109 23.1146 24.6459 22.9469 24.8235C22.7793 25.0011 22.5501 25.108 22.3062 25.1223C22.0624 25.1366 21.8223 25.0573 21.635 24.9005C21.4477 24.7437 21.3273 24.5213 21.2985 24.2788L21.2917 24.1667V19.375H20.3334C20.0987 19.375 19.8721 19.2888 19.6967 19.1328C19.5213 18.9768 19.4093 18.7619 19.3818 18.5288L19.3751 18.4167V12.6667C19.3751 10.5488 20.8126 7.875 22.2501 7.875ZM16.5001 7.875C16.7348 7.87503 16.9614 7.96121 17.1368 8.11719C17.3122 8.27316 17.4242 8.48809 17.4517 8.72121L17.4584 8.83333V13.625C17.4583 14.4749 17.1759 15.3007 16.6555 15.9727C16.1351 16.6447 15.4063 17.1248 14.5834 17.3376V24.1667C14.5831 24.4109 14.4896 24.6459 14.3219 24.8235C14.1543 25.0011 13.9251 25.108 13.6812 25.1223C13.4374 25.1366 13.1973 25.0573 13.01 24.9005C12.8227 24.7437 12.7023 24.5213 12.6735 24.2788L12.6667 24.1667V17.3376C11.8766 17.1333 11.1721 16.6823 10.6559 16.0501C10.1397 15.4179 9.83868 14.6375 9.79654 13.8224L9.79175 13.625V8.83333C9.79202 8.58907 9.88555 8.35414 10.0532 8.17652C10.2209 7.99891 10.4501 7.89202 10.6939 7.87771C10.9378 7.8634 11.1779 7.94273 11.3652 8.0995C11.5525 8.25628 11.6729 8.47866 11.7017 8.72121L11.7084 8.83333V13.625C11.7084 13.9614 11.797 14.2919 11.9652 14.5833C12.1334 14.8747 12.3754 15.1166 12.6667 15.2848V8.83333C12.667 8.58907 12.7605 8.35414 12.9282 8.17652C13.0959 7.99891 13.3251 7.89202 13.5689 7.87771C13.8128 7.8634 14.0529 7.94273 14.2402 8.0995C14.4275 8.25628 14.5479 8.47866 14.5767 8.72121L14.5834 8.83333L14.5844 15.2848C14.8518 15.1302 15.0779 14.9133 15.2434 14.6525C15.409 14.3917 15.509 14.0948 15.535 13.787L15.5417 13.625V8.83333C15.5417 8.57917 15.6427 8.33541 15.8224 8.15569C16.0022 7.97597 16.2459 7.875 16.5001 7.875Z" fill="white" />
                  </svg> */}
                    <img src="icon/foodcourt.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณศูนย์อาหาร (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgFoodTemp == '-999' ? '-' :
                      data.summary.avgFoodTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.food} data={data?.foodTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphFoodCourt" />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 `}>
              <div id={`graphOutside`} className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <img className='' src='img/icon-out.png' /> */}
                    <img src='icon/out_branch.png' className="w-10 h-10" />

                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณภายนอกสาขา (°C)
                    </div>
                  </div>

                  <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                    {data.summary.avgOutsideTemp == '-999' ? '-' :
                      data.summary.avgOutsideTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                  </div>

                </div>

                <GraphLine color={color.outside} data={data?.outsideTemp} config={data.storeInfo}
                  datetime={datetime()}
                  qMin={60} />
              </div>
              <ExportTypes id="graphOutside" />
            </div>
          </>}
        </>}

      </>
    </>
  );
}

export default AirDailyPage;
