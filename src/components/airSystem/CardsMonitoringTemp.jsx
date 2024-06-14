import { useState } from "react"




export default function CardsMonitoringTemp({ format, data, config, isLoading, saving, flag }) {

  return (<>
    {format == "mini" &&
      <div className="grid grid-cols-2 items-end max-sm:grid-cols-1 gap-y-2 gap-x-3 max-sm:gap-2 justify-items-center my-1">


        {/* <CardMoniterItem title="AVG air return (°C)" saving={saving} icon={<img src="icon/air_return.png" className="w-10 h-10" />}>
        {isLoading
              ? <br />
              : (data?.averageAirReturnTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.averageAirReturnTemp <= (config?.min) ? "text-blue-bar"
                  : data?.averageAirReturnTemp >= (config?.max) ? "text-danger" : "text-dark"}`}>
                  {data?.averageAirReturnTemp.toFixed(2) || <br />}
                </p>
              )
            }
        </CardMoniterItem> */}

        <CardMoniterItem title="ภายในสาขา (°C)" saving={saving} icon={<img src="icon/building.png" className="w-10 h-10" />}>
          {isLoading
            ? <br />
            : (data?.indoorTemp == '-999' ? "ไม่พบข้อมูล"
              :
              <p className={`text-5xl font-bold ${data?.indoorTemp <= config?.min ? "text-blue-bar"
                : data?.indoorTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                {data?.indoorTemp.toFixed(2) || <br />}
              </p>
            )
          }
        </CardMoniterItem>


        <CardMoniterItem title="ภายนอกสาขา (°C)" saving={saving} icon={<img src="icon/outside.png" className="w-10 h-10" />}>
          {isLoading
            ? <br />
            : (data?.outdoorTemp == '-999' ? "ไม่พบข้อมูล"
              :
              <p className={`text-5xl font-bold ${data?.outdoorTemp <= config?.min ? "text-blue-bar"
                : data?.outdoorTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                {data?.outdoorTemp.toFixed(2) || <br />}
              </p>
            )
          }
        </CardMoniterItem>



      </div>}


    {format == "hyper" &&
      <div className="grid md:grid-cols-4 grid-cols-2 items-end max-sm:grid-cols-1 gap-y-2 gap-x-3 max-sm:gap-2 justify-items-center my-1">
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            พื้นที่ขาย (°C)
            <img src="icon/pushcart.png" className="w-10 h-10" />
          </div>
          <div className="max-sm:w-[85%] w-[22%] max-md:w-[46%] py-7 text-secondary -mt-3 flex justify-center items-center rounded-b-lg bg-cover bg-center-bottom
          absolute">
            {isLoading
              ? <br />
              : (data?.saleTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.saleTemp <= config?.min ? "text-blue-bar"
                  : data?.saleTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.saleTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg' style={{
            objectFit: "cover",
            height: "6rem",
            width: "100%"
          }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ร้านค้าเช่า (°C)
            <img src="icon/store_rent.png" className="w-10 h-10" />
          </div>
          <div className="max-sm:w-[85%] w-[22%] max-md:w-[46%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom
          absolute">
            {isLoading
              ? <br />
              : (data?.mallTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.mallTemp <= config?.min ? "text-blue-bar"
                  : data?.mallTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.mallTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{
              objectFit: "cover",
              height: "6rem",
              width: "100%"
            }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ศูนย์อาหาร (°C)
            <img src="icon/foodcourt.png" className="w-10 h-10" />
          </div>
          <div className="max-sm:w-[85%] w-[22%] max-md:w-[46%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom
          absolute">
            {isLoading
              ? <br />
              : (data?.foodTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.foodTemp <= config?.min ? "text-blue-bar"
                  : data?.foodTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.foodTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{
              objectFit: "cover",
              height: "6rem",
              width: "100%"
            }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            นอกสาขา (°C)
            <img src="icon/out_branch.png" className="w-10 h-10" />
          </div>
          <div className="max-sm:w-[85%] w-[22%] max-md:w-[46%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom
          absolute">
            {isLoading
              ? <br />
              : (data?.outsideTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.outsideTemp <= config?.min ? "text-blue-bar"
                  : data?.outsideTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.outsideTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{
              objectFit: "cover",
              height: "6rem",
              width: "100%"
            }}
            src='img/card_air .png'
          />
        </div>
      </div>}

    {format == "super" &&
      <div className="grid grid-cols-6 max-[1200px]:grid-cols-4 max-md:grid-cols-3 items-end max-sm:grid-cols-1 gap-y-2 gap-x-3 max-sm:gap-2 justify-items-center my-1">
        {/* <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            AVG Air return (°C)
            <img src="icon/air_return.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.averageAirReturnTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.averageAirReturnTemp <= config?.min ? "text-blue-bar"
                  : data?.averageAirReturnTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.averageAirReturnTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg' style={{
            objectFit: "cover",
            height: "6rem",
            width: "100%"
          }}
            src='img/card_air .png'
          />
        </div> */}
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ภายในสาขา (°C)
            <img src="icon/building.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.indoorTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.indoorTemp <= config?.min ? "text-blue-bar"
                  : data?.indoorTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.indoorTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ภายนอกสาขา (°C)
            <img src="icon/outside.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.outdoorTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.outdoorTemp <= config?.min ? "text-blue-bar"
                  : data?.outdoorTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.outdoorTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            พื้นที่ขาย (°C)
            <img src="icon/pushcart.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.saleTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.saleTemp <= config?.min ? "text-blue-bar"
                  : data?.saleTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.saleTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ร้านค้าเช่า (°C)
            <img src="icon/store_rent.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.mallTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.mallTemp <= config?.min ? "text-blue-bar"
                  : data?.mallTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.mallTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            ศูนย์อาหาร (°C)
            <img src="icon/foodcourt.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.foodTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.foodTemp <= config?.min ? "text-blue-bar"
                  : data?.foodTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.foodTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
        <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg`}>
          <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
            นอกสาขา (°C)
            <img src="icon/out_branch.png" className="w-10 h-10" />
          </div>
          <div className="absolute max-sm:w-[85%] w-[15%] max-[1200px]:w-[22%] max-md:w-[29%] py-7 flex justify-center items-center text-secondary -mt-3 rounded-b-lg bg-cover bg-center-bottom">
            {isLoading
              ? <br />
              : (data?.outsideTemp == '-999' ? "ไม่พบข้อมูล"
                :
                <p className={`text-5xl font-bold ${data?.outsideTemp <= config?.min ? "text-blue-bar"
                  : data?.outsideTemp >= config?.max ? "text-danger" : "text-dark"}`}>
                  {data?.outsideTemp.toFixed(2) || <br />}
                </p>
              )
            }
          </div>
          <img className='relative object-center rounded-b-lg'
            style={{ objectFit: "cover", height: "6rem", width: "100%" }}
            src='img/card_air .png'
          />
        </div>
      </div>}
  </>)
}

function CardMoniterItem({ children, title, saving, icon }) {

  return <div className={`grid-rows-2 w-full ${saving != 'JPEG' && 'shadow'} rounded-lg relative`}>
    <div className="flex items-center gap-1 p-2 rounded-t-lg justify-between">
      {title}
      {icon}
    </div>

    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-secondary mt-2.5 rounded-b-lg" id="">
      {children}
    </div>

    <img className='relative object-top rounded-b-lg ' style={{
      objectFit: "cover",
      height: "6rem",
      width: "100%"
    }}
      src='img/card_air .png'
    />
  </div>
}
