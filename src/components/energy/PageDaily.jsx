import React, { useState, useEffect, useContext } from "react";
import CardBudgetActual from "../cardBudgetActual";
import InputSearch from "../inputSearch";
import EnergyConsumptionBarChart from "../chart/EnergyConsumptionBarChart";
import EnergyConsumptionPieChart from "../chart/EnergyConsumptionPieChart";
import TotalEnergy24HrsBySystem from "../chart/TotalEnergy24HrsBySystem";
import { FaRegCalendarAlt } from 'react-icons/fa'
import Swal from "sweetalert2";
import Spinner from "../spinner";
import DatePickerThai from "../DatePickerThai";
import CardsPercentOfTotal from "./cardsPercentTotal";
import dayTh from "../../const/day";
import MonthName from "../../const/month";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import EnergyService from "../../service/energy";
import AuthService from "../../service/authen";
import ExportTypes from "../exportTypes";
import ExportPage from "../exportPage";
import AppContext from "../../context/appContext";

function EnergyDaily({ userId, selectedStore, setSelectedStore, stores }) {
    const [search, setSearch] = useState('')
    const [data, setData] = useState()
    const lastDate = new Date().setDate(new Date().getDate() - 1)
    const [dateStart, setDateStart] = useState(lastDate)
    const [dateEnd, setDateEnd] = useState(lastDate)
    const [storeList, setStoreList] = useState()
    const [isLoading, setIsLoading] = useState(selectedStore.storeName)
    const [storeData, setStoreData] = useState(selectedStore)
    const [format, setFormat] = useState(selectedStore.format || 'mini');
    const [type, setType] = useState('');
    const [isMini, setIsMini] = useState(null)
    const color = {
        total: '#F9BE00',
        lighting: '#F89C22',
        refrig: '#88D3E6',
        air: '#C3D311',
        chiller: '#809DED',
        other: '#E1221C'
    }

    useEffect(() => {
        setSelectedStore(storeData)
    }, [storeData])

    useEffect(() => {
        setType('costCenter')
        getData()
    }, [])

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
        const typeFormat = type || 'costCenter'
        const searchValue = search || storeData[typeFormat]
        let resStore, findFormat, num5digit
        if (type != "storeName") num5digit = (('00000' + searchValue).slice(-5))
        resStore = stores[format]?.find(store => store[typeFormat] == (num5digit || searchValue))
        if (resStore) {
            setStoreData({
                costCenter: resStore?.costCenter || "",
                storeNumber: resStore?.storeNumber || "",
                storeName: resStore?.storeName || "",
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
            setIsLoading(false)
            setSearch('')
        } else if (!resStore) {
            if (stores.hyper?.find(store => store[typeFormat] == searchValue)) findFormat = ('hyper')
            if (stores.super?.find(store => store[typeFormat] == searchValue)) findFormat = ('super')
            if (stores.mini?.find(store => store[typeFormat] == searchValue)) findFormat = ('mini')
            resStore = stores[findFormat]?.find(store => store[typeFormat] == searchValue)
            setStoreData({ ...storeData, format: findFormat })
        }
        setIsMini(resStore?.storeFormatName.startsWith('Mini'))

        try {
            setIsLoading(true)
            await AuthService.refreshTokenPage(userId)
            // localStorage.setItem("_auth_storage", new Date().toISOString())
            const res = await EnergyService.getDaily(resStore.id, {
                startDate: new Date(dateStart).toISOString().split('T')[0],
                endDate: new Date(dateEnd).toISOString().split('T')[0],
                mode: "agg",
                flag: 1
            })
            setData(res.data)
            if (!res.data.card1.budget.criteriaStatus) {
                Swal.fire({
                    text: 'พบข้อมูลไม่สมบูรณ์ ในวันที่เลือก',
                    icon: 'warning',
                    confirmButtonColor: '#809DED',
                    confirmButtonText: 'OK',
                    iconColor: '#FFBC29',
                    showCloseButton: true,
                })
            }
            setIsLoading(false)
            localStorage.setItem("_id", resStore.id)
            setSearch('')
        } catch (err) {
            setData()
            setIsLoading(false)
        }
    }

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

    const datetime = () => {
        const dayThai = dayTh[(new Date(dateStart).getDay())]
        const start = new Date(dateStart).toLocaleDateString()
        const end = new Date(dateEnd).toLocaleDateString()

        const startTh = new Date(dateStart).getDate() + " " + MonthName[new Date(dateStart).getMonth()] + " " + (new Date(dateStart).getFullYear() + 543).toLocaleString().slice(-2)
        const endTh = new Date(dateEnd).getDate() + " " + MonthName[new Date(dateEnd).getMonth()] + " " + (new Date(dateEnd).getFullYear() + 543).toLocaleString().slice(-2)
        if (start == end) {
            return `${dayThai}, ${startTh}`
        } else {
            return `${startTh} - ${endTh}`
        }
    }
    const [saving, setSaving] = useState(false)
    const classGraph2Col = `min-[800px]:grid min-[800px]:grid-cols-2 grid-cols-1 ${saving && '!grid !grid-cols-2'}`
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
                        {/* <div className="grid grid-cols-4 text-sm mt-3 px-2 h-fit lg:grid-cols-2 xl:grid-cols-4 min-w-[50vw]"> */}
                        <div className="self-start grid grid-cols-4 max-lg:grid-cols-2 text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2">
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
                                currentData={storeData}
                            />
                            <button className={`z-30 text-white bg-primary h-[2.5em] px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400`}
                                onClick={() => { getData() }}
                                disabled={isLoading}>
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
                                    maxDate={lastDate}
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
                    <ExportPage onSaving={setSaving} name="Energy Daily"
                        arrayId={[
                            "cardTotal_kwh ActualBudget",
                            { parts: "charts", length: 2, id: ["BarChart ", "PieChart "] },
                            // "charts",
                            "graphDailyTotalEnergy_",
                            // "graphs"
                            {
                                parts: "graphs", length: !isMini ? 6 : 4,
                                id: !isMini
                                    ? ["graphDailyTotal_", "graphDailyChiller_", "graphDailyAir_", "graphDailyRefrig_", "graphDailyLighting_", "graphDailyOther_"]
                                    : ["graphDailyTotal_", "graphDailyAir_", "graphDailyRefrig_", "graphDailyOther_"]
                            },
                        ]}
                        hasDateOnTop
                        responsiveWidth={800}
                    />
                </div>
            </div >

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
                            className={`bg-[#009B93] py-2 rounded-md text-white max-lg:w-full lg:min-w-[250px]  md:max-w-[90%] max-lg:mx-auto`}
                        >
                            รายวัน
                        </button>
                        <button name='ranking'
                            className={`py-2 max-md:px-5 max-sm:px-3 rounded-md text-white max-lg:w-full lg:min-w-[250px] md:max-w-[90%] max-lg:mx-auto`}
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
                                <div className="self-start grid grid-cols-4 max-lg:grid-cols-2 text-sm pl-3 pr-2 h-fit grid-flow-row lg:min-w-[50vw] md:min-w-[40vw] gap-2">
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
                                        currentData={storeData}
                                    />
                                    <button className={`z-30 text-white bg-primary h-[2.5em] px-8 rounded-md self-end ${!saving && "shadow"} hover:shadow-md font-medium disabled:bg-gray-400`}
                                        onClick={() => { getData() }}
                                        disabled={isLoading}>
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
                                            maxDate={lastDate}
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
                    </div >
                </div>
            </div>

            <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 py-3 px-2`}>
                <div id="cardTotal_kwh ActualBudget" className="px-2">
                    {isMini != null &&
                        // <CardsPercentOfTotal data={isMini ? data?.card1?.summary : data?.sumEnergy} isMini={isMini} isLoading={isLoading} />
                        <CardsPercentOfTotal data={data?.card1?.budget?.criteriaStatus && data?.card1?.summary} isMini={isMini} isLoading={isLoading} />
                    }

                    <div className="mx-auto py-4 pt-1">
                        <CardBudgetActual data={data?.card1?.budget} loading={isLoading} />
                    </div>
                </div>
                <ExportTypes id="cardTotal_kwh ActualBudget" />
            </div>

            {isLoading
                ? <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4 p-3`}>
                    <div className="flex justify-center items-center h-14 my-10"><Spinner /></div>
                </div>
                :
                data?.card1?.budget?.criteriaStatus && data?.card1?.summary.total ?
                    <>
                        <div className={classGraph2Col}
                            id="charts">
                            <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4`}
                            >
                                <div id={`BarChart `} className="p-3 h-full">
                                    <EnergyConsumptionBarChart data={data?.card1?.budget?.criteriaStatus && data?.card2} isMini={isMini} />
                                </div>

                                <div className="place-self-end -mt-8">
                                    <ExportTypes id={`BarChart `} optionPDF={{ height: .5 }} />
                                </div>
                            </div>
                            <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 grid`}>
                                <div>
                                    <div id={`PieChart `} className="p-3 h-full">
                                        <EnergyConsumptionPieChart data={data?.card1?.budget?.criteriaStatus && data?.card3} color={color} isMini={isMini} />
                                    </div>
                                    <div className="place-self-end -mt-8">
                                        <ExportTypes id={`PieChart `} optionPDF={{ height: .5 }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1" >
                            <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 col-span-2 `}
                                id="graphAll">
                                <div id={`graphDailyTotalEnergy_`} className="p-3">
                                    <TotalEnergy24HrsBySystem data={data?.card1?.budget?.criteriaStatus && data?.card4} datetime={datetime()} config={data?.config} color={color} isMini={isMini} />
                                </div>
                                <ExportTypes id={`graphDailyTotalEnergy_`} />
                            </div>
                        </div>

                        <div id="graphs">
                            {!isMini ? <>
                                <div className={classGraph2Col}
                                // id={!isMini && "part3"} hidden={isMini}
                                >
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4`}>
                                        <div id={`graphDailyTotal_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <img className=' mr-3 inline' src='img/icon-yellow24.svg' /> */}
                                                    <img src="icon/24h-yellow.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้ารวม 24 ชม.(kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {(data?.card1?.summary?.total)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card5} dataKey="total" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyTotal_`} optionPDF={{ height: .5 }} />
                                    </div>

                                    {/* {!isMini && */}
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card6 && 'hidden'}`}>
                                        <div id={`graphDailyChiller_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="33" height="33" rx="16.5" fill="#809DED" />
                                                <path d="M25.7089 20.6777L24.1816 19.7955C24.458 19.5108 24.775 19.2686 25.1223 19.0767C25.3493 18.9487 25.5166 18.7362 25.5877 18.4854C25.6588 18.2347 25.628 17.966 25.5019 17.7378C25.3758 17.5097 25.1647 17.3406 24.9146 17.2674C24.6645 17.1941 24.3955 17.2227 24.1663 17.3468C23.5032 17.7138 22.9156 18.2031 22.4346 18.7888L18.4765 16.5L22.4337 14.2153C22.9146 14.8011 23.5022 15.2904 24.1654 15.6573C24.2791 15.7214 24.4043 15.7623 24.5339 15.7777C24.6635 15.7932 24.7948 15.7828 24.9204 15.7472C25.0459 15.7116 25.1632 15.6515 25.2654 15.5703C25.3676 15.4892 25.4527 15.3886 25.5158 15.2744C25.5789 15.1602 25.6188 15.0346 25.6331 14.9049C25.6474 14.7752 25.6359 14.6439 25.5992 14.5187C25.5626 14.3934 25.5015 14.2767 25.4194 14.1752C25.3374 14.0737 25.2361 13.9895 25.1214 13.9273C24.7741 13.7353 24.4572 13.4931 24.1807 13.2086L25.708 12.3263C25.8249 12.2638 25.9279 12.1785 26.0111 12.0754C26.0943 11.9723 26.156 11.8536 26.1923 11.7262C26.2287 11.5988 26.2391 11.4654 26.2229 11.3339C26.2067 11.2024 26.1643 11.0756 26.0981 10.9608C26.0318 10.8461 25.9432 10.7458 25.8375 10.666C25.7318 10.5862 25.6111 10.5284 25.4826 10.4962C25.3541 10.464 25.2204 10.4579 25.0895 10.4783C24.9586 10.4988 24.8332 10.5453 24.7207 10.6152L23.1933 11.4971C23.0845 11.1152 23.0328 10.7193 23.0397 10.3223C23.0425 10.1923 23.0197 10.063 22.9725 9.94186C22.9253 9.82068 22.8546 9.71002 22.7646 9.6162C22.6745 9.52239 22.5668 9.44727 22.4477 9.39515C22.3285 9.34304 22.2003 9.31495 22.0703 9.3125H22.0518C21.7929 9.31245 21.5443 9.41405 21.3595 9.59542C21.1746 9.77679 21.0684 10.0235 21.0636 10.2824C21.0496 11.0397 21.1792 11.7928 21.4454 12.502L17.4882 14.788V10.219C18.2359 10.0955 18.9534 9.83129 19.6027 9.44053C19.8272 9.30524 19.9888 9.08631 20.0519 8.83189C20.115 8.57747 20.0744 8.30841 19.9392 8.08389C19.8039 7.85937 19.5849 7.69778 19.3305 7.63468C19.0761 7.57159 18.807 7.61214 18.5825 7.74742C18.2422 7.95198 17.8734 8.10503 17.4882 8.20158V6.70703C17.4882 6.44492 17.3841 6.19355 17.1988 6.00821C17.0134 5.82287 16.7621 5.71875 16.4999 5.71875C16.2378 5.71875 15.9865 5.82287 15.8011 6.00821C15.6158 6.19355 15.5117 6.44492 15.5117 6.70703V8.20158C15.1265 8.10503 14.7577 7.95198 14.4174 7.74742C14.1928 7.61214 13.9238 7.57159 13.6694 7.63468C13.4149 7.69778 13.196 7.85937 13.0607 8.08389C12.9254 8.30841 12.8849 8.57747 12.948 8.83189C13.0111 9.08631 13.1727 9.30524 13.3972 9.44053C14.0465 9.83129 14.764 10.0955 15.5117 10.219V14.788L11.5545 12.502C11.8211 11.7926 11.951 11.0392 11.9372 10.2815C11.9324 10.0226 11.8262 9.77589 11.6413 9.59452C11.4565 9.41315 11.2079 9.31156 10.9489 9.3116H10.9296C10.7998 9.314 10.6718 9.34194 10.5528 9.39383C10.4338 9.44573 10.3262 9.52055 10.2362 9.61404C10.1461 9.70752 10.0753 9.81783 10.0279 9.93867C9.98048 10.0595 9.95732 10.1885 9.95977 10.3183C9.96701 10.7159 9.91539 11.1123 9.80658 11.4948L8.27924 10.6152C8.16676 10.5481 8.04208 10.5041 7.91243 10.4856C7.78277 10.4671 7.65074 10.4746 7.524 10.5076C7.39726 10.5406 7.27834 10.5984 7.17415 10.6778C7.06997 10.7571 6.98259 10.8564 6.9171 10.9698C6.85161 11.0832 6.80932 11.2085 6.79268 11.3384C6.77604 11.4683 6.78538 11.6002 6.82017 11.7265C6.85495 11.8527 6.91449 11.9708 6.99531 12.0739C7.07613 12.1769 7.17662 12.2629 7.29096 12.3268L8.8183 13.209C8.54182 13.4936 8.22485 13.7358 7.87764 13.9278C7.76288 13.9899 7.66157 14.0742 7.57955 14.1756C7.49753 14.2771 7.43642 14.3939 7.39975 14.5191C7.36308 14.6443 7.35158 14.7756 7.3659 14.9053C7.38022 15.035 7.42009 15.1606 7.48321 15.2748C7.54632 15.389 7.63143 15.4896 7.73362 15.5708C7.83581 15.6519 7.95307 15.712 8.07861 15.7476C8.20415 15.7832 8.33551 15.7936 8.46508 15.7782C8.59466 15.7627 8.7199 15.7218 8.83357 15.6577C9.49668 15.2907 10.0843 14.8014 10.5653 14.2157L14.5234 16.5L10.5662 18.7847C10.0852 18.199 9.49758 17.7098 8.83447 17.3427C8.7208 17.2786 8.59556 17.2377 8.46598 17.2223C8.3364 17.2068 8.20505 17.2172 8.07951 17.2528C7.95396 17.2884 7.83671 17.3485 7.73452 17.4297C7.63233 17.5108 7.54722 17.6114 7.48411 17.7256C7.42099 17.8398 7.38112 17.9654 7.3668 18.0951C7.35247 18.2248 7.36398 18.3561 7.40065 18.4813C7.43732 18.6066 7.49843 18.7233 7.58045 18.8248C7.66247 18.9263 7.76378 19.0105 7.87853 19.0727C8.22575 19.2647 8.54272 19.5069 8.8192 19.7914L7.29096 20.6777C7.17662 20.7416 7.07613 20.8276 6.99531 20.9306C6.91449 21.0337 6.85495 21.1518 6.82017 21.278C6.78538 21.4043 6.77604 21.5362 6.79268 21.6661C6.80932 21.796 6.85161 21.9213 6.9171 22.0347C6.98259 22.1481 7.06997 22.2474 7.17415 22.3267C7.27834 22.4061 7.39726 22.4639 7.524 22.4969C7.65074 22.5299 7.78277 22.5374 7.91243 22.5189C8.04208 22.5004 8.16676 22.4564 8.27924 22.3893L9.80658 21.5074C9.91536 21.8893 9.96713 22.2852 9.96021 22.6821C9.95565 22.944 10.0552 23.1969 10.2369 23.3854C10.4187 23.5739 10.6678 23.6825 10.9296 23.6875H10.948C11.207 23.6875 11.4556 23.586 11.6404 23.4046C11.8253 23.2232 11.9315 22.9765 11.9363 22.7176C11.9502 21.9603 11.8207 21.2072 11.5545 20.498L15.5117 18.212V22.781C14.764 22.9045 14.0465 23.1687 13.3972 23.5595C13.1727 23.6948 13.0111 23.9137 12.948 24.1681C12.8849 24.4225 12.9254 24.6916 13.0607 24.9161C13.196 25.1406 13.4149 25.3022 13.6694 25.3653C13.9238 25.4284 14.1928 25.3879 14.4174 25.2526C14.7577 25.048 15.1265 24.895 15.5117 24.7984V26.293C15.5117 26.5551 15.6158 26.8064 15.8011 26.9918C15.9865 27.1771 16.2378 27.2812 16.4999 27.2812C16.7621 27.2812 17.0134 27.1771 17.1988 26.9918C17.3841 26.8064 17.4882 26.5551 17.4882 26.293V24.7984C17.8734 24.895 18.2422 25.048 18.5825 25.2526C18.807 25.3879 19.0761 25.4284 19.3305 25.3653C19.5849 25.3022 19.8039 25.1406 19.9392 24.9161C20.0744 24.6916 20.115 24.4225 20.0519 24.1681C19.9888 23.9137 19.8272 23.6948 19.6027 23.5595C18.9534 23.1687 18.2359 22.9045 17.4882 22.781V18.212L21.4454 20.498C21.1788 21.2074 21.0489 21.9608 21.0627 22.7185C21.0675 22.9774 21.1737 23.2241 21.3586 23.4055C21.5434 23.5869 21.792 23.6884 22.0509 23.6884H22.0703C22.2 23.686 22.3281 23.6581 22.4471 23.6062C22.5661 23.5543 22.6737 23.4794 22.7637 23.386C22.8538 23.2925 22.9246 23.1822 22.972 23.0613C23.0194 22.9405 23.0426 22.8115 23.0401 22.6817C23.0329 22.2841 23.0845 21.8877 23.1933 21.5052L24.7207 22.387C24.8331 22.4592 24.9591 22.5079 25.0909 22.53C25.2227 22.5522 25.3576 22.5474 25.4875 22.5159C25.6174 22.4844 25.7396 22.4268 25.8466 22.3468C25.9536 22.2667 26.0433 22.1658 26.1102 22.0501C26.1771 21.9344 26.2198 21.8063 26.2358 21.6736C26.2518 21.5409 26.2407 21.4063 26.2032 21.2781C26.1657 21.1498 26.1025 21.0304 26.0176 20.9272C25.9326 20.8241 25.8276 20.7392 25.7089 20.6777Z" fill="white" />
                                            </svg> */}
                                                    <img src="icon/chiller.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้าจากระบบChiller 24 ชม. (kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {data?.card1?.summary?.chiller == '-999' ? '-'
                                                            : (data?.card1?.summary?.chiller)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card6} dataKey="chiller" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyChiller_`} optionPDF={{ height: .5 }} />
                                    </div>
                                    {/* } */}
                                </div>
                                <div className={classGraph2Col}>
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card7 && 'hidden'}`}>
                                        <div id={`graphDailyAir_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <img className=' mr-3 inline' src='img/icon-air.svg' /> */}
                                                    <img src="icon/ahu.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้าจาก{isMini ? "ระบบปรับอากาศ" : " AHU"} 24 ชม. (kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {data?.card1?.summary?.ahu == '-999' ? '-'
                                                            : (data?.card1?.summary?.ahu)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card7} dataKey="ahu" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyAir_`} optionPDF={{ height: .5 }} />
                                    </div>
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card9 && 'hidden'}`}>
                                        <div id={`graphDailyRefrig_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <img className=' mr-3 inline' src='img/icon-refrigerator.svg' /> */}
                                                    <img src="icon/refrig.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้าจากระบบตู้แช่ 24 ชม. (kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {data?.card1?.summary?.refrig == '-999' ? '-'
                                                            : (data?.card1?.summary?.refrig)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card9} dataKey="refrig" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyRefrig_`} optionPDF={{ height: .5 }} />
                                    </div>
                                </div>
                                <div className={classGraph2Col}>
                                    {/* {!isMini && */}
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card8 && 'hidden'}`}>
                                        <div id={`graphDailyLighting_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <img className=' mr-3 inline' src='img/icon-lighting.svg' /> */}
                                                    <img src="icon/lightingGraph.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้าจากระบบแสงสว่าง 24 ชม. (kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {data?.card1?.summary?.lighting == '-999' ? '-'
                                                            : (data?.card1?.summary?.lighting)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card8} dataKey="lighting" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyLighting_`} optionPDF={{ height: .5 }} />
                                    </div>
                                    {/* } */}
                                    <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 `}>
                                        <div id={`graphDailyOther_`} className="p-3">
                                            <div className='flex justify-between items-center pl-2 pt-2'>
                                                <div className='flex items-center'>
                                                    {/* <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="33" height="33" rx="16.5" fill="#E1221C" />
                                            <path d="M19.6146 22.9688C19.8063 22.9688 19.974 22.8969 20.1177 22.7531C20.2615 22.6094 20.3333 22.4417 20.3333 22.25C20.3333 22.0583 20.2615 21.8906 20.1177 21.7469C19.974 21.6031 19.8063 21.5313 19.6146 21.5313C19.4229 21.5313 19.2552 21.6031 19.1115 21.7469C18.9677 21.8906 18.8958 22.0583 18.8958 22.25C18.8958 22.4417 18.9677 22.6094 19.1115 22.7531C19.2552 22.8969 19.4229 22.9688 19.6146 22.9688ZM22.25 22.9688C22.4417 22.9688 22.6094 22.8969 22.7531 22.7531C22.8969 22.6094 22.9688 22.4417 22.9688 22.25C22.9688 22.0583 22.8969 21.8906 22.7531 21.7469C22.6094 21.6031 22.4417 21.5313 22.25 21.5313C22.0583 21.5313 21.8906 21.6031 21.7469 21.7469C21.6031 21.8906 21.5313 22.0583 21.5313 22.25C21.5313 22.4417 21.6031 22.6094 21.7469 22.7531C21.8906 22.8969 22.0583 22.9688 22.25 22.9688ZM24.8854 22.9688C25.0771 22.9688 25.2448 22.8969 25.3885 22.7531C25.5323 22.6094 25.6042 22.4417 25.6042 22.25C25.6042 22.0583 25.5323 21.8906 25.3885 21.7469C25.2448 21.6031 25.0771 21.5313 24.8854 21.5313C24.6938 21.5313 24.526 21.6031 24.3823 21.7469C24.2385 21.8906 24.1667 22.0583 24.1667 22.25C24.1667 22.4417 24.2385 22.6094 24.3823 22.7531C24.526 22.8969 24.6938 22.9688 24.8854 22.9688ZM9.79167 25.125C9.26458 25.125 8.81321 24.9372 8.43754 24.5615C8.06188 24.1858 7.87436 23.7348 7.875 23.2083V9.79167C7.875 9.26458 8.06283 8.81321 8.4385 8.43754C8.81417 8.06188 9.26522 7.87436 9.79167 7.875H23.2083C23.7354 7.875 24.1868 8.06283 24.5625 8.4385C24.9381 8.81417 25.1256 9.26522 25.125 9.79167V16.2125C24.8215 16.0688 24.5101 15.9448 24.1906 15.8407C23.8712 15.7365 23.5438 15.6608 23.2083 15.6135V9.79167H9.79167V23.2083H15.5896C15.6375 23.5597 15.7135 23.8951 15.8177 24.2146C15.9218 24.534 16.0454 24.8375 16.1885 25.125H9.79167ZM9.79167 22.25V23.2083V9.79167V15.6135V15.5417V22.25ZM11.7083 20.3333C11.7083 20.6049 11.8003 20.8326 11.9843 21.0166C12.1683 21.2006 12.3958 21.2923 12.6667 21.2917H15.6135C15.6615 20.9563 15.7375 20.6288 15.8416 20.3094C15.9458 19.9899 16.0614 19.6785 16.1885 19.375H12.6667C12.3951 19.375 12.1674 19.467 11.9834 19.651C11.7994 19.835 11.7077 20.0624 11.7083 20.3333ZM11.7083 16.5C11.7083 16.7715 11.8003 16.9993 11.9843 17.1833C12.1683 17.3673 12.3958 17.459 12.6667 17.4583H17.5542C18.0653 16.9792 18.6364 16.5799 19.2677 16.2604C19.8989 15.941 20.5736 15.7253 21.2917 15.6135C21.1479 15.5816 20.9882 15.5615 20.8125 15.5532C20.6368 15.5449 20.4771 15.541 20.3333 15.5417H12.6667C12.3951 15.5417 12.1674 15.6337 11.9834 15.8177C11.7994 16.0017 11.7077 16.2291 11.7083 16.5ZM11.7083 12.6667C11.7083 12.9382 11.8003 13.166 11.9843 13.35C12.1683 13.534 12.3958 13.6256 12.6667 13.625H20.3333C20.6049 13.625 20.8326 13.533 21.0166 13.349C21.2006 13.165 21.2923 12.9376 21.2917 12.6667C21.2917 12.3951 21.1997 12.1674 21.0157 11.9834C20.8317 11.7994 20.6042 11.7077 20.3333 11.7083H12.6667C12.3951 11.7083 12.1674 11.8003 11.9834 11.9843C11.7994 12.1683 11.7077 12.3958 11.7083 12.6667ZM22.25 27.0417C20.9243 27.0417 19.7941 26.5743 18.8594 25.6396C17.9247 24.7049 17.4577 23.5751 17.4583 22.25C17.4583 20.9243 17.9257 19.7941 18.8604 18.8594C19.7951 17.9247 20.9249 17.4577 22.25 17.4583C23.5757 17.4583 24.7059 17.9257 25.6406 18.8604C26.5753 19.7951 27.0423 20.9249 27.0417 22.25C27.0417 23.5757 26.5743 24.7059 25.6396 25.6406C24.7049 26.5753 23.5751 27.0423 22.25 27.0417Z" fill="white" />
                                        </svg> */}
                                                    <img src="icon/otherGraph.png" className="w-10 h-10 mr-2" />
                                                    <div className='text-lg font-bold text-[#828282]'>
                                                        การใช้ไฟฟ้าจากระบบอื่นๆ 24 ชม. (kWh)
                                                    </div>
                                                </div>
                                                {data?.card1?.budget?.criteriaStatus &&
                                                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                        {data?.card1?.summary?.other == '-999' ? '-'
                                                            : (data?.card1?.summary?.other)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                    </div>
                                                }
                                            </div>
                                            <GraphLine data={data?.card10} dataKey="other" datetime={datetime()} config={data?.config} />
                                        </div>
                                        <ExportTypes id={`graphDailyOther_`} optionPDF={{ height: .5 }} />
                                    </div>
                                </div>
                            </>
                                : <>
                                    <div className={classGraph2Col}
                                        id={isMini && "part3"}>
                                        <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4`}>
                                            <div id={`graphDailyTotal_`} className="p-3">
                                                <div className='flex justify-between items-center pl-2 pt-2'>
                                                    <div className='flex items-center'>
                                                        {/* <img className=' mr-3 inline' src='img/icon-yellow24.svg' /> */}
                                                        <img src="icon/24h-yellow.png" className="w-10 h-10 mr-2" />
                                                        <div className='text-lg font-bold text-[#828282]'>
                                                            การใช้ไฟฟ้ารวม 24 ชม.(kWh)
                                                        </div>
                                                    </div>
                                                    {data?.card1?.budget?.criteriaStatus &&
                                                        <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                            {data?.card1?.summary?.total == '-999' ? '-'
                                                            : (data?.card1?.summary?.total)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                        </div>
                                                    }
                                                </div>
                                                <GraphLine data={data?.card5} dataKey="total" datetime={datetime()} config={data?.config} />
                                            </div>
                                            <ExportTypes id={`graphDailyTotal_`} optionPDF={{ height: .5 }} />
                                        </div>

                                        <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card7 && 'hidden'}`}>
                                            <div id={`graphDailyAir_`} className="p-3">
                                                <div className='flex justify-between items-center pl-2 pt-2'>
                                                    <div className='flex items-center'>
                                                        <img src="icon/ahu.png" className="w-10 h-10 mr-2" />
                                                        <div className='text-lg font-bold text-[#828282]'>
                                                            การใช้ไฟฟ้าจาก{isMini ? "ระบบปรับอากาศ" : " AHU"} 24 ชม. (kWh)
                                                        </div>
                                                    </div>
                                                    {data?.card1?.budget?.criteriaStatus &&
                                                        <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                            {data?.card1?.summary?.ahu == '-999' ? '-'
                                                            : (data?.card1?.summary?.ahu)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                        </div>
                                                    }
                                                </div>
                                                <GraphLine data={data?.card7} dataKey="ahu" datetime={datetime()} config={data?.config} />
                                            </div>
                                            <ExportTypes id={`graphDailyAir_`} optionPDF={{ height: .5 }} />
                                        </div>
                                    </div>
                                    <div className={classGraph2Col}>

                                        <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 ${!data?.card9 && 'hidden'}`}>
                                            <div id={`graphDailyRefrig_`} className="p-3">
                                                <div className='flex justify-between items-center pl-2 pt-2'>
                                                    <div className='flex items-center'>
                                                        <img src="icon/refrig.png" className="w-10 h-10 mr-2" />
                                                        <div className='text-lg font-bold text-[#828282]'>
                                                            การใช้ไฟฟ้าจากระบบตู้แช่ 24 ชม. (kWh)
                                                        </div>
                                                    </div>
                                                    {data?.card1?.budget?.criteriaStatus &&
                                                        <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                            {data?.card1?.summary?.refrig == '-999' ? '-'
                                                            : (data?.card1?.summary?.refrig)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                        </div>
                                                    }
                                                </div>
                                                <GraphLine data={data?.card9} dataKey="refrig" datetime={datetime()} config={data?.config} />
                                            </div>
                                            <ExportTypes id={`graphDailyRefrig_`} optionPDF={{ height: .5 }} />
                                        </div>

                                        <div className={`bg-white ${!saving && "shadow"} border mx-2 rounded-xl mt-4 `}>
                                            <div id={`graphDailyOther_`} className="p-3">
                                                <div className='flex justify-between items-center pl-2 pt-2'>
                                                    <div className='flex items-center'>
                                                        <img src="icon/otherGraph.png" className="w-10 h-10 mr-2" />
                                                        <div className='text-lg font-bold text-[#828282]'>
                                                            การใช้ไฟฟ้าจากระบบอื่นๆ 24 ชม. (kWh)
                                                        </div>
                                                    </div>
                                                    {data?.card1?.budget?.criteriaStatus &&
                                                        <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                                                            {data?.card1?.summary?.other == '-999' ? '-'
                                                            : (data?.card1?.summary?.other)?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kWh
                                                        </div>
                                                    }
                                                </div>
                                                <GraphLine data={data?.card10} dataKey="other" datetime={datetime()} config={data?.config} />
                                            </div>
                                            <ExportTypes id={`graphDailyOther_`} optionPDF={{ height: .5 }} />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                    :
                    <div hidden className='bg-white shadow border mx-2 rounded-xl mt-4 p-3'>
                        <div className="flex justify-center h-16 bg-gray-50 rounded items-center my-10 text-dark">
                            ไม่พบข้อมูล
                        </div>
                    </div>
            }

        </>
    )
}

