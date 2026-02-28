import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 mb-4 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Time Tracker
        </h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">{user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar