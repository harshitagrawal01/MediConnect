import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  // Function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  return (
    <div className='mt-16 mb-12 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <div className='mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
            Related Doctors
          </h2>
          <p className='text-gray-600 text-sm'>
            More trusted doctors in {speciality}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {relDoc.slice(0, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                window.scrollTo(0, 0)
              }}
              className='bg-white border border-teal-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group'
            >
              {/* Doctor Image */}
              <div className='relative bg-gradient-to-b from-teal-50 to-white overflow-hidden'>
                <img
                  className='w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300'
                  src={item.image}
                  alt={item.name}
                />

                {/* Available Badge */}
                <div className={`absolute top-3 left-3 bg-teal-500 ${item.available ? 'text-white' : 'text-gray-500'}  px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md`}>
                  <p className={`w-2 h-2 ${item.available ? 'bg-white' : 'bg-gray-500'} rounded-full animate-pulse`}></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>

                {/* Experience Badge */}
                {item.experience && (
                  <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-teal-700 px-2 py-1 rounded-full text-xs font-semibold'>
                    ★ {item.experience}
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className='p-4'>
                {/* Name */}
                <p className='text-lg font-bold text-gray-800 mb-1 truncate'>
                  {item.name}
                </p>

                {/* Specialty */}
                <p className='text-sm text-teal-600 mb-3 font-medium'>
                  {item.speciality}
                </p>

                {/* Rating */}
                <div className='flex items-center gap-2 mb-4 pb-3 border-b border-gray-100'>
                  <div className='flex text-sm'>
                    {renderStars(4.8)}
                  </div>
                  <span className='text-sm font-semibold text-gray-700'>4.8</span>
                  <span className='text-xs text-gray-500'>(120)</span>
                </div>

                {/* View Profile Button */}
                <button className='w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg'>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedDoctors
