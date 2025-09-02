import { Router } from "express";
import {   logincontroller, logoutController, refreshToken, registerUserController, updateUserDetails, uploadAvatar, userDetails, verifyEmailController } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router()

userRouter.post('/register',registerUserController)

userRouter.post('/verify-email',verifyEmailController)

userRouter.post('/login',logincontroller)

userRouter.get('/logout',auth,logoutController)

userRouter.put('/upload-avatar',auth,upload.single('avatar'),uploadAvatar)

userRouter.put('/update-user',auth,updateUserDetails)

userRouter.post('/refresh-token',refreshToken)

userRouter.get('/user-details',auth,userDetails)

export default userRouter