function GraphLine({ data, datetime, dataKey, config }) {

    const customTooltip = ({ active, payload }) => {
        const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip min-w-[190px] py-1 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs'>
                    <div className="p-2 font-bold text-dark mr-4">
                        {`${datetime} - ${payload[0].payload.xAxis}`}
                    </div>
                    <div className='w-full flex justify-between px-2 pb-1.5'>
                        <div className='flex items-center justify-center font-bold'
                            style={{ color: color[dataKey] }}>
                            การใช้พลังงาน
                        </div>
                        <div className='text-dark'>
                            <b>{payload[0].payload[dataKey]?.toLocaleString('en-US', optionDigit)} </b>
                            kWh
                        </div>
                    </div>
                </div>
            )
        }
    }

    const formatValue = (tickItem) => {
        //     if (tickItem > 1e6) {
        //         return `${(tickItem / 1e6).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
        //     } else {
        return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        //     }
    }

    const color = {
        total: '#F9BE00',
        lighting: '#F89C22',
        refrig: '#88D3E6',
        ahu: '#C3D311',
        chiller: '#809DED',
        other: '#E1221C'
    }

    data?.map((ele, i) => {
        // var utc = (new Date(ele.xAxis).toUTCString())
        // console.log(utc, '///',
        //     new Date(utc).getHours() + ":00"
        // )
        // ele.xAxis = `${new Date(ele.xAxis).getHours().toString()}`
        ele.xAxis = `${i.toLocaleString(undefined, { minimumIntegerDigits: 2, useGrouping: false })}:00`
        // ele.xAxis = new Date(
        //     new Date(new Date(new Date().setMinutes(0)).setHours(i)).setSeconds(0)
        // ).toLocaleString([], { hour: "numeric", minute: "numeric", second: "2-digit", hour12: false })
        ele[dataKey] = ele[dataKey] < 0 ? null : ele[dataKey]
    })

    const { statusSave } = useContext(AppContext)
    return (
        <div>
            <ResponsiveContainer width={statusSave ? 600 : "100%"} height={420}>
                <AreaChart
                    data={data}
                    margin={{ top: 40, right: 39, left: 0, bottom: 0 }}
                >
                    <CartesianGrid vertical={true} />
                    <XAxis
                        dataKey="xAxis"
                        // interval={1}
                        axisLine={false}
                        tickLine={false}
                        fontSize={14}
                    // tickFormatter={val => (new Date(val).toLocaleString([], { hour: "numeric", minute: "numeric", hour12: false }))}
                    />
                    <YAxis
                        dataKey={dataKey}
                        axisLine={false}
                        tickLine={false}
                        // interval={0}
                        fontSize={14}
                        tickFormatter={formatValue}
                    />
                    <Area type="monotone" dataKey={dataKey} stroke={color[dataKey]} fill={color[dataKey]} fillOpacity="0.2" strokeWidth={2}
                        isAnimationActive={false} />

                    <Tooltip
                        content={customTooltip}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <ReferenceLine x={data?.find((ele, i) => config.openTime == (`${i}:00`))?.xAxis} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา เปิดสาขา', fontSize: 14 }} />
                    <ReferenceLine x={data?.find((ele, i) => config.closeTime == (`${i}:00`))?.xAxis} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา ปิดสาขา', fontSize: 14 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default EnergyDaily