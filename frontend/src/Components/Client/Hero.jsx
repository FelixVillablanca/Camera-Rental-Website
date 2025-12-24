
import hero from "../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png"
import hero2 from "../../assets/ChatGPT Image Nov 19, 2025, 12_49_12 AM.png"

import { useState, useEffect } from "react";

export default function Hero() {
    const fullText = "Capture moments. Rent the gear. Own the story.";
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < fullText.length) {
        const timeout = setTimeout(() => {
            setDisplayedText((prev) => prev + fullText[index]);
            setIndex(index + 1);
        }, 50); // typing speed in ms
        return () => clearTimeout(timeout);
        }
    }, [index]);

    return(
        <>
            <div className='flex flex-col justify-center text-center p-0 select-none' id="">
                <span className='font-semibold text-[50px] title'>
                    Lily's Digital Camera Rentals
                </span>
                <span className='w-190 text-[30px] sub-title'>
                    {displayedText}
                    {/* <span className='animate-pulse'>|</span> */}
                </span>
                    {/* is your go-to destination for high-quality camera gear at affordable rental rates. Whether you're a professional photographer, a content creator, or someone capturing a special moment, we make premium equipment accessible without the hefty price tag. */}
            </div>
            <div className='relative flex items-center '>
                <img src={hero} alt="" className='w-180 main-hero-image'/>
                {/* <img src={hero2} alt="" className='absolute right-[-10px] w-110 sub-hero-image'/> */}
            </div>        
        </>
    );
}