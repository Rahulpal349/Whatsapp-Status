import { Link } from 'react-router-dom'
import { useBrowserSupport } from '../hooks/useBrowserSupport'

export default function Navbar() {
  const support = useBrowserSupport()

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="text-[#25D366] font-bold text-lg sm:text-xl font-display">
            StatusMax
          </Link>
          {support?.hardwareAccelerated && (
            <span className="hidden sm:inline-block bg-green-50 text-[#25D366] text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
              ⚡ GPU Mode Active
            </span>
          )}
        </div>
    
        {/* Center Links */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full order-3 md:w-auto md:order-2">
          <Link to="/dashboard" 
                className="text-gray-600 hover:text-[#25D366] text-xs sm:text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link to="/app" 
                className="text-[#25D366] border-b-2 border-[#25D366] text-xs sm:text-sm font-medium pb-0.5">
            Video Tool
          </Link>
        </div>
    
        {/* Auth Buttons */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 order-2 md:order-3 ml-auto md:ml-0 shrink-0">
          <Link to="/login" 
                className="text-gray-700 font-medium text-xs sm:text-sm hover:text-[#25D366] transition-colors">
            Login
          </Link>
          <Link to="/login" 
                className="bg-[#25D366] text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:bg-[#1a9e4f] transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}