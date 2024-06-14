import React, { useState, useEffect } from "react";
import AuthService from "../../service/authen";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import LightingService from "../../service/lighting";
import dayTh from "../../const/day";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Pagination from "../Pagination";
import { useUpdateEffect } from "ahooks";

function LightingKPI({ userId, selectedStore, setSelectedStore, stores, onRowClick, formatKpi }) {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState('')

    const [storeData, setStoreData] = useState(selectedStore)
    const [type, setType] = useState('costCenter')
    const [format, setFormat] = useState(selectedStore.format || 'mini')
    const [isMini, setIsMini] = useState(null);

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(100)
    const lastPage = Math.ceil(data?.total / perPage) || 1
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        setSelectedStore(storeData)
    }, [storeData])

    useEffect(() => {
        getData()
    }, [perPage, page])

    const [sort, setSort] = useState()
    const [order, setOrder] = useState()
    const getData = async (options) => {
        try {
            setLoading(true)
            const offset = perPage * page - perPage
            if (offset > data?.total) {
                setPage(1)
                return
            }
            await AuthService.refreshTokenPage(userId)
            const resData = await LightingService.getKPI(userId, {
                OffsetNo: perPage * page - perPage,
                LimitNo: perPage,
                Order: order,
                Sort: sort,
                storeFormatId: formatKpi,
                ...options
            })
            // console.log(resData.data)
            setData(resData.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setData()
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data) {
            setLoading(false)
        } else if (!storeData.storeName) {
            setLoading(false)
        }
        if (storeData.storeName) setSearch('')
    }, [data])

    function sortData(e) {
        e.preventDefault()

        const label = e.target.id
        let sortVal
        setSort(label)
        if (sort && order == 'asc') {
            setOrder('desc')
            getData({ Sort: label, Order: 'desc' })
        } else {
            setOrder('asc')
            getData({ Sort: label, Order: 'asc' })
        }
        return
        setSort({ [label]: sortVal })
        setData({
            ...data,
            table: data?.table.sort((a, b) => {
                const A = a[label]
                const B = b[label]

                if (label == "open" || label == "beforeOpen" || label == "close" || label == "closeNonAct") {
                    if (sortVal == 'asc') {
                        return A - B
                    } else {
                        return B - A
                    }
                } else {
                    if (sortVal == 'asc') {
                        return A?.localeCompare(B)
                    } else {
                        return B?.localeCompare(A)
                    }
                }
            })
        })
    }
    // console.log(data?.table.find(e => e.storeNumber == "01626"))

    function lastDateTimeTH(val) {
        const value = new Date(val).getTime() + new Date(val).getTimezoneOffset() * 60000
        const day = dayTh[(new Date(value).getDay())]
        const date = new Date(new Date(value)).toLocaleString('th-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        const time = new Date(value).toLocaleTimeString('th-GB', { hour: "2-digit", minute: "2-digit", hour12: false })
        return `วัน${day}, ${date}, ${time} น.`
    }

    useUpdateEffect(() => {
        setPage(1)
        getData({ OffsetNo: "" })
    }, [formatKpi]);


    return (
        <>
            <div className={`bg-white border -mt-10 mx-2 rounded-xl p-3`}>
                <div className="sm:flex justify-between mx-auto pt-10 p-3 font-bold lg:w-[95%] text-lg"
                    id="card_overall">
                    <div className=" whitespace-nowrap mr-10 py-2">
                        ภาพรวมทุกสาขา
                    </div>
                    <div className="grid md:grid-cols-4 grid-cols-2 w-full gap-y-3">
                        <div className="px-3 text-center mx-1.5 bg-[#3CD856]/[.07] text-[#3CD856] py-2 rounded-md">
                            <p className="font-normal">ก่อนเปิด</p>
                            <div className="text-2xl pt-1">
                                {!data
                                    ? <br />
                                    : data?.overview.beforeOpen + '%' || <br />
                                }
                            </div>
                        </div>
                        <div className="px-3 text-center mx-1.5 bg-[#4B9EF6]/[.07] text-[#4B9EF6] py-2 rounded-md">
                            <p className="font-normal">เปิด</p>
                            <div className="text-2xl pt-1">
                                {!data
                                    ? <br />
                                    : data?.overview.open + '%'
                                }
                            </div>
                        </div>
                        <div className="px-3 text-center mx-1.5 bg-[#00BCB4]/[.07] text-[#00BCB4] py-2 rounded-md">
                            <p className="font-normal">ปิด</p>
                            <div className="text-2xl pt-1">
                                {!data
                                    ? <br />
                                    : data?.overview.close + '%'
                                }
                            </div>
                        </div>
                        <div className="px-3 text-center mx-1.5 bg-warning/[.07] text-warning py-2 rounded-md">
                            <p className="font-normal">ปิด ไม่มีกิจกรรม</p>
                            <div className="text-2xl pt-1">
                                {!data
                                    ? <br />
                                    : data?.overview.closeNonAct + '%'
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={`bg-white border mx-2 rounded-xl mt-4 pb-2`}>
                <div id="" className="p-3 px-4 ">
                    <div className="text-right text-secondary py-2 text-xs">
                        {!data ? <br /> : `อัพเดทล่าสุด : ${lastDateTimeTH(data?.lastUpdate) || '-'}`}
                    </div>
                    <div className="pt-3 mx- 1 grid text-sm">
                        <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
                            <table width="100%" className="max-[1040px]:min-w-max table-fixed max-lg:min-w-[1000px] w-full text-dark">
                                <col style={{ width: "5%" }} />
                                <col style={{ width: "19%" }} />
                                <col style={{ width: "12%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "6%" }} />
                                <col style={{ width: "8%" }} />
                                <thead className="bg-table-head rounded-md">
                                    <tr className=" ">
                                        <th className="rounded-l-md "
                                            onClick={sortData}>
                                            <div id="store_number" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                รหัสสาขา
                                                <div id="store_number" className="inline-flex items-center justify-center">
                                                    <img id="store_number" className={`self-end w-[4px] ${sort?.store_number == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="store_number" className={`self-end w-[4px] ${sort?.store_number == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th rowSpan="3" className=" py-4"
                                            onClick={sortData}>
                                            <div id="name" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                ชื่อสาขา
                                                <div id="name" className="inline-flex items-center justify-center">
                                                    <img id="name" className={`self-end w-[4px] ${sort?.name == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="name" className={`self-end w-[4px] ${sort?.name == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th rowSpan="2" onClick={sortData}>
                                            <div id="parent" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                สังกัด
                                                <div id="parent" className="inline-flex items-center justify-center">
                                                    <img id="parent" className={`self-end w-[4px] ${sort?.parent == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="parent" className={`self-end w-[4px] ${sort?.parent == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th >
                                            <div id="openTime" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-defult">
                                                สาขาเปิด
                                                {/* <div id="openTime" className="inline-flex items-center justify-center">
                                                    <img id="openTime" className={`self-end w-[4px] ${sort?.openTime == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="openTime" className={`self-end w-[4px] ${sort?.openTime == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                        <th >
                                            <div id="closeTime" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-defult">
                                                สาขาปิด
                                                {/* <div id="closeTime" className="inline-flex items-center justify-center">
                                                    <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="closeTime" className={`self-end w-[4px] ${sort?.closeTime == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                        <th className="py-3" >
                                            <div id="beforeOpen" className="flex items-center justify-center gap-0.5 cursor-defult">
                                                ก่อนเปิด
                                                {/* <div id="beforeOpen" className="inline-flex items-center justify-center">
                                                    <img id="beforeOpen" className={`self-end w-[4px] ${sort?.beforeOpen == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="beforeOpen" className={`self-end w-[4px] ${sort?.beforeOpen == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                        <th className="py-3" >
                                            <div id="open" className="flex items-center justify-center gap-0.5 cursor-defult">
                                                เปิด
                                                {/* <div id="open" className="inline-flex items-center justify-center">
                                                    <img id="open" className={`self-end w-[4px] ${sort?.open == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="open" className={`self-end w-[4px] ${sort?.open == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                        <th className="py-3" >
                                            <div id="close" className="flex items-center justify-center gap-0.5 cursor-defult">
                                                ปิด
                                                {/* <div id="close" className="inline-flex items-center justify-center">
                                                    <img id="close" className={`self-end w-[4px] ${sort?.close == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="close" className={`self-end w-[4px] ${sort?.close == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                        <th className="rounded-r-md py-3" >
                                            <div id="closeNonAct" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-defult">
                                                ปิด ไม่มีกิจกรรม
                                                {/* <div id="closeNonAct" className="inline-flex items-center justify-center">
                                                    <img id="closeNonAct" className={`self-end w-[4px] ${sort?.closeNonAct == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="closeNonAct" className={`self-end w-[4px] ${sort?.closeNonAct == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div> */}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {!loading &&
                                        data?.table?.map((ele, index) => {
                                            // if (index < perPage * page && index + 1 > perPage * page - perPage) {
                                            const is24h = ele.openTime.startsWith("24")
                                            return (
                                                <tr key={index} className={`odd:bg-white even:bg-table text-center ${loading && 'animate-pulse bg-current/[.2]'} rounded-md`}>
                                                    <td className="rounded-l-md cursor-pointer" onClick={() => onRowClick(ele)}>{ele.storeNumber}</td>
                                                    <td className="py-2 text-left cursor-pointer" onClick={() => onRowClick(ele)}>{ele.storeName}</td>
                                                    <td className="text-left py-2">{ele.area}</td>
                                                    <td>{is24h ? "00:00" : ele.openTime && (ele.openTime == 0 ? '00:00' : '0' + ele.openTime).slice(-5)}</td>
                                                    <td>{is24h ? "00:00" : ele.closeTime && (ele.closeTime == 0 ? '00:00' : '0' + ele.closeTime).slice(-5)}</td>
                                                    <td>{ele?.beforeOpen === -999 ? '-' : `${ele.beforeOpen.toFixed(2)}%`}</td>
                                                    <td>{ele?.open === -999 ? '-' : `${ele.open.toFixed(2)}%`}</td>
                                                    <td>{ele?.close === -999 ? '-' : `${ele.close.toFixed(2)}%`}</td>
                                                    <td className="rounded-l-md py-1.5">
                                                        {ele?.closeNonAct === -999 ?
                                                            <div className="p-1.5 min-h-[3rem] grid place-items-center items-center">-</div> :
                                                            <div className={` w-fit mx-auto p-1.5 min-w-[3.5rem] rounded font-bold 
                                                        ${ele.closeNonAct > ele.config.highlight?.max ? "card-red" : "text-[#32AA23] bg-[#DDF0E3]"}`}>{ele.closeNonAct.toFixed(2)}%</div>}
                                                        <p className="mt-1" hidden={!ele.config.closeNonAct || ele?.closeNonAct === -999}>
                                                            ({ele.config.closeNonAct?.startTime}-{ele.config.closeNonAct?.endTime})
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                            // }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {loading
                    ? <div className="flex justify-center items-center h-10 my-4 pb-3"><Spinner /></div>
                    : !data?.table?.length
                    &&
                    <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
                        ไม่พบข้อมูล
                    </div>
                }
                {!loading && !!data?.table?.length && <>
                    {/* <div className="flex flex-col text-xs justify-between">
                        <div className="self-end grid grid-cols-2">
                            <div>
                                จำนวนแถว ต่อ หน้า:
                                <select
                                    value={perPage}
                                    onChange={e => setPerPage(e.target.value)}
                                    className="p-2 mr-1 border text-sm border-0 text-[#000] rounded-lg cursor-pointer outline-0"
                                >
                                    <option value='10'>10</option>
                                    <option value='20'>20</option>
                                    <option value='30'>30</option>
                                    <option value='50'>50</option>
                                    <option value='100'>100</option>
                                </select>
                            </div>
                            <div className="ml-auto flex items-center">
                                หน้า {page} จาก {lastPage}
                                <div className="ml-3 mr-1 flex gap-2">
                                    <button className={`p-2.5 hover:bg-light rounded-full ${!(page > 1) && 'cursor-default'}`}
                                        onClick={() => page > 1 && setPage(page - 1)}
                                    >
                                        <FiChevronLeft className="font-semibold" />
                                    </button>
                                    <button className={`p-2.5 hover:bg-light rounded-full ${!(page < lastPage) && 'cursor-default'}`}
                                        onClick={() => page < lastPage && setPage(page + 1)}
                                    >
                                        <FiChevronRight className="font-semibold" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <Pagination
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        total={data?.total}
                    />
                </>
                }
                <div className="sm:absolute sm:-mt-8" hidden={loading}>
                    <ExportPages name="lightingKPI" onSaving={setSaving}
                        getAllData={async () => {
                            const res = await LightingService.getKPI(userId, { LimitNo: data?.total })

                            const all = res.data?.table?.map((ele, i) => {
                                const is24h = ele.openTime.startsWith("24")
                                const objThai = {
                                    รหัสสาขา: ele.storeNumber,
                                    ชื่อสาขา: ele.storeName.split(',').join(''),
                                    สังกัด: ele.area.split(',').join(''),
                                    สาขาเปิด: is24h ? "00:00" : ele.openTime && (ele.openTime == 0 ? '00:00' : '0' + ele.openTime).slice(-5),
                                    สาขาปิด: is24h ? "00:00" : ele.closeTime && (ele.closeTime == 0 ? '00:00' : '0' + ele.closeTime).slice(-5),
                                    ก่อนเปิด: ele.beforeOpen === -999 ? '-' : ele.beforeOpen,
                                    เปิด: ele.open === -999 ? '-' : ele.open,
                                    ปิด: ele.close === -999 ? '-' : ele.close,
                                    "ปิด ไม่มีกิจกรรม": ele.closeNonAct === -999 ? '-' : ele.closeNonAct,
                                }

                                return objThai
                            })
                            return (all)
                        }}
                        csvData={true}
                    />
                </div>
            </div>
        </>
    )
}

export default LightingKPI