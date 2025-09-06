import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TimeTable from '../components/TimeTable'
import TimeList from '../components/TimeList'
import axios from 'axios'
import Employee from '@/components/Employee'
const Home = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/timelist`);
        setTimeEntries(response.data.response);
      } catch (error) {
        console.error("Error fetching time entries:", error);
      }
    };

    fetchTimeEntries();
  }, [backendUrl]);

  return (
    <div className='max-w-7xl mx-auto'>
      <Navbar />
      <div className='md:flex justify-center items-center gap-6 px-4'>
        <TimeTable setTimeEntries={setTimeEntries} timeEntries={timeEntries} />
        <TimeList timeEntries={timeEntries} setTimeEntries={setTimeEntries} />
      </div>
      {/* <Employee /> */}
    </div>
  )
}

export default Home