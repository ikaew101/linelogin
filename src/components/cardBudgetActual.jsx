import React from "react";

function CardBudgetActual({ data, loading, Total }) {

    const Budget = data?.budgetKwh || 0
    const Actual = data?.actualKwh || 0
    const total = Math.max(Budget, Actual)

    const percent = (value, all) => {
        const percent = value / total * 100
        if (percent) {
            return percent > 100 ? 100 : percent
        } else {
            return 0
        }
    }

    return (
        <>
            <div className='w-full text-sm'>
                <div className='flex items-center'>
                    <img className='w-[55px] h-[55px]' src='img/icon-greenB.svg' alt='' />
                    <div className='py-3'>
                        <div className='flow-root'>
                            <label className='text-secondary text-2 pl-5'>งบประมาณ (kWh)</label>
                        </div>
                        <div className='flow-root'>
                            <label className='font-bold text-2 pl-5'>
                                {!loading && <> {Budget == -999 ? '-' : Budget?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}</>}
                            </label>
                        </div>
                    </div>
                </div>
                <div className={`w-full bg-[#CFD4D9] rounded-full h-2.5 group`}>
                    <div className="group-hover:flex justify-center hidden">
                        {Budget > 0 && !loading && <div className="border shadow rounded-md p-2  absolute -mt-12 bg-white text-secondary w-fit">
                            <b className="">
                                <span className="text-[#2D890B] mr-3">งบประมาณ</span>
                                {Budget?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} </b> kWh
                        </div>}
                    </div>
                    <div className={`h-2.5 rounded-full ${loading && `animate-pulse`} transition-colors duration-300`}
                        // width={`${percent(Budget, Total)}%`}
                        style={{ backgroundImage: `linear-gradient(to right, #054E05 , #17B417)`, width: `${percent(Budget, Total)}%` }}
                    />
                </div>
            </div>

            <div className='w-full text-sm py-3'>
                <div className='flex items-center'>
                    <img className='w-[55px] h-[55px] ' src='img/icon-greenA.svg' alt='' />
                    <div className='py-3'>
                        <div className='flow-root'>
                            <label className='text-[#565E6D] text-2 pl-5'>การใช้งานจริง (kWh)</label>
                        </div>
                        <div className='flow-root'>
                            <label className='font-bold text-2 pl-5'>
                                {!loading && <> {Actual == -999 ? '-' : Actual?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}</>}
                            </label>
                        </div>
                    </div>
                </div>
                <div className={`w-full bg-[#CFD4D9] rounded-full h-2.5 group`}>
                    <div className="group-hover:flex justify-center hidden">
                        {!loading && Actual > 0 && <div className="border shadow rounded-md p-2  absolute -mt-12 bg-white text-secondary w-fit">
                            <b className="">
                                <span className="text-[#76CA27] mr-3">การใช้งานจริง</span>
                                {Actual?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} </b> kWh
                        </div>}
                    </div>
                    <div className={`h-2.5 rounded-full transition-colors duration-300 ${loading ? `animate-pulse` : ``} ${percent(Actual, Total) && "bg-gradient-to-r from-[#2EA602] to-[#B4E945]"} `}
                        style={{ width: `${percent(Actual, Total)}%` }}
                    />
                </div>
            </div>
        </>
    )
}

export default CardBudgetActual
