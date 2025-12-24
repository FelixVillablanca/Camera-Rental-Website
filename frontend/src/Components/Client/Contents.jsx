import hero from "../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png"
import { useState, useEffect, use} from "react";
import { Link, useNavigate } from "react-router-dom";

import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { jwtDecode } from "jwt-decode";
import React from 'react'
// import { search } from "../../../../backend/Routes/RouterAdmin";

// async function  Cameras() {
//     const result = await fetch(`/api/Client/Get_All_Cameras`)
//     return result.json();
// }

export default function Contents() {
    // const cameras = use(Cameras()); //for server only like next.js
    const navigateTo = useNavigate();

    const [ isLoggedIn, setIsLoggedin ] = useState(false);
    //Date Range Picker
    const [date, setDate] = useState({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    })


    const [ count_PricePerRentalRate, setCount_PricePerRentalRate ] = useState(0)
    const handleChange = (ranges) => {
        setDate(ranges.selection)

        const { startDate, endDate } = ranges.selection;

        // Calculate number of days from today
        const today = new Date();
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log(`Days from today to endDate: ${diffDays === 1 ? diffDays : diffDays + 1}`);
        console.log(`Days from startDate to endDate: ${startDate}`);

        setCount_PricePerRentalRate(diffDays >= 1 ? diffDays + 1 : diffDays ) 
    }

    useEffect(() => {
        console.log('count_PricePerRentalRate', count_PricePerRentalRate)
    },[count_PricePerRentalRate])

    //Session
    const [ Session, setSession ] = useState(null)
    useEffect(() => {
        const Session_Token = localStorage.getItem('User_Session_Token');
        if (Session_Token) {
            const decode_session_token = jwtDecode(Session_Token);
            setSession(decode_session_token);
            setIsLoggedin(true)
        } else {
            setIsLoggedin(false)
        }
    },[])

    const check_LoggedIn_Status = () => {
        if (!isLoggedIn) {
            alert('you need to loggin first!')
        }
    }
    
    //Categories
    const [Category, setCategory] = useState('')
    const [ Categories, setCategories ] = useState(null)
    useEffect(() => {
        const func_get_Categories = async() => {
            const result = await fetch('/api/Client/Get_Categories', {
                method: 'GET'
            });

            const response = await result.json();

            if(!response.success) return console.log(response.message);
            
            setCategories(response.categories);
        }
        func_get_Categories();
    },[])

    const [ CategoryTracker, seCategoryTracker ] = useState('')
    const [ SubCategoryTracker, setSubCategoryTracker ] = useState('')

    const CategoriesHeader_tracker_info = (Category, Sub_Category) => {
        // if (CategoryTracker.length > 0 && SubCategoryTracker.length > 0) {
        //     seCategoryTracker('')
        //     setSubCategoryTracker('')
        // } else {
            seCategoryTracker(Category)
            setSubCategoryTracker(Sub_Category)
        // }
    }

    const CategoriesHeader_tracker_info_Reset = () => {
        if (CategoryTracker.length > 0 && SubCategoryTracker.length > 0) {
            seCategoryTracker('')
            setSubCategoryTracker('')
        }
    }

    const [ Cameras, setCameras ] = useState(null)
    const [ FilterSearched, setFilterSearched ] = useState('')
    useEffect(() => {
        const Get_ALL_Cameras = async() => {
            const result = await fetch(`/api/Client/Get_All_Cameras`, {
                method: 'GET'
            })
            // if (!result.ok) return alert(result) 
            const response = await result.json();
            if (!response.success) return console.log(response.message);
            setCameras(response.Cameras)
            setFilterSearched(response.Cameras)
        }
        Get_ALL_Cameras();
    },[])


    const [ searchedListener, setSearchedListener ] = useState('')
    useEffect(() => {
        if (!searchedListener) {
            setCameras(FilterSearched)
        } else {
            setCameras(FilterSearched.filter(cam => cam.name.toLowerCase().includes(searchedListener.toLowerCase())))
        }
        // console.log('searchedListener: ', searchedListener)
    },[searchedListener, FilterSearched])

    useEffect(() => {
        if (Session) {
            console.log('Content Session: ', Session)
        } 
        if (Categories) {
            console.log('Categories: ', Categories)
        }
        if (Cameras) {
            console.log('Cameras: ', Cameras)
        }
    },[Session, Categories, Cameras])

    return(
        <>
                <section className='p-5 w-full relative flex justify-center '>
                    <div className='flex gap-5 w-[90%] justify-center flex-wrap p-5 rounded bg-linear-to-r from-[#8dbaf1] to-[#2569c3] date-picker-main'>
                        <div className='flex items-center'>
                            <span className='text-[32px] font-semibold'>Set your Rental Period to find available products.</span>
                        </div>
                        <div className=''>
                            <DateRangePicker
                                ranges={[date]}
                                onChange={handleChange}
                                className='custom-date-picker'
                            />
                        </div>
                    </div>
                </section>
                <section id="Items" className='w-full flex flex-col items-center'>
                 
                    <div className='flex bg-white gap-2 w-full p-5 relative'>
                        <div className={`flex flex-col ${Categories?.length > 0 ?  'w-fit p-2 border-r':'w-0 p-0 border-none'} z-10`}> {/* Categories aside part*/}
                            {Array.isArray(Categories) && Categories.length > 0  && Categories.map((categories, index) => (
                                <React.Fragment key={categories._id}>
                                    {categories.isVisible === true && (
                                        <>
                                            <span className="border-none  text-[25px] border-b-gray-500/40  flex relative items-center rounded cursor-pointer" onClick={() => setCategory(categories.name)}>
                                                {categories.name}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                                    className="size-5 absolute right-2" >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </span>
                                            {/* {Category == categories.name && ( */}
                                                {/* <div className=" p-2"> */}
                                                    <div key={index} className={`${Category == categories.name ? 'h-fit p-1 gap-2 border border-black/20 opacity-100' : 'h-0 p-0 border-none opacity-0'} transfrom transition-all duration-400 bg-white  z-10 w-70 overflow-hidden transform rounded flex flex-col `}>
                                                        {Array.isArray(categories.subcategories) && categories.subcategories.length > 0 ? (categories.subcategories.map((subcat, index) => (
                                                            <span key={index} className=" p-2 text-[15px] cursor-pointer  rounded hover:bg-blue-500/20" 
                                                                onClick={() => CategoriesHeader_tracker_info(categories.name, subcat)}
                                                            >{subcat}</span>
                                                        ))) : (
                                                            <>
                                                                <span>No sub categories</span>
                                                            </>
                                                        )}
                                                        {/* <span className=" p-2 text-[21px]">DSLR</span>
                                                        <span className=" p-2 text-[21px]">Prosumer Videos</span>
                                                        <span className=" p-2 text-[21px]">Mirrorless Cameras</span> */}
                                                    </div>
                                                {/* </div> */}
                                            {/* )} */}
                                        </>
                                        
                                    )}
                                </React.Fragment>
                            ))}
                            {/* <span>Lenses</span> */}
                            {/* <span>Lighting Equipment</span> */}
                            {/* <span>Point-and-Shoot Cameras</span> */}
                            {/* <span>Video Cameras</span> */}
                            {/* <span>Tripods and Supports</span> */}
                            {/* <span>Audio Accessories</span> */}
                            {/* <span>Accessories Kit</span> */}
                        </div>
                        <div className=' flex flex-col border w-full '>
                            
                            <div className=' w-full relative h-20 z-5 flex items-center p-2 '>
                                <label className='flex items-center gap-1'>
                                    {CategoryTracker.length > 0 && SubCategoryTracker.length > 0 && (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                className="size-6 cursor-pointer" onClick={CategoriesHeader_tracker_info_Reset}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                            </svg>
                                            <span>
                                                <a href="#" className='text-blue-500 text-[19px]'>{CategoryTracker}</a>    
                                            </span> 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg> {/* > */}
                                            <span>
                                                <a href="#" className='text-blue-500 text-[19px]' >{SubCategoryTracker}</a>  
                                            </span>
                                        </>
                                    )}
                                </label>
                                <div className='  w-[25%] pointer-events-auto absolute right-15'>{/* absolute top-0.5 */}
                                    <input type="search" className='bg-gray-200 rounded-[10px] p-2 pl-9 focus:outline-none w-full ' value={searchedListener} placeholder='Search' onChange={(e) => setSearchedListener(e.target.value)}/>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                        className="size-6 absolute top-2 left-2 ">{/* absolute top-2 left-2 */}
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg> {/* search icon */}
                                </div>
                                <span className='absolute right-5 flex items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                    </svg>
                                </span> {/* filter icon */}
                            </div>

                            <div className='flex flex-wrap justify-center gap-2 p-4 max-h-[90vh] overflow-auto'>
                                {/* start cards */}
                                    {CategoryTracker.length > 0 && SubCategoryTracker.length > 0 ? (
                                        <>
                                            {Cameras.filter(camera => camera.category === CategoryTracker && camera.sub_category === SubCategoryTracker).length > 0 ? (
                                                Cameras.filter(camera => camera.category === CategoryTracker && camera.sub_category === SubCategoryTracker).map((camera, index) => (
                                                    <>
                                                        <div className='flex p-5 w-[520px] h-65 rounded relative bg-gradient-to-br from-[#92c3f7] to-[#96deff] ' >
                                                            {/* <div className='bg-gradient-to-br from-[#c8e7f5] to-[#10a7e2]'> */}
                                                                <img src={hero} alt="" className='w-60 h-full object-contain rounded '/>
                                                            {/* </div> */}
                                                            <div className='flex'>
                                                                <div className='flex flex-col justify-center p-5 text-[16px]'>
                                                                    <span className='text-4xl font-semibold'>{camera?.name}</span>
                                                                    <span >{camera?.brand}</span>
                                                                    <span className="text-green-500">{camera?.status}</span>
                                                                    <span>Price based on Rental Period: ₱ {count_PricePerRentalRate * camera?.price_per_day}</span>
                                                                    <span>Origin Price/day: ₱ {camera?.price_per_day}</span>
                                                                    <Link to={isLoggedIn ? `/Camera/${camera?._id}` : ''} className="absolute underline text-blue-600 right-2 bottom-2 cursor-pointer hover:text-blue-400  w-7 h-7 flex items-center justify-center bg-white hover:scale-[1.1] transition-all transform duration-300 rounded-full"
                                                                        onClick={() => check_LoggedIn_Status()}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                                        </svg>
                                                                    </Link>
                                                                    {/* <button className='p-3 rounded bg-red-500 text-white text-[15px] cursor-pointer mt-2'>Add to Reservation</button> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                            ) : (
                                                <>
                                                    <div>
                                                        No item in this Section.
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {Array.isArray(Cameras) && Cameras?.length > 0 && (
                                                Cameras.map(cam => (
                                                    <div key={cam._id} className='flex p-5 w-[520px] h-65 rounded relative bg-gradient-to-br from-[#92c3f7] to-[#96deff] select-none' >
                                                        {/* <div className='bg-gradient-to-br from-[#c8e7f5] to-[#10a7e2]'> */}
                                                            <img src={cam?.main_image_url ? `http://localhost:2020${cam?.main_image_url}`: hero} alt="" className='w-60 h-full object-contain rounded '/>
                                                        {/* </div> */}
                                                        <div className='flex'>
                                                            <div className='flex flex-col justify-center p-5 text-[16px]'>
                                                                <span className='text-4xl font-semibold'>{cam?.name}</span>
                                                                <span >{cam?.brand}</span>
                                                                <span className="text-green-500">{cam?.status}</span>
                                                                <span>Price based on Rental Period: ₱ {count_PricePerRentalRate * cam?.price_per_day }</span>
                                                                <span>Origin Price/day: ₱ {cam?.price_per_day}</span>
                                                                <Link to={isLoggedIn ? `/Camera/${cam?._id}` : ''} className="absolute underline text-blue-600 right-2 bottom-2 cursor-pointer hover:text-blue-400  w-7 h-7 flex items-center justify-center bg-white hover:scale-[1.1] transition-all transform duration-300 rounded-full"
                                                                    onClick={() => check_LoggedIn_Status()}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                                    </svg>
                                                                </Link>
                                                                {/* <button className='p-3 rounded bg-red-500 text-white text-[15px] cursor-pointer mt-2'>Add to Reservation</button> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </>
                                    )}
                            </div>
                            
                        </div>
                    </div>
                </section>
        </>
    );
}