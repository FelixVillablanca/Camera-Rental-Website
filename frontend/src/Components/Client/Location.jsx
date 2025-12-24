
import '../../Styling/style.css'

export default function Location() {
    return(
        <>
            <div className="max-w-[95%] mx-auto  rounded-lg shadow-md p-6 bg-gray-50 select-none">
                <h2 className="text-5xl md:text-5xl font-semibold text-gray-800 mb-4">
                    For Walk-In Customers
                </h2>
                <p className="text-3xl text-gray-600 mb-6">
                    We are located at the heart of Palo — easy to find, and ready to serve you in person.
                </p>
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1">
                    <h3 className="text-4xl font-medium text-gray-700 mb-2">Visit Us At:</h3>
                    <p className="text-2xl text-gray-600">
                        corner San Salvador St, Militante St, Palo, 6501 Leyte
                    </p>
                </div>
                    <div className="flex-1 w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-lg shadow-lg">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.1682348674555!2d124.9871539837759!3d11.16156657368366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x330877d4dca5068f%3A0x5af05f75adf4763b!2sZaki%20Piso%20Machine%20Manufacturing!5e1!3m2!1sen!2sph!4v1763482489071!5m2!1sen!2sph" 
                            className='w-full'
                            height="450" 
                            style={{ border: 0}} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </>
    );
}