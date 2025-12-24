
require('dotenv').config();
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');

const fs = require('fs')
const path = require('path')

const { 
    Camera_Model,
    Inclusion_Model 
} = require('../../Models/SystemAdministration_Models/DigitalCameras_Model');

const { 
    Category_Model
} = require('../../Models/SystemAdministration_Models/Category_Model');
const { Reservation_Model, Users_Model } = require('../../Models/Client_Models/Users_Model');

const { 
    User_Chat_Model,
    Admin_Chat_Model,
    System_Chat_Model
} = require('../../Models/Chat_Model')

const new_category = asyncHandler(async(req, res) => {
    const { new_category } = req.body;

    const isExisting_Category = await Category_Model.findOne({ name: new_category })
    if (isExisting_Category) return res.status(403).json({ success : false, message : `Category ${new_category} is already existing!`})
    const CategorySchema = await Category_Model.create({
        name : new_category
    })

    await CategorySchema.save();
    res.status(201).json({ success : true, message : `${new_category} has successfully added to categories.`})
    
})


const get_Categories = asyncHandler(async(req, res) => {
    const categories = await    Category_Model.find({}).sort({ createdAt : -1 })
    if (!categories) return res.status(404).json({ success : false, message : 'No Categories yet!'})

    res.status(201).json({ success : true, categories : categories})
})

const add_sub_category = asyncHandler(async(req, res) => {
    const { category } = req.params;
    const { added_subcategory } = req.body;

    const categoryCheck = await Category_Model.findOne({name: category});
    if (categoryCheck.subcategories.includes(added_subcategory)) return res.status(400).json({ success: false, message: `${added_subcategory} is already existing.`})

    if (!categoryCheck) return res.status(404).json({ success: false, message: `${category} don't exist.`})

    const categoryCollection = await Category_Model.findOneAndUpdate(
        { name : category }, 
        { $push : { subcategories : added_subcategory} },
        { new: true}
    );

    if (!categoryCollection) return res.status(404).json({ success: false, message: 'Category not found'})
    
    res.status(201).json({ success: true, message: `sub-category ${added_subcategory} has been added to ${category} category!`})

})

const remove_sub_category = asyncHandler(async(req, res) => {
    const { category } = req.params;
    const { sub_category } = req.body;

    const categoryCollection = await Category_Model.findOneAndUpdate(
        { name : category },
        { $pull : { subcategories : sub_category }},
        { new: true }
    )

    // if (!categoryCollection.subcategories.includes(sub_category)) return res.status(404).json({ success: false, message: `${category} not found`})

    if (!categoryCollection) return res.status(404).json({ success: false, message: `${category} not found`})
    
    res.status(201).json({ success: true, message: `${sub_category} has been successfully deleted!`})


})

const toggleIsVisible = asyncHandler(async(req, res) => {
    const { category_id } = req.params;
    const { toggle_isVisible } = req.body;

    const categoryCollection = await Category_Model.findByIdAndUpdate(
        category_id,
        { isVisible : toggle_isVisible},
        { new : true }
    )

    if (!categoryCollection) return res.status(404).json({ success: false, message : `${category_id} not found`})
    
    res.status(201).json({ success: true, message : 'toggled'})

})

const delete_category = asyncHandler(async(req, res) => {
    const { category_id } = req.params;
    const category_delete = await Category_Model.findByIdAndDelete(category_id)

    if(!category_delete) return res.status(404).json({ success : false, message: `${category_id} not found!`});

    res.status(201).json({ success : true, message : 'Category deleted successfully.'})
})

const change_category_name = asyncHandler(async(req, res) => {
    const { category_name, category_id } = req.params;
    

    const isExisting_inCategory = await Category_Model.findOne({ name: category_name });
    if (isExisting_inCategory) return res.status(401).json({ success: false, message: `${category_name} is already on the category.`})

    const isInSub_Category = await Category_Model.findOne({ subcategories : category_name })
    if (isInSub_Category) return res.status(403).json({ success: false, message: `${category_name} is invalid, as it already exists on the sub-categories.`})

    await Category_Model.findByIdAndUpdate(
        category_id,
        { name : category_name}
    )

    res.status(201).json({ success: true, message: `${category_name} has been applied successfully!`})

})

// ==============> Manage Product

