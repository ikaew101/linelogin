
export default function TabHeader({ tab, setTab }) {
  return (
    <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
      <button
        name="group"
        className={`${
          tab == "group" && "bg-[#009B93]"
        } hover:shadow hover:bg-[#009B93]/[.8] py-2  rounded-md text-white w-full  max-w-[250px]    px-2 transition-colors duration-100 font-bold`}
        onClick={(e) => setTab(e.target.name)}
      >
        Store group
      </button>
      <button
        name="setting"
        className={`${
          tab == "setting" && "bg-[#009B93]"
        } hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
        onClick={(e) => setTab(e.target.name)}
      >
        Store setting
      </button>
    </div>
  );
}
