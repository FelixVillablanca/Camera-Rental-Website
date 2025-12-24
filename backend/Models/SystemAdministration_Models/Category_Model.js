

const mongoose = require('mongoose')

// const subcategorySchema = mongoose.Schema({
//     name : {
//         type : String,
//         required : true,
//     }
// })

const CategorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    isVisible : {
        type : Boolean,
        default : true,
    },
    subcategories : [{
        type : String,
        required : false
    }]
}, {
    timestamps : true
})

const Category_Model = mongoose.model('Category', CategorySchema, 'Category')
module.exports = {
    Category_Model
}

//Example of adding subcategory in subcategories field -> querying/query:
// await Category.findByIdAndUpdate(
//   categoryId,
//   { $push: { subcategories: 'Point-and-Shoot' } },
//   { new: true }
// );

//Example of removing subcategory in subcategories field -> querying/query:
// await Category.findByIdAndUpdate(
//   categoryId,
//   { $pull: { subcategories: 'DSLR' } },
//   { new: true }
// );

//Example output:
// {
//   "_id": "123...",
//   "name": "Cameras",
//   "isVisible": true,
//   "subcategories": ["DSLR", "Mirrorless", "Cinema Cameras"]
// }