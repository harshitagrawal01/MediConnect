import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>

        {/* Replaced assets.admin_logo with MediConnect branded text logo */}
        <div className='flex flex-col leading-tight cursor-pointer' onClick={() => aToken ? navigate('/admin-dashboard') : navigate('/doctor-dashboard')}>
          <span className='text-xl font-bold text-primary tracking-tight'>MediConnect</span>
          <span className='text-gray-400 text-[11px] font-medium tracking-wide'>Dashboard Panel</span>
        </div>

        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 ml-1'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar

