import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { Filter, Download, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const historyItems = [
    { title: 'tropical_island_drone_4k.mp4', time: 'Processed 2 hours ago', orig: '1.2 GB', opt: '384 MB', savings: '-68%' },
    { title: 'wedding_b_roll_raw.mov', time: 'Processed Yesterday', orig: '450 MB', opt: '247 MB', savings: '-45%' },
    { title: 'screen_recording_tutorial.mp4', time: 'Processed Oct 24, 2023', orig: '85 MB', opt: '15 MB', savings: '-82%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Optimization History</h1>
            <p className="text-gray-500">Review and download your previously compressed media.</p>
          </div>
          <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col group hover:border-[#25D366] transition-colors shadow-sm">
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-blue-50 opacity-50"></div>
                <div className="absolute top-3 right-3 bg-[#1a9e4f] text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle className="w-3 h-3" />
                  {item.savings}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 font-display line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
                
                <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-400 mb-1 tracking-wide uppercase">Original</p>
                    <p className="text-sm font-semibold text-gray-800">{item.orig}</p>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex-1 text-right">
                    <p className="text-xs font-medium text-[#25D366] mb-1 tracking-wide uppercase">Optimized</p>
                    <p className="text-sm font-bold text-[#25D366]">{item.opt}</p>
                  </div>
                </div>
                
                <button className="w-full bg-white border border-gray-200 text-gray-700 font-medium text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-[#25D366] transition-colors">
                  <Download className="w-4 h-4" />
                  Download Video
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}