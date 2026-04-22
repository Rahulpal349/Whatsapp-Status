import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { Zap, Shield, FileVideo } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 font-display tracking-tight mb-6 mt-10">
          The Ultimate Client-Side <br />
          <span className="text-[#25D366]">Video Optimizer.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          StatusMax dramatically reduces video file size without compromising quality, entirely within your browser. No server uploads, total privacy.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/app" className="bg-[#25D366] text-white rounded-xl px-8 py-4 font-semibold text-lg hover:bg-[#1a9e4f] transition-colors shadow-lg shadow-green-500/20">
            Launch Video Tool
          </Link>
          <Link to="/dashboard" className="bg-white text-gray-700 border border-gray-200 rounded-xl px-8 py-4 font-semibold text-lg hover:bg-gray-50 transition-colors">
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-y border-gray-100 py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-3">Lightning Fast</h3>
            <p className="text-gray-500">Utilizing WebAssembly and FFmpeg, optimizations happen directly on your device using all local cores.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-3">100% Private</h3>
            <p className="text-gray-500">Your files never leave your device. StatusMax processes everything securely in your local browser sandbox.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileVideo className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-display mb-3">Format Mastery</h3>
            <p className="text-gray-500">Supports MP4, MOV, WebM, reducing overall footprint perfectly tailored for social media & WhatsApp.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100 text-center">
         <p className="text-gray-400 text-sm">© 2024 StatusMax. Optimistic Utility.</p>
      </footer>
    </div>
  )
}