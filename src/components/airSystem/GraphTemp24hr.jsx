import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import dayTh from "../../const/day"
import MonthName from "../../const/month"
import ExportTypes from "../exportTypes"

export default function GraphTemp24hr({ format, color, data, config, saving, qMin, datetime, minInterval, dataCard }) {
  const [toggle, setToggle] = useState({
    airReturn: true,
    indoor: true,
    outdoor: true,
    area: true,
    storeRent: true,
    food: true,
    outside: true,
  })
  const [typeMock, setTypeMock] = useState('showDot')
  const [datas, setDatas] = useState()
  let numOfData = format == "hyper" ? 0 : 12
  useEffect(() => {
    if (dataCard == 'false') return
    const dataKey = dataCard && Object.entries(dataCard).map(([key, value]) => {
      if (value != '-999' && key != 'lastUpdate' && value > 0) {
        return key
      }
    }).reverse()
    const ind = dataKey?.findIndex(ele => ele)

    let arrData = dataKey ? data[dataKey[ind]]
      : format == "mini" ? data?.outdoorTemp : (data?.outsideTemp.length ? data?.outsideTemp : data?.mallTemp) //(data?.averageAirReturnTemp?.length && data?.averageAirReturnTemp) || data?.foodTemp
    arrData?.map((ele, i) => {
      if (format == "hyper" && i < 8) {
        if (ele.temp == '-999') numOfData += 1
      } else if (format == "mini" && i < 8) {
        if (ele.temp == '-999') numOfData -= 1
        // } else if (format == "super" && i < 8) {
        //   if (ele.temp == '-999') numOfData -= 1
      }
      // ele.time = ('0' + new Date(ele.xAxis).getUTCHours()).slice(-2) + ':' + ('0' + new Date(ele.xAxis).getUTCMinutes()).slice(-2)
      const indoorTemp = data.indoorTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const outdoorTemp = data.outdoorTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const foodTemp = data.foodTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const mallTemp = data.mallTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const outsideTemp = data.outsideTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const saleTemp = data.saleTemp?.find(el => el.xAxis == ele.xAxis)?.temp
      const airTemp = data.averageAirReturnTemp?.find(el => el.xAxis == ele.xAxis)?.temp

      ele.indoorTemp = indoorTemp && indoorTemp == '-999' ? null : indoorTemp
      ele.outdoorTemp = outdoorTemp && outdoorTemp == '-999' ? null : outdoorTemp
      ele.averageAirReturnTemp = airTemp && airTemp == '-999' ? null : airTemp
      ele.foodTemp = foodTemp && foodTemp == '-999' ? null : foodTemp
      ele.mallTemp = mallTemp && mallTemp == '-999' ? null : mallTemp
      ele.outsideTemp = outsideTemp && outsideTemp == '-999' ? null : outsideTemp
      ele.saleTemp = saleTemp && saleTemp == '-999' ? null : saleTemp

      const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
      ele.time = (new Date(date)).toLocaleString('th-GB', { hour: "2-digit", minute: "numeric", hour12: false })
      const dayThai = dayTh[(new Date(date).getDay())]

      const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
      ele.date = `${dayThai}, ${startTh}`
    })
    setDatas(arrData)
  }, [dataCard])

  const customTooltip = ({ active, payload }) => {
    const optionDigit = { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    if (active && payload && payload.length) {
      return (
        <div className='custom-tooltip min-w-[190px] pt-1 pb-2 flex flex-col bg-white rounded-lg shadow-[1px_1px_10px_1px_#00000040] text-xs'>
          {/* <div className="p-2 font-bold text-dark mr-4">{`${payload[0].payload.date} - ${payload[0].payload.time}`}</div> */}
          <div className="p-2 font-bold text-dark mr-4">{`${datetime || payload[0].payload.date} - ${payload[0].payload.time}`}</div>

          {toggle.airReturn &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "hyper" && 'hidden'}`} style={{ color: color.airReturn }}>
              <div className='flex items-center justify-center font-bold'>
                AVG Air return
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.averageAirReturnTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.indoor &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "hyper" && 'hidden'}`} style={{ color: color.indoor }}>
              <div className='flex items-center justify-center font-bold'>
                ภายในสาขา
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.indoorTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.outdoor &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "hyper" && 'hidden'}`} style={{ color: color.outdoor }}>
              <div className='flex items-center justify-center font-bold'>
                ภายนอกสาขา
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.outdoorTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.area &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "mini" && 'hidden'}`} style={{ color: color.area }}>
              <div className='flex items-center justify-center font-bold'>
                พื้นที่ขาย
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.saleTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.storeRent &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "mini" && 'hidden'}`} style={{ color: color.storeRent}}>
              <div className='flex items-center justify-center font-bold'>
                ร้านค้าเช่า
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.mallTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.food &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "mini" && 'hidden'}`} style={{ color: color.food }}>
              <div className='flex items-center justify-center font-bold'>
                ศูนย์อาหาร
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.foodTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
          {toggle.outside &&
            <div className={`w-full flex justify-between px-2 py-1 ${format == "mini" && 'hidden'}`} style={{ color: color.outside }}>
              <div className='flex items-center justify-center font-bold'>
                นอกสาขา
              </div>
              <div className='text-dark'>
                <b>{payload[0].payload.outsideTemp?.toLocaleString('en-US', optionDigit) || '-'} </b>
                °C
              </div>
            </div>
          }
        </div>
      )
    }
  }

  const showDot = (format == "hyper" || numOfData <= 5 || minInterval > qMin || typeMock.includes("15"))
  return (
    <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
      <div id="graphTemp24h" className="p-3">
        <div className='font-bold flex items-center gap-1 text-secondary pl-2'>
          <img src="icon/24h-orange.png" className="w-10 h-10" />
          กราฟอุณหภูมิจากระบบปรับอากาศ 24 ชม. (°C)
        </div>

        <div className="grid grid-cols-1">
          <div className={`scrollbar overflow-x-auto`}>
            <div className="relative min-w-[1670px]">
              <ResponsiveContainer width="100%" height={470}>
                <LineChart
                  data={datas}
                  margin={{ top: 25, right: 36, left: -18, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="" vertical={true} />
                  <XAxis
                    dataKey="time"
                    // height={130}
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    fontSize={'14px'}
                    interval={typeMock == "q15" ? 3 : qMin == "60" ? 0 : qMin || 3} // 5min use5
                  />
                  <YAxis type="number" domain={["auto", "auto"]}
                    interval={0} tickCount={7} axisLine={false} tickLine={false} fontSize={'14px'} />

                  <Tooltip
                    content={customTooltip}
                    wrapperStyle={{ outline: "none" }}
                  />

                  {format != "hyper" && toggle.airReturn &&
                    <Line
                      type="monotone"
                      dataKey="averageAirReturnTemp"
                      stroke={color.airReturn}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      dot={showDot && { r: 2, stroke: color.airReturn, strokeWidth: 4 }}
                      isAnimationActive={false}
                    />
                  }
                  {format != "hyper" && toggle.indoor &&
                    <Line
                      type="monotone"
                      dataKey="indoorTemp"
                      stroke={color.indoor}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      dot={showDot && { r: 2, stroke: color.indoor, strokeWidth: 4 }}
                      isAnimationActive={false}
                    />
                  }
                  {format != "hyper" && toggle.outdoor &&
                    <Line
                      type="monotone"
                      dataKey="outdoorTemp"
                      stroke={color.outdoor}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      dot={showDot && { r: 2, stroke: color.outdoor, strokeWidth: 4 }}
                      isAnimationActive={false}
                    />
                  }

                  {format != "mini" && toggle.food &&
                    <Line
                      type="monotone"
                      dataKey="foodTemp"
                      stroke={color.food}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      // dot={false}//
                      dot={showDot && { r: 2, stroke: color.food, strokeWidth: 4 }}
                      isAnimationActive={false}
                      connectNulls={typeMock == "connectNulls"}
                    />
                  }
                  {format != "mini" && toggle.area &&
                    <Line
                      type="monotone"
                      dataKey="saleTemp"
                      stroke={color.area}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      //  dot={false}//
                      dot={showDot && { r: 2, stroke: color.area, strokeWidth: 4 }}
                      isAnimationActive={false}
                      connectNulls={typeMock == "connectNulls"}
                    />
                  }
                  {format != "mini" && toggle.outside &&
                    <Line
                      type="monotone"
                      dataKey="outsideTemp"
                      stroke={color.outside}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      // dot={false}//  
                      dot={showDot && { r: 2, stroke: color.outside, strokeWidth: 4 }}
                      isAnimationActive={false}
                      connectNulls={typeMock == "connectNulls"}
                    />
                  }
                  {format != "mini" && toggle.storeRent &&
                    <Line
                      type="monotone"
                      dataKey="mallTemp"
                      stroke={color.storeRent}
                      strokeWidth={2}
                      activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                      // dot={false}// 
                      dot={showDot && { r: 2, stroke: color.storeRent, strokeWidth: 4 }}
                      isAnimationActive={false}
                      connectNulls={typeMock == "connectNulls"}
                    />
                  }
                  <ReferenceLine x={('0' + config?.openTime).slice(-5)} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา เปิดสาขา', fontSize: 14 }} />
                  <ReferenceLine x={('0' + config?.closeTime).slice(-5)} stroke='red' strokeDasharray='3' label={{ position: "top", value: 'เวลา ปิดสาขา', fontSize: 14 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='flex gap-6 justify-center items-center mt-3 ml-5 flex-wrap'>
          {format != "hyper" && <>
            <div className={`flex items-center cursor-pointer ${!toggle.airReturn && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, airReturn: !toggle.airReturn })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.airReturn }} />
              <div className='text-base ml-2'>AVG Air return</div>
            </div>
            <div className={`flex items-center cursor-pointer ${!toggle.indoor && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, indoor: !toggle.indoor })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.indoor }} />
              <div className='text-base ml-2'>ภายในสาขา</div>
            </div>
            <div className={`flex items-center cursor-pointer ${!toggle.outdoor && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, outdoor: !toggle.outdoor })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.outdoor }} />
              <div className='text-base ml-2'>ภายนอกสาขา</div>
            </div>
          </>}
          {format != "mini" && <>
            <div className={`flex items-center cursor-pointer ${!toggle.area && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, area: !toggle.area })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.area }} />
              <div className='text-base ml-2'>พื้นที่ขาย</div>
            </div>
            <div className={`flex items-center cursor-pointer ${!toggle.storeRent && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, storeRent: !toggle.storeRent })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.storeRent }} />
              <div className='text-base ml-2'>ร้านค้าเช่า</div>
            </div>
            <div className={`flex items-center cursor-pointer ${!toggle.food && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, food: !toggle.food })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.food }} />
              <div className='text-base ml-2'>ศูนย์อาหาร</div>
            </div>
            <div className={`flex items-center cursor-pointer ${!toggle.outside && 'opacity-50'}`}
              onClick={() => setToggle({ ...toggle, outside: !toggle.outside })}>
              <div className="h-4 w-4 min-w-[15px] rounded-full" style={{ background: color.outside }} />
              <div className='text-base ml-2'>นอกสาขา</div>
            </div>
          </>}
        </div>

      </div>
      <ExportTypes id="graphTemp24h" format={[456, 644]} />
    </div>
  )
}