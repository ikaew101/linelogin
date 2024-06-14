import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import InputSearch from "../inputSearch";
import Spinner from "../spinner";
import RefrigService from "../../service/refrigerator";
import Swal from "sweetalert2";
import AirService from "../../service/air";
import AuthService from "../../service/authen";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";

function AirNotification({ userId, selectedStore, setSelectedStore, stores }) {
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [storeList, setStoreList] = useState()
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(selectedStore.storeName)
    const [toggleAll, setToggleAll] = useState(false)
    const [storeData, setStoreData] = useState(selectedStore)
    const [format, setFormat] = useState(selectedStore.format || 'mini')
    const [toggleWork, setToggleWork] = useState(false)

    useEffect(() => {
        setSelectedStore(storeData)
    }, [storeData])

    useEffect(() => {
        setType('costCenter')
        getData()
    }, []);

    // useEffect(() => {
    //     if (data?.length) setIsLoading(false)
    //     // setToggleAll(false)
    // }, [data])

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
            const res = await AirService.getNotification(userId)
            // console.log(res.data)
            setData(res.data || [])
            localStorage.setItem("_id", resStore.id)
            setSearch('')
        } catch (err) {
            setIsLoading(false)
            console.log(err)
            setData([])
        }
    }

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

    const [saving, setSaving] = useState(false)
    return (
        <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl `}>
                <div className="p-3" id="storeData">
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
                            <button className={`text-white bg-primary py-2 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                                onClick={getData}
                                disabled={isLoading}
                            >
                                ค้นหา
                            </button>
                        </div>
                    </div>

                    <div className="xs:flex justify-end gap-5 items-center text-sm px-2 pr-5 p-2 max-xs:ml-2">
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input type='checkbox' checked={toggleAll} className='sr-only'
                                    onChange={() => setToggleAll(!toggleAll)}
                                />
                                <div className={`box block h-6 w-11 rounded-full ${toggleAll ? 'bg-primary' : 'bg-gray-200'}`}
                                />
                                <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${toggleAll ? 'translate-x-full left-2' : 'left-1'} `}
                                />
                            </div>
                            &nbsp;ดูทุกสาขา
                        </label>
                        <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                                <input type='checkbox' checked={toggleWork} className='sr-only'
                                    onChange={() => setToggleWork(!toggleWork)}
                                />
                                <div className={`box block h-6 w-11 rounded-full ${toggleWork ? 'bg-primary' : 'bg-gray-200'}`}
                                />
                                <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${toggleWork ? 'translate-x-full left-2' : 'left-1'} `}
                                />
                            </div>
                            &nbsp;ดูเฉพาะเปิดคำสั่งงาน
                        </label>
                    </div>
                </div>

                <div className="md:absolute md:-mt-9 mt-2">
                    <ExportPage onSaving={setSaving} name="Air Noti"
                    // arrayId={[{ table: "Notification", length: perPage, start: perPage * (page - 1) }]}
                    />
                </div>
            </div>

            <Table isLoading={isLoading} data={data} toggleAll={toggleAll} toggleWork={toggleWork} storeNo={storeData.storeNumber} setIsLoading={setIsLoading}
                saving={saving}
            />
        </>
    )
}

