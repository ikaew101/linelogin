import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayTh from "../../const/day";
import MonthName from "../../const/month";
import Spinner from "../spinner";
import ExportTypes from "../exportTypes";
import { useContext } from "react";
import AppContext from "../../context/appContext";

function BarGraphThisMonth({ data, isLoading, saving }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const isData = payload[0].payload?.total //payload[0].payload.xAxis
            return (
                <>
                    <div className='flex flex-col items-center border-0 text-dark'>
                        <div className='z-50 min-w-[10em] rounded-lg bg-white border text-xs py-1'>
                            <div className="p-2 mr-8 font-bold pb-0">{payload[0].payload.dayDate}</div>
                            <div className={`flex justify-between px-2 py-1.5 ${isData && "opacity-90"}`}>
                                <div className={`text-warning font-semibold pr-4`}>การใช้พลังงานรวม</div>
                                <label>
                                    <b>
                                        {isData.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
                                        {/* {isData ?
                                        payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
                                        : '-'} */}
                                    </b> kwh</label>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    }

    const formatYAxis = (tickItem) => {
        if (tickItem > 10e5) {
            return `${(tickItem / 1000000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
    }

    const Month_Short = [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
    ]

    // data?.map((ele, i) => {
    //     const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
    //     const dayThai = dayTh[(new Date(date).getDay())]

    //     const dateThai = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
    //     const dateTh = new Date(date).getDate() + " " + Month_Short[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
    //     ele.dayDate = `${dayThai}, ${dateThai}`
    //     ele.date = `${dateTh}`
    // })
    const dataYear = (new Date().getMonth() == 0 && new Date().getDate() == 1) ? new Date().getFullYear() - 1 : new Date().getFullYear()
    const dataMonth = new Date(data[0]?.xAxis).getMonth() || (new Date().getMonth() - (new Date().getDate() == 1 && 1))
    const lastDayOfMonth = new Date(dataYear, dataMonth + 1, 0).getDate()
    const arrayMonth = [...Array(lastDayOfMonth).keys()]
    // console.log(dataMonth,  new Date().getDate())
    arrayMonth.map((ele, i) => {
        // const dateI = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1)
        const dateI = new Date(new Date().getFullYear(), dataMonth, i + 1)
        // const dateI = new Date(new Date(data[i]?.xAxis).getTime() + new Date(data[i]?.xAxis).getTimezoneOffset() * 60000)

        const dayThai = dayTh[(new Date(dateI).getDay())]
        const dateThai = dateI.toLocaleString('th-GB', { day: 'numeric', month: 'long', year: "2-digit" })
        const idx = data.findIndex(ele => new Date(ele.xAxis).getDate() == i + 1)

        arrayMonth[i] = {
            date: dateI.toLocaleString('th-GB', { day: 'numeric', month: 'short', year: "2-digit" }),
            total: data[idx]?.total > 0 ? data[idx]?.total : 0,
            dayDate: `${dayThai}, ${dateThai}`,
            xAxis: data[i]?.xAxis
        }
    })
    const { statusSave } = useContext(AppContext)
    return (
        <div className={`bg-white ${!saving && ""} ${saving != 'JPEG' && 'shadow'} border mt-4 mx-2 rounded-xl `}>
            <div id={`graphEnergyConsumption_M${new Date().getMonth() + 1}`} className="p-3">
                <div className="flex gap-1 items-center">
                    <img src="icon/graph.png" className="w-10 h-10" />

                    <div className='font-bold text-[#828282]'>
                        การใช้ไฟฟ้ารวม ตั้งแต่ต้นเดือน จนถึงปัจจุบัน
                    </div>
                </div>

                {!data
                    ? <div className="flex justify-center items-center h-16 my-10"><Spinner size="lg" /></div>
                    : <>
                        <div className="flex items-center justify-between pr-5 xs:max-w-[320px]">
                            <div className="col-span-1 text-sm text-secondary font-semibold py-4 max-[1280px]:pl-3 pl-0">
                                การใช้พลังงานรวม (kWh)
                            </div>
                        </div>

                        {/* <div className='scrollbar overflow-x-auto col-span-3 :mx-5 mt-3  px-5 shadow bg-white rounded-2xl shadow-basic-gray min-w-[315px] max-[1280px]:ml-0 ml-5'> */}
                        <div className="grid">
                            <div className='scrollbar overflow-x-auto max-[1280px]:pl-5'>
                                <div className="min-w-[720px]">
                                    <ResponsiveContainer width={statusSave ? 1280 : '100%'} height={270}>
                                        <BarChart
                                            barGap={-1}
                                            width={500}
                                            height={300}
                                            data={arrayMonth}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 0,
                                                bottom: 25
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" fontSize={14} interval={0}
                                                tick={(props) => {
                                                    return (
                                                        <g transform={`translate(${props.x},${props.y}) rotate(-45)`}>
                                                            <text x={0} y={0} dy={7} textAnchor='end' fill="#565E6D" fontSize={13} >
                                                                {props.payload.value}
                                                            </text>
                                                        </g>
                                                    )
                                                }} />
                                            <YAxis fontSize={14} domain={[0, 'auto']} tickFormatter={formatYAxis} allowDataOverflow={false} />
                                            {data.length &&
                                                <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                                            }
                                            <Bar dataKey="total" fill="#F9BF00"
                                            // barSize={50}
                                            isAnimationActive={!statusSave}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <ExportTypes id={`graphEnergyConsumption_M${new Date().getMonth() + 1}`} />
        </div>
    )
}

export default BarGraphThisMonth