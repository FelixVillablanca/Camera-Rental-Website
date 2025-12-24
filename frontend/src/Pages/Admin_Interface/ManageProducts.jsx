
import '../../Styling/style.css'
import { useState, useEffect } from 'react';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import cameraSample from '../../assets/ChatGPT Image Nov 18, 2025, 07_09_58 PM.png'
// import { options } from '../../../../backend/Routes/RouterAdmin';

// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"

export default function ManageProducts() {

    const [ successMessage, setSuccessMessage ] = useState('');
    const [ Categories, setCategories ] = useState(null)
    useEffect(() => {
        const func_get_all_Categories = async() => {
            const result = await fetch('/api/Admin/Get_Categories', {
                method : 'GET'
            })

            const response = await result.json();

            if (!response.success) return console.log(response.message)
            setCategories(response.categories);
        }
        func_get_all_Categories();
    },[successMessage])

    
    const [ selectedCategory, setSelectedCategory ] = useState('')
    const [ brand, setBrand ] = useState('')
    
    // useEffect(() => {
    //     if (Categories) {
    //         console.log('Categories: ', Categories)
    //     }
    //     if (selectedCategory) {
    //         console.log('selectedCategory: ', selectedCategory)
    //     }
    // },[Categories, selectedCategory])

    
    const [ files, setFiles ] = useState([]);
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            files.forEach(file => URL.revokeObjectURL(file.preview))

            setFiles(acceptedFiles.map(file => 
                Object.assign(file, { preview : URL.createObjectURL(file)})
            ))

        }
        // Do something with the files
    }, [files])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    useEffect(() => {
        if (files) {
            console.log('files: ', files)
        }
    },[files])

    const func_removePreview = (url) => {
        setFiles(files.filter(file => file.preview !== url))
    }

    const [ mainPreview, setMainPreview ] = useState(null);
    const handleFile = (e) => {
        const filePrimary = e.target.files[0]; 
        if (filePrimary) {
            const url = URL.createObjectURL(filePrimary);
            console.log('Url: ', url)
            setMainPreview(url)
        }
    } 
    
    const [ isMainPreview, setIsMainPreview ] = useState('')
    
    
    const func_seePreview = (url) => {
        setIsMainPreview(url)
    }
    
    const filtered = (name) => {
        const named = name;
        const max_letter = 15

        return named.trim().length > max_letter ? `${named.slice(0, max_letter)}...'` : named
        
    }
    const handleLetters_product = (name) => {
        const named = name;
        const maxLetter = 6

        return named.trim().length > maxLetter ? `${named.slice(0, maxLetter)}...` : named
    }
    
    const [ OpenSecondaryImage, setOpenSecondaryImage] = useState(false)
    const [ TogglePrimary_image_preview, setTogglePrimary_image_preview ] = useState(false)

    const func_add_product = async(e) => {
        e.preventDefault();

        const product_name = e.target.item_name.value;
        const model = e.target.model.value;
        const location = e.target.location.value;
        const description = e.target.description.value;
        const pricePerDay = e.target.pricePerDay.value;
        const radio_status = e.target.radio_1_status.value;
        const category = e.target.category.value;
        const brand = e.target.brand.value;
        
        const primaryImage = e.target.primaryImage.files[0];

        // console.log('file: ', PrimaryImage)

        const formdata = new FormData();
        formdata.append('name', product_name)
        formdata.append('category', category)
        formdata.append('brand', brand)
        formdata.append('model', model)
        formdata.append('location', location)
        formdata.append('description', description)
        formdata.append('pricePerDay', pricePerDay)
        formdata.append('status', radio_status)

        formdata.append('primaryImage', primaryImage)
        files.forEach(file => formdata.append('sub_images', file))

        const result = await fetch('/api/Admin/create_product', {
            method : "POST",
            body : formdata
        }) //continue

        const response = await result.json();
        if (!response.success) return alert(response.message)
        alert(response.message) 
        setSuccessMessage(response.message)

    }

    const [ Products, setProducts ] = useState(null)
    useEffect(() => {
        const Products = async () => {
            const result = await fetch('/api/Admin/getProducts', {
                method: 'GET'
            })
            const response = await result.json();
            if (!response.success) return console.log(response.message)
                setProducts(response.products)
                setSuccessMessage(response.message)

        }
        Products();
    }, [successMessage])

    //Field requests to body/params
    const [ hookId, setHookId ] = useState('')
    const [ Edit ,set_Edit ] = useState('')

    //Message, the text inside input
    const [ ListenerEdit_Model, setListenerEdit_Model ] = useState('') 
    const [ ListenerEdit_Price, setListenerEdit_Price ] = useState('')
    const [ ListenerEdit_Location, setListenerEdit_Location ] = useState('')

    //identifier on where the changes for conditioning 
    const [ changesOn, setChangesOn ] = useState('')

    const getChangeEditandId = (on, id) => {
        if (Edit === on) {
            set_Edit('')
            setHookId('')
        } else {
            set_Edit(on)
            setHookId(id)
            // console.log('id: ', id)
        }
    }


    //Listener for conditioning
    useEffect(() => {
        if (ListenerEdit_Model.length > 0) {
            setChangesOn('model')
        }
        
        if (ListenerEdit_Price.length > 0) {
            setChangesOn('PricePerDay')
        }
        if (ListenerEdit_Location.length > 0) {
            setChangesOn('location')
        }
    },[ListenerEdit_Model, ListenerEdit_Price, ListenerEdit_Location])

    const func_ProductEdit = async () => {
        
        let editOn_Path;
        let request;

        if (changesOn === 'model') {
            editOn_Path = 'edit_Model';
            request = ListenerEdit_Model;
        }
        if (changesOn === 'PricePerDay') {
            editOn_Path = 'edit_PricePerDay';
            request = ListenerEdit_Price;
        }
        if (changesOn === 'location') {
            editOn_Path = 'edit_Location';
            request = ListenerEdit_Location;
        }

        const result = await fetch(`/api/Admin/${editOn_Path}/${hookId}`, {
            method : 'PUT',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ requestText: request})
        })

        const response = await result.json();
        if (!response.success) return alert(response.message)

        alert(response.message)
        setSuccessMessage(response.message)
        if (changesOn.includes('model') || changesOn.includes('PricePerDay') || changesOn.includes('location')) {
            setListenerEdit_Model('')
            setChangesOn('')
            set_Edit('')
        }
        //continue
    }

    //Edit on Description field
    const [ SeeDescription, setSeeDescription ] = useState('')
    const [ AnimationInOut, setAnimationInOut ] = useState(false)
    const [ description_ID, setDescription_ID ] = useState('')
    const openDescription = (text, id) => {
        if (SeeDescription === text) {
            setSeeDescription('')
            setDescription_ID('')
            setTimeout(() => {
                setAnimationInOut(prev => !prev)
            }, 1);
        }
        setSeeDescription(text)
        setDescription_ID(id)
        setTimeout(() => {
            setAnimationInOut(prev => !prev)
        }, 1);
    }

    const [ EditDescription , setEditDescription ] = useState(false)
    const UpdateOnEdit = async(e) => {
        e.preventDefault();

        const newText = e.target.edit_description.value;
        if (newText.trim().length <= 0) return alert('You should add description.')
        // console.log('newText: ', newText)

        const result = await fetch(`/api/Admin/edit_Description/${description_ID}`, {
            method: 'PUT',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({ Request_newText : newText })
        })

        const response = await result.json();

        if (!response.success) return alert(response.message)
        alert(response.message)
        setSuccessMessage(response.message)
        setEditDescription(prev => prev = false)
        setSeeDescription('')
        setAnimationInOut(prev => prev = false)
    }

    const [ ChangeOn_Status , setChangeOn_Status ] = useState('')
    const [ on_id, setOn_Id ] = useState('')
    const func_toggleSelection_Status = (current, id) => {
        if (ChangeOn_Status === current) {
            setChangeOn_Status('')
            setOn_Id('')
            setTimeout(() => {
                setAnimationInOut(prev != prev)
            }, 300);
            setSelectedStatus('')
        } else {
            setChangeOn_Status(current)
            setOn_Id(id)
            setTimeout(() => {
                setAnimationInOut(prev != prev)
            }, 300);
        }
    }

    const [  SelectedStatus, setSelectedStatus ] = useState('')

    const continueSetStatus = async () => {
        const result = await fetch(`/api/Admin/edit_Status/${SelectedStatus}/${on_id}`, {
            method : 'PUT'
        })

        const response = await result.json();

        if (!response.success) return alert(response.message);

        setSuccessMessage(response.message)
        setChangeOn_Status('')
        setOn_Id('')
        setSelectedStatus('')
    }

    // other edits :
    const [ OtherEdits, setOtherEdits ] = useState('');

    const func_otherEdits_toggle = (on, id) => {
        if (OtherEdits === on) {
            setOtherEdits('')
            setTimeout(() => {
                setAnimationInOut(false)
            }, 300);
        } else {
            setOtherEdits(on)
            setTimeout(() => {
                setAnimationInOut(false)
            }, 300);
        }
    }

    //Category
    const [ ShowCategory, setShowCategory ] = useState(false)
    const [ index, setIndex ] = useState(0)
    const [ id, setId ] = useState('')
    const [ on_Category, setOnCategory ] = useState('')
    const [ onSub_Category, setOnSubCategory ] = useState('')
    const func_Category = ( index, onCatgeory, onSubCategory, id ) => {
        if (ShowCategory === true) {
            setShowCategory(false)
            setTimeout(() => {
                setAnimationInOut(true)
            }, 300);
            setId('')
            setIndex('')
            setOnCategory('')
            setOnSubCategory('')
        } else {
            setShowCategory(true)
            setId(id)
            setIndex(index)
            setOnCategory(onCatgeory)
            setOnSubCategory(onSubCategory)
            setTimeout(() => {
                setAnimationInOut(false)
            }, 300);
        }
        
    }

    const handle_statusChanges = async() => {
        const result = await fetch(`/api/Admin/edit_CatgeoryAndSubCategory/${id}`,{
            method : 'PUT',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({ request_category: on_Category, request_Subcategory: onSub_Category})
        })

        const response = await result.json();

        if (!response.success) return alert(response.message)

        setSuccessMessage(response.message);
        setShowCategory(false)
        setId('')
        setIndex('')
        setOnCategory('')
        setOnSubCategory('')


    }

    const [ Prompt, setPrompt ] = useState(false)
    const [ deleteOn, setDeleteOn ] = useState('')
    const [ mainImage, setMainImage ] = useState('')
    const [ subImages, setSubImages ] = useState(null)
    const func_prompt = (productname, id, main_url_image, sub_images_url) => {
        if (Prompt == true) {
            setPrompt(false)
            setDeleteOn('')
            setId('')
        } else {
            setPrompt(true)
            setDeleteOn(productname)
            setId(id)
            setMainImage(main_url_image)
            setSubImages(sub_images_url)
        }
    }

    const func_deleteProduct = async() => {
        const result = await fetch(`/api/Admin/delete_camera/${id}`, {
            method : 'delete',
            headers : { 'Content-Type': 'application/json' },
            body: JSON.stringify({ primaryImage: mainImage, secondaryImage: subImages})
        })

        const response = await result.json();
        if (!response.message) return alert(response.message)
        setSuccessMessage(response.message)
        setPrompt(false)
        setDeleteOn('')
        setId('')
    }

    // ===========================================> Inclusion
    const [ productToInclusion, setProductToInclusion ] = useState(null)
    useEffect(() => { 
        const func_getProducInclusion = async() => { //purpose: getting the specific product with populated the field inclusion
            const result = await fetch(`/api/Admin/GetProductInclusion/${id}`, {
                method: 'GET',
            })

            const response = await result.json();

            if (!response.success) return alert(response.message);
            setProductToInclusion(response.product)
            
        }
        func_getProducInclusion();

    },[id, successMessage])

    const [ proceed_InclusionGUI, setProceed_InclusionGUI ] = useState(false)
    const func_Inclusion = (id) => {
        if (proceed_InclusionGUI === true) {
            setProceed_InclusionGUI(false)
            setId('')
        } else {
            setProceed_InclusionGUI(true)
            setId(id)
        }
    }

    const [ ItemImage, setItemImage ] = useState(null)
    const handleFile_Inclusion = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const url = URL.createObjectURL(file);
            setItemImage(url);
        }
    }
    
    const [ InclusionImage_Preview, setInclusionImage_Preview] = useState(false)
    useEffect(() => {
        if (proceed_InclusionGUI === false) {
            setItemImage(null)
        }
    },[proceed_InclusionGUI])

    const func_Add_Inclusion = async(e) => {
        e.preventDefault();

        const item = e.target.item_name.value;
        const image = e.target.image_item.files[0];
        const formdata = new FormData();
        formdata.append('name', item)
        formdata.append('image', image)

        const result = await fetch(`/api/Admin/Create_InclusionOn/${id}`, {
            method: 'POST',
            body: formdata
        })

        const response = await result.json();

        if (!response.success) return alert(response.message)
        e.target.reset();
        setItemImage(null) 
        alert(response.message)
    }

    const [ SeeInclusion, setSeeInclusion ] = useState(false)
    const func_See_Inclusion = (id) => {
        if (SeeInclusion === true) {
            setSeeInclusion(false)
            setId('')
            FirstImage_ToShowINCLUSION('')
        } else {
            setSeeInclusion(true)
            setId(id)
        }
    }

    const [ FirstImage_ToShowINCLUSION, setFirstImage_ToShowINCLUSION ] = useState('')
    useEffect(() => {
        setFirstImage_ToShowINCLUSION(
            productToInclusion?.inclusion?.length === 0
            ? ''
            : `http://localhost:2020${productToInclusion?.inclusion?.[0].image}`
        )
    },[productToInclusion])

    const [ listenerNameURL, setListenerNameURL ] = useState('');
    const func_getImageActive = async (url_Image, index) => {
        setFirstImage_ToShowINCLUSION(url_Image)
        setIndex(index)

        const url_CurrentImage = productToInclusion?.inclusion?.[index].image;
        const inclusionID = productToInclusion?.inclusion?.[index]._id;
        setListenerNameURL(url_CurrentImage)
        // console.log('index: ', index) 
        // console.log('OriginalURL: ', url_CurrentImage) 
        console.log('clicked listenerNameURL: ', listenerNameURL) 
        console.log('clicked inclusionID: ', inclusionID) 
    }
    
        const deleteInclusion = async() => {
            const inclusionID = productToInclusion?.inclusion?.[index]._id;
            // console.log('to be deleted listenerNameURL: ', listenerNameURL) 
            // console.log('to be deleted inclusionID: ', inclusionID) 
            
            const result = await fetch(`/api/Admin/delete_inclusion_Image/${inclusionID}`, {
                method : 'DELETE',
                headers : { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ listenerNameURL: listenerNameURL, index: index})
            })
    
            const response = await result.json();
    
            if (!response.success) return alert(response.message);
    
            alert(response.message);
            setSuccessMessage(response.message);
    
        }

    useEffect(() => {
        if (productToInclusion) {
            // console.log('id: ', id)
            console.log('productToInclusion: ', productToInclusion)
            // console.log('FirstImage_ToShowINCLUSION: ', FirstImage_ToShowINCLUSION)
        }
        }, [productToInclusion, id, FirstImage_ToShowINCLUSION]
    )

    return(
        <>
        
            <section className='flex flex-col w-full p-10 gap-5 select-none'>
                <div className='text-2xl p-5 border-b  w-full mb-5'>
                    <label >Manage Products</label>
                </div>
                <div className='w-full relative border border-black/20 p-5 rounded'>
                    <form className='w-full flex' onSubmit={func_add_product}>
                        <div className='rounded p-5 w-[50%] h-fit'>
                                <div className='mb-5'>
                                    <button className='flex gap-2 border-2 border-blue-500 bg-blue-600/10 w-fit p-5 rounded-4xl cursor-pointer'
                                        type='submit'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                            className="size-6 text-blue-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span>
                                            Add Camera
                                        </span>
                                    </button>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Item name :</span> 
                                        <div className='w-full'>
                                            <input 
                                                type="text" 
                                                name='item_name'
                                                className='border rounded p-1 pl-2 focus:outline-blue-500 '
                                                required
                                            />
                                        </div>
                                    </label>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Model :</span> 
                                        <div className='w-full'>
                                            <input 
                                                type="text"
                                                name='model'
                                                className='border rounded p-1 pl-2 focus:outline-blue-500' 
                                                required
                                            />
                                        </div>
                                    </label>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Location :</span> 
                                        <div className='w-full'>
                                            <input 
                                                type="text" 
                                                name='location'
                                                className='border rounded p-1 pl-2 focus:outline-blue-500' 
                                                required
                                            />
                                        </div>
                                    </label>
                                    {/* <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Price/day :</span>
                                        <div className='w-full'>
                                            <input 
                                                type="text" 
                                                className='border rounded p-1 pl-2 focus:outline-blue-500' 
                                            />
                                        </div>
                                    </label> */}
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Price/day :</span>
                                        <div className='w-full flex gap-2 items-center'>
                                            <span>₱ :</span> 
                                            <input 
                                                type="number"
                                                name='pricePerDay' 
                                                className='border rounded p-1 pl-2 w-30 focus:outline-blue-500' 
                                                required
                                            />
                                        </div>
                                    </label>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Status :</span> 
                                        <div className='w-full flex flex-col gap-1'>
                                            <div className='flex gap-2'>
                                                <input type="radio" name="radio_1_status"  value="Available" className="radio border" defaultChecked />
                                                <span>Available</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <input type="radio" name="radio_1_status" value="Unavailable" className="radio border" />
                                                <span>Unavailable</span>
                                            </div>
                                        </div>
                                    </label>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>category: </span>
                                        <div className='w-full'>
                                            <select name="category" className='border rounded p-2 w-full '
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                required
                                            >
                                                <option value="" selected> Select category</option>
                                                {Categories?.length > 0 ? Categories?.map(cat => (
                                                    <>
                                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                    </>
                                                )) : (
                                                    <option value=""> No Available Category </option>
                                                )}
                                            </select>
                                        </div>
                                    </label>
                                    <label className='flex gap-5 w-full items-center relative p-2'>
                                        <span className='w-50'>Brand: </span>
                                        <div className='w-full'>
                                            <select name="brand" className='border rounded p-2 w-full'
                                                required
                                            >
                                                <option value={brand} selected onChange={(e) => setBrand(e.target.value)}>Select brand</option>
                                                {Categories?.length > 0  && (() => {
                                                        const selectedCat = Categories.find(cat => cat.name === selectedCategory);
                                                        if (!selectedCat) return null;

                                                        return selectedCat.subcategories.length > 0 ? (
                                                            selectedCat.subcategories.map((subcat, index) => (
                                                                <option value={subcat}>{subcat}</option>
                                                            ))
                                                        ) : (
                                                            <option value="">No available sub category</option>
                                                        )

                                                    })()
                                                }
                                            </select>
                                        </div>
                                    </label>
                                    <label className='flex flex-col gap-1 w-full relative p-2'>
                                        <span>description</span> 
                                        <textarea 
                                            name="description" 
                                            className='border w-full border-black/20 rounded p-2 focus:outline-blue-500 h-35 resize-none'
                                            placeholder='Add description'
                                            required
                                        ></textarea>
                                    </label>

                                </div>

                        </div>
                        <div className='w-[50%]  p-2'>
                                <div className='flex flex-col p-5 gap-2 items-center text-2xl'>
                                    <span>Upload Primary Image</span>
                                    <div className='flex items-center gap-1 transition-all duration-300'>
                                        <input type="file" name="primaryImage" className="file-input file-input-sm border" 
                                            onChange={handleFile}
                                        />
                                        {mainPreview && (
                                            <span onClick={() => func_seePreview(mainPreview)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                    className="size-6 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>                                    
                                </div>
                                <div className='p-5'>
                                    <div {...getRootProps()} 
                                        className='border-2 border-dashed border-blue-500 w-full h-60 items-center flex justify-center'
                                    >
                                        <input {...getInputProps()} />
                                        {
                                            isDragActive ? (
                                                <>
                                                    <div className='flex flex-col items-center'>
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15 text-blue-500">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                                            </svg>
                                                        </span>
                                                        <p>Drop the files here ...</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>  
                                                <div className='flex flex-col items-center'>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15 ">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                                        </svg>
                                                    </span>
                                                    <p>Drag 'n' drop some Secondary files here, or click to select files</p>
                                                </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={` ${files.length > 0 ? 'h-81 p-5 border border-black/20 opacity-100':'h-0 p-0 border-none opacity-0'} transition-all duration-300  w-full rounded bg-gray-300/20 overflow-auto`}>
                                    <ol className='flex flex-col gap-2'>
                                        {files?.length > 0 && files.map((file,index) => (
                                            <li className='flex gap-2 border-2 border-black-500/50 p-1 pl-10 rounded w-full relative bg-white odd:bg-black/10'>
                                                <span>{index + 1}.</span>
                                                <span>{file.name}</span>
                                                <span className='flex absolute right-5 gap-1'>
                                                    <span onClick={() => func_seePreview(file.preview)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                        </svg>
                                                    </span>
                                                    <span onClick={() => func_removePreview(file.preview)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 text-red-500 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                    </span>
                                                </span>

                                            </li>
                                        ))}
                                    </ol>
                                </div>
                        </div>
                    </form>
                </div>
                <div className='w-full p-5 border rounded relative '>
                    <div className='mb-10 border-b p-5 '>
                        <span className='text-3xl '>Cameras</span>
                    </div>
                    <div className='absolute w-full top-0 left-0'>
                        <div className={`flex ${ListenerEdit_Model.trim().length > 0 && Edit || ListenerEdit_Price.trim().length > 0 && Edit || ListenerEdit_Location.trim().length > 0 && Edit? 'translate-y-0 rotate-x-0 opacity-100 ':'-translate-y-1  rotate-x-40 opacity-0'} transition-all duration-300 border rounded gap-2 items-center justify-center bg-[#faf6f6] border-black/20 p-1 w-full sticky top-0 left-0 `}>
                            <span>Save Changes?</span>
                            <button 
                                className='border rounded-[5px] p-1 bg-blue-600 text-white border-green-900/20 hover:bg-blue-700 cursor-pointer'
                                onClick={func_ProductEdit}
                            >Save</button>
                            <button 
                                className='border rounded-[5px] p-1 cursor-pointer bg-white'
                            >Cancel</button>
                        </div>
                    </div>
                    <div className='max-h-300 overflow-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Description</th>
                                    <th className='w-20 '>Price Per day</th>
                                    <th>Status</th>
                                    <th>Category</th>
                                    <th>Sub-Category</th>
                                    <th>Location</th>
                                    {/* <th>Inclusion</th> */}
                                </tr>
                            </thead>
                            <tbody className=''>
                                {Array.isArray(Products) && Products.length > 0 ? (
                                    <>
                                    {Products.map((product, index) => (
                                        <tr className='border-b ' key={index} >
                                            <td className='flex justify-center'>
                                                <div className='flex items-center justify-center w-50'>
                                                    <div className='p-2'>
                                                        <img src={`http://localhost:2020${product.main_image_url}`} alt="" className='w-15 h-15 object-contain'/>
                                                    </div>
                                                    <div className='w-20'>
                                                        <span>{product.name}</span>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <span>{product.sub_category}</span>    
                                            </td>
                                            <td className='text-center'>
                                                <div className='flex items-center justify-center gap-1 w-30'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                                className="size-6 hover:text-blue-500 cursor-pointer" onClick={() => getChangeEditandId(`model-${index + 1}`, product._id)}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                        {Edit === `model-${index + 1}` ? (
                                                            <>
                                                                <input type="text" className=' border-black/20 w-15 rounded border'
                                                                    value={ListenerEdit_Model}
                                                                    onChange={(e) => setListenerEdit_Model(e.target.value)}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className='w-15'>
                                                                    <span>{handleLetters_product(product.model)}</span>    
                                                                </div>
                                                            </>
                                                        )}
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <div className='flex items-center justify-center'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                    className="size-6 cursor-pointer hover:text-blue-500" onClick={() => openDescription(product.description, product._id)}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                    </svg>
                                                    {/* description */}
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <div className='flex items-center justify-center gap-1 w-20'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 hover:text-blue-500 cursor-pointer" onClick={() => getChangeEditandId(`price-${index + 1}`, product._id)}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                    {Edit === `price-${index + 1}` ? (
                                                        <>
                                                            <input type="number" className='border-black/20 w-15 rounded border'
                                                                value={ListenerEdit_Price} onChange={(e) => setListenerEdit_Price(e.target.value)} 
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>{product.price_per_day}</span>    
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='text-center relative'>
                                                <div className='flex items-center w-40 p-3 rounded relative'>
                                                    <div className='w-8 '>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                        className="size-6 hover:text-blue-500 cursor-pointer" onClick={() => func_toggleSelection_Status(`edit-status-${index + 1}`, product._id)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                                        </svg>
                                                    </div>
                                                    <div className='w-fit'>
                                                        <span className={`border p-2 rounded-4xl ${product.status === 'Available' ? 'bg-green-500/20 border-green-600 text-green-700':'bg-orange-500/20 border-orange-600 text-orange-700'}`}>
                                                            {product.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <span>{product.category}</span>    
                                            </td>
                                            <td className='text-center'>
                                                <span>{product.sub_category}</span>    
                                            </td>
                                            <td className='text-center'>
                                                <div className='flex items-center justify-center gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 hover:text-blue-500 cursor-pointer" onClick={(() => getChangeEditandId(`location-${index + 1}`, product._id))}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                    {Edit === `location-${index + 1}` ? (
                                                        <>
                                                            <input type="text"  className='border-black/20 w-15 rounded border'
                                                                value={ListenerEdit_Location} onChange={(e) => setListenerEdit_Location(e.target.value)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className='w-25'>
                                                                <span>{product.location}</span>    
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                <div className='relative w-full'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 cursor-pointer hover:text-blue-500 " onClick={() => func_otherEdits_toggle(`other-${index + 1}`, product._id)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                        </svg>
                                                        {/* : */}
                                                        {/* {OtherEdits === `other-${index + 1}` && ( */}
                                                            <div className={`border border-black/20 absolute -left-44 shadow-2xl ${OtherEdits === `other-${index + 1}` ? '-top-30 opacity-100 h-fit p-5':'-top-20 opacity-0 h-0 p-0'} overflow-hidden transition-all duration-300  bg-white w-45 flex flex-col rounded`}>
                                                                <div className='flex flex-col items-start '>
                                                                    {/* <span className='hover:text-blue-500 hover:scale-[1.05] transition-all duration-300 cursor-pointer flex gap-2'
                                                                        onClick={() => func_ShowImages(index, 'Images', product.name)}
                                                                    >
                                                                        Images 
                                                                    </span> */}
                                                                    <span className='hover:text-blue-500 hover:scale-[1.04] transition-all duration-300 cursor-pointer'
                                                                        onClick={() => func_Category(index, product.category, product.sub_category, product._id)}
                                                                    >
                                                                        Category 
                                                                    </span>
                                                                    <span className='hover:text-blue-500 hover:scale-[1.04] transition-all duration-300 cursor-pointer'
                                                                        onClick={() => func_Inclusion(product._id)}
                                                                    >
                                                                        Add Inclusion 
                                                                    </span>
                                                                    <span className='hover:text-blue-500 hover:scale-[1.04] transition-all duration-300 cursor-pointer'
                                                                        onClick={() => func_See_Inclusion(product._id)}
                                                                    >
                                                                        See Inclusion {/* Continue */}
                                                                    </span>
                                                                    <span className='hover:text-red-500 hover:scale-[1.1] transition-all duration-300 cursor-pointer flex gap-2'
                                                                        onClick={() => func_prompt(product.name, product._id, product.main_image_url, product.sub_images_url)}
                                                                    >
                                                                        Trash
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        {/* )} */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </>
                                ) : (
                                    <>
                                        <tr>
                                            <div>
                                                No data
                                            </div>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Show products */}
                </div>
                
                {/* <div className={`w-full relative border border-black/20 p-5 rounded`}>
                    <div className='w-full flex justify-center absolute'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className="size-6 cursor-pointer" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div> */}


            </section>

            {/* Manage Products prompt poppups */}
            {isMainPreview.length > 0 && (
                <section className=' fixed z-999 w-full h-screen top-0 bg-black/30 flex items-center justify-center'>
                    <div className={`flex ${isMainPreview.length > 0 ? 'w-[70%] h-[80%]':'w-0 h-0'} transition-all duration-300 relative bg-black/70  rounded`}>
                        <div className='w-[70%] h-full relative backdrop-blur-2xl border-2 border-black/70 rounded'>
                            <img src={isMainPreview} alt="" className='w-full h-full object-contain'/>
                            {/* <Carousel className="w-full h-full relative">
                                <CarouselContent>
                                    {files.map((file, index) => (
                                        <CarouselItem key={index} className="aspect-square h-[750px]" >
                                            <img src={isMainPreview ? isMainPreview : file.preview} alt="" className='w-full h-full object-contain'/>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            <CarouselPrevious className="bg-blue-500 text-white hover:bg-blue-600 rounded-full p-2 shadow-md absolute left-3"/>
                            <CarouselNext className="bg-blue-500 text-white hover:bg-blue-600 rounded-full p-2 shadow-md absolute right-3"/>
                            </Carousel> */}
                        </div>
                        <div className='w-[30%] bg-white relative '>
                            <div className='w-full h-10 p-5'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                className="size-6 cursor-pointer mb-5 absolute right-2 top-2 hover:text-red-500" onClick={() => {setIsMainPreview(''); setOpenSecondaryImage(prev => !prev)}}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div className=''>
                                <span className='cursor-pointer hover:text-blue-500' onClick={() => setTogglePrimary_image_preview(prev => !prev)}>Primary Image</span>
                                <div className={` ${TogglePrimary_image_preview ? 'h-fit p-2':'h-0'} overflow-hidden w-full `}>
                                    {mainPreview?.length > 0 && (
                                        <div className={`${isMainPreview == mainPreview ? 'border-blue-500 bg-blue-500/20':''} cursor-pointer border flex gap-2 p-1 rounded`} onClick={() => func_seePreview(mainPreview)}>
                                            <span className='flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                    className="size-6 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                            </span>
                                            <span>
                                                    {filtered(mainPreview)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className=''>
                                <span className='cursor-pointer hover:text-blue-500' onClick={() => setOpenSecondaryImage(prev => !prev)}>Secondary Images</span>
                                <div className={`${OpenSecondaryImage ? 'h-90':'h-0'} transition-all duration-200 w-full overflow-auto`}>
                                    <div className='p-2'>
                                        <ol className='flex flex-col gap-2 '>
                                            {files.length > 0 && files.map((file, index)=> (
                                                <li 
                                                    key={index}
                                                    className={`${isMainPreview === file.preview ? 'border-blue-500 bg-blue-500/20':''} border p-2 flex gap-2 rounded cursor-pointer`}
                                                    onClick={() => func_seePreview(file.preview)}
                                                > 
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                                            className="size-6 cursor-pointer">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                        </svg>
                                                    </span>
                                                    <span>{filtered(file.name)}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* for description */}
            {SeeDescription.trim().length > 0 && (
                <>
                    <section className='fixed z-999 w-full h-screen top-0 bg-black/50 flex items-center justify-center'>
                            <form className={`${AnimationInOut ? ' opacity-100 translate-y-0 ':'-translate-y-10 opacity-0'} h-120  w-200 transition-all duration-300 flex flex-col bg-white  relative p-5 rounded`}
                                onSubmit={UpdateOnEdit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className="size-6 hover:text-red-500 absolute right-1 top-1 cursor-pointer" 
                                    onClick={() => openDescription('')} >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span className='text-2xl mb-4'>Description</span>
                                <span className={`absolute right-5 ${EditDescription ? 'top-10 opacity-100':'top-11 opacity-0'} text-blue-500 transition-all duration-300 `}>On edit mode</span> 
                                {EditDescription ? (
                                    <textarea 
                                        name="edit_description" 
                                        placeholder='Add description..' 
                                        className='border border-black/20 h-full p-2 rounded mb-2'
                                    ></textarea>
                                ) : (
                                    <textarea 
                                        className='border border-black/20 h-full p-2 rounded mb-2' 
                                        value={SeeDescription} 
                                        disabled
                                    ></textarea>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                    className="size-6 hover:text-blue-500 cursor-pointer" onClick={() => setEditDescription(prev => !prev)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <input 
                                    type="submit" 
                                    value="Save"
                                    className={`${EditDescription ? 'border p-1 mt-2 h-fit':'h-0 p-0 mt-0'} cursor-pointer bg-blue-500 text-white hover:bg-blue-600 overflow-hidden transition-all duration-100 rounded `}/>
                            </form>
                    </section>
                </>
            )}

            {/* for changing status */}
            {ChangeOn_Status && (
                <>
                    <section className='fixed z-999 w-full h-screen top-0 bg-black/50 flex items-center justify-center'>
                        <div className={`${AnimationInOut ? 'translate-y-0':'-translate-y-10'} transition-all duration-300 flex flex-col gap-2 bg-white p-5 w-100 rounded`}>
                            <label className='text-2xl mb-5'>Select status</label>
                            <span className='cursor-pointer border p-3 rounded-4xl text-center bg-green-500/20 border-green-600 text-green-600'
                                onClick={() => setSelectedStatus('Available')}
                            >Available</span>
                            <span className='cursor-pointer border p-3 rounded-4xl text-center bg-orange-500/20 text-orange-600 '
                                onClick={() => setSelectedStatus('Unavailable')}
                            >
                                Unavailable
                            </span>
                            {SelectedStatus.trim().length > 0 && (
                                <>
                                    <div className='border-t mt-2 pt-2 flex w-full justify-center items-center flex-col'>
                                        <p>Continue setting up status? to {SelectedStatus === 'Available' ? 'Available':'Unavailable'}?</p>
                                        <div className='flex gap-3 mt-1'>
                                            <button className='border rounded p-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600'
                                                onClick={continueSetStatus}>
                                                    Continue
                                            </button>
                                            <button className='hover:text-red-500 cursor-pointer border border-red-500/30 p-2 rounded bg-red-500/20' onClick={() => func_toggleSelection_Status(ChangeOn_Status, '')}>Cancel</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </>
            )}

            
            {ShowCategory && (
                <>
                    <section className='fixed z-999 w-full h-screen top-0 bg-black/50 flex items-center justify-center'>
                        <div className={` transition-all duration-300 bg-white w-130 flex justify-center flex-col items-center p-10 relative rounded`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                onClick={() => setShowCategory(false)}
                                className="size-6 absolute top-1 right-1 hover:text-red-500 cursor-pointer"
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div className='flex justify-center mt-5'>
                                <label className='text-[20px]'>Set Categories and Sub-categories</label>
                            </div>
                            <div className=' flex gap-5 p-5 items-center'>

                                <select name="" id="" defaultValue={on_Category} className='border p-3 border-black/20 rounded'
                                    onChange={(e) => setOnCategory(e.target.value)}
                                >
                                        {Categories?.length ? Categories.map(cat => (
                                            <>
                                                {cat.isVisible === true && (
                                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                )}
                                            </>
                                        )) : (
                                            <>
                                                <option value="">No Categories</option>
                                            </>
                                        )}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                                <select name="" id="" defaultValue={onSub_Category} className='border p-3 border-black/20 rounded'
                                    onChange={(e) => setOnSubCategory(e.target.value)}
                                >
                                    {Categories?.length > 0 ? Categories.map(cat => (
                                        <>
                                            {cat?.name === on_Category && cat?.subcategories.map(subcat => (
                                                <>
                                                    <option value={subcat}>{subcat}</option>
                                                </>
                                            ))}
                                        </>
                                    )) : (
                                        <>
                                            <option value="">No Categories</option>
                                        </>
                                    )} 
                                </select>
                            </div>
                            <input type="button" value="Save Changes" className='border w-full cursor-pointer p-2 rounded border-blue-500 bg-blue-500/20'
                                onClick={handle_statusChanges}
                            />
                        </div>
                    </section>
                </>
            )}

            {/* prompt for deleting a product */}
            {Prompt && (
                <>
                    <section className='fixed z-999 w-full h-screen top-0 bg-black/50 flex items-center justify-center'>
                        <div className='bg-white p-5 rounded'>
                            <p>Are you sure you want to delete this? {deleteOn} </p>
                            <div className='flex gap-2 justify-center p-2'>
                                <button className='border border-blue-500/50 bg-blue-500/20 rounded p-2 cursor-pointer hover:bg-blue-500/30'
                                    onClick={func_deleteProduct}
                                >Continue</button>
                                <button className='border border-red-500/50 bg-red-500/20 rounded p-2 cursor-pointer hover:bg-red-500/30'
                                    onClick={() => func_prompt('')}
                                >Cancel</button>
                            </div>
                        </div>
                    </section>
                </>
            )}


            {/* Inclusion GUI */}
            {proceed_InclusionGUI && (
                <section className='fixed z-999 w-full h-screen top-0 bg-black/50 flex items-center justify-center'>
                    <div className='w-100 h-fit bg-white p-5 relative rounded'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                className="size-6 absolute right-1 top-1 cursor-pointer hover:text-red-500 text-red-500/50"
                                onClick={() => func_Inclusion('')}    
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        <div className='text-center mb-5'>
                            <span className='text-4xl'>Add Inclusion</span>
                        </div>
                        <form className='flex flex-col gap-2' onSubmit={func_Add_Inclusion}>
                            <label>
                                Item name: <input type="text" name='item_name' className='border rounded focus:outline-blue-500' required/>
                            </label>
                            <div className='flex flex-col gap-1 w-fit mb-2'>
                                Upload image 
                                <div className='flex gap-2 items-center'>
                                    <input type="file" className="file-input file-input-sm border" name='image_item' onChange={handleFile_Inclusion}/>
                                    {ItemImage && (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                        className="size-6 cursor-pointer" onClick={() => setInclusionImage_Preview(prev => !prev)}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <input type="submit" value="Add" className='border rounded border-blue-500 bg-blue-500/20 cursor-pointer p-1' />
                        </form>
                        
                    </div>
                </section>
            )}

            {/* Show image item preview */} {/* w-150 h-150 */}
            <section className={`${InclusionImage_Preview ? 'w-full h-screen':'w-0 h-0'} overflow-hidden fixed z-999  top-0 bg-black/50 flex items-center justify-center`}>
                <div className={`${InclusionImage_Preview ? 'w-150 h-150 translate-x-0 translate-y-0':'w-5 h-5 translate-x-40 translate-y-8'} overflow-hidden transition-all duration-500 relative  bg-black/20 backdrop-blur-2xl rounded`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                className="size-6 absolute right-1 top-1 cursor-pointer hover:text-red-500 text-red-500/50"
                                onClick={() => setInclusionImage_Preview(prev => !prev)}    
                            >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                    <img src={ItemImage} alt="" className='w-full h-full object-contain' />
                </div>
            </section>

            <section className={`${SeeInclusion ? 'w-full h-screen':'w-0 h-0'} overflow-hidden fixed z-999  top-0 bg-black/50 flex items-center justify-center`}>
                <div className=' bg-white w-200 h-150 rounded relative '>
                    <div className='p-5 border-b'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className="size-6 absolute right-1 top-1 hover:text-red-500 cursor-pointer" 
                            onClick={() => func_See_Inclusion('')}
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span>Items Included</span>
                    </div>
                    <div className='w-full flex gap-1 h-134 p-2'>
                        {FirstImage_ToShowINCLUSION !== '' ? (
                            <>
                                <div className='w-full bg-black/50 rounded group overflow-hidden'>
                                    <img src={FirstImage_ToShowINCLUSION} alt="" className='w-full h-full object-contain'/>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                                        className="size-7 group-hover:-translate-y-10 group-hover:translate-x-140 cursor-pointer text-white"
                                        onClick={() => deleteInclusion()}    
                                    >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>{/* trashcan icon*/}

                                </div>
                                <div className=' w-60 '>
                                    <div className='border-l p-2 flex flex-col gap-6 overflow-auto h-full'>
                                        {productToInclusion ? (
                                            <> 
                                                {productToInclusion.inclusion.length > 0 ? productToInclusion.inclusion.map((inclusion, index) => (
                                                    <div className='group w-full relative border rounded border-black/20 hover:scale-[1.04] hover:h-40 cursor-pointer transition-all duration-500 overflow-hidden bg-black/50 backdrop-blur-2xl'
                                                        onClick={() => func_getImageActive(`http://localhost:2020${inclusion.image}`, index)}
                                                    >
                                                        <img src={`http://localhost:2020${inclusion.image}`} alt="" className='group-hover:scale-[1.5] transform transition-all duration-300 w-full h-full object-contain aspect-square'/>
                                                        <span className='inline-block absolute transform transition-all duration-200 group-hover:-translate-y-7 group-hover:translate-x-2 opacity-0 group-hover:opacity-100 font-bold text-white'>
                                                            {inclusion.item}
                                                        </span>
                                                    </div>
                                                )) : (
                                                    <>
                                                        <div>
                                                            <span>No Inclusion</span>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className='flex items-center justify-center'>
                                                    No Inclusion
                                                </div>
                                            </>
                                        )}
                                        
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col items-center justify-center w-full'>
                                    <span className='text-3xl text-red-500'>No Items</span>
                                    <span className='text-blue-500'>Add one item to be included</span>
                                </div>
                            </>
                        )}   
                    </div>
                </div>
            </section>
        </>

    );
}