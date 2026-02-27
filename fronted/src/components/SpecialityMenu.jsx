import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <h1 className='text-3xl font-medium'>Find By Speciality</h1>
      <p className='sm:w-1/3 text-center text-sm'>Browse through our extensive list of trusted doctors and schedule your appointment hassle-free.</p>
      <div className='flex sm:justify-center gap-6 pt-5 w-full overflow-scroll'>
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            key={index}
            to={`/doctors/${item.speciality}`}
          >
            {/* Teal circle background — icon sits on top with no filter, so it stays crisp */}
            <div className='w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-teal-500 flex items-center justify-center mb-2 shadow-md hover:bg-teal-600 transition-colors duration-300'>
              <img
                className='w-10 sm:w-14'
                src={item.image}
                alt={item.speciality}
              />
            </div>
            <p className='mt-1 text-gray-700 font-medium'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu


