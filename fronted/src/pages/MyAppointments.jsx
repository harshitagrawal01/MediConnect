import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { StarDisplay, StarPicker } from '../components/StarRating'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [reviewModal, setReviewModal] = useState(null)
  const [selectedRating, setSelectedRating] = useState(0)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewedIds, setReviewedIds] = useState({})
  const navigate = useNavigate()

  const parseSlotDate = (slotDate) => {
    if (!slotDate) return new Date(0)
    const parts = slotDate.toString().split(/[_\s]/)
    if (parts.length === 3) {
      const [day, month, year] = parts
      const d = new Date(Number(year), Number(month) - 1, Number(day))
      if (!isNaN(d)) return d
    }
    const fallback = new Date(slotDate)
    return isNaN(fallback) ? new Date(0) : fallback
  }

  const getStatusLabel = (item) => {
    if (item.cancelled) return { text: 'Cancelled', color: 'text-red-500' }
    if (item.isCompleted) return { text: 'Completed', color: 'text-green-500' }
    const appointmentDate = parseSlotDate(item.slotDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffMs = appointmentDate - today
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return { text: 'Today', color: 'text-teal-600' }
    if (diffDays > 0) return { text: `In ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'text-teal-600' }
    return { text: 'Completed', color: 'text-green-500' }
  }

  const isFutureAppointment = (slotDate) => {
    const appointmentDate = parseSlotDate(slotDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return appointmentDate >= today
  }

  const isCompleted = (item) => {
    return item.isCompleted || (!item.cancelled && !isFutureAppointment(item.slotDate))
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        const appts = data.appointments.reverse()
        setAppointments(appts)
        appts.forEach(async (appt) => {
          if (isCompleted(appt) && !appt.cancelled) {
            try {
              const res = await axios.get(backendUrl + `/api/review/appointment/${appt._id}`, { headers: { token } })
              if (res.data.review) {
                setReviewedIds(prev => ({ ...prev, [appt._id]: res.data.review.rating }))
              }
            } catch (e) {}
          }
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) { getUserAppointments(); navigate('/my-appointments') }
        } catch (error) { toast.error(error.message) }
      }
    }
    new window.Razorpay(options).open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
      if (data.success) initPay(data.order)
    } catch (error) { toast.error(error.message) }
  }

  const submitReview = async () => {
    if (!selectedRating) return toast.error('Please select a rating')
    setSubmittingReview(true)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/review/submit',
        { appointmentId: reviewModal.appointmentId, rating: selectedRating },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        setReviewedIds(prev => ({ ...prev, [reviewModal.appointmentId]: selectedRating }))
        setReviewModal(null)
        setSelectedRating(0)
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmittingReview(false)
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-10 px-4'>
      <div className='max-w-6xl mx-auto'>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Appointments</h1>
          <p className='text-gray-600'>Manage and track your upcoming appointments</p>
        </div>

        <div className='space-y-4'>
          {appointments.slice(0, 4).map((item, index) => (
            <div key={index} className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-teal-100'>
              <div className='grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 p-6'>

                <div className='flex justify-center lg:justify-start'>
                  <div className='relative'>
                    <img className='w-32 h-32 object-cover rounded-xl bg-gradient-to-b from-teal-50 to-white' src={item.docData.image} alt={item.name} />
                    {isFutureAppointment(item.slotDate) && !item.cancelled && !item.isCompleted && (
                      <div className='absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1'>
                        <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>Upcoming
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex-1 space-y-3'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-1'>{item.docData.name}</h3>
                    <p className='text-teal-600 font-medium'>{item.docData.speciality}</p>
                  </div>

                  <div className='grid md:grid-cols-2 gap-3'>
                    <div className='flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200'>
                      <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                        <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-xs text-gray-500 font-medium mb-1'>Location</p>
                        <p className='text-sm text-gray-800 font-semibold truncate'>{item.docData.address.line1}</p>
                        <p className='text-xs text-gray-600'>{item.docData.address.line2}</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200'>
                      <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                        <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs text-gray-500 font-medium mb-1'>Date & Time</p>
                        <p className='text-sm text-gray-800 font-semibold'>{item.slotDate}</p>
                        <p className='text-xs text-gray-600'>{item.slotTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-4 pt-2'>
                    <div className='flex items-center gap-2 text-sm'>
                      <svg className={`w-4 h-4 ${getStatusLabel(item).color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className={`font-medium ${getStatusLabel(item).color}`}>{getStatusLabel(item).text}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <svg className='w-4 h-4 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span>Appointment ID: #APT{index + 1001}</span>
                    </div>
                  </div>

                  {/* Show submitted rating */}
                  {reviewedIds[item._id] && (
                    <div className='flex items-center gap-2 pt-1'>
                      <span className='text-xs text-gray-500'>Your rating:</span>
                      <StarDisplay rating={reviewedIds[item._id]} />
                    </div>
                  )}
                </div>

                <div className='flex flex-row overflow-x-auto lg:flex-col gap-3 justify-start lg:justify-center items-center lg:items-stretch pb-1 lg:pb-0'>
                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className='sm:min-w-48 py-2 border flex-shrink-0 rounded text-stone-500 bg-teal-50'>Paid</button>
                  )}
                  {!item.cancelled && item.payment && isFutureAppointment(item.slotDate) && (
                    <button onClick={() => navigate(`/chat/${item._id}`)} className='flex-1 lg:flex-initial flex-shrink-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[160px]'>
                      <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      Chat with Doctor
                    </button>
                  )}
                  {!item.cancelled && item.payment && !item.isCompleted && isFutureAppointment(item.slotDate) && (
                    <button onClick={() => navigate(`/video/${item._id}`)} className='flex-1 lg:flex-initial flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[160px]'>
                      <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                      Video Consultation
                    </button>
                  )}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button onClick={() => appointmentRazorpay(item._id)} className='flex-1 lg:flex-initial flex-shrink-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 min-w-[160px]'>
                      <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && isFutureAppointment(item.slotDate) && (
                    <button onClick={() => cancelAppointment(item._id)} className='flex-1 lg:flex-initial flex-shrink-0 border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px]'>
                      <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Cancel
                    </button>
                  )}
                  {item.cancelled && !item.isCompleted && (
                    <button className='sm:min-w-48 py-2 border flex-shrink-0 border-red-500 rounded text-red-500'>Appointment cancelled</button>
                  )}
                  {(item.isCompleted || (!item.cancelled && !isFutureAppointment(item.slotDate))) && (
                    <button className='sm:min-w-48 py-2 border flex-shrink-0 border-green-500 rounded text-green-500'>Completed</button>
                  )}
                  {/* ✅ Rate Doctor button */}
                  {isCompleted(item) && !item.cancelled && !reviewedIds[item._id] && (
                    <button
                      onClick={() => { setReviewModal({ appointmentId: item._id, doctorName: item.docData.name }); setSelectedRating(0) }}
                      className='sm:min-w-48 py-2 flex-shrink-0 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2'
                    >
                      ⭐ Rate Doctor
                    </button>
                  )}
                </div>
              </div>

              <div className='bg-gray-50 px-6 py-3 border-t border-gray-200'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <svg className='w-4 h-4 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className='font-medium'>Consultation Fee: <span className='text-gray-800 font-bold'>{item.docData.fees}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.slice(0, 2).length === 0 && (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
            <div className='w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg className='w-12 h-12 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-2'>No Appointments Yet</h3>
            <p className='text-gray-600 mb-6'>Book your first appointment with our trusted doctors</p>
            <button onClick={() => navigate('/doctors')} className='bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl'>Find Doctors</button>
          </div>
        )}
      </div>

      {/*  Review Modal */}
      {reviewModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md'>
            <h2 className='text-xl font-bold text-gray-800 mb-1'>Rate Your Experience</h2>
            <p className='text-gray-500 text-sm mb-6'>with <span className='font-semibold text-teal-600'>{reviewModal.doctorName}</span></p>
            <div className='flex flex-col items-center gap-4 mb-8'>
              <StarPicker rating={selectedRating} setRating={setSelectedRating} />
            </div>
            <div className='flex gap-3'>
              <button onClick={() => { setReviewModal(null); setSelectedRating(0) }} className='flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-all'>Cancel</button>
              <button onClick={submitReview} disabled={!selectedRating || submittingReview} className='flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
                {submittingReview ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments
