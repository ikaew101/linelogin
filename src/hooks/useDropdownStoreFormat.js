import { useEffect, useState } from "react";
import StoreService from "../service/store";
import { toBigInt } from "../helper/utils";

export default function useDropdownStoreFormat() {
  const [storeFormatList, setStoreFormatList] = useState([]);

  async function initStoreFormat() {
    try {
      // dropdown ประเภทสาขา
      const res = await StoreService.getStoreFormat();
      setStoreFormatList(
        res?.data
          .filter((v) => v.name !== "")
          .map((v) => {
            return {
              label: v.name,
              value: toBigInt(v.id),
              ele: v,
            };
          })
          .sort((a, b) => {
            const aStartsWithMini = a.label?.toLowerCase().startsWith("mini");
            const bStartsWithMini = b.label?.toLowerCase().startsWith("mini");
            if (aStartsWithMini && !bStartsWithMini) {
              return -1;
            } else if (!aStartsWithMini && bStartsWithMini) {
              return 1;
            } else {
              return b.label.localeCompare(a.label);
            }
          })
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initStoreFormat();
  }, []);
  return {
    storeFormatList,
  };
}
