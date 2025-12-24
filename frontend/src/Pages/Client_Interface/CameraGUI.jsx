
import '../../Styling/style.css'
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useParams, Link, useNavigate } from 'react-router-dom';
import cameraImage_Sample from '../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'
import userSample from '../../assets/icon-7797704_1280.png'
import gcashMock_Logo from '../../assets/GCash-Logo.png'
import paymayaMock_Logo from '../../assets/PayMaya_Logo.png'

import { FaStar } from "react-icons/fa";
import { GoInfo } from "react-icons/go";
import React from 'react';

import Location from '../../Components/Client/Location';
import { getHours } from 'date-fns';
// import * as React from "react"
// import { Calendar } from "@/components/ui/calendar"

export default function CameraGUI() {
    const navigateTo = useNavigate()
    const { Cam_id } = useParams();
    const [     Session, setSession ] = useState(null)
    const [ CameraIs_InReservation, setCameraIs_InReservation ] = useState(null)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ Camera, setCamera ] = useState(null)
    const [ ActiveMainImage_URL, setActiveImage_URL ] = useState('')
    const [ ContinueReserve, setContinueReserve ] = useState(false)
    const [ SelectPayMentMethod_GUI, setSelectPayMentMethod_GUI ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ startDate, setStartDate ] = useState(''); //2025-12-05
    const [ endDate, setEndDate ] = useState('') //2025-12-05
    const [ rangeDays, setRangeDays ] = useState(null)
    const [ Quantity, setQuantity ] = useState(0)
    const [ Total, setTotal ] = useState(null)
    const [ successMessage, setSuccessMessage ] = useState('')
    const [ warningMessage, setWarningMessage ] = useState('')
    const [ PhoneNumber, setPhoneNumber ] = useState(0)
    const [ getMethod, setGetMethod ] = useState('')
    const [ seeLocation, setSeeLocation ] = useState(false)
    const [ AddressShow, setAddressShow ] = useState(false)
    const [ OnShow, setOnShow ] = useState('')

    const [ fullname, setFullname ] = useState('')
    const [ addressPhoneNumber, setAddressPhoneNumber ] = useState('')
    const [ postalCode, setPostalCode ] = useState('')


    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            setRangeDays(diffDays >= 0 ? diffDays : null)
        }

    },[startDate, endDate])
    
    useEffect(() => {
        if (rangeDays) {
            console.log('range days: ', rangeDays)
        } 
        if (startDate) {
            console.log('start date: ', startDate)
        }
    },[rangeDays, startDate])
    
    const toggleAddress = (on) => {
        if(OnShow === on) {
            setOnShow('')
        } else {
            setOnShow(on)
        }
    }

    const [ Show_GUI_GetMethod, setShow_GUI_GetMethod ] = useState(false)
    const set_Get_Method = (method) => {
        if (getMethod !== method) {
            setGetMethod(method)
            setShow_GUI_GetMethod(prev => !prev)
            
            setFullname('')
            setAddressPhoneNumber('')
            setOnRegion('')
            setOnProvince('')
            setOnCity('')
            setOnBarangay('')
            setPostalCode('')
            setChoosed_User_Address(false)
        } else {
            setShow_GUI_GetMethod(prev => !prev)
        }
        
    }
    
    useEffect(() => {
        const Token = localStorage.getItem('User_Session_Token')
        if (Token) {
            const Decoded_Token = jwtDecode(Token);
            console.log('Decoded_Token: ', Decoded_Token)
            setSession(Decoded_Token)
            setIsLoggedIn(true)
        } else {
            setSession(null)
            setIsLoggedIn(false)
            // localStorage.removeItem('User_Session_Token')
            navigateTo('/')
        }
        // console.log('Token: ', Token)
    },[successMessage])

    useEffect(() => {

        // Only call the API once you have a valid Session
        if (!Session || !Session.session_user_id) return

        const isExisting_Item_On_Reserve = async() => {
            const user_id = Session?.session_user_id;
            console.log('user_id inside: ', user_id)
            const result = await fetch(`/api/Client/Check_Reserve_item/${user_id}/${Cam_id}`, {
                method : 'GET'
            })

            const response = await result.json();
            if (response.is_InReservation == false) { 
                setCameraIs_InReservation(false); //false
                console.log('set camera is in reservation: ', response.is_InReservation)
                return
            }
            setCameraIs_InReservation(response.is_InReservation) // True
            console.log('set camera is in reservation: ', response.is_InReservation)
        } 
        isExisting_Item_On_Reserve();
    },[Session, Cam_id])

    useEffect(() => {
        const get_Item = async() => {
            const result = await fetch(`/api/Client/get_camera/${Cam_id}`, {
                method : 'GET'
            })
            const response = await result.json();

            if (!response.success) console.log(response.message)
            setCamera(response.camera)
        }
        get_Item();
    },[Cam_id])

    useEffect(() => {
        if (Quantity > 0 && rangeDays > 0) {
            const total_price = (Camera?.price_per_day * Quantity) * rangeDays;
            const discount_ammount = total_price * 0.20; // 20% discount if it exceeds 3days
            const total_price_W_discount = total_price - discount_ammount;
            setTotal(rangeDays >= 3 ? total_price_W_discount : total_price)
        }
    },[Quantity, rangeDays, Camera])

    useEffect(() => {
        if (Total) {
            console.log('Total: ', Total)
        }
        if (Camera) {
            console.log('Camera: ', Camera)
        }
    },[Total, Camera])



