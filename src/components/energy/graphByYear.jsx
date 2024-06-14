import { useContext, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppContext from "../../context/appContext";

function GraphConsumptionByYear({ data, unit }) {
    function monthThai(value) {
        switch (value) {
            case "P01":
                return "ม.ค."
            case "P02":
                return "ก.พ."
            case "P03":
                return "มี.ค."
            case "P04":
                return "เม.ย."
            case "P05":
                return "พ.ค."
            case "P06":
                return "มิ.ย."
            case "P07":
                return "ก.ค."
            case "P08":
                return "ส.ค."
            case "P09":
                return "ก.ย."
            case "P10":
                return "ต.ค."
            case "P11":
                return "พ.ย."
            case "P12":
                return "ธ.ค."
            default:
                break;
        }
    }

    let dataGraph = [];
    data.map((item) => {
        if (data) {
            if (item.budget - item.actual < 0) {
                dataGraph.push({
                    month: monthThai(item.xAxis),
                    budget: item.budget,
                    actual: item.actual,
                    mid: 0,
                    ytdBudget: item.ytdBudget,
                    mid_ytd: 0,
                });
            } else {
                dataGraph.push({
                    month: monthThai(item.xAxis),
                    budget: item.budget,
                    actual: item.actual == -999 || item.actual < 0 ? '' : item.actual, // ให้กราฟแสดงค่าเป็น 0 ถ้าติด -
                    mid: item.budget - (item.actual == -999 || item.actual < 0 ? 0 : item.actual),
                    ytdBudget: item.ytdBudget,
                    mid_ytd: item.ytdBudget - item.budget,
                });
            }
        }
    })

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload) {
            if (payload.length > 1) {
                return (
                    <>
                        <div className='flex flex-col items-center border-0'>
                            <div className='z-50 min-w-[10em] px-2 rounded-lg bg-white border text-xs py-3'>
                                <div className='flex justify-between'>
                                    <div className={`text-[#00C2B8] font-semibold pr-2`}>งบประมาณ : </div>
                                    <label className=''>{payload[0]?.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}</label>
                                </div>
                                <div className='flex justify-between'>
                                    <div className="font-semibold text-red-bar pr-4">ใช้งานจริง : </div>
                                    <label className=''>
                                        {/* ของพี่ติว {payload[1]?.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit} */}
                                        {payload[1]?.value == -999 || payload[1]?.value === '' ? '-' : payload[1]?.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </>
                );
            } else {
                return (
                    <div className='flex flex-col items-center border-0'>
                        <div className='z-50 min-w-[10em] px-2 rounded-lg bg-white border text-xs py-3'>
                            {toggle.budget &&
                                <div className='flex justify-between'>
                                    <div className={`text-[#00C2B8] font-semibold pr-2`}>งบประมาณ : </div>
                                    <label className=''>{payload[0]?.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}</label>
                                </div>
                            }
                            {toggle.actual &&
                                <div className='flex justify-between'>
                                    <div className="font-semibold text-red-bar pr-4">ใช้งานจริง : </div>
                                    <label className=''>
                                        {payload[0]?.value == -999 || payload[0]?.value === '' ? '-' : payload[0]?.value?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}
                                    </label>
                                </div>
                            }
                        </div>
                    </div>
                )
            }
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

    const color = {
        budget: "#00C2B8",
        actual: "#FD4D4D",
    }

    const [toggle, setToggle] = useState({
        budget: true,
        actual: true,
    })

    const { statusSave } = useContext(AppContext)
    return (
        <>
            <div className="flex justify-between">
                <div className="xs:flex pt-4 ">
                    <div className="text-sm text-secondary sm:pr-20 font-semibold">การใช้พลังงานรวม ({unit})</div>

                    {/* <div className="grid grid-cols-2 items-start min-h-[40px] sm:pl-10 pl-5 pt-1 max-sm:pt-2">
                        <div className="flex items-start justify-center w-[6em]">
                            <div className={`w-4 h-4 bg-[${color.budget}] rounded-full`}></div>
                            <div className=" text-xs ml-2">งบประมาณ</div>
                        </div>
                        <div className="flex items-start justify-center w-[6em]">
                            <div className="w-4 h-4 bg-red-bar rounded-full"></div>
                            <div className=" text-xs ml-2">ใช้งานจริง</div>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className="flex justify-center sm:pl-10 pl-5 pt-1 max-sm:pt-2 mb-2 sm:-mt-[1rem]">
                <div className="flex items-start justify-center w-[6em] cursor-pointer"
                    onClick={() => setToggle({ ...toggle, budget: !toggle.budget })}>
                    <div className={`w-4 h-4 ${toggle.budget ? `bg-[${color.budget}]` : "bg-[#00C2B8]/[.5]"}  rounded-full`}></div>
                    <div className={`text-xs ml-2 ${!toggle.budget && "text-secondary"}`}>งบประมาณ</div>
                </div>
                <div className="flex items-start justify-center w-[6em] cursor-pointer"
                    onClick={() => setToggle({ ...toggle, actual: !toggle.actual })}>
                    <div className={`w-4 h-4 ${toggle.actual ? "bg-red-bar" : "bg-red-bar/[.5]"} rounded-full`}></div>
                    <div className={`text-xs ml-2 ${!toggle.actual && "text-secondary"}`}>ใช้งานจริง</div>
                </div>
            </div>

            <ResponsiveContainer width={statusSave ? 960 : '100%'} height={250}>
                <BarChart
                    barGap={-1}
                    width={500}
                    height={300}
                    data={dataGraph}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={14} />
                    <YAxis fontSize={14} domain={[0, 'auto']} tickFormatter={formatYAxis} allowDataOverflow={false} />
                    {data.length &&
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                    }
                    <Bar dataKey="budget" fill={color.budget} barSize={5} hide={!toggle.budget || !toggle.actual}
                        isAnimationActive={!statusSave} />
                    <Bar dataKey="actual" stackId={"a"} fill={color.actual} barSize={20} margin={{ left: -7, right: 7 }}
                        hide={!toggle.actual} isAnimationActive={!statusSave} />
                    <Bar dataKey="budget" stackId={"a"} fill={color.budget} barSize={20} margin={{ left: -7, right: 7 }}
                        hide={toggle.actual || (!toggle.budget && !toggle.actual)}
                        isAnimationActive={!statusSave} />
                    <Bar dataKey="mid" stackId={"a"} fill={color.budget} barSize={20} hide={!toggle.budget || !toggle.actual}
                        isAnimationActive={!statusSave} />
                    <Bar dataKey="budget" fill={color.budget} barSize={5} hide={!toggle.budget || !toggle.actual}
                        isAnimationActive={!statusSave} />
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}

export default GraphConsumptionByYear