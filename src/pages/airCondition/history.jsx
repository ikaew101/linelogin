import { useEffect, useState } from 'react'
import DatePickerThai from '../../components/DatePickerThai'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Spinner from '../../components/spinner'
import AuthService from '../../service/authen'
import AirService from '../../service/air'
import ExportTypes from '../../components/exportTypes'
import ExportPage from '../../components/exportPage'

function AirHistory({ tab }) {
    const lastDate = new Date(new Date().setDate(new Date().getDate() - 1))
    const [dateSearch, setDateSearch] = useState(lastDate)

    const currentIndex = "air"
    const [state, setState] = useState('overall')
    // const [selectedStore, setSelectedStore] = useState()

    const [isLoading, setIsLoading] = useState(true)
    const [storeData, setStoreData] = useState()
    // const [format, setFormat] = useState('mini')
    const [perPage, setPerPage] = useState(20)
    const [page, setPage] = useState(1)

    function setStateTab(e) {
        // setState(e.target.value)
        localStorage.setItem("tab", JSON.stringify([currentIndex, e.target.name]))
        window.location.href = '/airCondition'
    }

    const [stores, setStores] = useState([])
    const authState = localStorage.getItem('_auth_state')
    let userId = JSON.parse(authState)[0]?.id
    const [permission, setPermission] = useState()

    useEffect(() => {
        setPermission(false) //setPermission(JSON.parse(authState)[0].menus?.find(ele => ele.menuName.includes('KPI')))
        const jsonStores = JSON.parse(authState)[0].availableStore
        const prevId = localStorage.getItem("_id")
        let selectStore
        if (prevId) {
            selectStore = jsonStores.mini?.find(ele => ele.id == prevId)
                || jsonStores.super?.find(ele => ele.id == prevId)
                || jsonStores.hyper?.find(ele => ele.id == prevId)
        } else {
            jsonStores.mini?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.super?.sort((a, b) => a.costCenter - b.costCenter)
            jsonStores.hyper?.sort((a, b) => a.costCenter - b.costCenter)
            selectStore = jsonStores.mini[0] || jsonStores.super[0] || jsonStores.hyper[0]
        }
        setStores(jsonStores)
        setStoreData({
            costCenter: selectStore.costCenter,
            storeNumber: selectStore.storeNumber,
            storeName: selectStore.storeName,
            format: selectStore.storeFormatName.includes("Mini") ? 'mini'
                : selectStore.storeFormatName.includes("Super") ? 'super'
                    : selectStore.storeFormatName.includes("Hyper") ? 'hyper' : 'mini',
            id: selectStore.id
        })
    }, [])

    const [data, setData] = useState([])
    const [config, setConfig] = useState()

    useEffect(() => {
        // setType('costCenter')
        if (storeData) getData()
    }, [storeData]);

    // useEffect(() => {
    //     if (data?.length) setIsLoading(false)
    //     // setToggleAll(false)
    // }, [data])

    const getData = async () => {
        // const typeFormat = type || 'costCenter'
        // const searchValue = search || storeData[typeFormat]
        // let resStore, findFormat
        // resStore = (stores[format]?.find(store => store[typeFormat] == searchValue))
        // if (resStore) {
        //     setStoreData({
        //         costCenter: resStore.costCenter,
        //         storeNumber: resStore.storeNumber,
        //         storeName: resStore.storeName,
        //         format: format
        //     })
        // } else if (search) {
        //     Swal.fire({
        //         text: 'ไม่พบข้อมูลสาขาที่เลือก',
        //         icon: 'error',
        //         confirmButtonColor: '#809DED',
        //         confirmButtonText: 'OK',
        //         iconColor: '#E1221C',
        //         showCloseButton: true,
        //     })
        //     // setData()
        //     setSearch('')
        //     return
        // } else if (!resStore) {
        //     if (stores.hyper?.find(store => store[typeFormat] == searchValue)) findFormat = ('hyper')
        //     if (stores.super?.find(store => store[typeFormat] == searchValue)) findFormat = ('super')
        //     resStore = stores[findFormat]?.find(store => store[typeFormat] == searchValue)
        //     setStoreData({ ...storeData, format: findFormat })
        // }
        try {
            setIsLoading(true)
            await AuthService.refreshTokenPage(userId)
            // const date = storeData?.format == "hyper" ? new Date(new Date().setDate(new Date().getDate() - 1)) : dateSearch
            const res = await AirService.getHistory(storeData?.id, { asOfDate: dateSearch?.toISOString().split('T')[0] })
            // console.log(res.data)
            setData(res.data.history || [])
            setConfig(res.data.config)
            // localStorage.setItem("_id", resStore.id)
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.log(err)
            setData([])
        }
    }

    // useEffect(() => {
    //     const list = []
    //     switch (format) {
    //         case "mini":
    //             stores?.mini?.map(ele => {
    //                 list.push(ele[type])
    //             })
    //             break;
    //         case "hyper":
    //             stores?.hyper?.map(ele => {
    //                 list.push(ele[type])
    //             })
    //             break;
    //         case "super":
    //             stores?.super?.map(ele => {
    //                 list.push(ele[type])
    //             })
    //             break;
    //         default:
    //             break;
    //     }
    //     setStoreList([...new Set(list)])
    // }, [type, format])

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
            }
            if (Object.values(sort)[0] == 'asc') {
                return A - (B)
            } else {
                return B - (A)
            }

        })
        setDataSorted(data)
    }

    const [dataSorted, setDataSorted] = useState()
    useEffect(() => {
        const datas = data?.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp)
        })
        setDataSorted(datas)
    }, [data])

    const classMore = "bg-[#FFEBEB] text-danger p-1.5 my-2 max-w-[5rem] mx-auto font-bold rounded"
    const classLess = "bg-[#DDF0E3] text-[#32AA23] p-1.5 my-2 max-w-[5rem] mx-auto font-bold rounded"
    const [saving, setSaving] = useState(false)
    return (
        <div className='p-3 mt-5 mb-3'>
            <div className='text-2xl pl-4 font-semibold md:pl-6 flex items-center gap-2 cursor-default'>
                <div onClick={() => window.location.href = "/airCondition"} className='cursor-pointer'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825L13.425 18.6L12 20Z" fill="#565E6D" />
                    </svg>
                </div>
                <span className='text-[#B1B1B1]'>
                    ระบบปรับอากาศ /
                </span>
                ข้อมูลย้อนหลัง
            </div>
            <div className={`menus-bar ${permission ? 'menus-5' : 'menus-4'} font-bold`}>
                <button name='overall'
                    className={`${state == 'overall' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white max-xl:w-full xl:min-w-[250px]    max-lg:mx-auto transition-colors duration-100`}
                    onClick={setStateTab}>
                    ภาพรวม
                </button>
                <button name='daily'
                    className={`${state == 'daily' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2 rounded-md text-white max-xl:w-full xl:min-w-[250px]   max-lg:mx-auto transition-colors duration-100`}
                    onClick={setStateTab}>
                    รายวัน
                </button>
                <button name='notification'
                    className={`${state == 'notification' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white max-xl:w-full xl:min-w-[250px]    px-2 transition-colors duration-100 `}
                    onClick={setStateTab}>
                    การแจ้งเตือน
                </button>
                <button name='result' disabled
                    className={`${state == 'result' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white max-xl:w-full xl:min-w-[250px]    px-2 transition-colors duration-100 `}
                    onClick={setStateTab}>
                    ผลสรุป
                </button>
                {permission &&
                    <button name='KPI'
                        className={`${state == 'KPI' && 'bg-[#009B93]'} hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full max-w-[250px]    px-2 transition-colors duration-100 `}
                        onClick={setStateTab}>
                        ภาพรวมทุกสาขา
                    </button>
                }
            </div>
            {/* {selectedStore && <> */}
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl `}>
                <div className='p-3' id="storeData">
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

                        {/* <div className="md:grid lg:grid-cols-4 flex text-sm px-2 h-fit md:grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-center"> */}
                        <div className='lg:grid lg:grid-cols-4 text-sm flex justify-end sm:pt-3 lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-center'>
                            <div className='max-lg:hidden'></div>
                            <div className="lg:col-span-2 lg:ml-auto lg:max-w-[200px] min-w-[206px] items-end justify-end max-md:justify-items-start relative">
                                <DatePickerThai
                                    onChange={setDateSearch}
                                    selected={dateSearch}
                                    maxDate={lastDate}
                                />
                                <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[.3em]" />
                            </div>
                            <button className={`text-white bg-primary py-2 lg:px-10 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                                onClick={getData}
                                disabled={isLoading}
                            >
                                ค้นหา
                            </button>
                        </div>

                        {/* <div className="grid grid-cols-2 max-lg:grid-cols-2 text-sm px-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-center">
                        <div className='max-lg: hidden'></div>
                        <div className="max-lg:col-span-2 ml-auto max-w-[200px] items-end justify-end max-md:justify-items-start relative">
                            <DatePickerThai
                                // onChange={setDateStart}
                                selected={dateSearch}
                            // maxDate={lastDate}
                            />
                            <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[.3em]" />
                        </div>
                        <button className="text-white bg-primary py-2 px-8 rounded-md self-end shadow hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30"
                            onClick={getData}
                            disabled={isLoading}
                        >
                            ค้นหา
                        </button>
                    </div> */}
                    </div>
                </div>

                <ExportPage onSaving={setSaving} name="Air Noti"
                // arrayId={[{ table: "Notification", length: perPage, start: perPage * (page - 1) }]}
                />

            </div>
            {/* </>} */}

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
                <div id="tableHistory" className='p-3'>
                    <div className="grid">
                        <div className=" scrollbar overflow-x-auto">
                            <table width="100%" className="min-w-full table-fixed max-lg:min-w-[700px]">
                                {/* <col style={{ width: "6%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "8%" }} /> */}
                                <thead className="text-dark bg-table-head gap-0.5 text-sm">
                                    <tr>
                                        {storeData?.format !== "hyper" && <>
                                            <th className=" rounded-l-md py-2">
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="averageAirReturnTemp">
                                                    อุณหภูมิ AVG Air return (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="averageAirReturnTemp" className={`self-end ${sort?.averageAirReturnTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="averageAirReturnTemp" className={`self-end ${sort?.averageAirReturnTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="indoorTemp" >
                                                    อุณหภูมิภายในสาขา (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="indoorTemp" className={`self-end ${sort?.indoorTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="indoorTemp" className={`self-end ${sort?.indoorTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="" >
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="outdoorTemp">
                                                    อุณหภูมิภายนอกสาขา (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="outdoorTemp" className={`self-end ${sort?.outdoorTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="outdoorTemp" className={`self-end ${sort?.outdoorTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                        </>}
                                        {storeData?.format !== "mini" && <>
                                            <th className={`${storeData?.format == "hyper" && "rounded-l-md"}`}>
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="mallTemp">
                                                    อุณหภูมิพื้นที่ขาย (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="saleTemp" className={`self-end ${sort?.saleTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="saleTemp" className={`self-end ${sort?.saleTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="saleTemp">
                                                    อุณหภูมิร้านค้าเช่า (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="mallTemp" className={`self-end ${sort?.mallTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="mallTemp" className={`self-end ${sort?.mallTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="">
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="foodTemp">
                                                    อุณหภูมิศูนย์อาหาร (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="foodTemp" className={`self-end ${sort?.foodTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="foodTemp" className={`self-end ${sort?.foodTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="py-2">
                                                <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="outsideTemp">
                                                    อุณหภูมิภายนอกสาขา (°C)
                                                    <div className="flex self-center h-min ml-1">
                                                        <img id="outsideTemp" className={`self-end ${sort?.outsideTemp == 'desc' && "h-[14px]"} w-[4px]`} src='/img/sortUp.svg' />
                                                        <img id="outsideTemp" className={`self-end ${sort?.outsideTemp == 'asc' && "h-[14px]"} w-[4px]`} src='/img/sortDown.svg' />
                                                    </div>
                                                </div>
                                            </th>
                                        </>}
                                        <th className="rounded-r-md h-[3rem]">
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
                                        if (ind < perPage * page && ind + 1 > perPage * page - perPage) {
                                            const date = new Date(ele.timestamp).getTime() + new Date(ele.timestamp).getTimezoneOffset() * 60000
                                            return (
                                                <tr key={ind} className="odd:bg-white even:bg-table text-center">
                                                    {storeData?.format !== "hyper" && <>
                                                        <td className={`${storeData?.format == "mini" && "rounded-l-md"}`} >
                                                            <div className={`${ele?.averageAirReturnTemp == '-999' ? ""
                                                                : ele.averageAirReturnTemp <= config?.min && classLess} ${ele.averageAirReturnTemp >= config?.max && classMore}`}>
                                                                {ele?.averageAirReturnTemp == '-999' ? '-'
                                                                    : ele?.averageAirReturnTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`${ele?.indoorTemp == '-999' ? ""
                                                                : ele.indoorTemp <= config?.min && classLess} ${ele.indoorTemp >= config?.max && classMore}`}>
                                                                {ele?.indoorTemp == '-999' ? '-'
                                                                    : ele?.indoorTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td >
                                                            <div className={`${ele?.outdoorTemp == '-999' ? ""
                                                                : ele.outdoorTemp <= config?.min && classLess} ${ele.outdoorTemp >= config?.max && classMore}`}>
                                                                {ele?.outdoorTemp == '-999' ? '-'
                                                                    : ele?.outdoorTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                    </>}
                                                    {storeData?.format !== "mini" && <>
                                                        <td className={`${storeData?.format == "hyper" && "rounded-l-md"}`} >
                                                            <div className={`${ele?.saleTemp == '-999' ? ""
                                                                : ele.saleTemp <= config?.min && classLess} ${ele.saleTemp >= config?.max && classMore}`}>
                                                                {ele?.saleTemp == '-999' ? '-'
                                                                    : ele?.saleTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`${ele?.mallTemp == '-999' ? ""
                                                                : ele.mallTemp <= config?.min && classLess} ${ele.mallTemp >= config?.max && classMore}`}>
                                                                {ele?.mallTemp == '-999' ? '-'
                                                                    : ele?.mallTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`${ele?.foodTemp == '-999' ? ""
                                                                : ele.foodTemp <= config?.min && classLess} ${ele.foodTemp >= config?.max && classMore}`}>
                                                                {ele?.foodTemp == '-999' ? '-'
                                                                    : ele?.foodTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={`${ele?.outsideTemp == '-999' ? ""
                                                                : ele.outsideTemp <= config?.min && classLess} ${ele.outsideTemp >= config?.max && classMore}`}>
                                                                {ele?.outsideTemp == '-999' ? '-'
                                                                    : ele?.outsideTemp.toFixed(2)}
                                                            </div>
                                                        </td>
                                                    </>}

                                                    <td className="rounded-r-md py-3.5">
                                                        {/* {new Date(new Date(ele.timestamp).getTime() + new Date(ele.timestamp).getTimezoneOffset() * 60000) */}
                                                        {new Date(date).toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table >

                        </div>
                    </div>

                    {
                        isLoading
                            ? <div className="flex justify-center h-10 my-6 items-center"><Spinner size="lg" /></div>
                            : !data?.length
                                ?
                                <div className="flex justify-center h-10 rounded items-center my-6 text-dark">
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
                                                <option value='10'>10</option>
                                                <option value='20'>20</option>
                                                <option value='30'>30</option>
                                                <option value='50'>50</option>
                                                <option value='100'>100</option>
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

            <div className="sm:absolute sm:-mt-10 ml-2">
                <ExportTypes id={`tableHistory`}
                    csvData={dataSorted?.map((ele, i) => {
                        const objThai = {
                            'อุณหภูมิ AVG Air return (°C)': ele?.averageAirReturnTemp == '-999' ? '-' : ele?.averageAirReturnTemp.toFixed(2),
                            'อุณหภูมิภายในสาขา (°C)': ele?.indoorTemp == '-999' ? '-' : ele?.indoorTemp.toFixed(2),
                            'อุณหภูมิภายนอกสาขา (°C)': ele?.outdoorTemp == '-999' ? '-' : ele?.outdoorTemp.toFixed(2),
                            'อุณหภูมิพื้นที่ขาย (°C)': ele?.saleTemp == '-999' ? '-' : ele?.saleTemp.toFixed(2),
                            'อุณหภูมิร้านค้าเช่า (°C)': ele?.mallTemp == '-999' ? '-' : ele?.mallTemp.toFixed(2),
                            'อุณหภูมิศูนย์อาหาร (°C)': ele?.foodTemp == '-999' ? '-' : ele?.foodTemp.toFixed(2),
                            'อุณหภูมินอกสาขา (°C)': ele?.outsideTemp == '-999' ? '-' : ele?.outsideTemp.toFixed(2),
                            เวลาล่าสุด: new Date(
                                new Date(ele.timestamp).getTime() + new Date(ele.timestamp).getTimezoneOffset() * 60000
                            ).toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).split(',').join('')
                        }
                        if (storeData?.format == "hyper") {
                            delete objThai['อุณหภูมิ AVG Air return (°C)']
                            delete objThai['อุณหภูมิภายในสาขา (°C)']
                            delete objThai['อุณหภูมิภายนอกสาขา (°C)']
                          }
                          if (storeData?.format == "mini") {
                            delete objThai['อุณหภูมิพื้นที่ขาย (°C)']
                            delete objThai['อุณหภูมิร้านค้าเช่า (°C)']
                            delete objThai['อุณหภูมิศูนย์อาหาร (°C)']
                            delete objThai['อุณหภูมินอกสาขา (°C)']
                          }
                        return objThai
                    })}
                />
            </div>
        </div>
    )
}

export default AirHistory