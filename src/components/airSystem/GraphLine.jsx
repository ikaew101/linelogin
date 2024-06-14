import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import MonthName from "../../const/month"
import dayTh from "../../const/day"

export default function GraphLine({ data, datetime, dataKey, dot, color, config, qMin }) {
    const customTooltip = ({ active, payload }) => {
        const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip min-w-[190px] py-1 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs'>
                    <div className="p-2 font-bold text-dark mr-4">
                        {`${datetime || payload[0].payload.date} - ${payload[0].payload.time}`}
                    </div>

                    <div className='w-full flex justify-between px-2 pb-2' style={{ color: color }}>
                        <div className='flex items-center justify-center font-bold'>
                            อุณหภูมิ
                        </div>
                        <div className=''>
                            <b>{payload[0].payload.temp?.toLocaleString('en-US', optionDigit)
                                || '-'} </b>
                            °C
                        </div>
                    </div>
                </div>
            )
        }
    }


    data?.map((ele, i) => {
        ele.time = ('0' + new Date(ele.xAxis).getUTCHours()).slice(-2) + ':' + ('0' + new Date(ele.xAxis).getUTCMinutes()).slice(-2)
        // ele[dataKey] = ele[dataKey] < 0 ? 0 : ele[dataKey]

        const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
        const dayThai = dayTh[(new Date(date).getDay())]

        const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
        ele.date = `${dayThai}, ${startTh}`
    })

    return (
        <div className="grid grid-cols-1" >
            <div className={`scrollbar overflow-x-auto`}>
                <div className="relative min-w-[1670px]">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={data}
                            margin={{ top: 30, right: 36, left: -18, bottom: 0 }}
                        >
                            <CartesianGrid vertical={true} />
                            <XAxis
                                dataKey="time"
                                interval={qMin == 5 ? 0 : qMin == 60 ? 0 : 3}
                                axisLine={false}
                                tickLine={false}
                                fontSize={14}
                            // tickFormatter={val => (new Date(val).toLocaleString([], { hour: "numeric", minute: "numeric", hour12: false }))}
                            />
                            <YAxis
                                dataKey="temp"
                                axisLine={false}
                                tickLine={false}
                                // interval={0}
                                fontSize={14}
                            />
                            <Area type="monotone" dataKey="temp" stroke={color} fill={color} fillOpacity="0.2" strokeWidth={2}
                                activeDot={{ r: 7 }}
                            />

                            <Tooltip
                                content={customTooltip}
                                wrapperStyle={{ outline: 'none' }}
                            />
                            <ReferenceLine x={('0' + config?.openTime).slice(-5)} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา เปิดสาขา', fontSize: 14 }} />
                            <ReferenceLine x={('0' + config?.closeTime).slice(-5)} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา ปิดสาขา', fontSize: 14 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}