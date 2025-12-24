
import { useState, useEffect } from 'react';
import '../../Styling/style.css'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

import UserDefault from '../../assets/icon-7797704_1280.png'

import { BiLogOut } from "react-icons/bi";

//Components
import ManageProducts from './ManageProducts';
import ManageCategories from './ManageCategories';
import Admin_Panel_Content from './Admin_Panel_Content';
import ManageUsers from './ManageUsers';
import Chatbox from '../../Components/Admin/Chatbox'

export default function AdminPanel() {
    const navigateTo = useNavigate();

    const [Session, setSession] = useState(null)
    useEffect(() => {
        const Admin_Token_Session = localStorage.getItem('Admin_Session_Token');
        if (Admin_Token_Session) {
            const decoded_token = jwtDecode(Admin_Token_Session);
            setSession(decoded_token)
        } else {
            setSession(null)
            localStorage.removeItem('Admin_Session_Token')
            navigateTo('/')
        }
    },[])

    const userLogout_handle = () => {
        setSession(null)
        localStorage.removeItem('Admin_Session_Token')
        navigateTo('/')
    }

    //=====================> Sidebar

    const [ AdminPanel_sdbr, setAdminPanel_sdbr] = useState(false);
    const [ ManageProducts_sdbr, setManageProducts_sdbr] = useState(false)
    const [ ManageCategories_sdbr, setManageCategories_sdbr] = useState(false);
    const [ ManageUsers_sdbr, setManageUsers_sdbr] = useState(false)
    const [ ManageSettings_sdbr, setManageSettings_sdbr] = useState(false)
    const [ OptionProfile, setOptionProfile_sdbr] = useState(false)

    const [ sections, setSection ] = useState(null)
    const [ isActive, setIsActive] = useState('')
    
    const isAdminPanel =() => {
        setAdminPanel_sdbr(prev => !prev)
        setIsActive('Admin Panel')
        
        // setManageProducts_sdbr(false)
    }
    
    const isManageProducts = async () => { //ManageProducts_sdbr
        setManageProducts_sdbr(prev => !prev)
        setIsActive('Manage Products')

        // setAdminPanel_sdbr(false)
    }

    const isManageCategories = () => {
        setManageCategories_sdbr(prev => !prev);
        setIsActive('Manage Categories')
    }

    const isManageUsers = () => {
        setManageUsers_sdbr(prev => !prev)
        setIsActive('Manage Users')
    }
    

    useEffect(() => {
        switch (isActive) {
            // case 'Admin Panel' :
            //     return setSection(<Admin_Panel_Content />)
            case 'Manage Products':
                return setSection(<ManageProducts />)
            case 'Manage Categories':
                return setSection(<ManageCategories />)
            case 'Manage Users':
                return setSection(<ManageUsers />)
            default : 
                // setAdminPanel_sdbr(prev => prev = true)
                // setIsActive('Admin Panel')
                // setSection(<Admin_Panel_Content />)
                setAdminPanel_sdbr(prev => prev = true)
                setIsActive('Manage Products')
                setSection(<ManageProducts />)
                return
        }

    },[isActive])
    // useEffect(() => {
    //     if (Session) {
    //         console.log(Session)
    //     }
    // }, [Session])
    return(
        <>
            <main className='w-full h-screen flex select-none relative'>
                <aside className='w-[20.5%] p-2'>
                    <aside className='z-999 w-[17%] h-screen fixed top-0 left-0 p-2 flex flex-col bg-gray-50 border-r-gray-500/35 border-r'>
                        <div className='p-5 rounded mb-2'>
                        <span className='text-3xl font-bold '>
                                Welcome Back Admin!
                            </span> 
                        </div>
                        {/* <div className={`${isActive === 'Admin Panel' ? 'bg-gray-300':'bg-transparent'} transition-colors duration-100 rounded hover:bg-gray-300/25`} 
                        onClick={isAdminPanel}>
                            <span className='flex gap-2 p-1 relative items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span className='font-bold'>Admin Panel</span>
                                <svg xmlns="http://www.w3.org/2000/svAdmin Panelg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className={`${AdminPanel_sdbr ? 'rotate-0':'rotate-270'} size-5 absolute right-2`} >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                        <div className={`${AdminPanel_sdbr ? 'h-fit opacity-100':'h-0 opacity-0'} overflow-auto transition-all duration-300 flex flex-col pl-4`}>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Rents</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Categories Added</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Success Rents</span>
                            </span>
                        </div> */}
                        <div className={`${isActive === 'Manage Products' ? 'bg-gray-300':'bg-transparent'} transition-colors duration-100 rounded hover:bg-gray-300/25`} 
                        onClick={isManageProducts}>
                            <span className='flex gap-2 p-1 relative items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                                <span className='font-bold'>Manage Products</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className={`${ManageProducts_sdbr ? 'rotate-0':'rotate-270'} size-5 absolute right-2`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                        <div className={`${ManageProducts_sdbr ? 'h-fit opacity-100':'h-0 opacity-0'} overflow-auto transition-all duration-300 flex flex-col pl-4`}>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Add Cameras</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>New Products</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Stocks Availability</span>
                            </span>
                        </div>
                        <div className={`${isActive === 'Manage Categories' ? 'bg-gray-300':'bg-transparent'} transition-colors duration-300 rounded hover:bg-gray-300/25`} 
                            onClick={isManageCategories}
                        >
                            <span className='flex gap-2 p-1 relative items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>
                                <span className='font-bold'>Manage Categories</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className={`${ManageCategories_sdbr ? 'rotate-0':'rotate-270'} size-5 absolute right-2`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                        <div className={`${ManageCategories_sdbr ? 'h-fit opacity-100':'h-0 opacity-0'} overflow-auto transition-all duration-300 flex flex-col pl-4`}>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Add Categories</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Set Categories</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Remove Categories</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Update Categories</span>
                            </span>
                        </div>
                        <div className={`${isActive === 'Manage Users' ? 'bg-gray-300':'bg-transparent'} transition-colors duration-300 rounded hover:bg-gray-300/25`} 
                            onClick={isManageUsers}
                        >
                            <span className='flex gap-2 p-1 relative items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                <span className='font-bold'>Manage Users</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className={`${ManageUsers_sdbr ? 'rotate-0':'rotate-270'} size-5 absolute right-2`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </span>
                        </div>
                        <div className={`${ManageUsers_sdbr ? 'h-fit opacity-100':'h-0 opacity-0'} overflow-auto transition-all duration-300 flex flex-col pl-4`}>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Request for rents</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Request for refund</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Approved rent refunds</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Ongoing Rents</span>
                            </span>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Success Rents</span>
                            </span>
                        </div>
                        <div className='rounded hover:bg-gray-300/25 mb-5' onClick={() => setManageSettings_sdbr(prev => !prev)}>
                            <span className='flex gap-2 p-1 relative items-center cursor-pointer'>
                                <BiLogOut className='size-6'/>
                                <span className='font-bold'
                                onClick={() => userLogout_handle()}
                                >Logout</span>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className={`${ManageSettings_sdbr ? 'rotate-0':'rotate-270'} size-5 absolute right-2`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg> */}
                            </span>
                        </div>
                        {/* <div className={`${ManageSettings_sdbr ? 'h-fit opacity-100':'h-0 opacity-0'} overflow-hidden transition-all duration-300 flex flex-col pl-4`}>
                            <span className='border-l-2 border-l-gray-400 pl-3 relative flex'>
                                <span className='hover:bg-gray-300/25 w-[80%] rounded pl-1 cursor-pointer'>Site Configuration</span>
                            </span>
                        </div> */}
                        <div className='flex w-full border border-black/20 bg-white relative items-center rounded-[10px] p-1 cursor-pointer hover:bg-gray-300/25' onClick={() => setOptionProfile_sdbr(prev => !prev)}>
                            <img src={UserDefault} alt="" className='w-12 h-12 object-contain rounded-full border border-gray-500/15'/>
                            <div className='flex flex-col p-1 scale-[0.7] -translate-x-8'>
                                <span className='text-2xl'>{Session?.username}</span>
                                <span className=''>{Session?.email}</span>
                            </div>
                            {/* <div className={`${OptionProfile ? 'right-[-230px] h-fit opacity-100 p-2 duration-300 border border-black/30':'right-[-200] opacity-0 h-0 border-none'}  absolute overflow-hidden transition-all w-[90%] bg-white flex flex-col rounded`}>
                                <span className=' p-1 rounded hover:bg-gray-300/25 cursor-pointer '>Profile</span>
                                <span className='p-1 rounded text-red-500 hover:bg-gray-300/25 cursor-pointer' 
                                    onClick={() => userLogout_handle()}
                                >Logout</span>
                                </div> */}
                            
                        </div>
                    </aside>
                </aside>
                {/* <section className=' w-full'>
                    content
                </section> */}
                {sections}
                {/* {ManageProducts_sdbr && isActive === "Manage Products" && <ManageProducts />} */}
                <Chatbox />
            </main>
        </>
    );
}