import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import MonthName from "../../const/month"
import dayTh from "../../const/day"
import { useContext } from "react"
import AppContext from "../../context/appContext"

export default function GraphLine({ data, color, config, thaiKey, interval1hr, dot, datetime }) {
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
                            {thaiKey}
                        </div>
                        <div className=''>
                            <b>{payload[0].payload.value?.toLocaleString('en-US', optionDigit)} </b>
                            {thaiKey == "ความสว่าง" ? "Lux" : "kWh"}
                        </div>
                    </div>
                </div>
            )
        }
    }

    data?.map((ele, i) => {
        ele.time = ('0' + new Date(ele.xAxis).getUTCHours()).slice(-2) + ':' + ('0' + new Date(ele.xAxis).getUTCMinutes()).slice(-2)

        const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
        const dayThai = dayTh[(new Date(date).getDay())]

        const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
        ele.date = `${dayThai}, ${startTh}`
    })

    const { statusSave } = useContext(AppContext)
    const formatYAxis = (tickItem) => {
        if (tickItem > 10e2) {
            return `${(tickItem / 1000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
    }

    return (
        <div className="grid grid-cols-1" >
            {data ?
                <div className="overflow-auto scrollbar" >
                    <div className={`${interval1hr ? "min-w-[900px]" : "min-w-[1700px]"} `} >
                        <ResponsiveContainer width={statusSave ? 1700 : "100%"} height={400}>
                            <AreaChart
                                data={data}
                                margin={{ top: 30, right: 20, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid vertical={true} />
                                <XAxis
                                    dataKey="time"
                                    interval={interval1hr ? 0 : 1}
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={14}
                                // tickFormatter={val => (new Date(val).toLocaleString([], { hour: "numeric", minute: "numeric", hour12: false }))}
                                />
                                <YAxis
                                    dataKey="value"
                                    axisLine={false}
                                    tickLine={false}
                                    // interval={0}
                                    fontSize={14}
                                    tickFormatter={formatYAxis}
                                />
                                <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity="0.2" strokeWidth={2}
                                    activeDot={{ r: 7 }}
                                    dot={dot && { r: 2, stroke: color, strokeWidth: 4 }}
                                    isAnimationActive={false}
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
                :
                <div className="flex justify-center h-10 rounded items-center my-4 text-dark">
                    ไม่พบข้อมูล
                </div>
            }
        </div>
    )
}