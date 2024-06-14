import React from "react";

export default function CabinetCard({
  idx,
  data,
  saving
}) {

  return (
    <>
      <div key={idx}
        // className={`h-[8.5em] ${!saving && "shadow"} border-[1px]  border-solid rounded-xl  pt-3  text-lg cursor-pointer w-full hover:shadow-md font-semibold 
        className={` rounded-br-xl  ${!saving && "shadow"} border rounded-xl  text-lg cursor-pointer w-full hover:shadow-md font-semibold `}
      //   className={`h-[8.5em] ${!saving && "shadow"} border-[1px] border-l-[22px] border-solid rounded-xl  pt-3  text-lg cursor-pointer w-full hover:shadow-md font-semibold 
      //   ${!data.abnormalStatus ? "border-l-[#00BCB4] " : "border-l-[#E1221C] "}
      // `}
      >
        <div className="flex h-[9.5em]">
          <div className={`w-5 pl-[20px] rounded-l-xl ${!data.abnormalStatus ? "bg-[#00BCB4] " : "bg-[#E1221C] "}`}
          />
          <div className="absolute lg:w-[30%] sm:w-[43%] w-[85%] px-5 pt-3">
            <div
              className="text-lg font-bold overflow-hidden  whitespace-nowrap overflow-ellipsis mx-2 "
              title={`${data.name}`}
            >
              {`${data.name}`}
            </div>
            <div className={`pb-2 px-2.5`}>
              <div className="text-sm text-key-card">
                อุณหภูมิตู้ :{" "}
                <span className="text-sm text-value-card-gray">
                  {data.temp != "-999" ? data.temp : '-'} °C
                </span>
              </div>
              <div className="text-sm text-key-card">
                สถานะละลายน้ำแข็ง :{" "}
                <span className="uppercase text-value-card-gray">
                  {data.defrostStatus}
                </span>
              </div>
              <div
                className="text-sm text-key-card overflow-hidden whitespace-nowrap overflow-ellipsis"
                title={data.defrostTimeline?.toString()}
              >
                ตารางการละลายน้ำแข็ง :{" "}
                <span className="text-sm text-value-card-gray">
                  {data.standardFlag ? data.defrostTimeline?.toString() : '-'}
                </span>
              </div>
              <div className="text-sm text-key-card">
                ระยะเวลาการละลายน้ำแข็ง :{" "}
                <span className="text-sm text-value-card-gray" hidden={!data.standardFlagMeltTime}>
                  {data.defrostDuration} min
                </span>
                <span hidden={data.standardFlagMeltTime}>-</span>
              </div>
              <div className="text-sm text-key-card">
                อุณหภูมิยกเลิกการละลายน้ำแข็ง :{" "}
                <span className="text-sm text-value-card-gray" hidden={!data.standardFlagCancelMeltTemp}>
                  {data.cancelDefrostTemp} °C
                </span>
                <span hidden={data.standardFlagCancelMeltTemp}>-</span>
              </div>
              <div className="text-sm text-key-card">
                คุณภาพสายสัญญาณ :{" "}
                <span className="text-sm text-value-card-gray" hidden={!data.communication}>
                  {data.communication || 0} %
                </span>
                <span hidden={data.communication}>-</span>
              </div>
            </div>
          </div>

          <img className='relative rounded-r-xl' style={{
            objectFit: "cover",
            height: "100%",
            // width: "max(10rem, 100vw)",
            width: 'calc(100% - 20px)'
          }}
            src={!data.abnormalStatus ? 'img/bg_card.svg' : 'img/bg_cardRed.svg'}
          />
        </div>
      </div>
    </>
  );
}
