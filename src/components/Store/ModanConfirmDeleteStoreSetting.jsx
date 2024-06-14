import Swal from "sweetalert2";
import StoreService from "../../service/store";
import ModalWrapper from "../base/modal/ModalWrapper";

export function ModanConfirmDeleteStoreSetting({
  isOpen,
  onClose,
  storeData,
  onSuccess,
}) {
  async function handleSubmit() {
    try {
      await StoreService.delete(storeData?.id);
      Swal.fire({
        title: "ลบข้อมูลสำเร็จ",
        text: "คุณได้ทำการลบข้อมูลสำเร็จแล้ว",
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
      className="!max-w-[400px] bg-white rounded-xl p-5 text-lg"
      onClose={onClose}
    >
      <div>
        <div className="text-center font-bold text-[#EB5757] mt-4">
          คุณต้องการลบ Store
        </div>
        <div className="flex flex-col gap-y-4 my-8 text-center">
          <div className="font-bold text-dark text-lg">{storeData?.name}</div>
          <div className="text-sm text-dark">
            รหัสสาขา : {storeData?.store_number}
          </div>
          <div className="text-sm text-dark">
            Cost Center : {storeData?.cost_center}
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border text-dark hover:bg-[#CFD4D9] py-1.5 px-4 text-sm font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
              onClick={() => onClose()}
            >
              <svg
                width="16"
                height="16"
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
              type="button"
              className="rounded-md border bg-[#EB5757] hover:bg-[#b74444] py-1.5 px-4 text-sm text-white font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
              onClick={handleSubmit}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.4 13.5L8 10.9L10.6 13.5L12 12.1L9.4 9.5L12 6.9L10.6 5.5L8 8.1L5.4 5.5L4 6.9L6.6 9.5L4 12.1L5.4 13.5ZM3 18C2.45 18 1.979 17.804 1.587 17.412C1.195 17.02 0.999333 16.5493 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.804 17.021 14.412 17.413C14.02 17.805 13.5493 18.0007 13 18H3Z"
                  fill="white"
                />
              </svg>
              ยืนยันลบ
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
