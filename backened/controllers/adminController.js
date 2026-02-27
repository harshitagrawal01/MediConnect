import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// API for adding doctor
const addDoctor = async (req,res) => {
  try{

    //console.log("BODY:", req.body);
    //console.log("FILE:", req.file);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body missing (not multipart/form-data)"
      });
    }


    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file

    // checking for all data to add doctor
    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
      res.json({success:false,message:"Missing Details"})
    }

    // validating email
    if(!validator.isEmail(email)){
      res.json({success:false,message:"please provide valid email"})
    }

    // validating password
    if(password.length < 8){
      res.json({success:false,message:"please choose a strong password"})
    }

    // hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
    const imageUrl = imageUpload.secure_url

    const doctorData = {
      name,
      email,
      image:imageUrl,
      password:hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address),
      date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({success:true,message:"Doctor added"})

  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const loginAdmin = async (req,res) =>{
  try{
    const{email,password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})
    }
    else{
      res.json({success:false,message:"Invalid Credentials"})
    }
  }catch(error){
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get all doctors list for admin panel
const allDoctors = async(req,res) => {
  try {
    
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get all appointments list
const appointmentsAdmin = async(req,res) =>{
  try {
    
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API for appointment cancellation
const appointmentCancel = async(req,res) =>{
  try {
    
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    // releasing doctor slots

    const {docId, slotDate, slotTime} = appointmentData

    const doctordata = await doctorModel.findById(docId)

    let slots_booked = doctordata.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e =>e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true,message:'Appointment cancelled'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API for dashboard
const adminDashboard = async(req,res) =>{
  try {
    
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      patients:users.length,
      appointments:appointments.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}