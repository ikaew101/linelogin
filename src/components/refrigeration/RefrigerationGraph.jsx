import React, { useState, useEffect } from "react";
import RefrigerationGraphComponent from "./graphs/RefrigerationGraphComponent";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import RefrigService from "../../service/refrigerator";
import Swal from "sweetalert2";
import dayTh from "../../const/day";
import MonthName from "../../const/month";
import AuthService from "../../service/authen";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";
// import { useParams } from "react-router-dom";

function RefrigerationGraph({ values, selectedStore, setSelectedStore, stores, userId }) {
  // const { branch, id } = useParams();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEquipmentTags, setSelectedEquipmentTags] = useState("normal");
  const [storeData, setStoreData] = useState(selectedStore)
  const [format, setFormat] = useState(selectedStore.format || 'mini')

  useEffect(() => {
    setSelectedStore(storeData)
  }, [storeData])

  useEffect(() => {
    if (values) {
      if (values.flag) {
        setSelectedEquipmentTags(values.flag)
      }
      //   if (values?.graphId) {
      //     setSelectedEquipmentTags(values.graphId)
      //   } else if (!values.isAll) {
      //     setGraphDatas([])
      //     setIsLoading(false)
      //     return
      //   }
    }
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
    // setGraphDatas(null)
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
      setIsLoading(true)
      await AuthService.refreshTokenPage(userId)
      // localStorage.setItem("_auth_storage", new Date().toISOString())
      const response = await RefrigService.getRefrigGraph(resStore.id)
      // const datas = (response.data.cabinet || []).concat(response.data.coldroom || [])
      const datas = (response?.data.cabinet || []).concat(response.data.coldroom || []).sort((a, b) => {
        if (a.name.split('-')[0].trim().length == b.name.split('-')[0].trim().length) {
          return a.name.localeCompare(b.name)
        } else {
          return a.name.split('-')[0].trim().length < b.name.split('-')[0].trim().length ? -1 : 1
        }
      })
      if (search) setSelectedEquipmentTags("normal")

      if (values?.graphId) setSelectedEquipmentTags({ name: datas?.find(ele => ele.deviceId == values.graphId)?.name })
      const isData = datas?.find(ele => ele.name)
      datas?.map((data) => {
        data.cabinetValue?.map((ele, i) => {
          const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
          // const date = new Date(ele.xAxis)
          const dayThai = dayTh[(new Date(date).getDay())]

          const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
          ele.date = `${dayThai}, ${startTh}`
          ele.time = (new Date(date)).toLocaleString('th-GB', { hour: "2-digit", minute: "numeric", hour12: false })
          // ele.energySavingStatus = ele.energySavingStatus == 'ON' ? 1 : 0
          // ele.defrostStatus = ele.defrostStatus == 'ON' ? 1 : 0
          ele.energySavingStatus = ele.energySavingStatus == '-999' ? null : ele.energySavingStatus
          ele.defrostStatus = ele.defrostStatus == '-999' ? null : ele.defrostStatus
          ele.setpointTemp = ele.setpointTemp == '-999' ? null : ele.setpointTemp
          ele.cabinetTemp = ele.cabinetTemp == '-999' ? null : ele.cabinetTemp
          ele.evapTemp = ele.evapTemp == '-999' ? null : ele.evapTemp
        })

        data.coldRoomValue?.map((ele, i) => {
          const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
          const dayThai = dayTh[(new Date(date).getDay())]
          const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
          ele.date = `${dayThai}, ${startTh}`
          ele.time = (new Date(date)).toLocaleString('th-GB', { hour: "2-digit", minute: "numeric", hour12: false })
          // ele.energySavingStatus = ele.energySavingStatus == 'ON' ? 1 : 0
          // ele.defrostStatus = ele.defrostStatus == 'ON' ? 1 : 0
          ele.energySavingStatus = ele.energySavingStatus == '-999' ? null : ele.energySavingStatus
          ele.defrostStatus = ele.defrostStatus == '-999' ? null : ele.defrostStatus
          ele.setpointTemp = ele.setpointTemp == '-999' ? null : ele.setpointTemp
          ele.coldRoomTemp = ele.coldRoomTemp == '-999' ? null : ele.coldRoomTemp
          ele.evapTemp = ele.evapTemp == '-999' ? null : ele.evapTemp
        })
      })
      // setData(isData ? datas || [] : [])
      setData(isData ? datas.filter(ele => ele.name) || [] : [])
      // setGraphDatas(datas)
      // if (!datas?.length) {
      //   setGraphDatas([])
      // }
      if (!isData || !datas.length) {
        Swal.fire({
          text: 'ไม่พบข้อมูล',
          icon: 'warning',
          confirmButtonColor: '#809DED',
          confirmButtonText: 'OK',
          iconColor: '#FFBC29',
          showCloseButton: true,
        })
      }
      localStorage.setItem("_id", resStore.id)
      setSearch('')
      // setIsLoading(false)
    } catch (err) {
      console.log('err', err)
      // // setIsLoading(null)
      // return
      setIsLoading(false)
      // setData([])
    }
  };

  useEffect(() => {
    if (data) setIsLoading(false)
  }, [data])

  const [toggle, setToggle] = useState({
    cabinetTemp: true,
    evapTemp: true,
    setpointTemp: true,
    energySaving: true,
    defrost: true,
  })

  const [saving, setSaving] = useState(false)

  const [isSearching, setIsSearching] = useState(false)
  window.onscroll = function (e) {
    // console.log(e.target.activeElement.id)
    if (isSearching) setIsSearching(false)
  }
  return (
    <>
      <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border -mt-10 mx-2 rounded-xl`}>
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
                setIsSearching={setIsSearching}
                isSearching={isSearching}
              />
              <button className={`text-white bg-primary px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                onClick={getData}
                disabled={isLoading}
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        <ExportPage onSaving={setSaving} name="Refrig Graph"
          arrayId={[
            { card: "graphRefrig ", length: data?.length || 0 },
          ]}
          format={[467, 657]}
        />
      </div>

      <div className="h-0 overflow-hidden">
        <div id="top">
          <div className='text-2xl pl-4 font-semibold md:pl-6'>
            ระบบตู้แช่และห้องเย็น
          </div>
          <div className='bg-primary p-2 my-4 mx-6 lg:mx-10 rounded-md justify-center flex lg:gap-14 relative z-30 gap-1 max-lg:grid max-lg:grid-cols-3 font-medium'>
            <button name='overall'
              className={`py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]    max-lg:mx-auto transition-colors duration-100`}
            >
              ภาพรวม
            </button>
            <button name='graph'
              className={`bg-[#009B93] py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]   max-lg:mx-auto transition-colors duration-100`}
            >
              กราฟ
            </button>
            <button name='notification'
              className={`py-2  rounded-md text-white max-lg:w-full lg:min-w-[250px]    px-2 transition-colors duration-100 `}
            >
              การแจ้งเตือน
            </button>
          </div>

          <div className="bg-white border -mt-10 mx-2 rounded-xl">
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
            </div>
          </div>
        </div>
      </div>

      <>
        <div className={`bg-white ${saving != 'JPEG' && 'shadow-md'} border mt-5 mx-2 rounded-xl p-3 `}>
          {isLoading
            ? <div className="flex justify-center py-3 my-10 items-center"><Spinner size="lg" /></div>
            // : !data?.length
            //   ?
            //   <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark">
            //     ไม่พบข้อมูล
            //   </div>
            :
            <div className="mx-2 pt-5 h-full bg-white shadow-basic rounded-lg"
              id={`graphRefrig `} >
              {!data?.length
                ?
                <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark"
                  id="trow_0">
                  ไม่พบข้อมูล
                </div>
                : <>
                  <div className={`flex justify-end ${!data?.length && 'hidden'} pb-2 pr-2`}
                    id="title">
                    <select
                      className="p-2 w-52 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0"
                      name="status"
                      value={selectedEquipmentTags?.name || selectedEquipmentTags}
                      onChange={(e) => {
                        if (e.target.value !== "normal" && e.target.value !== "abnormal") {
                          setSelectedEquipmentTags({ name: e.target.value })
                        } else {
                          setSelectedEquipmentTags(e.target.value)
                        }
                      }}
                    >
                      <option value="normal">แสดงทุกตู้</option>
                      {data?.map((data, idx) => {
                        return (data.name &&
                          <option value={data.name} key={idx}>
                            {data.name}
                          </option>
                        );
                      })}
                      <option value="abnormal">เฉพาะตู้ที่มีการแจ้งเปิดใบงาน</option>
                    </select>
                  </div>

                  <div className="pr-2 grid">
                    {/* <div className={`scrollbar overflow-x-auto`}>
                      <div className="min-w-[1350px]"> */}
                    {data?.filter(ele => selectedEquipmentTags?.name ? ele.name == selectedEquipmentTags.name
                      : selectedEquipmentTags == "normal" ? ele : (selectedEquipmentTags == "abnormal" && ele.abnormalStatus))
                      // {data?.filter(ele => selectedEquipmentTags?.name ? ele.name == selectedEquipmentTags.name && ele.name
                      //   : selectedEquipmentTags == "normal" ? ele && ele.name: (selectedEquipmentTags == "abnormal" && ele.abnormalStatus&& ele.name))
                      ?.map((element, index) => {
                        const isCabinet = element.cabinetValue
                        return (
                          (isSearching ? element.name && index < 5 : element.name) &&
                          <div key={index} id={`trow_${index}`} className="w-full py-5">
                            {/* <div className="flex justify-between items-center mb-2 max-md:grid grid-rows-2 max-md:justify-center"> */}
                            <div className="flex justify-between items-center mb-2 max-sm:grid h-fit max-md:justify-center">
                              <div className="text-xs flex flex-wrap gap-y-2 max-sm:order-last max-sm:mt-2">
                                {/* <div className="text-xs flex"> */}
                                <div className={`flex items-center mr-6 cursor-pointer ${!toggle.cabinetTemp && 'opacity-50'}`}
                                  onClick={() => setToggle({ ...toggle, cabinetTemp: !toggle.cabinetTemp })}>
                                  <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#FFBC29] mx-2"></div>
                                  <div className=" ">{isCabinet ? "อุณหภูมิตู้แช่" : "อุณหภูมิห้องเย็น"}</div>
                                </div>
                                <div className={`flex items-center mr-6 cursor-pointer ${!toggle.setpointTemp && 'opacity-50'}`}
                                  onClick={() => setToggle({ ...toggle, setpointTemp: !toggle.setpointTemp })}>
                                  <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#809DED] mx-2"></div>
                                  <div className=" ">อุณหภูมิที่ตั้ง</div>
                                </div>
                                <div className={`flex items-center mr-6 cursor-pointer ${!toggle.evapTemp && 'opacity-50'}`}
                                  onClick={() => setToggle({ ...toggle, evapTemp: !toggle.evapTemp })}>
                                  <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#00C2B8] mx-2"></div>
                                  <div className=" ">อุณหภูมิคอยล์เย็น</div>
                                </div>
                                <div className={`flex items-center mr-6 cursor-pointer ${!toggle.energySaving && 'opacity-50'}`}
                                  onClick={() => setToggle({ ...toggle, energySaving: !toggle.energySaving })}>
                                  <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#1A8334] mx-2"></div>
                                  <div className=" ">โหมดประหยัดพลังงาน</div>
                                </div>
                                <div className={`flex items-center mr-6 cursor-pointer ${!toggle.defrost && 'opacity-50'}`}
                                  onClick={() => setToggle({ ...toggle, defrost: !toggle.defrost })}>
                                  <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#C3D311] mx-2"></div>
                                  <div className=" ">ละลายน้ำแข็ง</div>
                                </div>
                              </div>
                              {/* <div className="text-sm bg-light-gray-status text-dark  py-2 px-4 rounded-full font-semibold w-fit place-self-end"> */}
                              <div className="text-sm bg-light-gray-status text-dark  py-2 px-4 rounded-full font-semibold md:whitespace-nowrap max-sm:max-w-full max-sm:place-self-end place-self-center max-sm:-mt-2
                              text-right min-w-fit">
                                {element.name}
                                <p className="text-sm text-dark">
                                  คุณภาพสายสัญญาณ :{" "}
                                  <span className="" hidden={!element.communication}>
                                    {element.communication || 0} %
                                  </span>
                                  <span hidden={element.communication}>-</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end font-bold">
                              {/* <p className="text-sm text-dark pr-1"> */}
                            </div>

                            <div className="grid">
                              <div className={`scrollbar overflow-x-auto`}>
                                <div
                                  className="relative min-w-[1670px]" //min-w-[615px]
                                  key={index + 1}
                                >
                                  {!(element.minTarget == 0 && element.maxTarget == 0) &&
                                    <div className="absolute right-[20px] top-[10px] max-[450px]:top-[60px] px-2 text-white bg-[#ed7f7f] z-10">
                                      Temperature in Target {element.minTarget} °C to {element.maxTarget} °C
                                    </div>
                                  }
                                  <RefrigerationGraphComponent
                                    data={element}
                                    array={element}
                                    toggle={toggle}
                                    saving={saving}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    {/* </div>
                    </div> */}
                  </div>
                </>}

              <div className="-ml-5">
                <ExportTypes id={`graphRefrig `} onSaving={setSaving}
                  optionPDF='cards' dataLength={data?.filter(ele => selectedEquipmentTags?.name ? ele.name == selectedEquipmentTags.name
                    : selectedEquipmentTags == "normal" ? ele : (selectedEquipmentTags == "abnormal" && ele.abnormalStatus)).length} />
              </div>
            </div>
          }

        </div>
      </>
    </>
  );
}

export default RefrigerationGraph;
