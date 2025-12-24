
import '../../Styling/style.css'
import { useEffect, useState } from 'react';
import React from 'react';
import {  useNavigate, useParams } from 'react-router-dom';

export default function TransactionDetails() {
    const { transaction_ID } = useParams();
    const [ transaction, setTransaction ] = useState(null)
    const navigateTo = useNavigate();

    useEffect(() => {
        const Get_Transaction = async () => {
            const result = await fetch(`/api/Client/Get_Transaction_Of_The_User/${transaction_ID}`, {
                method : 'GET'
            })

            const response = await result.json();
            if (!response.success) alert(response.message)
            setTransaction(response.transactionDetails)

        }
        Get_Transaction()
    },[transaction_ID])

    const formatDate = (date) => {
        const isoDate = date;
        const dateToFormat = new Date(isoDate);

        return dateToFormat.toLocaleDateString('en-US', {
            month : "2-digit",
            day : "2-digit",
            year : "2-digit"
        })
    }

    useEffect(() => { 
        if (transaction) {
            console.log('transaction details: ', transaction)
        }
    },[transaction])
    return(
        <>
            <section className='flex items-center justify-center h-screen select-none'>
                <div className='w-130 fit bg-white shadow border flex flex-col gap-2 p-5'>
                    <div className='flex flex-col border-b'>
                        <label className='text-2xl'>Payment Transaction details</label>
                        <span>#{transaction?.transactionId}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>Transaction was made on {formatDate(transaction?.createdAt)}</span>
                        <span>Payment e-wallet: {transaction?.method}</span>
                        <span>{transaction?.method} #: {transaction?.number}</span>
                        <span>Amount paid: {transaction?.amount}</span>
                        <div className='border flex items-center justify-center h-60 relative'>
                            <img src={transaction?.qrcode} alt="" className='w-full h-full object-contain'/>
                        </div>
                        {transaction?.reservation_id}
                    </div>
                    <span className='text-blue-500 cursor-pointer' onClick={() => navigateTo(-1)}>back to previews page</span>
                </div>

            </section>
        </>
    );
}