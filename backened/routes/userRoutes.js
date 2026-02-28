import express from  'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, paymentRazorpay, registerUser, updateProfile, verifyEmail, verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',authUser,upload.single('image'),updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

userRouter.get('/verify-email/:token', verifyEmail)

export default userRouter