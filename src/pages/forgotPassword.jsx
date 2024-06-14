import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import lotusLogo from '../../src/img/lotusLogo.png';

export default function ForgotPassword() {
    const navigate = useNavigate()
    const handleOnclickBack = () => navigate('/')
    return (
        <>
            <div className='flex flex-col justify-center items-center bg-index-bg  bg-cover w-screen h-screen' >
                <div className='w-[51%] min-w-[440px] max-w-[680px] min-h-[490px] bg-white rounded-3xl pt-10 max-md:text-sm'>
                    {/* <div className='flex justify-between px-10 max-lg:flex-col'>
                        <img className='w-[150px]' src={lotusLogo} alt="logoLotus" />
                        <div className='text-2xl mt-2 text-primary'>Forgot Password</div>
                    </div> */}
                    <div className='flex-col justify-between px-10'>
                        <img className='w-[150px]' src={lotusLogo} alt="logoLotus" />
                        <div className='text-2xl mt-2 text-primary'>Forgot Password</div>
                    </div>
                    <div className='text-secondary p-10 mr-5'>
                        Enter your username or email address and we will send you instructions on
                        how to create a new password
                    </div>
                    <div className='relative w-full px-10 mb-2' >
                        <BsFillPersonFill className='absolute top-[10px] left-12 text-[#999999]' />
                        <input
                            className='w-full border border-[#CFD4D9] rounded-lg pl-10 text-sm py-2'
                            type='text'
                            placeholder='username or email'
                            maxLength={40}
                        />
                    </div>

                    <div className='flex justify-between p-10 max-md:flex-col'>
                        <div className='flex items-center max-md:mb-2'>
                            <AiOutlineDoubleLeft className='text-secondary' />
                            <div className='text-secondary hover:text-dark ml-3 cursor-pointer' onClick={handleOnclickBack}>Back to Login</div>
                        </div>
                        <button className='px-20 py-3 bg-secondary hover:shadow-md rounded-2xl text-white'>Submit</button>

                    </div>
                </div>
            </div>
        </>
    )
}