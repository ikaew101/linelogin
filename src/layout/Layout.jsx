import React, { useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom';
import AppContext from '../context/appContext';
import Spinner from '../components/spinner';

export default function LayoutAuthenticated() {
    document.body.style.overflowY = "scroll"

    const [statusSave, setStatusSave] = useState()

    return (<>
        <div className={`fixed top-0 right-0 bottom-0 left-0 z-50 ${statusSave ? "bg-light/[.95]" : "hidden"} transition-colors duration-500`}>
            <div className='w-full h-full flex items-center justify-center'>
                <Spinner size="lg" />
            </div>
        </div>
        <div className="md:flex "
            id="All"
        >
            <div className="flex-grow flex flex-col">
                <AppContext.Provider value={{ statusSave, setStatusSave }}>

                    <Header />
                    <Outlet />

                </AppContext.Provider>
            </div>
        </div>
    </>)
}


