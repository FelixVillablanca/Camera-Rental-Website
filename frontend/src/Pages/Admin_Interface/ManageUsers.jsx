
import '../../Styling/style.css'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import iconSample from '../../assets/icon-7797704_1280.png'
import cameraSample from '../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'
import LilysLogo from '../../assets/Lily_s_Rental_Logo_Design-removebg-preview.png'
import { User } from 'lucide-react'

export default function ManageUsers() {
    const [ Session, setSession ] = useState(null)
    const [ successMessage, setSuccessMessage ] = useState('')

    const [ Reservations, setReservations ] = useState(null) //reservations
    const [ UserOnReservations, setUserOnReservations ] = useState(null) //inline Customer_id on reservations
    const [ CamerasOnReservations, setCamerasOnReservations ] = useState(null) // inline camera reservations
    const [ Reservation_ViewOn, setReservation_ViewOn ] = useState(null)
    const [ Show_ViewOn, setShow_ViewOn ] = useState(false)
    const [ Status_To_ONGOING, setStatus_To_ONGOING ] = useState('')


    useEffect(() => {
        const Admin_Token = localStorage.getItem('Admin_Session_Token')
        if (Admin_Token) {
            const decoded_Token = jwtDecode(Admin_Token);
            setSession(decoded_Token)
        }
    },[])

    useEffect(() => {
        const Fetch_Pending_Reservations = async() => {
            const result = await fetch(`/api/Admin/Fetch_All_Reservations`, {
                method : 'GET'
            })

            const response = await result.json();
            if (!response.success) return console.log(response.message)
            setSuccessMessage(response.message)
            setReservations(response.reservationFound) //reservations
            setCamerasOnReservations(response.camera_in_reservations) // inline camera reservations
            setUserOnReservations(response.Users_On_Reservations)
        }
        Fetch_Pending_Reservations();
    },[successMessage])

    const Get_Reservation = async (id) => {
        const result = await fetch(`/api/Admin/User_Reservation/${id}`, {
            method: 'GET'
        })

        const response = await result.json();
        if (response.success) {
            setReservation_ViewOn(response.Reservation_Document) // store the document : Reservation_Document
            setShow_ViewOn('ReservationRequest')
        }
    }

    const formatDate = (date) => {
        const isoDate = date;
        const toformatDate = new Date(isoDate);
        return toformatDate.toLocaleDateString("en-US", {
            month : "2-digit",
            day : "2-digit",
            year : "2-digit",
        })
    }

    const [ copied, setCopied ] = useState(false)
    const handle_Copy = () => {
        const Address = `
            Fullname: ${Reservation_ViewOn?.Address?.fullname}
            Contact No.: ${Reservation_ViewOn?.Address?.PhoneNumber}
            Region: ${Reservation_ViewOn?.Address?.Region}
            Province: ${Reservation_ViewOn?.Address?.Province}
            City/Municipality: ${Reservation_ViewOn?.Address?.City}
            Barangay: ${Reservation_ViewOn?.Address?.Barangay}
            Postal Code: ${Reservation_ViewOn?.Address?.PostalCode}
        `
        navigator.clipboard.writeText(Address)
        setCopied(true);
        setTimeout(() => setCopied(false) , 2000);
    }

    const OpenChat_AdminChat = async() => {
        // const result = await fetch(``)
    }

    //Approved_Rented_Request
    const Approved = async(id, customer_id) => {

        const change_Reserved_Status = await fetch(`/api/Admin/Changed_Reserved_Status/${id}/${customer_id}`, {
            method : 'PUT'
        })

        const response = await change_Reserved_Status.json();
        if (!response.success) return alert(response.message)

        setSuccessMessage(response.message)
    }

    //Approved_Refund
    const Approved_Refund = async(id, customer_id) => {
        const ApprovedRefund = await fetch(`/api/Admin/Refund_Approved_By_Admin/${id}/${customer_id}`, {
            method : 'PUT'
        })
        const response = await ApprovedRefund.json();
        if (!response.success) return alert(response.message)
        setSuccessMessage(response.message)
    }

    const toggleButton = (id) => {
        if (Status_To_ONGOING === id) {
            setStatus_To_ONGOING('')
        } else {
            setStatus_To_ONGOING(id)
        }
    }

    const Change_Reserved_Status_To_Ongoing = async(reservation_id) => {
        const result = await fetch(`/api/Admin/Change_Reserved_Status_Of_Approved_Requested_Reservation/${reservation_id}`, {
            method : 'PUT'
        })
        const response = await result.json();
        if (!response.success) return alert(response.message)
        setStatus_To_ONGOING('')
        setSuccessMessage(response.message)
    } 

    const Change_Reserved_Status_To_Done_Renting = async (reservation_id) => {
        const result = await fetch(`/api/Admin/Change_Status_To_Done_Renting/${reservation_id}`, {
            method : 'PUT'
        })
        const response = await result.json();
        if (!response.success) return console.alert(response.message)

        setSuccessMessage(response.message)

    }

    const formattedDate = (date) => {
        const isoDate = date;
        const FormatDate = new Date(isoDate);

        return FormatDate.toLocaleDateString("en-US", {
            month : "2-digit",
            day : "2-digit",
            year : "2-digit"
        })
    }

    //Reservation_ViewOn
    useEffect(() => {
        if (Reservation_ViewOn) {
            console.log('Reservation_ViewOn: ', Reservation_ViewOn)
        }
    },[Reservation_ViewOn])

    //this useEffect() is for development purposes only
    useEffect(() => {
        if (Session) {
            console.log('Session: ', Session)
        }
        if (Reservations) {
            console.log('Reservations: ', Reservations)
        }
        if (UserOnReservations) {
            console.log('UserOnReservations: ', UserOnReservations)
        }
        if (CamerasOnReservations) {
            console.log('CamerasOnReservations: ', CamerasOnReservations)
        }
    },[Session, Reservations, UserOnReservations, CamerasOnReservations])
    return(
        <>

            <section className="flex flex-col w-395 p-10 absolute top-0 right-0  gap-5 select-none section_here">
                <div className='text-2xl p-5 border-b  w-full mb-5'>
                    <label >Manage Users</label>
                </div>
                <div className=' flex w-full relative '>
                    {/* Requesting for rents */}
                    <div className='w-190 max-h-120 p-2 relative'>
                        <div className='text-2xl'>
                            Requesting for rents
                        </div>
                        <div className='p-2 h-full overflow-auto'>
                            {/* list of users who are requesting to rent an item */}
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Pending' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-2 shadow gap-2 mt-2 rounded hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300'>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` :  iconSample } alt="" className={`object-contain w-12 h-12 ${reservation?.get_method === 'PickUp' ? 'border-yellow-500':'border-blue-500'}  rounded-full border-2`}/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full h-10'>
                                                                    <span className='user_name_Requested'>{UserOnReservations?.[index].email}</span>
                                                                    <span className='text-gray-500'>Reserved an item</span>
                                                                    <div className='absolute right-0 flex items-center gap-2'>
                                                                        <span className='mr-5 flex gap-2 group'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                        <span className='border p-2 bg-green-400/30 text-green-600 border-green-500 rounded cursor-pointer '
                                                                            onClick={() => Approved(reservation._id, reservation.Customer_id._id )}
                                                                        >Approve</span>
                                                                        {/* <span className='border p-2 bg-red-400/30 text-red-600 border-red-500 rounded cursor-pointer'
                                                                        
                                                                        >Declined</span> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>
                    {/* Requesting for refund */}
                    <div className='p-2 max-h-120 w-187 relative'>
                        <div className='text-2xl'>Requesting for refund</div>
                        <div className='p-2 h-full overflow-auto'>
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Requesting refund' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-2 gap-2 mt-2 rounded shadow hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300'>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` : iconSample} alt="" className='object-contain w-12 h-12 border-2 rounded-full border-gray-500 '/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full'>
                                                                    <span className='user_name_Requested'>{UserOnReservations?.[index].email}</span>
                                                                    <span className='text-gray-500'>Requested for a refund</span>
                                                                    <div className='absolute right-0 flex items-center gap-2 '>
                                                                        <span className='mr-5 flex gap-2 group'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                        <span className='border p-2 bg-green-400/30 text-green-600 border-green-500 rounded cursor-pointer '
                                                                            onClick={() => Approved_Refund(reservation._id, reservation.Customer_id._id )}
                                                                        >Approve</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>
                </div>
                    <div className=' w-full p-5'>
                        <div className='p-2'>
                            <span className='text-2xl'>Approved rent requests</span>
                            <div className='flex gap-5 mt-2'>
                                <span className='flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-blue-500'></span><span>Deliver</span></span>
                                <span className='flex gap-2 items-center'><span className='w-2 h-2 rounded-full bg-orange-500'></span> Pick up</span>
                            </div>
                        </div>
                        <div className='p-5 max-h-150 overflow-auto'>
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Approved' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-5 gap-2 mt-2 rounded-full hover:scale-[1.01] hover:-translate-y-1 hover:shadow transform transition-all duration-300'>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` :  iconSample } alt="" className='object-contain w-12 h-12 rounded-full border-2 border-green-500'/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full h-15'>
                                                                    <span className=''>{UserOnReservations?.[index].email}</span>
                                                                    <span><span className='text-gray-500'>Rented item, has been</span> <span className='text-green-500'>approved</span>.</span>
                                                                    <div className='absolute right-0 flex items-center '>
                                                                        <span className=' flex gap-2 group mr-2'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                        <span className='flex gap-1 items-center'>
                                                                            <span className={`border p-2 ${reservation.get_method === 'Delivery' ? 'bg-blue-400/30 text-blue-600 border-blue-500 ':'bg-orange-400/30 text-orange-600 border-orange-500 '} scale-[0.8] rounded-full`}>For {reservation.get_method}</span>
                                                                            -
                                                                            <span className='border p-2 bg-green-400/30 text-green-600 border-green-500 rounded-full flex items-center scale-[0.8] '>
                                                                                <span>Approved</span>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                                                                </svg>
                                                                            </span>
                                                                        </span>
                                                                        -
                                                                        <div className={` ${Status_To_ONGOING === reservation._id ? 'right-12 h-fit w-fit opacity-100 p-2 border':'right-0 h-0 w-0 opacity-0 p-0'} overflow-auto transform transition-all duration-300 absolute  flex gap-2  bg-white rounded `}>
                                                                            <span>Set to:</span>
                                                                            <div className='flex flex-col p-2 gap-2'>
                                                                                <span className='border p-2 rounded-full flex items-center justify-center hover:shadow cursor-pointer hover:scale-[1.04] transition-all duration-300'
                                                                                    onClick={() => Change_Reserved_Status_To_Ongoing(reservation._id)}
                                                                                >Ongoing
                                                                                </span>
                                                                                <span className='border p-2 rounded-full flex items-center justify-center transition-all duration-300 bg-gray-400/20 text-gray-500/50' >Done renting</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className='p-2 border rounded-full cursor-pointer ml-5 hover:scale-[1.05] hover:-translate-y-0.5 transition-all duration-500 '
                                                                            onClick={() => toggleButton(reservation._id)}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>

                    {/* Ongoing rents */}
                    <div className=' w-full'>
                        <div className='p-2'>
                            <span className='text-2xl'>Ongoing Rents</span>
                        </div>
                        <div className='p-2 max-h-150 overflow-auto'>
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Ongoing' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-5 gap-2 mt-2 rounded'>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` :  iconSample } alt="" className='object-contain w-12 h-12 border-amber-300 rounded-full border-2'/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full h-15'>
                                                                    <span className=''>{UserOnReservations?.[index].email}</span>
                                                                    <span>Rental Period: <span className='text-green-500'>{formattedDate(reservation.StartDate)}</span> - <span className='text-green-500'>{formattedDate(reservation.EndDate)}</span></span>
                                                                    <span className='border p-2 bg-green-400 text-white rounded-full flex items-center scale-[0.8] shadow hover:-translate-y-0.5 transform transition-all duration-300'>
                                                                            <span>{reservation.reserved_status}</span>
                                                                    </span>
                                                                    <div className='absolute right-0 flex items-center gap-2 '>
                                                                        <span className='mr-5 flex gap-2 group'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                        
                                                                        <div className={` ${Status_To_ONGOING === reservation._id ? 'right-15 w-55 opacity-100 p-2 border':'right-0 h-0 w-0 opacity-0 p-0'} overflow-auto transform transition-all duration-300 absolute  flex gap-2  bg-white rounded `}>
                                                                            <span>Set to:</span>
                                                                            <div className='flex flex-col p-2 gap-2'>
                                                                                <span className='border p-2 rounded-full flex items-center justify-center   bg-gray-400/20 text-gray-500/50  '
                                                                                >Ongoing
                                                                                </span>
                                                                                <span className='border p-2 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-[1.04] hover:shadow' 
                                                                                    onClick={() => Change_Reserved_Status_To_Done_Renting(reservation._id)}
                                                                                >Done renting</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className='p-2 border rounded-full cursor-pointer ml-5 hover:scale-[1.05] hover:-translate-y-0.5 transition-all duration-500 '
                                                                            onClick={() => toggleButton(reservation._id)}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>
                    
                    {/* Success rents */}
                    <div className=' w-full'>
                        <div className='p-2'>
                            <span className='text-2xl'>Success Rents</span>
                        </div>
                        <div className='p-2 max-h-150 overflow-auto'>
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Done Renting' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-5 gap-2 mt-2 rounded'>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` :  iconSample } alt="" className='object-contain w-12 h-12 rounded-full border border-green-400'/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full h-15'>
                                                                    <span className=''>{UserOnReservations?.[index].email}</span>
                                                                    <span className='text-gray-500'>Successfully rented, and returned the item. </span>
                                                                    <span className='border p-2 bg-green-400 text-white rounded-full flex items-center scale-[0.8] shadow hover:-translate-y-0.5 transform transition-all duration-300'>
                                                                            <span>{reservation.reserved_status}</span>
                                                                    </span>
                                                                    <div className='absolute right-0 flex items-center gap-2 '>
                                                                        <span className='mr-5 flex gap-2 group'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>

                    {/* Aprroved rent refunds */}
                    <div className=' w-full'>
                        <div className='p-2'>
                            <span className='text-2xl'>Approved rent refunds</span>
                        </div>
                        <div className='p-2 h-full overflow-auto'>
                                <>
                                    {Reservations?.length ? (
                                        <>
                                            {Reservations.map((reservation, index) => (
                                                <>
                                                    {reservation?.reserved_status === 'Approved refund' && (
                                                        <>
                                                            <div key={reservation._id} className='flex items-center border p-2 gap-2 mt-2 rounded-full '>
                                                                <div>
                                                                    <img src={reservation?.Customer_id.profile ? `http://localhost:2020${reservation?.Customer_id.profile}` :  iconSample } alt="" className='object-contain w-12 h-12 rounded-full border'/>
                                                                </div>
                                                                <div className='flex gap-2 items-center relative w-full h-15'>
                                                                    <span className=''>{UserOnReservations?.[index].email}</span>
                                                                    <span><span className='text-gray-500'>Requested for a refund, and has been</span> <span className='text-green-500'>approved</span>.</span>
                                                                    <div className='absolute right-0 flex items-center gap-2 '>
                                                                        <span className='mr-5 flex gap-2 group'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                                className="size-6 cursor-pointer group-hover:scale-[1.1] group-hover:-translate-y-0.5 transform transition-all duration-300"
                                                                                onClick={() => Get_Reservation(reservation._id)}    
                                                                            >
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                                                                            </svg> {/* inbox icon */}
                                                                        </span>
                                                                        <span className='border p-2 bg-gray-400/30 text-gray-600 border-gray-500 rounded-full flex items-center'>
                                                                            <span className=''>{reservation.reserved_status}</span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                                                            </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                
                                                </>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <div>No data</div>
                                        </>
                                    )}
                                </>
                        </div>
                    </div>

                {/* poppups GUI */}
                {Show_ViewOn === 'ReservationRequest' && (
                    <>
                        <div className={` ${Show_ViewOn === 'ReservationRequest' ? 'w-full h-full':'w-0 h-0'} bg-black/40  top-0 left-0 z-1000 flex fixed items-center justify-center `}>
                            <div className={` transform transition-all duration-300 w-250 h-200 bg-white rounded flex flex-col p-5 gap-2 relative poppups_GUI overflow-auto`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className="size-6 absolute top-2 right-2 hover:text-red-500 text-red-500/50 transition-colors duration-300 cursor-pointer" 
                                    onClick={() => setShow_ViewOn('')}
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <div className=' border-b border-b-black flex gap-2 items-center p-5 relative'>
                                    <img src={Reservation_ViewOn?.User?.profile ? `http://localhost:2020${Reservation_ViewOn?.User?.profile}` : iconSample} alt="" className='border w-50 h-50 object-contain  rounded-full'/>
                                    <div className='flex flex-col  w-auto'>
                                        <span className='text-5xl'>{Reservation_ViewOn?.User.username}</span>
                                        <span className='text-2xl'>{Reservation_ViewOn?.User.email}</span>
                                        <span>has paid 50% of the total amount for reserving this item </span>
                                        {Reservation_ViewOn?.reserved_status === 'Approved refund' && (
                                            <>
                                                <div className='w-full h-full absolute top-0 left-0 '>
                                                    <span className='absolute text-[90px] text-black/20 font-bold border-20 border-black/20 p-5 rounded-full rotate-25 top-75 left-10 z-99 pointer-events-none'>Refund Approved</span>
                                                </div>
                                            </>
                                        )}
                                        {Reservation_ViewOn?.reserved_status === 'Done Renting' && (
                                            <>
                                                <div className='w-full h-full absolute top-0 left-0 '>
                                                    <span className='absolute text-[90px] text-black/20 font-bold border-20 border-black/20 p-5 rounded-full rotate-25 top-75 left-35 z-99 pointer-events-none'>Done Renting</span>
                                                </div>
                                            </>
                                        )}
                                        {Reservation_ViewOn?.reserved_status === 'Requesting refund' && (
                                            <span>And requesting for a refund</span>
                                        )}
                                    </div>
                                    <span className='border p-2 rounded-4xl shadow bg-linear-to-b from-[#99ec84] to-[#a7ff91] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300'>Paid 50%</span>
                                    <span className='border p-2 rounded-4xl shadow bg-linear-to-b from-[#99ec84] to-[#a7ff91] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300'>{Reservation_ViewOn?.get_method}</span>
                                    {Reservation_ViewOn?.reserved_status === 'Pending' && (
                                        <span className='absolute bottom-2 right-2 border p-2 rounded-full bg-yellow-500/20 border-yellow-500 text-yellow-500'>{Reservation_ViewOn?.User.username} is waiting for admin approval</span>
                                    )}
                                    {Reservation_ViewOn?.reserved_status === 'Requesting refund' && (
                                        <span className='absolute bottom-2 right-2 border p-2 rounded-full bg-gray-500/20 border-gray-500 text-gray-500'>{Reservation_ViewOn?.User.username} is requesting for refund.</span>
                                    )}
                                    {Reservation_ViewOn?.reserved_status === 'Approved' && Reservation_ViewOn?.get_method === 'Deliver' && (
                                        <span className='absolute bottom-2 right-2 border p-2 rounded-full bg-blue-500/20 border-blue-500 text-blue-500'>{Reservation_ViewOn?.User.username} is waiting for the arrival of the item</span>
                                    )}
                                    {Reservation_ViewOn?.reserved_status === 'Approved refund' && (
                                        <span className='absolute bottom-2 right-2 border p-2 rounded-full bg-gray-500/20 border-gray-500 text-gray-500 flex gap-2'>{Reservation_ViewOn?.User.username} 
                                            <span>refund request has been </span>
                                            <span className='text-gray-500'>approved</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <div className='flex gap-2'>
                                    {/* item */}
                                    <div className='flex border p-2 rounded shadow hover:scale-[1.01] transform transition-all duration-300 hover:bg-gradient-to-b hover:from-[#ceeeff] hover:to-[#7cd0fe]'>
                                        {/* <label className='text-2xl'>Item</label> */}
                                            <div>  
                                                <img src={`http://localhost:2020${Reservation_ViewOn?.Camera_Reserved?.[0].main_image_url}`} alt="" className='w-200 max-h-60 object-contain '/> 
                                            </div>
                                            <div className='flex flex-col p-2 w-130'>
                                                <span className='text-3xl font-medium'> {Reservation_ViewOn?.Camera_Reserved?.[0].name} </span>
                                                <span>Brand : {Reservation_ViewOn?.Camera_Reserved?.[0].brand} </span>
                                                <span>Model : {Reservation_ViewOn?.Camera_Reserved?.[0].model} </span>
                                                <span>Price/day : {Reservation_ViewOn?.Camera_Reserved?.[0].price_per_day} </span>
                                                <span>Category : {Reservation_ViewOn?.Camera_Reserved?.[0].category}</span>
                                            </div>
                                    </div>
                                    {/* Address */}
                                    {Reservation_ViewOn?.get_method === 'Delivery' && (
                                        <div className='border w-full p-2 rounded shadow relative hover:scale-[1.01] transform transition-all duration-300'>
                                            <label className='text-2xl'>Address</label>
                                            <div className='flex flex-col'>
                                                <span>Fullname: {Reservation_ViewOn?.Address.fullname}</span>
                                                <span>Contact No. : {Reservation_ViewOn?.Address.PhoneNumber}</span>
                                                <span>Region: {Reservation_ViewOn?.Address.Region}</span>
                                                <span>Province: {Reservation_ViewOn?.Address.Province}</span>
                                                <span>City/Municipality: {Reservation_ViewOn?.Address.City}</span>
                                                <span>Barangay: {Reservation_ViewOn?.Address.Barangay}</span>
                                                <span>Postal Code : {Reservation_ViewOn?.Address.PostalCode}</span>
                                            </div>
                                            <div className='absolute bottom-2 right-4 flex justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                    className={`${copied ? '-translate-y-7':' translate-y-0'} transition-all duration-300 transform size-6 cursor-pointer`} onClick={handle_Copy}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                </svg>
                                                <span className={`${copied ? 'opacity-100':'opacity-0 hidden'} text-blue-500 transform scale-[0.8] transition-all duration-300 absolute cursor-pointer`}>Copied!</span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div className='flex gap-2'>
                                    {/* Reserve status */}
                                    <div className='border w-fit p-2 rounded shadow hover:scale-[1.01] transform transition-all duration-300'>
                                        <label className='text-2xl'>Reservation</label>
                                        <span>#{Reservation_ViewOn?._id}</span>
                                        <div className='flex flex-col p-2'>
                                            <span>Quantity : {Reservation_ViewOn?.Quantity}</span>
                                            <span>Days : {Reservation_ViewOn?.Days}</span>
                                            <span>Start rent : {formatDate(Reservation_ViewOn?.StartDate)}</span>
                                            <span>End rent: {formatDate(Reservation_ViewOn?.EndDate)}</span>
                                            <span>Total: {Reservation_ViewOn?.transaction.amount * 2}</span>
                                        </div>
                                    </div>
                                    {/* transaction status */}
                                    <div className='border w-auto p-2 rounded shadow hover:scale-[1.01] transform transition-all duration-300'>
                                        <label className='text-2xl'>Transaction</label>
                                        #{Reservation_ViewOn?.transaction.transactionId}
                                        <div className='flex flex-col p-2'>
                                            <span>E-Wallet : {Reservation_ViewOn?.transaction.method}</span>
                                            <span>Amount : {Reservation_ViewOn?.transaction.amount}</span>
                                            <span>Gcash No. : {Reservation_ViewOn?.transaction.number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}


            </section>
        </>
    )
}