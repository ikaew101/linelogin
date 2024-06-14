import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import Swal from "sweetalert2";
import DataChiller7Day from "./DataChiller7Day";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AuthService from "../../service/authen";
import AirService from "../../service/air";
import ExportPage from "../exportPage";
import ExportTypes from "../exportTypes";

function AirResult({ selectedStore, setSelectedStore, stores, userId }) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState('costCenter')
  const [format, setFormat] = useState(selectedStore.format)
  const [storeList, setStoreList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [storeData, setStoreData] = useState(selectedStore)
  const [data, setData] = useState()

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
      const res = await AirService.getResult(resStore.id)
      // console.log('res', res.data)
      setData(res.data)
      localStorage.setItem("_id", resStore.id)
      setIsLoading(false)
      setSearch('')
    } catch (err) {
      setIsLoading(false)
      console.log(err);
      // setData();
    }
  };

  const [saving, setSaving] = useState(false)
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

        <ExportPage onSaving={setSaving} name="Air Result"
        />
      </div>

      <DataChiller7Day isLoading={isLoading} data={data?.chillerData7days} config={data?.config} configChiller={data?.configChiller}
        saving={saving}
      />

      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
        {/* <div className="flex text-secondary font-bold items-center gap-2">
          <img src="icon/thermo.png" className="ml-2 w-10 h-10" />
          Minisupermarket : อุณหภูมิล่าสุด
        </div> */}
        <Table format={"mini"} isLoading={isLoading} data={data?.minisupermarket?.length && data?.minisupermarket} config={data?.config}
          saving={saving} />
      </div>

      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
        <Table format={"super"} isLoading={isLoading} data={data?.supermarket?.length && data?.supermarket} config={data?.config} />
      </div>

      <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>

        <Table format={"hyper"} isLoading={isLoading} data={data?.hypermarket?.length && data?.hypermarket} config={data?.config} />
      </div>

    </>
  );
}

