
import '../../Styling/style.css'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import LilysLogo from '../../assets/Lily_s_Rental_Logo_Design-removebg-preview.png'
import iconSample from '../../assets/icon-7797704_1280.png'
import cameraSample from '../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'

import React from 'react';

export default function Chatbox() {
    const [Session, setSession] = useState(null);
    const [ OpenChatBox, setOpenChatBox ] = useState(false) 
    const [ UserTyped ,setUserTyped ] = useState('')
    const [ Situation, setSituation ] = useState('') 
    const [ SystemConversations, setSystemConversations ] = useState(null)
    const ChatEndRef = useRef(null);
    const navigateTo = useNavigate();

    const [ ClockListener, setClockListener ] = useState('')
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const formatted = now.toLocaleTimeString('en-US', { hour12: true });
            setClockListener(formatted)
        }, 1);

        return () => clearInterval(interval);
    },[])

    useEffect(() => {
        const User_Token = localStorage.getItem('User_Session_Token');
        if (User_Token) {
            const decode_token = jwtDecode(User_Token);
            setSession(decode_token)
        } else {
            localStorage.removeItem('User_Session_Token')
            setSession(null)
            navigateTo('/')
        }
    },[ClockListener])
    // useEffect(() => {
    //     const fetch_System_Chat = 
    // },[])

    const UpdateMessage_Status = (status, id) => {
        if (status === 'Delivered' && OpenChatBox) {
            fetch(`/api/Client/Update_Message_Status_Of_Admin/${id}`, {
                method : 'PUT',
            }).then(() => 'Seen')
        }
    }

    const sendChat = async() => {
        if (!UserTyped) {
            console.log('UserTyped is empty.')
            return
        }
        fetch(`/api/Client/User_Send_Message_To_Admin/${Session?.session_user_id}`, {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ send_message: UserTyped })
        }).then(() => setUserTyped(''))
        
    }

    //Component
    const ReturnIncluded_Item = ({ includedItem_id }) => {
        const [ IncludedItem_On_chat, setIncludedItem_On_chat ] = useState(null);

        useEffect(() => {
            const fetchItem = async () => {
                const result = await fetch(`/api/Client/Fetch_Camera_Based_On_Id_Of_The_Included_Item_In_Chat/${includedItem_id}`, {
                    method : 'GET',
                })
                const response = await result.json();
                setIncludedItem_On_chat(response.item)

            }
            fetchItem();
        },[includedItem_id])

        if (!IncludedItem_On_chat) return null;

        return(
            <div className='border'>
                <div className='flex border'>
                    <img src={cameraSample} alt="" className='w-35 object-contain'/>
                    <div className='flex flex-col'>
                        <span>{IncludedItem_On_chat?.name}</span>
                        <span>{IncludedItem_On_chat?.brand}</span>
                        <span>{IncludedItem_On_chat?.model}</span>
                        <span>{IncludedItem_On_chat?.price_per_day}</span>
                    </div>
                </div>
                <div>
                    <span>Your request for a refund, has been approved by the admin. the 50% you paid will be send back to your e-wallet account as soon as possible.</span>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (!Session?.session_user_id) return; 
        if (ClockListener) {
            const Fetch_System_Chat = async() => {
                const result = await fetch(`/api/Client/Fetch_System_Chat/${Session?.session_user_id}`, {
                    method: 'GET',
                })
                const response = await result.json();
                if (!response.success) {
                    setSituation(response.message)
                    return
                }
                setSituation(response.message)
                setSystemConversations(response.AsyncChat);
            }
            Fetch_System_Chat()
        }
    },[Session, ClockListener]) //every seconds fetch the update chat to admin

    const formatTime = (time) => {
        const isoTime = time;
        const iso_To_beFormatted = new Date(isoTime);

        return iso_To_beFormatted.toLocaleTimeString('en-US', {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
        {/* 7:39 PM */}
    }

    useEffect(() => {
        if (ChatEndRef.current) {
            ChatEndRef.current.scrollIntoView({ behavior: "smooth"})
        }
    },[])

    const scrollDown = useRef(null) 
    useEffect(() => {
        if (scrollDown.current) {
            scrollDown.current.scrollIntoView({ behavior: 'smooth'})
        }
    },[OpenChatBox])
    
    //for development
    useEffect(() => {
        if (Session) {
            console.log(Session)
        }
        if (SystemConversations) {
            console.log('SystemConversations: ', SystemConversations)
        }
    },[Session, SystemConversations])

    return(
        <>
            {Session && (
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
                                <img src={LilysLogo} alt="" className='w-14 h-14'/>
                                <div className='flex flex-col '>
                                    <label className='text-2xl'>Lilys Camera Rentals</label>
                                    <div className='relative flex items-center gap-1'>
                                        <div className='w-2 h-2 rounded-full bg-green-500'></div>
                                        <span>We'll reply as soon as we can</span>
                                    </div>
                                </div>
                            </div>
                            <div className='overflow-auto h-100 flex flex-col  scrollbar-hide relative'>
                                <div className='overflow-auto h-120 scrollbar-hide border'> {/* Container conversation */}

                                    <div className='flex h-full items-center justify-center flex-col'>
                                        <img src={LilysLogo} alt="" className='w-50 rounded-full'/>
                                        <span>Starts Conversation with lilys rental admin</span>
                                    </div>

                                    {SystemConversations && (
                                        <>
                                            {SystemConversations?.conversation.map((convo, index)=> (
                                                <React.Fragment key={convo._id}>
                                                    {/* Admin Chats*/}
                                                    {convo?.message_id?.from === 'lilysadministrator' && (
                                                        <div className='flex gap-2 p-2 h-auto relative mt-2'>
                                                            <span className='absolute left-15 -top-3 scale-[0.7]'>{formatTime(convo?.message_id?.createdAt)}</span>
                                                            <div className='w-auto '>
                                                                <img src={LilysLogo} alt="" className='w-13 h-13 rounded-full'/>
                                                            </div>
                                                            <div className='flex flex-col item justify-center border rounded-bl-4xl rounded-br-4xl rounded-tr-4xl p-2 max-w-80 '>
                                                                <span className='wrap-break-word whitespace-pre-wrap'>{convo?.message_id?.message}</span>
                                                                {convo?.message_id?.Included_Item && convo?.message_id?.Included_Item?.[0]?.main_image_url && (
                                                                    <div className='p-2'>
                                                                        <div className='flex border items-center'>
                                                                            <img src={`http://localhost:2020${convo?.message_id?.Included_Item?.[0]?.main_image_url}`} alt="" className='w-35 h-20 object-contain'/>
                                                                            <div className='flex flex-col'>
                                                                                <span>{convo?.message_id?.Included_Item?.[0]?.name}</span>
                                                                                <span>Brand: {convo?.message_id?.Included_Item?.[0]?.brand}</span>
                                                                                <span>Model: {convo?.message_id?.Included_Item?.[0]?.model}</span>
                                                                                <span>Price/day: {convo?.message_id?.Included_Item?.[0]?.price_per_day}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <span></span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className='scale-[0.8]'>{UpdateMessage_Status(convo?.message_id?.messageStatus, convo?.message_id?._id)}</span>
                                                            </div>
                                                        </div>
                                                    )}


                                                    {/* User Chats*/}
                                                    {convo?.message_id?.from === Session?.session_user_id && (
                                                        <>
                                                            <div className='flex items-end p-2 h-auto relative mt-2 flex-col '> 
                                                                <span className='absolute -top-3 scale-[0.7]'>{formatTime(convo.message_id.createdAt)}</span>
                                                                <div className='flex flex-col item justify-center border rounded-br-4xl rounded-bl-3xl rounded-tl-3xl p-2 max-w-80 '>
                                                                    <span className='wrap-break-word whitespace-pre-wrap'>{convo?.message_id.message}</span>
                                                                </div>
                                                                <div className='scale-[0.8]'>{convo?.message_id.messageStatus}</div>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div ref={scrollDown}></div>
                                                </React.Fragment>
                                            ))}
                                        </>
                                    )}
                                </div>
                                {/* Send icon */}
                                <div className=' bg-white border w-full relative h-20 flex p-2 gap-2'>
                                    <input type="text" placeholder='Write your message...' value={UserTyped} name='message' className='w-full h-full p-4 overflow-auto focus:outline-none' onChange={(e) => setUserTyped(e.target.value)}/>
                                    <button className='p-5 cursor-pointer rounded-full border hover:border-blue-500 flex items-center justify-center hover:shadow transition-all duration-300 group'
                                        onClick={() => sendChat()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6  text-blue-500 group-hover:scale-[1.2] transform transition-all duration-300 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
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
            )}
        </>
    );
}