import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import dayTh from "../../const/day";
import { useContext } from "react";
import AppContext from "../../context/appContext";

function BarChartThisWeek({ data, isLoading, saving }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const isData = payload[0].payload?.value //payload[0].payload.xAxis
            return (
                isData ? <>
                    <div className='flex flex-col items-center border-0 text-dark'>
                        <div className='z-50 min-w-[10em] rounded-lg bg-white border text-xs pb-2'>
                            <div className="p-2 mr-8 font-bold pb-1">
                                {payload[0].payload.day}, {payload[0].payload.dateFull}
                            </div>
                            {/* <div className={`flex justify-between p-2 pb-1.5 `}>
                                <div className={`font-semibold pr-5 text-[#0095FF]`}>การใช้ไฟฟ้า</div>
                                <label><b>
                                    {isData ?
                                        payload[0].payload?.value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                                        : 0}
                                </b> kwh</label>
                            </div> */}
                            <div className={`flex justify-between px-2 py-1 ${isData && "opacity-90"}`}>
                                <div className={`text-[#0095FF] font-semibold pr-8`}>เปิด</div>
                                <label>
                                    {/* <b> */}
                                    {payload[0].payload?.open?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '-'}
                                    {/* </b> kwh */}
                                    &nbsp;({(payload[0].payload?.open / payload[0].payload?.value * 100).toFixed(2)}%)
                                </label>
                            </div>
                            <div className={`flex justify-between px-2 py-1 ${isData && "opacity-90"}`}>
                                <div className={`text-[#3CD856] font-semibold pr-4`}>ก่อนเปิด</div>
                                <label>
                                    {/* <b> */}
                                    {payload[0].payload?.beforeOpen?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '-'}
                                    {/* </b> kwh */}
                                    &nbsp;({(payload[0].payload?.beforeOpen / payload[0].payload?.value * 100).toFixed(2)}%)
                                </label>
                            </div>
                            <div className={`flex justify-between px-2 py-1 ${isData && "opacity-90"}`}>
                                <div className={`text-primary font-semibold pr-4`}>ปิด</div>
                                <label>
                                    {/* <b> */}
                                    {payload[0].payload?.close?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '-'}
                                    {/* </b> kwh */}
                                    &nbsp;({(payload[0].payload?.close / payload[0].payload?.value * 100).toFixed(2)}%)
                                </label>
                            </div>
                            <div className={`flex justify-between px-2 py-1 ${isData && "opacity-90"}`}>
                                <div className={`text-warning font-semibold pr-4`}>ปิด - ไม่มีกิจกรรม</div>
                                <label>
                                    {/* <b> */}
                                    {payload[0].payload?.closeNonAct?.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '-'}
                                    {/* </b> kwh */}
                                    &nbsp;({(payload[0].payload?.closeNonAct / payload[0].payload?.value * 100).toFixed(2)}%)
                                </label>
                            </div>
                        </div>
                    </div>
                </>
                    : ""
            );
        }
        return null;
    }

    const formatYAxis = (tickItem) => {
        if (tickItem > 10e2) {
            return `${(tickItem / 1000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
    }

    data?.map((ele, i) => {
        const date = new Date(ele.xAxis)

        ele.day = dayTh[(new Date(date).getDay())]
        ele.date = new Date(date).toLocaleString('th-GB', { day: 'numeric', month: 'short', year: "2-digit" })
        ele.dateFull = new Date(date).toLocaleString('th-GB', { day: 'numeric', month: 'long', year: "2-digit" })
    })

    const percentOf = (values, label) => {
        const percent = values[label] / values.value * 100
        // if (Math.round(percent) >= 5) {
        if (percent > 4.5) {
            return `${percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}%`
        } else {
            return ''
        }
    }
    const { statusSave } = useContext(AppContext)
    return (
        <div className="grid mb-3">
            {!data?.length ?
                <div className="flex justify-center h-10 rounded items-center my-4 mx-auto text-dark">
                    ไม่พบข้อมูล
                </div>
                :
                <div className='scrollbar overflow-x-auto '>
                    <div className="max-md:min-w-[600px]">
                        <ResponsiveContainer width={statusSave && data.length <= 7 ? 800 : "100%"} height={350}>
                            <BarChart
                                barGap={-1}
                                width={500}
                                height={300}
                                data={data?.sort((a, b) => new Date(a.xAxis) - new Date(b.xAxis))}
                                margin={{
                                    top: 15,
                                    right: 10,
                                    left: -15,
                                    bottom: 0
                                }}
                            >
                                <CartesianGrid vertical={true} />
                                <XAxis dataKey="date" fontSize={14} interval={0} tickLine={false} axisLine={false}
                                />
                                <YAxis fontSize={14} tickFormatter={formatYAxis} tickLine={false} axisLine={false}
                                    domain={['auto', dataMax => (dataMax * 1.1)]} tickCount={5}
                                />
                                {data?.length &&
                                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                                }

                                <Bar dataKey="closeNonAct" stackId="a" fill="#FFBC29" isAnimationActive={false}>
                                    <LabelList
                                        dataKey={values => percentOf(values, 'closeNonAct')}
                                        fontSize={"small"}
                                        fill='#565E6D'
                                        fontWeight={600}
                                    />
                                </Bar>

                                <Bar dataKey="close" stackId="a" fill="#00C2B8" isAnimationActive={false} >
                                    <LabelList
                                        dataKey={values => percentOf(values, 'close')}
                                        fontSize={"small"}
                                        fill='#565E6D'
                                        fontWeight={600}
                                    />
                                </Bar>
                                <Bar dataKey="beforeOpen" stackId="a" fill="#3CD856" isAnimationActive={false}>
                                    <LabelList
                                        dataKey={values => percentOf(values, 'beforeOpen')}
                                        fontSize={"small"}
                                        fill='#565E6D'
                                        fontWeight={600}
                                    />
                                </Bar>
                                <Bar dataKey="open" stackId="a" fill="#0095FF" isAnimationActive={false}
                                    label={{
                                        dataKey: (values => values.flag ? values.value : ""),
                                        position: "top", fill: "#565E6D", fontSize: 'small', fontStyle: 'bold', fontWeight: 600,
                                        formatter: (val => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                                    }}
                                >
                                    <LabelList
                                        dataKey={values => percentOf(values, 'open')}
                                        fontSize={"small"}
                                        fill='#565E6D'
                                        fontWeight={600}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            }
        </div>
    )
}

export default BarChartThisWeek