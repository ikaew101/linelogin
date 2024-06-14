import { useContext, useState } from "react"
import { Line, CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import dayTh from "../../const/day"
import MonthName from "../../const/month"
import ExportTypes from "../exportTypes"
import AppContext from "../../context/appContext"

export default function GraphStatusDevice({ format, data, saving, index }) {
  // console.log('data', data)

  data.graph?.map((ele, i) => {
    const date = new Date(ele.xAxis).getTime() + new Date(ele.xAxis).getTimezoneOffset() * 60000
    const dayThai = dayTh[(new Date(date).getDay())]

    const startTh = new Date(date).getDate() + " " + MonthName[new Date().getMonth()] + " " + (new Date(date).getFullYear() + 543).toLocaleString().slice(-2)
    ele.date = `${dayThai}, ${startTh}`
    ele.time = (new Date(date)).toLocaleString('th-GB', { hour: "2-digit", minute: "numeric", hour12: false })

    ele.ac = ele.ac == '-999' ? null : ele.ac
    ele.cool = ele.cool == '-999' ? null : ele.cool
  })
  const customTooltip = ({ active, payload }) => {
    if (active && payload) {
      // console.log(payload)
      return (
        <div className="custom-tooltip -mt-6 min-w-[180px] flex flex-col justify-evenly bg-white rounded-lg shadow">
          <div className="w-full flex justify-between px-3 pt-2">
            <div className="text-xs text-dark font-bold mr-3">
              {payload[0]?.payload.date} - {payload[0]?.payload.time}
            </div>
          </div>
          <div className="w-full flex justify-between px-3 pt-3 pb-2">
            <div className="text-xs text-[#809DED] font-bold">
              Cool mode
            </div>
            <div className={`text-xs font-bold ${payload[0]?.payload.cool === 1 ? "text-[#11D677]" : "text-[#E1221C]"}`}>
              {payload[0] ? payload[0].payload.cool === 1 ? "ON" : "OFF"
                : '-'}
            </div>
          </div>
          <div className="w-full flex justify-between px-3 pb-3">
            <div className="text-xs text-primary font-bold">
              Power
            </div>
            <div className={`text-xs font-bold ${payload[0]?.payload.ac === 1 ? "text-[#11D677]" : "text-[#E1221C]"}`}>
              {payload[0]?.payload.ac === 1 ? "ON" : "OFF" || '-'}
            </div>
          </div>
        </div>
      )
    }
  }

  if (data.feedbackCoolModeAir == '-999' && data.feedbackPowerOnAir == '-999') {
    const dataGraph = data.graph[data.graph.length - 2]
    data.feedbackCoolModeAir = dataGraph.cool == null ? -999 : dataGraph.cool
    data.feedbackPowerOnAir = dataGraph.ac == null ? -999 : dataGraph.ac
  }
  const { statusSave } = useContext(AppContext)
  return (
    <div className={`bg-white ${saving != 'JPEG' && 'shadow'} border mx-2 rounded-xl mt-4`}>
      <div id={`graphStatusDevice${index}`} className="p-3">
        <div className="flex justify-between text-[#828282] mb-3.5">
          <div className='font-bold flex items-center gap-1 pl-2'>

            <img src="icon/power-orange.png" className="w-10 h-10" />
            กราฟสถานะ : {data.deviceNumber}
          </div>

        </div>

        <div className="xs:flex gap-5 pb-6 pl-1">
          <div className="text-dark border-l-[7px] border-solid border-l-secondary pl-2 ml-1">
            ผลตอบรับ : <b>Cool mode</b>
            <p className={`${data.feedbackCoolModeAir == "-999" ? '' : data.feedbackCoolModeAir ? "text-[#11D677]" : "text-[#E1221C]"}`}>
              <b>{data.feedbackCoolModeAir == "-999" ? '-' :
                data.feedbackCoolModeAir ? "ON" : "OFF" || <br />}</b>
            </p>
          </div>
          <div className="text-dark border-l-[7px] border-solid border-l-primary pl-2 ml-1 max-xs:mt-2">
            ผลตอบรับ : <b>Power</b>
            <p className={`${data.feedbackPowerOnAir == "-999" ? '' : data.feedbackPowerOnAir ? "text-[#11D677]" : "text-[#E1221C]"}`}>
              <b>{data.feedbackPowerOnAir == "-999" ? '-' :
                data.feedbackPowerOnAir ? "ON" : "OFF" || <br />}</b>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className={`scrollbar overflow-x-auto`}>
            <div className=" min-w-[900px]">
              <ResponsiveContainer width={statusSave ? 1650 : "100%"} height={80}>
                <LineChart
                  data={data.graph}
                  margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
                // syncId={data.deviceNumber}
                >
                  <CartesianGrid strokeDasharray="" vertical={false} />
                  <XAxis
                    //  tick={false}
                    dataKey="time"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    // tickLine={false}
                    fontSize={'14px'}
                    interval={11}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 1]}
                    tickFormatter={(tick) => (tick === 0 ? "OFF" : "ON")}
                    style={{ fontWeight: "bold", color: "black", fontSize: '14px' }}
                  />
                  <Tooltip
                    content={customTooltip}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="cool"
                    stroke="#809DED"
                    strokeWidth={2.5}
                    activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <ResponsiveContainer width={statusSave ? 1650 : "100%"} height={80}>
                <LineChart
                  data={data.graph}
                  margin={{ top: 15, right: 20, left: -20, bottom: 5 }}
                // syncId={data.deviceNumber}
                >
                  <CartesianGrid strokeDasharray="" vertical={false} />
                  <XAxis
                    dataKey="time"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    fontSize={'14px'}
                    interval={11}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 1]}
                    tickFormatter={(tick) => (tick === 0 ? "OFF" : "ON")}
                    style={{ fontWeight: "bold", color: "black", fontSize: '14px' }}
                  />
                  <Tooltip
                    content={customTooltip}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="ac"
                    stroke="#00C2B8"
                    strokeWidth={2.5}
                    activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <ExportTypes id={`graphStatusDevice${index}`} format={[456, 644]} />
    </div>
  )
}