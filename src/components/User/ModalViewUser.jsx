import CardStore from "../Store/components/CardStore";
import ModalWrapper from "../base/modal/ModalWrapper";

export default function ModalViewUser({ isOpen, onClose, selectedUser }) {
  return (
    <ModalWrapper className="!max-w-[940px]" isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center">
        <b className="text-lg text-dark">รายละเอียดผู้ใช้</b>
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
      {/* content */}
      <div className="mt-4">
        <table className="border-separate border-spacing-y-4 text-dark ">
          <tbody>
            <tr>
              <td className="pr-10">Username</td>
              <td className="font-bold">th0700171</td>
            </tr>
            <tr>
              <td>Division</td>
              <td className="font-bold">05018</td>
            </tr>
            <tr>
              <td>Email</td>
              <td className="font-bold">manusark.exa@lotus.th</td>
            </tr>
            <tr>
              <td>Firstname</td>
              <td className="font-bold">Manusark</td>
            </tr>
            <tr>
              <td>Lastname</td>
              <td className="font-bold">Examplename</td>
            </tr>
            <tr>
              <td>Group</td>
              <td className="font-bold">GG-TH-PSE-FM_Manager</td>
            </tr>
            <tr>
              <td>Status</td>
              <td className="font-bold">Active</td>
            </tr>
          </tbody>
        </table>

        {/* Card store */}
        <div className="text-dark mb-2">Store</div>
        <div className="max-h-[25vh] overflow-y-auto scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
            {Array.from({ length: 20 }, (_, index) => {
              return (
                <div key={index}>
                  <CardStore data={selectedUser} />
                </div>
              );
            })}
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="rounded-md border text-dark w-full max-w-[248px] hover:bg-[#CFD4D9] py-1.5 px-4 text-sm font-bold hover:shadow-md shadow flex gap-1 justify-center items-center"
            onClick={() => onClose()}
          >
            ปิด
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
