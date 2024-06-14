import { useEffect, useState } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Spinner from "../spinner"
import EnergyService from "../../service/energy"
import IconGraph from "../../../public/img/icon-graph.svg"
import ExportTypes from "../exportTypes"

function EnergyWithLastYear({ isMini, options, ranks, storeData, isLoading, saving }) {
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    // const [isLoading, setIsLoading] = useState(true)
    const lastPage = Math.ceil(data?.length / perPage) || 1

    useEffect(() => {
        // (ranks?.filter(ele => !!ele.total))?.sort((b, a) => a.diffFromLastYearKwh - b.diffFromLastYearKwh)
        //     .concat((ranks?.filter(ele => !ele.total))?.sort((a, b) => a.costCenter - b.costCenter))?.map((ele, i) => {
        //         ele.index= i + 1 
        //     })
        const data = (ranks?.filter(ele => !!ele.sameTimeAtLastYear))?.sort((a, b) => b.diffFromLastYearKwh - a.diffFromLastYearKwh)
            .concat((ranks?.filter(ele => !ele.sameTimeAtLastYear))?.filter(ele => ele.total)?.sort((a, b) => b.total - a.total))
            .concat((ranks?.filter(ele => !ele.sameTimeAtLastYear))?.filter(ele => !ele.total)?.sort((a, b) => a.costCenter - b.costCenter)).map((ele, i) => {
                return { ...ele, index: i + 1 }
            })

        setData(data)
        // setIsLoading(false)
        setPage(1)
    }, [ranks])

    const myRank = data?.find(ele => ele.storeId == storeData.id)

    // useEffect(() => {
    //     initData()
    // }, [])

    // async function initData() {
    //     try {
    //         const res = await EnergyService.getRankingCard3(options)
    //         // setData(res.data.card2)
    //     } catch (error) {
    //         setIsLoading(false)
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     setIsLoading(false)
    // }, [data])
    const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

    const [sort, setSort] = useState()
    function sortData(e) {
        e.preventDefault()

        const label = e.target.id
        let sortVal
        if (sort && sort[label] == 'asc') {
            sortVal = 'desc'
        } else {
            sortVal = 'asc'
        }

        setSort({ [label]: sortVal })

        setData(data.sort((a, b) => {
            const A = a[label]
            const B = b[label]

            if (label == "storeName") {
                if (sortVal == 'asc') {
                    return A?.localeCompare(B)
                } else {
                    return B?.localeCompare(A)
                }
            } else if (label == "diffFromLastYearKwh") {
                if (sortVal == 'asc') {
                    return a.index - b.index
                } else {
                    return b.index - a.index
                }
            } else {
                if (sortVal == 'asc') {
                    return A - B
                } else {
                    return B - A
                }
            }
        }))
    }

    return (
        <div className={`bg-white ${saving != 'JPEG' ? 'shadow' : ''} border mx-2 rounded-xl mt-4 text-secondary`}>
            <div id='EnergyWithLastYear' className="p-3 pb-5">
                <div className="flex items-center">
                    <img src="icon/table.png" className="w-10 h-10" />
                    <p className="py-5 text-lg font-bold pl-2">การใช้พลังงานสูงสุดเมื่อเทียบกับปีที่แล้ว</p>
                </div>

                <div className="grid">
                    <div className={`overflow-x-auto scrollbar ${!isLoading && data && perPage >= 10 && "min-h-[500px]"}`}>
                        <table width="100%" className="min-w-[900px] text-sm w-full">
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: isMini ? "25%" : "18%" }} />
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            {!isMini && <col style={{ width: "7%" }} />}
                            {!isMini && <col style={{ width: "7%" }} />}
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <thead className="text-dark bg-table-head rounded-md">
                                <tr>
                                    <th onClick={sortData} className="rounded-l-md ">
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="index">
                                            อันดับ
                                            <div className="flex self-center h-min">
                                                <img id="index" className={`self-end ${sort?.index == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="index" className={`self-end ${sort?.index == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="storeNumber" >
                                            รหัสสาขา
                                            <div className="flex self-center h-min">
                                                <img id="storeNumber" className={`self-end ${sort?.storeNumber == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="storeNumber" className={`self-end ${sort?.storeNumber == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="storeName">
                                            ชื่อสาขา
                                            <div className="flex self-center h-min">
                                                <img id="storeName" className={`self-end ${sort?.storeName == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="storeName" className={`self-end ${sort?.storeName == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="countDay">
                                            จำนวนวัน
                                            <div className="flex self-center h-min">
                                                <img id="countDay" className={`self-end ${sort?.countDay == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="countDay" className={`self-end ${sort?.countDay == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="total">
                                            <div id="total">
                                                <p id="total">ทั้งหมด</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="total" className={`self-end ${sort?.total == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="total" className={`self-end ${sort?.total == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    {!isMini && <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="chiller">
                                            <div id="chiller">
                                                <p id="chiller">ระบบChiller</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="chiller" className={`self-end ${sort?.chiller == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="chiller" className={`self-end ${sort?.chiller == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>}
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="ahu">
                                            <div id="ahu">
                                                <p id="ahu">{isMini ? "ระบบปรับอากาศ" : "AHU"}</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="ahu" className={`self-end ${sort?.ahu == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="ahu" className={`self-end ${sort?.ahu == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="cabinet">
                                            <div id="cabinet">
                                                <p id="cabinet">ระบบตู้แช่</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="cabinet" className={`self-end ${sort?.cabinet == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="cabinet" className={`self-end ${sort?.cabinet == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    {!isMini && <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="lighting">
                                            <div id="lighting">
                                                <p id="lighting">ระบบแสงสว่าง</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="lighting" className={`self-end ${sort?.lighting == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="lighting" className={`self-end ${sort?.lighting == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>}
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="other">
                                            <div id="other">
                                                <p id="other">อื่นๆ</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="other" className={`self-end ${sort?.other == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="other" className={`self-end ${sort?.other == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center py-2`} id="sameTimeAtLastYear">
                                            ช่วงเวลาเดียวกันของปีที่แล้ว
                                            <div className="flex self-center h-min">
                                                <img id="sameTimeAtLastYear" className={`self-end ${sort?.sameTimeAtLastYear == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="sameTimeAtLastYear" className={`self-end ${sort?.sameTimeAtLastYear == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="diffFromLastYearKwh">
                                            <div id="diffFromLastYearKwh">
                                                <p id="diffFromLastYearKwh">ส่วนต่างของปีที่แล้ว</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="diffFromLastYearKwh" className={`self-end ${sort?.diffFromLastYearKwh == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="diffFromLastYearKwh" className={`self-end ${sort?.diffFromLastYearKwh == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} className="rounded-r-md py-2">
                                        <div className={`rounded-r-md flex gap-0.5 cursor-pointer justify-center items-center`} id="diffFromLastYearPercent">
                                            <div id="diffFromLastYearPercent">
                                                <p id="diffFromLastYearPercent">ส่วนต่างของปีที่แล้ว</p>
                                                (%)
                                            </div>
                                            <div className="flex self-center h-min pr-1">
                                                <img id="diffFromLastYearPercent" className={`self-end ${sort?.diffFromLastYearPercent == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="diffFromLastYearPercent" className={`self-end ${sort?.diffFromLastYearPercent == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            {!isLoading && !!data &&
                                <tbody>
                                    <tr className="bg-[#E3F2FE] text-center rounded-md" >
                                        <td className="rounded-l-md">
                                            {/* {data?.findIndex(ele => ele.storeId == storeData.id) >= 0 ? data?.findIndex(ele => ele.storeId == storeData.id) + 1 : '-'} */}
                                            {
                                                // (sort?.index || sort?.diffFromLastYearKwh) ? 
                                                myRank?.index || '-'
                                                // : data?.findIndex(ele => ele.storeId == storeData.id) >= 0
                                                //     ? data?.findIndex(ele => ele.storeId == storeData.id) + 1 : '-'
                                            }
                                            {/* {myRank?.index || '-'} */}
                                        </td>
                                        <td>
                                            {myRank?.storeNumber || storeData?.storeNumber}
                                        </td>
                                        <td className="text-left py-2">
                                            {myRank?.storeName || storeData?.storeName}
                                        </td>
                                        <td>
                                            {myRank?.countDay || '-'}
                                        </td>
                                        <td>
                                            {myRank?.total == '-999' ? '-' : myRank?.total?.toLocaleString('en-US', optionDigit) || '-'}
                                        </td>
                                        {!isMini &&
                                            <td>
                                                {myRank?.chiller == '-999' ? '-' : myRank?.chiller?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                        }
                                        <td>
                                            {myRank?.ahu == '-999' ? '-' : myRank?.ahu?.toLocaleString('en-US', optionDigit) || '-'}
                                        </td>
                                        <td>
                                            {myRank?.cabinet == '-999' ? '-' : myRank?.cabinet?.toLocaleString('en-US', optionDigit) || '-'}
                                        </td>
                                        {!isMini &&
                                            <td>
                                                {myRank?.lighting == '-999' ? '-' : myRank?.lighting?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                        }
                                        <td>
                                            {myRank?.other == '-999' ? '-' : myRank?.other?.toLocaleString('en-US', optionDigit) || '-'}
                                        </td>
                                        <td>
                                            {myRank?.sameTimeAtLastYear > 0 ?
                                                myRank?.sameTimeAtLastYear.toLocaleString('en-US', optionDigit) : '-'}
                                        </td>
                                        <td>
                                            {myRank?.sameTimeAtLastYear ? (myRank?.diffFromLastYearKwh)?.toLocaleString('en-US', optionDigit) : '-'}
                                        </td>
                                        <td className="rounded-r-md">
                                            <div className="p-1.5 my-2">
                                                {myRank?.sameTimeAtLastYear > 0
                                                    ? (myRank?.diffFromLastYearPercent)?.toLocaleString('en-US', optionDigit)
                                                    : '-'}
                                                {myRank?.sameTimeAtLastYear > 0 && '%'}
                                            </div>
                                        </td>
                                    </tr>
                                    {data?.map((ele, ind) => (
                                        ind < perPage * page && ind + 1 > perPage * page - (perPage) &&
                                        <tr key={ind} className={`odd:bg-white even:bg-table text-center rounded-md`}>
                                            <td className="rounded-l-md">
                                                {ele.index}
                                            </td>
                                            <td>
                                                {ele.storeNumber}
                                            </td>
                                            <td className="text-left py-2">
                                                {ele.storeName}
                                            </td>
                                            <td>
                                                {ele.countDay}
                                            </td>
                                            <td>
                                                {ele?.total == '-999' ? '-' : ele.total?.toLocaleString('en-US', optionDigit)}
                                            </td>
                                            {!isMini &&
                                                <td>
                                                    {ele?.chiller == '-999' ? '-' : ele.chiller?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                            }
                                            <td>
                                                {ele?.ahu == '-999' ? '-' : ele.ahu?.toLocaleString('en-US', optionDigit)}
                                            </td>
                                            <td>
                                                {ele?.cabinet == '-999' ? '-' : ele.cabinet?.toLocaleString('en-US', optionDigit)}
                                            </td>
                                            {!isMini &&
                                                <td>
                                                    {ele?.lighting == '-999' ? '-' : ele.lighting?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                            }
                                            <td>
                                                {ele?.other == '-999' ? '-' : ele.other?.toLocaleString('en-US', optionDigit)}
                                            </td>
                                            <td>
                                                {ele.sameTimeAtLastYear > 0 ?
                                                    ele.sameTimeAtLastYear.toLocaleString('en-US', optionDigit)
                                                    : '-'}
                                            </td>
                                            <td>
                                                {ele.sameTimeAtLastYear > 0 ?
                                                    (ele.diffFromLastYearKwh)?.toLocaleString('en-US', optionDigit)
                                                    : '-'}
                                            </td>
                                            <td className="rounded-r-md">
                                                <div className="p-1.5 rounded-md my-2 px-2"
                                                // className={`${ele.sameTimeAtLastYear ?
                                                //     (ele.diffFromLastYearPercent) < 0 ? "bg-danger text-white" : "bg-primary text-white"
                                                //     : ""} w-fit mx-auto p-2 rounded-md  my-1 px-2.5 w-[80%] max-w-[5em]`}
                                                >
                                                    {ele.sameTimeAtLastYear > 0 ?
                                                        `${(ele.diffFromLastYearPercent)?.toLocaleString('en-US', optionDigit)}%`
                                                        : '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>

            <div className="pb-3">
                {isLoading
                    ? <div className="flex justify-center items-center h-10 my-4"><Spinner /></div>
                    : !data?.length
                        ?
                        <div className="flex justify-center h-10 rounded items-center my-4 text-dark">
                            ไม่พบข้อมูล
                        </div>
                        : <>
                            <div className="flex flex-col text-xs">
                                <div className="self-end grid grid-cols-2">
                                    <div>
                                        จำนวนแถว ต่อ หน้า:
                                        <select
                                            value={perPage}
                                            onChange={e => setPerPage(e.target.value)}
                                            className="p-2 mx-1 border text-sm border-transparent text-[#000] rounded-lg cursor-pointer outline-0 focus:border-inherit"
                                        >
                                            <option value='5'>5</option>
                                            <option value='10'>10</option>
                                            <option value='20'>20</option>
                                            <option value='30'>30</option>
                                            <option value='50'>50</option>
                                        </select>
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        หน้า {page} จาก {lastPage}
                                        <div className="ml-3 mr-1 flex gap-2">
                                            <button className={`p-2.5 hover:bg-light rounded-full `} disabled={!(page > 1)}
                                                onClick={() => page > 1 && setPage(page - 1)}
                                            >
                                                <FiChevronLeft className="font-semibold" />
                                            </button>
                                            <button className={`p-2.5 hover:bg-light rounded-full `} disabled={!(lastPage > page)}
                                                onClick={() => lastPage > page && setPage(page + 1)}
                                            >
                                                <FiChevronRight className="font-semibold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:absolute sm:-mt-8">
                                <ExportTypes id={`tableEnergyWithLastYear`}
                                    csvData={data.map((ele, i) => {
                                        const objThai = {
                                            อันดับ: ele.index,
                                            รหัสสาขา: ele.storeNumber,
                                            ชื่อสาขา: ele.storeName,
                                            จำนวนวัน: ele.countDay,
                                            'ทั้งหมด (kWh)': ele.total == '-999' ? '' : ele.total?.toFixed(2),
                                            'ระบบChiller (kWh)': ele.chiller == '-999' ? '' : ele.chiller?.toFixed(2),
                                            'AHU (kWh)': ele.ahu == '-999' ? '' : ele.ahu?.toFixed(2),
                                            'ระบบปรับอากาศ (kWh)': ele.ahu == '-999' ? '' : ele.ahu?.toFixed(2),
                                            'ระบบตู้แช่ (kWh)': ele.cabinet == '-999' ? '' : ele.cabinet?.toFixed(2),
                                            'ระบบแสงสว่าง (kWh)': ele.lighting == '-999' ? '' : ele.lighting?.toFixed(2),
                                            'อื่นๆ (kWh)': ele.other == '-999' ? '' : ele.other?.toFixed(2),
                                            'ช่วงเวลาเดียวกันของปีที่แล้ว': ele.sameTimeAtLastYear?.toFixed(2) || "",
                                            'ส่วนต่างของปีที่แล้ว (kWh)': ele.sameTimeAtLastYear && ele.diffFromLastYearKwh?.toFixed(2) || "",
                                            'ส่วนต่างของปีที่แล้ว (%)': ele.sameTimeAtLastYear && ele.diffFromLastYearPercent?.toFixed(2) || "",
                                        }
                                        if (isMini) {
                                            delete objThai['ระบบChiller (kWh)']
                                            delete objThai['AHU (kWh)']
                                            delete objThai['ระบบแสงสว่าง (kWh)']
                                        } else {
                                            delete objThai['ระบบปรับอากาศ (kWh)']
                                        }
                                        return objThai
                                    })}
                                    dataLength={+perPage + 1}
                                    img="EnergyWithLastYear"
                                    dataStart={perPage * (page - 1)}
                                />
                            </div>
                        </>
                }
            </div>
            <div className="h-0 overflow-hidden">
                <div id={`tableEnergyWithLastYear`} className="px-3 ">
                    <div className="flex items-center" id={'title'}>
                        <img src="icon/table.png" className="w-10 h-10" />
                        <p className="py-5 text-lg font-bold pl-2">การใช้พลังงานสูงสุดเมื่อเทียบกับปีที่แล้ว</p>
                    </div>

                    <div className="grid">
                        <div className={`overflow-x-auto scrollbar max-h-[80vh] ${!isLoading && data && perPage >= 10 && "min-h-[500px]"}`}>
                            <table width="100%" className="min-w-[900px] text-sm w-full">
                                <col style={{ width: "4%" }} />
                                <col style={{ width: "5%" }} />
                                <col style={{ width: isMini ? "25%" : "18%" }} />
                                <col style={{ width: "4%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                {!isMini && <col style={{ width: "7%" }} />}
                                {!isMini && <col style={{ width: "7%" }} />}
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                <col style={{ width: "7%" }} />
                                <thead className="text-dark bg-table-head rounded-md" id={'thead'} >
                                    <tr>
                                        <th onClick={sortData} className="rounded-l-md ">
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="index">
                                                อันดับ
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="storeNumber" >
                                                รหัสสาขา
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="storeName">
                                                ชื่อสาขา
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="countDay">
                                                จำนวนวัน
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="total">
                                                <div id="total">
                                                    <p id="total">ทั้งหมด</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>
                                        {!isMini && <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="chiller">
                                                <div id="chiller">
                                                    <p id="chiller">ระบบChiller</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>}
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="ahu">
                                                <div id="ahu">
                                                    <p id="ahu">{isMini ? "ระบบปรับอากาศ" : "AHU"}</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="cabinet">
                                                <div id="cabinet">
                                                    <p id="cabinet">ระบบตู้แช่</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>
                                        {!isMini && <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="lighting">
                                                <div id="lighting">
                                                    <p id="lighting">ระบบแสงสว่าง</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>}
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="other">
                                                <div id="other">
                                                    <p id="other">อื่นๆ</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center py-2`} id="sameTimeAtLastYear">
                                                ช่วงเวลาเดียวกันของปีที่แล้ว
                                            </div>
                                        </th>
                                        <th onClick={sortData} >
                                            <div className={`flex gap-0.5 cursor-pointer justify-center items-center`} id="diffFromLastYearKwh">
                                                <div id="diffFromLastYearKwh">
                                                    <p id="diffFromLastYearKwh">ส่วนต่างของปีที่แล้ว</p>
                                                    (kWh)
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={sortData} className="rounded-r-md py-2">
                                            <div className={`rounded-r-md flex gap-0.5 cursor-pointer justify-center items-center`} id="diffFromLastYearPercent">
                                                <div id="diffFromLastYearPercent">
                                                    <p id="diffFromLastYearPercent">ส่วนต่างของปีที่แล้ว</p>
                                                    (%)
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                {!isLoading && !!data &&
                                    <tbody>
                                        <tr id='trow_0' className="bg-[#E3F2FE] text-center rounded-md" >
                                            <td className="rounded-l-md">
                                                {myRank?.index || '-'}
                                            </td>
                                            <td>
                                                {myRank?.storeNumber || storeData?.storeNumber}
                                            </td>
                                            <td className="text-left py-2">
                                                {myRank?.storeName || storeData?.storeName}
                                            </td>
                                            <td>
                                                {myRank?.countDay || '-'}
                                            </td>
                                            <td>
                                                {myRank?.total?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                            {!isMini &&
                                                <td>
                                                    {myRank?.chiller?.toLocaleString('en-US', optionDigit) || '-'}
                                                </td>
                                            }
                                            <td>
                                                {myRank?.ahu?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                            <td>
                                                {myRank?.cabinet?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                            {!isMini &&
                                                <td>
                                                    {myRank?.lighting?.toLocaleString('en-US', optionDigit) || '-'}
                                                </td>
                                            }
                                            <td>
                                                {myRank?.other?.toLocaleString('en-US', optionDigit) || '-'}
                                            </td>
                                            <td>
                                                {myRank?.sameTimeAtLastYear > 0 ?
                                                    myRank?.sameTimeAtLastYear.toLocaleString('en-US', optionDigit) : '-'}
                                            </td>
                                            <td>
                                                {myRank?.sameTimeAtLastYear ? (myRank?.diffFromLastYearKwh)?.toLocaleString('en-US', optionDigit) : '-'}
                                            </td>
                                            <td className="rounded-r-md">
                                                <div className="p-1.5 my-2">
                                                    {myRank?.sameTimeAtLastYear > 0
                                                        ? (myRank?.diffFromLastYearPercent)?.toLocaleString('en-US', optionDigit)
                                                        : '-'}
                                                    {myRank?.sameTimeAtLastYear > 0 && '%'}
                                                </div>
                                            </td>
                                        </tr>
                                        {data?.map((ele, ind) => (
                                            ind < perPage * page && ind + 1 > perPage * page - (perPage) &&
                                            <tr id={`trow_${ind + 1}`} key={ind} className={`odd:bg-white even:bg-table text-center rounded-md`}>
                                                <td className="rounded-l-md">
                                                    {ele.index}
                                                </td>
                                                <td>
                                                    {ele.storeNumber}
                                                </td>
                                                <td className="text-left py-2">
                                                    {ele.storeName}
                                                </td>
                                                <td>
                                                    {ele.countDay}
                                                </td>
                                                <td>
                                                    {ele.total?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                                {!isMini &&
                                                    <td>
                                                        {ele.chiller?.toLocaleString('en-US', optionDigit)}
                                                    </td>
                                                }
                                                <td>
                                                    {ele.ahu?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                                <td>
                                                    {ele.cabinet?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                                {!isMini &&
                                                    <td>
                                                        {ele.lighting?.toLocaleString('en-US', optionDigit)}
                                                    </td>
                                                }
                                                <td>
                                                    {ele.other?.toLocaleString('en-US', optionDigit)}
                                                </td>
                                                <td>
                                                    {ele.sameTimeAtLastYear > 0 ?
                                                        ele.sameTimeAtLastYear.toLocaleString('en-US', optionDigit)
                                                        : '-'}
                                                </td>
                                                <td>
                                                    {ele.sameTimeAtLastYear > 0 ?
                                                        (ele.diffFromLastYearKwh)?.toLocaleString('en-US', optionDigit)
                                                        : '-'}
                                                </td>
                                                <td className="rounded-r-md">
                                                    <div className="p-1.5 rounded-md my-2 px-2"
                                                    >
                                                        {ele.sameTimeAtLastYear > 0 ?
                                                            `${(ele.diffFromLastYearPercent)?.toLocaleString('en-US', optionDigit)}%`
                                                            : '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EnergyWithLastYear