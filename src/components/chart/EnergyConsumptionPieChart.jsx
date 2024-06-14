import React, { useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import AppContext from '../../context/appContext';

export default function EnergyConsumptionPieChart({ data, color, isMini }) {

    const toPercent = (value) => {
        let total = 0
        const data = isMini ? dataMini : pieChartdata
        data.map(ele => total += ele.value)

        const percent = value / total * 100
        if (percent) {
            return percent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        } else {
            return ''
        }
    }

    const dataMini = [
        {
            name: isMini ? "ระบบปรับอากาศ" : "AHU",
            value: data?.ahu,
            fill: data?.ahu && color.air
        },
        {
            name: "ระบบตู้แช่",
            value: data?.refrig,
            fill: data?.refrig && color.refrig
        },
        {
            name: "อื่นๆ",
            value: data?.other,
            fill: data?.other && color.other
        },
    ];

    const pieChartdata = [
        ...dataMini,
        {
            name: "ระบบChiller",
            value: data?.chiller,
            fill: data?.chiller && color.chiller
        },
        {
            name: "ระบบแสงสว่าง",
            value: data?.lighting,
            fill: data?.lighting && color.lighting
        },
    ]

    const COLORS = ['#F03030', '#809DED', '#56B00F', '#F2994A', '#56CCF2'];

    const isMobileSize = false //useMediaQuery({ maxWidth: 610 })
    const isSmallSize = useMediaQuery({ maxWidth: 440 }) //400
    const isMidSize = useMediaQuery({ maxWidth: 900 })
    let firstCos, flagAdd
    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, outerRadius, fill } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        // const sx = cx + (outerRadius + 10) * cos;
        // const sy = cy + (outerRadius + 10) * sin;
        // const mx = cx + (outerRadius + 30) * cos;
        // const my = cy + (outerRadius + 30) * sin;
        let result = toPercent(props.value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        if (props.index == 0 && result > 80) flagAdd = true
        // const index = flagAdd ? (props.index + 1) : 1
        // const index = (props.index < firstCos) ? props.index + 1 : props.index - firstCos + 1
        const index = !flagAdd ? 1 : (props.index < firstCos) ? props.index + 1 : props.index - firstCos + 1

        const sx = cx + (outerRadius + 0 * index) * cos;
        const sy = cy + (outerRadius + 0 * index) * sin;
        const mx = cx + (outerRadius + 20 * index) * cos;
        const my = cy + (outerRadius + 20 * index) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 7;
        const ey = my;
        if (!firstCos && cos < 0) firstCos = props.index
        // console.log(firstCos, props.index, cos.toFixed(2))
        const textAnchor = cos >= 0 ? 'start' : 'end';
        const evenIndex = (props.index + 1) % 2
        return (
            <g>
                {result !== 0 && ex && ey &&
                    <>
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                        {!over80 ? <>
                            {/* <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={evenIndex ? ey + 4 : ey - 8} textAnchor={textAnchor} fontSize={12} fill="#333" fontWeight={600}>{props.value !== 0 && `${props.name}`}</text>
                            <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={evenIndex ? ey + 18 : ey + 6} textAnchor={textAnchor} fontSize={12} fill="#333" fontWeight={600}>{result}{fill ? '%' : ''}</text> */}
                            <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fontSize={12} fill="#333" fontWeight={600}>{props.value !== 0 && `${props.name}`}</text>
                            <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey + 13} textAnchor={textAnchor} fontSize={12} fill="#333" fontWeight={600}>{result}{fill ? '%' : ''}</text>
                        </> : <>
                            <text x={ex + (cos >= 0 ? 4 : -4)} y={ey + 4} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}>
                                {props.value !== 0 && `${props.name}`}
                            </text>
                            <text x={ex + (cos >= 0 ? 4 : -4)} y={ey + 15} textAnchor={textAnchor} fontSize={12} fill="#565E6D" fontWeight={600}>{result}{fill ? '%' : ''}</text>
                        </>}
                    </>
                }
            </g>
        );
    };

    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className='custom-tooltip pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs min-w-[120px]'>
                    <div className='w-full flex justify-between px-2 py-1.5'>
                        <div className={`flex items-center justify-center font-bold `} style={{ color: payload[0].payload.fill }}>
                            {payload[0].name}
                        </div>
                        <div className='text-dark pl-3'>
                            <b> {payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} </b> kWh
                            {/* <b>{payload[2] !== undefined && payload[2] !== null ? payload[2].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0} </b> */}
                            {/* kWh */}
                        </div>
                    </div>
                </div>
            )
        }
    };

    dataMini.map((ele, ind) => {
        if (!ele.value) {
            dataMini.splice(ind, 1)
        }
    })
    pieChartdata.map((ele, ind) => {
        if (!ele.value) {
            pieChartdata.splice(ind, 1)
        }
    })

    function arrayMax(arr) {
        return arr.reduce(function (p, v) {
            return (p.value > v.value ? p : v);
        });
    }
    Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
        return this;
    };
    const over80 = toPercent(arrayMax(pieChartdata).value) > 80

    const datas = (isMini ? dataMini : (
        toPercent(arrayMax(pieChartdata).value) > 80 ? pieChartdata.sort((a, b) => b.value - a.value) : pieChartdata
        // over80 ? pieChartdata.move(pieChartdata.findIndex(ele => ele.name == arrayMax(pieChartdata).name), pieChartdata.length/2) : pieChartdata
    ))

    const { statusSave } = useContext(AppContext)
    return (
        <>
            <div className='pt-2'>
                <div className='flex justify-between items-center pl-2'>
                    <div className='flex items-center'>
                        <img src="icon/piechart.png" className="w-10 h-10 mr-2" />

                        <div className='text-lg font-bold text-[#828282]'>
                            การใช้พลังงานในแต่ละวัน - kWh (แผนภูมิ)
                        </div>
                    </div>
                </div>
                <div className='pb-1 -mx-3 max-[900px]:overflow-x-auto scrollbar'>
                    <div className={`${statusSave && '!w-[630px]'} min-[800px]:w-[47vw] w-[90vw] mx-auto`}>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={datas}
                                    cx='50%'
                                    cy={isMini ? '46%' : '54%'}
                                    innerRadius={isSmallSize ? 30 : isMobileSize ? 40 : isMidSize ? 50 : 60}
                                    outerRadius={isSmallSize ? 70 : isMobileSize ? 80 : isMidSize ? 100 : 120}
                                    // innerRadius={ismobileSize ? 40 : isSuperSmallScreenSize ? 60 : isSmallScreenSize ? 80 : 90}
                                    // outerRadius={ismobileSize ? 70 : isSuperSmallScreenSize ? 100 : isSmallScreenSize ? 130 : 150}
                                    fill="#8884d8"
                                    paddingAngle={0}
                                    dataKey="value"
                                    label={renderActiveShape}
                                    startAngle={-270} //กำหนดค่าตามนี้เพื่อทำให้ data ตัวแรกเริ่มต้นที่ 12 O'clock
                                    endAngle={-720} //กำหนดค่าตามนี้เพื่อทำให้ data ตัวที่เหลือวิ่งตามเข็มนาฬิกา
                                    isAnimationActive={!statusSave}
                                >
                                    {/* {pieChartdata.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ ouline: "none" }} />
                                ))} */}
                                </Pie>
                                <Tooltip content={customTooltip} active={true}
                                    wrapperStyle={{
                                        visibility: 'visible',
                                    }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}