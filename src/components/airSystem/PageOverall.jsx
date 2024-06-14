import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import Swal from "sweetalert2";
import CardsMonitoringTemp from "./CardsMonitoringTemp";
import GraphTemp24hr from "./GraphTemp24hr";
import GraphLine from "./GraphLine";
import TableStatusDevice from "./TableStatusDevice";
import GraphStatusDevice from "./GraphStatusDevice";
import DataChillerLast from "./DataChiller";
import DataChiller7Day from "./DataChiller7Day";
import dayTh from "../../const/day";
import AirService from "../../service/air";
import AuthService from "../../service/authen";
import ExportPage from "../exportPage";
import ExportTypes from "../exportTypes";

function AirOverall({ selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState('costCenter')
  const [format, setFormat] = useState(selectedStore.format)
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)
  const [saving, setSaving] = useState(false)
  const [formatStore, setFormatStore] = useState(format)

  useEffect(() => {
    setSelectedStore(storeData)
  }, [storeData])

  function getStoreList() {
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
  }

  useEffect(() => {
    getStoreList()
  }, [type, format])

  useEffect(() => {
    // setType('costCenter')
    getData()
  }, [])

  const [data, setData] = useState()
  const getData = async () => {
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
      // setData()
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
      const response = await AirService.getOverview(resStore.id)
      const resData = response.data

      resData.graphAirReturn?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphFood?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphIndoor?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphMall?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphOutdoor?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphOutside?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })
      resData.graphSale?.map(ele => { ele.temp = ele.temp == '-999' ? null : ele.temp })

      setData(resData)
      setFormatStore(format)
      localStorage.setItem("_id", resStore.id)
      setIsLoading(false)
      setSearch('')
    } catch (err) {
      setIsLoading(false)
      console.log(err);
      setData();
    }
  };

  const color = {
    airReturn: "#C3D311",
    indoor: "#46B2FF",
    outdoor: "#FA5A7D",
    area: "#809DED", 
    storeRent: "#F9BE00",
    food: "#00BCB4",
    outside: "#FF6B1E",
  }

  function lastDateTimeTH(val) {
    const value = new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000
    const day = dayTh[(new Date(value).getDay())]
    const date = new Date(new Date(value)).toLocaleString('th-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const time = new Date(value).toLocaleTimeString('th-GB', { hour: "2-digit", minute: "2-digit", hour12: false })
    return `วัน${day}, ${date}, ${time} น.`
  }
  return (
    <>
      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl`}>
        <div id="storeData" className="p-3">
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
              <button className={`text-white bg-primary px-8 rounded-md  self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                onClick={getData}
                disabled={isLoading}
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        <ExportPage onSaving={setSaving} name="Air Overall"
          format={[456, 644]}
        />

      </div>

      {/* <div className='bg-white shadow  mx-2 rounded-xl mt-4 p-3'> */}
      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
        <div id="cardMonitoring" className="p-3">
          <div className="sm:flex justify-between text-[#828282] mb-3.5">
            <div className='font-bold flex items-center gap-1 pl-2'>
              <img src="icon/monitor.png" className="w-10 h-10" />
              ติดตามอุณหภูมิ ณ ปัจจุบัน
            </div>

            <div className="flex text-xs gap-1.5 items-end mb-0.5 justify-end">
              {data?.cardsMonitoring && <>
                <div className="text-[#B1B1B1]">
                  อัพเดทล่าสุด : {data?.cardsMonitoring?.lastUpdate == "0001-01-01T00:00:00Z"
                    ? '-' :
                    lastDateTimeTH((data?.cardsMonitoring?.lastUpdate))}
                </div>
                |
              </>}
              <div className="text-secondary flex gap-1 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 15.75C7.425 15.75 6.03125 15.2717 4.81875 14.3153C3.60625 13.3588 2.81875 12.137 2.45625 10.65C2.40625 10.4625 2.44375 10.2907 2.56875 10.1347C2.69375 9.97875 2.8625 9.888 3.075 9.8625C3.275 9.8375 3.45625 9.875 3.61875 9.975C3.78125 10.075 3.89375 10.225 3.95625 10.425C4.25625 11.55 4.875 12.4688 5.8125 13.1813C6.75 13.8938 7.8125 14.25 9 14.25C10.4625 14.25 11.7033 13.7405 12.7223 12.7215C13.7413 11.7025 14.2505 10.462 14.25 9C14.25 7.5375 13.7405 6.29675 12.7215 5.27775C11.7025 4.25875 10.462 3.7495 9 3.75C8.1375 3.75 7.33125 3.95 6.58125 4.35C5.83125 4.75 5.2 5.3 4.6875 6H6C6.2125 6 6.39075 6.072 6.53475 6.216C6.67875 6.36 6.7505 6.538 6.75 6.75C6.75 6.9625 6.678 7.14075 6.534 7.28475C6.39 7.42875 6.212 7.5005 6 7.5H3C2.7875 7.5 2.60925 7.428 2.46525 7.284C2.32125 7.14 2.2495 6.962 2.25 6.75V3.75C2.25 3.5375 2.322 3.35925 2.466 3.21525C2.61 3.07125 2.788 2.9995 3 3C3.2125 3 3.39075 3.072 3.53475 3.216C3.67875 3.36 3.7505 3.538 3.75 3.75V4.7625C4.3875 3.9625 5.16575 3.34375 6.08475 2.90625C7.00375 2.46875 7.9755 2.25 9 2.25C9.9375 2.25 10.8158 2.42825 11.6348 2.78475C12.4538 3.14125 13.1663 3.62225 13.7723 4.22775C14.3783 4.83425 14.8595 5.54675 15.216 6.36525C15.5725 7.18375 15.7505 8.062 15.75 9C15.75 9.9375 15.5718 10.8158 15.2153 11.6347C14.8588 12.4537 14.3778 13.1663 13.7723 13.7723C13.1658 14.3783 12.4533 14.8595 11.6348 15.216C10.8163 15.5725 9.938 15.7505 9 15.75ZM9.75 8.7L11.625 10.575C11.7625 10.7125 11.8313 10.8875 11.8313 11.1C11.8313 11.3125 11.7625 11.4875 11.625 11.625C11.4875 11.7625 11.3125 11.8312 11.1 11.8312C10.8875 11.8312 10.7125 11.7625 10.575 11.625L8.475 9.525C8.4 9.45 8.34375 9.36575 8.30625 9.27225C8.26875 9.17875 8.25 9.08175 8.25 8.98125V6C8.25 5.7875 8.322 5.60925 8.466 5.46525C8.61 5.32125 8.788 5.2495 9 5.25C9.2125 5.25 9.39075 5.322 9.53475 5.466C9.67875 5.61 9.7505 5.788 9.75 6V8.7Z" fill="#565E6D" />
                </svg>
                <u onClick={() => window.location.href = "/airCondition/history"}>ข้อมูลย้อนหลัง</u>
              </div>
            </div>
          </div>

          <CardsMonitoringTemp format={formatStore} data={data?.cardsMonitoring} config={data?.config} isLoading={isLoading}
            saving={saving} flag={data?.flag.data} />
        </div>
        <ExportTypes id="cardMonitoring" onSaving={setSaving}
          format={[456, 644]} />
      </div>

      <GraphTemp24hr format={formatStore} color={color} data={data?.graph24} config={data?.config}
        qMin={formatStore == "mini" ? 5 : formatStore == "super" && 5}
        saving={saving}
        // minInterval={data?.config.configIntervalForGraph24}
        dataCard={!data?.cardsMonitoring ? 'false'
          : {
            "averageAirReturnTemp": data?.summary.avgAirReturn,
            "indoorTemp": data?.summary.avgIndoorTemp,
            "outdoorTemp": data?.summary.avgOutdoorTemp,
            "mallTemp": data?.summary.avgMallTemp,
            "saleTemp": data?.summary.avgSaleTemp,
            "foodTemp": data?.summary.avgFoodTemp,
            "outsideTemp": data?.summary.avgOutsideTemp,
          }}
      // dataCard={data?.cardsMonitoring || 'false'}
      />

      {isLoading
        ? <div className="bg-white shadow-md mt-5 mx-2 rounded-xl p-3 ">
          <div className="flex justify-center items-center min-h-10 my-10 py-3"><Spinner size="lg" /></div>
        </div>
        : <>
          {storeData.format !== "hyper" && <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphAir_return" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    <img src="icon/air_return.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิ AVG Air return (°C)
                    </div>
                  </div>

                  {data?.graphAirReturn &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgAirReturn} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgAirReturn == '-999' ? '-' :
                        data.summary.avgAirReturn.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>}
                </div>

                <GraphLine color="#C3D311" data={data?.graphAirReturn} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphAir_return" format={[456, 644]} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphIndoor" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    <img src="icon/building.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิภายในสาขา (°C)
                    </div>
                  </div>

                  {data?.graphIndoor &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgIndoorTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgIndoorTemp == '-999' ? '-' :
                        data.summary.avgIndoorTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.indoor} data={data?.graphIndoor} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphIndoor" format={[456, 644]} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphOutdoor" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <img className='' src='img/icon-outside.png' /> */}
                    <img src="icon/outside.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิภายนอกสาขา (°C)
                    </div>
                  </div>

                  {data?.graphOutdoor &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgOutdoorTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgOutdoorTemp == '-999' ? '-' :
                        data.summary.avgOutdoorTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.outdoor} data={data?.graphOutdoor} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphOutdoor" format={[456, 644]} />
            </div>
          </>}

          {storeData.format !== "mini" && <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphSaleArea" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    <img src="icon/pushcart.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณพื้นที่ขาย (°C)
                    </div>
                  </div>

                  {data?.graphSale &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgSaleTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgSaleTemp == '-999' ? '-' :
                        data.summary.avgSaleTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.area} data={data?.graphSale} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphSaleArea" format={[456, 644]} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphTempStore" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    <img src="icon/store_rent.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณร้านค้าเช่า (°C)
                    </div>
                  </div>

                  {data?.graphMall &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgMallTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgMallTemp == '-999' ? '-' :
                        data.summary.avgMallTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.storeRent} data={data?.graphMall} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphTempStore" format={[456, 644]} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphFoodCourt" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    <img src="icon/foodcourt.png" className="w-10 h-10" />
                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณศูนย์อาหาร (°C)
                    </div>
                  </div>

                  {data?.graphFood &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgFoodTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgFoodTemp == '-999' ? '-' :
                        data.summary.avgFoodTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.food} data={data?.graphFood} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphFoodCourt" format={[456, 644]} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="graphOutside" className="p-3">
                <div className='flex justify-between items-center pl-2 pt-2'>
                  <div className='flex items-center'>
                    {/* <img className='' src='img/icon-out.png' /> */}
                    <img src='icon/out_branch.png' className="w-10 h-10" />

                    <div className='font-bold text-[#828282] ml-1'>
                      กราฟอุณหภูมิบริเวณนอกสาขา (°C)
                    </div>
                  </div>

                  {data?.graphOutside &&
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                      {/* {data.summary.avgOutsideTemp} <span className="text-[16px]">°C</span> */}
                      {data.summary.avgOutsideTemp == '-999' ? '-' :
                        data.summary.avgOutsideTemp.toFixed(2)} <span className="text-[16px]">°C</span>
                    </div>
                  }
                </div>

                <GraphLine color={color.outside} data={data?.graphOutside} config={data?.config}
                  qMin={formatStore == "mini" ? 5 : 60} />
              </div>

              <ExportTypes id="graphOutside" format={[456, 644]} />
            </div>
          </>}

          {storeData.format !== "mini" && <>
            <DataChillerLast data={data?.dataChillerLast} config={data?.config} configChiller={data?.configChiller} saving={saving} />
            <DataChiller7Day data={data?.dataChiller7Days} config={data?.config} configChiller={data?.configChiller} saving={saving} />
          </>}
          {storeData.format !== "hyper" && <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
              <div id="tableStatusDevice" className="p-3">
                <div className="sm:flex justify-between text-[#828282] mb-3.5">
                  <div className='font-bold flex items-center gap-1 pl-2'>
                    <img src="icon/status.png" className="w-10 h-10" />
                    สถานะอุปกรณ์ระบบปรับอากาศ
                  </div>
                  {data?.statusDevice?.length &&
                    <div className="flex gap-2 items-end mb-0.5">
                      <div className="text-[#B1B1B1] text-xs self-center ">
                        อัพเดทล่าสุด : {data.statusDeviceData.lastUpdate == "0001-01-01T00:00:00Z" ? '-'
                          : lastDateTimeTH(new Date(data.statusDeviceData.lastUpdate))}
                      </div>

                      <div className="text-secondary flex gap-1 cursor-pointer font-semibold items-center border-l pl-2.5">
                        โหมด :
                        <div className="px-3 py-2 bg-secondary/[.1] rounded ml-2">
                          {data.statusDeviceData.mode || "-"}
                        </div>
                      </div>
                    </div>}
                </div>

                <TableStatusDevice format={format} data={data?.statusDevice} isLoading={isLoading} />
              </div>

              <ExportTypes id="tableStatusDevice" />
            </div>

            {data?.cardStatus?.map((ele, i) => (
              <GraphStatusDevice data={ele} index={i + 1} />
            ))}
          </>
          }
        </>
      }

    </>
  );
}

export default AirOverall;