import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { StarDisplay } from './StarRating'

const TopDoctors = () => {

  const navigate = useNavigate();
  const {doctors} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full items-stretch'>
        {doctors?.slice(0, 4).map((item, index) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className='bg-white border border-teal-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] hover:shadow-xl transition-all duration-300 group flex flex-col'
          >
            {/* Image Container */}
            <div className='relative bg-gradient-to-b from-teal-50 to-white flex-shrink-0'>
              <img
                className='w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300'
                src={item.image}
                alt={item.name}
              />

              {/* Available Badge */}
              <div className={`absolute top-3 left-3 ${item.available ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`}></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>

              {/* Experience Badge */}
              {item.experience && (
                <div className='absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-teal-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow'>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  {item.experience}
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className='p-3 sm:p-5 flex flex-col flex-grow'>
              <p className='text-gray-900 text-lg font-bold mb-1'>{item.name}</p>
              <p className='text-teal-600 text-sm font-medium mb-2'>{item.speciality}</p>

              {/* ✅ Star Rating */}
              <div className='mb-3'>
                {item.averageRating > 0 ? (
                  <StarDisplay rating={item.averageRating} totalReviews={item.totalReviews} />
                ) : (
                  <span className='text-xs text-gray-400'>No reviews yet</span>
                )}
              </div>

              {/* Next Available */}
              {item.nextSlot && (
                <div className='mb-4'>
                  <div className='flex items-center gap-2 text-xs text-slate-600 mb-1.5'>
                    <svg className="w-4 h-4 text-teal-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className='font-medium'>Next available:</span>
                  </div>
                  <div className='text-teal-700 font-semibold bg-teal-50 px-3 py-2 rounded-lg text-xs'>
                    {item.nextSlot}
                  </div>
                </div>
              )}

              <button className='mt-auto w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm'>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 10H21M8 3V6M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
        className='bg-white text-teal-600 font-semibold px-12 py-3 rounded-full mt-10 border-2 border-teal-500 hover:bg-teal-50 transition-all duration-300 shadow-md hover:shadow-lg'
      >
        View All Doctors
      </button>
    </div>
  )
}

export default TopDoctors



