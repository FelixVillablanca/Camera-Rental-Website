import '../../Styling/style.css'
import Logo from '../../assets/Lily_s_Rental_Logo_Design-removebg-preview.png'
import hero from "../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png"
import hero2 from "../../assets/ChatGPT Image Nov 19, 2025, 12_49_12 AM.png"
import cameraSample from "../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png"


import defaultProfile from "../../assets/icon-7797704_1280.png"
import { useState, useEffect, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom';

import Hero from '../../Components/Client/Hero'
import Location from '../../Components/Client/Location'
import Contents from '../../Components/Client/Contents'
import SignUp from '../../Components/Client/SignUp'
import SignIn from '../../Components/Client/SignIn'
import Chatbox from '../../Components/Client/Chatbox'
import { jwtDecode } from 'jwt-decode';
import Header from './Header'

export default function Home() {
    const navigateTo = useNavigate();
    const [activeSection, setActiveSection] = useState('#Home');
    useEffect(() => {
    const sections = ['#Home', '#Items', '#About', '#location', '#FAQs'];
    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
            }
        });
        },
        { threshold: 0.6 } // Adjust sensitivity
    );

    sections.forEach((id) => {
        const el = document.querySelector(id);
        if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    }, []);

    const arrowRef = useRef(null)
    const [optionDrop, setOptionDrop] = useState(false)
    const [hideOption, setHideOption] = useState(false)

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries.some(entry => entry.isIntersecting)
                setHideOption(isVisible);
            }, {
                threshold : 0.1,
            }
        )

        if (arrowRef.current) observer.observe(arrowRef.current);


        return () => {
            if (arrowRef.current) observer.unobserve(arrowRef.current)
        };

    },[])

    const [SignUp_Show, setSignUp_Show] = useState(false);
    const [SignIn_Show, setSignIn_Show] = useState(false);
    // useEffect(() => {
    //     console.log('SignIn_Show: ', SignIn_Show)
    // }, [SignIn_Show])

    // ========================> LOGIN/SignUp
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notMatched_Prompt, setNotMatched_Prompt] = useState(false);

    const handleSubmit_SignUp = async (event) => {
        event.preventDefault();

        if (!password.includes(confirmPassword)) return setNotMatched_Prompt(prev => !prev);

        const object = {
            'username' : event.target.username.value,
            'password' : password,
            'email' : event.target.email.value
        }

        const result = await fetch('/api/Client/Register', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(object)
        })
        
        const response = await result.json();

        if (!response) return console.log('error title: ', response.title, 'message: ', response.message, 'stackTrace: ', response.stackTrace)

        if (response) {
            console.log('user created: ', response.user)
            event.target.username.value = '';
            event.target.Password.value = '';
            event.target.email.value = '';
            event.target.confirmPassword.value = '';
            alert(response.message)
        }
    }
    // ========================> LOGIN/SignIn
    const [PasswordLogin, setPasswordLogin] = useState('')
    const handle_Login = async(event) => {
        event.preventDefault();
        
        const object = {
            'username' : event.target.username.value,
            'Password' : event.target.Password.value,
        }
        const result = await fetch('/api/Client/Login_Client', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(object)
        })
        const response = await result.json();
        if (!response) return console.log(response.message)
        // console.log('response : ', response)
        if (response.role === 2) {
            localStorage.setItem('User_Session_Token', response.Token_Session)
            navigateTo('/')
            window.location.reload();
        }
        if (response.role === 1) {
            localStorage.setItem('Admin_Session_Token', response.Token_Session)
            navigateTo('/AdminPanel')
        }
    }
    // ========================> USER SESSION
    const [Session, setSession] = useState(null)
    useEffect(() => {
            const token = localStorage.getItem('User_Session_Token'); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX3V... token
            if (token) {
                try {
                    const decoded_token = jwtDecode(token); 
                    setSession(decoded_token); // session i.e.. username, email, profile <-fields in Users collection
                } catch (error) {
                    console.error('Invalid token', error);
                    localStorage.removeItem('User_Session_Token');
                    setSession(null)
                    navigateTo('/')
                }
            }
    },[])

    const func_Logout = () => {
        localStorage.removeItem('User_Session_Token');
        setSession(null);
    }

    //===================================> Forgot Password 
    const [ForgotPassword_Show, setForgotPassword_Show] = useState(false);
    const [Code, setCode] = useState(false)
    const [Continue_ChangePassword,setContinue_ChangePassword] = useState(false)

    //for countdown for 5mins before generating new code
    const [cooldownActive, setCooldownActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300);
    useEffect(() => {
        let timer
        if (cooldownActive && timeLeft) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setCooldownActive(false)
        }
        return () => clearInterval(timer);
    },[cooldownActive, timeLeft])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const sec = seconds % 60;
        return `${minutes}:${sec.toString().padStart(2, '0')}`;
    }

    const handleForgotPassword = async(event) => {
        event.preventDefault();

        const email = event.target.email.value;
        try {
            const response = await fetch('/api/Client/forgot-password', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({ email }),
            })

            const result = await response.json();
            if (!result.success) return console.log(result.message)
            
            if (result.success) {
                setCode(true)
                setCooldownActive(true)
                setTimeLeft(300)
            } 

        } catch (error) {
            console.error('Error: ', err)
            alert('Something went wrong. Please try again')
        }

    }

    const [Email, setEmail] = useState('')
    const [ErrorMessage, setErrorMessage] = useState('')
    const verifyCode_User = async(event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const code = event.target.code.value;

        const result = await fetch(`/api/Client/Reset_Password_Client/${email}/${code}`, {
            method : 'GET',
        })
        const response = await result.json();
        if(!response.success) {
            console.log(response.message)
            setErrorMessage(response.message)
            setTimeout(() => {
                setErrorMessage('')
            }, 3000);
            return 
        }
        if (response.success) {
            setEmail(response.email)
            setContinue_ChangePassword(true)
        }


    }

    const [Show, setShow] = useState(false)
    const [SuccessMessage, setSuccessMessage] = useState('')
    const func_handleResetPassword = async(event) => {
        event.preventDefault();

        const Password = event.target.Password.value
        const ConfirmNewPassword = event.target.ConfirmNewPassword.value;

        if (!Password.trim().includes(ConfirmNewPassword)) {
            setErrorMessage('Confirm Password not matched!')
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            // console.log('Confirm Password not matched!')
            return
        }
        
        const result = await fetch(`/api/Client/Continue_Reset_Password/${Password}/${Email}`, {
            method : 'POST'
        })
        
        const response = await result.json();
        
        if (!response.success) return console.log(response.message)
        if (response.success) {
            setCode(false)
            setForgotPassword_Show(false)
            setContinue_ChangePassword(false)
            setSuccessMessage(response.message)
            setTimeout(() => {
                setSuccessMessage('')
            }, 3000);
            // alert(response.message)
        }

    }

    const [ DoneRents, setDoneRents ] = useState(null)
    const [ OpenRate, setOpenRate ] = useState(false)
    useEffect(() => {
        if (!Session) return
        const Get_DoneRents = async() => {
            const Fetch_Done_Rents = await fetch(`/api/Client/Fetch_Done_Rents_Of_User/${Session.session_user_id}`, {
                method : 'GET'
            })

            const response = await Fetch_Done_Rents.json()
            if (!response.success) return console.log(response.message)
            setDoneRents(response.rentsToRate)
            setOpenRate(true)
        }
        Get_DoneRents()
    },[Session, SuccessMessage])

    const [ RateListener, setRateListener ] = useState('1.5') 
    const [ User_Experience_Message, setUser_Experience_Message ] = useState('')

    const Create_Reviews_User_Experience = async(reservation_id, user_id, camera_id) => {

        const create_user_review = await fetch(`/api/Client/Create_Review/${reservation_id}/${user_id}/${camera_id}`, {
            method : 'POST',
            headers : {  'Content-Type' : 'application/json' },
            body : JSON.stringify({ Rate: RateListener, ...(User_Experience_Message ? {User_experience_Message: User_Experience_Message} : null)})
        })
        const response = await create_user_review.json();
        if (!response.success) return console.log(response.message)
        setSuccessMessage(response.message)
        setOpenRate(prev => !prev)
    }
 
    // useEffect(() => {
    //     if (RateListener) {
    //         console.log('Rate Listener: ', RateListener)
    //     }
    //     if (User_Experience_Message) {
    //         console.log('Rate User_Experience_Message: ', User_Experience_Message)
    //     }
    // },[RateListener, User_Experience_Message])

    //Checker useState 
    useEffect(() => {
        if (Session) {
            console.log('Session: ', Session)
        }
        if (DoneRents) {
            console.log('DoneRents: ', DoneRents)
        }
    }, [Session, DoneRents])

    return(
        <>
            {/* <div className='flex fixed top-32 z-20 w-full justify-center pointer-events-none'> */}
            <main className='bg-linear-to-br from-[#faf7f7] via-[#e8f4f8] to-[#a4c5cc] select-none min-h-screen ' >
                <Header />
                {/* <div className='fixed flex top-6 right-8 z-50'>
                    <div className='flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300'>
                        <img src={defaultProfile} alt="" className='w-10 h-10 rounded-full border-2 border-blue-400'/>
                        {!optionDrop ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" 
                                ref={arrowRef} className="size-5 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setOptionDrop(prev => !prev)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" 
                                ref={arrowRef} className="size-5 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setOptionDrop(prev => !prev)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                        )}
                    </div>
                </div>
                <header className='relative h-30 w-full flex z-10 items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm'  id='Home'>
                    <div className=''>
                        <img src={Logo} alt="" className='w-30 h-auto object-contain drop-shadow-lg'/>
                    </div>
                </header>
                <div className='flex sticky top-24 z-40'>
                    {optionDrop && (
                        <div className={`min-w-[200px] ${optionDrop ? 'h-fit py-2' : 'h-0 py-0'} text-[16px] flex flex-col transition-all duration-200 overflow-hidden absolute right-8 shadow-xl bg-white rounded-xl border border-gray-100 z-50`} > 
                            {Session ? (
                                <>
                                    <span className='cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors rounded-t-xl'>Profile</span>
                                    <Link to={`/Reservations/${Session.session_user_id}`} className='cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors'
                                    >
                                        Reservations
                                    </Link>
                                    <span className='text-red-600 cursor-pointer w-full px-4 py-2.5 hover:bg-red-50 transition-colors rounded-b-xl font-medium' onClick={func_Logout}>Logout</span>
                                </>
                            ) : (
                                <>
                                    <span className='text-[16px] cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors rounded-t-xl z-50' onClick={() => setSignUp_Show(prev => !prev)}>
                                        Sign Up
                                    </span>
                                    <span className='text-[16px] cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors rounded-b-xl z-50' onClick={() => setSignIn_Show(prev => !prev)}>
                                        Login
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className='sticky top-6 z-20 flex justify-center pointer-events-auto  pt-1'>
                    <ul className=' flex gap-6 justify-center list-none font-medium text-[18px] px-8 py-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-gray-100'> 
                    {[
                        { id: '#Home', label: 'Home' },
                        { id: '#Items', label: 'Items' },
                        { id: '#About', label: 'About Us' },
                        { id: '#location', label: 'Location' },
                        { id: '#FAQs', label: 'FAQs' }
                    ].map((item) => (
                        <li key={item.id}
                            className={`${
                                activeSection === item.id ? 'text-blue-600 font-semibold' : 'text-gray-700'
                            } hover:text-blue-600 transition-all duration-200 cursor-pointer relative`}
                        >
                            <a href={item.id} className="cursor-pointer">
                                {item.label}
                            </a>
                            {activeSection === item.id && (
                                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                            )}
                        </li>
                    ))}
                    </ul> 
                </div> */}
                <div className='w-full h-15 'id='Home'>
                    
                </div>
                <div className='flex justify-center w-full relative hero mt-8 ' >
                    <Hero />
                </div>
                    <Contents />
                <section id="location" className="py-12 px-6 md:px-16 lg:px-24">
                    <Location />
                </section>

                            {/* <section className={`${SignUp_Show ? 'flex' : 'hidden'} bg-black/40 h-screen w-full items-center justify-center backdrop-blur-sm fixed top-0 z-50 animate-fadeIn`}>
                            <div className='w-[90%] max-w-[480px] flex flex-col items-center relative rounded-2xl bg-white shadow-2xl p-8 animate-slideUp'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                    className="size-8 absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                                    onClick={() => setSignUp_Show(prev => !prev)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <div className='flex justify-center pt-4 pb-6'>
                                    <label className='text-4xl font-bold text-gray-800'>Sign Up</label>
                                </div>
                                <form className='w-full flex flex-col items-center gap-4'onSubmit={handleSubmit_SignUp} >
                                    <label htmlFor="username" className='flex flex-col gap-2 w-full text-[17px] relative'>
                                        <span className='font-medium text-gray-700'>Username</span>
                                        <input type="text" name='username' className='border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors'/>
                                    </label>
                                    <label htmlFor="email" className='flex flex-col gap-2 w-full text-[17px]'>
                                        <span className='font-medium text-gray-700'>Email</span>
                                        <input type="email" name='email' className='border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors' placeholder='Enter a valid email'/>
                                    </label>
                                    <label htmlFor="Password" className='flex flex-col gap-2 w-full text-[17px]'>
                                        <span className='font-medium text-gray-700'>Password</span>
                                        <input 
                                            type="password" 
                                            name='Password'
                                            onChange={(e) => setPassword(e.target.value)} 
                                            className='border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors'
                                        />
                                    </label>
                                    <label htmlFor="confirmPassword" className='flex flex-col gap-2 w-full text-[17px]'>
                                        <span className='font-medium text-gray-700'>Confirm Password</span>
                                        <input 
                                            type="password" 
                                            name='confirmPassword'
                                            onChange={(e) => setConfirmPassword(e.target.value)} 
                                            className={` 
                                                ${confirmPassword.trim().length > 0 && password.trim().length > 0 && !password.includes(confirmPassword) 
                                                ? 'border-red-500 border-2':'border-2 border-gray-200'
                                            } rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors`}/>
                                    </label>
                                    <input type="submit" value="Create Account" className='rounded-lg w-full h-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-[17px] font-semibold transition-colors shadow-md mt-2'/>
                                    <p className='text-gray-600 mt-2'>Already have an account? <a href="#" className='text-blue-600 hover:text-blue-700 font-medium' onClick={() => {setSignUp_Show(prev => !prev); setSignIn_Show(prev => !prev)}}>Sign In</a></p>
                                </form>
                            </div>
                        </section>

                        <section className={`${SignIn_Show ? 'flex' : 'hidden'} bg-black/40 h-screen w-full items-center justify-center backdrop-blur-sm fixed top-0 z-50 animate-fadeIn`}>
                            
                            {!ForgotPassword_Show ? (
                                <div className='w-[90%] max-w-[480px] flex flex-col items-center relative rounded-2xl bg-white shadow-2xl p-8 animate-slideUp'>
                                    <div className={`${SuccessMessage.trim().length > 0 ? 'rotate-x-0 opacity-100':'rotate-x-40 opacity-0'} transition-all duration-300 border flex gap-1 w-[90%] p-1 rounded-[5px] bg-green-500 z-10 text-white`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span>{SuccessMessage}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                        className="size-8 absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                                        onClick={() => setSignIn_Show(prev => prev = false)}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <div className='flex justify-center pt-4 pb-6'>
                                        <label className='text-4xl font-bold text-gray-800'>Login</label>
                                    </div>
                                    <form className='w-full flex flex-col items-center gap-4'onSubmit={handle_Login} >
                                        <label htmlFor="username" className='flex flex-col gap-2 w-full text-[17px] relative'>
                                            <span className='font-medium text-gray-700'>Username</span>
                                            <input type="text" name='username' className='border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors' required/>
                                        </label>
                                        <label htmlFor="Password" className='flex flex-col gap-2 w-full text-[17px]'>
                                            <span className='font-medium text-gray-700'>Password</span>
                                            <input 
                                                type="password" 
                                                name='Password'
                                                onChange={(e) => setPasswordLogin(e.target.value)} 
                                                className='border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors'
                                                required
                                            />
                                        </label>
                                        <span className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-[15px] self-end" onClick={() => setForgotPassword_Show(true)}>
                                            Forgot your password?
                                        </span>
                                        <input type="submit" value="Login" className='rounded-lg w-full h-12 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-[17px] font-semibold transition-colors shadow-md mt-2'/>
                                        <p className='text-gray-600 mt-2'>Don't have an Account yet? <a href="#" className='text-blue-600 hover:text-blue-700 font-medium' onClick={() => {setSignIn_Show(prev => !prev); setSignUp_Show(prev => !prev)}}>Sign Up</a></p>
                                    </form>
                                </div>
                            ) : (
                                <>
                                {!Continue_ChangePassword ? (
                                    <>
                                        <div className='w-[90%] max-w-[480px] flex flex-col items-center relative rounded-2xl bg-white shadow-2xl p-8 animate-slideUp'>
                                            <div className={`${ErrorMessage.trim().length > 0 ? 'rotate-x-0 opacity-100':'rotate-x-40 opacity-0'} transition-all duration-300 border flex gap-1 w-[90%] p-1 rounded-[5px] bg-red-600 z-10 text-white`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                                </svg>
                                                <span>{ErrorMessage}</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                                className="size-8 absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                                                onClick={() => setForgotPassword_Show(prev => prev = false)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <div className='flex justify-center pb-6'>
                                                <label className='text-3xl font-bold text-gray-800'>Reset Password</label>
                                            </div>
                                            <form className='flex flex-col gap-4 w-full' onSubmit={!Code ? handleForgotPassword : verifyCode_User}>
                                                <label className='text-[17px] flex flex-col gap-2'>
                                                    <span className='font-medium text-gray-700'>Email</span>
                                                    <input type="email" name="email" className='border-2 border-gray-200 rounded-lg w-full p-3 focus:outline-none focus:border-blue-500 transition-colors' placeholder='Enter your email'/>
                                                </label>
                                                {Code && (
                                                    <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                                                        <p className='text-gray-700 mb-2'>We sent a 6-digit code to your email address.</p>
                                                        <p className='text-gray-600 text-sm mb-3'>Enter that code to reset your password.</p>
                                                        <label className='flex items-center gap-3'>
                                                            <input type="text" name='code' placeholder='Enter Code' className='border-2 border-gray-200 rounded-lg flex-1 p-3 focus:outline-none focus:border-blue-500 transition-colors'/>
                                                            {cooldownActive && <span className='text-blue-600 font-mono font-medium'>{formatTime(timeLeft)}</span>}
                                                        </label>
                                                    </div>
                                                )}
                                                <input type="submit" value={`${!Code ? 'Send Reset Code' : 'Continue'}`} className='rounded-lg w-full h-12 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-[17px] font-semibold transition-colors shadow-md mt-2'/>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className='w-[90%] max-w-[480px] flex flex-col items-center relative rounded-2xl bg-white shadow-2xl p-8 animate-slideUp'>
                                        <div className={`${ErrorMessage.trim().length > 0 ? 'rotate-x-0 opacity-100':'rotate-x-40 opacity-0'} transition-all duration-300 border flex gap-1 w-[90%] p-1 rounded-[5px] bg-red-600 z-10 text-white`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                            <span>{ErrorMessage}</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                            className="size-8 absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                                            onClick={() => setForgotPassword_Show(prev => prev = false)}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <form className='flex flex-col w-full relative gap-3' onSubmit={func_handleResetPassword}>
                                            <label className='text-3xl'>Set your new Password</label>
                                            <label className='text-[20px] flex flex-col'>
                                                <span>New Password</span> 
                                                <input type={`${Show ? 'text':'password'}`} name="Password" className='border p-2 rounded-lg focus:outline-blue-500' required/>
                                            </label>
                                            <label className='text-[20px] flex flex-col'>
                                                <span className=' flex relative items-center'>
                                                    Confirm New Password
                                                    {!Show ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 absolute right-1 cursor-pointer" onClick={() => setShow(prev => prev = true)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 absolute right-1 cursor-pointer" onClick={() => setShow(prev => prev = false)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    )}
                                                </span> 
                                                <input type={`${Show ? 'text':'password'}`} name="ConfirmNewPassword" className='border p-2 rounded-lg focus:outline-blue-500' required/>
                                            </label>
                                            <input type="submit" value="Continue" className='text-white text-[18px] py-2.5 rounded-[10px] cursor-pointer bg-blue-600'/>
                                        </form>
                                    </div>
                                )}
                                </>
                            )}
                        </section> */}
                        <Chatbox />
                        {DoneRents?.Review_Status === 'Not_yet_rated' && OpenRate === true && (
                            <div className='w-full h-full fixed flex justify-center items-center top-0 left-0 bg-black/20 z-1000'>
                                <div className='bg-white w-100 flex items-center flex-col p-5 gap-2 rounded'>
                                    <div className='border rounded flex gap-2 w-full'>
                                        <img src={cameraSample} alt=""  className='w-50'/>
                                        <div className='flex flex-col'>
                                            <span>{DoneRents?.Camera_id?.[0].name}</span>
                                            <span className='text-sm text-gray-600'>{DoneRents?.Camera_id?.[0].brand}</span>
                                            <span className='text-sm text-gray-600'>{DoneRents?.Camera_id?.[0].model}</span>
                                            <span className='text-sm text-gray-600'>Origin price: {DoneRents?.Camera_id?.[0].price_per_day}</span>
                                            <span className='text-sm text-gray-600'>Rental spent: {DoneRents?.transaction?.amount * 2}</span>

                                        </div>
                                    </div>
                                    <span>Rate Your Rental Experience</span>
                                    <div>
                                        <div className="rating rating-lg rating-half">
                                            <input type="radio" name="rating-11" className="rating-hidden" />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-green-500" 
                                                aria-label="0.5 star" value="0.5" onChange={(e) => setRateListener(e.target.value)}
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-green-500" 
                                                aria-label="1 star" value="1" onChange={(e) => setRateListener(e.target.value)}
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-green-500" 
                                                aria-label="1.5 star" defaultChecked value="1.5" onChange={(e) => setRateListener(e.target.value)}
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-green-500" 
                                                aria-label="2 star" value="2" onChange={(e) => setRateListener(e.target.value)}
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-green-500" 
                                                aria-label="2.5 star" value="2.5" onChange={(e) => setRateListener(e.target.value)} 
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-green-500" 
                                                aria-label="3 star" value="3" onChange={(e) => setRateListener(e.target.value)} 
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-green-500"
                                                aria-label="3.5 star" value="3.5" onChange={(e) => setRateListener(e.target.value)} 
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-green-500" 
                                                aria-label="4 star" value="4" onChange={(e) => setRateListener(e.target.value)} 
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-green-500" 
                                                aria-label="4.5 star" value="4.5" onChange={(e) => setRateListener(e.target.value)} 
                                            />
                                            <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-green-500" 
                                                aria-label="5 star" value="5" onChange={(e) => setRateListener(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className=' flex flex-col w-full'>
                                        <span>How was your experience?</span>
                                        <textarea name="" id="" className='border p-2 rounded max-h-20 focus:outline-none' placeholder='Share your experience...' value={User_Experience_Message} onChange={(e) => setUser_Experience_Message(e.target.value)}></textarea>
                                    </div>
                                    <div className="flex gap-3 w-full mt-4">
                                        <button className="flex-1 bg-green-500/50 border border-green-500 text-green-800 p-2 rounded hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer"
                                            onClick={() => Create_Reviews_User_Experience(DoneRents?._id, Session?.session_user_id, DoneRents?.Camera_id?.[0]._id)}
                                        >
                                            Submit
                                        </button>
                                        <button className="flex-1 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 cursor-pointer transition-all duration-300 hover:text-white">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
            </main>
        </>
    );
}