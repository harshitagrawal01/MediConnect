import Review from '../models/reviewModel.js'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorModel.js'

// Helper: recalculate and update doctor's average rating
const updateDoctorRating = async (doctorId) => {
  const reviews = await Review.find({ doctorId })
  if (reviews.length === 0) {
    await doctorModel.findByIdAndUpdate(doctorId, { averageRating: 0, totalReviews: 0 })
    return
  }
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  await doctorModel.findByIdAndUpdate(doctorId, {
    averageRating: Math.round(average * 10) / 10, // round to 1 decimal e.g. 4.3
    totalReviews: reviews.length
  })
}

// Submit a review — only for completed appointments
const submitReview = async (req, res) => {
  try {
    const { appointmentId, rating } = req.body
    const userId = req.user.id // from authUser middleware

    if (!appointmentId || !rating) {
      return res.json({ success: false, message: 'Appointment ID and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Rating must be between 1 and 5' })
    }

    // Check appointment exists, belongs to user, and is completed
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' })
    }
    if (appointment.userId.toString() !== userId) {
      return res.json({ success: false, message: 'Unauthorized' })
    }
    if (!appointment.isCompleted) {
      return res.json({ success: false, message: 'You can only review completed appointments' })
    }
    if (appointment.cancelled) {
      return res.json({ success: false, message: 'Cannot review a cancelled appointment' })
    }

    // Check if already reviewed
    const existing = await Review.findOne({ appointmentId })
    if (existing) {
      return res.json({ success: false, message: 'You have already reviewed this appointment' })
    }

    // Save review
    await Review.create({
      doctorId: appointment.docId,
      userId,
      appointmentId,
      rating
    })

    // Recalculate doctor's average rating
    await updateDoctorRating(appointment.docId)

    res.json({ success: true, message: 'Review submitted successfully!' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get review for a specific appointment (to check if already reviewed)
const getAppointmentReview = async (req, res) => {
  try {
    const { appointmentId } = req.params
    const review = await Review.findOne({ appointmentId })
    res.json({ success: true, review })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get all reviews for a doctor
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params
    const reviews = await Review.find({ doctorId })
      .populate('userId', 'name image')
      .sort({ createdAt: -1 })
    res.json({ success: true, reviews })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { submitReview, getAppointmentReview, getDoctorReviews }

