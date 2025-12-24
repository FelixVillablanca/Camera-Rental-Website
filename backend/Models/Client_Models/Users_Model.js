
const mongoose = require('mongoose')

//====> Users
const UsersSchema = mongoose.Schema({
    username : {
        type : String,
        required : false,
        unique : [true, 'Username already existing.'],
    },
    password : {
        type : String,
        required : false,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    profile : {
        type : String,
        required : false,
    },
    role : {
        type : Number,
        required : true,
        default : 2,
    },
    Address : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        required : false,
    }],
    Interaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Interaction',
        required : false,
    },
    // // forgot password fields
    resetCode : {
        type : String,
        required : false,
    },
    resetCodeExpiry : {
      type : Date,
      required : false,  
    } 

})
const Users_Model = mongoose.model("Users", UsersSchema, "Users");

//====> Interaction purpose : each users must have one Interaction table/collection
const InteractionSchema = mongoose.Schema({
    User_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true,
    },
    Reserved_Item : [{
        ReservationReceipt : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Reservation',
            required : false,
        },
        AddedAt : {
            type : Date,
            required: true,
            default: Date.now,
        }
    }],
    Conversation_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'System_Chat',
        required : false,
    }
    // Cart : [{ //Added items to cart 
    //     itemsCart : {
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : 'Cart',
    //         required : false,
    //     },
    //     addedAt : {
    //         type : Date,
    //         required : true,
    //         default : Date.now
    //     }
    // }],
    // Shoppingbag : [{ //items of the users/renters who added items on a reservation to rent
    //     items : {
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : 'Shoppingbag',
    //         required : false,
    //     },
    //     addedAt : {
    //         type : Date,
    //         required : true,
    //         default : Date.now
    //     }
    // }],
    
})
const Interaction_Model = mongoose.model("Interaction", InteractionSchema, "Interaction")

//====> Shoppingbag purpose: for Reservation
const ShoppingbagSchema = mongoose.Schema({
    User_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    Camera : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required : false,
    }],
    Additional_items : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Essentials',
        required : false
    }]
}, {
    timestamps : true
})
const Shoppingbag_Model = mongoose.model("Shoppingbag", ShoppingbagSchema, "Shoppingbag")

const cartSchema = mongoose.Schema({
    User_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    Camera : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required : true,
    }],
    Essentials : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Essentials',
        required : false
    }]
    
}, {
    timestamps : true
})
const Cart_Model = mongoose.model("Cart", cartSchema, "Cart")

// === create Reservation model
const ReservationSchema = mongoose.Schema({
    Customer_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : false,
    },
    Camera_id : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required : false
    }],
    Quantity : {
        type : Number,
        required : false,
    },
    Days : {
        type : Number,
        required: false,
    },
    StartDate : {
        type : Date,
        required : false
    }, 
    EndDate : {
        type : Date,
        required : false
    },
    Total : {
        type : Number,
        required : false,
    },
    reserved_status : {
        type : String,
        required: true,
        default: 'Pending',
        enum : ['Pending', 'Requesting refund', 'Approved refund', 'Approved', 'Ongoing', 'Done Renting', 'Cancelled']
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Transaction',
        required : false,
    },
    // status: {
    //     type : String,
    //     default : 'Pending',
    //     required : true,    
    // },
    get_method : {
        type : String,
        required : false,
        enum : ['Delivery', 'PickUp']
    },
    Address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Address',
        required : false,
    },
    Arrival : {
        type : Date,
        required : false
    },
    Rate : {
        type : String,
        required : false,
    },
    Review : {
        type : String,
        required: false,
        
    },
    Review_Status : {
        type : String,
        required : true,
        default : 'Not_yet_rated',
        enum : ['Not_yet_rated', 'DoneRating', 'Did_Not_rate']
    }
}, {
    timestamps : true
})

const Reservation_Model = mongoose.model('Reservation', ReservationSchema, 'Reservation')

const ReviewsSchema = mongoose.Schema({
    User_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required: true
    },
    Reservation_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Reservation',
        required : true,
    },
    Rate : {
        type : String,
        required : false,
    },
    comment : {
        type : String,
        required : false,
    },
    Image : [{
        type : String,
        required : false,
    }]
}, {
    timestamps : true
})
const Reviews_Mdodel = mongoose.model('Reviews', ReviewsSchema, 'Reviews')

const transactionSchema = mongoose.Schema({
    reservation_id : mongoose.Schema.Types.ObjectId,
    method : String,
    transactionId : { 
        type: Number, 
        default: Math.floor(Math.random() * 1000000), 
        required: true
    }, 
    amount : Number,
    userId : String,
    status : {
        type : String,
        default : 'Paid',
    },
    number : Number,
    qrcode : String,
    createdAt : { type : Date, default : Date.now },
})

const transaction_Model = mongoose.model('Transaction', transactionSchema, 'Transaction');

const AddressSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    fullname : String,
    Region : String,
    Province : String,
    City : String,
    Barangay : String,
    PostalCode : Number,
    PhoneNumber : Number,
})

const Address_Model = mongoose.model('Address', AddressSchema, 'Address');

module.exports = {
    Users_Model,
    Interaction_Model,
    Shoppingbag_Model,
    Cart_Model,
    Reservation_Model,
    Reviews_Mdodel,
    transaction_Model,
    Address_Model
}