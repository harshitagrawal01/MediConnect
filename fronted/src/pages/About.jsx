import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-teal-50'>
      {/* Hero Section */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            ABOUT <span className='text-teal-600'>US</span>
          </h1>
          <div className='w-24 h-1 bg-teal-500 mx-auto'></div>
        </div>

        {/* Main Content */}
        <div className='grid md:grid-cols-2 gap-12 items-center mb-20'>
          {/* Image */}
          <div className='relative'>
            <div className='absolute inset-0 bg-teal-500 rounded-2xl transform rotate-3'></div>
            <img 
              src={assets.about_image} 
              alt='About MediConnect' 
              className='relative rounded-2xl shadow-2xl w-full h-auto'
            />
          </div>

          {/* Text Content */}
          <div>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>
              Welcome to MediConnect
            </h2>
            <p className='text-gray-600 mb-4 leading-relaxed'>
              Your trusted partner in managing your healthcare needs conveniently and efficiently. 
              At MediConnect, we understand the challenges individuals face when it comes to scheduling 
              doctor appointments and managing their health records.
            </p>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              MediConnect is committed to excellence in healthcare technology. We continuously strive 
              to enhance our platform, integrating the latest advancements to improve user experience 
              and deliver superior service. Whether you're booking your first appointment or managing 
              ongoing care, MediConnect is here to support you every step of the way.
            </p>

            {/* Vision */}
            <div className='bg-white rounded-xl p-6 border-l-4 border-teal-500 shadow-md'>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Our Vision</h3>
              <p className='text-gray-600 leading-relaxed'>
                Our vision at MediConnect is to create a seamless healthcare experience for every user. 
                We aim to bridge the gap between patients and healthcare providers, making it easier 
                for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mt-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
              WHY <span className='text-teal-600'>CHOOSE US</span>
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Discover what makes MediConnect your ideal healthcare partner
            </p>
          </div>

          {/* Benefits Grid */}
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Benefit 1 */}
            <div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-teal-100 group'>
              <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors'>
                <svg className='w-8 h-8 text-teal-600 group-hover:text-white transition-colors' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Efficiency</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Streamlined appointment scheduling that fits into your busy lifestyle.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-teal-100 group'>
              <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors'>
                <svg className='w-8 h-8 text-teal-600 group-hover:text-white transition-colors' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Convenience</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Access to a network of trusted healthcare professionals in your area.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-teal-100 group'>
              <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors'>
                <svg className='w-8 h-8 text-teal-600 group-hover:text-white transition-colors' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Personalization</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Tailored recommendations and reminders to help you stay on top of your health.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-teal-100 group'>
              <div className='w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-500 transition-colors'>
                <svg className='w-8 h-8 text-teal-600 group-hover:text-white transition-colors' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3'>Trusted Care</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                Verified doctors and secure health records for peace of mind.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section (Optional) */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-20'>
          <div className='text-center p-6 bg-white rounded-xl shadow-md'>
            <h3 className='text-4xl font-bold text-teal-600 mb-2'>500+</h3>
            <p className='text-gray-600'>Trusted Doctors</p>
          </div>
          <div className='text-center p-6 bg-white rounded-xl shadow-md'>
            <h3 className='text-4xl font-bold text-teal-600 mb-2'>10k+</h3>
            <p className='text-gray-600'>Happy Patients</p>
          </div>
          <div className='text-center p-6 bg-white rounded-xl shadow-md'>
            <h3 className='text-4xl font-bold text-teal-600 mb-2'>15k+</h3>
            <p className='text-gray-600'>Appointments</p>
          </div>
          <div className='text-center p-6 bg-white rounded-xl shadow-md'>
            <h3 className='text-4xl font-bold text-teal-600 mb-2'>4.9</h3>
            <p className='text-gray-600'>Average Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
