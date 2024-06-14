import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import MonthName from "../const/month";
import th from "date-fns/locale/th";
import { useEffect, useState } from "react";

function DatePickerThai({ selected, onChange, maxDate }) {
    const [state, setState] = useState()

    useEffect(() => {
        setState()
    }, [selected])

    return (
        <ReactDatePicker
            className="border rounded-md p-2 w-full outline-0"
            onChange={onChange}
            selected={selected}
            // dateFormat='dd/MM/yyyy'
            locale={th}
            maxDate={maxDate}
            showPopperArrow={false}
            popperPlacement="bottom"
            value={selected ? new Date(selected).toLocaleDateString('th', { year: 'numeric', month: '2-digit', day: "2-digit" })
                : ""}
            popperModifiers={[
                {
                    name: "flip",
                    options: {
                        fallbackPlacements: ["bottom"],
                        allowedAutoPlacements: ["bottom"],
                    },
                },
            ]}
            // calendarContainer={({ className, children }) => {
            //     return (
            //         // open &&
            //         <div>
            //             <CalendarContainer className={className}>
            //                 {/* <CalendarContainer> */}
            //                 <div style={{ position: "relative" }}>
            //                     {children}
            //                 </div>
            //             </CalendarContainer>
            //         </div>
            //     );
            // }}
            // renderDayContents={(date, day) => (
            //     <div className="rounded-full selected:bg-red-200">{date}</div>
            // )}
            renderCustomHeader={({
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                date,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
                decreaseYear,
                increaseYear,
            }) => (
                <div className="flex justify-between bg-white">
                    <button className=" rounded-full text-primary font-bold px-2 ml-2 hover:bg-slate-100"
                        onClick={() => state != 'month' ? decreaseMonth() : decreaseYear()}
                        disabled={prevMonthButtonDisabled}
                        hidden={state == 'year'}>
                        {'<'}
                    </button>
                    <span className="text-primary font-bold p-[5px] hover:bg-slate-100 rounded cursor-pointer px-2"
                        onClick={() => state != 'month' ? setState('month') : setState()}
                    >
                        {state == 'year' ? 'เลือกปี' : <>
                            <span hidden={state == 'month'}>
                                {MonthName[new Date(date).getMonth()]}
                            </span> <span
                            // onClick={() => setState('year')} // year show 2023 \\
                            >{new Date(date).getFullYear() + 543}</span>
                        </>
                        }
                    </span>
                    <button className=" rounded-full text-primary font-bold px-2 mr-2 hover:bg-slate-100"
                        onClick={() => state != 'month' ? increaseMonth() : increaseYear()}
                        disabled={nextMonthButtonDisabled}
                        hidden={state == 'year'}>
                        {'>'}
                    </button>
                </div>
            )}
            showYearPicker={state == 'year'}
            showMonthYearPicker={state == 'month'}
            // showMonthYearDropdown
            // closeOnScroll={true}
            shouldCloseOnSelect={state ? false : true}
        />
    )
}

export default DatePickerThai