import { useState } from "react";
import TabHeader from "../../components/RefrigConfig/TabHeader";
import SearchAlarm from "../../components/AirConfig/SearchAlarm";
import TableAlarm from "../../components/AirConfig/TableAlarm";
import SearchContractor from "../../components/AirConfig/SearchContractor";
import TableContractor from "../../components/AirConfig/TableContractor";

export default function AirConfigPage() {
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
      title: "Contractor",
      name: "contractor",
      onclick: () => {
        setTab("contractor");
      },
    },
  ]);
  const getCurrentTab = tabs.find((v) => v.name == stateTab);
  const [tab, setTab] = useState(getCurrentTab?.name || "alarm");

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">
        Configuration Air Condition
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

      {tab === "contractor" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchContractor />
          </div>
          <TableContractor />
        </>
      )}
    </div>
  );
}