function Table({ isLoading, data, toggleAll, toggleWork, storeNo, setIsLoading, saving }) {
    const [perPage, setPerPage] = useState(20)
    const [page, setPage] = useState(1)
    const [dataSorted, setDataSorted] = useState()

    const alarmClass = 'text-danger bg-[#FFE711] rounded-md my-1.5 p-1.5'

    const csvmaker = function (data) {
        const csvRows = [];

        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        data.map(value => {
            const values = Object.values(value).join(',');
            csvRows.push(values)
        })

        return csvRows.join('\n')
    }

    const [sort, setSort] = useState()
    function toggleSort(e) {
        e.preventDefault()
        if (isLoading) return
        const label = e.target.id
        console.log(label)
        if (sort && sort[label] == 'asc') {
            setSort({ [label]: 'desc' })
        } else {
            setSort({ [label]: 'asc' })
        }
    }

    useEffect(() => {
        // if (!data || isLoading == true) return
        setDataSorted(null)
        // setIsLoading(true)
        setPage(1)
        let datas = data?.filter(ele => new Date(new Date(ele.timestampCurrent).getTime() + new Date(ele.timestampCurrent).getTimezoneOffset() * 60000) >= new Date(new Date().setMinutes(new Date().getMinutes() - 15)))
        if (!toggleAll) {
            datas = datas?.filter(ele => ele.storeNumber == storeNo)
        }
        if (toggleWork) {
            datas = datas?.filter(ele => ele.OpenWorkOrder == 'enable')
        }

        if (!sort) {
            datas?.sort((a, b) => { return new Date(b.timestampCurrent) - new Date(a.timestampCurrent) })
        } else {
            datas?.sort((a, b) => {
                const key = Object.keys(sort)[0]
                const A = a[key] || ""
                const B = b[key] || ""
                if (key == "infoAdr") {
                    if (a[key].length == b[key].length) {
                        if (Object.values(sort)[0] == 'asc') {
                            // return a[key].localeCompare(b[key])
                            return A.localeCompare(B)
                        } else {
                            // return b[key].localeCompare(a[key])
                            return B.localeCompare(A)
                        }
                    } else {
                        if (Object.values(sort)[0] == 'asc') {
                            return a[key].length < b[key].length ? -1 : 1
                        } else {
                            return a[key].length < b[key].length ? 1 : -1
                        }
                    }
                } else if (key == "timestampFirstTime" || key == "timestampOpenWorkOrder" || key == "timestampCurrent") {
                    if (Object.values(sort)[0] == 'asc') {
                        return new Date(A) - new Date(B)
                    } else {
                        return new Date(B) - new Date(A)
                    }
                }
                if (Object.values(sort)[0] == 'asc') {
                    return A.localeCompare(B)
                } else {
                    return B.localeCompare(A)
                }

            })
        }

        // setDataSorted(datas)
        setDataSorted(datas)
        // setIsLoading(false)
    }, [sort, toggleAll, toggleWork, storeNo, data])

    useEffect(() => {
        if (isLoading && isLoading != true) {
            // console.log(isLoading)
            setSort()
        }
    }, [data])

    useEffect(() => {
        // console.log(dataSorted?.length, 'data !!!', isLoading)
        if (dataSorted) setIsLoading(false)
    }, [dataSorted])

    return (
        <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 text-secondary`}>
            <div id={`tableNotification`} className="p-3">
                <div className="grid">
                    <div className=" scrollbar overflow-x-auto">
                        <table width="100%" className="min-w-full table-fixed max-lg:min-w-[950px]">
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "5%" }} />
                            <col style={{ width: "8.5%" }} />
                            <col style={{ width: "7%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "4%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "6%" }} />
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "8%" }} />
                            <thead className="text-dark bg-table-head gap-0.5 text-sm rounded-md">
                                <tr>
                                    <th rowSpan="2" className=" rounded-l-md">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="costCenter">
                                            Cost Center
                                            <div className="flex self-center h-min ml-1">
                                                <img id="costCenter" className={`self-end ${sort?.costCenter == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="costCenter" className={`self-end ${sort?.costCenter == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="storeNumber" >
                                            รหัสสาขา
                                            <div className="flex self-center h-min ml-1">
                                                <img id="storeNumber" className={`self-end ${sort?.storeNumber == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="storeNumber" className={`self-end ${sort?.storeNumber == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="" >
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="storeName">
                                            ชื่อสาขา
                                            <div className="flex self-center h-min ml-1">
                                                <img id="storeName" className={`self-end ${sort?.storeName == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="storeName" className={`self-end ${sort?.storeName == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="caseId">
                                            Error code
                                            <div className="flex self-center h-min ml-1">
                                                <img id="caseId" className={`self-end ${sort?.caseId == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="caseId" className={`self-end ${sort?.caseId == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="" >
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="clientReference">
                                            Client Reference
                                            <div className="flex self-center h-min ml-1">
                                                <img id="clientReference" className={`self-end ${sort?.clientReference == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="clientReference" className={`self-end ${sort?.clientReference == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="infoAdr">
                                            adr
                                            <div className="flex self-center h-min ml-1">
                                                <img id="infoAdr" className={`self-end ${sort?.infoAdr == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="infoAdr" className={`self-end ${sort?.infoAdr == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="" >
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="infoModal">
                                            ชื่ออุปกรณ์
                                            <div className="flex self-center h-min ml-1">
                                                <img id="infoModal" className={`self-end ${sort?.infoModal == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="infoModal" className={`self-end ${sort?.infoModal == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="category">
                                            หมวดหมู่
                                            <div className="flex self-center h-min ml-1">
                                                <img id="category" className={`self-end ${sort?.category == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="category" className={`self-end ${sort?.category == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="timestampFirstTime">
                                            เวลาที่เกิด alarm (ครั้งแรก)
                                            <div className="flex self-center h-min ml-1">
                                                <img id="timestampFirstTime" className={`self-end ${sort?.timestampFirstTime == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="timestampFirstTime" className={`self-end ${sort?.timestampFirstTime == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="py-2.5">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="timestampCurrent">
                                            เวลาที่เกิด alarm (ล่าสุด)
                                            <div className="flex self-center h-min ml-1">
                                                <img id="timestampCurrent" className={`self-end ${sort?.timestampCurrent == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="timestampCurrent" className={`self-end ${sort?.timestampCurrent == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="OpenWorkOrder">
                                            เปิดคำสั่งงาน
                                            <div className="flex self-center h-min ml-1">
                                                <img id="OpenWorkOrder" className={`self-end ${sort?.OpenWorkOrder == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="OpenWorkOrder" className={`self-end ${sort?.OpenWorkOrder == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="timestampOpenWorkOrder">
                                            เวลาที่เปิดคำสั่งงาน
                                            <div className="flex self-center h-min ml-1">
                                                <img id="timestampOpenWorkOrder" className={`self-end ${sort?.timestampOpenWorkOrder == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="timestampOpenWorkOrder" className={`self-end ${sort?.timestampOpenWorkOrder == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                    <th rowSpan="2" className="rounded-r-md py-2.5">
                                        <div className="flex mx-1 cursor-pointer justify-center group" onClick={toggleSort} id="durationAlarm">
                                            ระยะเวลาที่เกิด alarm
                                            <div className="flex self-center h-min ml-1">
                                                <img id="durationAlarm" className={`self-end ${sort?.durationAlarm == 'desc' && "h-[14px]"} w-[4px]`} src='img/sortUp.svg' />
                                                <img id="durationAlarm" className={`self-end ${sort?.durationAlarm == 'asc' && "h-[14px]"} w-[4px]`} src='img/sortDown.svg' />
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`text-[14px] ${isLoading && 'hidden'}`}>
                                {dataSorted?.map((ele, ind) => {
                                    const [hour, minute, sec] = ele.durationAlarm.split(':');
                                    if (ind < perPage * page && ind + 1 > perPage * page - perPage)
                                        return (
                                            <tr key={ind} className="odd:bg-white even:bg-table text-center rounded-md">
                                                <td className="rounded-l-md" >{ele?.costCenter}</td>
                                                <td >{ele.storeNumber}</td>
                                                <td className="py-2 text-left">{ele.storeName}</td>
                                                <td className="break-all" >{ele.caseId || '-'}</td>
                                                <td>
                                                    <div className={`py-1 ${ele.clientReference.endsWith('New Alarm') && alarmClass}`}>
                                                        {ele.clientReference}
                                                    </div>
                                                </td>
                                                <td >{ele.infoAdr}</td>
                                                <td className="text-left">{ele.infoModel}</td>
                                                <td >
                                                    <div className={`py-1 w-fit ${ele.category == 'New Alarm' && alarmClass}`}>
                                                        {ele.category || '-'}
                                                    </div>
                                                </td>
                                                <td >
                                                    {new Date(null).toLocaleString() == new Date(ele.timestampFirstTime).toLocaleString()
                                                        ? '-'
                                                        : new Date(new Date(ele.timestampFirstTime).getTime() + new Date(ele.timestampFirstTime).getTimezoneOffset() * 60000)
                                                            .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                                                    }
                                                </td>
                                                <td >
                                                    {new Date(null).toLocaleString() == new Date(ele.timestampCurrent).toLocaleString()
                                                        ? '-'
                                                        : new Date(new Date(ele.timestampCurrent).getTime() + new Date(ele.timestampCurrent).getTimezoneOffset() * 60000)
                                                            .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                                                    }
                                                </td>
                                                <td>
                                                    <div className={`py-1 ${ele.OpenWorkOrder == 'disable' && alarmClass}`}>
                                                        {ele.OpenWorkOrder || '-'}
                                                    </div>
                                                </td>
                                                <td >
                                                    {new Date(null).toLocaleString() == new Date(ele.timestampOpenWorkOrder).toLocaleString()
                                                        ? '-'
                                                        : ele.timestampOpenWorkOrder && new Date(new Date(ele.timestampOpenWorkOrder).getTime() + new Date(ele.timestampOpenWorkOrder).getTimezoneOffset() * 60000)
                                                            .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                                                    }
                                                </td>
                                                <td className="rounded-r-md">
                                                    {!+hour && !+minute ? '-'
                                                        : `
                    ${!!+hour && `${+hour} hour${+hour > 1 ? 's' : ''}` || ''}  ${!!+minute && `${+minute} minute${+minute > 1 ? 's' : ''}` || ''}
                    `}
                                                </td>
                                            </tr>
                                        )
                                })}

                                <tr id={`${(isLoading || !dataSorted?.length) && "trow_0"}`}>
                                    <td colSpan={13} hidden={dataSorted?.length}>
                                        {
                                            isLoading
                                                ? <div className="flex justify-center py-3 my-10 items-center"><Spinner size="lg" /></div>
                                                : !dataSorted?.length &&
                                                <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark ">
                                                    ไม่พบข้อมูล
                                                </div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table >

                    </div>
                </div>
            </div>

            <div className="">
                {
                    isLoading
                        ? <div className="flex justify-center py-3 my-10 items-center"><Spinner size="lg" /></div>
                        : !!dataSorted?.length &&
                        // ?
                        // <div className="flex justify-center py-5 bg-gray-50 rounded items-center my-10 mx-2 text-dark">
                        //     ไม่พบข้อมูล
                        // </div>
                        // :
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
                                    {/* <div className="mx-auto flex items-center"> */}
                                    {/* {perPage * page - perPage + 1}-{perPage * page} of 20 */}
                                    หน้า {page} จาก {Math.ceil(dataSorted?.length / perPage) || 1}
                                    <div className="ml-3 mr-1 flex gap-2">
                                        {/* <div className="mx-3 flex gap-2"> */}
                                        <button className={`p-2.5 hover:bg-light rounded-full `}
                                            onClick={() => page > 1 && setPage(page - 1)}
                                            disabled={page > 1 ? false : true}
                                        >
                                            <FiChevronLeft className="font-semibold" />
                                        </button>
                                        <button className={`p-2.5 hover:bg-light rounded-full `}
                                            onClick={() => page < Math.ceil(dataSorted?.length / perPage) && setPage(page + 1)}
                                            disabled={page < Math.ceil(dataSorted?.length / perPage) ? false : true}
                                        >
                                            <FiChevronRight className="font-semibold" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div >


            <div className={`${!isLoading && dataSorted?.length ? 'sm:absolute sm:-mt-8' : ''} `}>
                <ExportTypes id={`tableNotification`}
                    csvData={dataSorted?.map((ele, i) => {
                        const [hour, minute] = ele.durationAlarm.split(':');
                        const objThai = {
                            "Cost Center": ele.costCenter,
                            "รหัสสาขา": ele.storeNumber,
                            "ชื่อสาขา": ele.storeName,
                            "Error code": ele.caseId,
                            "Client Reference": ele.clientReference,
                            "adr": ele.infoAdr,
                            "ชื่ออุปกรณ์": ele.infoModel,
                            "หมวดหมู่": ele.category,
                            "เวลาที่เกิด alarm (ครั้งแรก)": new Date(null).toLocaleString() == new Date(ele.timestampFirstTime).toLocaleString()
                                ? '-'
                                : new Date(new Date(ele.timestampFirstTime).getTime() + new Date(ele.timestampFirstTime).getTimezoneOffset() * 60000)
                                    .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).split(',').join('')
                            ,
                            "เวลาที่เกิด alarm (ล่าสุด)": new Date(null).toLocaleString() == new Date(ele.timestampCurrent).toLocaleString()
                                ? '-'
                                : new Date(new Date(ele.timestampCurrent).getTime() + new Date(ele.timestampCurrent).getTimezoneOffset() * 60000)
                                    .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).split(',').join('')
                            ,
                            "เปิดคำสั่งงาน": ele.OpenWorkOrder,
                            "เวลาที่เปิดคำสั่งงาน": new Date(null).toLocaleString() !== new Date(ele.timestampOpenWorkOrder).toLocaleString()
                                ? new Date(new Date(ele.timestampOpenWorkOrder).getTime() + new Date(ele.timestampOpenWorkOrder).getTimezoneOffset() * 60000)
                                    .toLocaleString('en-GB', { month: '2-digit', day: '2-digit', year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).split(',').join('')
                                : "-",
                            "ระยะเวลาที่เกิด alarm": !+hour && !+minute ? ''
                                : `${!!+hour && `${+hour} hour${+hour > 1 ? 's' : ''}` || ''}  ${!!+minute && `${+minute} minute${+minute > 1 ? 's' : ''}` || ''}`,
                        }
                        return objThai
                    })}
                    dataLength={+perPage}
                    dataStart={perPage * (page - 1)}
                />
            </div>
        </div >
    )
}

export default AirNotification