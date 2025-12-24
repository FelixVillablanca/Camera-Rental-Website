
const dotenv = require('dotenv').config();


const { Users_Model, Interaction_Model } = require('../../Models/Client_Models/Users_Model') 
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler') ;
const transporter = require('../../utils/email') 

const SecretKeyToken = process.env.LilysWebToken;

const Register = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    // console.log('username: ', username, 'password: ', password, 'email: ', email)

    if (!username) return res.status(404)
    
    // user creation
    if (email.includes('@lilysadministrator.com')) { // @lilysadministrator.com at the end for registering as an admin
        const user = await Users_Model.create({
            username : username,
            password : password,
            email : email,
            role : 1
        })
        await user.save();
        res.status(201).json({ message : 'Successfilly registered as an Admin!'})
        return
    }

    const user = await Users_Model.create({
        username : username,
        password : password,
        email : email,
        role : 2
    })

    try {
        console.log('after user created: ', user)
        if (user) {
            //after creating user, will create its own Interaction field
            const createUser_interactionFIELD = await Interaction_Model.create({
                User_id : user._id
            })
            await createUser_interactionFIELD.save();
            // console.log('after user interactionFIELD created: ', createUser_interactionFIELD)

            if (createUser_interactionFIELD && user && user.role != 1) {
                user.Interaction = createUser_interactionFIELD._id; //saving the id on the Interaction attributes on the user field
                await user.save();
            }
            // console.log('Final')
            // console.log('user: ', user)
            // console.log('user interactionFIELD: ', createUser_interactionFIELD)
            res.status(201).json({ message : 'Successfilly Registered! ', user : user})
        }
        
    } catch (error) {
        res.status(500)
        console.error('From backend something went wrong! : ', error.message)
    }


})

const Admin_token = (user) => {
    return jwt.sign({
        username : user.username,
        email : user.email,
        profile : user.profile,
        role : user.role
    }, process.env.LilysWebToken)
}

const Login_Client = asyncHandler(async (req, res) => {
    const { username, Password} = req.body;
    if (!username || !Password) return res.status(404)

    const user = await Users_Model.findOne({ username }).populate('Interaction')
    const user_address = await Users_Model.findOne({ username }).populate('Address')
    // console.log('user: ', user)
    if (user) {
        if (user.password.includes(Password) && user.role != 1) {
            const ClientToken = jwt.sign({
                session_user_id : user._id,
                session_username : user.username,
                session_email : user.email,
                session_password : user.password,
                session_profile : user.profile,
                session_Address : user_address.Address,
                session_role : user.role,
                session_interaction : user.Interaction,
            }, SecretKeyToken)
            // console.log('Token: ', Token)
            res.status(201).json({ 
                message : 'Successfully logged in!', 
                Token_Session : ClientToken, 
                role : user.role
            })
            return
        } else if (user.password.includes(Password) && user.role == 1) {
            const after_Admin_login_token = Admin_token(user);
            res.status(201).json({ 
                message : 'Welcome back Admin!', 
                Token_Session : after_Admin_login_token, 
                role : user.role
            })
            // console.log('After Admin Login: ', after_Admin_login_token)
            return
        }
        const message = 'Password not matched!'
        res.status(400).json({ message : message })
        return
    }
    const message = 'Username is not existing!'
    res.status(404).json({ message : message })
}) 


const Forgot_Password_Client = asyncHandler(async(req, res) => {
    const { email } = req.body;

    const user = await Users_Model.findOne({ email });
    if (!user) return res.status(404).json({success: false, message : 'user not found'})

    //create a code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
        from : process.env.App_Email,
        to : email,
        subject : 'Password Reset Code',
        text : `Your password reset code is ${resetCode}`
    })
    res.json({success: true, message : "Reset code sent to your email"})
})

const Reset_Password_Client = asyncHandler(async(req, res) => {
    const { email, code } = req.params;

    // console.log('email: ', email, 'code: ', code)
    const user = await Users_Model.findOne({ email });
    if(!user) return res.status(404).json({ success: false, message: 'User not found'})
    
    if (Date.now() > user.resetCodeExpiry) {
        return res.status(400).json({ success: false, message: 'Reset code has expired'})
    }

    if (user.resetCode != code) {
        res.status(400).json({ success: false, message : 'Code not matched!'})
    }

    res.status(201).json({ success : true, message : 'Continue reseting password', email : user.email})

})

const continue_Reset_Password = asyncHandler(async(req, res) => {
    const { password, email } = req.params;

    console.log('email: ', email, 'pass: ', password)
    const user = await Users_Model.findOne({ email });
    if (!user) return res.status(404).json({success: false, message : 'user not found'})
    
    user.password = password
    await user.save();
    res.status(201).json({ success : true, message : 'Password successfully changed!'})
})

module.exports = {
    Register,
    Login_Client,
    Forgot_Password_Client,
    Reset_Password_Client,
    continue_Reset_Password
}