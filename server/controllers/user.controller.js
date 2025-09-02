import bcryptjs from 'bcryptjs'
import UserModel from "../models/user.model.js"
import sendEmail from '../config/sendEmail.js'
import varifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uoloadImageCloudinary.js'
import jwt from 'jsonwebtoken'


// import generatedOtp from '../utils/generateOtp.js'
// import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'

export async function registerUserController(req,res) {
   try {
       const {name,email,password} = req.body
       if (!name || !email || !password) {
         return res.status(400).json({
            message:"provided email , name , password",
            error: true,
            success:false
         })
       }
const user = await UserModel.findOne({email})

if (user) {
   return res.json({
      message:"Alrady Rejister Email",
      error:true,
      success:false
   })
}

const salt = await bcryptjs.genSalt(10)
const hashPassword = await bcryptjs.hash(password,salt)
const payload ={
   name,email,
   password:hashPassword
}
const newUser = new UserModel(payload)
const save = await newUser.save() 
const VerifyEmail = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
const verifyEmail = await sendEmail({
   sendTo:email,
   subject:"Varify email form Seedskr@ft",
   html:varifyEmailTemplate({
      name,
      url: VerifyEmail
   })
})

return res.json({
   message:"User Register successfully",
   error:false,
   success:true,
   data : save
})

   } catch (error) {
      return res.status(500).json({
         message:error.message || error,
         error:true,
         success:false
      })
   }
}

export async function verifyEmailController(req,res) {
   try {
      const { code } = req.body
      const user = await UserModel.findOne({_id:code})
if (!user) {
   return res.status(400).json({
      message:"Invalid code",
      error:true,
      success:false
 } )
}

const updateUser = await UserModel.updateOne({_id: code},{
   verify_email : true
})
return res.json({
   message:"Verify email done",
   success:true,
   error:false
})

   } catch (error) {
      return res.status(500).json({
         message:error.message || error,
         error:true,
         success:true
      })
   }
}
//login controller
export async function logincontroller(req,res) {
   try {
      const {email,password} = req.body

      if (!email || !password) {
         return res.status(400).json({
            message:"provide email , password ",
            error:true,
            success:false
         })
      }
      const user = await UserModel.findOne({email})
      if (!user) {
         return res.status(400).json({
            message:"User not register",
            error:true,
            success:false
         })
      }
     
    if(user.status !== "Active"){
         return res.status(400).json({
            message:"Contact to Admin",
            error:true,
            success:false
         })
    }

    const checkpassword = await bcryptjs.compare(password,user.password)
if(!checkpassword){
   return res.status(400)({
      message:"Cheack your Password",
      error:true,
      success:false
   })
}

  const accesstoken = await generatedAccessToken(user._id)
  const refreshToken = await generatedRefreshToken(user._id)

  const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
   last_login_date : new Date()
  })

const cookiesOption = {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
 }

  res.cookie('accessToken',accesstoken,cookiesOption)
  res.cookie('refreshToken',refreshToken,cookiesOption)

  return res.json({
   message:"Login successfully",
   error:false,
   success:true,
   data:{
      accesstoken,refreshToken
   }
  })

   } catch (error) {
      return res.status(500).json({
         message:error.message || error,
         error:true,
         success:false
      })
   }
}
//logout controller
export async function logoutController(req,res) {
   try {
      const userid = req.userId
  const cookiesOption = {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
 }
      res.clearCookie("accessToken",cookiesOption)
      res.clearCookie("refreshToken",cookiesOption)

      const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
         refresh_token:""
      })

      return res.json({
         message:"Logout SuccessFully",
         error:false,
         success:true
      })
   } catch (error) {
      return res.status(500).json({
         message:error.message || error,
         error:true,
         success:false
      })
   }
}
//upload user avatar
export async function uploadAvatar(req,res) {
   try {
      const userId = req.userId
      const image = req.file
      const upload = await uploadImageClodinary(image)
      const updateUser = await UserModel.findByIdAndUpdate(userId,{
         avatar:upload.url
      })
      return res.json({
         message:"upload profile",
         success : true,
         error:false,
         data:{
            _id:userId,
            avatar:upload.url
         }
      })
      
   } catch (error) {
      return res.status(500).json({
         message:error.message || error,
         error:true,
         success:false
      })
   }
}
//update user details
export async function updateUserDetails(req,res) {
   try {
      const userId = req.userId
      const {name,email,mobile,password} = req.body
  let hashPassword = ""
if (password) {
   const salt = await bcryptjs.genSalt(10)
    hashPassword = await bcryptjs.hash(password,salt)
}

      const updateUser = await UserModel.updateOne({_id:userId},{
         ...(name &&{name:name}),
         ...(email &&{email:email}),
         ...(mobile &&{mobile:mobile}),
         ...(password&&{password:hashPassword})
      })

      return res.json({
         message: "User details updated successfully",
         error: false,
         success: true,
         data: updateUser
      })

   } catch (error) {
      return res.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}
//refresh token controler
export async function refreshToken(req,res) {
   try {
      const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]
      if (!refreshToken) {
         return res.status(401).json({
            message: "Refresh token not provided",
            error: true,
            success: false
         })
      }
      
      const varifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

      if(!varifyToken){
          return res.status(401).json({
            message: " token is expir",
            error: true,
            success: false
          })
      }
      
      
      const userId = varifyToken?._id
      const newAcessToken = await generatedAccessToken(userId)
      const cookiesOption = {
 httpOnly: true,
 secure: process.env.NODE_ENV === 'production',
 sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
 }


      res.cookie('accessToken',newAcessToken,cookiesOption)
      return res.json({
         message: "Access token refreshed successfully",
         error: false,
         success: true,
         accessToken: newAcessToken
      })
      
   } catch (error) {
      return res.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}
//get login user details
export async function userDetails(req,res) {
   try {
      const userId = req.userId
      console.log(userId);
      
      const user = await UserModel.findById(userId).select('-password -refresh_token')
      // if (!user) {
      //    return res.status(404).json({
      //    message: "User not found",
      //    error: true,
      //    success: false
      //    })
      // }
      return res.json({
         message: "User details fetched successfully",
         error: false,
         success: true,
         data: user
      })
   } catch (error) {
      return res.status(500).json({
         message: error.message || error,
         error: true,
         success: false
      })
   }
}
