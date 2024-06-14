import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from 'react-icons/ai'

function DropdownSearch({ value, setValue, list, onEnter, line, disabled, setIsSearching, isSearching, name, showIcon }) {
    const [showList, setShowList] = useState(false)
    const [input, setInput] = useState(value)
    const [lists, setLists] = useState(list)
    const [select, setSelect] = useState(0)

    useEffect(() => {
        setInput(value)
        if (value) {
            setShowList(true)
            const filterList = list?.filter(ele => ele.toString().toLowerCase().includes(value.toLowerCase()))
            setLists(filterList)
        } else {
            setLists(list)
        }
    }, [value])

    useEffect(() => {
        setLists(list)
    }, [list])

    useEffect(() => {
        if (!isSearching) setShowList(false)
    }, [isSearching])

    return (
        <>
            <div id={name}
                className="relative self-end"
                onClick={(e) => {
                    if (!showList) setSelect(0)
                    setShowList(!showList)
                    if (setIsSearching) setIsSearching(true)
                }}
            >
                {showIcon &&
                    <div className="absolute right-2 top-1.5 cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15.4L6 9.4L7.4 8L12 12.6L16.6 8L18 9.4L12 15.4Z" fill="#828282" />
                        </svg>
                    </div>}
                <input id="dropdownSearch"
                    className=" border text-sm border-gray-300 rounded-lg h-[2.5em] self-end py-1.5 px-2 w-full outline-0 disabled:bg-gray-200 disabled:opacity-70"
                    onClick={() => { if (showIcon) setShowList(true) }}
                    value={input}
                    onChange={e => { setValue(e.target.value); setSelect(0); if (setIsSearching) setIsSearching(true) }}
                    onKeyUp={e => {
                        if (e.key == 'Enter') {
                            if (select > 0) {
                                setValue(lists[select - 1])
                                setSelect(0)
                                return
                            }
                            onEnter()
                        }
                    }}
                    disabled={disabled}
                    onKeyDown={e => {
                        if (e.key == "ArrowDown") {
                            setSelect(select + 1)
                        } else if (e.key == "ArrowUp") {
                            setSelect(select - 1)
                        }
                    }}
                />

                <div className={`fixed top-0 right-0 bottom-0 left-0 z-10 ${showList ? "" : "hidden"}`}
                    onClick={() => setShowList(true)}
                />
                {showList && !!lists?.length && input && (
                    <div className={`z-20 w-full text-dark bg-white rounded-md shadow-md absolute top-[3em] max-[680px]:w-[250px] overflow-y-none overflow-y-auto  max-h-[20em] border cursor-pointer scrollbar`}>
                        {
                            lists.sort((a, b) => a.localeCompare(b)).map((ele, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`px-2 py-1 cursor-pointer hover:bg-light ${line && `line-clamp-${line}`} ${select - 1 == index && "bg-light"}`}
                                        onClick={() => setValue(ele)}
                                        value={ele}
                                    >
                                        {ele}
                                    </div>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        </>
    )
}

export default DropdownSearch
