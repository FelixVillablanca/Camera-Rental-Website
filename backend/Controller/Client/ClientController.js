

require('dotenv').config();
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const { 
    Reservation_Model,
    Reviews_Mdodel, 
    transaction_Model, 
    Interaction_Model,
    Users_Model,
    Address_Model,
 } = require('../../Models/Client_Models/Users_Model')
const { Category_Model } = require('../../Models/SystemAdministration_Models/Category_Model');
const { Camera_Model } = require('../../Models/SystemAdministration_Models/DigitalCameras_Model');

const {
    User_Chat_Model,
    Admin_Chat_Model,
    System_Chat_Model
} = require('../../Models/Chat_Model')

// const phLocation = require('../../Data/PHLocation.json');
const fs = require('fs');
const path = require('path')
const phLocation = JSON.parse(fs.readFileSync('./Data/PHLocation.json', 'utf-8'));


const UpdateToken_Session = (user_interaction, UserGetAddress) => {
    return jwt.sign({
        session_user_id : user_interaction._id,
        session_username : user_interaction.username,
        session_email : user_interaction.email,
        session_profile : user_interaction.profile,
        session_Address : UserGetAddress.Address,
        session_role : user_interaction.role,
        session_interaction : user_interaction.Interaction,
    }, process.env.LilysWebToken)
}


const Get_Categories = asyncHandler(async(req, res) => {
    const categories = await Category_Model.find({});

    if (!categories) res.status(500).json({ success: false, message: "No categories found"});
    res.status(201).json({ success: true, categories : categories })
})

const  Get_All_Cameras = asyncHandler(async(req, res) => {
    const camera = await Camera_Model.find({}).sort({ createdAt: -1 })

    if (!camera) return res.status(404).json({ success: false, message: 'No Cameras.'})
    res.status(201).json({ success: true, message: `Cameras found.`, Cameras: camera})
})

const Get_Camera = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const  camera = await Camera_Model.findById(id).populate('inclusion').populate({
        path : 'User_Experience.Review',
        populate : {
            path : 'User_id',
        }
    });
    if (!camera) return res.status(404).json({ success: false, message : `${id} not found`})
    res.status(201).json({ success: true, message: 'Item found.', camera: camera})
})

const QRCode = require('qrcode');

const MakePaid_Reservation_data = asyncHandler(async(req, res) => {
    const { user_id, camera_id } = req.params;
    const { object } = req.body;
    try {
        console.log('Object: ', object)

        const createTransaction_Receipt = await transaction_Model.create({ //transaction collection/table
            method : object.method,
            amount : object.amount,
            user_id : object.user_id,
            number : object.number,
        })

        //create a link for the qrcode
        const qrData = `https://localhost:2010/TransactionDetails/${createTransaction_Receipt._id}`; {/* changed 'localhost' to my computer local IP  192.168.1.1 */}

        //generate the qrcode image
        createTransaction_Receipt.qrcode = await QRCode.toDataURL(qrData);
        await createTransaction_Receipt.save();


        if (!createTransaction_Receipt) return res.status(500).json({ success: false, message: 'Failed to create receipt.'})

        if (createTransaction_Receipt) {
            const createReservation = await Reservation_Model.create({ //create reservation
                Customer_id : user_id,
                Camera_id : camera_id,
                Quantity : object.quantity,
                Days : object.days,
                StartDate : object.start_date,
                EndDate : object.end_date,
                Total : object.total,
                transaction : createTransaction_Receipt._id,
                get_method : object.get_Method,
                Address : object.Active_Address

            })
            if (!createReservation) return res.status(500).json({ success: false, message: 'failed to create Reservation.'})

            await transaction_Model.findByIdAndUpdate(
                createTransaction_Receipt._id,
                { reservation_id : createReservation._id }
            )

            if (createReservation) {

                const Interaction_of_User = await Interaction_Model.findOne({ User_id : user_id});

                if (Interaction_of_User) {
                    Interaction_of_User.Reserved_Item.push({
                        ReservationReceipt : createReservation._id,
                    })

                    
                    await Interaction_of_User.save();

                    const  user = await Users_Model.findById(user_id).populate('Interaction')
                    const user_Address = await Users_Model.findById(user_id).populate('Address')
                    const new_updated_session_Token = UpdateToken_Session(user, user_Address)

                    res.status(201).json({ success : true, message: 'Payment successfull.', updated_token: new_updated_session_Token, transaction : createTransaction_Receipt})
                } else {
                    res.status(404).json({ success: false, message: `${user_id} not found`})
                }
            }
        }
        
    } catch (error) {
        console.error(`Error in backend: ${error.message}`);        
    }

})

const Check_If_Camera_Exist_On_Reservation = asyncHandler(async(req, res) => {
    const { user_id, camera_id } = req.params;
    // console.log('user_id: ', user_id, 'camera_id: ', camera_id)
    // find reservations where both Customer_id field on the reservations collection/table,
    // matches the user_id and Camera_id field matches the camera_id
    const Reservation = await Reservation_Model.find({ 
        Customer_id: user_id, 
        Camera_id: camera_id, 
    })

    if (Reservation.length == 0) return res.json({ is_InReservation: false })
    res.status(201).json({ is_InReservation: true })
})

const Get_Region = asyncHandler(async(req, res) => {
    try {
        res.json(phLocation.region)
    } catch (error) {
        console.error(`Error on backend:  ${error.message}`)        
    }
})

const Get_Provinces_On_Region = asyncHandler(async(req, res) => {
    const { Selected_Region_ID } = req.params;
    const provincesFound = phLocation.province.filter(prov => prov.region_code === Selected_Region_ID);
    res.json(provincesFound)
})

const Get_Cities_On_Province = asyncHandler(async(req, res) => {
    const { Selected_Province_ID } = req.params;
    const citiesFiltered_OnProvince = phLocation.city.filter(cities => cities.province_code === Selected_Province_ID);
    res.json(citiesFiltered_OnProvince)
})

const Get_Barangay_Based_On_Selected_City = asyncHandler(async(req, res) => {
    const { Selected_City_ID } = req.params;
    const barangayFiltered_On_Province_Selected = phLocation.barangay.filter(barangay => barangay.city_code === Selected_City_ID);
    res.json(barangayFiltered_On_Province_Selected)
})

const User_Create_New_Address = asyncHandler(async(req, res) => {
    if (!req.body || !req.body.request_address) {
      return res.status(400).json({ success: false, message: 'No request_address in body' });
    }

    const { user_id } = req.params;
    const { request_address } = req.body; 
    // console.log('req.body: ', req.body)
    // console.log(request_address)

    // const check_if_Address_Exist = await Address_Model.find({
    //     PhoneNumber : request_address.Phone_Number
    // })

    // if (check_if_Address_Exist) {
    //     const user = await Users_Model.findById(user_id).populate('Address');
    //     const UpdateToken = UpdateToken_Session(user);
    //     res.status(201).json({ success: true, message : 'Address already exist and will use it.', new_token :  UpdateToken})
    //     return
    // } 

    const Create_New_Address = await Address_Model.create({
        user_id : user_id,
        fullname : request_address.fullname,
        Region : request_address.Region,
        Province : request_address.Province,
        City : request_address.City,
        Barangay : request_address.Barangay,
        PostalCode : request_address.Postal_Code,
        PhoneNumber : request_address.Phone_Number,
    })

    if (!Create_New_Address) return res.status(500).json({ success: false, message : 'Failed to create address.'});
    const user_interaction = await Users_Model.findById(user_id).populate('Interaction')

    const user_Address = await Users_Model.findByIdAndUpdate(
        user_id,
        {
            $push : { Address : Create_New_Address._id }
        },
        { new: true } //ensures the returned document is updated.
    ).populate('Address')

    const Update_Token = UpdateToken_Session(user_interaction ,user_Address);
    res.status(201).json({ success: true, message: 'Address created.', new_token: Update_Token})
})

const Delete_Address_Selected = asyncHandler(async(req, res) => {
    const  { Address_id, user_id } = req.params;

    try {
        await Address_Model.findByIdAndDelete(Address_id)
        const user_pull_out_Address_ID = await Users_Model.findOneAndUpdate(
            {Address : Address_id},
            { $pull : { Address : Address_id } },
            { new: true }
        ).populate('Address')

        const user_interaction = await Users_Model.findById(user_id).populate('Interaction');
        const user_Address = await Users_Model.findById(user_id).populate('Address');
        if (user_Address && user_interaction) {
            const newToken = UpdateToken_Session(user_interaction ,user_Address); //updated User credentials
            res.status(201).json({ success: true, message : 'Address deleted successfully.', new_token : newToken})
        }
        
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
        res.json({ success: false, message : `Error in backend: ${error.message}`})
    }
})

const Get_User_Reservations = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    const reservations_Of_User = await Reservation_Model.find({
        Customer_id: user_id,
        reserved_status: { $in : ['Pending', 'Requesting refund']}, // if the reservations found and is either Pending or Requesting refund 
    }).populate('Camera_id');

    if (!reservations_Of_User || reservations_Of_User.length === 0) {
        return res.status(404).json({
        success: false,
        message: "You currently don't have any pending reservations."
        });
    }

    // Fetch all transactions in parallel
    const transactions = await Promise.all(
        reservations_Of_User.map(reservation =>
        transaction_Model.findById(reservation.transaction) // return the promise  reservation.transaction = transaction: "6932cffd26b95329ff9261ac" field in reservation that is Foerign key

        )
    );
    // console.log('Transaction Findings on every Reservations of the user:', transactions);
//     Transaction Findings on every Reservations of the user: [
// [1]   {
// [1]     _id: new ObjectId('6932cffd26b95329ff9261ac'),
// [1]     method: 'Gcash',
// [1]     transactionId: 944643,
// [1]     amount: 6000,
// [1]     status: 'Paid',
// [1]     number: 9946350809,
// [1]     createdAt: 2025-12-05T12:28:45.767Z,
// [1]     __v: 0
// [1]   },
// [1]   {
// [1]     _id: new ObjectId('6932d31109d34f0ab27cfc0d'),
// [1]     method: 'Gcash',
// [1]     transactionId: 482967,
// [1]     amount: 9600,
// [1]     status: 'Paid',
// [1]     number: 9946350809,
// [1]     createdAt: 2025-12-05T12:41:53.881Z,
// [1]     __v: 0
// [1]   }
// [1] ]

    res.status(201).json({
        success: true,
        message: 'Reservations Found.',
        reservations: reservations_Of_User,
        transactions // include transactions in response
    });
});

const User_Requesting_For_Refund = asyncHandler(async(req, res) => {
    const { reservation_id } = req.params;
    try {
        const updateReservations_Status = await Reservation_Model.findByIdAndUpdate(
            reservation_id,
            {
                reserved_status : 'Requesting refund'
            }
        )
        if (updateReservations_Status) console.log('reservation updated to Requesting refund')

        res.status(201).json({ success: true, message: 'User requested for refund'})
        
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
    }
})

const Get_One_Transaction_Of_The_User = asyncHandler(async(req, res) => {
    const { transaction_id } = req.params;

    try {
        const transactionDetails = await transaction_Model.findById(transaction_id);
        if (!transactionDetails) return res.status(404).json({ success: false, message: 'transaction not found.'})
        res.status(201).json({ success: true, message: 'transaction of the user.', transactionDetails : transactionDetails})
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
    }
    
    
}) 

