import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdPassword } from 'react-icons/md';
import { FiEyeOff, FiEye } from 'react-icons/fi';
import lotusLogo from '../../src/img/lotusLogo.png';
import { useSignIn } from 'react-auth-kit';
import Swal from 'sweetalert2';
import AuthService from '../service/authen';

export default function Login() {
    const navigate = useNavigate();
    const signIn = useSignIn();
    const handleForgotPasswordOnClick = () => navigate('/forgotPassword');
    const handleRegisterOnClick = () => navigate('/');

    document.body.style.overflowY = "auto"

    const [showPassword, setShowPassword] = useState(false);
    const [login, setLogin] = useState({ username: "", password: "" });
    const [user, setUser] = useState()
    const [isSignIn, setIsSignIn] = useState(false)

    const handleTogglePassword = () => setShowPassword(!showPassword);
    const handleOnChange = event => {
        setLogin({ ...login, [event.target.name]: event.target.value });
    };
    const handleSignInOnClick = async () => {
        setIsSignIn(true)
        const pathUrl = '';
        try {
            const result = await AuthService.signIn(login)
            setUser(result.data);

            if (result.data.accessToken) {
                setIsSignIn(false)
                localStorage.setItem('refresh_token', result.data.refreshToken)
                signIn({
                    token: result.data.accessToken,
                    expiresIn: 20,
                    tokenType: 'Bearer',
                    authState: [{
                        'email': result.data.email,
                        'firstName': result.data.firstName,
                        'lastName': result.data.lastName,
                        'availableStore': result.data.availableStore,
                        id: result.data.userId,
                        menus: result.data.menus,
                        groups: result.data.groups,
                    }]
                });
                const name = `${result.data.firstName} ${result.data.lastName}`
                await Swal.fire({
                    title: 'เข้าสู่ระบบสำเร็จ',
                    // text: `ยินดีต้อนรับ`,
                    icon: 'success',
                    confirmButtonColor: '#809DED',
                    confirmButtonText: 'OK',
                    timer: 2000
                })
                if (localStorage.getItem("_auth_state")) {
                    navigate('/energyMonitoring');
                }

            }
        } catch (err) {
            Swal.fire({
                title: 'โปรดเข้าระบบใหม่',
                text: err.status && 'Username หรือ Password ไม่ถูกต้อง',
                icon: 'warning',
                confirmButtonColor: '#809DED',
                confirmButtonText: 'OK',
                iconColor: '#FFBC29',
            });
            setIsSignIn(false)
        }
    }

    return (
        <>
            <div className='flex justify-center items-center bg-index-bg bg-cover w-screen h-screen' >
                <div className='w-[51%] max-w-[680px] min-w-[340px] h-[490px] bg-white flex flex-col justify-start items-center px-8 rounded-[20px] shadow-basic overflow-auto'>
                    <div className='w-[150px] mt-10'>
                        <img className='object-contain' src={lotusLogo} alt="Lotus's" />
                    </div>

                    <div className='text-primary text-2xl text-center mt-2 text-medium'>Sign in</div>

                    <div className='relative w-full mt-9'>
                        <BsFillPersonFill className='absolute top-[12px] left-3 text-[#999999]' />
                        <input
                            className='w-full border border-[#CFD4D9] rounded-lg pl-10 text-sm py-2'
                            type='text'
                            placeholder='username'
                            maxLength={40}
                            name='username'
                            value={login.username}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className='relative w-full mt-9'>
                        <MdPassword className='absolute top-[12px] left-3 text-[#999999]' />
                        <input
                            className='w-full border border-[#CFD4D9] rounded-lg pl-10 text-sm py-2'
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            placeholder='password'
                            maxLength={40}
                            value={login.password}
                            onChange={handleOnChange}
                        />
                        {showPassword ? (
                            <FiEyeOff
                                className='absolute top-1/2 transform -translate-y-1/2 right-3 text-[#999999] cursor-pointer'
                                onClick={handleTogglePassword}
                            />
                        ) : (
                            <FiEye
                                className='absolute top-1/2 transform -translate-y-1/2 right-3 text-[#999999] cursor-pointer'
                                onClick={handleTogglePassword}
                            />
                        )}
                    </div>

                    <div className='text-[#0696FE] text-sm self-end mt-4 mb-9 cursor-pointer text-medium' onClick={handleForgotPasswordOnClick}>Forgot Password ?</div>

                    <button disabled={isSignIn}
                        className='bg-[#809DED] rounded-[10px] text-white py-2.5 px-[40%] max-[900px]:px-[33%] max-[600px]:px-[20%] transition-all duration-1000 text-medium disabled:bg-gray-400'
                        onClick={handleSignInOnClick}>Sign in</button>

                    <div className='text-[#828282] text-sm py-10 text-medium'>New user? <span className='text-[#0696FE] cursor-pointer' onClick={handleRegisterOnClick}>Register</span></div>
                </div>
            </div>
        </>
    )
}