const create_new_product = asyncHandler(async(req, res) => {
    const {
        name,
        category,
        brand,
        model,
        location,
        description,
        pricePerDay,
        status,
        
    } = req.body;

    const PrimaryImage = req.files['primaryImage'] 
        ? `/PrimaryPathDir/${req.files['primaryImage'][0].filename}` 
        : null;


    const SecondaryImages = req.files['sub_images']
        ? req.files['sub_images'].map(file => `/SecondaryPathDir/${file.filename}`)
        : [];

    try {

        const product = await Camera_Model.findOne({ name })
        if (product) return res.status(400).json({ success : false, message : `${name} already exist.`})

        const Product = await Camera_Model.create({
            name: name,
            brand: brand,
            model: model,
            description: description,
            price_per_day: pricePerDay,
            status : status,
            category : category,
            sub_category : brand,
            main_image_url : PrimaryImage,
            sub_images_url : SecondaryImages,
            location : location,
        })
    
        if (!Product) res.status(500).json({ success: false, message: 'Failed to add product, Something went wrong.'})
    
        res.status(201).json({ success: true, message : `New product ${name}, was successfully added.` })
    } catch (error) {
        console.error('backend Error: ', error.message)
    }

})

// =========> get all products

const get_all_Products = asyncHandler(async(req, res) => {
    const products = await Camera_Model.find({}).sort({ createdAt: -1 })
    
    if (!products) return res.status(404).json({ success: false, message : 'No products.'})
        res.status(201).json({ success: true, message : 'products fetched.', products : products})
})

// =========> Edit field product
const editModel = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { requestText } = req.body;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            model : requestText,
        }
    )
    console.log(`id: ${id}, changes: ${requestText}`)

    if (!product) return res.status(404).json({ success: false, message: `${id} not found.`})

    res.status(201).json({ success : true, message: `${requestText} has been set.`})

}) 

const editPrice = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { requestText } = req.body;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            price_per_day : requestText
        }
    )

    if (!product) return res.status(404).json({ success: false, message: `${id} not found.`})
    res.status(201).json({ success : true, message: `${requestText} has been set.`})
})

const editLocation = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { requestText } = req.body;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            location: requestText,
        }
    )

    if(!product) return res.status(404).json({ success: false, message: `${id} not found.`})
    res.status(201).json({ success: true, message: `${requestText} has been set.`})

})

const editDescription = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { Request_newText } = req.body;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            description : Request_newText,
        }
    )

    if (!product) return res.status(404).json({ success: false, message: `${id} not found.`})

    res.status(201).json({ success: true, message : 'newText value has been set.'})
})

const editStatus = asyncHandler(async(req, res) => {
    const { selected, id } = req.params;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            status: selected
        }
    )

    if (!product) return res.status(404).json({ success: false, message: `${id} not found`})
    res.status(201).json({ success: true, message: `${selected} has been set.`})
})

const editOn_Category_And_SubCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { request_category, request_Subcategory } = req.body;

    const product = await Camera_Model.findByIdAndUpdate(
        id,
        {
            category: request_category,
            sub_category: request_Subcategory,
        }
    )
    if (!product) return res.status(404).json({ success: false, message: `${id} not found.`})
    res.status(201).json({ success: true, message: `new category: ${request_category} and new sub-category: ${request_Subcategory} has been set.`})
})

const delete_Camera = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { primaryImage, secondaryImage } = req.body;

    const Camera = await Camera_Model.findById(id).populate('inclusion')
    if (!Camera) return res.status(404).json({ success: false, message: `${id} not found.`})
    
    const pathDirOF_PrimaryImage = path.join(__dirname, '..','..','Products','PrimaryImages', path.basename(primaryImage))
    if (pathDirOF_PrimaryImage) {
        fs.unlink( pathDirOF_PrimaryImage, err => {
            if (err) return console.error(`Failed to delete Primary image: ${pathDirOF_PrimaryImage}`, err) 
        })
        console.log(`Successfully deleted on the directory the primary image: ${pathDirOF_PrimaryImage}`)
    }
    
    if (Array.isArray(secondaryImage)) {
        secondaryImage.forEach(SecondaryImage_Path => {
            const SecondaryImages_PAthDir = path.join(__dirname,'..','..','Products','SecondaryImages', path.basename(SecondaryImage_Path))
            fs.unlink(SecondaryImages_PAthDir, err => {
                if (err) return console.error(`Failed to delete image: ${SecondaryImages_PAthDir}`)
            })
        });
    }
    console.log(`Secondary Images Successfully deleted.`)
    //DELETING all images from related to the item from inclusion
    Camera.inclusion.forEach(inclusion => {
        const imageURl = path.join(__dirname,'..','..','inclusion', path.basename(inclusion.image))
        fs.unlink(imageURl, err => {
            if (err) return console.error(`$Failed to delete ${inclusion.image}.`)
        })
        
    })
    console.log(`inclusion Images Successfully deleted.`)
    await Inclusion_Model.find({ camera_id : Camera._id})
    await Camera.deleteOne()

    res.status(201).json({ success: true, message: `${id} has been delete successfully.`})
})

const createInclusion = asyncHandler(async(req, res) => {
    const { id } = req.params; // id of the product
    const { name } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const imageItem = `/inclusionDir/${req.file.filename}`;

    const inclusionCreated = await Inclusion_Model.create({
        camera_id : id,
        item : name,
        image : imageItem,
    })

    if (!inclusionCreated) return res.status(404).json({ success: false, message: `${name} failed to create.`})
    
    if (inclusionCreated) {
        try {
            const camera = await Camera_Model.findById(id);
            if (camera) {
                camera.inclusion.push(inclusionCreated._id)
                await camera.save();
                res.status(201).json({ success: true, message: `inclusion ${inclusionCreated._id} successfully created and pushed in inclusion field`})
            }
        } catch (error) {
            console.error(`Error on backend: ${error.message}`)
        }
    }

})

const getProduct_Inclusion = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const product = await Camera_Model.findById(id).populate('inclusion');
    if (!product) return res.status(404).json({ success: false, message: `${id} not found.`});

    res.status(201).json({ success: true, message: `${id} found`, product: product})

})

const deleteInclusion_Image = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { listenerNameURL, index } = req.body;

    const inclusionItem = await Inclusion_Model.findById(id);
    // console.log('(backend) image Name URL: ', listenerNameURL)
    // console.log('(backend) id: ', id)

    if (!inclusionItem) return res.status(404).json({ success: false, message: `${listenerNameURL} not found.`})

    try {
        if (inclusionItem) {
            // console.log('backend again inclusionItem: ', inclusionItem)
            const urlImage = path.join(__dirname, '..', '..', 'inclusion', path.basename(listenerNameURL));
        
            fs.unlink(urlImage, err => {
                if (err) return console.log(`Failed to delete ${inclusionItem.image}.`)
            })
            await inclusionItem.deleteOne();
            res.status(201).json({ success: true, message: `${inclusionItem.image} has been deleted.`})
        }
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
    }
    
})

const Get_All_Reservations = asyncHandler(async(req, res) => {
    const reservations = await Reservation_Model.find({}).sort({ createdAt: -1}).populate('Customer_id');
    if (!reservations) return res.status(404).json({ success: false, message: 'No pending reservations.'})

    const Users_On_Reservations = await Promise.all(
        reservations.map(reservation => Users_Model.findById(reservation.Customer_id))
    )
    // console.log('Users_On_Reservations: ', Users_On_Reservations)

    const Cameras_On_Reservations = await Promise.all( //flatMap() - flattens the nested arrays of promises into one array
        reservations.flatMap(reservation => 
            reservation.Camera_id.map(cam_id => Camera_Model.findById(cam_id))
        )
    );
    // const Reservations_Grouped_with_Cameras = await Promise.all(
    //     reservations.map(reservation => 
    //         Promise.all(
    //             reservation.Camera_id.map(cam => Camera_Model.findById(cam._id))
    //         )
    //     )
    // )


    // console.log("Cameras_On_Reservations: ", Cameras_On_Reservations)

    res.status(201).json({ success: true, message : 'Reservations found', reservationFound: reservations, Users_On_Reservations: Users_On_Reservations, camera_in_reservations: Cameras_On_Reservations})
})

const Get_User_Reservation = asyncHandler(async(req, res) => {
    const { reservation_id } = req.params;

    try {
        let reservation_Address;
    
        const User_On_Reserved = await Reservation_Model.findById(reservation_id).populate('Customer_id')
        const reservation_Transaction = await Reservation_Model.findById(reservation_id).populate('transaction')
        const camera_Reserved_by_User = await Reservation_Model.findById(reservation_id).populate('Camera_id') 
        if (reservation_Transaction.get_method === 'Delivery') {
            reservation_Address = await Reservation_Model.findById(reservation_id).populate('Address')
        }
    
        const Reservation_Document = {
            _id : reservation_Transaction._id,
            User : User_On_Reserved.Customer_id,
            Camera_Reserved: camera_Reserved_by_User.Camera_id,
            Quantity : reservation_Transaction.Quantity,
            Days : reservation_Transaction.Days,
            StartDate : reservation_Transaction.StartDate,
            EndDate : reservation_Transaction.EndDate,
            Total :reservation_Transaction.Total,
            reserved_status : reservation_Transaction.reserved_status,
            transaction : reservation_Transaction.transaction, //populated
            get_method : reservation_Transaction.get_method,
            Address : reservation_Transaction.get_method === 'Delivery' ? reservation_Address.Address : null, //populated
        }
    
        if (Reservation_Document) {
            res.status(201).json({ success: true, message : 'Reservation found.', Reservation_Document : Reservation_Document})
        }
        
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
    }

})

const Get_All_System_Chats = asyncHandler(async(req, res) => {

    const System_Chats = await System_Chat_Model.find({}).sort({ createdAt: -1 }).populate({
        path : 'conversation.message_id',
        populate : {
            path : 'Included_Item'
        }
    }).populate('user')

    if (!System_Chats) return res.status(404).json({ success: false, message: 'No conversation with the renters yet.', SystemChats_With_Renters: []})

    res.status(201).json({ success: true, message: `${System_Chats.length} chats has found.`, SystemChats_With_Renters: System_Chats})

})

const Get_Last_Convo_And_Update_Message_Status = asyncHandler(async(req, res) => {
    const { conversation_id, lastConvo_id } = req.params;

    const User_Chat = await User_Chat_Model.findOne({
        _id : lastConvo_id,
        system_chat_id : conversation_id,
    })
    if (!User_Chat) return console.log('backend: Message does not exist.');

    User_Chat.messageStatus = 'Seen'
    await User_Chat.save();

})

const Admin_Send_Message_To_User = asyncHandler(async(req, res) => {
    const { conversation_id, to_user } = req.params;
    const { admin_message } = req.body;

    const Admin_create_Message = await Admin_Chat_Model.create({
        message : admin_message, 
        to : to_user,
        messageStatus : 'Delivered'
    })

    let Chat_System_Conversation = await System_Chat_Model.findById(conversation_id);
    if (!Chat_System_Conversation) {
        //Create new system chat with the user if not exist
        Chat_System_Conversation = await System_Chat_Model.create({
            user : to_user,
            conversation : [{
                message_id : Admin_create_Message._id,
                model : 'Admin_Chat',
            }],
        });

    } else {

        //Continue saving the message of the admin inside the conversation array of objects
        Chat_System_Conversation.conversation.push({
            message_id : Admin_create_Message._id,
            model : 'Admin_Chat',
        });

        await Chat_System_Conversation.save();
    }

    res.status(201).json({ success: true, message: 'Message sent successfully.', newMessage : Admin_create_Message});


})

const Update_User_Message_Status_To_Admin = asyncHandler(async(req, res) => {
    const { chat_id } = req.params;
    try {
        const Update_Chat_Status_Of_The_user = await User_Chat_Model.findByIdAndUpdate(
            chat_id,
            {
                messageStatus : 'Seen',
            }
        )
        await Update_Chat_Status_Of_The_user.save();
        res.status(201).json({ success: true, message : 'the message has been Seen.'})
    } catch (error) {
        console.errror(`Error in backend: ${error.message}`)
    }
})

const Admin_Clicked_Approved = asyncHandler(async (req, res) => {
    const { Reserved_id, customer_id } = req.params;

    try {
        const Reservation = await Reservation_Model.findByIdAndUpdate(
        Reserved_id,
        { reserved_status: 'Approved' },
        { new: true } // return updated doc
        ).populate('Camera_id');

        if (!Reservation) {
        return res.status(404).json({ success: false, message: 'Reservation not found.' });
        }

        // Message
        let Message_From_Admin;
        if (Reservation.get_method === 'Delivery') {
            Message_From_Admin = `The item you've requested to rent has been approved and will be delivered to your given address.`;
        } else {
            Message_From_Admin = `Your requested item has been approved and will wait for you to get it. Note: Cancelling your rented item after approval is not allowed and no refund will be given.`;
        }

        // Ensure conversation exists
        let conversation_Chat = await System_Chat_Model.findOne({ user: customer_id });
        if (!conversation_Chat) {
            conversation_Chat = await System_Chat_Model.create({ user: customer_id });
        }

        // Create admin message
        const messageFrom_Admin = await Admin_Chat_Model.create({
            system_chat_id: conversation_Chat._id,
            message: Message_From_Admin,
            Included_Item: Array.isArray(Reservation.Camera_id)
                ? Reservation.Camera_id.map(cam => cam._id)
                : Reservation.Camera_id?._id,
            to: customer_id,
            messageStatus: 'Delivered',
        });

        // Push into conversation
        conversation_Chat.conversation.push({
        message_id: messageFrom_Admin._id,
        model: 'Admin_Chat',
        });
        await conversation_Chat.save();

        res.status(201).json({ success: true, message: 'Reservation Approved.' });
    } catch (error) {
        const errorMessage = `Error in backend (Admin_Clicked_Approved): ${error.message}`;
        console.error(errorMessage);
        res.status(500).json({ success: false, message: errorMessage });
    }
});

