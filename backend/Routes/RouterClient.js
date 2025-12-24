const express = require('express')
const Router = express.Router();

const { 
    Register, Login_Client, 
    Forgot_Password_Client, 
    Reset_Password_Client, 
    continue_Reset_Password,

} = require('../Controller/Auth/Client')

const {
    Get_All_Cameras,
    Get_Camera,
    MakePaid_Reservation_data,
    Check_If_Camera_Exist_On_Reservation,
    Get_Region,
    Get_Provinces_On_Region,
    Get_Cities_On_Province,
    Get_Barangay_Based_On_Selected_City,
    User_Create_New_Address,
    Delete_Address_Selected,
    Get_User_Reservations,
    User_Requesting_For_Refund,
    Get_One_Transaction_Of_The_User,
    User_Send_A_Message_To_Admin,
    Fetch_System_Chat,
    Update_Message_Status_Of_An_Admin_From_The_Client,
    Get_Included_Item_On_Message_From_Admin,
    Get_The_Reservation_of_The_User,
    Get_Done_Rents_Of_User,
    Create_User_Experience_Review,
    Update_User_ProfileWithout_file,
    Update_User_Profile_With_File
} = require('../Controller/Client/ClientController')

const Profile_Upload = require('../Middleware/Multer_Profile')

// path => /api/Client/Register_Client
Router.post('/Register', Register)
Router.post('/Login_Client', Login_Client)
Router.post('/forgot-password', Forgot_Password_Client)
Router.get('/Reset_Password_Client/:email/:code', Reset_Password_Client)
Router.post('/Continue_Reset_Password/:password/:email', continue_Reset_Password)

const { Get_Categories } = require('../Controller/Client/ClientController')

Router.get('/Get_Categories', Get_Categories)
Router.get('/Get_All_Cameras', Get_All_Cameras)
Router.get('/get_camera/:id', Get_Camera)
Router.post('/Paid-Reservation/:user_id/:camera_id', MakePaid_Reservation_data)
Router.get('/Check_Reserve_item/:user_id/:camera_id', Check_If_Camera_Exist_On_Reservation)
Router.get('/Get_Region', Get_Region)
Router.get('/Get_Provinces_On/:Selected_Region_ID', Get_Provinces_On_Region)
Router.get('/Get_Cities_On_Province/:Selected_Province_ID', Get_Cities_On_Province)
Router.get('/Get-Barangay-Based-On-City-Selected/:Selected_City_ID', Get_Barangay_Based_On_Selected_City)
Router.post('/User_Create_New_Address/:user_id', User_Create_New_Address)
Router.delete('/Delete_Address/:Address_id/:user_id', Delete_Address_Selected)
Router.get('/Get_Reserved_Items_Of_User/:user_id', Get_User_Reservations)
Router.get('/Requesting_Refund/:reservation_id', User_Requesting_For_Refund)
Router.get('/Get_Transaction_Of_The_User/:transaction_id', Get_One_Transaction_Of_The_User)

//Chat
Router.post('/User_Send_Message_To_Admin/:user_id', User_Send_A_Message_To_Admin)
Router.get('/Fetch_System_Chat/:user_id', Fetch_System_Chat)
Router.put('/Update_Message_Status_Of_Admin/:chat_id', Update_Message_Status_Of_An_Admin_From_The_Client)
Router.get('/Fetch_Camera_Based_On_Id_Of_The_Included_Item_In_Chat/:item_id', Get_Included_Item_On_Message_From_Admin)
Router.get('/Get_Reservation_Of_The_User/:User_id', Get_The_Reservation_of_The_User)
Router.get('/Fetch_Done_Rents_Of_User/:user_id', Get_Done_Rents_Of_User)
Router.post('/Create_Review/:reservation_id/:user_id/:camera_id', Create_User_Experience_Review)


//Update user profile
Router.put('/Update_user_without_file/:user_id', Update_User_ProfileWithout_file)
Router.put('/Update_User_Profile_with_file/:user_id', Profile_Upload.single('image_user'), Update_User_Profile_With_File)
module.exports = Router