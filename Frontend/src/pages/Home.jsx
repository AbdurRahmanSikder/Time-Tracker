import Navbar from '../components/Navbar'
import TimeTable from '../components/TimeTable'
import TimeList from '../components/TimeList'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'>
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* TimeTable takes 1 column on large screens */}
          <div className='lg:col-span-1'>
            <TimeTable />
          </div>
          
          {/* TimeList takes 2 columns on large screens */}
          <div className='lg:col-span-2'>
            <TimeList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home