import React from "react";
import { useNavigate } from "react-router-dom";

export default function CompressorRack({
  idx,
  data,
  saving
}) {

  return (
    <>
      <div key={idx}
        // className={`h-[14rem] shadow border-[1px] border-l-[22px] border-solid rounded-xl pt-3  text-lg cursor-default w-full hover:shadow-md font-semibold 
        // ${!data.abnormalStatus ? "border-l-[#00BCB4]" : "border-l-[#E1221C]"}
        // bg-cover bg-left-bottom `}
        className={`${!saving && "shadow"} border rounded-xl text-lg w-full hover:shadow-md font-semibold`}
      >
        <div className="flex h-[13em]">
          <div className={`w-5 pl-[20px] rounded-l-xl ${!data.abnormalStatus ? "bg-[#00BCB4] " : "bg-[#E1221C] "}`}
          />
          <div className="absolute mx-2 pb-1.5 lg:w-[30%] sm:w-[43%] w-[85%] px-5 pt-3">
            <div
              className="text-lg font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
              title={`${data?.name}`}
            >
              {`${data?.name}`}
            </div>

            <div className="overflow-y-auto h-[190px] scrollbar">
              <div className="text-sm text-key-card">
                Setpoint Suction :{" "}
                <span className="text-sm text-value-card-gray">
                  {data?.setpointSuction}
                </span>
              </div>
              <div className="text-sm text-key-card">
                Setpoint Discharge :{" "}
                <span className="text-sm text-value-card-gray">
                  {data?.setpointDischarge}
                </span>
              </div>
              <div className="text-sm text-key-card">
                Actual Suction :{" "}
                <span className="text-sm text-value-card-gray">{data?.actualSuction}</span>
              </div>
              <div className="text-sm text-key-card">
                Actual Discharge :{" "}
                <span className="text-sm text-value-card-gray">
                  {data?.actualDischarge}
                </span>
              </div>

              {data?.compressorStatus?.map((ele, ind) => (
                <div key={ind} className="text-sm text-key-card">
                  สถานะ Compressor {ind + 1} :{" "}
                  <span className={`text-value-card-gray`} >
                    {ele}
                  </span>
                </div>
              ))}

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
            width: 'calc(100% - 20px)'
          }}
            src={!data.abnormalStatus ? 'img/cardCompressorRack.png' : 'img/cardCompressorRack_R.png'} />
        </div>
      </div>
    </>
  );
}
