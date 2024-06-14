import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "../../helper/cn";

export function EditGroup() {
  let { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("group");

  const [toggle, setToggle] = useState({
    status: 1,
    permission: { monitoring_page: true, kpi_page: false },
    monitoring_page: { visible: true, export: true },
    kpi_page: { visible: false, export: false },
  });

  // async function initData() {
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   initData()
  // }, []);

  async function submit() {
    const body = {
      status: toggle.status,
      permission: {
        monitoring_page: toggle.monitoring_page,
        kpi_page: toggle.kpi_page,
      },
    };
    console.log(id, body);

    // try {
    //     await UserService.editGroup(id, body)
    // }
  }

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6 flex items-center gap-2 cursor-default">
        <Link to="/manage_user">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825L13.425 18.6L12 20Z"
              fill="#565E6D"
            />
          </svg>
        </Link>
        <span className="text-[#B1B1B1]">การจัดการผู้ใช้งาน /</span>
        รายละเอียดข้อมูลกลุ่ม
      </div>
      <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex sm:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
        <button
          name="user"
          className={`${
            tab == "user" && "bg-[#009B93]"
          } hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
          onClick={(e) => {
            localStorage.setItem(
              "tab",
              JSON.stringify(["manageUser", e.target.name])
            );
            window.location.assign("/manage_user");
          }}
        >
          ผู้ใช้
        </button>
        <button
          name="group"
          className={`${
            tab == "group" && "bg-[#009B93]"
          } hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
          onClick={(e) => setTab(e.target.name)}
        >
          กลุ่ม
        </button>
      </div>

      <div className={`bg-white border -mt-10 mx-2 rounded-xl shadow-md `}>
        <div className="p-3">
          <div className=" p-2 mt-5">
            {/* {Object.entries(toggle).map(([key, value]) => `${key}: `)} */}

            <table className="border-separate border-spacing-y-4 text-dark">
              <tbody>
                <tr>
                  <td className="pr-10">Group name</td>
                  <td className="font-bold">GG-TH-PSE-FM_Manager</td>
                </tr>
                <tr>
                  <td>Remark</td>
                  <td>
                    Can view multiplestore in Division=5999 other else can view
                    only 1 store
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <label className="relative inline-flex items-center cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={toggle.status}
                        className="sr-only peer"
                        name="night"
                        onChange={() =>
                          setToggle({ ...toggle, status: !toggle.status })
                        }
                      />
                      <div
                        className={cn(
                          "w-11 h-6 bg-[#B1B1B1] peer-focus:outline-none  peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all mr-1.5 peer-checked:bg-[#006451]"
                        )}
                      />
                      {toggle.status ? "Active" : "Inactive"}
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border mt-3 mx-2 rounded-xl p-7 gap-3 sm:text-lg text-dark font-bold shadow-md">
        Permission
        <div className="sm:text-base text-sm flex gap-3 my-4 flex-wrap ">
          <CustomCheckbox
            label="Monitoring Page"
            id="monitioring"
            checked={toggle.permission.monitoring_page}
            onChange={() => {
              const value = toggle.permission.monitoring_page;
              setToggle({
                ...toggle,
                permission: {
                  ...toggle.permission,
                  monitoring_page: !value,
                },
                monitoring_page: {
                  visible: !value,
                  export: value ? false : toggle.monitoring_page.export,
                },
              });
            }}
          />

          <CustomCheckbox
            label=" KPI Page"
            id="KPI"
            checked={toggle.permission.kpi_page}
            onChange={() => {
              const value = toggle.permission.kpi_page;
              setToggle({
                ...toggle,
                permission: { ...toggle.permission, kpi_page: !value },
                kpi_page: {
                  visible: !value,
                  export: value ? false : toggle.kpi_page.export,
                },
              });
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:text-lg">
        <div
          className={cn(
            "shadow-md border mt-3 mx-2 rounded-xl p-7 gap-3 text-dark font-bold",
            toggle.permission.monitoring_page ? "bg-white" : "bg-[#F0F0F0]"
          )}
        >
          Monitoring page
          <div className="grid grid-cols-2 mb-3 mt-4">
            <div className="justify-self-start">
              <CustomSwitchOnOff
                checked={toggle.monitoring_page.visible}
                label="Visible"
                onChange={() => {
                  const value = toggle.monitoring_page.visible;
                  setToggle({
                    ...toggle,
                    monitoring_page: {
                      visible: !value,
                      export: value ? false : toggle.monitoring_page.export,
                    },
                    permission: {
                      ...toggle.permission,
                      monitoring_page: !value,
                    },
                  });
                }}
              />
            </div>

            <div className="justify-self-start">
              <CustomSwitchOnOff
                checked={toggle.monitoring_page.export}
                label="Export"
                onChange={() =>
                  setToggle({
                    ...toggle,
                    monitoring_page: {
                      ...toggle.monitoring_page,
                      export: !toggle.monitoring_page.export,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
        <div
          className={cn(
            "shadow-md border mt-3 mx-2 rounded-xl p-7 gap-3 text-dark font-bold",
            toggle.permission.kpi_page ? "bg-white" : "bg-[#F0F0F0]"
          )}
        >
          KPI page
          <div className="grid grid-cols-2 mb-3 mt-4">
            <div className="justify-self-start">
              <CustomSwitchOnOff
                checked={toggle.kpi_page.visible}
                label="Visible"
                onChange={() => {
                  const value = toggle.kpi_page.visible;
                  setToggle({
                    ...toggle,
                    kpi_page: {
                      visible: !value,
                      export: value ? false : toggle.kpi_page.export,
                    },
                    permission: { ...toggle.permission, kpi_page: !value },
                  });
                }}
              />
            </div>

            <div className="justify-self-start">
              <CustomSwitchOnOff
                label="Export"
                checked={toggle.kpi_page.export}
                onChange={() =>
                  setToggle({
                    ...toggle,
                    kpi_page: {
                      ...toggle.kpi_page,
                      export: !toggle.kpi_page.export,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border mt-3.5 mx-2 rounded-xl p-6 flex justify-end gap-3 text-sm shadow-md ">
        <button
          className="rounded-md border text-dark hover:bg-[#CFD4D9] p-2 min-w-[8rem] font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          onClick={() => (window.location.href = "/manage_user")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
              fill="#565E6D"
            />
          </svg>
          ยกเลิก
        </button>
        <button
          className="rounded-md border bg-primary hover:bg-[#00BCB4] p-2 min-w-[8rem] text-white font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          onClick={() => submit()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 21C4.45 21 3.979 20.804 3.587 20.412C3.195 20.02 2.99934 19.5493 3 19V5C3 4.45 3.196 3.979 3.588 3.587C3.98 3.195 4.45067 2.99934 5 3H16.175C16.4417 3 16.696 3.05 16.938 3.15C17.18 3.25 17.3923 3.39167 17.575 3.575L20.425 6.425C20.6083 6.60834 20.75 6.821 20.85 7.063C20.95 7.305 21 7.559 21 7.825V19C21 19.55 20.804 20.021 20.412 20.413C20.02 20.805 19.5493 21.0007 19 21H5ZM12 18C12.8333 18 13.5417 17.7083 14.125 17.125C14.7083 16.5417 15 15.8333 15 15C15 14.1667 14.7083 13.4583 14.125 12.875C13.5417 12.2917 12.8333 12 12 12C11.1667 12 10.4583 12.2917 9.875 12.875C9.29167 13.4583 9 14.1667 9 15C9 15.8333 9.29167 16.5417 9.875 17.125C10.4583 17.7083 11.1667 18 12 18ZM7 10H14C14.2833 10 14.521 9.904 14.713 9.712C14.905 9.52 15.0007 9.28267 15 9V7C15 6.71667 14.904 6.479 14.712 6.287C14.52 6.095 14.2827 5.99934 14 6H7C6.71667 6 6.479 6.096 6.287 6.288C6.095 6.48 5.99934 6.71734 6 7V9C6 9.28334 6.096 9.521 6.288 9.713C6.48 9.905 6.71734 10.0007 7 10Z"
              fill="white"
            />
          </svg>
          บันทึก
        </button>
      </div>
    </div>
  );
}

function CustomSwitchOnOff({ id, name, value, checked, onChange, label }) {
  return (
    <label className="flex select-none items-center mx-auto w-max sm:text-base text-sm gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          id={id}
          name={name}
          checked={checked}
          value={value}
          onChange={onChange}
        />
        <div
          className={cn(
            "box block h-6 w-[50px] rounded-full",
            checked ? "bg-primary" : "bg-[#BDBDBD]"
          )}
        />
        <div
          className={cn(
            "absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition",
            checked ? "translate-x-full left-[15px]" : "left-[3px]"
          )}
        />
      </div>
      <div
        className={cn(
          "absolute text-[13px] font-semibold text-white",
          checked ? "ml-2" : "ml-[21px]"
        )}
      >
        {checked ? "ON" : "OFF"}
      </div>
      {label}
    </label>
  );
}

{
  /* <label className="flex select-none items-center mx-auto w-max sm:text-base text-sm gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={toggle.kpi_page.visible}
                    // onChange={() => setToggle({ ...toggle, kpi_page: { ...toggle.kpi_page, visible: !toggle.kpi_page.visible } })}
                    onChange={() => {
                      const value = toggle.kpi_page.visible;
                      setToggle({
                        ...toggle,
                        kpi_page: {
                          visible: !value,
                          export: value ? false : toggle.kpi_page.export,
                        },
                        permission: { ...toggle.permission, kpi_page: !value },
                      });
                    }}
                  />
                  <div
                    className={`box block h-6 w-[50px] rounded-full ${
                      toggle.kpi_page.visible ? "bg-primary" : "bg-[#BDBDBD]"
                    }`}
                  />
                  <div
                    className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                      toggle.kpi_page.visible
                        ? "translate-x-full left-[15px]"
                        : "left-[3px]"
                    }`}
                  />
                </div>
                <div
                  className={`absolute text-[13px] font-semibold text-white ${
                    toggle.kpi_page.visible ? "ml-2" : "ml-[21px]"
                  } `}
                >
                  {toggle.kpi_page.visible ? "ON" : "OFF"}
                </div>
                Visible
              </label> */
}

{
  /* <label className="flex select-none items-center mx-auto w-max sm:text-base text-sm gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={toggle.kpi_page.visible}
                    onChange={() =>
                      setToggle({
                        ...toggle,
                        kpi_page: {
                          ...toggle.kpi_page,
                          export: !toggle.kpi_page.export,
                        },
                      })
                    }
                  />
                  <div
                    className={`box block h-6 w-[50px] rounded-full ${
                      toggle.kpi_page.export ? "bg-primary" : "bg-[#BDBDBD]"
                    }`}
                  />
                  <div
                    className={`absolute top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                      toggle.kpi_page.export
                        ? "translate-x-full left-[15px]"
                        : "left-[3px]"
                    }`}
                  />
                </div>
                <div
                  className={`absolute text-[13px] font-semibold text-white ${
                    toggle.kpi_page.export ? "ml-2" : "ml-[21px]"
                  } `}
                >
                  {toggle.kpi_page.export ? "ON" : "OFF"}
                </div>
                Export
              </label> */
}

function CustomCheckbox({ id, label, name, value, checked, onChange }) {
  return (
    <div
      className={cn(
        "border p-3 rounded-md min-w-[13rem]",
        checked ? "border-secondary" : "border-light"
      )}
    >
      <div className="flex items-center gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          name={name}
          value={value}
          className={cn(
            "text-[#809DED] focus:ring-0 rounded text-lg cursor-pointer form-checkbo",
            {
              "border !border-[#B1B1B1]": !checked,
            }
          )}
          onChange={onChange}
        />
        <label htmlFor={id} className="cursor-pointer">
          {label}
        </label>
      </div>
    </div>
  );
}
