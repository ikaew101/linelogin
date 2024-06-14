import { cn } from "../../helper/cn";
import ModalWrapper from "../base/modal/ModalWrapper";
import { MdDelete } from "react-icons/md";

export default function ModalSuccess({
  onClose,
  children,
  className,
  type = "success",
}) {
  return (
    <ModalWrapper onClose={onClose}>
      <div className={cn("mx-auto w-full max-w-[600px] p-3", className)}>
        <div className="bg-white rounded-lg p-5 text-lg ">
          <div className="flex justify-between items-center text-dark">
            <div></div>
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

          <div className="overflow-y-auto scrollbar cursor-default max-h-[78vh] sm:p-5 py-2">
            <div className="text-center">
              <div className="flex justify-center">
                {type === "success" && (
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_522_1263)">
                      <path
                        d="M45 0C20.1473 0 0 20.1473 0 45C0 69.8541 20.1473 90 45 90C69.8541 90 90 69.8541 90 45C90 20.1473 69.8541 0 45 0ZM45 84.4636C23.2889 84.4636 5.625 66.7111 5.625 44.9998C5.625 23.2887 23.2889 5.62482 45 5.62482C66.7111 5.62482 84.375 23.2888 84.375 44.9998C84.375 66.7108 66.7111 84.4636 45 84.4636ZM62.9592 28.5342L36.5568 55.1025L24.6669 43.2127C23.5687 42.1144 21.7884 42.1144 20.6887 43.2127C19.5904 44.3109 19.5904 46.0912 20.6887 47.1895L34.6091 61.1114C35.7074 62.2083 37.4877 62.2083 38.5874 61.1114C38.714 60.9848 38.8223 60.8469 38.9208 60.7036L66.9389 32.5124C68.0358 31.4141 68.0358 29.6338 66.9389 28.5342C65.8392 27.4359 64.0589 27.4359 62.9592 28.5342Z"
                        fill="#27AE60"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_522_1263">
                        <rect width="90" height="90" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {type === "delete" && (
                  <MdDelete className="text-[#EB5757] w-20 h-20" />
                )}
              </div>
            </div>
            {type === "success" && (
              <h2 className="text-xl text-[#27AE60] text-center font-bold mt-4">
                Update Success
              </h2>
            )}
            {type === "delete" && (
              <h2 className="text-xl text-[#EB5757] text-center font-bold mt-4">
                Delete Success
              </h2>
            )}
            <div className="h-2 border-[#BDBDBD] border-t border-dashed my-3" />
            {/* content */}
            {children}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

export function ItemSuccess({ title, text }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-gray-400 text-sm">{title} : </div>
      <div className="font-bold text-sm flex-1">{text} </div>
    </div>
  );
}
