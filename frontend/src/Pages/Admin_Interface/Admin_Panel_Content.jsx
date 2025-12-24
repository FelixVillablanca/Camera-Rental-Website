
import '../../Styling/style.css'
import { useEffect, useState } from 'react';

import { FaUsers } from "react-icons/fa";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { TbSitemap } from "react-icons/tb";

import { jwtDecode } from 'jwt-decode';


export default function Admin_Panel_Content () {



    return(
        <section className='flex flex-col w-full p-10 border select-none'>
            <div className='text-2xl p-5 border-b w-full'>
                <label >Admin Panel Content</label>
            </div>
            <div className='w-full h-full bg-red-400 flex items-center justify-center gap-5'>
                <div className='w-50 p-10 rounded flex flex-col border gap-1'>
                    <span className='text-2xl'>Registered</span>
                    <span className='text-xs text-gray-700'>5</span>
                    <FaUsers className='size-6'/>
                </div>
                <div className=' w-50 p-5 rounded flex flex-col border gap-1'>
                    <span className='text-2xl'>Active Reservations</span>
                    <span className='text-xs text-gray-700'>5</span>
                    <TbSitemap />
                </div>
                <div className='w-50 p-5 rounded flex flex-col border'>
                    <span>Registered</span>
                    <span>5</span>
                    <MdOutlineVideoCameraFront />
                </div>
                <div className='w-50 p-5 rounded flex flex-col border'>
                    <span>Registered</span>
                    <span>5</span>
                    <FaUsers />
                </div>

            </div>
        </section>
    );
}