import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-slate-50 via-white to-teal-50'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 md:px-10 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Company Info */}
          <div className='lg:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <h3 className='text-2xl font-bold text-gray-800'>MediConnect</h3>
            </div>
            <p className='text-sm leading-relaxed mb-4 text-gray-600'>
              Your trusted healthcare partner. We connect you with experienced doctors and make booking appointments simple, fast, and hassle-free. Quality healthcare is just a click away.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className='text-gray-800 font-bold text-lg mb-4'>Company</h4>
            <ul className='space-y-2.5'>
              <li>
                <Link to='/' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/doctors' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  All Doctors
                </Link>
              </li>
              <li>
                <Link to='/contact' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to='/my-appointments' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  My Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-gray-800 font-bold text-lg mb-4'>Quick Links</h4>
            <ul className='space-y-2.5'>
              <li>
                <Link to='/privacy-policy' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to='/terms' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to='/faq' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to='/careers' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Careers
                </Link>
              </li>
              <li>
                <Link to='/blog' className='text-gray-600 text-sm hover:text-teal-600 transition-colors duration-300 hover:translate-x-1 inline-block'>
                  Health Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className='text-gray-800 font-bold text-lg mb-4'>Get in Touch</h4>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className='text-sm text-gray-700 font-medium'>+91 7366339876</p>
                  <p className='text-xs text-gray-500'>Mon-Sat 9am-6pm</p>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className='text-sm text-gray-700 font-medium'>harshitdev@gmail.com</p>
                  <p className='text-xs text-gray-500'>24/7 Support</p>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <div className='w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg className='w-5 h-5 text-teal-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className='text-sm text-gray-700 font-medium'>Delhi, India</p>
                  <p className='text-xs text-gray-500'>Visit our office</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-teal-200 bg-white/50'>
        <div className='max-w-7xl mx-auto px-4 md:px-10 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-gray-600 text-center md:text-left'>
              Copyright 2026 © MediConnect - All Rights Reserved.
            </p>
            <div className='flex items-center gap-4'>
              <img src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' alt='Visa' className='h-6 opacity-70' />
              <img src='https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' alt='Mastercard' className='h-6 opacity-70' />
              <img src='https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' alt='PayPal' className='h-5 opacity-70' />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

