
function Pagination({ page, perPage, setPerPage, setPage, total }) {
    const lastPage = Math.ceil(total / perPage) || 1

    return (
        // <div className="text-sm mx-3  max-md:w-fit max-md:ml-auto lg:flex justify-between">
        <div className="text-sm max-md:w-fit max-md:ml-auto lg:flex justify-end">
            {/* w-[calc(100%_-_13rem)] ml-auto */}
            {/* <div className="w-[12em]" /> */}
            <div className="flex items-center justify-end mr-3.5 mb-1 gap-1.5">
                <div className="flex items-center gap-1.5 " id="hideText">
                    จำนวนแถว ต่อ หน้า
                    <select
                        value={perPage}
                        onChange={e => setPerPage(e.target.value)}
                        className="p-1.5 px-2 mr-1 border rounded-lg cursor-pointer outline-0"
                    >
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                        <option value='30'>30</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                    </select>
                    {(page * perPage - (perPage - 1))?.toLocaleString([])}-{(page == lastPage ? total : perPage*page)?.toLocaleString([])} จาก
                </div>
                {total?.toLocaleString([])} รายการ
            </div>

            <div id="export"
                // className="max-md:my-1 mx-3 flex gap-1 items-center md:justify-center justify-end max-md:w-full justify-between"
                className="max-md:my-1 mr-2.5 flex gap-1 items-center  justify-end max-md:w-full max-xs:justify-center"
            >
                <button className={`p-2.5 px-3 rounded-full ${!(page == 1) ? "hover:bg-light" : "opacity-70 cursor-default"}`}
                    onClick={() => page != 1 && setPage(1)}>
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 0.33606L3.836 8.00006L11.5 15.6641V0.33606ZM0.75 1.00006V15.0001H2.75V1.00006H0.75ZM9.5 5.16406V10.8361L6.664 8.00006L9.5 5.16406Z" fill="#809DED" />
                    </svg>
                </button>

                <div className={`group ${!(page > 1) ? 'cursor-default' : 'cursor-pointer'} flex items-center`}
                    onClick={() => page > 1 && setPage(page - 1)}
                >
                    <button className={`p-2.5 px-3 rounded-full ${(page > 1) ? "group-hover:bg-light" : "opacity-70 cursor-default"}`}>
                        <svg width="14" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0.33606L0.336 8.00006L8 15.6641V0.33606ZM6 5.16406V10.8361L3.164 8.00006L6 5.16406Z" fill="#809DED" />
                        </svg>
                    </button>
                    <span className=" mx-1 max-xs:hidden">ก่อนหน้า</span>
                </div>
                <select
                    value={page}
                    onChange={e => setPage(e.target.value)}
                    className="p-1.5 px-2 mx-1.5 border rounded-lg cursor-pointer outline-0"
                >
                    {[...Array(lastPage).keys()].map((ele, i) => (
                        <option value={+ele + 1}>{ele + 1}</option>
                    ))}
                </select>
                of

                <span className="px-1 mr-2">
                    {lastPage}
                </span>
                <div className={`group ${(page < lastPage) ? 'cursor-pointer' : 'cursor-default'} flex items-center`}
                    onClick={() => page < lastPage && setPage(+page + 1)}
                >
                    <span className=" mx-1 max-xs:hidden">ถัดไป</span>

                    <button className={`p-2.5 rounded-full ${(page < lastPage) ? 'group-hover:bg-light' : "opacity-70 cursor-default"}`}>
                        <svg width="14" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0.33606L7.66 8.00006L0 15.6641V0.33606ZM1.99896 5.16406V10.8361L4.83348 8.00006L1.99896 5.16406Z" fill="#809DED" />
                        </svg>
                    </button>
                </div>

                <button className={`p-2.5 px-3 rounded-full ${!(page == lastPage) ? "hover:bg-light" : "opacity-70 cursor-default"}`}
                    onClick={() => page != lastPage && setPage(lastPage)}>
                    <svg width="14" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.75 0.33606L8.414 8.00006L0.75 15.6641V0.33606ZM11.5 1.00006V15.0001H9.5V1.00006H11.5ZM2.75 5.16406V10.8361L5.586 8.00006L2.75 5.16406Z" fill="#809DED" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Pagination