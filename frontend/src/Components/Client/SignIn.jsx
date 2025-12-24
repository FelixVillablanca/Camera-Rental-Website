
import { useState, useEffect } from "react";



export default function SignIn({ setSignIn_Show }) {

    const [Password, setPassword] = useState('')
    const handle_Login = (event) => {
        event.preventDefault();


    }
    console.log('Password: ', Password)
    return(
        <>
                        <section className='bg-black/35 h-screen w-full flex items-center justify-center backdrop-blur-md fixed top-0 z-30'>
                            <div className='w-[32%] h-[10%]flex flex-col items-center relative rounded bg-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                    className="size-8 absolute top-2 right-2 text-red-500 hover:text-red-600 cursor-pointer"
                                    onClick={() => setSignIn_Show(prev => prev = false)}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <div className='flex justify-center pt-10'>
                                    <label className='text-4xl font-bold '>Login</label>
                                </div>
                                <form className='w-full p-5 flex flex-col items-center gap-5'onSubmit={handle_Login} >
                                    <label htmlFor="username" className='flex flex-col gap-1 w-95 text-[20px] relative'>
                                        <span className=''>Username</span>
                                        <input type="text" name='username' className={`border rounded p-2 focus:outline-none `}/>
                                    </label>
                                    <label htmlFor="Password" className='flex flex-col gap-1 w-95 text-[20px] '>
                                        Password
                                        <input 
                                            type="password" 
                                            name='Password'
                                            onChange={(e) => setPassword(e.target.value)} 
                                            className='border p-2 focus:outline-none rounded'
                                        />
                                    </label>
                                    <span className="">
                                        forgot password?
                                    </span>
                                    <input type="submit" value="Login" className='rounded border w-95 h-10 bg-red-500 text-white text-[23px]'/>
                                    <p>Don't have an Account yet? <a href="" className='text-blue-500' onClick={() => {setSignIn_Show(prev => !prev); setSignIn_Show(prev => prev = true)}}>Sign Up</a></p>
                                </form>
                            </div>
                        </section>         
        </>
    );
}