const User_Send_A_Message_To_Admin = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { send_message } = req.body;

    try {
        // 1. Create the message
        const createMessage = await User_Chat_Model.create({
            from: user_id,
            message: send_message,
        });
    
        // 2. Find or create system chat
        let systemChat = await System_Chat_Model.findOne({ user: user_id });
    
        if (!systemChat) {
            systemChat = await System_Chat_Model.create({ user: user_id, conversation: [] });
        }
    
        // 3. Push message into system chat
        systemChat.conversation.push({
            message_id : createMessage._id,
            model : 'User_Chat' //user model
        });
        await systemChat.save();
    
        // 4. Link message to system chat
        createMessage.system_chat_id = systemChat._id;
        await createMessage.save();
    
        // 5. Ensure interaction record exists
        let interaction = await Interaction_Model.findOne({
            User_id: user_id,
            Conversation_id: systemChat._id,
        });
    
        if (!interaction) {
            interaction = await Interaction_Model.create({
                User_id: user_id,
                Conversation_id: systemChat._id,
            });
        }
        

        res.status(201).json({ success: true, message: 'Message stored', chat: systemChat });
    } catch (error) {
        console.error(`Error in backend: ${error.message}`)
    }
});

const Fetch_System_Chat = asyncHandler(async(req, res) => {
    const { user_id }= req.params;
    
    // Mongoose will look at each conversation.model and populate the correct collection (User_Chat or Admin_Chat).
    const System_Chat = await System_Chat_Model.findOne({ user: user_id }).populate({
        path : 'conversation.message_id',
        populate : {
            path : 'Included_Item',
        } 
    });
  
    // console.log(System_Chat_Model.schema.path('conversation'));


    if (!System_Chat) return res.status(404).json({ success: false, message: 'User dont have any conversations made yet with the admin. ', AsyncChat :System_Chat });
    res.status(201).json({ success: true, message : `User already have conversation with the admin.`, AsyncChat : System_Chat})
    

})

const Update_Message_Status_Of_An_Admin_From_The_Client = asyncHandler(async(req, res) => {
    const { chat_id } = req.params;
    try {
        const update_messageSatus_Of_Admin = await Admin_Chat_Model.findByIdAndUpdate(
            chat_id,
            {
                messageStatus: 'Seen',
            }
        )
        await update_messageSatus_Of_Admin.save();
    
        res.status(201).json({ success: true, message : 'the message has been Seen.'})
        
    } catch (error) {
        console.error(`Backend error: ${error.message} `)
    }
}) 

const Get_Included_Item_On_Message_From_Admin = asyncHandler(async(req, res) => {
    const { item_id } = req.params;

    const item = await Camera_Model.findById(item_id);
    res.status(201).json({ item : item})
})

const Get_The_Reservation_of_The_User = asyncHandler(async(req, res) => {
    const { User_id } = req.params;

    const reservation = await Reservation_Model.find({
        Customer_id: User_id
    }).sort({ createdAt: -1 }).populate('Camera_id').populate('transaction')

    if (!reservation) return res.status(404).json({ success: false, message: `There's no reservation of the user.`})

    res.status(201).json({ success: true, message: `${reservation.length} Reservations found`, reservationOfUser: reservation})
})

const Get_Done_Rents_Of_User = asyncHandler(async(req, res) => {
    const { user_id } = req.params;
    
    const fetch_DoneRents = await Reservation_Model.findOne({ 
        Customer_id : user_id,
        reserved_status : 'Done Renting',
        Review_Status: 'Not_yet_rated',
    }).populate('Camera_id').populate('transaction')

    if (!fetch_DoneRents) return res.json({ success: false, message: 'No Done rents yet.'})

    res.status(201).json({ success: true, message: 'Done rents found.', rentsToRate : fetch_DoneRents })
})

