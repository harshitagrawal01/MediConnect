import express from 'express'
import { submitReview, getAppointmentReview, getDoctorReviews } from '../controllers/reviewController.js'
import authUser from '../middlewares/authUser.js'

const reviewRouter = express.Router()


reviewRouter.post('/submit', authUser, submitReview)


reviewRouter.get('/appointment/:appointmentId', authUser, getAppointmentReview)

reviewRouter.get('/doctor/:doctorId', getDoctorReviews)

export default reviewRouter
