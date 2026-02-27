import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {

  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext)
  
  const [isEdit, setIsEdit] = useState(false)
  const [image,setImage] = useState(false)
  const navigate = useNavigate()

  // Function to trigger file input click
  const handleCameraClick = () => {
    document.getElementById('image').click()
  }

  const updateUserProfileData = async() =>{
    try {
      
      const formData = new FormData()

      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})
      if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  return userData && (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-10 px-4'>
      <div className='max-w-5xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
          <p className='text-gray-600 mt-1'>Manage your personal information</p>
        </div>

        {/* Main Profile Card */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mb-6'>
          
          {/* Cover/Header Section */}
          <div className='h-32 bg-gradient-to-r from-teal-500 to-teal-600'></div>
          
          {/* Profile Content */}
          <div className='px-8 pb-8'>
            
            {/* Profile Picture & Name */}
            <div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6'>
              
              {/* Profile Picture */}
              <div className='relative'>
                {
                  isEdit
                  ? <div className='inline-block relative'>
                      <img className='w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100 opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                      <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>
                  : <img 
                      className='w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-gray-100' 
                      src={userData.image} 
                      alt="Profile" 
                    />
                }
                
                {isEdit && (
                  <button 
                    onClick={handleCameraClick}
                    className='absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors'
                  >
                    <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Name */}
              <div className='flex-1 text-center sm:text-left'>
                {
                  isEdit
                    ? <input 
                        className='bg-gray-50 border-2 border-gray-200 focus:border-teal-500 focus:outline-none text-3xl font-bold max-w-md w-full px-4 py-2 rounded-lg transition-colors' 
                        type="text" 
                        value={userData.name} 
                        onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                      />
                    : <h2 className='text-3xl font-bold text-gray-800'>{userData.name}</h2>
                }
                <p className='text-gray-500 mt-1'>Patient ID: #12345</p>
              </div>

              {/* Edit/Save Button */}
              <div className='sm:ml-auto'>
                {
                  isEdit
                    ? <button 
                        className='bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2' 
                        onClick={updateUserProfileData}
                      >
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Information
                      </button>
                    : <button 
                        className='border-2 border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2' 
                        onClick={() => setIsEdit(true)}
                      >
                        <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                }
              </div>
            </div>

            {/* Contact Information Section */}
            <div className='mb-8'>
              <div className='flex items-center gap-2 mb-4'>
                <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className='text-lg font-bold text-gray-800'>CONTACT INFORMATION</h3>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                
                {/* Email */}
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500 font-medium'>Email Address</p>
                      <p className='text-gray-800 font-semibold'>{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500 font-medium'>Phone Number</p>
                      {
                        isEdit
                          ? <input 
                              className='bg-white border-2 border-gray-300 focus:border-teal-500 focus:outline-none w-full px-3 py-1.5 rounded-lg text-gray-800 font-semibold transition-colors' 
                              type="text" 
                              value={userData.phone} 
                              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                            />
                          : <p className='text-gray-800 font-semibold'>{userData.phone}</p>
                      }
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className='md:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <div className='flex items-start gap-3'>
                    <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500 font-medium mb-2'>Address</p>
                      {
                        isEdit
                          ? <div className='space-y-2'>
                              <input 
                                className='bg-white border-2 border-gray-300 focus:border-teal-500 focus:outline-none w-full px-3 py-2 rounded-lg transition-colors' 
                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                value={userData.address.line1}
                                type="text" 
                                placeholder='Address Line 1'
                              />
                              <input 
                                className='bg-white border-2 border-gray-300 focus:border-teal-500 focus:outline-none w-full px-3 py-2 rounded-lg transition-colors' 
                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                value={userData.address.line2}
                                type="text" 
                                placeholder='Address Line 2'
                              />
                            </div>
                          : <p className='text-gray-800 font-semibold'>
                              {userData.address.line1}
                              <br />
                              {userData.address.line2}
                            </p>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Basic Information Section */}
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className='text-lg font-bold text-gray-800'>BASIC INFORMATION</h3>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                
                {/* Gender */}
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500 font-medium mb-1'>Gender</p>
                      {
                        isEdit
                          ? <select 
                              className='bg-white border-2 border-gray-300 focus:border-teal-500 focus:outline-none w-full px-3 py-1.5 rounded-lg font-semibold transition-colors' 
                              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                              value={userData.gender}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          : <p className='text-gray-800 font-semibold'>{userData.gender}</p>
                      }
                    </div>
                  </div>
                </div>

                {/* Birthday */}
                <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-xs text-gray-500 font-medium mb-1'>Date of Birth</p>
                      {
                        isEdit
                          ? <input 
                              className='bg-white border-2 border-gray-300 focus:border-teal-500 focus:outline-none w-full px-3 py-1.5 rounded-lg font-semibold transition-colors' 
                              type="date" 
                              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                              value={userData.dob} 
                            />
                          : <p className='text-gray-800 font-semibold'>{userData.dob}</p>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className='grid md:grid-cols-3 gap-4'>
          
          <div className='bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div >
                <h4 onClick={()=>navigate('/my-appointments')} className='font-semibold text-gray-800'>My Appointments</h4>
                <p className='text-sm text-gray-500'>View all bookings</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800'>Medical Records</h4>
                <p className='text-sm text-gray-500'>View documents</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center'>
                <svg className='w-6 h-6 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800'>Settings</h4>
                <p className='text-sm text-gray-500'>Preferences</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyProfile

