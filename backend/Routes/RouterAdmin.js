const express = require('express');
const Router = express.Router();

//Admin
const { 
    login_Admin
}= require('../Controller/Auth/Admin')

const {
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
    Change_Reserved_Status_To_Done_Renting
} = require('../Controller/Admin/AdminController')

// path => /api/Admin/Auth_Admin
// fullpath frontend to backend => http://localhost:2020/api/Admin/Register_Admin

// '../Controller/Auth/Admin'
Router.get('/login_Admin', login_Admin) 

//'../Controller/Admin/AdminController'
Router.post('/new_category', new_category)
Router.get('/Get_Categories', get_Categories)
Router.post('/new_sub_category/:category', add_sub_category)
Router.put('/Remove_sub_category/:category', remove_sub_category)
Router.put('/toggle_isVisible/:category_id', toggleIsVisible)
Router.delete('/category_delete/:category_id', delete_category)
Router.put('/change_category_name/:category_name/:category_id', change_category_name)

// Router.post('/create_product', upload.array('sub_images'), upload.single('primaryImage'), create_new_product)
// Router.post('/create_product', upload.fields([ { name : 'primaryImage', maxCount : 1 }, { name : 'sub_images' } ]), create_new_product)
const upload = require('../Middleware/MulterProduct')
Router.post('/create_product', upload.fields([ { name: 'primaryImage', maxCount : 1}, { name : 'sub_images' } ]), create_new_product)
Router.get('/getProducts', get_all_Products)
//========Edit fields
Router.put('/edit_Model/:id', editModel)
Router.put('/edit_PricePerDay/:id', editPrice)
Router.put('/edit_Location/:id', editLocation)
Router.put('/edit_Description/:id', editDescription)
Router.put('/edit_Status/:selected/:id', editStatus)
Router.put('/edit_CatgeoryAndSubCategory/:id', editOn_Category_And_SubCategory)
Router.delete('/delete_camera/:id', delete_Camera)
//=========Inclusion 
const inclusionMulter = require('../Middleware/Multer_Inclusion')
Router.post('/Create_InclusionOn/:id', inclusionMulter.single('image'), createInclusion)
Router.get('/GetProductInclusion/:id', getProduct_Inclusion)
Router.delete('/delete_inclusion_Image/:id', deleteInclusion_Image)

//========== Reservations
Router.get('/Fetch_All_Reservations', Get_All_Reservations)
Router.get('/User_Reservation/:reservation_id', Get_User_Reservation)

//System chats
Router.get('/Fetch_All_Systen_Chats', Get_All_System_Chats)
Router.put('/Update_Last_Message_Status/:conversation_id/:lastConvo_id', Get_Last_Convo_And_Update_Message_Status)
Router.post('/Admin_Sends_Message_To_User/:conversation_id/:to_user', Admin_Send_Message_To_User)//to_user = id of the user in that conversation
Router.put('/Update_Message_Status_Of_User/:chat_id', Update_User_Message_Status_To_Admin)

//ManageUser
Router.put('/Changed_Reserved_Status/:Reserved_id/:customer_id', Admin_Clicked_Approved)
Router.put('/Refund_Approved_By_Admin/:Reserved_id/:customer_id', Admin_Approved_Refund)
Router.put('/Change_Reserved_Status_Of_Approved_Requested_Reservation/:reservation_id', Change_Approved_Reservation_Status_To_Ongoing)
Router.put('/Change_Status_To_Done_Renting/:reservation_id', Change_Reserved_Status_To_Done_Renting)


module.exports = Router