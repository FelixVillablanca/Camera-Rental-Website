

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styling/style.css'
// import { tr } from 'date-fns/locale';

export default function ManageCategories () {
    const [ ErrorMessage, setErrorMessage ] = useState('')
    const [ SuccessAdded_Message, setSuccessAdded_Message] = useState('')
    const [ Category_Setup, setCategory_Setup ] = useState('')

    const [Categories, setCategories] = useState(null)
    useEffect(() => {
        const new_categories_added = async(req, res) => {
            const result = await fetch('/api/Admin/Get_Categories', {
                method : 'GET'
            })

            const response = await result.json();

            if (!response.success) return console.log(response.message)
            setCategories(response.categories)
        }
        new_categories_added();
    },[SuccessAdded_Message])

    useEffect(() => {
        if (Categories) [
            console.log('Categories: ', Categories)
        ]
    },[Categories])

    const func_NewCategory = async(event) => {
        event.preventDefault();

        const new_category = event.target.new_category.value;
        if (!new_category) return alert('No inputs')

        const result = await fetch(`/api/Admin/new_category`, {
            method : 'POST',
            headers : { 'Content-Type':'application/json' },
            body : JSON.stringify({ new_category: new_category })
        })
        const response = await result.json();

        if (!response.success) return alert(response.message)
        setSuccessAdded_Message(response.message)
        alert(response.message)
    }

    const func_Added_Subcategory = async(event) => {
        event.preventDefault();

        const new_sub_category = event.target.new_sub_category.value;
        const result = await fetch(`/api/Admin/new_sub_category/${Category_Setup}`, {
            method : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({ added_subcategory : new_sub_category})
        })

        const response = await result.json();

        if (!response.success) return alert(response.message)
        setSuccessAdded_Message(response.message)
        alert(response.message)
    }

    const func_Remove_subCategory = async(event) => {
        event.preventDefault();

        const Remove_sub_category = event.target.Remove_sub_category.value;

        if (!Remove_sub_category) return alert('No inputs!')
        const result = await fetch(`/api/Admin/Remove_sub_category/${Category_Setup}`, {
            method : 'PUT',
            headers : { 'Content-Type':'application/json' },
            body : JSON.stringify({ sub_category : Remove_sub_category })
        })

        const response = await result.json();
        console.log('remove sub category: ', response.message)

        if (!response.success) return alert(response.message)

        setSuccessAdded_Message(response.message)


    }

    const [ EditCategory, setEditCategory ] = useState('')
    const toggleEditCategory = (name) => {
        if (name === EditCategory) {
            setEditCategory('');
        } else {
            setEditCategory(name);
        }

    }
    // console.log('EditCategory: ', EditCategory)

    const [ typedListener, setTypedListener ] = useState('')
    const [ showSubmit, setShowSubmit ] = useState(false);
    useEffect(() => {
        if (typedListener.trim().length > 0) {
            setShowSubmit(true)
        } else {
            setShowSubmit(false)
        }
    },[typedListener])

    const func_edit_categoryName = async(e, id) => {
        e.preventDefault();
        
        const name = e.target.edit_category_name.value;
        console.log('name: ', name)
        
        const result = await fetch(`/api/Admin/change_category_name/${name}/${id}`, {
            method : 'PUT'
        })  
        const response = await result.json();
        if (!response.success) return alert(response.message)
        setSuccessAdded_Message(response.message)
        
        
    }

    return(
        <section className='flex flex-col w-full p-10 select-none'>
            <div className='text-2xl p-5 border-b w-full mb-8'>
                <label >Manage Categories</label>
            </div>
            
            <div className='p-2'>
                <form className='flex gap-2 mb-5' onSubmit={func_NewCategory}>
                    <input 
                        type="text" 
                        placeholder='New category name'
                        name='new_category'
                        className='border border-black/25 p-2 rounded focus:outline-blue-600'
                    />
                    <input 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer "
                    />
                </form>
                <div className='text-3xl mb-5'>Set up categories</div>
                <div className='p-5 w-[70%] h-full overflow-auto border-b border-t'>
                        <table className='w-full'>
                            <thead className='w-full border-b ' >
                                <tr className=''>
                                    <th className=''>Category</th>
                                    <th>Visibility</th>
                                    <th>Sub-Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='h-[80%] w-full  relative '>
                                {Array.isArray(Categories) && Categories.length > 0 ? (
                                    Categories.map((cat, index) => (
                                        <tr className='border-b border-b-black/20 text-center h-15 relative' key={cat._id}> 
                                            <td className='flex gap-5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                    className="size-6 hover:text-blue-600 cursor-pointer" onClick={() => toggleEditCategory(cat.name)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                                {EditCategory == cat.name? (
                                                    <>
                                                        <form className='' onSubmit={(e) => func_edit_categoryName(e, cat._id)}>
                                                            <input type="text" 
                                                                name='edit_category_name'  
                                                                className='focus:outline-blue-500 border-2 rounded pl-1 w-40'
                                                                placeholder={`${cat.name}`}
                                                                value={typedListener}
                                                                onChange={(e) => setTypedListener(e.target.value)}
                                                                autoFocus 
                                                            />
                                                            <div className={`absolute ${showSubmit && EditCategory === cat.name ? 'left-52 w-fit p-1 opacity-100':' right-0 w-0 p-0 opacity-0'} top-3.5 overflow-hidden transition-all duration-300 flex items-center  gap-1 bg-white`}>
                                                                {/* <span className=''>Save changes?</span> */}
                                                                <button className='bg-red-500 text-white rounded cursor-pointer hover:bg-red-600'
                                                                    type='button' onClick={() => toggleEditCategory('')}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                                <button className='bg-green-400 text-white rounded cursor-pointer hover:bg-green-600'
                                                                    type='submit' 
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </>
                                                ) : (
                                                    <>
                                                        {cat.name}
                                                    </>
                                                )}
                                            </td>
                                            <td className=''>
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox border-2 border-black/40" 
                                                    checked={cat.isVisible}
                                                    onChange={async (e) => {
                                                        const new_toggle = e.target.checked;
                                                        await fetch(`/api/Admin/toggle_isVisible/${cat._id}`, {
                                                            method : 'PUT',
                                                            headers : { 'Content-Type':'application/json'},
                                                            body : JSON.stringify({ toggle_isVisible : new_toggle})
                                                        })

                                                        setCategories((prev) => prev.map((c) => c._id === cat._id ?  { ...c, isVisible: new_toggle } : c))
                                                    }} 
                                                    
                                                />
                                            </td>
                                            <td>
                                                {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                                                    <>
                                                        {cat.subcategories.join(', ')}
                                                    </>
                                                ) : (
                                                    <>
                                                        No Sub Categories
                                                    </>
                                                )}
                                            </td>
                                            <td className='flex justify-center items-center h-15 relative'>
                                                <button type='button' className='text-red-500 cursor-pointer'
                                                    onClick={async () => {
                                                        const result = await fetch(`/api/Admin/category_delete/${cat._id}`, {
                                                            method : 'DELETE'
                                                        })
                                                        const response = await result.json();
                                                        if (!response.success) return alert(response.message);
                                                        setSuccessAdded_Message(response.message)

                                                        setCategories((prev) => prev.filter((c) => c._id !== cat._id))
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                                <button type='button' className='cursor-pointer'
                                                    onClick={() => setCategory_Setup(cat.name)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>



                                            </td>
                                        </tr>
                                    )
                                )) : (
                                    <>
                                        <tr>
                                            <td>No Data please, add one!</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>

                    {/* {Category_Setup.trim().length > 0 && } */}
                    <div className={`${Category_Setup.trim().length > 0 ? 'h-fit w-[20%] p-2 right-20':'h-0 w-0 p-0'} transition-all duration-300 overflow-hidden absolute border border-black/50 rounded  top-70  flex flex-col `}>
                        <span className='text-2xl' >{Category_Setup}</span>
                        <span className='w-50 p-2 rounded cursor-pointer hover:bg-blue-300/20 hover:border hover:border-blue-500'>Add sub category</span>
                        <div className='border-t mt-1 p-2'>
                            <form className='flex items-center gap-2' onSubmit={func_Added_Subcategory}>
                                <input 
                                    type="text" 
                                    placeholder='Add new sub category' 
                                    className='border border-black/20 p-2 rounded focus:outline-blue-600'
                                    name='new_sub_category'
                                />
                                <button type='submit' className='cursor-pointer hover:text-blue-600'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                        <span className='w-50 p-2 rounded cursor-pointer hover:bg-red-700/20 hover:border hover:border-red-500'>Remove sub category</span>
                        <div className='border-t mt-1 p-2'>
                            <form className='flex items-center gap-2' onSubmit={func_Remove_subCategory}>
                                <input 
                                    type="text" 
                                    placeholder='Remove sub category' 
                                    className='border border-black/20 p-2 rounded focus:outline-blue-600'
                                    name='Remove_sub_category'
                                />
                                <button type='submit' className='cursor-pointer hover:text-red-600'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>                                 
                </div>
                {/* <div className='flex flex-col gap-2 border'>
                    <label className='text-3xl'>Set up categories</label>
                    <div className='border flex items-center p-2 w-[30%] gap-5'>
                        <span>DSLR</span>
                        <span className='flex gap-2'>
                        <input type="checkbox" defaultChecked className="toggle" />
                            Visible
                        </span>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div> */}

                
            </div>
        </section>
    );
}