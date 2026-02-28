import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'
import sendVerificationEmail from '../utils/sendVerificationEmail.js'


// API to register user
const registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" })
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" })
    }

    // hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    // Send verification email instead of logging them in directly
    await sendVerificationEmail(user)

    res.json({ success: true, message: "Registration successful! Please check your email to verify your account." })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to login user
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {

      if (!user.isVerified) {
        return res.json({ success: false, message: "Please verify your email before logging in.", isVerified: false })
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid Credentials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to send forgot password email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "Email not registered" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`

    // send reset email
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'MediConnect', email: 'darkknight38362@gmail.com' },
        to: [{ email: user.email, name: user.name }],
        subject: 'Reset your MediConnect password',
        htmlContent: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name}, click the button below to reset your password:</p>
          <a href="${resetURL}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        `
      })
    })

    res.json({ success: true, message: "Reset link sent to your email!" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired link" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword
    await user.save()

    res.json({ success: true, message: "Password reset successful! Please login." })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {

    const userId = req.user.id
    const userData = await userModel.findById(userId).select('-password')

    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to update user profile
const updateProfile = async (req, res) => {
  try {

    const userId = req.user.id;
    const { name, dob, gender, phone, address } = req.body

    if (!name || !dob || !gender || !phone) {
      return res.json({ success: false, message: "Data Missing" })
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: address ? JSON.parse(address) : { line1: '', line2: '' },
      dob, 
      gender 
    })
    const imageFile = req.file
    if (imageFile) {

      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageURL = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, { image: imageURL })
    }

    res.json({ success: true, message: "Profile updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {

    const userId = req.user.id;

    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" })
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "slot not available" })
      }
      else {
        slots_booked[slotDate].push(slotTime)
      }
    }
    else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Booked' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {

    const userId = req.user.id;

    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {

    const userId = req.user.id
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify if the same user is canceling
    if (appointmentData.userId != userId) {
      return res.json({ success: false, message: "Unauthorized action" })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // releasing doctor slots

    const { docId, slotDate, slotTime } = appointmentData

    const doctordata = await doctorModel.findById(docId)

    let slots_booked = doctordata.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment cancelled' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

  try {

    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" })
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId
    }

    // creation of an order
    const order = await razorpayInstance.orders.create(options)

    res.json({ success: true, order })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {

    const { razorpay_order_id } = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      res.json({ success: true, message: "Payment Successful" })
    } else {
      res.json({ success: false, message: "Payment Failed" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to verify email
const verifyEmail = async(req,res) =>{
  try {
    
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if(!user){
      return res.redirect(`${process.env.FRONTEND_URL}/verify-failed`)
    }

    if(user.isVerified){
      return res.redirect(`${process.env.FRONTEND_URL}/login?message=already-verified`)
    }

    user.isVerified = true
    await user.save()

    res.redirect(`${process.env.FRONTEND_URL}/login?message=verified-successfully`)

  } catch (error) {
    
    console.log(error)
    res.redirect(`${process.env.FRONTEND_URL}/verify-failed`)

  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, verifyEmail, forgotPassword, resetPassword }