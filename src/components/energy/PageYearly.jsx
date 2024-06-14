import React, { useState, useEffect } from "react";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import MonthName from "../../const/month";
import Swal from "sweetalert2";
import GraphBudgetYearly from "./graphBudget";
import GraphConsumptionByYear from "./graphByYear";
import EnergyService from "../../service/energy";
import BarGraphThisMonth from "./graphThisMonth";
import AuthService from "../../service/authen";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";
import { cn } from "../../helper/cn";

function EnergyYearly({ userId, selectedStore, setSelectedStore, stores }) {
    const thisYear = new Date().getFullYear()
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [data, setData] = useState()
    const [storeList, setStoreList] = useState([])
    const [isLoading, setIsLoading] = useState(selectedStore.storeName)
    const [selectYear, setSelectYear] = useState(thisYear)
    const [storeData, setStoreData] = useState(selectedStore)
    const [format, setFormat] = useState(selectedStore.format || 'mini');
    const monthEng = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    useEffect(() => {
        setSelectedStore(storeData)
    }, [storeData])

    useEffect(() => {
        setType('costCenter')
        getDataYearly() //*useEffect [selectYear] already working
    }, [])

    const getDataYearly = async (year) => {
        const typeFormat = type || 'costCenter'
        const searchValue = search || storeData[typeFormat]
        let resStore, findFormat, num5digit
        if (type != "storeName") num5digit = (('00000' + searchValue).slice(-5))
        resStore = stores[format]?.find(store => store[typeFormat] == (num5digit || searchValue))
        // if (!resStore) resStore = stores[format]?.find(store => store[typeFormat] == `0${searchValue}`)
        if (resStore) {
            setStoreData({
                costCenter: resStore?.costCenter,
                storeNumber: resStore?.storeNumber,
                storeName: resStore?.storeName,
                format: format
            })
        } else if (search) {
            Swal.fire({
                // title: '',
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
            
            if (stores.mini?.find(store => store[typeFormat] == searchValue)) findFormat = ('mini')
            if (stores.hyper?.find(store => store[typeFormat] == searchValue)) findFormat = ('hyper')
            if (stores.super?.find(store => store[typeFormat] == searchValue)) findFormat = ('super')
            resStore = stores[findFormat]?.find(store => store[typeFormat] == searchValue)
            setStoreData({ ...storeData, format: findFormat })
        }

        try {
            setIsLoading(true)
            await AuthService.refreshTokenPage(userId)
            // localStorage.setItem("_auth_storage", new Date().toISOString())
            const res = await EnergyService.getYearly(resStore?.id, { asOfYear: year || thisYear, flag: 2 })
            if (!year) setSelectYear(thisYear)
            // if (selectYear == "2022") {
            //     setData({
            //         ...res.data,
            //         "card1": null,
            //         "card2": [
            //         ],
            //         "card3": null,
            //         "card4": [
            //         ],
            //         card5: []
            //     })
            //     return
            // }

            setData(res.data)
            localStorage.setItem("_id", resStore.id)
            setSearch('')
            setIsLoading(false)
        } catch (err) {
            console.log(err)
            setData()
            setIsLoading(false)
        }
    };

    // useEffect(() => {
    //     setIsLoading(false)
    // }, [data])

    useEffect(() => {
        // getStoreList()
        const list = []
        switch (format) {
            case "mini":
                stores.mini?.map(ele => {
                    list.push(ele[type])
                })
                break;
            case "hyper":
                stores.hyper?.map(ele => {
                    list.push(ele[type])
                })
                break;
            case "super":
                stores.super?.map(ele => {
                    list.push(ele[type])
                })
                break;
            default:
                break;
        }
        setStoreList([...new Set(list)])
    }, [type, format])

    // useEffect(() => {
    //     // if (storeData.storeNumber) {
    //     getDataYearly(selectYear)
    //     // }
    // }, [selectYear])

    const optionDigit = { minimumFractionDigits: 0, maximumFractionDigits: 1 }
    const isMonth1 = (new Date().getMonth() == 0)
    const thisMonth = `${MonthName[monthEng?.findIndex(ele => ele == data?.card0.avgMonth[1]?.month)] || MonthName[new Date().getMonth()]} ${(`${new Date().getFullYear() + 543}`).slice(-2)}`
    const lastMonth = `${MonthName[monthEng?.findIndex(ele => ele == data?.card0.avgMonth[0]?.month)]
        || (isMonth1 ? MonthName[11] : MonthName[new Date().getMonth() - 1])} ${(`${new Date().getFullYear() + 543 - (isMonth1 && 1)}`).slice(-2)}`
    const arrayTable = [...Array(18).keys()]
    const [saving, setSaving] = useState(false)

    function compareDataClass(mainData , data1, data2) {
        if (mainData == -999 || !mainData) {
            return ''
        }
        else if (data1 != 0 && data2 != 0 && data1.toLocaleString([], optionDigit) != data2.toLocaleString([], optionDigit) && data1 == data2) {
            return ''
        }
        else if (data1 > data2) {
            return "bg-[#FFEBEB] text-danger"
        } else if (data1 < data2) {
            return "bg-primary/[.2] text-primary"
        } else {
            return ''
        }
    }

    return (
        <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl`}>
                <div id="storeData" className="p-3">
                    <div className="md:flex justify-between items-center  rounded-md p-2 mt-5">
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
                        <div className="grid grid-cols-4 max-lg:grid-cols-2 text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-start">

                            <div className="grid grid-rows-2 grid-flow-col gap-x-3">
                                {/* <div className="self-center">Store Format</div> */}
                                <div className="self-center">ประเภทสาขา</div>
                                <div>
                                    <select
                                        className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                                        name="status"
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
                                        className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer w-full outline-0 h-[2.5em] bg-white"
                                        name="status"
                                        value={type}
                                        onChange={e => { setType(e.target.value); }}
                                    >
                                        {/* <option value="" >Select</option> */}
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
                                onEnter={() => getDataYearly()}
                                line={2}
                            // currentValue={storeData[type]}
                            />
                            <button className={`h-[2.5em] text-white bg-primary py-2 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 z-30`}
                                onClick={() => { getDataYearly() }}
                                disabled={isLoading}>
                                ค้นหา
                            </button>
                        </div>
                    </div>
                </div>

                {/* <ExportTypes id="storeData" optionPDF="fit" onSaving={setSaving} /> */}
                <ExportPage onSaving={setSaving} name="Energy overview"
                    arrayId={[
                        "table_energyCompareByMonth",
                        `graphEnergyConsumption_M${new Date().getMonth() + 1}`,
                        { parts: `graphEnergy Actual-Budget ${selectYear + 543}`, length: 4 }
                    ]}
                    hasDateOnTop
                    format={[360, 500]}
                />
            </div>

            <div className="h-0 overflow-hidden">
                <div id="top">
                    <div className='text-2xl pl-4 font-semibold md:pl-6' id="name">
                        ระบบติดตามพลังงาน
                    </div>
                    <div className='bg-primary p-2 my-4 mx-6 lg:mx-10 rounded-md justify-center flex lg:gap-14 relative z-30 max-md:gap-1 max-lg:grid max-lg:grid-cols-3 font-medium'
                        name="">
                        <button name='yearly'
                            className={`bg-[#009B93] py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px] md:max-w-[90%] max-lg:mx-auto`}
                        >
                            ภาพรวม
                        </button>
                        <button name='daily'
                            className={`py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]  md:max-w-[90%] max-lg:mx-auto`}
                        >
                            รายวัน
                        </button>
                        <button name='ranking'
                            className={`py-2 max-md:px-5 max-sm:px-3 rounded-md text-white max-lg:w-full lg:min-w-[250px] md:max-w-[90%] max-lg:mx-auto`}
                        >
                            สูงสุด 20 อันดับ
                        </button>
                    </div>

                    <div className={`bg-white border -mt-10 mx-2 rounded-xl`}>
                        <div id="storeData" className="p-3">
                            <div className="md:flex justify-between items-center  rounded-md p-2 mt-5">
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
                                <div className="grid grid-cols-4 max-lg:grid-cols-2 text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2 self-start">

                                    <div className="grid grid-rows-2 grid-flow-col gap-x-3">
                                        <div className="self-center">ประเภทสาขา</div>
                                        <div>
                                            <select
                                                className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                                                name="status"
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
                                                className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer w-full outline-0 h-[2.5em] bg-white"
                                                name="status"
                                                value={type}
                                                onChange={e => { setType(e.target.value); }}
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
                                        onEnter={() => getDataYearly()}
                                        line={2}
                                    />
                                    <button className={`h-[2.5em] text-white bg-primary py-2 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 z-30`}
                                        onClick={() => { getDataYearly() }}
                                        disabled={isLoading}>
                                        ค้นหา
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="page">
                <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mt-4  mx-2 rounded-xl`}>
                    <div id="table_energyCompareByMonth" className=" p-3">
                        <div className="flex gap-1 items-center">
                            <img src="icon/table.png" className="w-10 h-10" />
                            <div className='font-bold text-[#828282]'>
                                ค่าเฉลี่ยการใช้ไฟฟ้าต่อวัน (kWh) เปรียบเทียบระหว่าง เดือนปัจจุบัน กับ เดือนที่แล้ว
                            </div>
                        </div>
                        <div className="text-xs py-3 mx- 1 grid">
                            <div className="overflow-x-auto bg-white rounded-md scrollbar max-lg:overflow-x-scroll">
                                {/* ^ still cannot show scrollbar on chrome mobile/iOS */}

                                {/* <div className="overflow-x-auto bg-white rounded-md sm:scrollbar max-md:overflow-x-scroll"> */}
                                {/* <table width="100%" className="max-lg:min-w-max table-fixed w-full text-dark"> */}
                                {/* <table width="100%" className="max-lg:min-w-max table-fixed max-lg:max-w-full min-w-full text-dark w-[900px] lg:bg-red-200"> */}
                                {/* <table width="100%" className="max-lg:min-w-max table-fixed max-lg:w-[1000px] min-w-full text-dark"> */}
                                <table width="100%" className="max-[1250px]:min-w-max table-fixed max-lg:w-[1000px] min-w-full text-dark">
                                    <col style={{ width: "14.5%" }} />
                                    <col style={{ width: "7.8%" }} />
                                    <col style={{ width: "0.2%" }} />
                                    <col style={{ width: "26%" }} />
                                    <col style={{ width: "0.2%" }} />
                                    <col style={{ width: "26%" }} />
                                    <col style={{ width: "0.2%" }} />
                                    <col style={{ width: "26%" }} />
                                    <thead className="bg-table-head rounded-md">
                                        <tr className=" ">
                                            <th rowSpan="2" className=" " > ชื่อสาขา</th>
                                            <th rowSpan="2" className="" > สังกัด </th>
                                            <th></th>
                                            <th className="pt-2.5">
                                                <p>% การเปลี่ยนแปลง ({thisMonth}  เทียบกับ {lastMonth}) </p>
                                                <div className="grid grid-cols-6 items-center mx-1.5">
                                                    <th className="py-2 font-normal">ทั้งหมด</th>
                                                    <th className="py-2 font-normal">Chiller</th>
                                                    <th className="py-2 font-normal">
                                                        <p>AHU</p> Split type
                                                    </th>
                                                    <th className="py-2 font-normal">ตู้แช่</th>
                                                    <th className="py-2 font-normal">แสงสว่าง</th>
                                                    <th className="py-2 font-normal">อื่นๆ</th>
                                                </div>
                                            </th>
                                            <th></th>
                                            <th className="pt-2.5">
                                                <p>เฉลี่ย ต่อวัน ในเดือน {thisMonth}</p>
                                                <div className="grid grid-cols-6 items-center mx-1.5">
                                                    <th className="py-2 font-normal">ทั้งหมด</th>
                                                    <th className="py-2 font-normal">Chiller</th>
                                                    <th className="py-2 font-normal">
                                                        <p>AHU</p> Split type
                                                    </th>
                                                    <th className="py-2 font-normal">ตู้แช่</th>
                                                    <th className="py-2 font-normal">แสงสว่าง</th>
                                                    <th className="py-2 font-normal">อื่นๆ</th>
                                                </div>
                                            </th>
                                            <th></th>
                                            <th className="pt-2.5">
                                                <p>เฉลี่ย ต่อวัน ในเดือน {lastMonth}</p>
                                                <div className="grid grid-cols-6 items-center ml-1.5">
                                                    <th className="py-2 font-normal">ทั้งหมด</th>
                                                    <th className="py-2 font-normal">Chiller</th>
                                                    <th className="py-2 font-normal">
                                                        <p>AHU</p> Split type
                                                    </th>
                                                    <th className="py-2 font-normal">ตู้แช่</th>
                                                    <th className="py-2 font-normal">แสงสว่าง</th>
                                                    <th className="py-2 font-normal">อื่นๆ</th>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    {data?.card0 &&
                                        <tbody className='text-center font-bold'>
                                            <tr className="">
                                                <td className=" py-2">
                                                    {data?.card0.storeName}
                                                </td>
                                                <td className="">
                                                    {data?.card0.area}
                                                </td>
                                                <td></td>
                                                {data?.card0.avgMonth[0] &&
                                                    <td className="">
                                                        <div className="grid grid-cols-6 item-center mx-1.5">
                                                            {/* <div className={`${isNaN(((data?.card0.avgMonth[0].total.toFixed(1) - data?.card0.avgMonth[1].total.toFixed(1)) / data?.card0.avgMonth[1].total.toFixed(1) * 100)) ? ''
                                                                : data?.card0.avgMonth[0].total != 0 && data?.card0.avgMonth[0].total != data?.card0.avgMonth[1].total &&
                                                                data?.card0.avgMonth[1].total && (data?.card0.avgMonth[0].total > data?.card0.avgMonth[1].total
                                                                    ? "bg-[#FFEBEB] text-danger" : "bg-primary/[.2] text-primary")}
                                                      w-fit mx-auto p-1.5 rounded-md my-1 font-semibold`}> */}
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].total == 0 || data?.card0.avgMonth[1].total == 0 ? ''
                                                                    : data?.card0.diffCompare?.total == 0 ? ''
                                                                        : data?.card0.diffCompare?.total < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].total != 0 && data?.card0.avgMonth[1].total
                                                                    ? `${(data?.card0.avgMonth[0].total.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].total.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].total.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        : (((data?.card0.avgMonth[0].total.toFixed(1) - data?.card0.avgMonth[1].total.toFixed(1)) / data?.card0.avgMonth[1].total.toFixed(1) * 100) || 0).toLocaleString([], optionDigit) || 0
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].total != 0 && data?.card0.avgMonth[1].total
                                                                    ? `${data?.card0.diffCompare?.total.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].chiller == 0 || data?.card0.avgMonth[1].chiller == 0 ? ''
                                                                    : data?.card0.diffCompare?.chiller == 0 ? ''
                                                                        : data?.card0.diffCompare?.chiller < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].chiller != 0 && data?.card0.avgMonth[0].chiller != -999 && (data?.card0.avgMonth[1].chiller)
                                                                    ? `${(data?.card0.avgMonth[0].chiller.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].chiller.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].chiller.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        : (((data?.card0.avgMonth[0].chiller.toFixed(1) - data?.card0.avgMonth[1].chiller.toFixed(1)) / data?.card0.avgMonth[1].chiller.toFixed(1) * 100) || 0).toLocaleString([], optionDigit)
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].chiller != 0 && data?.card0.avgMonth[1].chiller
                                                                    ? `${data?.card0.diffCompare?.chiller.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].ahu == 0 || data?.card0.avgMonth[1].ahu == 0 ? ''
                                                                    : data?.card0.diffCompare?.ahu == 0 ? ''
                                                                        : data?.card0.diffCompare?.ahu < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].ahu != 0 && data?.card0.avgMonth[0].ahu != -999 && (data?.card0.avgMonth[1].ahu)
                                                                    ? `${(data?.card0.avgMonth[0].ahu.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].ahu.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].ahu.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        : (((data?.card0.avgMonth[0].ahu.toFixed(1) - data?.card0.avgMonth[1].ahu.toFixed(1)) / data?.card0.avgMonth[1].ahu.toFixed(1) * 100) || 0).toLocaleString([], optionDigit)
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].ahu != 0 && data?.card0.avgMonth[1].ahu
                                                                    ? `${data?.card0.diffCompare?.ahu.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].refrig == 0 || data?.card0.avgMonth[1].refrig == 0 ? ''
                                                                    : data?.card0.diffCompare?.refrig == 0 ? ''
                                                                        : data?.card0.diffCompare?.refrig < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].cabinet != 0 && data?.card0.avgMonth[0].cabinet != -999 && (data?.card0.avgMonth[1].cabinet)
                                                                    ? `${(data?.card0.avgMonth[0].cabinet.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].cabinet.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].cabinet.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        // : ((data?.card0.avgMonth[0].cabinet.toFixed(1) - data?.card0.avgMonth[1].cabinet.toFixed(1)) / data?.card0.avgMonth[1].cabinet.toFixed(1) * 100).toLocaleString([], optionDigit)
                                                                        : (((data?.card0.avgMonth[0].cabinet.toFixed(1) - data?.card0.avgMonth[1].cabinet.toFixed(1)) / data?.card0.avgMonth[1].cabinet.toFixed(1) * 100) || 0).toLocaleString([], optionDigit)
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].refrig != 0 && data?.card0.avgMonth[1].refrig
                                                                    ? `${data?.card0.diffCompare?.refrig.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].lighting == 0 || data?.card0.avgMonth[1].lighting == 0 ? ''
                                                                    : data?.card0.diffCompare?.lighting == 0 ? ''
                                                                        : data?.card0.diffCompare?.lighting < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].lighting != 0 && data?.card0.avgMonth[0].lighting != -999 && (data?.card0.avgMonth[1].lighting)
                                                                    ? `${(data?.card0.avgMonth[0].lighting.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].lighting.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].lighting.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        : (((data?.card0.avgMonth[0].lighting.toFixed(1) - data?.card0.avgMonth[1].lighting.toFixed(1)) / data?.card0.avgMonth[1].lighting.toFixed(1) * 100) || 0).toLocaleString([], optionDigit)
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].lighting != 0 && data?.card0.avgMonth[1].lighting
                                                                    ? `${data?.card0.diffCompare?.lighting.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                            <div className={`w-fit mx-auto p-1.5 rounded-md my-1 font-semibold 
                                                            ${data?.card0.avgMonth[0].other == 0 || data?.card0.avgMonth[1].other == 0 ? ''
                                                                    : data?.card0.diffCompare?.other == 0 ? ''
                                                                        : data?.card0.diffCompare?.other < 0 ? "bg-primary/[.2] text-primary" : "bg-[#FFEBEB] text-danger"} `}>
                                                                {/* {data?.card0.avgMonth[0].other != 0 && data?.card0.avgMonth[0].other != -999 && (data?.card0.avgMonth[1].other)
                                                                    ? `${(data?.card0.avgMonth[0].other.toLocaleString([], optionDigit) - data?.card0.avgMonth[1].other.toLocaleString([], optionDigit)) / data?.card0.avgMonth[1].other.toLocaleString([], optionDigit) * 100
                                                                        == Infinity ? 0
                                                                        : (((data?.card0.avgMonth[0].other.toFixed(1) - data?.card0.avgMonth[1].other.toFixed(1)) / data?.card0.avgMonth[1].other.toFixed(1) * 100) || 0).toLocaleString([], optionDigit)
                                                                    }%`
                                                                    : '-'} */}
                                                                {data?.card0.avgMonth[0].other != 0 && data?.card0.avgMonth[1].other
                                                                    ? `${data?.card0.diffCompare?.other.toLocaleString([], optionDigit)}%` : '-'
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                }

                                                {data?.card0.avgMonth[0] ?
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

                                                {data?.card0.avgMonth?.map((arr, ind) => (
                                                    ind == 1 &&
                                                    <td key={ind}>
                                                        <div className={`grid grid-cols-6 mx-1.5 ${ind == 1 && "mr-0"}`}>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.total, data?.card0.avgMonth[1]?.total, data?.card0.avgMonth[0]?.total))}>
                                                                {arr.total > 0 ? arr.total.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.chiller, data?.card0.avgMonth[1]?.chiller, data?.card0.avgMonth[0]?.chiller))}>
                                                                {arr.chiller > 0 ? arr.chiller.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.ahu, data?.card0.avgMonth[1]?.ahu, data?.card0.avgMonth[0]?.ahu))}>
                                                                {arr.ahu > 0 ? arr.ahu.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.refrig, data?.card0.avgMonth[1]?.refrig, data?.card0.avgMonth[0]?.refrig))}>
                                                                {arr.refrig > 0 ? arr.refrig.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.lighting, data?.card0.avgMonth[1]?.lighting, data?.card0.avgMonth[0]?.lighting))}>
                                                                {arr.lighting > 0 ? arr.lighting.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div className={cn("w-fit mx-auto p-1.5 rounded-md my-1", compareDataClass(arr.other, data?.card0.avgMonth[1]?.other, data?.card0.avgMonth[0]?.other))}>
                                                                {arr.other > 0 ? arr.other.toLocaleString([], optionDigit) : '-'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                ))}
                                                <td></td>
                                                {!data?.card0.avgMonth[0] && <td>
                                                    <div className="grid grid-cols-6 mx-1.5">
                                                        {[...Array(6).keys()].map((ele, i) => (
                                                            <td key={i} className="text-center">
                                                                -
                                                            </td>
                                                        ))}
                                                    </div>
                                                </td>
                                                }

                                                {data?.card0.avgMonth?.map((arr, ind) => (
                                                    ind == 0 &&
                                                    <td key={ind}>
                                                        <div className={`grid grid-cols-6 mx-1.5 mr-0`}>

                                                            <div >
                                                                {arr.total > 0 ? arr.total.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div >
                                                                {arr.chiller > 0 ? arr.chiller.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div >
                                                                {arr.ahu > 0 ? arr.ahu.toLocaleString([], optionDigit) : '-'}
                                                            </div>

                                                            <div >
                                                                {arr.refrig > 0 ? arr.refrig.toLocaleString([], optionDigit) : '-'}
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
                                                {!data?.card0.avgMonth[0] && <td>
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
                                        </tbody>
                                    }
                                </table>

                            </div>
                            {!data
                                ? <div className="flex justify-center items-center h-[38px]"><Spinner /></div>
                                : !data?.card0
                                &&
                                <div className="flex justify-center h-[38px] rounded items-center text-dark text-sm">
                                    ไม่พบข้อมูล
                                </div>
                            }
                        </div>
                    </div>

                    <ExportTypes id="table_energyCompareByMonth"
                        optionPDF="fit" single="row"
                        csvData={
                            [{
                                ชื่อสาขา: data?.card0.storeName,
                                สังกัด: data?.card0.area,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) ทั้งหมด`]: data?.card0.avgMonth[0].total != 0 && data?.card0.avgMonth[1].total
                                    ? `${data?.card0.diffCompare?.total}%` : ''
                                ,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) Chiller`]: data?.card0.avgMonth[0].chiller != 0 && data?.card0.avgMonth[1].chiller
                                    ? `${data?.card0.diffCompare?.chiller}%` : ''
                                ,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) AHU Split type`]: data?.card0.avgMonth[0].ahu != 0 && data?.card0.avgMonth[1].ahu
                                    ? `${data?.card0.diffCompare?.ahu}%` : ''
                                ,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) ตู้แช่`]: data?.card0.avgMonth[0].refrig != 0 && data?.card0.avgMonth[1].refrig
                                    ? `${data?.card0.diffCompare?.refrig}%` : ''
                                ,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) แสงสว่าง`]: data?.card0.avgMonth[0].lighting != 0 && data?.card0.avgMonth[1].lighting
                                    ? `${data?.card0.diffCompare?.lighting}%` : ''
                                ,
                                [`% การเปลี่ยนแปลง (${thisMonth} เทียบกับ ${lastMonth}) อื่นๆ`]: data?.card0.avgMonth[0].other != 0 && data?.card0.avgMonth[1].other
                                    ? `${data?.card0.diffCompare?.other}%` : ''
                                ,

                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} ทั้งหมด`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].total > 0 && data?.card0.avgMonth[1].total.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} Chiller`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].chiller > 0 && data?.card0.avgMonth[1].chiller.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} AHU Split type`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].ahu > 0 && data?.card0.avgMonth[1].ahu.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} ตู้แช่`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].refrig > 0 && data?.card0.avgMonth[1].refrig.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} แสงสว่าง`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].lighting > 0 && data?.card0.avgMonth[1].lighting.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${thisMonth} อื่นๆ`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[1].other > 0 && data?.card0.avgMonth[1].other.toFixed(1) || "",

                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} ทั้งหมด`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].total > 0 && data?.card0.avgMonth[0].total.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} Chiller`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].chiller > 0 && data?.card0.avgMonth[0].chiller.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} AHU Split type`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].ahu > 0 && data?.card0.avgMonth[0].ahu.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} ตู้แช่`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].refrig > 0 && data?.card0.avgMonth[0].refrig.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} แสงสว่าง`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].lighting > 0 && data?.card0.avgMonth[0].lighting.toFixed(1) || "",
                                [`เฉลี่ย ต่อวัน ในเดือน ${lastMonth} อื่นๆ`]: data?.card0?.avgMonth && data?.card0.avgMonth[0] &&
                                    data?.card0.avgMonth[0].other > 0 && data?.card0.avgMonth[0].other.toFixed(1) || "",

                            }]
                        } />
                </div>

                <BarGraphThisMonth data={data?.card5 || []} isLoading={isLoading} saving={saving} />

                <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mt-4 mx-2 rounded-xl`}>
                    <div id={`graphEnergy Actual-Budget ${selectYear + 543}`} className="mb-2">
                        <div className="flex gap-1 items-center p-3" id="part1">
                            <img src="icon/graph.png" className="w-10 h-10" />
                            <div className='font-bold text-[#828282]'>
                                การใช้ไฟฟ้ารวม เปรียบเทียบระหว่าง การใช้งานจริง กับ งบประมาณ
                            </div>
                        </div>

                        <div className="flex px-3 pb-1" id="part2">
                            <div className={`w-[5rem] font-bold text-center py-1.5 rounded-l-md ${!saving && "shadow"} border-[0.9px]`} >
                                ปี
                            </div>
                            {/* {!isLoading &&
                                    .map((ele,ind) => ( */}
                            <button className={`${selectYear == thisYear - 1 ? "bg-[#565E6D] text-white" : "bg-white hover:bg-slate-100"} ${!saving && "shadow"} hover:shadow-md w-[5rem] py-1.5 border-[0.9px]`}
                                onClick={e => {
                                    setSelectYear(e.target.innerText - 543)
                                    getDataYearly(e.target.innerText - 543)
                                }}>
                                {(+thisYear) + 543 - 1}
                            </button>
                            {/* ))
                        } */}
                            <button className={`${selectYear == thisYear ? "bg-[#565E6D] text-white" : "bg-white hover:bg-slate-100"} ${!saving && "shadow"} hover:shadow-md w-[5rem] py-1.5 rounded-r-md border`}
                                onClick={e => {
                                    setSelectYear(e.target.innerText - 543)
                                    getDataYearly(e.target.innerText - 543)
                                }}>
                                {(+thisYear) + 543}
                            </button>
                        </div>

                        <>
                            {isLoading
                                ? <div className="flex justify-center items-center h-16 my-10"><Spinner size="lg" /></div>
                                :
                                data
                                    // (data?.card2.length || data.card4.length)
                                    ?
                                    <>
                                        <GraphEnergyYearly data={data} year={selectYear + 543} saving={saving} />
                                    </>
                                    :
                                    <div className="flex justify-center h-16 bg-gray-50 rounded items-center my-10 text-dark mx-2"
                                        id="part3">
                                        ไม่พบข้อมูล
                                    </div>
                            }
                        </>
                    </div>
                    <ExportTypes id={`graphEnergy Actual-Budget ${selectYear + 543}`}
                        // single="page"
                        optionPDF="fit"
                        onSaving={setSaving}
                    />
                </div >

            </div >
        </>
    )
}


function GraphEnergyYearly({ data, year, saving }) {
    const unit = "บาท" // Baht
    // const [onSave, setonSave] = useState(saving)
    // useEffect(() => {
    //     setonSave(saving)
    // }, [saving])
    return (
        <>

            {/* <div className={`grid grid-cols-4 max-[1280px]:grid-cols-1 pb-3 px-3 ${saving && '!grid-cols-4'}`} id="part3"> */}
            <div className={`grid grid-cols-4 max-[1280px]:grid-cols-1 pb-3 px-3 `} id="part3">
                <div className={`grid grid-cols-1 items-center justify-center ${!saving && "shadow"} border bg-white rounded-2xl shadow-basic-gray mt-3 min-w-[315px] z-10`}
                >
                    <GraphBudgetYearly data={data.card1} unit={unit} year={year} />
                </div>


                {/* <div className={`scrollbar overflow-x-auto col-span-3 :mx-5 mt-3  px-5 ${!saving ? "shadow" : '!ml-4'} border bg-white rounded-2xl shadow-basic-gray min-w-[315px] max-[1280px]:ml-0 ml-5`} */}
                <div className={`scrollbar overflow-x-auto col-span-3 :mx-5 mt-3  px-5 ${!saving ? "shadow" : ''} border bg-white rounded-2xl shadow-basic-gray min-w-[315px] max-[1280px]:ml-0 ml-5`}
                >
                    <div className="min-w-[500px]">
                        <GraphConsumptionByYear data={data.card2} unit={unit} />
                    </div>
                </div>
            </div>


            {/* <div className={`grid grid-cols-4 max-[1280px]:grid-cols-1 pb-3 px-3 ${saving && '!grid-cols-4'}`} id="part4"> */}
            <div className={`grid grid-cols-4 max-[1280px]:grid-cols-1 pb-3 px-3 `} id="part4">
                <div className={`grid grid-cols-1 items-center justify-center ${!saving && "shadow"} border bg-white rounded-2xl shadow-basic-gray mt-3 min-w-[315px] z-10`}
                >
                    <GraphBudgetYearly data={data.card3} year={year} unit={"kWh"} />
                </div>


                {/* <div className={`scrollbar overflow-x-auto col-span-3 :mx-5 mt-3  px-5 ${!saving ? "shadow" : '!ml-4'} border bg-white rounded-2xl shadow-basic-gray min-w-[315px] max-[1280px]:ml-0 ml-5`} */}
                <div className={`scrollbar overflow-x-auto col-span-3 :mx-5 mt-3  px-5 ${!saving ? "shadow" : ''} border bg-white rounded-2xl shadow-basic-gray min-w-[315px] max-[1280px]:ml-0 ml-5`}
                >
                    <div className="min-w-[500px]">
                        <GraphConsumptionByYear data={data.card4} unit={"kWh"} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EnergyYearly
