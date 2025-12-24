
import '../../../Styling/style.css'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react'

//Files/images on assets
import cameraSample from '../../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'
import { jwtDecode } from 'jwt-decode';


export default function Pending ({ user_id }) {
    // console.log('Pending, user_id ', user_id)
    const navigateTo = useNavigate();
    const [ Session, setSession ] = useState(null);
    const [ SuccessMessage_FromAPI, setSuccessMessage_FromAPI ] = useState('')
    const [ ErrorMessage_FromAPI, setErrorMessage_FromAPI ] = useState('') 
    const [ reservationsOfUser, setReservationsOfUser ] = useState(null)
    const [ Transactions, setTransactions ] = useState(null)
    const [ Prompt_Before_Proceeding, setPrompt_Before_Proceeding ] = useState('')
    const [ Item_To_Be_Refund, setItem_To_Be_Refund ] = useState('')//id


    useEffect(() => {
        const Get_Token = localStorage.getItem('User_Session_Token');
        if (Get_Token) {
            const decoded_Token = jwtDecode(Get_Token)
            setSession(decoded_Token)
        } else {
            setSession(null)
            localStorage.removeItem('User_Session_Token');
            navigateTo('/')
        }
    },[])
    // console.log('Session pending: ', Session?.session_user_id)
    
    useEffect(() => {
        const Get_Reserved_Items_Of_User = async() => {
            const result = await fetch(`/api/Client/Get_Reserved_Items_Of_User/${Session?.session_user_id}`, {
                method : 'GET'
            })
            const response = await result.json();

            if (!response.success) return console.log(response.message);
            setReservationsOfUser(response.reservations)
            setTransactions(response.transactions)
        }
        Get_Reserved_Items_Of_User();
    },[Session, SuccessMessage_FromAPI])

    const auto_formatDate = (date) => {
        const isoDate = date; //2025-12-05T00:00:00.000Z
        const dateObj = new Date(isoDate)

        return dateObj.toLocaleDateString("en-US", {
            month : "2-digit",
            day : "2-digit",
            year : "2-digit",
        }) // 12/05/25
    }

    const RequestRefund = async(id) => {

        setPrompt_Before_Proceeding('show_Secondary_Prompt_Before_Commiting_Of_An_Action')
        setItem_To_Be_Refund(id)
    }

    useEffect(() => {
        if (Prompt_Before_Proceeding == 'User_Clicked_Continue') {
            const fetchRefund = async () => {
                const requesting_refund = await fetch(`/api/Client/Requesting_Refund/${Item_To_Be_Refund}`, {
                    method : 'GET'
                })
                const response = await requesting_refund.json();
                if (!response.message) {
                    alert(response.message)
                    setErrorMessage_FromAPI(response.message)
                    return 
                }
    
                setSuccessMessage_FromAPI(response.message)
            }
            fetchRefund();
        }
    },[Prompt_Before_Proceeding, Item_To_Be_Refund])

    useEffect(() => {
        if (Session) {
            console.log('Sessiona: ', Session)
        }
        if (reservationsOfUser) {
            console.log('Reservations: ', reservationsOfUser)
        }
        if (Transactions) {
            console.log('Transaction: ', Transactions)
        }
    },[reservationsOfUser, Transactions])

    return(
        <>
            <div className={`absolute top-0 ${Prompt_Before_Proceeding == 'show_Secondary_Prompt_Before_Commiting_Of_An_Action' ? 'w-full h-full':'w-0 h-0'} backdrop-blur-sm overflow-hidden left-0 flex items-center justify-center bg-black/50 z-999`}>
                <div className={` ${ Prompt_Before_Proceeding == 'show_Secondary_Prompt_Before_Commiting_Of_An_Action' ? 'translate-y-0':'-translate-y-5'} transition-all duration-300 bg-white border p-5 rounded`}>
                    <span className='flex justify-center'>Cancel rent and request for refund?</span>
                    <div className='flex gap-2 items-center justify-center mt-5'>
                        <button className='border p-2 rounded bg-gray-300/20 border-black/20 cursor-pointer hover:scale-[1.04] transition-all duration-300' 
                            onClick={() => setPrompt_Before_Proceeding('User_Clicked_Continue')}>Continue</button>
                        <button className='border p-2 rounded border-black/50 cursor-pointer hover:scale-[1.04] transition-all duration-300' 
                            onClick={() => setPrompt_Before_Proceeding('')}
                        >Cancel</button>
                    </div>
                </div>
            </div>
            <div className='mb-4 flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <span>You can cancel and request for refund anytime when the item is still on Pending</span>
            </div>
            {reservationsOfUser?.length > 0 ? (
                <>
                    {reservationsOfUser.map((reservation, indexFirst)=> (
                        <React.Fragment key={reservation._id}>
                            {reservation.Camera_id.map((camera, index) => (
                                <React.Fragment key={camera._id}>
                                    <div className='flex border w-full p-2 relative shadow rounded gap-2 '>
                                            <img src={`http://localhost:2020${camera.main_image_url}`} alt="" className='w-30 h-30 object-contain'/>
                                        <div className='flex gap-10'>
                                            <div className='flex flex-col'>
                                                <span className='text-2xl'>{camera.name}</span>
                                                <span>{camera.brand}</span>
                                                <span>{camera.model}</span>
                                                <span>Price Per Day: {camera.price_per_day}</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span><span className='font-bold'>Quantity:</span> {reservation.Quantity}</span>
                                                <span> <span className='font-bold'>Rental Period</span> {auto_formatDate(reservation.StartDate)} - {auto_formatDate(reservation.EndDate)}</span>
                                                <span><span className='font-bold'>Total</span> {Transactions?.[indexFirst].amount}</span>
                                            </div>
                                            {reservation.reserved_status === 'Pending' ? (
                                                <>
                                                    <button 
                                                        type="button"
                                                        onClick={() => RequestRefund(reservation._id)} 
                                                        className='border border-red-500 bg-red-500/20 w-20 absolute right-2 bottom-2 text-red-600 cursor-pointer rounded hover:scale-[1.04] transition-all duration-300'>
                                                        Cancel
                                                    </button>
                                                
                                                </>

                                            ) : (
                                                <>
                                                    <button 
                                                        type="button"
                                                        onClick={() => RequestRefund(reservation._id)} 
                                                        className='group border border-gray-500 bg-gray-500/20 w-45 absolute right-2 overflow-x-hidden bottom-2 text-gray-600 cursor-pointer rounded hover:scale-[1.04] transition-all duration-300'
                                                    > 
                                                        {reservation.reserved_status}
                                                    </button>
                                                </>
                                            )}
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                            className="size-6 absolute bottom-0 right-0 top-3 ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg> Transaction receipt */}
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}

                        </React.Fragment>
                    ))}
                </>
            ) : (
                <>
                    <div>
                        No Reservations
                    </div>
                </>
            )}
        </>
    );

}
