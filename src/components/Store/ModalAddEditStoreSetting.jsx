import ModalWrapper from "../base/modal/ModalWrapper";
import { cn } from "../../helper/cn";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import StoreService from "../../service/store";
import Swal from "sweetalert2";

export default function ModalAddStoreSetting({
  isOpen,
  onClose,
  storeData,
  onSuccess,
  storeFormatList = [],
}) {
  function convertFormatTime(time) {
    if (!time) return "";
    const [hours, minute] = time.split(":");
    const formattedHours = String(hours).padStart(2, "0");
    if (hours === "24 Hours") {
      return "24 Hours";
    }
    return `${formattedHours}:${minute}`;
  }

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: storeData?.id
      ? {
          name: storeData?.name,
          storeNumber: storeData?.store_number,
          costCenter: storeData?.cost_center,
          active: storeData?.active,
          flag: storeData?.flag,
          openTime: convertFormatTime(storeData?.openTime),
          closeTime: convertFormatTime(storeData?.closeTime),
          format_id: storeData?.format_id,
        }
      : {
          name: "",
          storeNumber: "",
          costCenter: "",
          active: "",
          flag: "",
          openTime: "",
          closeTime: "",
          format_id: "",
        },
  });

  async function onSubmit(data) {
    try {
      // update
      if (storeData?.id) {
        // ขาด Filed  Parent
        // storeData?.id บน table ที่ได้ไม่ตรงกับ ID ที่ create ทำให้ update แล้วไม่เจอ data
        const res = await StoreService.update(storeData?.id, data);
        console.log(res);
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          text: "คุณได้ทำการบันทึกข้อมูลสำเร็จแล้ว",
          icon: "success",
          customClass: {
            popup: "LotussSmartHL-Regular",
            confirmButton: "!bg-primary",
          },
          confirmButtonText: "ยืนยัน",
        });
        onSuccess();
        return;
      }
      // create
      // ขาด Filed Parent
      await StoreService.create(data);
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        text: "คุณได้ทำการบันทึกข้อมูลสำเร็จแล้ว",
        icon: "success",
        customClass: {
          confirmButton: "!bg-primary",
        },
        confirmButtonText: "ยืนยัน",
      });
      onClose();
      onSuccess();
    } catch (error) {
      Swal.fire({
        text: error?.message || "มีข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        customClass: {
          confirmButton: "!bg-primary",
        },
        confirmButtonText: "ปิด",
      });
    }
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      className="!max-w-[800px] bg-white rounded-xl p-5 text-lg"
      onClose={onClose}
    >
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center text-dark">
            {!storeData?.id ? (
              <b>สร้าง Store ใหม่</b>
            ) : (
              <b>แก้ไขข้อมูล Store</b>
            )}

            <div className="cursor-pointer" onClick={() => onClose()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                  fill="#B1B1B1"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-y-auto scrollbar cursor-default max-h-[78vh] py-5">
            <div className="self-start grid grid-cols-1  sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <div className="text-sm text-[#666666]">ชื่อสาขา</div>
                <input
                  className=" border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 px-2 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                  placeholder="ระบุชื่อสาขา"
                  {...register("name", {
                    required: "กรุณาระบุ",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }) => (
                    <span className="text-red-500 text-xs ml-2">{message}</span>
                  )}
                />
              </div>
              <div>
                <div className="text-sm text-[#666666]">รหัสสาขา</div>
                <input
                  type="number"
                  className="no-arrow border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 px-2 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                  placeholder="รหัสสาขา"
                  {...register("storeNumber", {
                    required: "กรุณาระบุ",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="storeNumber"
                  render={({ message }) => (
                    <span className="text-red-500 text-xs ml-2">{message}</span>
                  )}
                />
              </div>
              <div>
                <div className="text-sm text-[#666666]">Cost Center</div>
                <input
                  type="number"
                  className="no-arrow border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 px-2 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                  placeholder="Cost Center"
                  {...register("costCenter", {
                    required: "กรุณาระบุ",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="costCenter"
                  render={({ message }) => (
                    <span className="text-red-500 text-xs ml-2">{message}</span>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <div className="text-sm">ประเภทสาขา</div>
                <div>
                  <select
                    className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white disabled:bg-gray-100"
                    disabled={storeData?.id}
                    {...register("format_id", {
                      required: "กรุณาระบุ",
                    })}
                  >
                    {storeFormatList.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    errors={errors}
                    name="format_id"
                    render={({ message }) => (
                      <span className="text-red-500 text-xs ml-2">
                        {message}
                      </span>
                    )}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm">เวลาเปิดสาขา (Open)</div>
                <input
                  type="time"
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white disabled:bg-gray-100"
                  {...register("openTime", {})}
                />
              </div>
              <div>
                <div className="text-sm">เวลาปิดสาขา (Close)</div>
                <input
                  type="time"
                  className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white disabled:bg-gray-100"
                  {...register("closeTime", {})}
                />
              </div>
              <div
                className={cn(
                  "",
                  !storeData?.id ? "sm:col-span-4" : "sm:col-span-2"
                )}
              >
                <div className="text-sm">Parent</div>
                <div>
                  <select className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"></select>
                </div>
              </div>
              {storeData?.id && (
                <div className="sm:col-span-2">
                  <div className="text-sm">สถานะ</div>
                  <div>
                    <select
                      className="w-full p-2 border text-sm border-gray-300 text-gray-500 rounded-lg cursor-pointer outline-0 h-[2.5em] bg-white"
                      {...register("active", {
                        required: "กรุณาระบุ",
                      })}
                    >
                      <option value="1">Active</option>
                      <option value="-1">Inactive</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border text-dark hover:bg-[#CFD4D9] py-1.5 px-4 text-sm font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
                onClick={() => onClose()}
              >
                <svg
                  width="20"
                  height="20"
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
                type="submit"
                className="rounded-md border bg-primary hover:bg-[#00BCB4] py-1.5 px-4 text-sm text-white font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
                disabled={isSubmitting}
              >
                <svg
                  width="20"
                  height="20"
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
        </form>
      </div>
    </ModalWrapper>
  );
}
