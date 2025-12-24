
import { useEffect, useState, React, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../../Styling/style.css'

import Logo from '../../assets/Lily_s_Rental_Logo_Design-removebg-preview.png'
import iconSample from '../../assets/icon-7797704_1280.png'

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";

import defaultProfile from "../../assets/icon-7797704_1280.png"
import { jwtDecode } from "jwt-decode";

export default function Header() {

    const navigateTo = useNavigate();
    const [SuccessMessage, setSuccessMessage] = useState('')
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
    },[SuccessMessage])

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
    // const [SuccessMessage, setSuccessMessage] = useState('')
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

    // ================> Profile
    const [ messageState, setMessageState ] = useState('')
    const [OpenProfile, setOpenProfile] = useState(false)
    const [ Profile_Continue_ChangingPassword, setProfile_Continue_ChangingPassword ] = useState(false)
    const [ ChangeListener_Profile, setChangeListener_Profile ] = useState(false)
    const [ FileProfile, setFileProfile ] = useState(Session?.session_profile ? Session?.session_profile : null) 
    const [ PreviewProfile, setPreviewProfile ] = useState(null)
    const [ Username, setUsername ] = useState(Session?.session_username)
    const [ ProfileSet_Email, setProfile_Email ] = useState(Session?.session_email)
    const [ CurrentPassword, setCurrentPassword ] = useState('')
    const [ NewPasssword_Profile, setNewPassword_Profile ] = useState('')
    const [ ConfirmPassword_Profile, setConfirmPassword_Profile ] = useState('')

    useEffect(() => {
        if (NewPasssword_Profile !== ConfirmPassword_Profile) {
            setMessageState('Password not matched!')
        }
    },[NewPasssword_Profile, ConfirmPassword_Profile])

    const Submit_New_Profile = async() => {
        try {
            // let object
            let body;
            let urlPath;
            const formdata = new FormData();
            if (FileProfile) {

                formdata.append('image_user', FileProfile)
                formdata.append('username', Username)
                formdata.append('email', ProfileSet_Email)
                if (Profile_Continue_ChangingPassword) {
                    if (Session?.session_password === CurrentPassword) {
                        formdata.append('password', NewPasssword_Profile)
                        formdata.append('status', 'withPassword')
                    } else {
                        alert('Current Passowrd does not match!')
                        setMessageState('Current Passowrd does not match!')
                    }
                } else {
                    formdata.append('status', 'withoutPassword')
                }

                body = formdata;
                urlPath = `/api/Client/Update_User_Profile_with_file/${Session?.session_user_id}`;
            } else {
                const object = {
                    Username,
                    Email : ProfileSet_Email,
                    ...(Profile_Continue_ChangingPassword && {New_Added_password : NewPasssword_Profile}),
                    status : Profile_Continue_ChangingPassword ? 'with password':'wihtout password'
                }
                body = JSON.stringify(object);
                urlPath = `/api/Client/Update_user_without_file/${Session?.session_user_id}`;
            }

            // const urlPath = PreviewProfile ? `/api/Client/Update_User_Profile_with_file/${Session?.session_user_id}` 
            //     : `/api/Client/Update_user_without_file/${Session?.session_user_id}`
            const send_new_update = await fetch(urlPath, {
                method : 'PUT',
                headers : FileProfile ? undefined : { 'Content-Type' : 'application/json' },
                body,
                // body : PreviewProfile ? formdata : JSON.stringify(object),
            })
            const response = await send_new_update.json();
            if (!response.success) return alert(response.message)
                if (response.new_token) {
                    localStorage.setItem('User_Session_Token', response.new_token)
                }
            setSuccessMessage(response.message)
            setTimeout(() => {
                setSuccessMessage('')
            }, 3000);
        } catch (error) {
            alert(error.message)
        }

    }

    useEffect(() => {
        if (FileProfile) {
            const urlPrev = URL.createObjectURL(FileProfile)

            setPreviewProfile(urlPrev)
            console.log('FileProfile: ', FileProfile)
            return () => URL.revokeObjectURL(urlPrev)
        }
    },[FileProfile])

    useEffect(() => {
        if (FileProfile || Username || ProfileSet_Email || CurrentPassword || NewPasssword_Profile || ConfirmPassword_Profile) {
            setChangeListener_Profile(true)
        }
    },[FileProfile, Username, ProfileSet_Email, CurrentPassword, NewPasssword_Profile, ConfirmPassword_Profile])

    useEffect(() => {
        if (Session) {
            console.log('Session: ', Session)
        }
        if (Username) {
            console.log('Username', Username)
        }
        if (SuccessMessage) {
            console.log('SuccessMessage', SuccessMessage)
        }
    },[Session, Username, SuccessMessage])

    return(
        <>
            {/* </div> */}
            <div className='fixed flex top-6 right-8 z-50'>
                <div className='flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-lg hover:shadow-xl transition-shadow duration-300'>
                    <img src={Session?.session_profile ? `http://localhost:2020${Session?.session_profile}` : defaultProfile} alt="" className='w-10 h-10 object-contain rounded-full border-2 border-blue-400'/>
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
            <header className={`fixed h-30 w-full flex items-center justify-center px-6 py-4 shadow-sm z-15 ${OpenProfile && 'backdrop-blur-none pointer-events-auto'} backdrop-blur-md transition-all duration-300 shadow-none`}  id=''> {/* Home */}
                <img src={Logo} alt="" className={`absolute left-5 w-30 h-auto object-contain ${OpenProfile ? 'drop-shadow-lg filter brightness-0 invert':'brightness-100'} transform transition-all duration-300 `}/>
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
                            <a href={item.id} className="cursor-pointer" onClick={() => setOpenProfile(false)}>
                                {item.label}
                            </a>
                            {activeSection === item.id && (
                                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                            )}
                        </li>
                    ))}
                    </ul> 
                </div>
            </header>
            <div className='flex sticky top-24 z-40'>
                {optionDrop && (
                    <div className={`min-w-[200px] ${optionDrop ? 'h-fit py-2' : 'h-0 py-0'} text-[16px] flex flex-col transition-all duration-200 overflow-hidden absolute right-8 shadow-xl bg-white rounded-xl border border-gray-100 z-50`}
                    > {/* && hideOption */}
                        {Session ? (
                            <>
                                <span to={"/Profile"} className='cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors rounded-t-xl'
                                    onClick={() => setOpenProfile(prev => !prev)}
                                >Profile
                                </span>
                                {/* <span className='cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors'>Shopping Bag</span>
                                <span className='cursor-pointer w-full px-4 py-2.5 hover:bg-blue-50 transition-colors'>Shopping Cart</span> */}
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
            
            {/* Sign Up*/}
            <section className={`${SignUp_Show ? 'flex' : 'hidden'} bg-black/40 h-screen w-full items-center justify-center backdrop-blur-sm fixed top-0 z-50 animate-fadeIn`}>
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

            {/* Sign In*/}
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
            </section>

            <section className={`${OpenProfile ? 'w-full h-screen  translate-y-0 opacity-100' : ' w-full h-0 -translate-y-5 opacity-0 pointer-events-none'}transition-all duration-200 fixed bg-black/50 z-14 flex items-center justify-center backdrop-blur-md `}>


                <div className={` ${OpenProfile ? 'opacity-100':'opacity-0 pointer-events-none'}  transition-all duration-1000 w-250 h-170 rounded bg-white flex justify-center items-center z-1001`}>
                    <div className=" h-150 flex justify-center translate-y-10 w-full relative">
                        <div className={` ${SuccessMessage === 'Profile update.' ? 'rotate-x-0 translate-y-0 opacity-100':'rotate-x-40 -translate-y-2 opacity-0'} overflow-hidden transition-all duration-300 absolute w-fit p-2 rounded flex gap-2 items-center bg-green-500 text-white`}>
                            <IoIosCheckmarkCircle className=""/>
                            <span>{SuccessMessage}</span>
                        </div>
                            <div className="flex flex-col items-center w-full">
                                    <div className=" flex flex-col items-center gap-2">
                                        <img src={ !PreviewProfile ? `http://localhost:2020${Session?.session_profile}` : PreviewProfile} alt="" className="w-50 h-50 rounded-full object-contain shadow border border-black/20"/>
                                        <input type="file" className="file-input border" onChange={(e) => setFileProfile(e.target.files[0])}/>
                                    </div>
                                    <div className="flex w-auto justify-center p-5 overflow-auto relative ">
                                        <div className="flex flex-col w-100 items-center gap-2 p-5">
                                            <label className="flex flex-col w-full">
                                                Username
                                                <input type="text" className="border rounded p-2" value={Username} defaultValue={Session?.session_username} onChange={(e) => setUsername(e.target.value)}/>
                                            </label>
                                            <label className="flex flex-col w-full">
                                                Email <input type="text"  value={ProfileSet_Email} defaultValue={Session?.session_email}  className="border rounded p-2" onChange={(e) => setProfile_Email(e.target.value)}/>
                                            </label>
                                            <span className={` ${Profile_Continue_ChangingPassword ? 'opacity-0':'opacity-100'} hover:text-blue-500 cursor-pointer transition-all duration-100`} onClick={() => setProfile_Continue_ChangingPassword(prev => !prev)}>Change Password?</span>
                                        </div>
                                        
                                        <FaRegCircleXmark className={` ${Profile_Continue_ChangingPassword ? 'opacity-100':'opacity-0'} absolute right-7 top-7 hover:text-red-500 cursor-pointer text-red-500/50 transition-all duration-100`} onClick={() => setProfile_Continue_ChangingPassword(prev => !prev)}/>
                                        <div className={`flex flex-col ${Profile_Continue_ChangingPassword ? 'w-100 p-5 opacity-100':'w-0 p-0 opacity-0'} transition-all duration-300 overflow-hidden  gap-2 `}>
                                            <label className="flex flex-col">
                                                <span>Current Password</span>
                                                <input type="text" className="border rounded p-2" value={CurrentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                                            </label>
                                            <label className="flex flex-col">
                                                <span>New password</span>
                                                <input type="text" className="border rounded p-2" value={NewPasssword_Profile} onChange={(e) => setNewPassword_Profile(e.target.value)}/>
                                            </label>
                                            <label className="flex flex-col">
                                                Confirm new password: <input type="text" className="border rounded p-2" value={ConfirmPassword_Profile} onChange={(e) => setConfirmPassword_Profile(e.target.value)}/>
                                            </label>
                                        </div>
                                    </div>
                                    <input type="button"  value="Confirm" className={`border p-3 rounded-full absolute ${ChangeListener_Profile ? 'bottom-5 right-5 opacity-100':'bottom-0 right-5 opacity-0'} bg-blue-500 text-white hover:scale-[1.02] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer `}
                                        onClick={Submit_New_Profile}
                                    />
                            </div>
                    </div>
                </div>
            </section>
        </>
    );
}