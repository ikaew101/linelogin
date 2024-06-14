import { useMediaQuery } from 'react-responsive'
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import AppContext from '../../context/appContext';
import { useContext } from 'react';

function PieChartThisWeek({ data, storeInfo, config }) {

    const open = (`0${storeInfo.openTime}`).slice(-5)
    const close = (`0${storeInfo.closeTime}`).slice(-5)
    const openB = (`0${parseInt(open.slice(0, 2)) - 1}:00`).slice(-5)
    const close0 = (`0${parseInt(close.slice(0, 2)) + 1}:00`).slice(-5)

    const arrData = [
        {
            name: "เปิด",
            value: data?.open,
            fill: '#0095FF'
        },
        {
            name: "ก่อนเปิด",
            value: data?.beforeOpen,
            fill: '#3CD856'
        },
        {
            name: "ปิด",
            value: data?.close,
            fill: '#00C2B8'
        },
        {
            name: "ปิด - ไม่มีกิจกรรม",
            value: data?.closeNonAct,
            fill: '#FFBC29'
        }
    ];
    let flagAdd, firstCos
    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, outerRadius, fill, index } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        let result = toPercent(props.value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        if (index == 0 && result > 80) flagAdd = true
        // const ind = flagAdd ? (index + 1) : 1
        // const ind = (flagAdd && index < firstCos) ? index + 1 : index - firstCos + 1
        const ind = !flagAdd ? 1 : (index < firstCos) ? index + 1 : index - firstCos + 1 || 1

        if (!firstCos && cos < 0) firstCos = props.index
        const sx = cx + (outerRadius + 0 * ind) * cos;
        const sy = cy + (outerRadius + 0 * ind) * sin;
        const mx = cx + (outerRadius + 20 * ind) * cos;
        const my = cy + (outerRadius + 20 * ind) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 7;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        const evenIndex = (props.index + 1) % 2

        return (
            <g>
                {result !== 0 &&
                    <>
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                        {/* <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={evenIndex ? ey + 4 : ey - 8} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}> */}
                        <text x={ex + (cos >= 0 ? 1 : -1) * 5} y={ey} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}>
                            {props.value !== 0 && `${props.value.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} kWh ({result}{fill ? '%' : ''})
                        </text>
                        {/* <text x={ex + (cos >= 0 ? 3 : -3) * 6} y={evenIndex ? ey + 18 : ey + 6} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}>{result}{fill ? '%' : ''}</text> */}
                        {/* <text x={ex + (cos >= 0 ? 3 : -3) * 6} y={ey + 15} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}>{result}{fill ? '%' : ''}</text> */}
                    </>
                }
            </g>
        );
    };
    const toPercent = (value) => {
        let total = 0
        const data = arrData
        data.map(ele => total += ele.value)

        const percent = value / total * 100
        if (percent) {
            return percent.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        } else {
            return ''
        }
    }

    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs min-w-[120px]'>
                    <div className='w-full flex justify-between px-2 py-1.5'>
                        <div className={`flex items-center justify-center font-bold `} style={{ color: payload[0].payload.fill }}>
                            {payload[0].name}
                        </div>
                        <div className='text-dark pl-3'>
                            <b> {payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </b> kWh
                        </div>
                    </div>
                </div>
            )
        }
    };
    const { statusSave } = useContext(AppContext)
    const isSmallSize = useMediaQuery({ maxWidth: 440 }) //400
    const isMidSize = useMediaQuery({ maxWidth: 900 })
    const isMobileSize = useMediaQuery({ maxWidth: 700 })
    return (
        <div className='sm:flex'>
            {!data.flag ?
                <div className="flex justify-center h-10 rounded items-center my-4 mx-auto text-dark">
                    ไม่พบข้อมูล
                </div>
                : <>
                    <div className="text-dark sm:min-h-[330px]">
                        <p className="text-sm font-bold">การใช้ไฟฟ้าจากระบบแสงสว่างทั้งหมด</p>
                        <b>{data?.total.toLocaleString([])}  kWh</b>

                        <div className='max-sm:flex justify-evenly flex-wrap'>
                            <div className="flex py-1.5 mt-2 items-start group"
                            // onClick={() => setToggle({ ...toggle, budget: !toggle.budget })}
                            >
                                {/* <div className={`row-span-1 w-4 h-4 ${toggle.budget ? `bg-[${color.budget}]` : "bg-[#00C2B8]/[.5]"} rounded-full `} />
                        <div className={`flex-1 ml-2 ${!toggle.budget && "text-secondary"}`}>งบประมาณทั้งปี</div> */}
                                <div className={`row-span-1 w-4 h-4 rounded-full bg-warning mt-1`} />
                                <div className="grid-rows-2 ml-2 text-sm">
                                    <p className={``}>ปิด - ไม่มีกิจกรรม</p>
                                    <b>({config.closeNonAct.startTime} - {config.closeNonAct.endTime})</b>
                                </div>
                            </div>

                            <div className="flex py-1.5 mt-2 items-start group"
                            >
                                <div className={`row-span-1 w-4 h-4 rounded-full bg-primary mt-1`} />
                                <div className="grid-rows-2 ml-2 text-sm">
                                    <p className={``}>ปิด</p>
                                    <b>({config.close.startTime} - {config.close.endTime})</b>
                                </div>
                            </div>

                            <div className="flex py-1.5 mt-2 items-start group"
                            >
                                <div className={`row-span-1 w-4 h-4 rounded-full bg-[#3CD856] mt-1`} />
                                <div className="grid-rows-2 ml-2 text-sm">
                                    <p className={``}>ก่อนเปิด</p>
                                    <b>({config.beforeOpen.startTime} - {config.beforeOpen.endTime})</b>
                                </div>
                            </div>

                            <div className="flex py-1.5 mt-2 items-start group"
                            >
                                <div className={`row-span-1 w-4 h-4 rounded-full bg-blue-bar mt-1`} />
                                <div className="grid-rows-2 ml-2 text-sm">
                                    <p className={``}>เปิด</p>
                                    <b>({config.open.startTime} - {config.open.endTime})</b>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='-mt-1 -mx-5'>
                        <div className='lg:w-[35vw] sm:w-[70vw] mx-auto'>
                            <ResponsiveContainer width={statusSave ? 600 : "100%"} height={350}>
                                <PieChart>
                                    <Pie
                                        data={arrData}
                                        cx='52%'
                                        cy='55%'
                                        // innerRadius="40"
                                        // outerRadius="90"
                                        innerRadius={isMidSize ? 50 : isMobileSize ? 60 : 60}
                                        outerRadius={isMidSize ? 100 : 120}
                                        fill="#8884d8"
                                        paddingAngle={0}
                                        dataKey="value"
                                        label={renderActiveShape}
                                        startAngle={-270}
                                        endAngle={-720}
                                        isAnimationActive={false}
                                    >
                                    </Pie>
                                    <Tooltip content={customTooltip} active={true}
                                        wrapperStyle={{
                                            visibility: 'visible',
                                        }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>}
        </div>
    )
}

export default PieChartThisWeek