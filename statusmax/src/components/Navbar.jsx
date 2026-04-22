import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-[#25D366] font-bold text-xl font-display">
          StatusMax
        </Link>
    
        {/* Center Links */}
        <div className="flex gap-6">
          <Link to="/dashboard" 
                className="text-gray-600 hover:text-[#25D366] text-sm font-medium">
            Dashboard
          </Link>
          <Link to="/app" 
                className="text-[#25D366] border-b-2 border-[#25D366] text-sm font-medium pb-0.5">
            Video Tool
          </Link>
        </div>
    
        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" 
                className="text-gray-700 font-medium text-sm">
            Login
          </Link>
          <Link to="/login" 
                className="bg-[#25D366] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#1a9e4f] transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}