function Table({ format, isLoading, data, config }) {
  const name = format == "mini" ? "Minisupermarket" : format == "super" ? "Supermarket" : format == "hyper" ? "Hypermarket" : ""
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [sort, setSort] = useState({ timestamp: 'desc' })
  function toggleSort(e) {
    e.preventDefault()
    if (isLoading) return
    const label = e.target.id

    if (sort && sort[label] == 'asc') {
      setSort({ [label]: 'desc' })
    } else {
      setSort({ [label]: 'asc' })
    }

    data?.sort((a, b) => {
      // const key = Object.keys(sort)[0]
      const A = a[label] || ""
      const B = b[label] || ""
      if (label == "timestamp") {
        if (Object.values(sort)[0] == 'asc') {
          return new Date(A) - new Date(B)
        } else {
          return new Date(B) - new Date(A)
        }
      } else if (label == 'storeName') {
        // console.log(label)
        if (Object.values(sort)[0] == 'asc') {
          return A.localeCompare(B)
        } else {
          return B.localeCompare(A)
        }
      }
      if (Object.values(sort)[0] == 'asc') {
        return A - (B)
      } else {
        return B - (A)
      }

    })
    setDataSorted(data)
  }
  const percentCol = format == "mini" ? "25%" : "15%"

  const classRed = "bg-[#FFEBEB] text-danger p-1.5 my-2 max-w-[5rem] mx-auto font-bold rounded"
  const classBlue = "bg-[#DDF0E3] text-[#32AA23] p-1.5 my-2 max-w-[5rem] mx-auto font-bold rounded"

  const [dataSorted, setDataSorted] = useState()
  useEffect(() => {
    data?.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
    setDataSorted(data)
  }, [data])
  const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  return (<>
    <div id={`result_${format}`} className="p-3">
      <div className="flex text-secondary font-bold items-center gap-2">
        <img src="icon/thermo.png" className="ml-2 w-10 h-10" />

        {name} : อุณหภูมิล่าสุด
      </div>

      <div className="grid pt-2.5">
        <div className=" scrollbar overflow-x-auto">
          <table width="100%" className={`w-full table-fixed text-dark
          ${format == "super" ? "min-w-[855px]" : format == "hyper" ? "min-w-[861px]" : "min-w-[795px]"}`}>
            <col style={{ width: percentCol }} />
            <col style={{ width: percentCol }} />
            <col style={{ width: percentCol }} />
            <col style={{ width: percentCol }} />
            <col style={{ width: percentCol }} />
            {format != "mini" && <col style={{ width: percentCol }} />}
            {format == "super" && <>
              <col style={{ width: percentCol }} />
              <col style={{ width: percentCol }} />
              <col style={{ width: percentCol }} />
            </>}
            <thead className="bg-table-head gap-0.5 text-sm">
              <tr>
                <th className=" rounded-l-md">
                  <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="storeName">
                    สาขา
                    <div className="flex self-center h-min ml-1">
                      <img id="storeName" className={`self-end ${sort?.storeName == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                      <img id="storeName" className={`self-end ${sort?.storeName == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                    </div>
                  </div>
                </th>
                {format !== "hyper" && <>
                  <th className="py-2.5">
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="averageAirReturnTemp">
                      อุณหภูมิ AVG Air return <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="averageAirReturnTemp" className={`self-end ${sort?.averageAirReturnTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="averageAirReturnTemp" className={`self-end ${sort?.averageAirReturnTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                  <th className="">
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="indoorTemp" >
                      อุณหภูมิภายในสาขา <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="indoorTemp" className={`self-end ${sort?.indoorTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="indoorTemp" className={`self-end ${sort?.indoorTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                  <th className="" >
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="outdoorTemp">
                      อุณหภูมิภายนอกสาขา <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="outdoorTemp" className={`self-end ${sort?.outdoorTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="outdoorTemp" className={`self-end ${sort?.outdoorTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                </>}
                {format !== "mini" && <>
                  <th className={`${format == "mini" && "rounded-l-md"}`}>
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="saleTemp">
                      อุณหภูมิพื้นที่ขาย <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="saleTemp" className={`self-end ${sort?.saleTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="saleTemp" className={`self-end ${sort?.saleTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                  <th className="">
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="mallTemp">
                      อุณหภูมิร้านค้าเช่า <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="mallTemp" className={`self-end ${sort?.mallTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="mallTemp" className={`self-end ${sort?.mallTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                  <th className="">
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="foodTemp">
                      อุณหภูมิศูนย์อาหาร <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="foodTemp" className={`self-end ${sort?.foodTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="foodTemp" className={`self-end ${sort?.foodTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                  <th className="py-2">
                    <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="outsideTemp">
                      อุณหภูมินอกสาขา <br />(°C)
                      <div className="flex self-center h-min ml-1">
                        <img id="outsideTemp" className={`self-end ${sort?.outsideTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                        <img id="outsideTemp" className={`self-end ${sort?.outsideTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                      </div>
                    </div>
                  </th>
                </>}
                <th className="rounded-r-md py-2.5">
                  <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="timestamp">
                    เวลาล่าสุด
                    <div className="flex self-center h-min ml-1">
                      <img id="timestamp" className={`self-end ${sort?.timestamp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                      <img id="timestamp" className={`self-end ${sort?.timestamp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={`text-[14px] ${isLoading && 'hidden'}`}>
              {dataSorted?.map((ele, ind) => {
                if (ind < perPage * page && ind + 1 > perPage * page - perPage)
                  return (
                    <tr key={ind} className="odd:bg-white even:bg-table text-center">
                      <td className="rounded-l-md py-1.5" >
                        <div className="my-2">{ele?.storeName}</div>
                      </td>
                      {format !== "hyper" && <>
                        <td>
                          <div className={`${ele.averageAirReturnTemp && ele.averageAirReturnTemp < (config?.minTemp || 25) ? classBlue : ele.averageAirReturnTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.averageAirReturnTemp == '-999' ? '-' :
                              ele.averageAirReturnTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                        <td>
                          <div className={`${ele.indoorTemp && ele.indoorTemp < (config?.minTemp || 25) ? classBlue : ele.indoorTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.indoorTemp == '-999' ? '-' :
                              ele.indoorTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                        <td>
                          <div className={`${ele.outdoorTemp && ele.outdoorTemp < (config?.minTemp || 25) ? classBlue : ele.outdoorTemp > (config?.maxTemp || 27) && classRed}`}>

                            {ele.outdoorTemp == '-999' ? '-' :
                              ele.outdoorTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                      </>}
                      {format !== "mini" && <>
                        <td>
                          <div className={`${ele.saleTemp && ele.saleTemp < (config?.minTemp || 25) ? classBlue : ele.saleTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.saleTemp == '-999' ? '-' :
                              ele.saleTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                        <td>
                          <div className={`${ele.mallTemp && ele.mallTemp < (config?.minTemp || 25) ? classBlue : ele.mallTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.mallTemp == '-999' ? '-' :
                              ele.mallTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                        <td>
                          <div className={`${ele.foodTemp && ele.foodTemp < (config?.minTemp || 25) ? classBlue : ele.foodTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.foodTemp == '-999' ? '-' :
                              ele.foodTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                        <td>
                          <div className={`${ele.outsideTemp && ele.outsideTemp < (config?.minTemp || 25) ? classBlue : ele.outsideTemp > (config?.maxTemp || 27) && classRed}`}>
                            {ele.outsideTemp == '-999' ? '-' :
                              ele.outsideTemp.toLocaleString([], optionDigit)}
                          </div>
                        </td>
                      </>}
                      <td className="rounded-r-md py-2">
                        {new Date(new Date(ele.timestamp).getTime() + new Date(ele.timestamp).getTimezoneOffset() * 60000)
                          .toLocaleString('th-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                        }</td>
                    </tr>
                  )
              })}
            </tbody>
          </table >

        </div>
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
                    {/* <option value='100'>100</option> */}
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
    </div >

    <div className={`${data?.length && "sm:absolute sm:-mt-10"}`}>
      <ExportTypes id={`result_${format}`}
        csvData={data?.map((ele, i) => {
          const objThai = {
            สาขา: ele.storeName,
            'อุณหภูมิ AVG Air return (°C)': ele.averageAirReturnTemp,
            'อุณหภูมิภายในสาขา (°C)': ele.indoorTemp,
            'อุณหภูมิภายนอกสาขา (°C)': ele.outdoorTemp,
            'อุณหภูมิพื้นที่ขาย (°C)': ele.saleTemp,
            'อุณหภูมิร้านค้าเช่า (°C)': ele.mallTemp,
            'อุณหภูมิศูนย์อาหาร (°C)': ele.foodTemp,
            'อุณหภูมินอกสาขา (°C)': ele.outsideTemp,
            เวลาล่าสุด: new Date(new Date(ele.timestamp).getTime() + new Date(ele.timestamp).getTimezoneOffset() * 60000).toLocaleString('th-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
            ,
          }
          if (format == "hyper") {
            delete objThai['อุณหภูมิ AVG Air return (°C)']
            delete objThai['อุณหภูมิภายในสาขา (°C)']
            delete objThai['อุณหภูมิภายนอกสาขา (°C)']
          }
          if (format == "mini") {
            delete objThai['อุณหภูมิพื้นที่ขาย (°C)']
            delete objThai['อุณหภูมิร้านค้าเช่า (°C)']
            delete objThai['อุณหภูมิศูนย์อาหาร (°C)']
            delete objThai['อุณหภูมินอกสาขา (°C)']
          }
          return objThai
        })} />
    </div>
  </>)
}

export default AirResult;