import { useEffect, useState } from "react";
import TabHeader from "../../components/RefrigConfig/TabHeader";
import TableAlarm from "../../components/ChillerConfig/TableAlarm";
import SearchAlarm from "../../components/ChillerConfig/SearchAlarm";
import TableChillerPerformance from "../../components/ChillerConfig/TableChillerPerformance";
import TableChillerType from "../../components/ChillerConfig/TableChillerType";
import SearchChillerType from "../../components/ChillerConfig/SearchChillerType";

export default function ChillerConfigPage() {
  const stateTab = JSON.parse(localStorage.getItem("tab"));

  const [tabs, setTabs] = useState([
    {
      title: "Alarm priority",
      name: "alarm",
      onclick: () => {
        setTab("alarm");
      },
    },
    {
      title: "Chiller Performance",
      name: "chillerPerformance",
      onclick: () => {
        setTab("chillerPerformance");
      },
    },
    {
      title: "Chiller Type",
      name: "chillerType",
      onclick: () => {
        setTab("chillerType");
      },
    },
  ]);
  const getCurrentTab = tabs.find((v) => v.name == stateTab);
  const [tab, setTab] = useState(getCurrentTab?.name || "alarm");

  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify(tab));
    // initData();
  }, [tab]);

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">
        Configuration Chiller (Alarm Priority)
      </div>

      <TabHeader items={tabs} tab={tab} setTab={setTab} />

      {tab === "alarm" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchAlarm />
          </div>
          <TableAlarm />
        </>
      )}

      {tab === "chillerPerformance" && (
        <>
          <div className="-mt-10">
            <TableChillerPerformance />
          </div>
        </>
      )}

      {tab === "chillerType" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchChillerType />
          </div>
          <TableChillerType />
        </>
      )}
    </div>
  );
}
