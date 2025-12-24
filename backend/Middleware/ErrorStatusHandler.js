
const { ErrorCodes } = require('../ErrorCode');

const errorStatus_Detection = (err, req, res, next) => {
    const StatusCode = res.statusCode ? res.statusCode : 500;

    switch(StatusCode) {
        case ErrorCodes.Validation_Error:
            console.log("(400)Error: Validation_Error" )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({
                title : "Validation_Error",
                message : err.message,
                stackTrace : err.stack,
            })    
            break;
        case ErrorCodes.Unauthorized: 
            console.log("(401)Error: Unauthorized" )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({
                title : "Unauthorized",
                message : err.message,
                stackTrace : err.stack,
            })
            break;
        case ErrorCodes.Forbidden: 
            console.log("(403)Error: Forbidden" )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({
                title : "Forbidden",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        case ErrorCodes.Not_Found: 
            console.log("(404)Error: Not_Found" )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({
                title: "Not_Found",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        case ErrorCodes.Server_Error:
            console.log("(500)Error: Server Error" )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({
                title : "Server Error",
                message : err.message,
                stackTrace : err.stack
            })
            break;
        default:
            console.log("(default)Error: ", err )
            console.log("Message: ", err.message)
            console.log("stackTrace: ", err.stack)
            res.json({ 
                title: "Error",
                message: err.message, 
                stackTrace: err.stack 
            });
            break;
    }
}


module.exports = errorStatus_Detection