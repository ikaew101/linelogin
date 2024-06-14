import React, { useEffect, useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';
import { GoTriangleDown } from 'react-icons/go';
import lotusLogo from '../img/lotusLogo.png';
import AuthService from '../service/authen';
import Cookies from 'universal-cookie';
import useAuthData from '../context/useAuthData';

export default function Header() {

    const _auth_state = localStorage.getItem('_auth_state');
    const [isManagePage, setIsManagePage] = useState(false)
    const path = window.location.pathname
    useEffect(() => {
        if (_auth_state) {
            const dataAuth = JSON.parse(_auth_state)[0]
            const username = `${dataAuth.firstName} ${dataAuth.lastName}`
            setUsername(username.trim().length ? username : dataAuth.email)
        }
        if (path.startsWith('/manage')) setIsManagePage(true)

    }, [])

    const [username, setUsername] = useState('');

    const [isVisible, setIsVisible] = useState(true);

    const [sidebarVisible, setSidebarVisible] = useState(true);

    const cookies = new Cookies();
    const handleLogout = async () => {
        try {

            const dataAuth = JSON.parse(_auth_state)[0]
            const res = await AuthService.signOut(dataAuth.id)

            var Cookies = document.cookie.split(';');
            Cookies?.map((ele) => {
                if (!ele.split('=')[0]) return
                cookies.remove(ele.split('=')[0])
            })

            localStorage.removeItem('refresh_token')
            window.location.href = res
            // window.location.href = 'logout' // do function onRouter line28
            // navigate('/logout');
        } catch (error) {
            console.log(error)
        }
    };
    const { userData } = useAuthData()
    const classMenu = 'w-full py-4 flex items-center border-b border-gray-200 pl-5 hover:bg-light/[.5]'
    return (
        <>
            <div className={`fixed top-0 right-0 bottom-0 left-0 z-40 ${!sidebarVisible ? "bg-black/[.1]" : "hidden"}`}
                onClick={() => setSidebarVisible(true)}
            />
            <div id="sidebar" className={`w-72 h-full fixed bg-white ease-in-out duration-300 shadow-md z-50 overflow-auto ${sidebarVisible ? '-ml-72' : ''} `}>
                <div className={`absolute right-0 top-[54px] hover:shadow-md flex justify-center item-center rounded-tl-lg rounded-bl-lg border border-r-0 cursor-pointer`} onClick={() => setSidebarVisible(!sidebarVisible)}>
                    <div className='py-6 border-secondary justify-center self-item-center'>
                        <FiChevronLeft className='text-[#565E6D] mx-1' />
                    </div>
                </div>
                <div className='flex flex-col justify-start items-center'>
                    <img src={lotusLogo} alt='Lotus logo' className='w-20 h-auto mt-8' />
                    <div className='mt-5 py-3 text-dark'>Welcome</div>
                    <div className='font-bold text-dark pb-5 whitespace-break-spaces mx-2 text-center'>User: {username}</div>
                    <div className='border-b border-gray-200 py-5 mb- w-full justify-center grid grid-cols-2 px-2 gap-2'>
                        <button
                            className={`text-sm rounded-3xl py-2 font-medium mr-0.5 transition-colors duration-300 ${!isManagePage ? 'bg-primary text-white' : 'text-secondary hover:bg-light/[.8] hover:text-dark'} `}
                            onClick={() => setIsManagePage(false)}
                        >
                            การแสดงผล
                        </button>

                        <button
                            className={`text-sm rounded-3xl py-2 font-medium ml-0.5 transition-colors duration-300 ${isManagePage ? 'bg-primary text-white' : 'text-secondary hover:text-dark hover:bg-light/[.8]'} cursor-default`}
                            // onClick={() => setIsManagePage(true)}
                        >
                            ตั้งค่าการใช้งาน
                        </button>
                    </div>
                    {!isManagePage ?
                        <div className={`w-full text-dark font-semibold
                        ${userData?.menus?.find(ele => ele.menuName.includes('monitor')) && 'opacity-50 pointer-events-none'}`}>
                            <a href='/energyMonitoring' className={`${classMenu} ${path == '/energyMonitoring' && 'bg-light'}`}>
                                ระบบติดตามพลังงาน
                            </a>
                            <a href='/refrigeration' className={`${classMenu} ${path == '/refrigeration' && 'bg-light'}`}>
                                ระบบตู้แช่และห้องเย็น
                            </a>
                            <a href='/airCondition' className={`${classMenu} ${path == '/airCondition' && 'bg-light'}`}>
                                ระบบปรับอากาศ
                            </a>
                            <a href='/lighting' className={`${classMenu} ${path == '/lighting' && 'bg-light'}`}>
                                ระบบแสงสว่าง
                            </a>
                        </div>
                        :
                        <div className={`w-full text-dark font-semibold
                        ${userData?.menus?.find(ele => ele.menuName.includes('monitor')) && 'opacity-50 pointer-events-none'}`}>
                            {/* <a href='/manage_user' className={`${classMenu} ${path == '/manage_user' && 'bg-light'}`}>
                                การจัดการผู้ใช้งาน
                            </a>
                            <a href='/manage_store' className={`${classMenu} ${path == '/manage_store' && 'bg-light'}`}>
                                การจัดการ Store
                            </a>
                            <a href='/manage_device' className={`${classMenu} ${path == '/manage_device' && 'bg-light'}`}>
                                การจัดการ Device
                            </a>
                            {/* <a href='/refrig_config' className={`${classMenu} ${path == '/refrig_config' && 'bg-light'}`}>
                                Refrigeration Config
                            </a>
                            <a href='/lighting_config' className={`${classMenu} ${path == '/lighting_config' && 'bg-light'}`}>
                                Lighting Config
                            </a>
                            <a href='/chiller_config' className={`${classMenu} ${path == '/chiller_config' && 'bg-light'}`}>
                                Chiller Config
                            </a>
                            <a href='/air_config' className={`${classMenu} ${path == '/air_config' && 'bg-light'}`}>
                                Air Config
                            </a> */}
                        </div>
                    }
                </div>
            </div>

            <div className='h-20 w-full bg-white bg-no-repeat bg-padding-box shadow-md flex justify-between items-center'>
                <div className={`p-4 cursor-pointer z-30`} onClick={() => setSidebarVisible(!sidebarVisible)}>
                    <svg width="35" height="35" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.33334 37.5C7.74306 37.5 7.24792 37.3 6.84792 36.9C6.44792 36.5 6.24862 36.0056 6.25001 35.4167C6.25001 34.8264 6.45001 34.3313 6.85001 33.9313C7.25001 33.5313 7.74445 33.332 8.33334 33.3333H41.6667C42.257 33.3333 42.7521 33.5333 43.1521 33.9333C43.5521 34.3333 43.7514 34.8278 43.75 35.4167C43.75 36.007 43.55 36.5021 43.15 36.9021C42.75 37.3021 42.2556 37.5014 41.6667 37.5H8.33334ZM8.33334 27.0833C7.74306 27.0833 7.24792 26.8833 6.84792 26.4833C6.44792 26.0833 6.24862 25.5889 6.25001 25C6.25001 24.4097 6.45001 23.9146 6.85001 23.5146C7.25001 23.1146 7.74445 22.9153 8.33334 22.9167H41.6667C42.257 22.9167 42.7521 23.1167 43.1521 23.5167C43.5521 23.9167 43.7514 24.4111 43.75 25C43.75 25.5903 43.55 26.0854 43.15 26.4854C42.75 26.8854 42.2556 27.0847 41.6667 27.0833H8.33334ZM8.33334 16.6667C7.74306 16.6667 7.24792 16.4667 6.84792 16.0667C6.44792 15.6667 6.24862 15.1722 6.25001 14.5833C6.25001 13.9931 6.45001 13.4979 6.85001 13.0979C7.25001 12.6979 7.74445 12.4986 8.33334 12.5H41.6667C42.257 12.5 42.7521 12.7 43.1521 13.1C43.5521 13.5 43.7514 13.9945 43.75 14.5833C43.75 15.1736 43.55 15.6688 43.15 16.0688C42.75 16.4688 42.2556 16.6681 41.6667 16.6667H8.33334Z" fill="#BDBDBD" />
                    </svg>
                </div>

                <div className='absolute justify-center items-center w-full z-0'>
                    <img src={lotusLogo} alt='logo' className='w-28 h-auto cursor -pointer mx-auto block'
                    />
                </div>

                <div className='relative'>
                    <div className='max-md:max-w-[10em] h-20 max-xs:mt-[55px] max-xs:max-w-[80vw] flex justify-end items-center cursor-pointer text-secondary md:min-w-[180px] group h-fit py-3 rounded mr-1' onClick={() => setIsVisible(!isVisible)}>
                        <BsFillPersonFill className='flex' size={16} />
                        <div className='text-sm ml-1.5 truncate group-hover:text-dark'>
                            <span className='max-xs:hidden'>ผู้ใช้งาน: </span>{username}
                        </div>
                        <GoTriangleDown className='ml-2' />
                    </div>

                    <div className={`absolute min-w-[150px] flex items-center bg-white shadow-md rounded-lg sm:mt-[1.25em] mr-1 fixed right-0 cursor-pointer ${isVisible ? 'hidden' : ''} z-30 hover:font-bold hover:text-dark`}
                        onClick={() => { handleLogout(); setIsVisible(!isVisible); }}>
                        <img loading='lazy' src='img/logout.png' alt='logout' className='w-3.5 h-3.5 ml-3.5' />
                        <div className='text-sm ml-2 py-3'>
                            Log out
                        </div>
                    </div>

                    <div className={`fixed top-0 right-0 bottom-0 left-0 z-20 ${!isVisible ? "" : "hidden"}`}
                        onClick={() => setIsVisible(true)}
                    />
                </div>
            </div>

        </>
    )
}