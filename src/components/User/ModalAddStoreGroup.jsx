import { useEffect, useState } from "react";
import ModalWrapper from "../base/modal/ModalWrapper";
import DropdownSearch from "./dropdownSearch";

export default function ModalAddStoreGroup({
  isOpen,
  onClose,
  setIsModalAddStoreGroup,
  callbackData,
  storeDetail,
  setStoreDetail,
}) {
  const [newStoreGroup, setNewStoreGroup] = useState(storeDetail);
  const [text, setText] = useState("");
  const [listGroup, setListGroup] = useState("");
  useEffect(() => {
    getAllStoreGroup();
  }, []);

  async function getAllStoreGroup() {
    //const res = await
    // setListGroup(res.)
  }

  function deleteItem(index) {
    // newStoreGroup.findIndex(ele => ele.id =)
    const groups = [...newStoreGroup];
    groups.splice(index, 1);
    setNewStoreGroup(groups);
  }

  return (
    <ModalWrapper className="max-w-[750px]" isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center">
        <b className="text-dark">เพิ่ม Store group</b>

        <div
          className="cursor-pointer"
          onClick={() => setIsModalAddStoreGroup(false)}
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
              fill="#B1B1B1"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-row-2 text-sm my-4 gap-y-1">
        เลือก store group
        <DropdownSearch
          name="storeNumber"
          value={text}
          setValue={(value) => setText(value)}
          list={listGroup}
          showIcon
        />
      </div>

      <div className="overflow-y-auto scrollbar cursor-default">
        <div className="h-[50vh] ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
            {newStoreGroup.map((element, index) => (
              <div key={index}>
                <CardStoreGroup onDelete={() => deleteItem(index)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl flex justify-end gap-3 text-sm">
        <button
          className="rounded-md border text-dark hover:bg-light p-2 min-w-[6rem] font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          onClick={() => onClose()}
        >
          ยกเลิก
        </button>
        <button
          className="rounded-md border bg-primary hover:bg-[#00BCB4] p-2 min-w-[6rem] text-white font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
          onClick={() => {
            setStoreDetail(newStoreGroup);
            setIsModalAddStoreGroup(false);
          }}
        >
          ยืนยัน
        </button>
      </div>
    </ModalWrapper>
  );
}

function CardStoreGroup({ onDelete }) {
  return (
    <div className="relative">
      <div className="flex-wrap flex gap-3">
        <div className="text-sm border rounded-md w-full  text-dark p-3">
          <div className="flex gap-3 items-start justify-between">
            <h6 className="text-md font-bold text-base line-clamp-3 text-ellipsis ">
              Group store for FM Manager of North
              <div className="block">area - 017</div>
            </h6>

            <div className="cursor-pointer" onClick={onDelete}>
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
          <div className="mt-2">จำนวน : 12 store</div>
        </div>
      </div>
    </div>
  );
}
