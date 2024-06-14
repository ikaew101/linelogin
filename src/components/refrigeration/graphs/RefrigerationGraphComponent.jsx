import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function RefrigerationGraphComponent({ data, array, toggle, saving }) {
  const isCabinet = data.cabinetValue
  const customTooltipForTemperatureChart = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`custom-tooltip min-w-[157px] flex flex-col bg-white rounded-lg ${!saving && "shadow"} py-2`}>
          <div className="w-full flex justify-between px-3 py-1">
            <div className="text-xs text-dark font-bold mr-3">
              {payload[0].payload.date} - {payload[0].payload.time}
            </div>
          </div>
          {toggle.cabinetTemp &&
            <div className="w-full flex justify-between px-3 py-1">
              <div className="text-xs text-[#FBB92E] font-bold">{isCabinet ? "อุณหภูมิตู้แช่" : "อุณหภูมิห้องเย็น"}</div>
              <div className="text-xs text-dark font-bold">
                {/* {payload[0].value.toLocaleString("en-US", { */}
                {(isCabinet ? payload[0].payload.cabinetTemp : payload[0].payload.coldRoomTemp)?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '-'}{" "}
                °C
              </div>
            </div>
          }
          {toggle.setpointTemp &&
            <div className="w-full flex justify-between px-3 py-1">
              <div className="text-xs text-[#809DED] font-bold">อุณหภูมิที่ตั้ง</div>
              <div className="text-xs text-dark font-bold">
                {/* {payload[2] && payload[2].value?.toLocaleString("en-US", { */}
                {payload[0].payload.setpointTemp?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '-'}{" "}
                °C
              </div>
            </div>
          }
          {toggle.evapTemp &&
            <div className="w-full flex justify-between px-3 py-1">
              <div className="text-xs text-[#14C2B8] font-bold">อุณหภูมิคอยล์เย็น</div>
              <div className="text-xs text-dark font-bold">
                {/* {payload[1].value.toLocaleString("en-US", { */}
                {payload[0].payload.evapTemp?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '-'}{" "}
                °C
              </div>
            </div>
          }
        </div>
      );
    }
    return null;
  };

  const customTooltipForEnergySavingMode = ({ active, payload }) => {
    if (active && payload) {
      if (payload.length > 1) {
        return (
          <div className={`custom-tooltip w-[157px] h-[87-px] flex flex-col justify-evenly bg-white rounded-lg ${!saving && "shadow"}`}>
            <div className="w-full flex justify-between px-3 pt-4 pb-2">
              <div className="text-xs text-[#219653] font-bold">
                ประหยัดพลังงาน :
              </div>
              <div className="text-xs text-dark font-bold items-end">
                {payload[1].value === 1 ? "ON" : "OFF"}
              </div>
            </div>
            <div className="w-full flex justify-between px-3 pb-4">
              <div className="text-xs text-[#C3D311] font-bold">
                ละลายน้ำแข็ง :
              </div>
              <div className="text-xs text-dark font-bold">
                {payload[0].value === 1 ? "ON" : "OFF"}
              </div>
            </div>
          </div>
        )
      } else {
        const key = toggle.defrost ? "defrostStatus" : toggle.energySaving && "energySavingStatus"
        return (
          <div className={`custom-tooltip w-[157px] h-[87-px] flex flex-col justify-evenly bg-white rounded-lg ${!saving && "shadow"}`}>
            <div className="w-full flex justify-between px-3 pt-4 pb-3">
              {toggle.energySaving && <div className="text-xs text-[#219653] font-bold">ประหยัดพลังงาน :</div>}
              {toggle.defrost && <div className="text-xs text-[#C3D311] font-bold">ละลายน้ำแข็ง :</div>}
              <div className="text-xs text-dark font-bold items-end">
                {payload[0] && payload[0].payload[key] === 1 ? "ON" : "OFF"}
              </div>
            </div>
          </div>
        )
      }
    }
    return null;
  };

  function calDomain(array) {
    const min = array[0]
    const max = array[1]
    const resMin = Math.floor(array[0])
    const resMax = Math.ceil(array[1])

    // setIsTickOdd((max - min) % 2)
    // return [min % 2 ? min : min + 1, max % 2 ? max : max + 1]
    // console.log(resMax, resMin,resMax-resMin)
    return [resMin % 2 ? resMin : resMin - 1, resMax % 2 ? resMax : resMax + 1]
    // return [min => min < -7 ? Math.floor(min) + 2 : -7, max => max > 10 ? Math.ceil(max) : 10]
  }

  return (
    <div className="grid grid-cols-1">
      <ResponsiveContainer width="100%" height={450} >
        <LineChart
          data={isCabinet ? data.cabinetValue : data.coldRoomValue}
          margin={{ top: 10, right: 20, left: -30, bottom: 30 }}
          syncId={data.deviceId}
        // isAnimationActive={false}
        >
          <CartesianGrid strokeDasharray="" vertical={true} />
          <XAxis
            dataKey="time"
            // height={130}
            domain={["auto", "auto"]}
            axisLine={true}
            tickLine={true}
            fontSize={'14px'}
            interval={5} // 30m
          // interval={11} // 1hr
          // tickCount={20}
          // minTickGap={12}
          // minTickGap={11}
          />
          {/* <YAxis type="number" domain={calDomain} tickCount={10} axisLine={false} tickLine={false} /> */}
          {/* <ReferenceArea alwaysShow y1={-7} y2={10} fill="rgba(240, 48, 48,0.5)" fillOpacity={0.2} /> */}
          {/* <YAxis domain={[-12,10]} tickCount={12} axisLine={false} tickLine={false} interval={0} /> */}
          <YAxis type="number" domain={["auto", "auto"]} interval={0} tickCount={7} axisLine={true} tickLine={true} fontSize={'14px'} />
          <ReferenceArea ifOverflow="extendDomain" y1={data.minTarget} y2={data.maxTarget} fill="rgba(240, 48, 48,0.5)" fillOpacity={0.2} />

          <Tooltip
            content={customTooltipForTemperatureChart}
            wrapperStyle={{ outline: "none" }}
          />
          {toggle.cabinetTemp
            && isCabinet
            ? <Line
              type="monotone"
              dataKey="cabinetTemp"
              stroke="#FFBC29"
              strokeWidth={2}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
            />
            : <Line
              type="monotone"
              dataKey="coldRoomTemp"
              stroke="#FFBC29"
              strokeWidth={2}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
            // connectNulls
            />
          }
          {toggle.evapTemp &&
            <Line
              type="monotone"
              dataKey="evapTemp"
              stroke="#14C2B8"
              strokeWidth={2}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
            />}
          {toggle.setpointTemp &&
            <Line
              type="monotone"
              dataKey="setpointTemp"
              stroke="#809DED"
              strokeWidth={1.3}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
              strokeDasharray="4 4"
            />}
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={80}>
        <LineChart
          data={isCabinet ? data.cabinetValue : data.coldRoomValue}
          // data={array}
          // margin={{ top: 5, right: 50, left: 10, bottom: 5 }}
          margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
          syncId={data.deviceId}
        >
          <CartesianGrid strokeDasharray="" vertical={false} />
          <XAxis
            tick={false}
          // dataKey="time"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            ticks={[0, 1]}
            tickFormatter={(tick) => (tick === 0 ? "OFF" : "ON")}
            style={{ fontWeight: "bold", color: "black", fontSize: '14px' }}
          />
          <Tooltip
            content={customTooltipForEnergySavingMode}
            wrapperStyle={{ outline: "none" }}
          />
          {toggle.defrost &&
            <Line
              type="stepAfter"
              dataKey="defrostStatus"
              stroke="#C3D311"
              strokeWidth={2.8}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
            />}
          {toggle.energySaving &&
            <Line
              type="stepAfter"
              dataKey="energySavingStatus"
              stroke="#1A8334"
              strokeWidth={2}
              activeDot={{ r: 7, stroke: "#fff", strokeWidth: 4 }}
              dot={false}
            />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
