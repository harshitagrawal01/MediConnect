import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { StarDisplay } from '../components/StarRating'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const [filterDoc, setFilterDoc] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    let filteredDoctors = doctors
    if (speciality) {
      filteredDoctors = filteredDoctors.filter(doc => doc.speciality === speciality)
    }
    if (searchQuery) {
      filteredDoctors = filteredDoctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilterDoc(filteredDoctors)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, searchQuery])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>All Doctors</h1>
        <p className='text-gray-600 mb-6'>Browse through the doctors specialist.</p>

        {/* Search Bar */}
        <div className='mb-8'>
          <div className='relative max-w-md'>
            <input
              type='text'
              placeholder='Search doctors by name or speciality...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full px-4 py-3 pl-12 bg-white border-2 border-teal-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-all'
            />
            <svg className='w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>
                <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex flex-col sm:flex-row items-start gap-5'>
          {/* Sidebar Filter */}
          <div className='flex flex-col gap-3 text-sm text-gray-600 min-w-[200px]'>
            {[
              'General physician',
              'Gynecologist',
              'Dermatologist',
              'Pediatricians',
              'Neurologist',
              'Gastroenterologist'
            ].map((spec) => (
              <p
                key={spec}
                onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border rounded-lg transition-all cursor-pointer hover:bg-teal-50 ${speciality === spec ? 'bg-teal-100 text-teal-700 border-teal-400 font-medium' : 'border-gray-300'}`}
              >
                {spec}
              </p>
            ))}
          </div>

          {/* Doctors Grid */}
          <div className="flex-1">
            {filterDoc.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
                {filterDoc.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="bg-white border border-teal-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group flex flex-col"
                  >
                    {/* Image area */}
                    <div className="relative bg-gradient-to-b from-teal-50 to-white overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-52 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        src={item.image}
                        alt={item.name}
                      />

                      {/* Available badge */}
                      <div className={`absolute top-3 left-3 ${item.available ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md`}>
                        <p className={`w-2 h-2 ${item.available ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`}></p>
                        <p>{item.available ? 'Available' : 'Not Available'}</p>
                      </div>

                      {/* Experience badge */}
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-teal-700 px-2 py-1 rounded-full text-xs font-semibold shadow">
                        ★ {item.experience}
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-teal-700 mb-2 font-medium">{item.speciality}</p>

                      {/*  Star Rating */}
                      <div className='mb-3'>
                        {item.averageRating > 0 ? (
                          <StarDisplay rating={item.averageRating} totalReviews={item.totalReviews} />
                        ) : (
                          <span className='text-xs text-gray-400'>No reviews yet</span>
                        )}
                      </div>

                      <button className="mt-auto w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200'>
                <svg className='w-20 h-20 text-gray-300 mx-auto mb-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className='text-2xl font-bold text-gray-700 mb-2'>No doctors found</h3>
                <p className='text-gray-500 mb-4'>Try adjusting your search or filter</p>
                {(searchQuery || speciality) && (
                  <button
                    onClick={() => { setSearchQuery(''); navigate('/doctors') }}
                    className='px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-md'
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors





