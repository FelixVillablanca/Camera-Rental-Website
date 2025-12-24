
const mongoose = require('mongoose')

const CameraSchema = mongoose.Schema({
    name : {
        type : String,
        required : false,
        unique : true,
    },
    brand : {
        type : String,
        required : false,
    },
    model : {
        type : String,
        required : false,
    },
    description : {
        type : String,
        required : false,
    },
    price_per_day : {
        type : Number,
        required : false,
    },
    status : { //Available, Unavaileble
        type : String,
        required : false,
    },
    category : { //'DSLR', 'Mirrorless', 'Cinema Cameras', 'Prosumer Videos',
         
                // Point-and-Shoot Cameras, Video Cameras, Lenses, Tripods and Supports, Lighting Equipment
                //Audio Accessories, Accessories Kit
        type : String,
        required : false,
    },
    sub_category : {
        type : String,
        required : false,
    },  
    success_rented : [{ 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : false
    }],
    main_image_url : {
        type : String,
        required : false,
    },
    sub_images_url : [{
        type : String,
        required : false,
    }],
    location : { //Palo 
        type : String,
        required : false,
    },
    inclusion : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Inclusion',
        required : false,
    }],
    User_Experience : [{
        Review : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Reviews',
            required : false
        },
        Experience_Shots : [{
            type : String,
            required : false
        }],
        addedAt : {
            type : Date,
            required : true,
            default : Date.now
        }
    }]
}, {
    timestamps : true
})
const Camera_Model = mongoose.model("Cameras", CameraSchema, "Cameras")

const InclusionSchema = mongoose.Schema({
    camera_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cameras',
        required : false
    },
    item : {
        type : String,
        required : false,
    },
    image : {
        type : String,
        required : false,
    }
}, {
    timestamps : true,
})
const Inclusion_Model = mongoose.model("Inclusion", InclusionSchema, "Inclusion")

const commentsSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : false,
    },
    comment : {
        type : String,
        required : false
    }
}, {
    timestamps : true
})
const Comments_Model = mongoose.model("Comments", commentsSchema, "Comments")


const EssentialsSchema = mongoose.Schema({ // items like tripod
    name: {
        type: String,
        required: false,
    },
    brand: {
        type: String, 
        required: false,
    },
    model: {
        type: String,
        required: false
    },  
    description: {
        type : String,
        required : false
    },
    price_per_day: {
        type: Number,
        required: false,
    },
    status: {
        type : String,
        required: false,
    },
    category : {
        type : String,
        required : false,
    },
    success_rented: [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : false,
    }],
    main_image_url: { //one file name url only
        type: String,
        required: false,
    },
    sub_images_url: [{ //image name urls
        type : String,
        required : false,
    }],
    location : {
        type: String,
        required: false,
    }
}, {
    timestamps : true
})
const Essentials_Model = mongoose.model("Essentials", EssentialsSchema, "Essentials")

module.exports = {
    Camera_Model,
    Inclusion_Model,
    Comments_Model,
    Essentials_Model,
}