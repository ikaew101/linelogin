export default function TabHeader({ items, tab, setTab }) {
  return (
    <div className="bg-primary p-2 my-4 mx-6  rounded-md justify-center flex lg:gap-4 relative z-30 gap-1 max-sm:grid max-sm:grid-cols-2 font-medium">
      {items?.map((item, index) => {
        return (
          <button
            key={index}
            name={item.name}
            className={`${
              tab == item.name && "bg-[#009B93]"
            } hover:shadow hover:bg-[#009B93]/[.8] py-2 px-3 rounded-md text-white w-full  max-w-[250px] font-bold`}
            onClick={item.onclick}
          >
            {item.title}
          </button>
        );
      })}
    </div>
  );
}