const Admin_Approved_Refund = asyncHandler(async(req, res) => {
    const { Reserved_id, customer_id } = req.params;

    try {
        //Change the reserved_status of the resevation of the user
        const reserved_Refund = await Reservation_Model.findByIdAndUpdate(
            Reserved_id,
            {
                reserved_status: 'Approved refund',
            },
            { new: true }
        ).populate('Camera_id')
        

        //Find the conversation between the user and admin
        let Conversation = await System_Chat_Model.findOne({
            user: customer_id,
        })

        let message = 'Your request for a refund, has been approved by the admin. the 50% you paid has already sent, back to your e-wallet account. Thank you for trusting lilys camera rental!'
        let createMessage = await Admin_Chat_Model.create({
            system_chat_id : Conversation._id,
            message: message,
            Included_Item : reserved_Refund.Camera_id.map(cam => cam._id),
            to : customer_id,
            messageStatus : 'Delivered',
        })

        if (Conversation) {
            //if it found the conversation of the user and the admin.
            //Admin sends message to the user.

            //Save and pushed it to the conversation between the user and admin in System_Chat_Model
            Conversation.conversation.push({
                message_id : createMessage._id,
                model : 'Admin_Chat'
            })

            await Conversation.save();
            console.log('Sends the message to user.')
        } else {
            //will create a conversation to the user 
            // if there's no conversation between the admin and user has been made yet
            const create_new_Conversation = await System_Chat_Model.create({
                user: customer_id,
            })

            if (create_new_Conversation) {
                create_new_Conversation.conversation.push({
                    message_id: createMessage._id,
                    model : 'Admin_Chat'
                })
                await create_new_Conversation.save();
            }
        }

        res.status(201).json({ success: true, message : 'Admin Approved user requested refund.'})
    } catch (error) {
        const ErrorMessage = `Error in backend (Admin_Approved_Refund) : ${error.message}`;
        console.error(ErrorMessage)
        res.status(500).json({ success: false, message: ErrorMessage})
    }
    
})

const Change_Approved_Reservation_Status_To_Ongoing = asyncHandler(async(req, res) => {
    const { reservation_id } = req.params;
    try {
        await Reservation_Model.findByIdAndUpdate(
            reservation_id,
            {
                reserved_status: 'Ongoing'
            }
        )
        res.status(201).json({ success: true, message: `Status changed to Ongoing.`})
    } catch (error) {
        const ErrorMessage = `Error in backend (Change_Approved_Reservation_Status_To_Ongoing) : ${error.message}`
        console.error(ErrorMessage)
        res.json({ success: false, message: ErrorMessage })
    }
    
})

const Change_Reserved_Status_To_Done_Renting = asyncHandler(async(req, res) => {
    const { reservation_id } = req.params;

    try {
        await Reservation_Model.findByIdAndUpdate(
            reservation_id,
            {
                reserved_status: 'Done Renting'
            }
        )
        res.status(201).json({ success: true, message: 'Changed reservation of the user to Done renting.'})
        
    } catch (error) {
        const ErrorMessage = `Error in backend (Change_Reserved_Status_To_Done_Renting) : ${error.message}`;
        console.error(ErrorMessage)
        res.json({ success: false, message: ErrorMessage})
    }

})


module.exports = {
    new_category,
    get_Categories,
    add_sub_category,
    remove_sub_category,
    toggleIsVisible,
    delete_category,
    change_category_name,
    create_new_product,
    get_all_Products,
    editModel,
    editPrice,
    editLocation,
    editDescription,
    editStatus,
    editOn_Category_And_SubCategory,
    delete_Camera,
    createInclusion,
    getProduct_Inclusion,
    deleteInclusion_Image,
    Get_All_Reservations,
    Get_User_Reservation,
    Get_All_System_Chats,
    Get_Last_Convo_And_Update_Message_Status,
    Admin_Send_Message_To_User,
    Update_User_Message_Status_To_Admin,
    Admin_Clicked_Approved,
    Admin_Approved_Refund,
    Change_Approved_Reservation_Status_To_Ongoing,
    Change_Reserved_Status_To_Done_Renting,
    
}