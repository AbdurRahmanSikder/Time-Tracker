import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TimeTable from '../components/TimeTable'
import TimeList from '../components/TimeList'

const Home = () => {
  

  return (
    <div className='max-w-7xl mx-auto h-screen'>
      <Navbar />
      <div className='md:flex justify-center items-center gap-6 px-4'>
        <TimeTable  />
        <TimeList  />
      </div>
      {/* <Login /> */}
    </div>
  )
}

export default Home