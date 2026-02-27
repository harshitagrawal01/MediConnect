import express from 'express'
import { submitReview, getAppointmentReview, getDoctorReviews } from '../controllers/reviewController.js'
import authUser from '../middlewares/authUser.js'

const reviewRouter = express.Router()

// Submit a review (user must be logged in)
reviewRouter.post('/submit', authUser, submitReview)

// Get review for a specific appointment
reviewRouter.get('/appointment/:appointmentId', authUser, getAppointmentReview)

// Get all reviews for a doctor (public)
reviewRouter.get('/doctor/:doctorId', getDoctorReviews)

export default reviewRouter
