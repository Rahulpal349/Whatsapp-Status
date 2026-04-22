import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Video } from 'lucide-react'

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#25D366]/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-sm z-10 relative">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner shadow-green-100 mx-auto">
            <Video className="w-8 h-8 text-[#25D366]" />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Welcome Back</h1>
            <p className="text-gray-500">Log in to continue your optimization journey.</p>
          </div>
          
          <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm mb-6 outline-none">
            Login with Google
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="you@example.com" 
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-gray-700 block">Password</label>
                <a href="#" className="text-sm font-medium text-[#25D366] hover:text-[#1a9e4f]">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" placeholder="••••••••" 
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm" />
              </div>
            </div>
            
            <button className="w-full h-12 mt-2 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#1a9e4f] shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 group outline-none">
              Login with Email
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm text-gray-500">
            New to the platform? <a href="#" className="text-[#25D366] font-semibold hover:text-[#1a9e4f]">Sign up</a>
          </p>
        </div>
      </main>
    </div>
  )
}