export default function CardStore({ data, isDelete, onDelete }) {
  if (data?.division == "5999") {
    return (
      <div className="relative">
        <div className="flex-wrap flex gap-3 mt-2">
          <div className="text-sm border rounded-md w-full  text-dark p-3">
            <div className="flex gap-3 items-start justify-between">
              <h6 className="text-md font-bold text-base line-clamp-3 text-ellipsis ">
                Group store for FM Manager of North
                <div className="block">area - 017</div>
              </h6>
              {isDelete && (
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
              )}
            </div>
            <div className="mt-2">จำนวน : store</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative ">
        <div className="flex-wrap flex gap-3">
          <div className="text-sm border text-dark p-3 rounded-md  w-full grid items-center gap-y-2">
            <div className="flex items-center gap-3">
              <img src="/icon/store.svg" className="mb-1" />
              <b className="text-base ">44321</b>

              {isDelete && (
                <div
                  className="absolute right-1 top-1.5 cursor-pointer"
                  onClick={onDelete}
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
              )}
            </div>
            <div>
              <p className="line-clamp-2 mb-1.5">
                ชื่อสาขา : Soi 6 Praholyothin road
              </p>
              Cost center : 75540
            </div>
          </div>
        </div>
      </div>
    );
  }
}
