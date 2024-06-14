import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CabinetCard from "./cards/CabinetCard";
import ColdroomCard from "./cards/ColdroomCard";
import CompressorRack from "./cards/CompressorRack";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import RefrigService from "../../service/refrigerator";
import Swal from "sweetalert2";
import AuthService from "../../service/authen";
import dayTh from "../../const/day";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";

function RefrigerationOverall({ toGraphPage, toGraphSelect, selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [format, setFormat] = useState(selectedStore.format || 'mini')
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)

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

  const [cabinetDatas, setCabinetDatas] = useState([])
  const [coldRoomDatas, setColdRoomDatas] = useState([])
  const [compressorRackDatas, setCompressorRackDatas] = useState([])
  const [lastUpdate, setLastUpdate] = useState("")

  useEffect(() => {
    setType('costCenter')
    getData()
  }, [])

  const [numAbnormalCard, setNumAbnormalCard] = useState(0)
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
      // localStorage.setItem("_auth_storage", new Date().toISOString())
      const response = await RefrigService.getRefrigOverview(resStore.id)
      setLastUpdate(response.data.lastUpdate)
      setCabinetDatas(sortName(response.data.cabinet) || [])
      setColdRoomDatas(sortName(response.data.coldroom) || [])
      setCompressorRackDatas(sortName(response.data.compressorRack) || [])

      setNumAbnormalCard(
        (response.data.cabinet?.filter(ele => ele.abnormalStatus).length || 0)
        + (response.data.coldroom?.filter(ele => ele.abnormalStatus).length || 0)
        + (response.data.compressorRack?.filter(ele => ele.abnormalStatus).length || 0)
      )
      localStorage.setItem("_id", resStore.id)
      // if (!availableTotal) 
      setIsLoading(false)
      setSearch('')
    } catch (err) {
      setIsLoading(false)
      console.log(err);
      // setData();
    }
  };

  function sortName(data) {
    data?.sort((a, b) => {
      if (a.name.split('-')[0].trim().length == b.name.split('-')[0].trim().length) {
        return a.name.localeCompare(b.name)
      } else {
        return a.name.split('-')[0].trim().length < b.name.split('-')[0].trim().length ? -1 : 1
      }
    })
    return data
  }

  useEffect(() => {
    if (cabinetDatas?.length + coldRoomDatas?.length + compressorRackDatas?.length) {
      setIsLoading(false)
    }
    setSearch('')
  }, [numAbnormalCard])

  function formatDateTime(val) {
    const value = new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000
    if (value == "0001-01-01T00:00:00Z") return '-'
    const day = dayTh[(new Date(value).getDay())]
    const date = new Date(new Date(value)).toLocaleString('th-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const time = new Date(value).toLocaleTimeString('th-GB', { hour: "2-digit", minute: "2-digit", hour12: false })
    return `วัน${day}, ${date}, ${time} น.`
  }
  const [saving, setSaving] = useState(false)

  return (
    <>
      <div className={`bg-white border ${saving != 'JPEG' && 'shadow-md'} -mt-10 mx-2 rounded-xl`}>
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

            {/* <div className="grid grid-cols-4 text-sm mt-3 px-2 h-fit lg:grid-cols-2 xl:grid-cols-4 min-w-[50vw]"> */}
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

        <ExportPage onSaving={setSaving} name="Refrig Overall"
          arrayId={[
            // "card_overall",
            // "cabinet",
            // "coldroom",
            // "compressor rack"
            // { card: "cabinet", length: cabinetDatas?.length || 0},
            { parts: `cabinet`, length: cabinetDatas?.length || "0", responsive: [640, 1020] },
            { parts: "coldroom", length: coldRoomDatas?.length || "0", responsive: [640, 1020] },
            { parts: "compressor rack", length: compressorRackDatas?.length || "0", responsive: [640, 1020] }
          ]}
        />
      </div>

      <div className="h-0 overflow-hidden">
        <div id="top">
          <div className='text-2xl pl-4 font-semibold md:pl-6'>
            ระบบตู้แช่และห้องเย็น
          </div>
          <div className='bg-primary p-2 my-4 mx-6 lg:mx-10 rounded-md justify-center flex lg:gap-14 relative z-30 gap-1 max-lg:grid max-lg:grid-cols-3 font-medium'>
            {/* <div className='bg-primary p-2 my-4 mx-6 rounded-md justify-center flex gap-4 relative z-10'> */}
            <button name='overall'
              className={`bg-[#009B93] py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]    max-lg:mx-auto transition-colors duration-100`}
            >
              ภาพรวม
            </button>
            <button name='graph'
              className={`py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]   max-lg:mx-auto transition-colors duration-100`}
            >
              กราฟ
            </button>
            <button name='notification'
              className={`py-2  rounded-md text-white max-lg:w-full lg:min-w-[250px]    px-2 transition-colors duration-100 `}
            >
              การแจ้งเตือน
            </button>
          </div>
          <div className={`bg-white ${!saving ? "shadow-md" : "border"} -mt-10 mx-2 rounded-xl`}>
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

                {/* <div className="grid grid-cols-4 text-sm mt-3 px-2 h-fit lg:grid-cols-2 xl:grid-cols-4 min-w-[50vw]"> */}
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
          </div>
        </div>
      </div>

      <div className={`bg-white border ${saving != 'JPEG' && 'shadow-md'} mt-3 mx-2 rounded-xl max-sm:px-3`}>
        <div className="grid grid-cols-2 items-end max-sm:grid-cols-1 max-sm:gap-y-2 gap-x-6 max-sm:gap-2 justify-items-center mx-auto p-5"
          id="card_overall">
          {/* <div className="grid-rows-2 w-[40vw] max-xs:w-full cursor-pointer"  */}
          <div className={`grid-rows-2 w-full cursor-pointer ${!saving && "shadow"} border rounded-lg hover:shadow-md`}
            onClick={() => toGraphPage({ flag: "normal" })}>
            <div className="bg-primary flex items-center h-full p-2 font-medium text-white rounded-t-lg justify-between">
              <b>จำนวนตู้/ห้อง ที่สามารถดูได้</b>
              <svg width="28" height="28" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="33" height="33" rx="16.5" fill="#008A82" />
                <path d="M10.4011 22.599C9.6002 21.7981 8.96488 20.8473 8.53143 19.8009C8.09797 18.7544 7.87488 17.6329 7.87488 16.5002C7.87488 15.3675 8.09797 14.246 8.53143 13.1995C8.96488 12.1531 9.6002 11.2023 10.4011 10.4014M22.5988 10.4014C23.3997 11.2023 24.035 12.1531 24.4685 13.1995C24.9019 14.246 25.125 15.3675 25.125 16.5002C25.125 17.6329 24.9019 18.7544 24.4685 19.8009C24.035 20.8473 23.3997 21.7981 22.5988 22.599M13.1113 19.8879C12.213 18.9893 11.7084 17.7708 11.7084 16.5002C11.7084 15.2296 12.213 14.0111 13.1113 13.1125M19.8886 13.1125C20.7869 14.0111 21.2916 15.2296 21.2916 16.5002C21.2916 17.7708 20.7869 18.9893 19.8886 19.8879M17.4583 16.5002C17.4583 16.7544 17.3573 16.9981 17.1776 17.1778C16.9979 17.3576 16.7541 17.4585 16.5 17.4585C16.2458 17.4585 16.002 17.3576 15.8223 17.1778C15.6426 16.9981 15.5416 16.7544 15.5416 16.5002C15.5416 16.246 15.6426 16.0023 15.8223 15.8226C16.002 15.6428 16.2458 15.5419 16.5 15.5419C16.7541 15.5419 16.9979 15.6428 17.1776 15.8226C17.3573 16.0023 17.4583 16.246 17.4583 16.5002Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            <div id="card2"
              className="py-7 absolute w-[45%] max-sm:w-[85%] flex justify-center items-center text-primary text-5xl font-bold rounded-b-lg  overflow-hidden
           bg-right-bottom bg-no-repeat"
            // style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='640' height='118' fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 118'  %3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='M234.401 72.8438C150.686 29.5314 75.7418 34.3438 32.2899 37.4063H0V126L840.734 118.781V13.1251C843.923 13.7813 819.873 0.000205539 688.852 0C559.692 -0.000202618 454.451 28.8752 392.263 51.1875C350.406 63.875 296.589 99.75 234.401 72.8438Z' fill='rgba(0, 188, 180)' fill-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            >
              {isLoading
                ? <br />
                : (cabinetDatas?.length) + (coldRoomDatas?.length) + (compressorRackDatas?.length)
              }
            </div>
            <img className='relative object-center rounded-b-lg' style={{
              objectFit: "cover",
              height: "8rem",
              // width: "max(45vw, 90vw)"
              width: "100%"
            }}
              src='img/card_main.png'
            />
          </div>
          <div className={`grid-rows-2 w-full cursor-pointer ${!saving && "shadow"} border rounded-lg hover:shadow-md`}
            onClick={() => toGraphPage({ flag: 'abnormal' })}>
            <div className="bg-danger flex items-center p-2 font-medium text-white rounded-t-lg justify-between">
              <b>จำนวนตู้/ห้อง ที่มีการแจ้งเปิดใบงาน</b>
              <svg width="28" height="28" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="33" height="33" rx="16.5" fill="#A50000" />
                <g clipPath="url(#clip0_44_6212)">
                  <path d="M26.1857 12.1286C26.1581 11.9789 26.0993 11.8366 26.0132 11.7111C25.927 11.5856 25.8155 11.4796 25.6857 11.4L22.8286 14.2572C22.6953 14.3954 22.5355 14.5054 22.3588 14.5805C22.1821 14.6556 21.992 14.6943 21.8 14.6943C21.608 14.6943 21.4179 14.6556 21.2412 14.5805C21.0644 14.5054 20.9047 14.3954 20.7714 14.2572L19.6857 13.2857C19.4239 13.0187 19.2773 12.6597 19.2773 12.2857C19.2773 11.9118 19.4239 11.5528 19.6857 11.2857L22.5428 8.42859C22.4805 8.28221 22.3868 8.15132 22.2683 8.04516C22.1498 7.93901 22.0094 7.8602 21.8571 7.8143C20.8602 7.6155 19.8275 7.7006 18.8766 8.0599C17.9257 8.41921 17.0948 9.03829 16.4785 9.84666C15.8622 10.655 15.4852 11.6202 15.3905 12.6323C15.2958 13.6444 15.4872 14.6628 15.9428 15.5714L8.14283 23.3C8.00677 23.4331 7.89866 23.592 7.82485 23.7674C7.75103 23.9428 7.71301 24.1311 7.71301 24.3214C7.71301 24.5117 7.75103 24.7001 7.82485 24.8755C7.89866 25.0509 8.00677 25.2098 8.14283 25.3429L8.65712 25.8572C8.79017 25.9932 8.94905 26.1013 9.12446 26.1751C9.29986 26.249 9.48825 26.287 9.67855 26.287C9.86885 26.287 10.0572 26.249 10.2326 26.1751C10.408 26.1013 10.5669 25.9932 10.7 25.8572L18.5 18.0714C19.4089 18.5045 20.4201 18.6769 21.4212 18.5696C22.4223 18.4623 23.3739 18.0794 24.1704 17.4636C24.9669 16.8477 25.5769 16.023 25.9327 15.0811C26.2885 14.1393 26.3761 13.1172 26.1857 12.1286Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_44_6212">
                    <rect width="20" height="20" fill="white" transform="translate(7 7)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="absolute w-[45%] max-sm:w-[85%] py-7 flex justify-center items-center text-danger text-5xl font-bold rounded-b-lg bg-local bg-cover bg-center-bottom"
            >
              {isLoading
                ? <br />
                : numAbnormalCard
              }
            </div>
            <img className='relative object-center rounded-b-lg' style={{
              objectFit: "cover",
              height: "8rem",
              width: "100%"
            }}
              src='img/card_mainAb.png'
            />
          </div>
        </div>
        <ExportTypes id="card_overall" onSaving={setSaving} />
      </div>

      <div className={`bg-white border ${saving != 'JPEG' && 'shadow-md'} mt-3 mx-2 rounded-xl `}>
        <div className="p-5" id="cabinet">
          <div className="flex justify-between flex-wrap items-end gap-2 pb-4" id="title">
            <div className="text-secondary font-semibold">
              ตู้แช่ ({!isLoading ? cabinetDatas?.length || 0 : 0})
            </div>

            <div className="text-[#B1B1B1] text-sm">
              อัพเดทล่าสุด : {cabinetDatas?.length ? formatDateTime(lastUpdate) : '-'}
            </div>
          </div>
          {isLoading
            ? <div className="flex justify-center items-center min-h-10 my-4"><Spinner size="lg" /></div>
            : cabinetDatas?.length > 0 ? (
              <div>
                {/* {[...Array(Math.ceil(cabinetDatas?.length / 3) + 1)?.keys()].map((row, ind) => ( */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 min-h-20 "
                // <div className=" grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 min-h-20 "
                // id={`trow_${ind}`}
                >
                  {cabinetDatas?.filter(ele => ele.abnormalStatus)
                    .concat(cabinetDatas?.filter(ele => !ele.abnormalStatus))
                    .map((cabinetData, idx) => {
                      // if ((ind - 1 >= 0) && (ind - 1) * 3 <= idx && idx < ind * 3) {
                      return (
                        <div key={idx} className="" id={`part${idx + 1}`}
                          onClick={() => toGraphSelect(cabinetData.deviceId)}>
                          <CabinetCard
                            data={cabinetData}
                            saving={saving}
                          />
                        </div>
                      );
                      // }
                    })}
                </div>
                {/* ))} */}
              </div>
            ) : (
              <div className="flex justify-center h-10 rounded items-center my-4 text-dark"
                id="part1">
                ไม่พบข้อมูล
              </div>
            )
          }

          {/* <div className="h-0 overflow-hidden absolute">
            {[...Array(Math.ceil(cabinetDatas?.length / 3) + 1)?.keys()].map((row, ind) => (
              <div className=" grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 min-h-20 "
                id={`trow_${ind}`}>
                {cabinetDatas?.filter(ele => ele.abnormalStatus)
                  .concat(cabinetDatas?.filter(ele => !ele.abnormalStatus))
                  .map((cabinetData, idx) => {
                    if ((ind - 1 >= 0) && (ind - 1) * 3 <= idx && idx < ind * 3) {
                      return (
                        <div key={idx} className="pt-4"
                          onClick={() => toGraphSelect(cabinetData.deviceId)}>
                          <CabinetCard
                            data={cabinetData}
                            saving={saving}
                          />
                        </div>
                      );
                    }
                  })}
              </div>
            ))}
          </div> */}
        </div>

        <ExportTypes id="cabinet" onSaving={setSaving} optionPDF='cards'
          dataLength={cabinetDatas?.length} // {Math.ceil(cabinetDatas?.length / 3) + 1} 
          responsive={[640, 1020]} />
      </div>

      <div className={`bg-white border ${saving != 'JPEG' && 'shadow-md'} mt-3 mx-2 rounded-xl`}>
        <div className="p-5" id="coldroom">
          <div className="flex justify-between items-center pb-4" id="title">
            <div className="text-secondary font-semibold">
              ห้องเย็น ({!isLoading ? coldRoomDatas?.length || 0 : 0})
            </div>
            <div className="text-[#B1B1B1] text-sm">
              อัพเดทล่าสุด : {coldRoomDatas?.length ? formatDateTime(lastUpdate) : '-'}
            </div>
          </div>

          {isLoading
            ? <div className="flex justify-center items-center min-h-10 my-4"><Spinner size="lg" /></div>
            : coldRoomDatas?.length > 0 ? (
              <div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-20"
                >
                  {coldRoomDatas?.filter(ele => ele.abnormalStatus)
                    .concat(coldRoomDatas?.filter(ele => !ele.abnormalStatus))
                    .map((coldRoomData, idx) => {
                      return (
                        <div key={idx} className="cursor-pointer" id={`part${idx + 1}`}
                          onClick={() => toGraphSelect(coldRoomData.deviceId)}
                        >
                          <ColdroomCard
                            data={coldRoomData}
                            saving={saving}
                          />
                        </div>
                      );
                    })}
                </div>

              </div>
            ) : (
              <div className="flex justify-center h-10 rounded items-center my-4 text-dark"
                id="part1">
                ไม่พบข้อมูล
              </div>
            )}

          {/* <div className="h-0 overflow-hidden absolute">
            {[...Array(Math.ceil(coldRoomDatas?.length / 3) + 1)?.keys()].map((row, ind) => (
              <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-20"
                id={`trow_${ind}`} >
                {coldRoomDatas?.filter(ele => ele.abnormalStatus)
                  .concat(coldRoomDatas?.filter(ele => !ele.abnormalStatus))
                  .map((coldRoomData, idx) => {
                    if ((ind - 1 >= 0) && (ind - 1) * 3 <= idx && idx < ind * 3) {
                      return (
                        <div key={idx} className="pt-4"
                        >
                          <ColdroomCard
                            data={coldRoomData}
                            saving={saving}
                          />
                        </div>
                      );
                    }
                  })}
              </div>
            ))}
          </div> */}
        </div>

        {<ExportTypes id="coldroom" onSaving={setSaving} />}
      </div>

      <div className={`bg-white border ${saving != 'JPEG' && 'shadow'} mt-3 mx-2 rounded-xl`}>
        <div className="p-5" id="compressor rack">
          <div className="flex justify-between pb-4" id="title" >
            <div className="text-secondary font-semibold">
              Compressor rack ({!isLoading ? compressorRackDatas?.length || 0 : 0})
            </div>
            <div className="text-[#B1B1B1] text-sm">
              อัพเดทล่าสุด : {compressorRackDatas?.length ? formatDateTime(lastUpdate) : '-'}
            </div>
          </div>

          {isLoading
            ? <div className="flex justify-center items-center min-h-10 my-4"><Spinner size="lg" /></div>
            : compressorRackDatas?.length > 0 ? (
              <div >
                {/* {[...Array(Math.ceil(compressorRackDatas?.length / 3) + 1)?.keys()].map((row, ind) => ( */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 "
                // id={`trow_${ind}`} 
                >
                  {compressorRackDatas?.filter(ele => ele.abnormalStatus).concat(compressorRackDatas?.filter(ele => !ele.abnormalStatus))
                    .map((compressorRackData, idx) => {
                      // if ((ind - 1 >= 0) && (ind - 1) * 3 <= idx && idx < ind * 3) {
                      return (
                        <div key={idx} className="" id={`part${idx + 1}`}>
                          <CompressorRack
                            data={compressorRackData}
                            saving={saving}
                          />
                        </div>
                      );
                      // }
                    })}
                </div>
                {/* ))} */}
              </div>
            ) : (
              <div className="flex justify-center h-10 rounded items-center my-4 text-dark"
                id="part1">
                ไม่พบข้อมูล
              </div>
            )}

          <div className="h-0 overflow-hidden absolute">
            {[...Array(Math.ceil(compressorRackDatas?.length / 3) + 1)?.keys()].map((row, ind) => (
              <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 "
                id={`trow_${ind}`} key={ind}
              >
                {compressorRackDatas?.filter(ele => ele.abnormalStatus).concat(compressorRackDatas?.filter(ele => !ele.abnormalStatus))
                  .map((compressorRackData, idx) => {
                    if ((ind - 1 >= 0) && (ind - 1) * 3 <= idx && idx < ind * 3) {
                      return (
                        <div key={idx} className="pt-3.5" id={`part${idx + 1}`}>
                          <CompressorRack
                            data={compressorRackData}
                            saving={saving}
                          />
                        </div>
                      );
                    }
                  })}
              </div>
            ))}
          </div>
        </div>

        {<ExportTypes id="compressor rack" onSaving={setSaving} />}
      </div>
    </>
  );
}

export default RefrigerationOverall;