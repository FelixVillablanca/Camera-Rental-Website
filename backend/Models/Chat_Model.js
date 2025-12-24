
const mongoose = require('mongoose');

const User_ChatSchema = mongoose.Schema({
    system_chat_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
    },
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true,
    }, 
    message : {
        type : String,
        required : true,
    },
    Included_Item : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required: false
    }],
    to : {
        type : String, //id of the user
        default : 'lilysadministrator',
        required : true,
    },
    messageStatus : {
        type : String,
        enum : ['Delivered', 'Seen'],
        default : 'Delivered',
        required : true,
    },
    createdAt : {
        type : Date,
        required: true,
        default: Date.now,
    }

})
const User_Chat_Model = mongoose.model('User_Chat', User_ChatSchema, 'User_Chat');

const Admin_ChatSchema = mongoose.Schema({
    system_chat_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
    },
    from : {
        type: String,
        default : 'lilysadministrator',
        required : true,
    },
    message : { 
        type : String,
        required : true,
    },
    Included_Item : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required: false
    }],
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true,
    },
    messageStatus : {
        type : String,
        enum : ['Delivered', 'Seen'],
        default : 'Delivered',
        required : true,
    },
    createdAt : {
        type : Date,
        required: true,
        default : Date.now,
    }

})
const Admin_Chat_Model = mongoose.model('Admin_Chat', Admin_ChatSchema, 'Admin_Chat');

const ConversationSchema = new mongoose.Schema({
    message_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        refPath : 'conversation.model'
    },
    model : {
        type : String,
        required : true,
        enum : ['User_Chat', 'Admin_Chat']
    }
})

const System_Chat_Schema = mongoose.Schema({
    admin : {
        type : String,
        default : 'lilysadministrator',
        required : true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    conversation : [ConversationSchema]
}, {
    timestamps : true
})
const System_Chat_Model = mongoose.model('System_Chat', System_Chat_Schema, 'System_Chat')

module.exports = {
    User_Chat_Model,
    Admin_Chat_Model,
    System_Chat_Model
}