
import '../../Styling/style.css'
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Pending from './Reservations/Pending';
import Upcomming from './Reservations/Upcomming';
import SuccessRents from './Reservations/SuccessRents';
import Cancelled from './Reservations/Cancelled';
import Refund from './Reservations/Refund'
import Chatbox from '@/Components/Client/Chatbox';

export default function Reservations () {
    const { user_id } = useParams();
    const [ viewOn, setViewOn ] = useState('')
    const [ reservedItems_GUI_Components, setReservedItems_GUI_Components ] = useState(null)
    //============= ViewOn
    useEffect(() => {
        switch(viewOn) {
            case 'Pending': 
                setReservedItems_GUI_Components(<Pending user_id={user_id}/>)
                break;
            case 'Upcomming':
                 setReservedItems_GUI_Components(<Upcomming />)
                break;
            case 'SuccessRents':
                setReservedItems_GUI_Components(<SuccessRents />)
                break;
            case 'Refund' : 
                setReservedItems_GUI_Components(<Refund />)
                break;
            case 'Cancelled':
                setReservedItems_GUI_Components(<Cancelled />)
                break;
            default: 
                setReservedItems_GUI_Components(<Pending />)
                break;
        }
    },[viewOn])

    
    // =======================================================================================
    const navigateTo = useNavigate();
    const [ Session, setSession ] = useState(null);
    useEffect(() => {
        const get_Token = localStorage.getItem('User_Session_Token');
        // if (!get_Token) return console.log(`get_Token: `, get_Token);

        if (get_Token) {
            const decoded_Token = jwtDecode(get_Token);
            setSession(decoded_Token)
        
        } else {
            console.log('You are not authorized to be on this section!');
            localStorage.removeItem('User_Session_Token');
            navigateTo('/')
        }

    },[])
    
    //this useEffect is for development debugging/refactor output purposes for user Session
    useEffect(() => {
        if (Session) {
            console.log('Session: ', Session)
        }
    }, [Session])
    // =======================================================================================

    return(
        <>
            <section className='relative w-full h-screen border flex items-center justify-center select-none'>
                <Link to="/" className='absolute top-5 left-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg> {/* back icon*/}
                </Link>
                <div className='flex w-250 h-175 border rounded'>
                    {/* <div className='flex flex-col gap-2 p-5 border-r border-r-black/20 w-70'>
                        <span className='cursor-pointer hover:text-blue-500'>Reserved Items</span>   
                        <span className='cursor-pointer hover:text-blue-500'>History</span>   
                    </div>   */}
                    <div className='flex flex-col gap-2 w-full '>
                        <div className='flex items-center p-5 h-20 border gap-2'>
                            <span className='text-2xl'>Reserved Items</span>
                        </div>
                        <div>
                            <div className='flex justify-center'>
                                <div className='border-r p-2 cursor-pointer group' onClick={() => setViewOn('Pending')}>
                                    <span className='group-hover:text-blue-500'>Pending</span> 
                                </div>
                                <div className='border-r p-2 cursor-pointer group' onClick={() => setViewOn('Upcomming')}>
                                    <span className='group-hover:text-blue-500'>Upcomming</span>
                                </div>
                                <div className='border-r p-2 cursor-pointer group' onClick={() => setViewOn('SuccessRents')}>
                                    <span className='group-hover:text-blue-500'>Success Rents</span>
                                </div>
                                <div className='border-r p-2 cursor-pointer group' onClick={() => setViewOn('Refund')}>
                                    <span className='group-hover:text-blue-500'>Refund</span>
                                </div>
                                {/* <div className='p-2 cursor-pointer group' onClick={() => setViewOn('Cancelled')}>
                                    <span className='group-hover:text-blue-500'>Cancelled</span>
                                </div> */}
                            </div>
                            <div className='p-5 border max-h-138 overflow-auto flex flex-col gap-2'>
                                {reservedItems_GUI_Components} {/* Pending, Upcomming, Success Rents, Cancelled */}
                            </div>
                        </div>
                    </div>
                </div>
                <Chatbox />
            </section>
        </>
    );
}