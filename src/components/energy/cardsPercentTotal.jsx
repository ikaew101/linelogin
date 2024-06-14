function CardsPercentOfTotal({ data, isMini, isLoading }) {
    const toPercent = (value) => {
        const percent = value?.toFixed(2) / data?.total?.toFixed(2) * 100
        if (percent) {
            return percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        } else {
            return 0
        }
    }

    const optionNumber = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

    return (
        <>
            <div className={`grid ${!isMini ? "lg:grid-cols-6 md:grid-cols-3 grid-cols-2" : "md:grid-cols-4 grid-cols-2"} gap-3 justify-center mx-auto py-3 `}
                id="part1">
                <div className="border rounded-xl flex flex-col justify-start bg-cover bg-bottom"
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        ทั้งหมด
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-energy.svg' /> */}
                        <img src="icon/total.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            : data?.total > 0
                                ?
                                <>
                                    <b className="text-xl">{data?.total.toLocaleString('en-US', optionNumber) || 'x'}</b><br />
                                    <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    <div className="pt- pb-1 text-[#1D367C] text-sm">
                                        {data?.total && '100.00'}% ของทั้งหมด
                                    </div>
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.total == -999 ? '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
                <div className={`border rounded-xl flex flex-col justify-start bg-cover bg-bottom ${isMini && "hidden"}`}
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        ระบบChiller
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-chiller.svg' /> */}
                        <img src="icon/chiller.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            // : data?.chiller >= 0
                            : data?.chiller > 0
                                ? <>
                                    <b className="text-xl">
                                        {data?.chiller == '-999' ? '-' : data?.chiller.toLocaleString('en-US', optionNumber)}</b><br /> <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    <div className="pt- pb-1 text-[#1D367C] text-sm" hidden={data?.chiller == '-999'}>
                                        {toPercent(data?.chiller)}% ของทั้งหมด
                                    </div>
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.chiller == -999  ? '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
                <div className="border rounded-xl flex flex-col justify-start bg-cover bg-bottom"
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        {isMini ? "ระบบปรับอากาศ" : "AHU"}
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-air.svg' /> */}
                        <img src="icon/ahu.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            : data?.ahu > 0 // data?.ahu > 0 || data?.airConditioner > 0
                                ? <>
                                    <b className="text-xl">
                                        {(data?.ahu == '-999' ? '-' : data?.ahu?.toLocaleString('en-US', optionNumber))}
                                    </b><br /> <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    <div className="pt- pb-1 text-[#1D367C] text-sm" hidden={data?.ahu == '-999'}>
                                        {toPercent(data?.ahu)}% ของทั้งหมด
                                    </div>
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.ahu == -999  ? '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
                <div className="border rounded-xl flex flex-col justify-start bg-cover bg-bottom"
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        ระบบตู้แช่
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-refrigerator.svg' /> */}
                        <img src="icon/refrig.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            : data?.refrig > 0 //data?.refrig > 0 || data?.cabinet > 0
                                ? <>
                                    <b className="text-xl">
                                        {/* {isMini ?
                                            (data?.refrig == '-999' ? '-' : data?.refrig?.toLocaleString('en-US', optionNumber))
                                            : (data?.cabinet == '-999' ? '-' : (data?.refrig || data?.cabinet) ?.toLocaleString('en-US', optionNumber))
                                        } */}
                                        {(data?.refrig == '-999') ? '-'
                                            : (data?.refrig)?.toLocaleString('en-US', optionNumber)}
                                    </b><br /> <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    {(data?.refrig != '-999') ?
                                        <div className="pt- pb-1 text-[#1D367C] text-sm"
                                        // hidden={data?.cabinet == '-999'}
                                        >
                                            {toPercent(data?.refrig)}% ของทั้งหมด
                                            {/* {toPercent(isMini ? data?.refrig : (data?.refrig || data?.cabinet) )}% ของทั้งหมด */}
                                        </div>
                                        : <> <br /><br /> </>
                                    }
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.refrig == -999   ? '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
                <div className={`border rounded-xl flex flex-col justify-start bg-cover bg-bottom ${isMini && "hidden"}`}
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        ระบบแสงสว่าง
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-lighting.svg' /> */}
                        <img src="icon/lightings.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            : data?.lighting > 0 //data?.lighting > 0
                                ? <>
                                    <b className="text-xl">
                                        {data?.lighting == '-999' ? '-' : data?.lighting.toLocaleString('en-US', optionNumber)}</b><br /> <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    <div className="pt- pb-1 text-[#1D367C] text-sm" hidden={data?.lighting == '-999'}>
                                        {toPercent(data?.lighting)}% ของทั้งหมด
                                    </div>
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.lighting == -999  ?  '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
                <div className="border rounded-xl flex flex-col justify-start bg-cover bg-bottom"
                    style={{ backgroundImage: "url('/img/bg_bluecard.png')" }}>
                    <div className="pb-4 p-2 flex justify-between">
                        อื่นๆ
                        {/* <img className='h-[25px] mr-1 inline' src='img/icon-others.svg' /> */}
                        <img src="icon/others.png" className="w-8 h-8" />
                    </div>
                    <center>
                        {isLoading
                            ? <>
                                <br /> <br /><br />
                            </>
                            : data?.other > 0 //data?.other > 0
                                ? <>
                                    <b className="text-xl">
                                        {data?.other == '-999' ? '-' : data?.other.toLocaleString('en-US', optionNumber)}</b><br /> <span className="text-[#BDBDBD] text-sm">kWh</span>
                                    <div className="pt- pb-1 text-[#1D367C] text-sm" hidden={data?.other == '-999'}>
                                        {toPercent(data?.other)}% ของทั้งหมด
                                    </div>
                                </>
                                : <>
                                    <span className="text-[#BDBDBD]"> {data?.other == -999  ? '-' : 'ไม่พบข้อมูล'} </span>
                                    <br /> <br /><br />
                                </>
                        }
                    </center>
                </div>
            </div>
        </>
    )
}

export default CardsPercentOfTotal