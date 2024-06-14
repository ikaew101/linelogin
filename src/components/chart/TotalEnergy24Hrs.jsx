import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function TotalEnergy24Hrs({ data }) {
    const categoryTotal = [];
    const resultTotalKwh = [];
    // if(data.length) {
    //     data[0].kwh_time_series.map(item => {
    //         let data_timestamp = new Date(item.data_timestamp).getHours();
    //         return (categoryTotal.push({ time: data_timestamp, kWh: item.kwh_usage }));
    //     });
    // }

    categoryTotal.sort((a, b) => a.time - b.time);
    categoryTotal.map(item => { (resultTotalKwh.push({ time: `${item.time}:00`, kWh: item.kWh })) });

    const total_kwh = data?.length && data[0].kwh_usage?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const [overAllAreaBelowTheCurve2, setOverAllAreaBelowTheCurve2] = useState(total_kwh)

    const customTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {

            return (
                // <div className='custom-tooltip h-9 bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040]'>
                //     <div className='w-full flex justify-between px-3 py-3'>
                //         <div className='text-xs text-[#14C2B8] font-bold pr-3'>{payload[0].payload.time}</div>
                //         <div className='text-xs text-[#2B2B2B] font-bold'>{payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} kWh</div>
                //     </div>
                // </div>
                <div className='custom-tooltip pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs'>
                    <div className="p-2 font-bold text-dark mr-8">
                        {`day, dmy - ${payload[0].payload.time}`}
                    </div>

                    <div className='w-full flex justify-between px-2 py-1.5'>
                        <div className='flex items-center justify-center text-primary font-bold'>
                            การใช้พลังงาน
                        </div>
                        <div className='text-dark pl-3'>
                            <b>
                                {payload[0].payload.kWh}
                            </b> kWh
                            {/* <b>{payload[2] !== undefined && payload[2] !== null ? payload[2].value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0} </b> */}
                            {/* kWh */}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* <div className='w-full shadow-basic rounded-xl pt-4 pr-6 pl-3'> */}
            <div className='pt-2'>
                <div className='flex justify-between items-center pl-2'>
                    <div className='flex items-center'>
                        <div className='rounded-full h-fit mr-3'>
                            <svg width="45" height="45" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="70" height="70" rx="35" fill="#00C2B8" />
                                <path d="M35.0105 37.0896C36.2569 37.0895 37.4749 37.4622 38.508 38.1596C39.5411 38.8571 40.342 39.8475 40.8079 41.0037C41.2737 42.1598 41.3832 43.4289 41.1224 44.6477C40.8615 45.8666 40.2421 46.9796 39.3438 47.8438L35.3646 51.6729H41.2605V55.8396H28.7605L28.7584 52.2479L36.4542 44.8417C36.7025 44.603 36.8878 44.3065 36.9934 43.9786C37.099 43.6508 37.1217 43.3019 37.0595 42.9631C36.9972 42.6244 36.8519 42.3063 36.6366 42.0375C36.4213 41.7686 36.1427 41.5574 35.8258 41.4226C35.5088 41.2878 35.1634 41.2337 34.8204 41.2651C34.4774 41.2965 34.1476 41.4125 33.8604 41.6026C33.5732 41.7927 33.3376 42.0511 33.1747 42.3546C33.0119 42.6581 32.9268 42.9972 32.9271 43.3417H28.7605C28.7602 42.5207 28.9216 41.7078 29.2356 40.9493C29.5496 40.1907 30.0099 39.5015 30.5903 38.9209C31.1707 38.3403 31.8598 37.8798 32.6182 37.5655C33.3766 37.2513 34.1895 37.0896 35.0105 37.0896ZM47.5105 37.0896V45.4229H51.6771V37.0896H55.8438V55.8396H51.6771V49.5896H43.3438V37.0896H47.5105ZM18.3438 35.0063C18.3412 37.5054 18.9018 39.973 19.9838 42.2258C21.0658 44.4785 22.6415 46.4586 24.5938 48.0188V53.0521C21.4256 51.2239 18.7949 48.5935 16.9662 45.4256C15.1376 42.2577 14.1756 38.6641 14.1771 35.0063H18.3438ZM35.0105 14.1729C45.8125 14.1729 54.6959 22.3958 55.7396 32.9229H51.548C51.1248 29.5635 49.6887 26.4125 47.4305 23.8895C45.1724 21.3664 42.1995 19.5909 38.9073 18.7992C35.6152 18.0075 32.16 18.2371 29.0016 19.4576C25.8432 20.6781 23.1314 22.8315 21.2271 25.6313H26.6771V29.7979H14.1771V17.2979H18.3438V22.5063C20.2827 19.917 22.7987 17.8157 25.6919 16.369C28.5851 14.9224 31.7758 14.1705 35.0105 14.1729Z" fill="white" />
                            </svg>

                        </div>
                        <div className='text-lg font-bold text-[#828282]'>
                            การใช้ไฟฟ้ารวม 24 ชม.(kWh)
                        </div>
                    </div>
                    <div className='text-lg font-bold px-4 py-3 rounded-xl bg-light -mr-1 whitespace-nowrap'>
                        {/* {`${overAllAreaBelowTheCurve2} kWh`} */}
                    </div>

                </div>

                <ResponsiveContainer width="100%" height={500}>
                    <AreaChart
                        data={resultTotalKwh}
                        margin={{ top: 40, right: 30, left: 0, bottom: 40 }}
                    >
                        {/* <CartesianGrid strokeDasharray={data.length ? '' : '3 3'} /> */}
                        <XAxis
                            dataKey="time"
                            interval={1}
                            axisLine={false}
                            tickLine={false}
                            fontSize={14}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            fontSize={14}
                            domain={[0, "auto"]}
                        />
                        {/* {data.length && */}
                        <Tooltip
                            content={customTooltip}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        {/* } */}
                        <Area type="monotone" dataKey="kWh" stroke="#00C2B8" strokeWidth={1.5} fill="#00C2B8" fillOpacity="0.1" />

                        <CartesianGrid strokeDasharray='' />
                        <ReferenceLine x='06:00' stroke='red'   strokeDasharray='3' label={{ position: "top", value: 'Open time',  fontSize: 14 }} />
                        <ReferenceLine x='18:00' stroke='red'  strokeDasharray='3' label={{ position: "top", value: 'Close time',  fontSize: 14 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
};