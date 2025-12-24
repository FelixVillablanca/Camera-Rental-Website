import '../../../Styling/style.css'
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react'
import cameraSample from '../../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'

import { jwtDecode } from 'jwt-decode';

//react icons
import { FaPersonWalking } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";


export default function SuccessRents () {
    const [ Reservations, setReservations ] = useState(null)    
    const [ Session, setSession ] = useState(null)
    const navigateTo = useNavigate();

    useEffect(() => {
        const Get_Token = localStorage.getItem('User_Session_Token')
        if (Get_Token) {
            const decoded_Token = jwtDecode(Get_Token);
            setSession(decoded_Token)
        } else {
            setSession(null)
            localStorage.removeItem('User_Session_Token')
            navigateTo('/')
        }
    },[])


    useEffect(() => {
        if (!Session) return
        const Func_Reserved_Items = async() => {
            const result = await fetch(`/api/Client/Get_Reservation_Of_The_User/${Session.session_user_id}`, {
                method: "GET",
            })

            const response = await result.json();

            if (!response.success) return console.log(response.message);
            setReservations(response.reservationOfUser)
        }
        Func_Reserved_Items();
    },[Session])

    const formatDate = (date) => {
        if (!date) return
        const isoDate = date;
        const FormatDate = new Date(isoDate);

        return FormatDate.toLocaleDateString('en-US', {
            month : "2-digit",
            day : "2-digit",
            year: "2-digit"
        })
    }

    useEffect(() => {
        if (Session) {
            console.log('Session here: ', Session)
        }
        if (Reservations) {
            console.log('Reservations here: ', Reservations)
        }
    },[Session, Reservations])


    return(
        <>
            <div className='flex gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <span>For delivery, your rented item will arrive and start the rent at the exact starting date you've given</span>
            </div>
            <div className='flex flex-col gap-1'>
                {Reservations?.length > 0 ? (
                    <>
                        {Reservations.map((reserved, index) => (
                            <>
                            
                                {reserved?.reserved_status === 'Done Renting' && (
                                    <>
                                        <div className='flex gap-1 items-center relative border rounded'>
                                            <div className=''>
                                                <img src={cameraSample} alt="" className='w-50 object-contain'/>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='text-2xl'>{reserved?.Camera_id?.[0].name}</span>
                                                <span>{reserved?.Camera_id?.[0].brand}</span>
                                                <span>{reserved?.Camera_id?.[0].model}</span>
                                                <span>price per day: {reserved?.Camera_id?.[0].price_per_day}</span>
                                            </div>
                                            <div className='flex flex-col ml-2'>
                                                <span>Quantity: {reserved?.Quantity}</span>
                                                <span>Rental Period: {formatDate(reserved?.StartDate)} - {formatDate(reserved?.EndDate)}</span>
                                                <span>Total: {reserved?.transaction?.amount * 2}</span>
                                            </div>
                                            <div className='absolute rounded-full p-2 border right-2 bottom-2 border-green-500 bg-green-500/20 text-green-500 flex gap-1 items-center'>
                                                <span>Done Renting</span>
                                                <IoIosCheckmarkCircle className='text-green-500'/>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ))}
                    </>
                ) : (
                    <>
                        <div>
                            User dont have any reserved items.
                        </div>
                    </>
                )}
            </div>  
        </>
    );
}