import React, { useState, useEffect } from "react";
import AuthService from "../../service/authen";
import MonthName from "../../const/month";
import Spinner from "../spinner";
import ExportPages from "../exportKPI";
import EnergyService from "../../service/energy";
import Pagination from "../Pagination";
import { cn } from "../../helper/cn"
import { useNavigate } from "react-router-dom";
import { useUpdateEffect } from "ahooks";

function EnergyKPI({ userId, selectedStore, setSelectedStore, stores, onRowClick, formatKpi }) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(100)
    const lastPage = Math.ceil(data?.overview.numberOfStores / perPage) || 1
    const [saving, setSaving] = useState(false)
    const [compareType, setCompareType] = useState('Month')
    const dimension = 1
    useEffect(() => {
        getData()
    }, [compareType])

    const getData = async (options) => {
        try {
            setLoading(true)
            setIsLoading(true)
            await AuthService.refreshTokenPage(userId)
            const offset = perPage * page - perPage
            if (offset > data?.table?.length) {
                setPage(1)
                return
            }
            const response = await EnergyService.getKPI(userId, {
                compareBy: compareType,
                OffsetNo: perPage * page - perPage,
                LimitNo: perPage,
                // Order: order, Sort: sort, //\\ เรียงจากหน้าบ้าน
                dimension: dimension,
                storeFormatId: formatKpi,
                ...options
            })
            // console.log(response.data)
            setData(response.data)
            setIsLoading(false)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setData()
            setIsLoading(false)
        }
    }

    const [sort, setSort] = useState()
    const [order, setOrder] = useState()

    function sortData(e) {
        e.preventDefault()

        const label = e.target.id
        // setSort(label)
        // if (sort && order == 'asc') {
        //     setOrder('desc')
        //     getData({ Sort: label, Order: 'desc' })
        // } else {
        //     setOrder('asc')
        //     getData({ Sort: label, Order: 'asc' })
        // }
        let sortVal
        if (sort && sort[label] == 'asc') {
            sortVal = 'desc'
        } else {
            sortVal = 'asc'
        }

        setSort({ [label]: sortVal })
        setData({
            ...data,
            table: data?.table?.sort((a, b) => {
                const A = a[label]
                const B = b[label]

                if (label == "storeName" || label == "area") {
                    if (sortVal == 'asc') {
                        return A?.localeCompare(B)
                    } else {
                        return B?.localeCompare(A)
                    }
                } else {
                    if (sortVal == 'asc') {
                        return A - B
                    } else {
                        return B - A
                    }
                }
            })
        })
    }
    const firstMonth = new Date().getMonth() == 0
    const thisMonth = `${MonthName[new Date().getMonth()]} ${(`${new Date().getFullYear() + 543}`).slice(-2)}`
    const lastMonth = `${firstMonth ? MonthName[11] : MonthName[new Date().getMonth() - 1]} ${(`${new Date().getFullYear() + 543 - (firstMonth && 1)}`).slice(-2)}`
    const monthLastYear = `${MonthName[new Date().getMonth()]} ${(`${new Date().getFullYear() + 543 - 1}`).slice(-2)}`

    const optionDigit = { minimumFractionDigits: 0, maximumFractionDigits: dimension }
    const classBlue = "bg-primary/[.2] text-primary w-fit mx-auto p-1.5 rounded-md my-1 font-semibold"
    const classRed = "bg-[#FFEBEB] text-danger w-fit mx-auto p-1.5 rounded-md my-1 font-semibold"
    const classNoChange = "bg-[#F9BF00]/[.2] text-[#F9BF00] w-fit mx-auto p-1.5 px-2 rounded-md my-1 font-semibold"
    const overviewTable = data?.overview.table
    const optionDigitOverview = { minimumFractionDigits: 1, maximumFractionDigits: dimension }


    function compareDataClass(mainData, data1, data2) {
        if (mainData == -999 || !mainData) {
            return ''
        }
        else if (data1 != 0 && data2 != 0 && data1 == data2) {
            return classNoChange
        }
        else if (data1 > data2) {
            return classRed
        } else if (data1 < data2) {
            return classBlue
        } else {
            return ''
        }
    }


    function handleGoPageYearly(item) {
        onRowClick(item)
    }


    useUpdateEffect(() => {
        setPage(1)
        getData({ OffsetNo: "" });
    }, [formatKpi]);


    return (
        <>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl p-3`}>
                <div id="storeData" className="rounded-md p-2 mt-5">
                    <div className="md:flex justify-between items-center">
                        <div className="font-bold whitespace-nowrap pb-1">
                            ภาพรวมทุกสาขา (จำนวน {data?.overview.numberOfStores.toLocaleString([])} สาขา)
                        </div>
                        <div className="flex flex-wrap gap-2 !md:flex-1 justify-end">
                            <div className={`self-end ${compareType == 'Month' ? "btn-kpi-active" : "btn-kpi"} hover:font-bold`}
                                onClick={() => setCompareType('Month')}>
                                เปรียบเทียบเดือนที่แล้วกับเดือนปัจจุบัน
                            </div>
                            <div className={`self-end  ${compareType == 'Year' ? "btn-kpi-active" : "btn-kpi"} hover:font-bold`}
                                onClick={() => setCompareType('Year')}>
                                เปรียบเทียบเดือนเดียวกันของปีที่แล้ว
                            </div>
                        </div>
                    </div>

                </div>

                <div className="text-xs py-3 mx- 1 grid">
                    <div className="overflow-x-auto bg-white rounded-md scrollbar">
                        <table width="100%" className="table-fixed w-full min-w-[750px] text-dark text-[13px]">

                            <thead className="bg-table-head rounded-md">
                                <tr className=" ">
                                    <th className="pt-2.5">
                                        <p>จำนวนหน่วยเฉลี่ยต่อวันในเดือน {thisMonth} <div id="percentChange" className="inline-flex items-center justify-center">
                                            {/* <img id="percentChange" className={`self-end w-[4px] ${sort?.percentChange == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                            <img id="percentChange" className={`self-end w-[4px] ${sort?.percentChange == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' /> */}
                                        </div> </p>

                                        <div className="grid grid-cols-6 items-center mx-1.5">
                                            <th className="py-2 font-normal">ทั้งหมด</th>
                                            <th className="py-2 font-normal">ตู้แช่</th>
                                            <th className="py-2 font-normal">Chiller</th>
                                            <th className="py-2 font-normal">
                                                <p>AHU/AC</p>
                                            </th>
                                            <th className="py-2 font-normal">แสงสว่าง</th>
                                            <th className="py-2 font-normal">อื่นๆ</th>
                                        </div>
                                    </th>
                                    <th className="pt-2.5">
                                        <p>จำนวนหน่วยเฉลี่ยต่อวันในเดือน {compareType == 'Month' ? lastMonth : monthLastYear} <div id="thisMonth" className="inline-flex items-center justify-center">
                                            {/* <img id="thisMonth" className={`self-end w-[4px] ${sort?.thisMonth == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                            <img id="thisMonth" className={`self-end w-[4px] ${sort?.thisMonth == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' /> */}
                                        </div></p>
                                        <div className="grid grid-cols-6 items-center mx-1.5">
                                            <th className="py-2 font-normal">ทั้งหมด</th>
                                            <th className="py-2 font-normal">ตู้แช่</th>
                                            <th className="py-2 font-normal">Chiller</th>
                                            <th className="py-2 font-normal">
                                                <p>AHU/AC</p>
                                            </th>
                                            <th className="py-2 font-normal">แสงสว่าง</th>
                                            <th className="py-2 font-normal">อื่นๆ</th>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='text-center h-[3em]'>
                                {overviewTable &&
                                    <tr className={`text-center ${loading && 'animate-pulse bg-current/[.2]'} rounded-md`}>
                                        <td>
                                            <div className="grid grid-cols-6 items-center mx-1.5">
                                                <td className={`${overviewTable[1].total == 0 ? '' : overviewTable[1].total > overviewTable[0].total ? classRed : classBlue}`}>
                                                    {overviewTable[1].total > 0 ? overviewTable[1].total.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                                <td className={`${overviewTable[1].refrig == 0 ? '' : overviewTable[1].refrig > overviewTable[0].refrig ? classRed : classBlue}`}>
                                                    {overviewTable[1].refrig > 0 ? overviewTable[1].refrig.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                                <td className={`${overviewTable[1].chiller == 0 ? '' : overviewTable[1].chiller > overviewTable[0].chiller ? classRed : classBlue}`}>
                                                    {overviewTable[1].chiller > 0 ? overviewTable[1].chiller.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                                <td className={`${overviewTable[1].ahu == 0 ? '' : overviewTable[1].ahu > overviewTable[0].ahu ? classRed : classBlue}`}>
                                                    {overviewTable[1].ahu > 0 ? overviewTable[1].ahu.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                                <td className={`${overviewTable[1].lighting == 0 ? '' : overviewTable[1].lighting > overviewTable[0].lighting ? classRed : classBlue}`}>
                                                    {overviewTable[1].lighting > 0 ? overviewTable[1].lighting.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                                <td className={`${overviewTable[1].other == 0 ? '' : overviewTable[1].other > overviewTable[0].other ? classRed : classBlue}`}>
                                                    {overviewTable[1].other > 0 ? overviewTable[1].other.toLocaleString([], optionDigitOverview) : '-'}
                                                </td>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="grid grid-cols-6 items-center mx-1.5">
                                                <td>{overviewTable[0].total > 0 ? overviewTable[0].total.toLocaleString([], optionDigitOverview) : '-'}</td>
                                                <td>{overviewTable[0].refrig > 0 ? overviewTable[0].refrig.toLocaleString([], optionDigitOverview) : '-'}</td>
                                                <td>{overviewTable[0].chiller > 0 ? overviewTable[0].chiller.toLocaleString([], optionDigitOverview) : '-'}</td>
                                                <td>{overviewTable[0].ahu > 0 ? overviewTable[0].ahu.toLocaleString([], optionDigitOverview) : '-'}</td>
                                                <td>{overviewTable[0].lighting > 0 ? overviewTable[0].lighting.toLocaleString([], optionDigitOverview) : '-'}</td>
                                                <td>{overviewTable[0].other > 0 ? overviewTable[0].other.toLocaleString([], optionDigitOverview) : '-'}</td>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div >
            </div>

            <div className={`bg-white ${saving != 'JPEG' ? 'shadow' : ''} border mx-2 rounded-xl mt-4 pb-2`}>
                <div id="energyKPI" className="p-3 px-4">

                    <div className="text-xs pt-3 mx- 1 grid">
                        <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
                            <table width="100%" className="max-[1250px]:min-w-max table-fixed max-lg:w-[1000px] min-w-full text-dark text-[13px]">
                                <col style={{ width: "5%" }} />
                                <col style={{ width: "14%" }} />
                                <col style={{ width: "7.8%" }} />
                                <col style={{ width: "0.2%" }} />
                                <col style={{ width: "26%" }} />
                                <col style={{ width: "0.2%" }} />
                                <col style={{ width: "26%" }} />
                                <col style={{ width: "0.2%" }} />
                                <col style={{ width: "26%" }} />
                                <thead className="bg-table-head rounded-md">
                                    <tr className=" ">
                                        <th rowSpan="2" className="rounded-l-md "
                                            onClick={sortData}>
                                            <div id="storeNumber" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                รหัสสาขา
                                                <div id="storeNumber" className="inline-flex items-center justify-center">
                                                    <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th rowSpan="2" className=" "
                                            onClick={sortData}>
                                            <div id="storeName" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                ชื่อสาขา
                                                <div id="storeName" className="inline-flex items-center justify-center">
                                                    <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th rowSpan="2" className=""
                                            onClick={sortData}>
                                            <div id="area" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer">
                                                สังกัด
                                                <div id="area" className="inline-flex items-center justify-center">
                                                    <img id="area" className={`self-end w-[4px] ${sort?.area == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="area" className={`self-end w-[4px] ${sort?.area == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                        <th></th>
                                        <th className="pt-2.5">
                                            <p>% การเปลี่ยนแปลง ({thisMonth}  เทียบกับ {compareType == 'Month' ? lastMonth : monthLastYear})<div id="percentChange" className="inline-flex items-center justify-center">
                                                {/* <img id="percentChange" className={`self-end w-[4px] ${sort?.percentChange == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="percentChange" className={`self-end w-[4px] ${sort?.percentChange == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' /> */}
                                            </div> </p>

                                            <div className="grid grid-cols-6 items-center mx-1.5">
                                                <th className="py-2 font-normal">ทั้งหมด</th>
                                                <th className="py-2 font-normal">ตู้แช่</th>
                                                <th className="py-2 font-normal">Chiller</th>
                                                <th className="py-2 font-normal">
                                                    <p>AHU/AC</p>
                                                </th>
                                                <th className="py-2 font-normal">แสงสว่าง</th>
                                                <th className="py-2 font-normal">อื่นๆ</th>
                                            </div>
                                        </th>
                                        <th></th>
                                        <th className="pt-2.5">
                                            <p>เฉลี่ย ต่อวัน ในเดือน {thisMonth} <div id="thisMonth" className="inline-flex items-center justify-center">
                                                {/* <img id="thisMonth" className={`self-end w-[4px] ${sort?.thisMonth == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="thisMonth" className={`self-end w-[4px] ${sort?.thisMonth == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' /> */}
                                            </div></p>
                                            <div className="grid grid-cols-6 items-center mx-1.5">
                                                <th className="py-2 font-normal">ทั้งหมด</th>
                                                <th className="py-2 font-normal">ตู้แช่</th>
                                                <th className="py-2 font-normal">Chiller</th>
                                                <th className="py-2 font-normal">
                                                    <p>AHU/AC</p>
                                                </th>
                                                <th className="py-2 font-normal">แสงสว่าง</th>
                                                <th className="py-2 font-normal">อื่นๆ</th>
                                            </div>
                                        </th>
                                        <th></th>
                                        <th className="pt-2.5 rounded-r-md">
                                            <p>เฉลี่ย ต่อวัน ในเดือน {compareType == 'Month' ? lastMonth : monthLastYear} <div id="lastMonth" className="inline-flex items-center justify-center">
                                                {/* <img id="lastMonth" className={`self-end w-[4px] ${sort?.lastMonth == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="lastMonth" className={`self-end w-[4px] ${sort?.lastMonth == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' /> */}
                                            </div></p>
                                            <div className="grid grid-cols-6 items-center ml-1.5">
                                                <th className="py-2 font-normal">ทั้งหมด</th>
                                                <th className="py-2 font-normal">ตู้แช่</th>
                                                <th className="py-2 font-normal">Chiller</th>
                                                <th className="py-2 font-normal">
                                                    <p>AHU/AC</p>
                                                </th>
                                                <th className="py-2 font-normal">แสงสว่าง</th>
                                                <th className="py-2 font-normal">อื่นๆ</th>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {!isLoading &&
                                        data?.table?.map((ele, index) => {
                                            if (index < perPage * page && index + 1 > perPage * page - perPage) {
                                                return (
                                                    <tr key={index} className={`odd:bg-white even:bg-table text-center rounded-md`}>
                                                        <td className="rounded-l-md cursor-pointer" onClick={() => handleGoPageYearly(ele)}>{ele.storeNumber}</td>
                                                        <td className="py-2 text-left cursor-pointer" onClick={() => handleGoPageYearly(ele)}>{ele.storeName}</td>
                                                        <td className="py-2 text-left">{ele.area}</td>
                                                        <td></td>
                                                        {ele.avgMonth[0] &&
                                                            <td className="">
                                                                <div className="grid grid-cols-6 item-center mx-1.5">
                                                                    <div className={`${ele.avgMonth[1]?.total != 0 &&
                                                                        ele.avgMonth[0]?.total && (ele.avgMonth[1]?.total == ele.avgMonth[0].total ? classNoChange
                                                                            : ele.avgMonth[1]?.total > ele.avgMonth[0].total ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].total != 0 && ele.avgMonth[1].total
                                                                            ? `${ele.diffCompare?.total.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                    <div className={`${ele.avgMonth[1]?.refrig != 0 && ele.avgMonth[0]?.refrig != -999 &&
                                                                        ele.avgMonth[0]?.refrig && (ele.avgMonth[1]?.refrig == ele.avgMonth[0]?.refrig ? classNoChange
                                                                            : ele.avgMonth[1]?.refrig > ele.avgMonth[0]?.refrig ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].refrig != 0 && ele.avgMonth[1].refrig
                                                                            ? `${ele.diffCompare?.refrig.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                    <div className={`${ele.avgMonth[1]?.chiller != 0 && ele.avgMonth[0]?.chiller && ele.avgMonth[0]?.chiller != -999
                                                                        // && ele.avgMonth[0]?.chiller != ele.avgMonth[1]?.chiller 
                                                                        && (ele.avgMonth[1]?.chiller == ele.avgMonth[0]?.chiller ? classNoChange
                                                                            : ele.avgMonth[1]?.chiller > ele.avgMonth[0]?.chiller ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].chiller != 0 && ele.avgMonth[1].chiller
                                                                            ? `${ele.diffCompare?.chiller.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                    <div className={`${ele.avgMonth[1]?.ahu != 0 && ele.avgMonth[0]?.ahu && ele.avgMonth[0]?.ahu != -999
                                                                        // && ele.avgMonth[0]?.ahu != ele.avgMonth[1]?.ahu 
                                                                        && (ele.avgMonth[1]?.ahu == ele.avgMonth[0]?.ahu ? classNoChange
                                                                            : ele.avgMonth[1]?.ahu > ele.avgMonth[0]?.ahu ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].ahu != 0 && ele.avgMonth[1].ahu
                                                                            ? `${ele.diffCompare?.ahu.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                    <div className={`${ele.avgMonth[1]?.lighting != 0 && ele.avgMonth[0]?.lighting && ele.avgMonth[1]?.lighting != -999
                                                                        // && ele.avgMonth[0]?.lighting != ele.avgMonth[1]?.lighting 
                                                                        && (ele.avgMonth[1]?.lighting == ele.avgMonth[0]?.lighting ? classNoChange
                                                                            : ele.avgMonth[1]?.lighting > ele.avgMonth[0]?.lighting ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].lighting != 0 && ele.avgMonth[1].lighting
                                                                            ? `${ele.diffCompare?.lighting.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                    <div className={`${ele.avgMonth[1]?.other != 0 && ele.avgMonth[0]?.other && ele.avgMonth[0]?.other != -999
                                                                        // && ele.avgMonth[0]?.other != ele.avgMonth[1]?.other 
                                                                        && (ele.avgMonth[1]?.other == ele.avgMonth[0]?.other ? classNoChange
                                                                            : ele.avgMonth[1]?.other > ele.avgMonth[0]?.other ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 `}>
                                                                        {ele.avgMonth[0].other != 0 && ele.avgMonth[1].other
                                                                            ? `${ele.diffCompare?.other.toLocaleString([], optionDigit)}%` : '-'
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        }
                                                        {ele.avgMonth[0] ?
                                                            <td></td>
                                                            : <td>
                                                                <div className="grid grid-cols-6 mx-1.5">
                                                                    {[...Array(6).keys()].map((ele, i) => (
                                                                        <td key={i} className="text-center p-1.5 my-1">
                                                                            -
                                                                        </td>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        }

                                                        {ele.avgMonth?.map((arr, ind) => (
                                                            ind == 1 &&
                                                            <td key={ind}>
                                                                <div className={`grid grid-cols-6 mx-1.5 ${ind == 1 && "mr-0"}`}>
                                                                    {/* old function */}
                                                                    {/* <div className={`${ele.avgMonth[1]?.total != 0 && ele.avgMonth[0]?.total != 0
                                                                        && ele.avgMonth[1]?.total.toLocaleString([], optionDigit) != ele.avgMonth[0]?.total.toLocaleString([], optionDigit) &&
                                                                        (ele.avgMonth[1]?.total == ele.avgMonth[0]?.total ? classNoChange
                                                                            : ele.avgMonth[1]?.total > ele.avgMonth[0]?.total
                                                                                ? classRed : classBlue)}
                                                      w-fit mx-auto p-1.5 rounded-md my-1`}>
                                                                        {arr.total > 0 ? arr.total.toLocaleString([], optionDigit) : '-'}
                                                                    </div> */}

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.total, ele.avgMonth[1]?.total, ele.avgMonth[0]?.total))}>
                                                                        {arr.total > 0 ? arr.total.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.refrig, ele.avgMonth[1]?.refrig, ele.avgMonth[0]?.refrig))}>
                                                                        {arr.refrig > 0 ? arr.refrig.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.chiller, ele.avgMonth[1]?.chiller, ele.avgMonth[0]?.chiller))}>
                                                                        {arr.chiller > 0 ? arr.chiller.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.ahu, ele.avgMonth[1]?.ahu, ele.avgMonth[0]?.ahu))}>
                                                                        {arr.ahu > 0 ? arr.ahu.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.lighting, ele.avgMonth[1]?.lighting, ele.avgMonth[0]?.lighting))}>
                                                                        {arr.lighting > 0 ? arr.lighting.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.other, ele.avgMonth[1]?.other, ele.avgMonth[0]?.other))}>
                                                                        {arr.other > 0 ? arr.other.toLocaleString([], optionDigit) : '-'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        ))}
                                                        <td></td>
                                                        {!ele.avgMonth[0] && <td>
                                                            <div className="grid grid-cols-6 mx-1.5">
                                                                {[...Array(6).keys()].map((ele, i) => (
                                                                    <td key={i} className="text-center">
                                                                        -
                                                                    </td>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        }

                                                        {ele.avgMonth?.map((arr, ind) => (
                                                            ind == 0 &&
                                                            <td key={ind}>
                                                                <div className={`grid grid-cols-6 mx-1.5 mr-0`}>

                                                                    <div >
                                                                        {arr.total > 0 ? arr.total.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div >
                                                                        {arr.refrig > 0 ? arr.refrig.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div >
                                                                        {arr.chiller > 0 ? arr.chiller.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div >
                                                                        {arr.ahu > 0 ? arr.ahu.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div >
                                                                        {arr.lighting > 0 ? arr.lighting.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                    <div >
                                                                        {arr.other > 0 ? arr.other.toLocaleString([], optionDigit) : '-'}
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        ))
                                                        }
                                                        <td></td>
                                                        {!ele.avgMonth[0] && <td>
                                                            <div className="grid grid-cols-6 mx-1.5">
                                                                {[...Array(6).keys()].map((ele, i) => (
                                                                    <td key={i} className="text-center">
                                                                        -
                                                                    </td>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        }
                                                    </tr>
                                                )
                                            }
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div >
                </div >
                {
                    isLoading
                        ? <div className="flex justify-center items-center h-10 my-4 pb-3">< Spinner /></div >
                        : !data?.table?.length
                        &&
                        <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-5">
                            ไม่พบข้อมูล
                        </div>
                }

                {
                    !isLoading && !!data?.table?.length && <>
                        <Pagination
                            page={page}
                            setPage={setPage}
                            perPage={perPage}
                            setPerPage={setPerPage}
                            total={data?.table?.length}
                        />
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
                    </>
                }
                <div className="sm:absolute sm:-mt-8" hidden={isLoading}>
                    {/* <div className="lg:mt-2 relative sm:-mt-8" hidden={isLoading}> */}
                    <ExportPages onSaving={setSaving}
                        name={`energyKPI_by${compareType}`}
                        csvData={true}
                        getAllData={async () => {
                            // const res = await EnergyService.getKPI(userId, { compareBy: compareType })
                            // const all = res.data?.table?.map(ele => {
                            const all = data?.table?.map(ele => {
                                const objThai = {
                                    รหัสสาขา: ele.storeNumber,
                                    ชื่อสาขา: ele.storeName.split(',').join(''),
                                    สังกัด: ele.area.split(',').join(''),
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) ทั้งหมด`]: ele.avgMonth.length && ele.avgMonth[0].total != 0 && ele.avgMonth[1].total
                                        ? `${ele.diffCompare?.total.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) ตู้แช่`]: ele.avgMonth.length && ele.avgMonth[0].refrig != 0 && ele.avgMonth[1].refrig
                                        ? `${ele.diffCompare?.refrig.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) Chiller`]: ele.avgMonth.length && ele.avgMonth[0].chiller != 0 && ele.avgMonth[1].chiller
                                        ? `${ele.diffCompare?.chiller.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) AHU/AC`]: ele.avgMonth.length && ele.avgMonth[0].ahu != 0 && ele.avgMonth[1].ahu
                                        ? `${ele.diffCompare?.ahu.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) แสงสว่าง`]: ele.avgMonth.length && ele.avgMonth[0].lighting != 0 && ele.avgMonth[1].lighting
                                        ? `${ele.diffCompare?.lighting.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,
                                    [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${compareType == 'Month' ? lastMonth : monthLastYear}) อื่นๆ`]: ele.avgMonth.length && ele.avgMonth[0].other != 0 && ele.avgMonth[1].other
                                        ? `${ele.diffCompare?.other.toLocaleString([], optionDigitOverview).split(',').join('')}%` : ''
                                    ,


                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} ทั้งหมด`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.total > 0 && ele.avgMonth[1]?.total.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} ตู้แช่`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.refrig > 0 && ele.avgMonth[1]?.refrig.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} Chiller`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.chiller > 0 && ele.avgMonth[1]?.chiller.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} AHU/AC`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.ahu > 0 && ele.avgMonth[1]?.ahu.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} แสงสว่าง`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.lighting > 0 && ele.avgMonth[1]?.lighting.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} อื่นๆ`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[1]?.other > 0 && ele.avgMonth[1]?.other.toLocaleString([], optionDigit).split(',').join('') || "",

                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} ทั้งหมด`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.total > 0 && ele.avgMonth[0]?.total.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} ตู้แช่`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.refrig > 0 && ele.avgMonth[0]?.refrig.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} Chiller`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.chiller > 0 && ele.avgMonth[0]?.chiller.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} AHU/AC`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.ahu > 0 && ele.avgMonth[0]?.ahu.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} แสงสว่าง`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.lighting > 0 && ele.avgMonth[0]?.lighting.toLocaleString([], optionDigit).split(',').join('') || "",
                                    [`เฉลี่ย ต่อวัน ในเดือน ${compareType == 'Month' ? lastMonth : monthLastYear} อื่นๆ`]: ele?.avgMonth && ele.avgMonth[0] &&
                                        ele.avgMonth[0]?.other > 0 && ele.avgMonth[0]?.other.toLocaleString([], optionDigit).split(',').join('') || "",
                                }
                                return objThai
                            })
                            return all
                        }}
                    />
                </div>
            </div >
        </>
    )
}

export default EnergyKPI