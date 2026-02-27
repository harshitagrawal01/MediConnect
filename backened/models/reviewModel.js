import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointment',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: true })

// One review per appointment only
reviewSchema.index({ appointmentId: 1 }, { unique: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review