//================== PH Locations API
    const [ refresh, setRefresh ] = useState('')
    const apiKey = import.meta.env.VITE_RAPIDAPI_KEY; //api key of PH Locations API
    const [ Region, setRegion ] = useState(null)
    const [ Regions_Selected, setRegions_Selected ] = useState('') //Code of region selected => 0100000000 edit: change into id
    const [ Province_Selected, setProvince_Selected ] = useState('') //for ID of the Province
    const [ City_Selected, setCity_Selected ] = useState('') //ID of the City Selected
    const [ onRegion, setOnRegion ] = useState('') // 'Camarines sur'
    const [ onProvince, setOnProvince ] = useState('') // Southern Leyte
    const [ onCity, setOnCity ] = useState('') // Tacloban City
    const [ onBarangay, setOnBarangay ] = useState('')

    //This is where the response from the fetch going, this Filter. which is the value is already filtered base on the logic
    const [ Filter_Provinces, setFilter_Provinces ] = useState('') //filtered by the code of the selected region
    const [ Filter_Cities, setFilter_Cities ] = useState('')
    const [ Filter_Barangay, setFilter_Barangay ] = useState('')

    useEffect(() => {
        const fetch_Region = async() => {
            const result = await fetch(`/api/Client/Get_Region`, {
                method : 'GET',
            })
            const response = await result.json();
            if (!response) return alert(`Error received`)
            setRegion(response)

        }
        fetch_Region();
    },[])

    useEffect(() => {
        const fetch_Provinces = async() => {
            const provinces = await fetch(`/api/Client/Get_Provinces_On/${Regions_Selected}`, {
                method : 'GET'
            })

            const response = await provinces.json();
            setFilter_Provinces(response)
        }
        fetch_Provinces()
    },[Regions_Selected])

    useEffect(() => {
        const fetch_Cities_On_Province = async () => {
            const result = await fetch(`/api/Client/Get_Cities_On_Province/${Province_Selected}`, {
                method : 'GET'
            })

            const response = await result.json();
            setFilter_Cities(response)
        }
        fetch_Cities_On_Province()
    },[Province_Selected])

    useEffect(() => {
        const fetch_Barangay_Based_On_City = async () => {
            const barangays = await fetch(`/api/Client/Get-Barangay-Based-On-City-Selected/${City_Selected}`, {
                method: 'GET'
            })
            const response = await barangays.json();
            setFilter_Barangay(response)
        }
        fetch_Barangay_Based_On_City()
    },[City_Selected])


    // const PromptMessage = () => {
    //     return(
    //         <>
    //             <div className='border p-2'>
    //                 {successMessage}
    //             </div>
    //         </>
    //     );
    // }

    // useEffect(() => {
    //     try {
    //         const cached = localStorage.getItem('API_Regions');
    //         if (cached) {
    //             setRegions(JSON.parse(cached));
    //             return;
    //         }
    //     } catch (err) {
    //         console.warn('Invalid cached regions:', err);
    //         localStorage.removeItem('API_Regions');
    //     }

    //     const fetch_Regions = async () => {
    //         try {
    //             const result = await fetch('https://ph-locations-api1.p.rapidapi.com/get_regions', {
    //                 method : 'GET',
    //                 headers : {
    //                     'x-rapidapi-key' : apiKey,
    //                     'x-rapidapi-host' : 'ph-locations-api1.p.rapidapi.com'
    //                 }
    //             })
    
    //             const response = await result.json();
    //             localStorage.setItem('API_Regions', JSON.stringify(response.locations))
    //             setRegions(response.locations)
    //         } catch (error) {
    //             console.error(`Error on frontend: ${error.message}`)
    //         }
    //     } 
    //     fetch_Regions()
    // },[])

    // useEffect(() => {
    //     // const cached_Provinces = localStorage.getItem('API_Provinces');
    //     // if (cached_Provinces) {
    //     //     set_Provinces(JSON.parse(cached_Provinces))
    //     //     return
    //     // }

    //     const fetch_Provinces = async () => {
    //         // added: ?region_code=code for filtering the provinces of that region
    //         const result = await fetch(`https://ph-locations-api1.p.rapidapi.com/get_provinces`, { 
    //             method : 'GET',
    //             headers : {
    //                 'x-rapidapi-host' : 'ph-locations-api1.p.rapidapi.com',
    //                 'x-rapidapi-key' : apiKey,
    //             }
    //         })
    //         const response = await result.json();
    //         localStorage.setItem('API_Provinces', JSON.stringify(response.locations))

    //     }
    //     fetch_Provinces()
    // },[])

    // useEffect(() => {
    //     const cachedProvinces = localStorage.getItem('API_Provinces');
    //     if (cachedProvinces) {
    //         set_Provinces(JSON.parse(cachedProvinces))
    //     }
    // },[])

    // useEffect(() => {

    //     const fetchcities = async() => {
    //         try {
    //             const result = await fetch('https://ph-locations-api1.p.rapidapi.com/get_cities_municipalities', {
    //                 method : 'GET',
    //                 headers : {
    //                     'x-rapidapi-key' : apiKey,
    //                     'x-rapidapi-host' : 'ph-locations-api1.p.rapidapi.com'
    //                 }
    //             })
    
    //             const response = await result.json();
    //             localStorage.setItem('API_Cities', JSON.stringify(response))

                
    //         } catch (error) {
    //             console.error(`Error on frontend: ${error.message}`)
    //         }

    //     }
    //     fetchcities();
    // },[])

    // useEffect(() => {
    //     const cachedCities = localStorage.getItem('API_Cities')
    //     console.log('cachedCities: ', cachedCities)
    //         setCities(cachedCities)
    // },[])
    const getSelected_Region = (id, name) => {
        if (Regions_Selected !== id) {
            setRegions_Selected(id)
            setOnRegion(name)

        }
        setOnProvince('')
        setOnCity('')
        setOnBarangay('')
    }

    const getSelectedProvince = (id, name) => {
        if (Province_Selected !== id) {
            setProvince_Selected(id)
            setOnProvince(name)
        }
        setOnCity('')
        setOnBarangay('')
    }

    const getSelected_City = (id, name) => {
        if (City_Selected !== id) {
            setCity_Selected(id)
            setOnCity(name)
        }
        setOnBarangay('')
    }

    const getSelected_Barangay = (id, name) => {
        if (Filter_Barangay !== id) {
            setOnBarangay(name)
        }
    }

    const [ Choosed_User_Address, setChoosed_User_Address ] = useState(false)
    const [ myActive_Address_ID, setMyActive_Address_ID ] = useState('')
    const Func_SetMyOwnAddress = (id, Phone_number, fullname, barangay, city, province, region, postal_Code) => {
        if (id) {
            setMyActive_Address_ID(id)
            setFullname(fullname)
            setAddressPhoneNumber(Phone_number)
            setOnRegion(region)
            setOnProvince(province)
            setOnCity(city)
            setOnBarangay(barangay)
            setPostalCode(postal_Code)
            setChoosed_User_Address(true)
            console.log('id: ', id)
        } else {
            // alert('No Address')

            setMyActive_Address_ID('')
            setFullname('')
            setAddressPhoneNumber('')
            setOnRegion('')
            setOnProvince('')
            setOnCity('')
            setOnBarangay('')
            setPostalCode('')

        }

    }

    const deleteAddress = async(id, user_id) => {
        // alert('clicked deleted')
        const result = await fetch(`/api/Client/Delete_Address/${id}/${user_id}`, {
            method :'DELETE'
        })

        const response = await result.json();
        if (!response.success) return alert(response.message)

        if (response.new_token) {
            localStorage.setItem('User_Session_Token', response.new_token) //updated token
            setSuccessMessage(response.message)
        }
        alert(response.message)
        
    }

    const address_Created_Form = async () => {
        // alert('clicked')
        try {
            if (onRegion.length === 0) return alert('Complete your address.');
            if (onProvince.length === 0) return alert('Complete your address.');
            if (onCity.length === 0) return alert('Complete your address.');
            if (onBarangay.length === 0) return alert('Complete your address.');
            
            const user_id = Session.session_user_id;
    
            const object = {
                fullname : fullname,
                Phone_Number : addressPhoneNumber,
                Postal_Code : postalCode,
                Region : onRegion,
                Province : onProvince,
                City : onCity,
                Barangay : onBarangay,
            }
            console.log('Frontend request: ', object)
    
            const send_new_address = await fetch(`/api/Client/User_Create_New_Address/${user_id}`, {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify({ request_address : object })
            })
    
            if (!send_new_address.ok) {
                const text = await send_new_address.text();
                throw new Error(`Server error: ${send_new_address.status} - ${text}`);
            }
    
            const response = await send_new_address.json();
            if(!response.success) return alert(response.message)
            
            if (response.new_token) {
                localStorage.setItem('User_Session_Token', response.new_token);
                setSuccessMessage(response.message) 
            }
            console.log('response: ', response)
            alert(response.message)
        } catch (error) {
            console.error(`Error in frontend: ${error.message}`)
        }

    }

    useEffect(() => {
        if (myActive_Address_ID) {
            console.log('Active myActive_Address_ID: ', myActive_Address_ID)
        }
        if (fullname) {
            console.log('Active Fullname: ', fullname)
        }
        if (addressPhoneNumber) {
            console.log('Active addressPhoneNumber: ', addressPhoneNumber)
        }
        if (postalCode) {
            console.log('Active postalCode: ', postalCode)
        }
        if (onProvince) {
            console.log('Active onProvince: ', onProvince)
        }
        if (onCity) {
            console.log('Active onCity: ', onCity)
        }
        if (onBarangay) {
            console.log('Active onBarangay: ', onBarangay)
        }
    },[myActive_Address_ID, fullname, addressPhoneNumber, postalCode, onRegion, onProvince, onCity, onBarangay])


    // ================== payment method

    const [ paymentMethod, setPaymentMethod ] = useState('')
    const handlePaymentMethod = async(method) => {
        // if (paymentMethod.includes('Gcash') || paymentMethod.includes('Paymaya')) {
        // }
        setPaymentMethod(method)
    }

    const [ transactionQRCode, setTransactionQRCode ] = useState(null) // transactionModel
    const [ SeeTransactionDetails, setSeeTransactionDetails ] = useState(false)
    const handlePayment_Submit_Transaction = async(e) => {
        e.preventDefault();

        //check if user did not choose on any on the option as his get method
        if (!getMethod) { 
            alert('Please choose your get method.')
            return
        }
        
        //check if user clicked Deliver as his/their get method
        if (getMethod.includes('Delivery')) {
            if(!myActive_Address_ID) {
                alert('you must have an address set up.')
                return
            }
        }
        // alert('clicked submit');
        // console.log('submit Active_Address: ', myActive_Address_ID  || '')

        setLoading(true)
        const User_id = Session?.session_user_id;
        const object = {
            method : paymentMethod,
            amount : Total,
            number : PhoneNumber,
            quantity : Quantity,
            start_date : startDate,
            end_date : endDate,
            days : rangeDays,
            get_Method : getMethod, //change
            Active_Address : myActive_Address_ID || null,
        }

        const result = await fetch(`/api/Client/Paid-Reservation/${User_id}/${Cam_id}`, {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ object: object})
        })
        // if (!result.ok) return alert(`result throw a status code of ${result.status}`)

        const response = await result.json();

        if (!response.success) return alert(response.message)
        const lazy = setTimeout(() => {
            setSuccessMessage(response.message)
            setLoading(false)

            setTimeout(() => {
                setSelectPayMentMethod_GUI(false)
                setPaymentMethod('')
                Func_SetMyOwnAddress('', '', '', '', '', '', '', '')
                setSeeTransactionDetails(prev => !prev)
            }, 2000);
            localStorage.setItem('User_Session_Token', response.updated_token) //updating session
        }, 2000);
        setTransactionQRCode(response.transaction)

    }   

    

    // useEffect(() => {
    //     // if (!Regions) return
    //     // if (!Filter_Provinces) return

    //     // if (Region) {
    //     //     console.log('Region: ', Region)
    //     // }
    //     // if (Filter_Provinces) {
    //     //     console.log('Filter_Provinces: ', Filter_Provinces)
    //     // }
    //     // if (Filter_Cities) {
    //     //     console.log('Filter_Cities: ', Filter_Cities)
    //     // }
    //     // if (successMessage) {
    //     //     console.log('successMessage: ', successMessage)
    //     // }

    // },[Region, Filter_Provinces, Filter_Cities, successMessage])

    // ========================= PH Locations API

    useEffect(() => {
        if (Camera) {
            setActiveImage_URL(Camera.main_image_url)
        }
    },[Camera])

    useEffect(() => {
        if(Session) {
            console.log('Session: ', Session)
        }
        if(transactionQRCode) {
            console.log('transactionQRCode: ', transactionQRCode)
        }
        // if(Camera) {
        //     console.log('Camera: ', Camera)
        // }
        // if (CameraIs_InReservation) {
        //     console.log('CameraIs_InReservation: ', CameraIs_InReservation)
        // }
    }, [Camera, Session, CameraIs_InReservation, transactionQRCode])

    return(
        <main className='p-10 flex items-center justify-center relative select-none'>
            <Link to="/" className='absolute top-5 left-5'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg> {/* back icon*/}
            </Link>
            <div id="containerItem" className=' w-300 h-auto relative flex gap-1'>
                <div id="Cotainer_Image" className='border border-black/20 rounded p-2 flex flex-col max-w-300 h-full relative '>
                    <div id="Main_ImageShow" className='w-200 h-120 relative'> {/* PrimaryImage Container*/}
{/* ActiveMainImage */} <img src={`http://localhost:2020${ActiveMainImage_URL}`} alt="" className='w-full h-full object-contain'/>
                    </div>
                    <div id='Container_Secondary image' className='flex flex-row gap-2 items-center overflow-auto w-200 h-auto p-2'> {/* Secondary Images*/}
                        {Camera?.sub_images_url.length > 0 ? (
                            <>
                                {Camera?.sub_images_url.map(subImage => (
                                    <img src={`http://localhost:2020${subImage}`} alt="image" className='w-40 border cursor-pointer rounded object-contain'
                                        onClick={() => setActiveImage_URL(subImage)}
                                    />
                                ))}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    <div className='w-full p-2 rounded'>
                        <span>{Camera?.description}</span>
                    </div>
                    
                    {Camera?.User_Experience?.length > 0 ? (
                        <>
                            <div className='flex flex-col p-2'>
                                <span className='text-3xl'>Customer Experience</span>
                                <div className='flex flex-col gap-2 p-3 overflow-auto max-h-120'> {/* Container Reviews*/}
                                    {Camera?.User_Experience.map((exp, index) => (
                                        <React.Fragment key={exp._id}>
                                            <div className=' border p-2 rounded-2xl border-black/5 shadow '> {/* User Reviews*/}
                                                <div className='flex gap-2 items-center '>
                                                    <div className='w-30 flex flex-col items-center '>
                                                        <img src={exp?.Review?.User_id?.profile ? `http://localhost:2020${exp?.Review?.User_id?.profile}`: userSample} alt="" className='w-12 h-12 object-contain rounded-full border border-black/20'/>
                                                        <span className='font-semibold'>{exp?.Review?.User_id.username}</span>
                                                        <span className='flex items-center scale-[0.8] transform gap-2 -translate-y-2'> 
                                                            <span className=''>Rated {exp?.Review?.Rate}</span>
                                                            <FaStar className='text-green-500 size-3'/>
                                                            
                                                        </span>
                                                    </div>
                                                    <div className='flex flex-wrap w-full h-auto items-center'>
                                                        <span className='w-full leading-relaxed'>{exp?.Review?.comment}</span>
                                                    </div>
                                                </div>
                                                {/* <div className='p-2 flex gap-2 justify-end'>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                    <img src={cameraImage_Sample} alt="" className='w-15 h-15 object-contain border border-black/40 rounded cursor-pointer'/>
                                                </div> */}
                                            </div>
                                        </React.Fragment>
                                        ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                No user experience yet.
                            </div>
                        </>
                    )}
                </div>
                <div id="Items_info_Container" className='w-150 h-fit border border-black/20 p-2 rounded sticky top-5 flex flex-col items-center'>
                    <div className='flex flex-col p-2 w-full'>
                        <span className='text-5xl'>{Camera?.name}</span>
                        <span>Brand : {Camera?.brand}</span>
                        <span>Model : {Camera?.model}</span>
                        <span>Price Per day: P {Camera?.price_per_day}</span>
                    </div>
                    <div className='flex flex-col p-5 gap-2 w-full relative'>
                        <span>Items Included</span>
                        <div className='flex flex-wrap gap-2 w-full'>
                            {Camera?.inclusion.length > 0 ? (
                                <>
                                    {Camera?.inclusion.map(inclu => (
                                        // <div className='border relative h-fit group'>
                                            <img src={`http://localhost:2020${inclu.image}`} alt="" className='hover:scale-[1.1] transform transition-all duration-300 border border-black/20 cursor-pointer w-20 rounded object-contain'/>
                                        // </div>
                                    ))}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <button className={`border rounded w-90 h-10 ${CameraIs_InReservation ? 'bg-gray-500/20 border-gray-500 text-gray-600':'bg-blue-500/20 border-blue-500 text-blue-600'}  cursor-pointer `}
                        disabled={CameraIs_InReservation}
                        onClick={() => setContinueReserve(prev => !prev)}
                    >
                        {CameraIs_InReservation ? (
                            <span>Reserved</span>
                        ) : (
                            <span>Reserve this item</span>
                        )}
                    </button>
                </div>
            </div>
            <div className={` ${ContinueReserve ? 'w-full h-full':'w-0 h-0'} overflow-hidden bg-black/20 fixed top-0 flex items-center justify-center`}>
                <div className={`${ContinueReserve ? 'translate-y-0':'-translate-y-10'} w-170 h-170 overflow-hidden transition-all duration-300 bg-white rounded p-5 flex flex-col gap-2 relative`}>

                    <div className='border border-black/20 flex gap-2 rounded shadow'>
                        <img src={cameraImage_Sample} alt="" className='w-40 object-contain'/>
                        <div className='flex flex-col  w-full p-2'>
                            <span className='text-2xl'>{Camera?.name}</span>
                            <span>brand: {Camera?.brand}</span>
                            <span>Model: {Camera?.model}</span>
                            <span>Category: {Camera?.category}</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handlePayment_Submit_Transaction}>
                        <div className='flex flex-col gap-2 mt-5'>
                            <div className='flex gap-2'>
                                <label className='flex gap-2 items-center'>
                                    <span className='font-bold'>Start date:</span>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    className='border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'/>
                                </label>
                                <label className='flex gap-2 items-center'>
                                    <span className='font-bold'>End Date:</span>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                                    className='border rounded p-2'/>
                                </label>
                            </div>
                            <label><span className='font-bold'>Price per day: </span>{Camera?.price_per_day}</label>
                            <label className='flex gap-2'>
                                <span className='font-bold'>Quantity:</span> 
                                    <input type="number" 
                                        className='border border-black/50 w-10 text-center' 
                                        defaultValue={0}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                            </label>
                            <label>
                                <span className='font-bold'>Days :</span> {rangeDays >= 0 ? `${rangeDays} days` : `${rangeDays} day`}  <span className='text-red-500'>20% Rental discount if exceeds 3 days</span> 
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='font-bold'>Total: P {Total} </span>  
                                <span>{rangeDays >= 3 ? '20% rental discount applied' : null}</span>
                            </label>
                            <label className='flex flex-col gap-1 mt-2'>
                                <span className='font-bold '>How would you like to get your item?</span>
                                <span className={` ${getMethod === 'PickUp' ? 'bg-blue-500/30 border-blue-500': 'border-black/20'} border p-2 rounded  cursor-pointer hover:scale-[1.02] transform transition-all duration-300`}
                                    onClick={() => set_Get_Method('PickUp')}
                                >Pick Up</span>
                                <span className={` ${getMethod === 'Delivery' || Choosed_User_Address === true ? 'bg-blue-500/30 border-blue-500' : 'border-black/20'} border p-2 rounded border-black/20 cursor-pointer hover:scale-[1.02] transform transition-all duration-300`}
                                    onClick={() => set_Get_Method('Delivery')}
                                >Deliver</span>
                            </label>

                            <span className={`${getMethod === 'PickUp' ? 'translate-y-0 opacity-100':'translate-y-5 opacity-0 '} w-fit transition-all duration-300 transform flex gap-2 mb-5 group cursor-pointer`}
                                onClick={() => setSeeLocation(prev => !prev)}
                            >
                                <span className='group-hover:text-blue-500'>Check location</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className="size-6 group-hover:text-blue-500 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </span>
                            <input type="button" value="Continue reserving this item?" className='border border-blue-500 text-blue-600 bg-blue-500/20 cursor-pointer w-full text-center p-2 rounded'
                                onClick={() => setSelectPayMentMethod_GUI(prev => !prev)}
                            />
                            <span className='text-center'>Note: You need to pay 50% of the total price for reserving the item</span>
                        </div>
                        <div className={`${seeLocation ? 'w-full h-full' : 'w-0 h-0'} overflow-hidden bg-black/50 absolute top-0 left-0 flex items-center justify-center`}>
                            <div className={`${seeLocation ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-100'} transition-all duration-500 transform w-150 h-150 p-5 border bg-white relative rounded`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    onClick={() => setSeeLocation(prev => !prev)}
                                    className="size-6 absolute right-2 top-2 hover:text-red-500 cursor-pointer text-red-300"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <label className='text-2xl flex flex-col'>
                                    <span>We are located at:</span>
                                    <span>corner San Salvador St, Militante St, Palo, 6501 Leyte</span>
                                </label>
                                <div className='mt-5'>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.1682348674555!2d124.9871539837759!3d11.16156657368366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x330877d4dca5068f%3A0x5af05f75adf4763b!2sZaki%20Piso%20Machine%20Manufacturing!5e1!3m2!1sen!2sph!4v1763482489071!5m2!1sen!2sph" 
                                        className='w-full'
                                        height="450" 
                                        style={{ border: 0}} 
                                        allowfullscreen="" 
                                        loading="lazy" 
                                        referrerpolicy="no-referrer-when-downgrade">
                                    </iframe>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute ${getMethod === 'Delivery' && Show_GUI_GetMethod === true ? 'w-full h-full':'w-0 h-0'} overflow-hidden top-0 left-0 bg-black/40 rounded flex items-center justify-center `}>
                            <div className={`${getMethod === 'Delivery' ? 'translate-y-0 opacity-100':'-translate-y-5 opacity-0'} transform transition-all duration-300 w-150 h-165 bg-white flex flex-col gap-2 p-5 roundeds`} >
                                {/* {successMessage.length > 0 && (
                                    <PromptMessage />
                                )} */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    onClick={() => setShow_GUI_GetMethod(prev => !prev)}
                                    className="size-6 absolute top-2 right-2 text-red-500/50 hover:text-red-500 cursor-pointer"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <label className='text-2xl'>Address</label>
                                <span className='flex gap-2 items-center'>
                                    <GoInfo className='text-blue-500'/>
                                    Use your address after creating one.</span>
                                <div className='border h-37 overflow-auto pl-5 pr-5 p-3 flex flex-col gap-2' >
                                        {Session?.session_Address?.length > 0 && (
                                            <>
                                                {Session.session_Address.map(address => (
                                                    <>
                                                        <div className='border flex gap-2 p-1 pl-2 rounded shadow cursor-pointer hover:scale-[1.02] transition-all duration-300 relative' 
                                                            onClick={() => Func_SetMyOwnAddress(address._id, address.PhoneNumber, address.fullname, address.Barangay, address.City, address.Province, address.Region, address.PostalCode)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                            </svg>
                                                            <div className='flex flex-col'>
                                                                <span>{address.fullname}</span>
                                                                <span>{address.Barangay}</span>
                                                                <span>{address.Barangay}, {address.City}, {address.Province}, {address.Region}</span>
                                                                <span>{address.PostalCode}</span>
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                className="size-6 absolute right-2 top-2 text-red-500/40 hover:text-red-600" onClick={() => deleteAddress(address._id, Session?.session_user_id)}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </div>
                                                    </>
                                                ))}
                                            </>
                                        )}
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='flex flex-col'>
                                        <span>Fullname</span>
                                        <input type="text" name='fullname' value={fullname} className='border rounded p-2'  onChange={(e) => setFullname(e.target.value)} />
                                    </label>
                                    <label className='flex flex-col'>
                                        <span>Phone Number</span>
                                        <input type="number" name='PhoneNumber' value={addressPhoneNumber} className='border rounded p-2 ' onChange={(e) => setAddressPhoneNumber(e.target.value)} />
                                    </label>
                                    <div className='mt-2'>
                                            <span className='flex relative border p-2 rounded cursor-pointer'
                                                onClick={() => setAddressShow(prev => !prev)}
                                            >
                                                {onRegion.length > 0 || onProvince.length > 0 || onCity.length > 0 || onBarangay.length > 0 ? (
                                                    <>
                                                        <div className='flex flex-col gap-1'>
                                                            <span>{onRegion}</span>
                                                            <span>{onProvince}</span>
                                                            <span>{onCity}</span>
                                                            <span>{onBarangay}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Set Region, Province, City, Barangay </span>
                                                    </>
                                                )}

                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                    className="size-6 absolute right-0">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                </svg> {/* Continue */}
                                            </span>
                                        </div>
                                        <div className={`${ AddressShow ? 'w-full h-full':'w-0 h-0'} overflow-hidden absolute bg-black/30 top-0 left-0 flex items-center justify-center`}>
                                            <div className={`${AddressShow ? 'translate-y-0':'-translate-y-5'} relative transition-all duration-300 w-120 h-140 bg-white flex flex-col`}>
                                                <div className='h-10 '>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 absolute right-2 top-2 cursor-pointer text-red-500/50 hover:text-red-500 transition-all duration-300"
                                                        onClick={() => setAddressShow(prev => !prev)}
                                                    >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </div>

                                                <div className='p-5 flex flex-col gap-5'>
                                                    <div className='p-5  w-auto h-fit overflow-hidden border relative rounded cursor-pointer '
                                                        onClick={() => toggleAddress('Region')}
                                                    >
                                                        <span className='text-[17px] font-bold'>Region : </span>
                                                        <span>{onRegion || 'Select your region'}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-5 absolute right-2 top-3 " >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        <div className={` ${OnShow === 'Region' ? 'translate-y-0 opacity-100': '-translate-y-5 opacity-0 hidden'} transition-all duration-300 w-110 max-h-70 flex flex-col overflow-auto scrollbar-hide fixed left-5 pl-2 pr-2 pb-2 translate-y-5 bg-white border z-999 `}>
                                                            <span className=''>Region</span>
                                                            {Region && Region?.length > 0 && (
                                                                <>
                                                                    {Region.map((region) => (
                                                                        <span className='border rounded p-2 mt-1 cursor-pointer hover:bg-gray-200' onClick={() => getSelected_Region(region.id, region.name)}>{region.name}</span>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='p-5  w-auto h-fit border relative rounded cursor-pointer '
                                                        onClick={() => toggleAddress('Province')}
                                                    >
                                                        <span className='text-[17px] font-bold'>Province : </span>
                                                        <span>{onProvince || 'Select your province.'}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-5 absolute right-2 top-3 ">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        <div className={` ${OnShow === 'Province' ? 'translate-y-0 opacity-100': '-translate-y-5 opacity-0 hidden'} transition-all duration-300 w-110 max-h-70 flex flex-col overflow-auto scrollbar-hide fixed left-5 pl-2 pr-2 pb-2 translate-y-5 bg-white border z-999 `}>
                                                            <span>Province</span>
                                                            {Filter_Provinces.length > 0 ? (
                                                                <>
                                                                    {Filter_Provinces.map(provFiltered => (
                                                                        <span className='border rounded p-2 mt-1 cursor-pointer hover:bg-gray-200' onClick={() => getSelectedProvince(provFiltered.id, provFiltered.name)}>{provFiltered.name}</span>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className='border rounded p-2 mt-1'>No data</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='p-5  w-auto h-fit border relative rounded cursor-pointer'
                                                        onClick={() => toggleAddress('City')}
                                                    >
                                                        <span className='text-[17px] font-bold'>City : </span>
                                                        <span>{onCity || 'Select your city'}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-5 absolute right-2 top-3 ">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        <div className={` ${OnShow === 'City' ? 'translate-y-0 opacity-100': '-translate-y-5 opacity-0 hidden'} transition-all duration-300 w-110 max-h-70 flex flex-col overflow-auto scrollbar-hide fixed left-5 pl-2 pr-2 pb-2 translate-y-5 bg-white border z-999 `}>
                                                            <span>City</span>
                                                            {Filter_Cities.length > 0  ? (
                                                                <>
                                                                    {Filter_Cities.map(cities => (
                                                                        <span className='border rounded p-2 mt-1 cursor-pointer hover:bg-gray-200' onClick={() =>  getSelected_City(cities.id, cities.name)}>{cities.name}</span>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className='border rounded p-2 mt-1'>No data</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='p-5  w-auto h-fit border relative rounded cursor-pointer'
                                                        onClick={() => toggleAddress('Barangay')}
                                                    >
                                                        <span className='text-[17px] font-bold'>Barangay : </span>
                                                        <span>{onBarangay || 'Select yout barangay.'}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-5 absolute right-2 top-3 ">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                        </svg>
                                                        <div className={` ${OnShow === 'Barangay' ? 'translate-y-0 opacity-100': '-translate-y-5 opacity-0 hidden'} transition-all duration-300 w-110 max-h-70 flex flex-col overflow-auto scrollbar-hide fixed left-5 pl-2 pr-2 pb-2 translate-y-5 bg-white border z-999 `}>
                                                            <span>Barangay</span>
                                                            {Filter_Barangay.length > 0  ? (
                                                                <>
                                                                    {Filter_Barangay.map(barangay => (
                                                                        <span className='border rounded p-2 mt-1 cursor-pointer hover:bg-gray-200' onClick={() => getSelected_Barangay(barangay.id, barangay.name)}>{barangay.name}</span>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className='border rounded p-2 mt-1'>No data</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            
                                            </div>

                                        </div>
                                        <label className='flex flex-col w-50'>
                                            <span>Postal Code</span>
                                            <input type="number" name='postalCode' value={postalCode} className='border rounded p-2 ' onChange={(e) => setPostalCode(e.target.value)} />
                                        </label>
                                        <button type="button" onClick={address_Created_Form} className='border p-2 rounded border-blue-500 bg-blue-500/20 text-blue-500 cursor-pointer'>Save Address</button>
                                </div>
                            </div>
                        </div>
                        <div className={`${SelectPayMentMethod_GUI ? 'w-full h-full':'hidden'} absolute top-0 left-0 flex items-center justify-center bg-black/50 overflow-hidden`}>
                            <div className={`flex flex-col gap-1 bg-white w-100 p-5 rounded h-fit`}>
                                <label>Select payment method</label>
                                <small>Choose your e-wallet</small>
                                <span className='border p-2 rounded border-black/20 cursor-pointer hover:scale-[1.02] transform transition-all duration-300'
                                    onClick={() => handlePaymentMethod('Gcash')}
                                >Gcash</span>
                                <span className='border p-2 rounded border-black/20 cursor-pointer hover:scale-[1.02] transform transition-all duration-300'
                                    onClick={() => handlePaymentMethod('Paymaya')}
                                >Paymaya</span>
                            </div>
                        </div>
                        {paymentMethod === 'Gcash' && (
                            <div className={` w-full h-full bg-black/50 absolute top-0 left-0 flex items-center justify-center `}>
                                <div className='rounded w-120 relative h-155 bg-gradient-to-br from-[#0648ef] to-[#3a64ce] p-10'>
                                    <div className='w-full'>
                                        <img src={gcashMock_Logo} alt="" className='w-full h-full'/>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-white'>Gcash payment (Mock)</label>
                                        <div className='flex flex-col gap-5'>
                                            <label className='flex flex-col gap-1'>
                                                <span className='text-white'>{Total * 0.50} will be deduct on your gcash (Mock) account</span>
                                                <span className='text-white'>Enter your gcash number</span>
                                                <input type="number" name="e-walletNumber" placeholder="09XXXXXXXXX" className=' rounded bg-white no-spinner focus:outline-blue-500 p-2 '
                                                    onChange={(e) => setPhoneNumber(e.target.value)} disabled={paymentMethod !== 'Gcash'} required
                                                />
                                            </label>
                                            <div className='w-full relative flex items-center justify-center overflow-hidden'>
                                                <input type="submit" value="" className={` rounded w-full p-5 ${successMessage === 'Payment successfull.' ? 'bg-green-500':'border bg-blue-800 border-blue-600'} transition-colors duration-300 text-white cursor-pointer`}
                                                    disabled={successMessage === 'Payment successfull.' || false}
                                                />
                                                <span className={`${ successMessage === 'Payment successfull.' ? 'top-15 opacity-0':'top-5 opacity-100'} transition-all duration-300 absolute text-white `}>proceed payment</span>
                                                <span className={`${ successMessage === 'Payment successfull.' ? 'top-5 opacity-100':'top-15 opacity-0'} transition-all duration-300 absolute text-white flex gap-2`}>
                                                    <span>Successfully paid</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 text-green-300">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </span>
                                                {loading && (
                                                    <span className="loading loading-spinner loading-xs absolute top-6 left-25 text-white"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {paymentMethod === 'Paymaya' && (
                            <div className={` w-full h-full bg-black/50 absolute top-0 left-0 flex items-center justify-center `}>
                                <div className={`rounded w-120 relative h-155 bg-linear-to-br ${paymentMethod === 'Paymaya' && 'from-[#04225b] to-[#0a3179]'}  p-10`}>
                                    <div className='w-full mb-5'>
                                        <img src={paymayaMock_Logo} alt="" className='w-full h-full bg-white object-contain rounded'/>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <label className='text-white'>Paymaya payment (Mock)</label>
                                        <div className='flex flex-col gap-5'>
                                            <label className='flex flex-col gap-1'>
                                                <span className='text-white'>{Total * 0.50} will be deduct on your Paymaya (Mock) account</span>
                                                <span className='text-white'>Enter your gcash number</span>
                                                <input type="number" name='e-walletNumber'  placeholder="09XXXXXXXXX" className=' rounded bg-white no-spinner focus:outline-blue-500 p-2 ' 
                                                    onChange={(e) => setPhoneNumber(e.target.value)} disabled={paymentMethod !== 'Paymaya'} required
                                                />
                                            </label>
                                            <div className='w-full relative flex items-center justify-center overflow-hidden'>
                                                <input type="submit" value="" className={` rounded w-full p-5 ${successMessage === 'Payment successfull.' ? 'bg-green-500':'border bg-blue-800 border-blue-600'} transition-colors duration-300 text-white cursor-pointer`}
                                                    disabled={successMessage === 'Payment successfull.' || false}
                                                />
                                                <span className={`${ successMessage === 'Payment successfull.' ? 'top-15 opacity-0':'top-5 opacity-100'} transition-all duration-300 absolute text-white `}>proceed payment</span>
                                                <span className={`${ successMessage === 'Payment successfull.' ? 'top-5 opacity-100':'top-15 opacity-0'} transition-all duration-300 absolute text-white flex gap-2`}>
                                                    <span>Successfully paid</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 text-green-300">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </span>
                                                {loading && (
                                                    <span className="loading loading-spinner loading-xs absolute top-6 left-25 text-white"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {SeeTransactionDetails && (
                            <>
                                <div className='absolute w-full h-full top-0 left-0 bg-black/30 flex items-center justify-center '>
                                    <div className='flex flex-col bg-white h-120 w-120 gap-2 justify-center items-center rounded relative'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                            onClick={() => setSeeTransactionDetails(prev => !prev)}
                                            className="size-6 absolute top-2 right-2 hover:text-red-600 text-rose-500/50 cursor-pointer"
                                        >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span>Your transaction details</span>
                                        <div className='border rounded shadow'>
                                            <img src={transactionQRCode?.qrcode} alt="" className='w-full h-full object-contain'/>
                                        </div>
                                        <Link to={`/TransactionDetails/${transactionQRCode._id}`} className='text-blue-500 cursor-pointer'>Click to see your transaction details</Link>
                                    </div>
                                </div>
                            </>
                        )}

                    </form>
                </div>
            </div>
        </main>
    );
}
