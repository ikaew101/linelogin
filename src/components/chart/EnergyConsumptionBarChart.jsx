import React, { useContext, useState } from 'react';
import { BarChart, Bar, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import AppContext from '../../context/appContext';


export default function EnergyConsumptionBarChart({ data, isMini }) {
    const color = {
        total: '#F9BE00',
        lighting: '#F89C22',
        refrig: '#88D3E6',
        air: '#C3D311',
        chiller: '#809DED',
        other: '#E1221C'
    }

    const barChartData = [
        {
            name: "ทั้งหมด",
            value: data?.total,
            fill: color.total,
            color: color.total,
            key: "total"
        },
        {
            name: "ระบบChiller",
            value: data?.chiller,
            fill: color.chiller,
            key: "chiller"
        },
        {
            name: isMini ? "ระบบปรับอากาศ" : "AHU",
            value: data?.airConditioner || data?.ahu,
            fill: color.air,
            key: "air"
        },
        {
            name: "ระบบตู้แช่",
            value: (data?.refrig),
            fill: color.refrig,
            key: "refrig"
        },
        {
            name: "ระบบแสงสว่าง",
            value: data?.lighting,
            fill: color.lighting,
            key: "lighting"
        },
        {
            name: "อื่นๆ",
            value: data?.other,
            fill: color.other,
            key: "other"
        },
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs min-w-[120px]'>
                    {payload.map((value, index) => (
                        <div key={index} className='w-full flex justify-between px-2 py-1.5'>
                            <div className={`flex items-center justify-center font-bold mr-5`}
                                style={{ color: value.payload.fill }}>
                                {label}
                            </div>
                            <div className='text-dark'>
                                <b>{value.payload.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) || 0} </b>
                                kWh
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    const formatValue = (tickItem) => {
        if (tickItem > 10e3) {
            // new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value / 1000) + " k"
            return `${(tickItem / 10e3).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }
    }

    const [toggle, setToggle] = useState({
        air: true,
        refrig: true,
        chiller: true,
        lighting: true,
        other: true,
        total: true
    })

    const { statusSave } = useContext(AppContext)
    return (
        <>
            <div className='pt-2'>
                <div className='flex justify-between items-center pl-2'>
                    <div className='flex items-center'>
                        <img src="icon/graph.png" className="w-10 h-10 mr-2" />
                        <div className='text-lg font-bold text-[#828282]'>
                            การใช้พลังงานในแต่ละวัน - kWh (กราฟแท่ง)
                        </div>
                    </div>
                </div>

                <div className={` py-5 md:mx-5 px-2 ${isMini ? "flex justify-around" : "grid grid-cols-3  max-xs:grid-cols-2"}`}>
                    <div className={`w-fit flex items-center ${!data.total && 'hidden'} cursor-pointer ${!toggle.total && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, total: !toggle.total })}>
                        <div className={`h-4 w-4 min-w-[15px] rounded-full mx-2`}
                            style={{ background: color.total }} />
                        <div className='text-base '>ทั้งหมด</div>
                    </div>
                    <div className={`w-fit flex items-center ${!data.chiller && 'hidden'} cursor-pointer ${!toggle.chiller && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, chiller: !toggle.chiller })}>
                        <div className='h-4 w-4 bg-[#809DED] min-w-[15px] rounded-full mx-2'
                            style={{ background: color.chiller }} />
                        <div className='text-base'>ระบบChiller</div>
                    </div>
                    <div className={`w-fit flex items-center ${!data.ahu && 'hidden'} cursor-pointer ${!toggle.air && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, air: !toggle.air })}>
                        <div className='h-4 w-4 bg-lemon min-w-[15px] rounded-full mx-2'
                            style={{ background: color.ahu }} />
                        <div className='text-base'>{isMini ? "ระบบปรับอากาศ" : "AHU"}</div>
                    </div>
                    <div className={`w-fit flex items-center ${!data.refrig && 'hidden'} cursor-pointer ${!toggle.refrig && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, refrig: !toggle.refrig })}>
                        <div className='h-4 w-4 bg-[#56CCF2] min-w-[15px] rounded-full mx-2'
                            style={{ background: color.refrig }} />
                        <div className='text-base'>ระบบตู้แช่</div>
                    </div>
                    <div className={`w-fit flex items-center ${!data.lighting && 'hidden'} cursor-pointer ${!toggle.lighting && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, lighting: !toggle.lighting })}>
                        <div className='h-4 w-4 bg-[#F2994A] min-w-[15px] rounded-full mx-2'
                            style={{ background: color.lighting }} />
                        <div className='text-base'>ระบบแสงสว่าง</div>
                    </div>
                    <div className={`w-fit flex items-center ${!data.other && 'hidden'} cursor-pointer ${!toggle.other && 'opacity-50'}`}
                        onClick={() => setToggle({ ...toggle, other: !toggle.other })}>
                        <div className='h-4 w-4 bg-[#F03030] min-w-[15px] rounded-full mx-2'
                            style={{ background: color.other }} />
                        <div className='text-base'>อื่นๆ</div>
                    </div>
                </div>
                <ResponsiveContainer width={statusSave ? 620 : '100%'} height={290} className={'-ml-6'}>
                    <BarChart
                        data={barChartData.filter(data => data.value).filter(data => (toggle[data.key]))}
                        layout="vertical" //ปรับแนวตั้งเป็นแนวนอน และต้องเปลี่ยนการเขียนตรงแกรน xAxis yAxis ด้วย
                        margin={{
                            left: -15,
                        }}
                    >
                        {data.total && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis
                            type="number"
                            padding="2"
                            domain={[0, dataMax => (dataMax * 1.3)]}
                            tickFormatter={formatValue}
                            // tickFormatter={value => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value / 1000) + " k"}
                            fontSize={14}
                            tickCount={9}
                        />
                        <YAxis type="category"
                            dataKey={"name"}
                            tick={false}
                        />
                        {data.total &&
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                        }
                        <Bar dataKey="value"
                            className='xs:text-[15px] text-sm'
                            label={{
                                dataKey: "value", position: "right", fill: "#000",
                                formatter: (val => val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })),
                            }}
                            isAnimationActive={!statusSave}
                        >
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}
