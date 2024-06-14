import React, { useContext, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import AppContext from "../../context/appContext";

export default function TotalEnergy24HrsBySystem({ data, datetime, color, isMini, config }) {
    const customTooltip = ({ active, payload }) => {
        const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip min-w-[190px] pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs'>
                    <div className="p-2 font-bold text-dark mr-4">{`${datetime} - ${payload[0].payload.xAxis}`}</div>
                    {toggle.chiller &&
                        <div className={`w-full flex justify-between px-2 py-1 ${(isMini || !data.chiller) && 'hidden'}`}>
                            <div className='flex items-center justify-center font-bold'
                                style={{ color: color.chiller }}>
                                ระบบChiller
                            </div>
                            <div className='text-dark'>
                                <b>{payload.find(payl => payl.dataKey == "chiller")?.value?.toLocaleString('en-US', optionDigit)} </b>
                                kWh
                            </div>
                        </div>
                    }
                    {toggle.air &&
                        <div className={`w-full flex justify-between px-2 py-1 ${(!data.ahu) && 'hidden'}`}>
                            <div className='flex items-center justify-center text-primary font-bold'
                                style={{ color: color.air }}>
                                {isMini ? "ระบบปรับอากาศ" : "AHU"}
                            </div>
                            <div className='text-dark'>
                                <b>{payload.find(payl => payl.dataKey == "air")?.value?.toLocaleString('en-US', optionDigit)} </b>
                                kWh
                            </div>
                        </div>
                    }
                    {toggle.refrig &&
                        <div className={`w-full flex justify-between px-2 py-1 ${(!data.refrig) && 'hidden'}`}>
                            <div className='flex items-center justify-center text-warning font-bold'
                                style={{ color: color.refrig }}>
                                ระบบตู้แช่
                            </div>
                            <div className='text-dark'>
                                <b>{payload.find(payl => payl.dataKey == "refrig")?.value?.toLocaleString('en-US', optionDigit)} </b>
                                kWh
                            </div>
                        </div>
                    }
                    {toggle.lighting &&
                        <div className={`w-full flex justify-between px-2 py-1 ${(isMini || !data.lighting) && 'hidden'}`}>
                            <div className='flex items-center justify-center text-warning font-bold'
                                style={{ color: color.lighting }}>
                                ระบบแสงสว่าง
                            </div>
                            <div className='text-dark'>
                                <b>{payload.find(payl => payl.dataKey == "lighting")?.value?.toLocaleString('en-US', optionDigit)} </b>
                                kWh
                            </div>
                        </div>
                    }
                    {toggle.other &&
                        <div className={`w-full flex justify-between px-2 py-1 ${(!data.other) && 'hidden'}`}>
                            <div className='flex items-center justify-center text-warning font-bold'
                                style={{ color: color.other }}>
                                อื่นๆ
                            </div>
                            <div className='text-dark'>
                                <b>{payload.find(payl => payl.dataKey == "other")?.value?.toLocaleString('en-US', optionDigit)} </b>
                                kWh
                            </div>
                        </div>
                    }
                </div>
            )
        }
    }

    data.ahu?.map(ele => {
        ele.ahu = ele.ahu < 0 ? null : ele.ahu
    })
    data.refrig?.map(ele => {
        ele.refrig = ele.refrig < 0 ? null : ele.refrig
    })
    data.chiller?.map(ele => {
        ele.chiller = ele.chiller < 0 ? null : ele.chiller
    })
    data.lighting?.map(ele => {
        ele.lighting = ele.lighting < 0 ? null : ele.lighting
    })
    data.other?.map(ele => {
        ele.other = ele.other < 0 ? null : ele.other
    })
    const totalData = []
    const array24 = [...Array(24).keys()]
    array24.map((ele, i) => {
        if (data) {
            totalData.push({
                xAxis: `${i.toLocaleString(undefined, { minimumIntegerDigits: 2, useGrouping: false })}:00`,
                air: data.ahu && data.ahu[i]?.ahu ,
                refrig: data.refrig && data.refrig[i]?.refrig ,
                chiller: data.chiller && data.chiller[i]?.chiller ,
                lighting: data.lighting && data.lighting[i]?.lighting ,
                other: data.other && data.other[i]?.other ,
            })
        }
    })

    const formatValue = (tickItem) => {
        //     if (tickItem > 1e6) {
        //         return `${(tickItem / 1e6).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
        //     } else {
        return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        //     }
    }

    const [toggle, setToggle] = useState({
        air: true,
        refrig: true,
        chiller: true,
        lighting: true,
        other: true,
    })

    const { statusSave } = useContext(AppContext)
    return (
        <>
            {/* <div className='w-full shadow-basic rounded-xl pt-8 pr-6 pl-3'> */}
            <div className='pt-2'>
                {/* <div className='flex justify-between items-center pl-2'> */}
                <div className='flex items-center pl-2 pb-2'>
                    <img src="icon/24h-orange.png" className="w-10 h-10 mr-2" />
                    {/* <div className='rounded-full h-fit mr-3'>
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="33" height="33" rx="16.5" fill="#FF6B1E" />
                            <path d="M17.005 18.0031C17.6033 18.003 18.188 18.1819 18.6838 18.5167C19.1797 18.8515 19.5641 19.3269 19.7878 19.8818C20.0114 20.4368 20.0639 21.0459 19.9387 21.631C19.8135 22.216 19.5162 22.7503 19.085 23.1651L17.175 25.0031H20.005V27.0031H14.005L14.004 25.2791L17.698 21.7241C17.8172 21.6095 17.9061 21.4672 17.9568 21.3098C18.0075 21.1524 18.0184 20.985 17.9885 20.8224C17.9586 20.6597 17.8889 20.5071 17.7856 20.378C17.6822 20.249 17.5485 20.1476 17.3964 20.0829C17.2442 20.0182 17.0784 19.9922 16.9138 20.0073C16.7491 20.0224 16.5908 20.078 16.453 20.1693C16.3151 20.2606 16.202 20.3846 16.1239 20.5303C16.0457 20.6759 16.0049 20.8387 16.005 21.0041H14.005C14.0049 20.61 14.0824 20.2198 14.2331 19.8557C14.3838 19.4916 14.6047 19.1608 14.8833 18.8821C15.1619 18.6034 15.4927 18.3823 15.8567 18.2315C16.2208 18.0807 16.611 18.0031 17.005 18.0031ZM23.005 18.0031V22.0031H25.005V18.0031H27.005V27.0031H25.005V24.0031H21.005V18.0031H23.005ZM9.00501 17.0031C9.00377 18.2026 9.27283 19.3871 9.7922 20.4684C10.3116 21.5497 11.0679 22.5002 12.005 23.2491V25.6651C10.4843 24.7875 9.22152 23.525 8.34378 22.0044C7.46604 20.4838 7.00429 18.7588 7.00501 17.0031H9.00501ZM17.005 7.00305C22.19 7.00305 26.454 10.9501 26.955 16.0031H24.943C24.7399 14.3905 24.0505 12.8781 22.9666 11.667C21.8827 10.4559 20.4557 9.60367 18.8755 9.22365C17.2953 8.84363 15.6368 8.95388 14.1208 9.53971C12.6047 10.1255 11.3031 11.1592 10.389 12.5031H13.005V14.5031H7.00501V8.50305H9.00501V11.0031C9.93567 9.76023 11.1433 8.75157 12.5321 8.0572C13.9208 7.36283 15.4524 7.00189 17.005 7.00305Z" fill="white" />
                        </svg>
                    </div> */}
                    <div className='text-lg font-bold text-[#828282]'>
                        กราฟการใช้ไฟฟ้ารวม 24 ชม. แยกตามระบบ (kWh)
                    </div>
                </div>

                <ResponsiveContainer width={statusSave ? 1270 : '100%'} height={500}>
                    <LineChart
                        data={totalData}
                        margin={{ top: 40, right: 39, left: 0, bottom: 10 }}
                        syncId='syncTooltip'
                    >
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey="xAxis"
                            // interval={1}
                            axisLine={false}
                            tickLine={false}
                            fontSize={14}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            // label={{
                            //     value: 'Energy Consumption',
                            //     angle: -90,
                            //     dx: 5,
                            //     dy: 20,
                            //     position: 'insideLeft',
                            //     fill: '#A3A3A3'
                            // }}
                            // domain={[0, 100]}
                            fontSize={14}
                            tickFormatter={formatValue}
                        />

                        <Tooltip
                            content={customTooltip}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        {toggle.air &&
                            <Line
                                type="monotone"
                                dataKey="air"
                                stroke={color.air}
                                strokeWidth={2}
                                activeDot={{ r: 7 }}
                                dot={false}
                            />}
                        {toggle.refrig &&
                            <Line
                                type="monotone"
                                dataKey="refrig"
                                stroke={color.refrig}
                                strokeWidth={2}
                                activeDot={{ r: 7, stroke: '#fff', strokeWidth: 4 }}
                                dot={false}
                            />}
                        {!isMini && <>
                            {toggle.chiller &&
                                <Line
                                    type="monotone"
                                    dataKey="chiller"
                                    stroke={color.chiller}
                                    // strokeDasharray="10 10"
                                    strokeWidth={2}
                                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 4 }}
                                    dot={false}
                                />}
                            {toggle.lighting &&
                                <Line
                                    type="monotone"
                                    dataKey="lighting"
                                    stroke={color.lighting}
                                    strokeWidth={2}
                                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 4 }}
                                    dot={false}
                                />}
                        </>}
                        {toggle.other &&
                            <Line
                                type="monotone"
                                dataKey="other"
                                stroke={color.other}
                                strokeWidth={2}
                                activeDot={{ r: 7, stroke: '#fff', strokeWidth: 4 }}
                                dot={false}
                            />}
                        <ReferenceLine x={totalData.find((ele, i) => config.openTime == (`${i}:00`))?.xAxis} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา เปิดสาขา', fontSize: 14 }} />
                        <ReferenceLine x={totalData.find((ele, i) => config.closeTime == (`${i}:00`))?.xAxis} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา ปิดสาขา', fontSize: 14 }} />
                    </LineChart>
                </ResponsiveContainer>

                <div className='flex gap-6 justify-center items-center mb-2 max-xs:grid grid-cols-3 max-xs: ml-5'>
                    <div className={`flex items-center ${(isMini || !data.chiller) && 'hidden'} cursor-pointer ${!toggle.chiller && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, chiller: !toggle.chiller })}>
                        <div className='h-4 w-4 bg-[#809DED] min-w-[15px] rounded-full'
                            style={{ background: color.chiller }} />
                        <div className='text-base ml-5'>ระบบChiller</div>
                    </div>
                    <div className={`flex items-center ${!data.ahu && 'hidden'} cursor-pointer ${!toggle.air && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, air: !toggle.air })}>
                        <div className='h-4 w-4 bg-lemon min-w-[15px] rounded-full'
                            style={{ background: color.ahu }} />
                        <div className='text-base ml-5'>{isMini ? "ระบบปรับอากาศ" : "AHU"}</div>
                    </div>
                    <div className={`flex items-center ${!data.refrig && 'hidden'} cursor-pointer ${!toggle.refrig && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, refrig: !toggle.refrig })}>
                        <div className='h-4 w-4 bg-[#56CCF2] min-w-[15px] rounded-full'
                            style={{ background: color.refrig }} />
                        <div className='text-base ml-5'>ระบบตู้แช่</div>
                    </div>
                    <div className={`flex items-center ${(isMini || !data.lighting) && 'hidden'} cursor-pointer ${!toggle.lighting && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, lighting: !toggle.lighting })}>
                        <div className='h-4 w-4 bg-[#F2994A] min-w-[15px] rounded-full'
                            style={{ background: color.lighting }} />
                        <div className='text-base ml-5'>ระบบแสงสว่าง</div>
                    </div>
                    <div className={`flex items-center ${!data.other && 'hidden'} cursor-pointer ${!toggle.other && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, other: !toggle.other })}>
                        <div className='h-4 w-4 bg-[#F03030] min-w-[15px] rounded-full'
                            style={{ background: color.other }} />
                        <div className='text-base ml-5'>อื่นๆ</div>
                    </div>
                </div>
            </div>
        </>
    );
}