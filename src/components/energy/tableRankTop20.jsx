import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Spinner from "../spinner";
import ExportTypes from "../exportTypes";
import IconGraph from "../../../public/img/icon-graph.svg"

function TableRankTop20({ ranks, isLoading, storeData, isMini }) {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const lastPage = Math.ceil(ranks?.length / perPage) || 1

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     //     if (data.length) setLoading(true)
    //     //     // onChangePaging(page, perPage)
    //     console.log(page, perPage)
    // }, [page, perPage])

    useEffect(() => {
        (ranks?.filter(ele => ele.total).sort((a, b) => b.total - a.total)
            .concat(ranks?.filter(rank => !rank.total).sort((a, b) => a.costCenter - b.costCenter))
        )?.map((ele, i) => {
            ele.index = i + 1
        })
        setData(ranks?.sort((a, b) => a.index - b.index))
        setLoading(false)
        setPage(1)
    }, [ranks])
    const myRank = data?.find(ele => ele.storeId == storeData.id)
    const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    const myRankTotal = (myRank?.ahu || 0) + (myRank?.cabinet || 0) + (myRank?.other || 0) + (isMini ? 0 : myRank?.chiller) + (isMini ? 0 : myRank?.lighting)

    const [sort, setSort] = useState()
    function sortData(e) {
        e.preventDefault()
        // if (isLoading) return
        const label = e.target.id
        let sortVal
        if (sort && sort[label] == 'asc') {
            sortVal = 'desc'
            // setSort({ [label]: 'desc' })
        } else {
            sortVal = 'asc'
            // setSort({ [label]: 'asc' })
        }

        setSort({ [label]: sortVal })

        setData(ranks.sort((a, b) => {
            const A = a[label]
            const B = b[label]

            if (label == "storeName") {
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
        }))
    }

    return (
        <>
            <div className="p-3 pb-5" id="TotalEnergyRank">
                <div className="flex items-center">
                    <img src="icon/table.png" className="w-10 h-10" />

                    <p className="py-5 text-lg font-bold pl-2 text-secondary">ปริมาณการใช้พลังงานไฟฟ้าเรียงตามลำดับมากไปน้อย</p>
                </div>
                <div className="grid">
                    <div className={`scrollbar overflow-x-auto  ${!isLoading && perPage >= 10 && data && "min-h-[500px]"}`}>
                        {/* <table className={`md:min-w-max text-sm md:table-fixed ${data?.length ? "min-w-max" : "min-w-[768px]"}`}> */}
                        <table width="100%" className="min-w-[900px] text-sm w-full">
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: isMini ? "20%" : "13%" }} />
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "7%" }} />
                            {!isMini && <col style={{ width: "7%" }} />}
                            {!isMini && <col style={{ width: "7%" }} />}
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "10%" }} />
                            <thead className="text-dark bg-table-head rounded-md">
                                <tr>
                                    <th className="rounded-l-md "
                                    >
                                        <div id="index" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                                            onClick={sortData}>
                                            อันดับ
                                            <div className="inline-flex self-center h-min ">
                                                <img id="index" className={`self-end w-[4px] ${sort?.index == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="index" className={`self-end w-[4px] ${sort?.index == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} >
                                        <div id="costCenter" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            Cost center
                                            <div id="costCenter" className="inline-flex items-center justify-center">
                                                <img id="costCenter" className={`self-end w-[4px] ${sort?.costCenter == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="costCenter" className={`self-end w-[4px] ${sort?.costCenter == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData}>
                                        <div id="storeNumber" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            รหัสสาขา
                                            <div id="storeNumber" className="inline-flex items-center justify-end">
                                                <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData}>
                                        <div id="storeName" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            ชื่อสาขา
                                            <div className="flex self-center h-min">
                                                <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData}>
                                        <div id="countDay" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            จำนวนวัน
                                            <div className="flex self-center h-min">
                                                <img id="countDay" className={`self-end w-[4px] ${sort?.countDay == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="countDay" className={`self-end w-[4px] ${sort?.countDay == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData}>
                                        <div id="total" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            <div id="total">
                                                <p id="total">
                                                    ทั้งหมด
                                                </p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="total" className={`self-end w-[4px] ${sort?.total == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="total" className={`self-end w-[4px] ${sort?.total == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    {!isMini &&
                                        <th onClick={sortData}>
                                            <div id="chiller" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                <div id="chiller">
                                                    <p id="chiller">ระบบChiller</p> (kWh)
                                                </div>
                                                <div className="flex self-center h-min">
                                                    <img id="chiller" className={`self-end w-[4px] ${sort?.chiller == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="chiller" className={`self-end w-[4px] ${sort?.chiller == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                    }
                                    <th onClick={sortData}>
                                        <div id="ahu" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            <div id="ahu">
                                                <p id="ahu">{isMini ? "ระบบปรับอากาศ" : "AHU"}</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="ahu" className={`self-end w-[4px] ${sort?.ahu == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="ahu" className={`self-end w-[4px] ${sort?.ahu == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData}>
                                        <div id="cabinet" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            <div id="cabinet">
                                                <p id="cabinet">ระบบตู้แช่</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="cabinet" className={`self-end w-[4px] ${sort?.cabinet == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="cabinet" className={`self-end w-[4px] ${sort?.cabinet == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    {!isMini && <>
                                        <th onClick={sortData}>
                                            <div id="lighting" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                <div id="lighting">
                                                    <p id="lighting">ระบบแสงสว่าง</p>
                                                    (kWh)
                                                </div>
                                                <div className="flex self-center h-min">
                                                    <img id="lighting" className={`self-end w-[4px] ${sort?.lighting == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                    <img id="lighting" className={`self-end w-[4px] ${sort?.lighting == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                </div>
                                            </div>
                                        </th>
                                    </>}
                                    <th onClick={sortData}>
                                        <div id="other" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            <div id="other">
                                                <p id="other">อื่นๆ</p>
                                                (kWh)
                                            </div>
                                            <div className="flex self-center h-min">
                                                <img id="other" className={`self-end w-[4px] ${sort?.other == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="other" className={`self-end w-[4px] ${sort?.other == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th onClick={sortData} className="">
                                        <div id="budget" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                            <div id="budget">
                                                <p id="budget">งบประมาณ</p>
                                                (kWh)
                                            </div>
                                            <div className="flex item-center h-min">
                                                <img id="budget" className={`self-end w-[4px] ${sort?.budget == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="budget" className={`self-end w-[4px] ${sort?.budget == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="rounded-r-md py-2"
                                        onClick={sortData}>
                                        <div id="actualVsBudget" className="flex items-center justify-center cursor-pointer mr-1.5">
                                            <div id="actualVsBudget" >
                                                <p id="actualVsBudget">ใช้งานจริง เทียบกับ งบประมาณ</p>
                                                (kWh)
                                            </div>
                                            <div className="flex items-center h-min">
                                                <img id="actualVsBudget" className={`self-end w-[4px] ${sort?.actualVsBudget == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                <img id="actualVsBudget" className={`self-end w-[4px] ${sort?.actualVsBudget == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-[#E3F2FE] text-center rounded-md" hidden={isLoading || !data}>
                                    <td className="rounded-l-md">
                                        {
                                            // (sort?.index || sort?.total) ? 
                                            myRank?.index || '-'
                                            // : data?.findIndex(ele => ele.storeId == storeData.id) >= 0
                                            //     ? data?.findIndex(ele => ele.storeId == storeData.id) + 1 : '-'
                                        }
                                    </td>
                                    <td>{myRank?.costCenter || storeData.costCenter}</td>
                                    <td>{myRank?.storeNumber || storeData.storeNumber}</td>
                                    <td className="text-left py-2">{myRank?.storeName || storeData.storeName}</td>
                                    <td>{myRank?.countDay || '-'}</td>
                                    <td>{myRank
                                        ? myRank?.total == '-999' ? '-' :
                                            myRank?.total?.toLocaleString('en-US', optionDigit)
                                        : '-'}
                                    </td>
                                    {!isMini && <>
                                        <td>{myRank?.chiller == '-999' ? '-' :
                                            myRank?.chiller?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    </>}
                                    <td>{myRank?.ahu == '-999' ? '-' : myRank?.ahu?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    <td>{myRank?.cabinet == '-999' ? '-' : myRank?.cabinet?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    {!isMini && <>
                                        <td>{myRank?.lighting == '-999' ? '-' : myRank?.lighting?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    </>}
                                    <td>{myRank?.other == '-999' ? '-' : myRank?.other?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    <td>{myRank?.budget == '-999' ? '-' : myRank?.budget?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                    <td className="rounded-r-md">
                                        <div className={`${myRank?.budget ?
                                            (myRank?.actualVsBudget < 0 ? "bg-[#FFEBEB] text-danger" : "bg-[#DDF0E3] text-[#32AA23]")
                                            : ""} w-fit mx-auto px-2 py-1.5 rounded-md  my-2 min-w-[5rem] font-bold`}>
                                            {myRank?.budget && (myRank?.actualVsBudget)?.toLocaleString('en-US', optionDigit) || '-'}
                                        </div>
                                    </td>
                                </tr>
                                {!isLoading &&
                                    data?.map((rank, index) => {
                                        // issue Total value == only 1 toggle system when click that sort
                                        const total = rank.ahu + rank.cabinet + rank.other + (isMini ? 0 : rank.chiller) + (isMini ? 0 : rank.lighting)
                                        if (index < perPage * page && index + 1 > perPage * page - perPage) {
                                            return (
                                                <tr key={index} className={`odd:bg-white even:bg-table text-center ${loading && 'animate-pulse bg-current/[.2]'} rounded-md`}>
                                                    <td className="rounded-l-md">{rank.index}</td>
                                                    <td>{rank.costCenter}</td>
                                                    <td>{rank.storeNumber}</td>
                                                    <td className="text-left py-2">{rank.storeName}</td>
                                                    <td>{rank.countDay}</td>
                                                    <td>
                                                        {rank?.total == '-999' ? '-' : rank.total?.toLocaleString('en-US', optionDigit) || '-'}
                                                    </td>
                                                    {!isMini && <>
                                                        <td>{rank?.chiller == '-999' ? '-' : rank.chiller?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    </>}
                                                    <td>{rank?.ahu == '-999' ? '-' : rank.ahu?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    <td>{rank?.cabinet == '-999' ? '-' : rank.cabinet?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    {!isMini && <>
                                                        <td>{rank?.lighting == '-999' ? '-' : rank.lighting?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    </>}
                                                    <td>{rank?.other == '-999' ? '-' : rank.other?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    <td>{rank.budget?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                    <td className="rounded-r-md"
                                                    >
                                                        <div className={`${rank.budget > 0 ? rank.actualVsBudget < 0 ? "bg-[#FFEBEB] text-danger" : "bg-[#DDF0E3] text-[#32AA23]"
                                                            : ''} w-fit mx-auto px-2 p-1.5 rounded-md my-2 min-w-[5rem] font-semibold`}>
                                                            {rank.budget
                                                                ? (rank.actualVsBudget)?.toLocaleString('en-US', optionDigit)
                                                                : '-'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })
                                }
                            </tbody>
                        </table>

                    </div >
                </div>
            </div>
            <div className="pb-3">
                {isLoading
                    ? <div className="flex justify-center items-center h-10 my-4 pb-3"><Spinner /></div>
                    : !data?.length
                    &&
                    <div className="flex justify-center h-10 rounded items-center my-4 text-dark pb-3">
                        ไม่พบข้อมูล
                    </div>
                }
                {!isLoading && !!data?.length && <>
                    <div className="flex flex-col text-xs justify-between">
                        <div className="self-end grid grid-cols-2">
                            <div>
                                จำนวนแถว ต่อ หน้า:
                                <select
                                    value={perPage}
                                    onChange={e => setPerPage(e.target.value)}
                                    className="p-2 mr-1 border text-sm border-0 text-[#000] rounded-lg cursor-pointer outline-0"
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
                    </div>

                    <div className="sm:absolute sm:-mt-8">
                        <ExportTypes id={`tableTotalEnergyRank`}
                            csvData={data.map((ele, i) => {
                                const objThai = {
                                    อันดับ: ele.index,
                                    'Cost center': ele.costCenter,
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
                                    'งบประมาณ': ele.budget == '-999' ? '' : ele.budget?.toFixed(2) || "",
                                    'ใช้งานจริง เทียบกับ งบประมาณ (kWh)': ele.budget && ele.actualVsBudget?.toFixed(2) || "",
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
                            img="TotalEnergyRank"
                            dataStart={perPage * (page - 1)}
                        />
                    </div>
                    <div className="h-0 overflow-hidden">
                        <div id={`tableTotalEnergyRank`} className="px-3 ">
                            <div className="flex items-center" id={'title'}>
                                <img src="icon/table.png" className="w-10 h-10" />
                                <p className="py-5 text-lg font-bold pl-2 text-secondary">ปริมาณการใช้พลังงานไฟฟ้าเรียงตามลำดับมากไปน้อย</p>
                            </div>
                            <div className="grid">
                                <div className={`scrollbar overflow-x-auto`}>
                                    <table id={'table'} width="100%" className="min-w-[900px] text-sm w-full">
                                        <col style={{ width: "4%" }} />
                                        <col style={{ width: "5%" }} />
                                        <col style={{ width: "5%" }} />
                                        <col style={{ width: isMini ? "20%" : "13%" }} />
                                        <col style={{ width: "4%" }} />
                                        <col style={{ width: "7%" }} />
                                        <col style={{ width: "7%" }} />
                                        <col style={{ width: "7%" }} />
                                        <col style={{ width: "7%" }} />
                                        {!isMini && <col style={{ width: "7%" }} />}
                                        {!isMini && <col style={{ width: "7%" }} />}
                                        <col style={{ width: "7%" }} />
                                        <col style={{ width: "10%" }} />
                                        <thead className="text-dark bg-table-head rounded-md" id={'thead'}>
                                            <tr>
                                                <th className="rounded-l-md "
                                                >
                                                    <div id="index" className="rounded-l-md flex items-center justify-center gap-0.5 cursor-pointer"
                                                        onClick={sortData}>
                                                        อันดับ
                                                        {/* <div className="inline-flex self-center h-min ">
                                                        <img id="index" className={`self-end w-[4px] ${sort?.index == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="index" className={`self-end w-[4px] ${sort?.index == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData} >
                                                    <div id="costCenter" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        Cost center
                                                        {/* <div id="costCenter" className="inline-flex items-center justify-center">
                                                        <img id="costCenter" className={`self-end w-[4px] ${sort?.costCenter == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="costCenter" className={`self-end w-[4px] ${sort?.costCenter == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData}>
                                                    <div id="storeNumber" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        รหัสสาขา
                                                        {/* <div id="storeNumber" className="inline-flex items-center justify-end">
                                                        <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="storeNumber" className={`self-end w-[4px] ${sort?.storeNumber == 'asc' && "h-[14px]"} `} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData}>
                                                    <div id="storeName" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        ชื่อสาขา
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="storeName" className={`self-end w-[4px] ${sort?.storeName == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData}>
                                                    <div id="countDay" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        จำนวนวัน
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="countDay" className={`self-end w-[4px] ${sort?.countDay == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="countDay" className={`self-end w-[4px] ${sort?.countDay == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData}>
                                                    <div id="total" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        <div id="total">
                                                            <p id="total">
                                                                ทั้งหมด
                                                            </p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="total" className={`self-end w-[4px] ${sort?.total == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="total" className={`self-end w-[4px] ${sort?.total == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                {!isMini &&
                                                    <th onClick={sortData}>
                                                        <div id="chiller" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                            <div id="chiller">
                                                                <p id="chiller">ระบบChiller</p> (kWh)
                                                            </div>
                                                            {/* <div className="flex self-center h-min">
                                                            <img id="chiller" className={`self-end w-[4px] ${sort?.chiller == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                            <img id="chiller" className={`self-end w-[4px] ${sort?.chiller == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                        </div> */}
                                                        </div>
                                                    </th>
                                                }
                                                <th onClick={sortData}>
                                                    <div id="ahu" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        <div id="ahu">
                                                            <p id="ahu">{isMini ? "ระบบปรับอากาศ" : "AHU"}</p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="ahu" className={`self-end w-[4px] ${sort?.ahu == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="ahu" className={`self-end w-[4px] ${sort?.ahu == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData}>
                                                    <div id="cabinet" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        <div id="cabinet">
                                                            <p id="cabinet">ระบบตู้แช่</p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="cabinet" className={`self-end w-[4px] ${sort?.cabinet == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="cabinet" className={`self-end w-[4px] ${sort?.cabinet == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                {!isMini && <>
                                                    <th onClick={sortData}>
                                                        <div id="lighting" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                            <div id="lighting">
                                                                <p id="lighting">ระบบแสงสว่าง</p>
                                                                (kWh)
                                                            </div>
                                                            {/* <div className="flex self-center h-min">
                                                            <img id="lighting" className={`self-end w-[4px] ${sort?.lighting == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                            <img id="lighting" className={`self-end w-[4px] ${sort?.lighting == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                        </div> */}
                                                        </div>
                                                    </th>
                                                </>}
                                                <th onClick={sortData}>
                                                    <div id="other" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        <div id="other">
                                                            <p id="other">อื่นๆ</p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex self-center h-min">
                                                        <img id="other" className={`self-end w-[4px] ${sort?.other == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="other" className={`self-end w-[4px] ${sort?.other == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th onClick={sortData} className="">
                                                    <div id="budget" className="flex items-center justify-center gap-0.5 cursor-pointer">
                                                        <div id="budget">
                                                            <p id="budget">งบประมาณ</p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex item-center h-min">
                                                        <img id="budget" className={`self-end w-[4px] ${sort?.budget == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="budget" className={`self-end w-[4px] ${sort?.budget == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                                <th className="rounded-r-md py-2"
                                                    onClick={sortData}>
                                                    <div id="actualVsBudget" className="flex items-center justify-center cursor-pointer mr-1.5">
                                                        <div id="actualVsBudget" >
                                                            <p id="actualVsBudget">ใช้งานจริง เทียบกับ งบประมาณ</p>
                                                            (kWh)
                                                        </div>
                                                        {/* <div className="flex items-center h-min">
                                                        <img id="actualVsBudget" className={`self-end w-[4px] ${sort?.actualVsBudget == 'desc' && "h-[14px]"}`} src='img/sortUp.svg' />
                                                        <img id="actualVsBudget" className={`self-end w-[4px] ${sort?.actualVsBudget == 'asc' && "h-[14px]"}`} src='img/sortDown.svg' />
                                                    </div> */}
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr id={'trow_0'} className="bg-[#E3F2FE] text-center rounded-md" hidden={isLoading || !data}>
                                                <td className="rounded-l-md">
                                                    {data?.findIndex(ele => ele.storeId == storeData.id) >= 0
                                                        ? data?.findIndex(ele => ele.storeId == storeData.id) + 1 : '-'}
                                                </td>
                                                <td>{myRank?.costCenter || storeData.costCenter}</td>
                                                <td>{myRank?.storeNumber || storeData.storeNumber}</td>
                                                <td className="text-left py-2">{myRank?.storeName || storeData.storeName}</td>
                                                <td>{myRank?.countDay || '-'}</td>
                                                <td>{myRank
                                                    ? myRankTotal?.toLocaleString('en-US', optionDigit)
                                                    : '-'}</td>
                                                {!isMini && <>
                                                    <td>{myRank?.chiller?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                </>}
                                                <td>{myRank?.ahu?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                <td>{myRank?.cabinet?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                {!isMini && <>
                                                    <td>{myRank?.lighting?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                </>}
                                                <td>{myRank?.other?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                <td>{myRank?.budget?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                <td className="rounded-r-md">
                                                    <div className={`${myRank?.budget ?
                                                        (myRank?.actualVsBudget < 0 ? "bg-[#FFEBEB] text-danger" : "bg-[#DDF0E3] text-[#32AA23]")
                                                        : ""} w-fit mx-auto px-2 py-1.5 rounded-md  my-2 min-w-[5rem] font-bold`}>
                                                        {myRank?.budget && (myRank?.actualVsBudget)?.toLocaleString('en-US', optionDigit) || '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                            {!isLoading && data?.map((rank, index) => {
                                                const total = rank.ahu + rank.cabinet + rank.other + (isMini ? 0 : rank.chiller) + (isMini ? 0 : rank.lighting)
                                                if (index < perPage * page && index + 1 > perPage * page - perPage) {
                                                    return (
                                                        <tr id={`trow_${index + 1}`} key={index} className={`odd:bg-white even:bg-table text-center ${loading && 'animate-pulse bg-current/[.2]'} rounded-md`}>
                                                            <td className="rounded-l-md">{rank.index}</td>
                                                            <td>{rank.costCenter}</td>
                                                            <td>{rank.storeNumber}</td>
                                                            <td className="text-left py-2">{rank.storeName}</td>
                                                            <td>{rank.countDay}</td>
                                                            <td>{total?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            {!isMini && <>
                                                                <td>{rank.chiller?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            </>}
                                                            <td>{rank.ahu?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td>{rank.cabinet?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            {!isMini && <>
                                                                <td>{rank.lighting?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            </>}
                                                            <td>{rank.other?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td>{rank.budget?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td className="rounded-r-md"
                                                            >
                                                                <div className={`${rank.budget > 0 ? rank.actualVsBudget < 0 ? "bg-[#FFEBEB] text-danger" : "bg-[#DDF0E3] text-[#32AA23]"
                                                                    : ''} w-fit mx-auto px-2 p-1.5 rounded-md my-2 min-w-[5rem] font-semibold`}>
                                                                    {rank.budget
                                                                        ? (rank.actualVsBudget)?.toLocaleString('en-US', optionDigit)
                                                                        : '-'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                        </tbody>
                                        {/* <tbody id="tableTotalEnergyRankBody">
                                            {!isLoading && data?.map((rank, index) => {
                                                if (index < perPage * page && index + 1 > perPage * page - perPage) {
                                                    return (
                                                        <tr key={index} className={`odd:bg-white even:bg-table text-center ${loading && 'animate-pulse bg-current/[.2]'} `}>
                                                            <td className="rounded-l-md">{rank.index}</td>
                                                            <td>{rank.costCenter}</td>
                                                            <td>{rank.storeNumber}</td>
                                                            <td className="text-left py-2">{rank.storeName}</td>
                                                            <td>{rank.countDay}</td>
                                                            <td>{rank.total?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            {!isMini && <>
                                                                <td>{rank.chiller?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            </>}
                                                            <td>{rank.ahu?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td>{rank.cabinet?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            {!isMini && <>
                                                                <td>{rank.lighting?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            </>}
                                                            <td>{rank.other?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td>{rank.budget?.toLocaleString('en-US', optionDigit) || '-'}</td>
                                                            <td className="rounded-r-md"
                                                            >
                                                                <div className={`${rank.budget > 0 ? rank.actualVsBudget < 0 ? "bg-[#FFEBEB] text-danger" : "bg-[#DDF0E3] text-[#32AA23]"
                                                                    : ''} w-fit mx-auto px-2 p-1.5 rounded-md my-2 min-w-[5rem] font-semibold`}>
                                                                    {rank.budget
                                                                        ? (rank.actualVsBudget)?.toLocaleString('en-US', optionDigit)
                                                                        : '-'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                        </tbody> */}
                                    </table>

                                </div >
                            </div>
                        </div>
                    </div>
                </>
                }
            </div>
        </>
    )
}

export default TableRankTop20
