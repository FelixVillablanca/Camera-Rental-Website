


import '../../Styling/style.css'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react'
import { jwtDecode } from 'jwt-decode';
import LilysLogo from '../../assets/Lily_s_Rental_Logo_Design-removebg-preview.png'
import iconSample from '../../assets/icon-7797704_1280.png'

export default function Chatbox () {
    const navigateTo = useNavigate();
    const [ Session, setSession ] = useState(null);
    const [ RefreshAPI, setRefreshAPI ] = useState('')
    const [ OpenChatBox, setOpenChatBox ] = useState(false);
    const [ SystemChats, setSystemChats ] = useState(null);
    // const [ CustomerInChat, setCustomerInChat ] = useState(null);
    const [ OpenGUI, setOpenGUI ] = useState(false)
    const [ AdminTyped ,setAdminTyped ] = useState('')
    
    useEffect(() => {
        const get_token = localStorage.getItem('Admin_Session_Token');
        if (get_token) {
            const decode_token = jwtDecode(get_token);
            setSession(decode_token);
        } else {
            localStorage.removeItem('Admin_Session_Token')
            setSession(null)
            navigateTo('/')
        }
    },[])

    const [ Live, setLive ] = useState('')
    useEffect(() => {
        const Real_Time = setInterval(() => {
            const date = new Date();

            const timer = date.toLocaleTimeString("en-US", { hour12 : true })
            setLive(timer)
        }, 1);
        return () => clearInterval(Real_Time)
    },[])


    useEffect(() => {
        if (Live || RefreshAPI) {
            const Fetch_All_Chats = async() => {
                const result = await fetch(`/api/Admin/Fetch_All_Systen_Chats`, {
                    method : 'GET',
                })
                if (!result.ok) {
                    const text = await result.text();
                    console.error('error server', text)
                    return
                }
                const response = await result.json();
    
                if (!response.success) return console.log(response.message)
    
                if (response.SystemChats_With_Renters) {
                    setSystemChats(response.SystemChats_With_Renters)
                    // setCustomerInChat(response.setCustomerInChat)
                }
    
            }
            Fetch_All_Chats()
        }
    },[Live, RefreshAPI])

    const validNum_ofLetters = (message) => {
        const messageOf_User = message;
        const maxLetters = 21;
        if (!message) return
        return messageOf_User.trim().length > maxLetters ? `${messageOf_User.slice(0, maxLetters)} ...` : messageOf_User;
    }

    const formattedTime = (createdAt) => {
        const isoDate = createdAt;
        const timeToFormat = new Date(isoDate);

        return timeToFormat.toLocaleTimeString("en-US", {
            hour : "2-digit",
            minute : "2-digit",
            // second : "2-digit",
            hour12 : true
        })
    }

    const [ admin_ViewingOn, setAdmin_ViewingOn ] = useState('')
    const [ index_Active, setIndex_Active ] = useState(0) // for know the index of the system chat between the user and admin

    const Admin_SeenChat = async(conversation_id, last_convo_id_of_user) => { //conversation_id is the Systema chat data

        if (!OpenGUI) {
            if (!conversation_id) return alert('conversation_id is empty: ', conversation_id)
            if (!last_convo_id_of_user) return alert('last conversation of an id is empty.', last_convo_id_of_user)

            fetch(`/api/Admin/Update_Last_Message_Status/${conversation_id}/${last_convo_id_of_user}`,{
                method : 'PUT'
            })

            setAdmin_ViewingOn(SystemChats.filter(chats => chats._id === conversation_id)) 
            const index = SystemChats.findIndex(chat => chat._id === conversation_id)
            setIndex_Active(index)
            setOpenGUI(true)

        } else {
            setOpenGUI(false)
            setAdmin_ViewingOn(null)
        }
            
    }

    useEffect(() => {
        if (admin_ViewingOn) {

            console.log('viewing on: ', admin_ViewingOn?.user?.profile)
        }
    },[admin_ViewingOn])

    // useEffect(() => {
    //     if (!admin_ViewingOn) return
    //     if (Live) {
    //         Admin_SeenChat()
    //     }
    // },[admin_ViewingOn, Live])

    const sendChat = async() => {
        if (!AdminTyped) return alert('AdminTyped is empty')
            
        const sendMessage_to_user = await fetch(`/api/Admin/Admin_Sends_Message_To_User/${admin_ViewingOn?.[0]._id}/${admin_ViewingOn?.[0].user?._id}`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ admin_message: AdminTyped })
        })

        const response = await sendMessage_to_user.json();

        if (response.success) {
            setRefreshAPI(response.message); // ✅ triggers re-fetch
            setAdminTyped('');
        }

    }

    const UpdateMessage_Status = (status, id, user_id) => {
        if (OpenGUI && OpenChatBox) {
            if (status === 'Delivered' && SystemChats?.[index_Active]?.user._id === user_id) {
                fetch(`/api/Admin/Update_Message_Status_Of_User/${id}`, {
                    method : 'PUT'
                })
            } 
        }
    }

    const scrollDown = useRef(null) 
    useEffect(() => {
        if (scrollDown.current) {
            scrollDown.current.scrollIntoView({ behavior: 'smooth'})
        }
    },[index_Active, RefreshAPI, OpenChatBox])

    // useEffect(() => {
    //     if (admin_ViewingOn) {
    //         console.log('admin_ViewingOn: ', admin_ViewingOn)
    //     }
    // },[admin_ViewingOn])
    

    useEffect(() => {
    //     if (Session) {
    //         console.log('From chatbox admin session: ', Session)
    //     }
        if (SystemChats) {
            console.log('SystemChats: ', SystemChats)
        }
    //     if (index_Active) {
    //         console.log('index_Active', index_Active)
    //     }
    },[Session, SystemChats, index_Active])

    return(
        <>
            <div className='fixed bottom-5 right-5 flex flex-col gap-5 max-h-130 w-100  rounded z-998 select-none'>
                <div className={` ${OpenChatBox ? 'h-full scale-[1] translate-y-0 z-999 translate-x-0':'h-0 scale-[0] translate-y-50 translate-x-42 z-996'} overflow-hidden transform  transition-all duration-300 relative bg-white  rounded`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className="size-6 absolute top-2 right-2 cursor-pointer"
                        onClick={() => setOpenChatBox(prev => !prev)}
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <div className='p-5 border flex gap-2'>
                        {OpenGUI && (
                            <>
                                <div className='flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                        className="size-6 text-blue-500 cursor-pointer"
                                            onClick={() => Admin_SeenChat()}
                                        >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                </div>
                            </>
                        )}
                        <img src={!OpenGUI ? LilysLogo : (SystemChats?.[index_Active]?.user?.profile ? `http://localhost:2020${SystemChats?.[index_Active]?.user?.profile}` : iconSample)} alt="" className={`w-14 h-14 rounded-full object-contain border-blue-500 p-0.5 ${OpenGUI && 'border shadow'}`}/>
                        <div className='flex flex-col justify-center'>
                            <label className={`text-2xl `}>{!OpenGUI ? 'Lilys Camera Rentals' : admin_ViewingOn?.[0].user?.username}</label>
                            {!OpenGUI && (
                                <>
                                    <div className='relative flex items-center gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                        <span>admin@lilysadministrator</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='overflow-auto h-100 flex flex-col  scrollbar-hide relative border'>
                        {/* {!OpenGUI && (
                            <>
                                <div className='relative w-full p-2 '>
                                    <input type="text" placeholder='Search for users...' className='border p-3 w-full rounded-4xl focus:outline-blue-500 '/>
                                </div>
                            </>
                        )} */}
                        {!OpenGUI ? (
                            <>
                        {/* Cards who chatted */}
                                {SystemChats?.length > 0 ? (
                                    <>
                                        {SystemChats.map((customer, index) => {
                                            const lastConvo = customer?.conversation[customer.conversation.length -1];
                                            return(
                                                <div key={customer._id} className='flex border gap-2 p-2'
                                                    onClick={() => Admin_SeenChat(customer._id, lastConvo?.message_id?._id)} //System chat id and last message id
                                                >
                                                    <div className=' w-20'>
                                                        <img src={customer?.user?.profile ? `http://localhost:2020${customer?.user?.profile}` : iconSample} alt="" className='w-15 h-15 object-contain border-blue-500 p-0.5 rounded-full border '/>
                                                    </div>
                                                    <div className='flex flex-col justify-center relative w-full'>
                                                        <span>{customer?.user.username}</span>
                                                        <span className={`${lastConvo?.message_id?.messageStatus === "Delivered" && lastConvo?.model === 'User_Chat' ? 'font-bold':'font-normal'} `}>{lastConvo?.model === 'Admin_Chat' && ('You: ')}{validNum_ofLetters(lastConvo?.message_id?.message)}</span>
                                                        <span className='absolute bottom-0 right-0'>{formattedTime(lastConvo?.message_id?.createdAt)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <>
                                        <div className='flex items-center justify-center h-full border'>
                                            <span>{SystemChats?.message}</span>
                                            <span className='text-blue-500'>Starts conversation to someone.</span>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Container conversation */}
                                <div className='overflow-auto h-120 scrollbar-hide'> 

                                    <div className='flex h-full items-center justify-center flex-col'>
                                        <img src={SystemChats?.[index_Active]?.user?.profile ? `http://localhost:2020${SystemChats?.[index_Active]?.user?.profile}`: iconSample} alt="" className='w-30 h-30 object-contain border border-blue-500 p-0.5 rounded-full'/>
                                        <span className={`${OpenGUI ? 'font-medium text-2xl':''}`}>{SystemChats?.[index_Active]?.user.username}</span>
                                    </div>
                                    {SystemChats?.[index_Active]?.conversation?.length > 0 ? (
                                        <>
                                            {SystemChats?.[index_Active]?.conversation.map((convo, index) => (
                                                <React.Fragment key={convo._id}>
                                                    {/* User Chats*/}
                                                    {convo?.message_id?.from === SystemChats?.[index_Active]?.user?._id && (
                                                        <div className='flex gap-2 p-2 h-auto relative mt-2'>
                                                            <span className='absolute left-15 -top-3 scale-[0.7]'>{formattedTime(convo?.message_id?.createdAt)}</span>
                                                            <div className='w-auto '>
                                                                <img src={SystemChats?.[index_Active]?.user?.profile ? `http://localhost:2020${SystemChats?.[index_Active]?.user?.profile}` : iconSample} alt="" className='w-13 h-13 object-contain rounded-full'/>
                                                            </div>
                                                            <div className='flex flex-col item justify-center border rounded-bl-4xl rounded-br-3xl rounded-tr-4xl p-3 max-w-80 '>
                                                                <span className='wrap-break-word whitespace-pre-wrap'>{convo?.message_id?.message}</span>
                                                                <span className=''>{UpdateMessage_Status(convo?.message_id?.messageStatus, convo?.message_id?._id, convo?.message_id?.from)}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Admin Chats*/}
                                                    {convo?.message_id?.from === 'lilysadministrator' && (
                                                        <>
                                                            <div className='flex items-end p-2 h-auto relative mt-2 flex-col'> 
                                                                <span className='absolute -top-3 scale-[0.7]'>{formattedTime(convo?.message_id.createdAt)}</span>
                                                                <div className='flex flex-col item justify-center border rounded-br-4xl rounded-bl-3xl rounded-tl-3xl p-3 max-w-80 '>
                                                                    <span className='wrap-break-word whitespace-pre-wrap'>{convo?.message_id.message}</span>
                                                                    {convo?.message_id?.Included_Item && convo?.message_id?.Included_Item?.[0]?.main_image_url && (
                                                                        <div className='border rounded'>
                                                                            <div className='flex border items-center'>
                                                                                <img src={`http://localhost:2020${convo?.message_id?.Included_Item?.[0]?.main_image_url}`} alt="" className='w-35 h-20 object-contain'/>
                                                                                <div className='flex flex-col'>
                                                                                    <span>{convo?.message_id?.Included_Item?.[0]?.name}</span>
                                                                                    <span>Brand: {convo?.message_id?.Included_Item?.[0]?.brand}</span>
                                                                                    <span>Model: {convo?.message_id?.Included_Item?.[0]?.model}</span>
                                                                                    <span>Price/day: {convo?.message_id?.Included_Item?.[0]?.price_per_day}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className='scale-[0.8]'>{convo?.message_id.messageStatus}</div>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div ref={scrollDown}></div>
                                                </React.Fragment>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                No conversations has been made yet with this user.
                                            </div>
                                        </>
                                    )}


                                </div>
                                {/* Send icon */}
                                <div className=' bg-white border w-full relative h-20 flex p-2 gap-2'>
                                    <input type="text" placeholder='Write your message...' value={AdminTyped} name='message' className='w-full h-full p-4 overflow-auto focus:outline-none' onChange={(e) => setAdminTyped(e.target.value)}/>
                                    <button className='p-5 cursor-pointer rounded-full border hover:border-blue-500 flex items-center justify-center hover:shadow transition-all duration-300 group'
                                        onClick={() => sendChat()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-500 group-hover:scale-[1.2] transform transition-all duration-300 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                        
                    </div>
                </div>

                {/* Chat icon */}
                <div className='border absolute right-2 bottom-2  w-fit p-4 rounded-full group  hover:bg-linear-to-br hover:from-[#efecec] hover:to-[#cbc8c8] hover:scale-[1.04] transform transition-all duration-300 cursor-pointer shadow z-997 bg-white'
                        onClick={() => setOpenChatBox(prev => !prev)}    
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className="size-8 group-hover:scale-[1.09] transform transition-all duration-300 "
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                </div>
            </div>
        </>
    );
}