import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-scroll'>
      <h1 className='text-lg font-medium text-gray-800 mb-1'>All Doctors</h1>
      <p className='text-sm text-gray-500 mb-5'>Manage and monitor all registered doctors</p>

      <div className='w-full flex flex-wrap gap-5'>
        {doctors.map((item, index) => (
          <div
            className='bg-white border border-gray-200 rounded-xl w-56 overflow-hidden cursor-pointer group flex flex-col hover:-translate-y-2 hover:shadow-xl hover:border-teal-400 transition-all duration-300'
            key={index}
          >
            {/* Image area  */}
            <div className='w-full h-52 bg-white overflow-hidden flex-shrink-0'>
              <img
                className='w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500'
                src={item.image}
                alt={item.name}
              />
            </div>

            {/* Card content */}
            <div className='p-4 flex flex-col flex-grow group-hover:bg-teal-50 transition-colors duration-300'>
              <p className='text-gray-800 text-base font-semibold line-clamp-1 group-hover:text-teal-700 transition-colors duration-300'>{item.name}</p>
              <p className='text-teal-600 text-sm font-medium mb-2'>{item.speciality}</p>
              <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  className='accent-teal-600'
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList


