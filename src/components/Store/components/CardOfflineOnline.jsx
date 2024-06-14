import { cn } from "../../../helper/cn";

export default function CardOfflineOnline({ title, value, type }) {
  return (
    <div>
      <div className="border rounded-xl flex flex-col justify-start bg-white overflow-hidden">
        <div className="pb-4 p-3 flex justify-between">
          <div className="text-dark">{title}</div>
          {type === "online" && (
            <div className="w-8 h-8 rounded-full bg-[#809DED]" />
          )}
          {type === "offline" && (
            <div className="w-8 h-8 rounded-full bg-[#FA5A7D]" />
          )}
        </div>
        <center>
          <div
            className={cn("text-xl sm:text-2xl lg:text-5xl font-bold", {
              "text-[#333333s]": type === "online",
              "text-[#FA5A7D]": type === "offline",
            })}
          >
            {value}
          </div>
        </center>
        <img
          className="relative object-center "
          style={{
            objectFit: "cover",
            // width: "max(45vw, 90vw)"
            width: "100%",
          }}
          src="img/bg_bluecard2.png"
        />
      </div>
    </div>
  );
}
