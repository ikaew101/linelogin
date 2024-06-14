import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import Swal from "sweetalert2";
import CardsMonitoringTemp from "../airSystem/CardsMonitoringTemp";
import GraphTemp24hr from "../airSystem/GraphTemp24hr";
import GraphLine from "../airSystem/GraphLine";
import TableStatusDevice from "../airSystem/TableStatusDevice";
import GraphStatusDevice from "../airSystem/GraphStatusDevice";
import DataChillerLast from "../airSystem/DataChiller";
import DataChiller7Day from "../airSystem/DataChiller7Day";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function LightingResult({ selectedStore, setSelectedStore, stores }) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState('costCenter')
  const [format, setFormat] = useState(selectedStore.format)
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

  useEffect(() => {
    // setType('costCenter')
    getData()
  }, [])

  const [availableTotal, setAvailableTotal] = useState(0)
  const getData = async () => {
    const typeFormat = type || 'costCenter'
    const searchValue = search || storeData[typeFormat]
    let resStore, findFormat
    resStore = (stores[format]?.find(store => store[typeFormat] == searchValue))
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
      // const response = await RefrigService.getRefrigOverview(resStore.id)
      localStorage.setItem("_id", resStore.id)
      setIsLoading(false)
      setSearch('')
    } catch (err) {
      setIsLoading(false)
      console.log(err);
      // setData();
    }
  };

  const color = {
    airReturn: "#C3D311",
    inside: "#46B2FF",
    outside: "#FA5A7D",
    area: "#809DED",
    storeRent: "#F9BE00",
    food: "#00BCB4",
    out: "#FF6B1E",
  }
  return (
    <>
      <div className="bg-white shadow-md -mt-10 mx-2 rounded-xl p-3">
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

      {/* <div className="bg-white shadow-md mt-5 mx-2 rounded-xl p-3 ">
        <div className='flex items-center gap-2 text-[#828282] font-bold'>
          // <img src="/icon/lighting.svg" />

        </div>
      </div> */}
    </>
  );
}

export default LightingResult;