const Create_User_Experience_Review = asyncHandler(async(req, res) => {

    try {
        const { reservation_id, user_id, camera_id } = req.params;
        const Rate_And_Message = req.body;
        
        const create_user_experience_Review = await Reviews_Mdodel.create({
            User_id : user_id,
            Reservation_id : reservation_id,
            Rate : Rate_And_Message.Rate,
            comment : Rate_And_Message.User_experience_Message ? Rate_And_Message.User_experience_Message : null,
        })
    
        if (create_user_experience_Review) {
            await Reservation_Model.findByIdAndUpdate(
                reservation_id,
                {
                    Review_Status: 'DoneRating',
                }
            )
        }
        const Find_The_Camera_Reviewed_By_User = await Camera_Model.findById(camera_id);
    
        if (Find_The_Camera_Reviewed_By_User) {
            Find_The_Camera_Reviewed_By_User.User_Experience.push({
                Review : create_user_experience_Review._id,
            })
            await Find_The_Camera_Reviewed_By_User.save();
            console.log('Successfully saved the id of the user experience message')
        }
        res.json({ success: true, message : `Update` })
    } catch (error) {
        const ErrorMessage = `Error in backend (Create_User_Experience_Review) : ${error.message}`
        console.error(ErrorMessage)
        res.json({ success: false, message: ErrorMessage})
    }


})

const Update_User_ProfileWithout_file = asyncHandler(async(req, res) =>{

    try {
        const { user_id } = req.params;
        const { Username, Email, New_Added_password, status } = req.body;
        let user;
        let session;
        if (status === 'wihtout password') {
            user = await Users_Model.findByIdAndUpdate(
                user_id, 
                {
                    username: Username,
                    email: Email,
                }, {
                    new : true
                }
            ).populate('Address').populate('Interaction')
            session = UpdateToken_Session(user, user)

            res.status(201).json({ success: true, message: 'Profile update.', new_token: session})

            return
        } else if (status === 'with password') {
            user = await Users_Model.findByIdAndUpdate(
                user_id,
                {
                    username: Username,
                    email: Email,
                    password: New_Added_password,
                }
            ).populate('Address').populate('Interaction')
            session = UpdateToken_Session(user, user)
            res.status(201).json({ success: true, message: 'Profile update.'})
            return
        }
    } catch (error) {
        const ErrorMessage = `Error in backend (Update_User_Profile_With_File) : ${error.message}`
        console.error(ErrorMessage)
        res.status(500).json({ success: false, message: ErrorMessage})
    }
    

})

const Update_User_Profile_With_File = asyncHandler(async(req, res) => {
    try {
        const { user_id } = req.params;
        const { username, email, password, status } = req.body;
        const image_user = `/User_Profile/${req.file.filename}`;

        let user_current = await Users_Model.findById(user_id).populate('Address').populate('Interaction')
        if (user_current.profile) {
            const current_image_path = path.join(__dirname, '..', '..', 'UserProfile', path.basename(user_current.profile))
            fs.unlink(current_image_path, err => {
                if (err) return console.error(`Error while deleting the image on directory: ${err.message} path: ${current_image_path}`)
            })
        }
        
        if (status === 'withoutPassword') {
            user_current.username = username;
            user_current.email = email;
            user_current.profile = image_user;

            await user_current.save();
            const new_token = UpdateToken_Session(user_current, user_current);


            res.status(201).json({ success: true, message: 'Profile update.', new_token: new_token})
            return
        } else if (status === 'withPassword') {
            user_current.username = username;
            user_current.email = email;
            user_current.password = password;
            user_current.profile = image_user;

            await user_current.save();
            const new_token = UpdateToken_Session(user_current, user_current)

            res.status(201).json({ success: true, message: 'Profile update.', new_token: new_token})
            return
        } 
    } catch (error) {
        const ErrorMessage = `Error in backend (Update_User_Profile_With_File) : ${error.message}`
        console.error(ErrorMessage)
        res.status(500).json({ success: false, message: ErrorMessage})
    }

})

module.exports = {
    Get_Categories,
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
}