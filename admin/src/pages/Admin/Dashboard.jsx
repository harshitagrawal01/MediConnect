import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5 bg-teal-50/40 rounded-xl p-5'>

      {/* Top Stats */}
      <div className='flex flex-wrap gap-4'>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-lg border border-slate-200 cursor-pointer
                        hover:scale-105 hover:shadow-md transition-all'>
          <div className='p-2 rounded-lg bg-indigo-50'>
            <img className='w-10' src={assets.doctor_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-slate-800'>{dashData.doctors}</p>
            <p className='text-slate-500 text-sm'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-lg border border-slate-200 cursor-pointer
                        hover:scale-105 hover:shadow-md transition-all'>
          <div className='p-2 rounded-lg bg-indigo-50'>
            <img className='w-10' src={assets.appointments_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-slate-800'>{dashData.appointments}</p>
            <p className='text-slate-500 text-sm'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-white p-4 min-w-52 rounded-lg border border-slate-200 cursor-pointer
                        hover:scale-105 hover:shadow-md transition-all'>
          <div className='p-2 rounded-lg bg-indigo-50'>
            <img className='w-10' src={assets.patients_icon} alt="" />
          </div>
          <div>
            <p className='text-xl font-semibold text-slate-800'>{dashData.patients}</p>
            <p className='text-slate-500 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      {/* Latest Bookings */}
      <div className='bg-white mt-10 rounded-xl border border-slate-200 overflow-hidden'>

        <div className='flex items-center gap-2.5 px-4 py-4 bg-slate-50 border-b'>
          <div className='p-2 rounded-md bg-indigo-50'>
            <img src={assets.list_icon} alt="" />
          </div>
          <p className='font-semibold text-slate-800'>Latest Bookings</p>
        </div>

        <div>
          {
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className='flex items-center px-6 py-3 gap-3 hover:bg-teal-50 transition-colors'
              >
                <img className='rounded-full w-10' src={item.docData.image} alt="" />

                <div className='flex-1 text-sm'>
                  <p className='text-slate-800 font-medium'>{item.docData.name}</p>
                  <p className='text-slate-500'>{item.slotDate}</p>
                </div>

                {
                  item.cancelled
                    ? <p className='px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium border border-red-200'>Cancelled</p>
                    : item.isCompleted
                      ? <p className='px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium border border-green-200'>Completed</p>
                      : (
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          className='w-9 cursor-pointer opacity-70 hover:opacity-100 transition'
                          src={assets.cancel_icon}
                          alt=""
                        />
                      )
                }

              </div>
            ))
          }
        </div>

      </div>

    </div>
  )
}

export default Dashboard
