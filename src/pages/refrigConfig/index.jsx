import { useEffect, useState } from "react";
import TabHeader from "../../components/RefrigConfig/TabHeader";
import SearchAlarm from "../../components/RefrigConfig/SearchAlarm";
import TableAlarm from "../../components/RefrigConfig/TableAlarm";
import SearchContractor from "../../components/RefrigConfig/SearchContractor";
import TableContractor from "../../components/RefrigConfig/TableContractor";
import SearchSetpoint from "../../components/RefrigConfig/SearchSetpoint";
import TableSetpoint from "../../components/RefrigConfig/TableSetpoint";
import ModalSuccess from "../../components/RefrigConfig/ModalSuccess";

export default function RefrigConfigPage() {
  const stateTab = JSON.parse(localStorage.getItem("tab"));

  const [tabs, setTabs] = useState([
    {
      title: "Alarm Priority",
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
    {
      title: "Setpoint",
      name: "setpoint",
      onclick: () => {
        setTab("setpoint");
      },
    },
  ]);
  const getCurrentTab = tabs.find((v) => v.name == stateTab);
  const [tab, setTab] = useState(getCurrentTab?.name || "alarm");

  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify(tab));
    // initData();
  }, [tab]);

  //   contractor
  const [format, setFormat] = useState("");
  const [type, setType] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">
        Configuration Refrigeration
      </div>

      <TabHeader items={tabs} tab={tab} setTab={setTab} />

      {tab == "alarm" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchAlarm />
          </div>

          <TableAlarm />
        </>
      )}

      {tab == "contractor" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchContractor
              type={type}
              setType={setType}
              format={format}
              setFormat={setFormat}
              saving={saving}
            />
          </div>
          <TableContractor />
        </>
      )}

      {tab == "setpoint" && (
        <>
          <div className="bg-white border -mt-10 mx-2 rounded-xl shadow">
            <SearchSetpoint
              type={type}
              setType={setType}
              format={format}
              setFormat={setFormat}
              saving={saving}
            />
          </div>
          <TableSetpoint />
        </>
      )}
    </div>
  );
}
