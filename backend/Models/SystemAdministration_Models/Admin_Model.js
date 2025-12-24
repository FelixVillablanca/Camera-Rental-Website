const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    role : {
        type : Number,
        required : true,
        default : 2,
    },
    image : { //profile image of the admin
        type : String,
        required : false,
    },
    conversation_id : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'System_Chat',
        required : false,
    }]

})
const Admin_Model = mongoose.model("Admin", AdminSchema, "Admin")




module.exports = {
    Admin_Model
}