import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import CardBudgetActual from "../cardBudgetActual";
import TableRankTop20 from "./tableRankTop20";
import InputSearch from "../inputSearch";
import { FaRegCalendarAlt } from 'react-icons/fa'
import Spinner from "../spinner";
import DatePickerThai from "../DatePickerThai";
import CardsPercentOfTotal from "./cardsPercentTotal";
import EnergyService from "../../service/energy";
import Swal from "sweetalert2";
import EnergyWithLastYear from "./energyWithLastYear";
import EnerygyWithBudget from "./enerygyWithBudget";

import AuthService from "../../service/authen";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";

function EnergyRanking({ userId, selectedStore, setSelectedStore, stores }) {
    const [search, setSearch] = useState('')
    const [storeList, setStoreList] = useState()
    const [data, setData] = useState()
    const lastDate = new Date().setDate(new Date().getDate() - 1)
    const [dateStart, setDateStart] = useState(lastDate)
    const [dateEnd, setDateEnd] = useState(lastDate)
    const defaultToggle = {
        air: true,
        total: true,
        other: true,
        chiller: true,
        cabinet: true,
        lighting: true,
    }
    const [toggle, setToggle] = useState(defaultToggle)
    const [isLoading, setIsLoading] = useState(true)
    const maxDate = lastDate
    const [storeData, setStoreData] = useState(selectedStore)
    const [type, setType] = useState('costCenter')
    const [format, setFormat] = useState(selectedStore.format || 'mini')
    const [isMini, setIsMini] = useState(null);
    const color = {
        total: '#F9BE00',
        lighting: '#F89C22',
        cabinet: '#88D3E6',
        air: '#C3D311',
        chiller: '#809DED',
        other: '#E1221C'
    }
    const [dataMyStore, setDataMyStore] = useState()
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const [nightMode, setNightMode] = useState(false)

    useEffect(() => {
        setSelectedStore(storeData)
    }, [storeData])

    useEffect(() => {
        getData()
    }, [])

    const startDate = new Date(dateStart).toISOString().split('T')[0]
    const endDate = new Date(dateEnd).toISOString().split('T')[0]

    const getData = async () => {
        if (dateStart > dateEnd) {
            Swal.fire({
                text: 'กรุณาเลือกช่วงวันที่ให้ถูกต้อง (วันที่สิ้นสุดมากกว่าวันที่เริ่มต้น)',
                icon: 'warning',
                confirmButtonColor: '#809DED',
                confirmButtonText: 'OK',
                iconColor: '#FFBC29',
                showCloseButton: true

            })
            return
        }

        const searchValue = search || storeData[type]
        let resStore, findFormat, num5digit
        if (type != "storeName") num5digit = ('00000' + searchValue).slice(-5)
        resStore = stores[format]?.find(store => store[type] == (num5digit || searchValue))
        if (search && !resStore) {
            Swal.fire({
                text: 'ไม่พบข้อมูลสาขาที่เลือก',
                icon: 'error',
                confirmButtonColor: '#809DED',
                confirmButtonText: 'OK',
                iconColor: '#E1221C',
                showCloseButton: true,
            })
            // setData()
            setIsLoading(false)
            setSearch('')
        }
        if (!search && !resStore) {
            if (stores.hyper?.find(store => store[type] == searchValue)) findFormat = ('hyper')
            if (stores.mini?.find(store => store[type] == searchValue)) findFormat = ('mini')
            if (stores.super?.find(store => store[type] == searchValue)) findFormat = ('super')
            resStore = stores[findFormat]?.find(store => store[type] == searchValue)
            setStoreData({ ...storeData, format: findFormat })
        }

        if (resStore) {
            setIsMini(resStore.storeFormatName.startsWith('Mini'))
            setStoreData({
                costCenter: resStore?.costCenter,
                storeNumber: resStore?.storeNumber,
                storeName: resStore?.storeName,
                format: format,
                id: resStore.id
            })

            try {
                setIsLoading(true)
                await AuthService.refreshTokenPage(userId)
                // localStorage.setItem("_auth_storage", new Date().toISOString())
                setNightMode(false)
                const resData = await EnergyService.getRanking(resStore?.id, {
                    startDate: startDate,
                    endDate: endDate,
                    storeFormatName: findFormat || format,
                    flag: 1
                })
                setDataNight()

                setData(resData.data)
                localStorage.setItem("_id", resStore.id)
            } catch (err) {
                console.log(err)
                setData()
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        // setIsMini(format == "mini")
        setToggle(defaultToggle)
        if (data) {
            setIsLoading(false)
        } else if (!storeData.storeName) {
            setIsLoading(false)
        }
        if (storeData.storeName) setSearch('')
    }, [data])

    useEffect(() => {
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

    const onChangeToggle = e => {
        const label = e.target.name
        const check = e.target.checked
        let settingTog
        if (label != "total") {
            settingTog = ({
                ...toggle,
                [label]: check,
            })
        } else {
            settingTog = {
                ...toggle,
                air: check ? true : false,
                total: check ? true : false,
                other: check ? true : false,
                chiller: check ? true : false,
                cabinet: check ? true : false,
                lighting: check ? true : false,
            }
        }
        const togg = settingTog
        delete togg.total
        if (isMini) {
            delete togg.chiller
            delete togg.lighting
        }
        const number = isMini ? 3 : 5
        const allTrue = (Object.values(togg).filter(ele => ele == true)).length == number
        const someFalse = (Object.values(togg).filter(ele => ele == false))
        setToggle({ ...settingTog, total: allTrue || someFalse[0] })
    }

    useEffect(() => {
        if (nightMode) getDataNight()
    }, [nightMode])

    const [dataNight, setDataNight] = useState()
    async function getDataNight() {
        if (dataNight) return
        const resData = await EnergyService.getRanking(storeData?.id, {
            startDate: startDate,
            endDate: endDate,
            storeFormatName: format,
            mode: "night"
        })
        // setDataNight(resData.data || [])
        const datas = resData.data
        if(format == "mini") {
            datas.card1.summary.ahu =datas.card1.summary.airConditioner
        }
        setDataNight(datas)
        // setToggle({ ...defaultToggle, total: true })
    }
    const [saving, setSaving] = useState(false)

    return (
        <>
            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border -mt-10 mx-2 rounded-xl p-3`}>
                <div id="storeData" className="rounded-md p-2 mt-5">
                    <div className="md:flex justify-around items-center ">
                        <div className='rounded-full bg-gray-100 px-8 py-3 h-fit mx-auto w-full'>
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
                                line={2}
                            />
                            <button className={`text-white bg-primary py-2 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                                disabled={isLoading}
                                onClick={getData}>
                                ค้นหา
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 text-sm gap-2 mt-2  mx-2 md:flex md:justify-end">
                        <div className="items-center justify-items-center max-md:justify-items-start relative">
                            วันที่เริ่มต้น
                            <>
                                <DatePickerThai
                                    onChange={setDateStart}
                                    selected={dateStart}
                                    maxDate={maxDate}
                                />
                            </>
                            <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
                        </div>
                        <div className="items-center justify-items-center max-md:justify-items-start relative">
                            วันที่สิ้นสุด
                            <>
                                <DatePickerThai
                                    onChange={setDateEnd}
                                    selected={dateEnd}
                                    maxDate={lastDate}
                                />
                            </>
                            <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
                        </div>
                    </div>
                </div>

                <div className="md:absolute md:-mt-6 mt-2">
                    {/* <ExportTypes id="storeData" onSaving={setSaving} /> */}
                    <ExportPage onSaving={setSaving} name="Energy Ranking"
                        arrayId={[
                            // `ranking20_${startDate}`,
                            { parts: `ranking20_${startDate}`, length: 4 },
                            { table: "TotalEnergyRank", length: 50 },
                            { table: "EnergyWithLastYear", length: 50 },
                            { table: "EnergyWithBudget", length: 50 }
                        ]}
                        hasDateOnTop
                        format={[360, 500]}
                    />
                </div>
            </div>

            <div className="h-0 overflow-hidden">
                <div id="top">
                    <div className='text-2xl pl-4 font-semibold md:pl-6' id="name">
                        ระบบติดตามพลังงาน
                    </div>
                    <div className='bg-primary p-2 my-4 mx-6 lg:mx-10 rounded-md justify-center flex lg:gap-14 relative z-30 max-md:gap-1 max-lg:grid max-lg:grid-cols-3 font-medium'
                        name="">
                        <button name='yearly'
                            className={`py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px] md:max-w-[90%] max-lg:mx-auto`}
                        >
                            ภาพรวม
                        </button>
                        <button name='daily'
                            className={`py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]  md:max-w-[90%] max-lg:mx-auto`}
                        >
                            รายวัน
                        </button>
                        <button name='ranking'
                            className={`bg-[#009B93] py-2 max-md:px-5 max-sm:px-3 rounded-md text-white max-lg:w-full lg:min-w-[250px] md:max-w-[90%] max-lg:mx-auto`}
                        >
                            สูงสุด 20 อันดับ
                        </button>
                    </div>

                    <div className={`bg-white border -mt-10 mx-2 rounded-xl p-3`}>
                        <div id="storeData" className="rounded-md p-2 mt-5">
                            <div className="md:flex justify-around items-center ">
                                <div className='rounded-full bg-gray-100 px-8 py-3 h-fit mx-auto w-full'>
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
                                        line={2}
                                    />
                                    <button className={`text-white bg-primary py-2 px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400 h-[2.5em] z-30`}
                                        disabled={isLoading}
                                        onClick={getData}>
                                        ค้นหา
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 text-sm gap-2 mt-2  mx-2 md:flex md:justify-end">
                                <div className="items-center justify-items-center max-md:justify-items-start relative">
                                    วันที่เริ่มต้น
                                    <>
                                        <DatePickerThai
                                            onChange={setDateStart}
                                            selected={dateStart}
                                            maxDate={maxDate}
                                        />
                                    </>
                                    <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
                                </div>
                                <div className="items-center justify-items-center max-md:justify-items-start relative">
                                    วันที่สิ้นสุด
                                    <>
                                        <DatePickerThai
                                            onChange={setDateEnd}
                                            selected={dateEnd}
                                            maxDate={lastDate}
                                        />
                                    </>
                                    <FaRegCalendarAlt className="text-secondary absolute m-2 right-0 mr-3 top-[1.7em]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`bg-white ${saving != 'JPEG' ? 'shadow' : ''} border mx-2 rounded-xl mt-4 pb-2`}>
                <div id={`ranking20_${startDate}`} className="p-3 px-4">
                    <CardsPercentOfTotal data={!nightMode ? data?.card1.summary : dataNight?.card1.summary} isMini={isMini} isLoading={nightMode && !dataNight ? true : isLoading} />

                    <GraphEnergyConsumption data={!nightMode ? data?.card1?.summaryRanking : dataNight?.card1?.summaryRanking} toggle={toggle} onChangeToggle={onChangeToggle} isMini={isMini} color={color}
                        setNightMode={setNightMode} nightMode={nightMode} isLoading={nightMode && !dataNight ? true : isLoading}
                        allData={!nightMode ? data?.card2 : dataNight?.card2}
                        saving={saving} />
                    <div className="py-3 mt-2" id="part4">
                        <CardBudgetActual data={!nightMode ? data?.card1?.budget : dataNight?.card1.budget} loading={nightMode && !dataNight ? true : isLoading} Total={data?.card1?.summary.total || 0} />
                    </div>
                </div>
                <ExportTypes id={`ranking20_${startDate}`} onSaving={setSaving} />
            </div>

            <div className={`bg-white ${saving != 'JPEG' ? 'shadow' : ''} border mx-2 rounded-xl mt-4 text-secondary`}>

                <TableRankTop20 ranks={!nightMode ? data?.card2 : dataNight?.card2} isLoading={nightMode && !dataNight ? true : isLoading} myRank={dataMyStore} lastPage={data?.pageCount}
                    page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} isMini={isMini}
                    storeData={storeData}
                    date={[dateStart, dateEnd]} />

            </div>

            <EnergyWithLastYear storeData={storeData} ranks={nightMode ? dataNight?.card3 : data?.card3} isMini={isMini} isLoading={nightMode && !dataNight ? true : isLoading}
                saving={saving} />

            <EnerygyWithBudget ranks={nightMode ? dataNight?.card4 : data?.card4} storeData={storeData} isLoading={nightMode && !dataNight ? true : isLoading} isMini={isMini} myRank={dataMyStore}
                saving={saving} />
        </>
    )
}

function GraphEnergyConsumption({ data, isLoading, toggle, onChangeToggle, isMini, color, setNightMode, nightMode, allData, saving }) {
    const [datas, setDatas] = useState()

    useEffect(() => {
        setSelectMode({
            air: true,
            refrig: true,
            other: true,
            chiller: true,
            lighting: true
        })
        data?.map(ele => {
            if (ele.chiller == '-999') ele.chiller = null
            if (ele.air == '-999') ele.air = null
            if (ele.cabinet == '-999') ele.cabinet = null
            if (ele.lighting == '-999') ele.lighting = null
            if (ele.other == '-999') ele.other = null
        })
        setDatas(data)
        if (!isLoading) sortDatas()
    }, [data])

    const [selectMode, setSelectMode] = useState({
        air: toggle?.air,
        refrig: toggle?.cabinet,
        other: toggle?.other,
        chiller: toggle?.chiller,
        lighting: toggle?.lighting
    })

    const CustomTooltip = ({ active, payload }) => {
        const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

        if (active && payload && payload.length) {
            const total = payload[0].payload
            return (
                <div className="shadow-md rounded-lg text-sm max-w-[250px] min-w-[200px] bg-white">
                    <div className='grid grid-cols-1'>
                        <div className='text-sm font-bold py-1.5 px-2 rounded-t-lg text-dark'>
                            {payload[0].payload.storeName}
                        </div>
                    </div>
                    <div className='z-50 pb-2 rounded-b-lg flex flex-col justify-center bg-white '>
                        {!isMini && selectMode.chiller &&
                            <div className='flex justify-between text-xs py-1 px-2'>
                                <div className='flex items-center pr-5 whitespace-nowrap'>
                                    <div className={`font-semibold`} style={{ color: color.chiller }}>
                                        ระบบChiller
                                    </div>
                                </div>
                                <div className='flex justify-between items-center gap-x-1 text-secondary'>
                                    {payload[0].payload.chiller == null ? '-' : <>
                                        <label>{payload[0].payload.chiller?.toLocaleString('en-US', optionDigit)}</label>
                                        ({toPercent(payload[0].payload.chiller, total)})
                                    </>}
                                </div>
                            </div>
                        }
                        {selectMode.air &&
                            <div className='flex justify-between text-xs py-1 px-2'>
                                <div className='flex items-center pr-5 whitespace-nowrap'>
                                    <div className={`font-semibold`} style={{ color: color.air }}>
                                        {isMini ? "ระบบปรับอากาศ" : "AHU"}
                                    </div>
                                </div>
                                <div className='flex justify-between items-center gap-x-1 ml-2 text-secondary'>
                                    {payload[0].payload.air == null ? '-' : <>
                                        <label>{payload[0].payload.air?.toLocaleString('en-US', optionDigit)}</label>
                                        ({toPercent(payload[0].payload.air, total)})
                                    </>}
                                </div>
                            </div>
                        }
                        {selectMode.refrig &&
                            <div className='flex justify-between text-xs py-1 px-2'>
                                <div className='flex items-center pr-5'>
                                    <div className={`font-semibold`} style={{ color: color.cabinet }}>
                                        ระบบตู้แช่
                                    </div>
                                </div>
                                <div className='flex justify-between items-center gap-x-1 text-secondary'>
                                    {payload[0].payload.cabinet == null ? '-' : <>
                                        <label>{payload[0].payload.cabinet?.toLocaleString('en-US', optionDigit)}</label>
                                        ({toPercent(payload[0].payload.cabinet, total)})
                                    </>}
                                </div>
                            </div>
                        }
                        {!isMini && selectMode.lighting &&
                            <div className='flex justify-between text-xs py-1 px-2'>
                                <div className='flex items-center pr-5 whitespace-nowrap'>
                                    <div className={`font-semibold`} style={{ color: color.lighting }}>
                                        ระบบแสงสว่าง
                                    </div>
                                </div>
                                <div className='flex justify-between items-center gap-x-1 text-secondary'>
                                    {payload[0].payload.lighting == null ? '-' : <>
                                        <label>{payload[0].payload.lighting?.toLocaleString('en-US', optionDigit)}</label>
                                        ({toPercent(payload[0].payload.lighting, total)})
                                    </>}
                                </div>
                            </div>
                        }
                        {selectMode.other &&
                            <div className='flex justify-between text-xs py-1 px-2'>
                                <div className='flex items-center pr-5'>
                                    <div className={`font-semibold`} style={{ color: color.other }}>
                                        อื่นๆ
                                    </div>
                                </div>
                                <div className='flex justify-between items-center gap-x-1 ml-5 text-secondary'>
                                    {payload[0].payload.other == null ? '-' : <>
                                        <label>{payload[0].payload.other?.toLocaleString('en-US', optionDigit)}</label>
                                        ({toPercent(payload[0].payload.other, total)})
                                    </>}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (tickItem) => {
        if (tickItem > 10e5) {
            return `${(tickItem / 1000000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
    }

    const toPercent = (value, values) => {
        const percent = value / total(values) * 100
        if (percent) {
            return `${percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}%`
        } else {
            return '0.00%'
        }
    }

    const total = (values) => {
        let sum = 0
        if (selectMode.air) sum += values.air
        if (selectMode.refrig) sum += values.cabinet
        if (selectMode.other) sum += values.other
        if (!isMini) {
            if (selectMode.lighting) sum += values.lighting
            if (selectMode.chiller) sum += values.chiller
        }
        return sum
    }

    const percentOf = (values, label) => {
        const togg = selectMode
        delete togg.total
        // if (Object.values(togg).filter(ele => ele == true).length == 1) return
        const percent = values[label] / total(values) * 100
        if (Math.round(percent) > 0) {
            return `${percent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || 0}%`
        } else {
            return ''
        }
    }

    const toggleClass = `w-11 h-6 bg-gray-200 peer-focus:outline-none  peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all mr-1.5`

    function sortDatas() {
        setSelectMode({
            air: toggle?.air,
            refrig: toggle?.cabinet,
            other: toggle?.other,
            chiller: toggle?.chiller,
            lighting: toggle?.lighting
        })
        if (toggle.total) {
            setDatas(data)
            return
        }

        const array = []
        allData.map((data, index) => {
            if (index + 1 > 20) return

            let sum = 0
            if (toggle?.air) sum += data.ahu
            if (toggle?.cabinet) sum += data.cabinet
            if (toggle?.chiller) sum += data.chiller
            if (toggle?.lighting) sum += data.lighting
            if (toggle?.other) sum += data.other
            array.push({
                ...data,
                air:  data.ahu == '-999' ? null : data.ahu,
                chiller:  data.chiller == '-999' ? null : data.chiller,
                lighting:  data.lighting == '-999' ? null : data.lighting,
                cabinet:  data.cabinet == '-999' ? null : data.cabinet,
                other:  data.other == '-999' ? null : data.other,
                total: sum
            })
        })
        // setDatas(dataFilter?.sort((a, b) => b?.total - a?.total).slice(0, 20))
        setDatas(array?.sort((a, b) => b?.total - a?.total))
    }
    return (
        <>
            <div className="pt-1 pb-3" id="part2">
                <div className={`${!saving && "shadow-md"} rounded-xl mt-2 border`}
                >
                    <div className="sm:flex justify-between pt-5 px-2">
                        <div className="flex items-center">
                            {/* <img className='h-[25px] mx-2 inline' src='img/icon-energy.svg' /> */}
                            <img src="icon/total.png" className="w-9 h-9 inline mx-2" />
                            <div>
                                <p className="text-secondary font-bold">ปริมาณการใช้พลังงานไฟฟ้า สูงสุด 20 อันดับ (kWh)</p>
                            </div>
                        </div>

                        {/* {!!data?.length && */}
                        <div className="items-center flex max-md:justify-end max-md:pt-2">
                            {/* <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={nightMode} className="sr-only peer"
                                name="night" onChange={() => setNightMode(!nightMode)} />
                            <div className={`${toggleClass} peer-checked:bg-dark`} />
                            เฉพาะกลางคืน
                        </label> */}

                            <label className='flex cursor-pointer select-none items-center'>
                                <div className='relative'>
                                    <input type='checkbox' checked={nightMode}
                                        onChange={() => setNightMode(!nightMode)}
                                        className='sr-only'
                                    />
                                    <div className={`box block h-6 w-11 rounded-full 
                                ${nightMode ? 'bg-dark' : 'bg-gray-200'}`}
                                    />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${nightMode ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;เฉพาะกลางคืน
                            </label>
                        </div>
                        {/* } */}
                    </div>
                    {isLoading ?
                        <div className="flex justify-center items-center h-36 my-2"><Spinner size="lg" /></div>
                        : !data?.length
                            ? <div className="m-2 flex justify-center rounded-md">
                                <div className="flex justify-center h-16 bg-gray-50 w-full rounded items-center my-10 text-dark">
                                    ไม่พบข้อมูล
                                </div>
                            </div>
                            :
                            <div className="scrollbar overflow-x-auto mx-2">
                                <div className="md:min-w-full min-w-[700px] ">
                                    <ResponsiveContainer width='100%' height={500} className={'my-5 -ml-2 '}>
                                        <BarChart
                                            barGap={0}
                                            data={datas}
                                            margin={{
                                                top: 1,
                                                right: 10,
                                                left: 20,
                                                bottom: 80
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray='3 3' />
                                            <XAxis dataKey='storeName'
                                                tick={(props) => {
                                                    const name = props.payload.value.length > 20 ? `${props.payload.value.slice(0, 19)}...` : props.payload.value
                                                    return (
                                                        <g transform={`translate(${props.x},${props.y}) rotate(-45)`}>
                                                            <text x={0} y={0} dy={7} textAnchor='end' fill="#565E6D" fontSize={13} >
                                                                {name}
                                                            </text>
                                                        </g>
                                                    )
                                                }}
                                                interval={0} //กำหนดระยะห่างของการแสดงผลแกน x 0 แสดงทุกค่า
                                                axisLine={true}
                                                tickLine={true}
                                            />
                                            <YAxis tickFormatter={formatYAxis} fontSize={13} />
                                            {datas?.length &&
                                                <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                                            }
                                            {selectMode.other &&
                                                <Bar dataKey='other' stackId={'a'} fill={color.other} barSize={40}>
                                                    <LabelList
                                                        dataKey={values => percentOf(values, 'other')}
                                                        fontSize={"small"}
                                                        fill='#503B0D'
                                                    />
                                                </Bar>
                                            }
                                            {selectMode.lighting &&
                                                <Bar dataKey='lighting' stackId={'a'} fill={color.lighting} barSize={40}>
                                                    <LabelList
                                                        dataKey={values => percentOf(values, 'lighting')}
                                                        fontSize={"small"}
                                                        fill='#503B0D'
                                                    />
                                                </Bar>
                                            }
                                            {selectMode.refrig &&
                                                <Bar dataKey='cabinet' stackId={'a'} fill={color.cabinet} barSize={40}>
                                                    <LabelList
                                                        dataKey={values => percentOf(values, 'cabinet')}
                                                        fontSize={"small"}
                                                        fill='#503B0D'
                                                    />
                                                </Bar>
                                            }
                                            {selectMode.air &&
                                                <Bar dataKey='air' stackId={'a'} fill={color.air} barSize={40}>
                                                    <LabelList
                                                        dataKey={values => percentOf(values, 'air')}
                                                        fontSize={"small"}
                                                        fill='#503B0D'
                                                    />
                                                </Bar>
                                            }
                                            {selectMode.chiller &&
                                                <Bar dataKey='chiller' stackId={'a'} fill={color.chiller} barSize={40}>
                                                    <LabelList
                                                        dataKey={values => percentOf(values, 'chiller')}
                                                        fontSize={"small"}
                                                        fill='#503B0D'
                                                    />
                                                </Bar>
                                            }
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                    }
                </div>
            </div>
            {!!data?.length &&
                <div className="pb-1" id="part3">
                    <div className={`${!saving && "shadow-md"} rounded-xl py-2 my-2 border flex justify-between px-3 max-sm:px-2`}
                    >
                        <div className={`w-[85%] justify-around grid  grid-cols-1 items-center  ${!isMini ? "lg:flex sm:grid-cols-3 max-sm:grid-cols-2 max-lg:ml-1 max-xs:grid-cols-1" : "sm:flex xs:grid-cols-2 max-xs:ml-1"}`}>
                            <label className='flex cursor-pointer select-none items-center my-1'>
                                <div className='relative'>
                                    <input type='checkbox' checked={toggle.total} className='sr-only'
                                        onChange={onChangeToggle} name="total" />
                                    <div className={`box block h-6 w-11 rounded-full ${toggle.total ? 'bg-warning' : 'bg-gray-200'}`} />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.total ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;ทั้งหมด
                            </label>

                            <div className={`self-center flex ${isMini && "hidden"}`}>
                                <label className='flex cursor-pointer select-none items-center my-1'>
                                    <div className='relative'>
                                        <input type='checkbox' checked={toggle.chiller} className='sr-only'
                                            onChange={onChangeToggle} name="chiller" />
                                        <div className={`box block h-6 w-11 rounded-full ${toggle.chiller ? 'bg-secondary' : 'bg-gray-200'}`} />
                                        <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.chiller ? 'translate-x-full left-2' : 'left-1'} `}
                                        />
                                    </div>
                                    &nbsp;ระบบChiller
                                </label>
                            </div>

                            <label className='flex cursor-pointer select-none items-center my-1'>
                                <div className='relative'>
                                    <input type='checkbox' checked={toggle.air} className='sr-only'
                                        onChange={onChangeToggle} name="air" />
                                    <div className={`box block h-6 w-11 rounded-full ${toggle.air ? 'bg-lemon' : 'bg-gray-200'}`} />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.air ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;{isMini ? "ระบบปรับอากาศ" : "AHU"}
                            </label>

                            <label className='flex cursor-pointer select-none items-center my-1'>
                                <div className='relative'>
                                    <input type='checkbox' checked={toggle.cabinet} className='sr-only'
                                        onChange={onChangeToggle} name="cabinet" />
                                    <div className={`box block h-6 w-11 rounded-full ${toggle.cabinet ? 'bg-blue' : 'bg-gray-200'}`} />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.cabinet ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;ระบบตู้แช่
                            </label>

                            <label className={`flex cursor-pointer select-none items-center my-1 ${isMini && "hidden"}`}>
                                <div className='relative'>
                                    <input type='checkbox' checked={toggle.lighting} className='sr-only'
                                        onChange={onChangeToggle} name="lighting" />
                                    <div className={`box block h-6 w-11 rounded-full ${toggle.lighting ? 'bg-orange' : 'bg-gray-200'}`} />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.lighting ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;ระบบแสงสว่าง
                            </label>

                            <label className='flex cursor-pointer select-none items-center my-1'>
                                <div className='relative'>
                                    <input type='checkbox' checked={toggle.other} className='sr-only'
                                        onChange={onChangeToggle} name="other" />
                                    <div className={`box block h-6 w-11 rounded-full ${toggle.other ? 'bg-danger' : 'bg-gray-200'}`} />
                                    <div className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition 
                                ${toggle.other ? 'translate-x-full left-2' : 'left-1'} `}
                                    />
                                </div>
                                &nbsp;อื่นๆ
                            </label>
                        </div>

                        <div className={`rounded-md bg-primary text-white items-center sm:max-w-[80px] sm:w-full py-1.5 text-center md:mx-2 h-fit whitespace-nowrap ${!isMini ? "md:self-center px-2" : "sm:self-center md:px-4 px-2"} cursor-pointer`}
                            onClick={sortDatas} >
                            ดูข้อมูล
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EnergyRanking