import { useContext, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppContext from "../../context/appContext";

function GraphBudgetYearly({ data, unit, year }) {
    const datas = [{ ...data, year }]
    const color = {
        budget: "#00C2B8",
        ytd: "#0095FF",
        actual: "#FD4D4D",
        disabled: "#828282"
    }

    //---ดักไม่ให้ actual ติดลบ
    let dataGraph = [];
    datas.map((item) => {
        //ใช้งบเกิน
        if (data) {
            if (item.budget - item.actual < 0) {
                dataGraph.push({
                    year: item.year,
                    budget: item.budget,
                    sideBudget: item.budget - item.ytdBudget,
                    actual: item.actual,
                    // mid: 0,
                    ytdBudget: item.ytdBudget,
                    // mid_ytd: 0,
                });
                //ใช้งบไม่เกิน budget
            } else if (item.ytdBudget > item.actual) {
                dataGraph.push({
                    year: item.year,
                    actual: item.actual == -999 || item.actual < 0 ? undefined : item.actual, // ให้กราฟแสดงค่าเป็น 0 ถ้าติด -
                    budget: item.budget,
                    ytdBudget: item.ytdBudget,
                    sideBudget: item.budget - item.ytdBudget,
                    mid_ytd: item.ytdBudget - (item.actual == -999 || item.actual < 0 ? 0 : item.actual),
                    midBudget: item.budget - item.ytdBudget,
                    // mid: item.budget - item.ytdBudget,
                });
            } else {
                dataGraph.push({
                    year: item.year,
                    actual: item.actual,
                    budget: item.budget,
                    ytdBudget: item.ytdBudget,
                    sideBudget: item.budget - item.ytdBudget,
                    midBudget: item.budget - item.actual
                })
            }
        }
    })

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='flex flex-col items-center border-0 '>
                    <div className='z-50 rounded-lg bg-white border text-xs py-2 min-w-[15em]'>
                        <div className='flex justify-between px-2'>
                            {toggle.budget && <>
                                <div className={`text-[#00C2B8] font-semibold mr-7`}>งบประมาณทั้งปี :</div>
                                <label className=''>
                                    {dataGraph[0].budget == -999 ? '-' : dataGraph[0].budget?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}
                                </label>
                            </>}</div>
                        <div className='flex justify-between px-2'>
                            {toggle.ytd && <>
                                <div className='font-semibold text-blue-bar pr-1'>งบประมาณถึงปัจจุบัน :</div>
                                <label className=''>
                                    {dataGraph[0].ytdBudget == -999 ? '-' : dataGraph[0].ytdBudget?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}
                                </label>
                            </>}</div>
                        <div className='flex justify-between px-2'>
                            {toggle.actual && <>
                                <div className='font-semibold text-red-bar'>ใช้งานจริง :</div>
                                <label className=''>
                                    {dataGraph[0].actual == -999 || dataGraph[0].actual === undefined ? '-' : dataGraph[0].actual?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}
                                </label>
                            </>}</div>
                    </div>
                </div>
            );

            return (
                <div className="">
                    <div className='flex flex-col items-center border-0 '>
                        <div className='z-50 rounded-lg bg-white border text-xs py-2 min-w-[15em]'>
                            <div className='flex justify-between px-2'>
                                <div className={`text-[${color.budget}] font-semibold mr-7`}>งบประมาณทั้งปี :</div>
                                <label className=''>{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}</label>
                            </div>
                            <div className='flex justify-between px-2'>
                                <div className='font-semibold text-blue-bar pr-1'>งบประมาณถึงปัจจุบัน :</div>
                                <label className=''> {payload[1].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}</label>
                            </div>
                            <div className='flex justify-between px-2'>
                                <div className='font-semibold text-red-bar'>ใช้งานจริง :</div>
                                <label className=''>{payload[3].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {unit}</label>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    const formatLeftYAxis = (tickItem) => {
        if (tickItem >= 10e5) {
            return `${(tickItem / 1000000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}M`;
        } else {
            return `${(tickItem).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        }
    }

    const [toggle, setToggle] = useState({
        budget: true,
        ytd: true,
        actual: true,
    })
    const { statusSave } = useContext(AppContext)
    return (
        <>
            <div className="flex items-center justify-between pr-5 xs:max-w-[320px]">
                <div className="col-span-1 text-sm text-secondary font-semibold py-4 max-[1280px]:pl-10 pl-5">รายปี ({unit})</div>
            </div>

            <div className={`flex justify-start ${!statusSave && "max-[1280px]:pl-10"}`}>
                <ResponsiveContainer width={250} height={250}>
                    <BarChart
                        barGap={-1}
                        data={dataGraph}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                        }}
                    >

                        <XAxis dataKey="year" fontSize={14} />
                        <YAxis fontSize={14} domain={[0, 'auto']} tickFormatter={formatLeftYAxis} />
                        {/* <YAxis tickFormatter={formatLeftYAxis} fontSize={14} domain={!isZoomLt && data ? [0, 40 * 10e5] : [0, dataMax => (dataMax * 1.1)]} allowDataOverflow={false} /> */}
                        {dataGraph.length &&
                            <Tooltip position={{ x: 200, y: 'center' }} content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} cursor={{ fill: '#6FCF97', opacity: '0.1' }} />
                        }
                        <Bar dataKey="budget" fill={color.budget} barSize={10} hide={!toggle.budget} />
                        <Bar dataKey="ytdBudget" stackId={"ytd_l"} fill={color.ytd} barSize={10} hide={!toggle.ytd} />
                        <Bar dataKey="sideBudget" stackId={"ytd_l"} fill={color.budget} barSize={10} hide={!toggle.budget || !toggle.ytd} />
                        <Bar dataKey="actual" stackId={"a"} fill={toggle.actual ? color.actual : color.ytd} barSize={30} margin={{ left: -7, right: 7 }}
                            hide={!toggle.actual} />
                        <Bar dataKey="mid_ytd" stackId={"a"} fill={color.ytd} barSize={30} style={{ borderColor: "none" }}
                            hide={!toggle.actual || !toggle.ytd} />
                        <Bar dataKey="ytdBudget" stackId={"a"} fill={color.ytd} barSize={30} style={{ borderColor: "none" }}
                            hide={toggle.actual || (!toggle.actual && !toggle.ytd)} />
                        {/* <Bar  dataKey={values => values.midBudget + (values.actual-values.ytdBudget)} stackId={"a"} fill={color.budget} barSize={30} hide={!toggle.budget || !toggle.ytd} /> */}
                        <Bar dataKey={values => {
                            const overActual = values.actual - values.ytdBudget
                            if (!toggle.actual || !toggle.ytd) {
                                if (values.actual > values.budget) return values.sideBudget
                                return values.midBudget + (overActual >= 0 ? overActual : 0)
                            }
                            if (values.actual > values.budget) return 0 //fix มีกราฟเขียวเหนือแดง กรณี actual พุ่งสูงสุด
                            return values.midBudget
                        }} stackId={"a"} fill={color.budget} barSize={30} hide={!toggle.budget || !toggle.ytd} />
                        <Bar dataKey={values => {
                            const overActual = values.actual - values.ytdBudget
                            if (!(!toggle.actual && !toggle.ytd)) {
                                if (values.actual > values.budget) return 0 //fix issue
                                return (values.ytdBudget + values.midBudget - values.actual + (overActual >= 0 ? overActual : 0))
                            } else {
                                if (values.actual > values.budget) return values.budget //fix issue
                                return (values.ytdBudget + values.midBudget + (overActual >= 0 ? overActual : 0))
                            }
                        }}
                            stackId={"a"} fill={color.budget} barSize={30} hide={toggle.ytd || !toggle.budget} />
                        <Bar dataKey="ytdBudget" stackId={"ytd_r"} fill={color.ytd} barSize={10} hide={!toggle.ytd} />
                        <Bar dataKey="sideBudget" stackId={"ytd_r"} fill={color.budget} barSize={10} hide={!toggle.budget || !toggle.ytd} />
                        <Bar dataKey="budget" fill={color.budget} barSize={10} hide={!toggle.budget} />
                    </BarChart>
                </ResponsiveContainer>

                {/* {!!data && */}
                <div className="grid grid-rows-3 text-xs max-[1280px]:ml-5 h-fit -ml-1">
                    <div className="flex py-1 items-center cursor-pointer group"
                        onClick={() => setToggle({ ...toggle, budget: !toggle.budget })}>
                        <div className={`row-span-1 w-4 h-4 ${toggle.budget ? `bg-[${color.budget}]` : "bg-[#00C2B8]/[.5]"} rounded-full `} />
                        <div className={`flex-1 ml-2 ${!toggle.budget && "text-secondary"}`}>งบประมาณทั้งปี</div>
                    </div>
                    <div className="flex py-1 items-center cursor-pointer"
                        onClick={() => setToggle({ ...toggle, ytd: !toggle.ytd })}>
                        <div className={`row-span-1 w-4 h-4 ${toggle.ytd ? "bg-blue-bar" : "bg-blue-bar/[.5]"} rounded-full`} />
                        <div className={`flex-1 ml-2 ${!toggle.ytd && "text-secondary"}`}>งบประมาณถึงปัจจุบัน</div>
                    </div>
                    <div className="flex py-1 items-center cursor-pointer"
                        onClick={() => setToggle({ ...toggle, actual: !toggle.actual })}>
                        <div className={`row-span-1 w-4 h-4 ${toggle.actual ? "bg-red-bar" : "bg-red-bar/[.5]"} rounded-full`} />
                        <div className={`flex-1 ml-2 ${!toggle.actual && "text-secondary"}`}>ใช้งานจริง</div>
                    </div>
                </div>
                {/* } */}
            </div>
        </>
    )
}



export default GraphBudgetYearly