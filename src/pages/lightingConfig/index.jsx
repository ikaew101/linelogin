import { useEffect, useState } from "react";
import TabHeader from "../../components/RefrigConfig/TabHeader";
import TableLighting from "../../components/LightingConfig/TableLighting";

export default function LightingConfigPage() {
  const stateTab = JSON.parse(localStorage.getItem("tab"));

  const [tabs, setTabs] = useState([
    {
      title: "Configuration / Condition",
      name: "configCondition",
      onclick: () => {
        setTab("configCondition");
      },
    },
  ]);
  const getCurrentTab = tabs.find((v) => v.name == stateTab);
  const [tab, setTab] = useState(getCurrentTab?.name || "configCondition");

  useEffect(() => {
    localStorage.setItem("tab", JSON.stringify(tab));
    // initData();
  }, [tab]);

  return (
    <div className="p-3 mt-5 mb-3">
      <div className="text-2xl pl-4 font-semibold md:pl-6">
        Configuration Lighting
      </div>

      <TabHeader items={tabs} tab={tab} setTab={setTab} />

      {tab === "configCondition" && (
        <>
          <div className={`-mt-10 mx-2`}>
            <TableLighting />
          </div>
        </>
      )}
    </div>
  );
}
