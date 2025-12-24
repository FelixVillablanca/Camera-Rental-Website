

const multer = require('multer') 
const path = require('path')

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        if (file.fieldname === 'primaryImage') {
            cb(null, path.join(__dirname, '../Products/PrimaryImages') )
        } else if (file.fieldname === 'sub_images') {
            cb(null, path.join(__dirname, '../Products/SecondaryImages'))
        }
    },
    filename : (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`
        cb(null, uniqueSuffix)
    }
})

const uploadPrimary = multer({ storage })
module.exports = uploadPrimary;