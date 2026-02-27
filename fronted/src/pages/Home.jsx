import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Testimonials from '../components/Testimonials'
//import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
        <Header />
        <SpecialityMenu />
        <TopDoctors />
        <Testimonials />
    </div>
  )
}

export default Home
